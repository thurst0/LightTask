'use strict';
ltapp.controller('SchemaController', function SchemaController($scope, $rootScope, $http, $log, $location, $templateCache, $controller, $uibModalInstance, ltService, ui) {
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
	$scope.ui = ui
	$scope.input = {
		json: '',
		valid: true
		}
	  // TODO 
	  /*
		  load schema if found.
		  if empty pull from database.
		  option to refresh from database.
		  redo schema to do named values
	  */
	$scope.data = []

	$scope.initGrid = function() {
		$scope.columns = [{
			field: 'field',
			name: 'Field',
			enableCellEdit: true
			}, {
			field: 'type',
			name: 'Type',
			cellTemplate: '',
			editableCellTemplate: 'ui-grid/dropdownEditor',
			editDropdownOptionsArray: [{
			id: 'text',
			type: 'text'
			},{
			id: 'longtext',
			type: 'longtext'
			}, {
			id: 'boolean',
			type: 'boolean'
			}, {
			id: 'number',
			type: 'number'
			}, {
			id: 'date',
			type: 'date'
			}],
			editDropdownValueLabel: 'id'
		}, {
			field: 'read_only',
			name: 'Read Only',
			cellTemplate: '<input type="checkbox" ng-disabled="false" ng-model="row.entity.read_only" ng-true-value="1" ng-false-value="0">',
			type: "boolean"
		}, {
			field: 'caption',
			name: 'Caption',
			cellTemplate: '',
			enableCellEdit: true
		}, {
			field: 'value',
			name: 'Value',
			cellTemplate: '',
			enableCellEdit: true
		}, {
			field: 'seq',
			name: 'Sequence',
			cellTemplate: '',
			enableCellEdit: true,
			type: 'number'
		},
		/* {
			field: 'visible',
			name: 'Visible',
			cellTemplate: '<input type="checkbox" ng-disabled="false" ng-model="row.entity.visible" ng-true-value="1" ng-false-value="0">',
			enableCellEdit: true,
			type: "boolean"
		},
		*/ {
			field: 'required',
			name: 'Required',
			cellTemplate: '<input type="checkbox" ng-disabled="false" ng-model="row.entity.required" ng-true-value="1" ng-false-value="0">',
			enableCellEdit: true,
			type: "boolean"
		}];
		$scope.gridOptions = {
			showGridFooter: true,
			showColumnFooter: false,
			enableSorting: true,
			columnDefs: $scope.columns,
			enableGridMenu: true,
			enableRowSelection: true,
			multiSelect: true,
			enableSelectAll: true,
			enableHorizontalScrollbar: 2,
			enableVerticalScrollbar: 2,
			enableFiltering: true,
			enableColumnResizing: true,
			onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, function(row) {});
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				if (colDef.field == "field" && newValue != oldValue && newValue) {
				rowEntity.caption = newValue.replace(/\s/g, '');
				rowEntity.caption = newValue.replace('_', ' ')
					// capitalize first letter.  TODO split and do all words
				rowEntity.caption = rowEntity.caption.substr(0, 1).toUpperCase() + rowEntity.caption.substr(1).toLowerCase()
				}
			});
			}
		}
		$scope.gridOptions.data = $scope.data // set grid data
	}

	$scope.resequence = function() {
		var rows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
		var i = 0
		for (var row in rows) {
			console.log(row)
			rows[row].entity.seq = i
			i += 1
		}
	}
	
	$scope.addRow = function() {
		var rows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
		var len = rows.length
		$scope.data.push({
			field: 'new_field',
			caption: 'New Field',
			type: 'string',
			read_only: 1,
			//visible: 1,
			value: '',
			seq: len
		});
		$scope.gridOptions.data = $scope.data
		  //$scope.resequence()
	}
	
	// delete selected rows
	$scope.deleteRows = function() {
		var selectedRows = $scope.gridApi.selection.getSelectedRows();
		for (var row in selectedRows) {
			var entity = selectedRows[row]
			$scope.data.splice($scope.data.indexOf(entity), 1);
		}
	}
	
	// validate JSON
	$scope.validateJSON = function() {
		if (!$scope.input.json)
			return
		try {
			JSON.parse($scope.input.json)
			$scope.input.valid = "true"
			//$scope.updateGrid() // we could update grid automatically, or button
		} catch (ex) {
			$scope.input.valid = ""
			$scope.addAlert('Invalid JSON : ' + ex)
		}
	}

	// save JSON to db
	$scope.saveJSON = function(){
		if($scope.input.valid){
			ltService.updateData('/api/tschema/UIID', {UIID:$scope.ui, SchemaJSON:$scope.input.json}).then(function(data){
				if(data.data)data=data.data
				if(data && data.message && data.success == false ){
					$rootScope.addAlert(data.message)
				}else{
					// success
				}
			})
		}else{
			$scope.addAlert('Invalid JSON')
		}
	}

	// update JSON with grid row data
	$scope.updateJSON = function() {
		$scope.input.json = ''
		var rows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
		var len = rows.length,
			i = 0
		for (var row in rows) {
			delete rows[row].entity.$$hashKey // remove uneeded grid data
			if (i == 0) {
			$scope.input.json += "["
			}
			i += 1
			$scope.input.json += JSON.stringify(rows[row].entity) // to add keys rows[row].entity.field + ":" 
			if (i != len && i != 0) {
			$scope.input.json += ","
			} else if (i == len) {
			$scope.input.json += "]"
			$scope.validateJSON();
			}
		}
	}
	
	// update grid with JSON 
	$scope.updateGrid = function() {
		$scope.data = []
		var data = JSON.parse($scope.input.json)
		var len = data.length,
		i = 0
		for (var row in data) {
		$scope.data.push(data[row])
		i += 1
		if (i == len) {
			$scope.gridOptions.data = $scope.data
		}
		}
	}
	$scope.init = function(){
		var parms = {UIID:ui}
		var url = '/api/tschema/' + JSON.stringify(parms)
		ltService.getData(url).then(function(data){
			if(data.data)data=data.data
			if(data && data.message && data.success == false ){
				$rootScope.addAlert(data.message)
			}else{
				if(!data[0]){
					$rootScope.addAlert("Schema not found.")
					return;
				}
				var schemarow = data[0]
				$scope.input.json = schemarow.SchemaJSON
				$scope.updateGrid();
			//	$scope.data = JSON.parse(schemarow.SchemaJSON)
			//	$scope.gridOptions.data = $scope.data
			//	$scope.updateJSON()
			}
		})
	}

	$scope.initGrid()
	$scope.init()

});