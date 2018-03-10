'use strict';
ltapp.controller('FormController', function FormController($scope, $rootScope, $http, $log, $location, $templateCache, $controller, $uibModalInstance, ltService, schema, options, values) {
	angular.extend(this, $controller('BaseController', {$scope: $scope}));
	
	//----//
	//-- VARIABLES --//
	$scope.columns = [{ field: 'icons', name: 'I', cellTemplate: 'components/buttons.html', width:72 }]; // default columns.  we will add to this from schema
	$scope.form_data = []; // form data
	$scope.options = []; // options relating to form implementation
	$scope.values = values // default specified values for ovrd
	$scope.action = "Create"

	//----//
	//-- FUNCTIONS --//
	
	// build screen from schema
	$scope.init = function() {
		$scope.schema = JSON.parse(schema);
		$scope.options = options
		$scope.title = options.title
		if($scope.options.controller)
			angular.extend(this, $controller($scope.options.controller, {$scope: $scope}));
		if(!$scope.options.object){
			$scope.action = $scope.options.title // in the case we have no object, we want to specify action button as title
		}
		var i = 0, len = $scope.schema.length, field = ""
		for (var row in $scope.schema) { // loop schema to add form controls and grid cols
			field = $scope.schema[row].field
			if(values && values[field]){ // value ovrds
			  $scope.schema[row].value = values[field]
			}
			if($scope.schema[row].type == 'date'){ // if date type default to today's date // TODO format
				$scope.schema[row].value = new Date()
				$scope.schema[row].value.setHours(0,0,0,0)
			}
			$scope.form_data.push($scope.schema[row])
			$scope.columns.push({ // grid cols
				field: $scope.schema[row].field, enableSorting: true, displayName: $scope.schema[row].caption, enableCellEdit: !$scope.schema[row].read_only
				, visible: $scope.schema[row].visible
			});
			i += 1
			if (i == len) { // finally init grid and pull in all data
				$scope.initGrid()
				$scope.loadData(); // TODO only load top 100
				$scope.setDefaults(); // set defaults
			}
		}
	}
	
	// load data 
	$scope.loadData = function() {
		if(!$scope.options.object){
			return;
		}
		var parms = $scope.getParms(); // filter by any form criteria
		var url = '/api/' + $scope.options.object
		if(parms) 
			url += ('/' + JSON.stringify(parms))
		ltService.getData(url).then(function(data){
			if(data.data)data=data.data
			console.log(data)
			if(data && data.message && data.success == false ){
				$rootScope.addAlert(data.message)
			}else{
				$scope.gridOptions.data = data
			}
		})
	}
	
	// build base grid options
	$scope.initGrid = function() {
		$scope.gridOptions = {
		  paginationPageSizes: [25, 50, 100, 250],
		  paginationPageSize: 100,
		  showGridFooter: true,
		  showColumnFooter: false,
		  enableSorting: true,
		  columnDefs: $scope.columns,
		  enableGridMenu: true,
		  enableRowSelection: false,
		  multiSelect: false,
		  enableSelectAll: false,
		  enableHorizontalScrollbar: 2,
		  enableVerticalScrollbar: 2,
		  enableFiltering: true,
		  enableColumnResizing: true,
		  onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			// gridApi.selection.on.rowSelectionChanged($scope, function(row) {});
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				if (newValue != oldValue) { 
					ltService.updateData('/api/' + $scope.options.object + '/' + $scope.options.pk, rowEntity).then(function(data){
						if(data.data)data=data.data
						if(data && data.message && data.success == false ){
							$rootScope.addAlert(data.message)
						}else{
							$scope.loadData()
						}
					})
				}
			})
		  }
		};
	}

	// create data
	$scope.createData = function() {
		var len = $scope.form_data.length, i = 0, row = {}, field = '', col = ''
		for (var input in $scope.form_data) { // iterate inputs and build row.
			col = $scope.form_data[input]
			field = col.field
			if(col.type == 'date' && col.value){
				//row[field] = ltService.formatDate(col.value, 0, 1) // TODO fix for mysql
				row[field] =  encodeURIComponent(col.value.toYMD())
			}else{
				console.log(col.value)
				console.log(field)
				row[field] = col.value
			}
			i += 1
			if (i == len) { // push row
				ltService.createData('/api/' + $scope.options.object, row).then(function(data){
					if(data.data)data=data.data
					if(data && data.message && data.success == false ){
						$rootScope.addAlert(data.message)
					}else{
						$scope.clearForm() // TODO we need a radio defaulted to off whether to keep settings or defaults.
						$scope.loadData()
					}
				})
			}
		}
	}
	
	// delete data
	$scope.deleteRow = function(grid, row) {
		ltService.deleteData('/api/' + $scope.options.object + '/' + $scope.options.pk, row.entity).then(function(data){
			if(data.data)data=data.data
			console.log(data)
			if(data && data.message && data.success == false ){
				$rootScope.addAlert(data.message)
			}else{
				$scope.loadData();
			}
		})
	}
	
	// build & encode JSON parms from form values.
	$scope.getParms = function(){
		var len = $scope.form_data.length, i = 0, row = {}, field = '', col = ''
		for (var input in $scope.form_data) {
			col = $scope.form_data[input], field = col.field
			console.log(col)
			if(col.value){
				if(col.type == 'date'){
					//console.log(ltService.formatDate(col.value))
					//row[field] =  encodeURIComponent(ltService.formatDate(col.value, 0, 1)) // TODO format date for mysql
					row[field] =  encodeURIComponent(col.value.toYMD())
				}else{
					row[field] = encodeURIComponent(col.value)
				}
			}
			i += 1
			if (i == len) {
				return row
			}
		}
	}
	
	// clean input values
	$scope.clearForm = function(){
		var col = "", field = ""
		for (var input in $scope.form_data) {
			col = $scope.form_data[input]
			field = col.field
			col.value = ""
		}
		$scope.setDefaults()
	}
	$scope.setDefaults = function(){

	}
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	// form links
	$scope.linkRow = function(grid, row) {
		row = row.entity
		var parms = {"EntityID":$scope.options.object} // filter on this object
		var form_parms = {}, parmValue = ""
		$scope.openLookup('tEntityLink/' + JSON.stringify(parms), ["Name"], {title:"Shorcuts"}).then(function(data){
			console.log(data)
			var lkuRow = data.entity // selected link
			lkuRow.Parms = JSON.parse(lkuRow.Parms) // parse parms
			for (var parm in lkuRow.Parms) { 
				parmValue = lkuRow.Parms[parm] // parm value
				console.log(parmValue)
				console.log(parm)
				if(row[parm] || row[parm] == ""){ // if calling row has this field filled, pass it through 
					form_parms[parmValue] = row[parm]
				}else{ // otherwise just pass through the static value.
					form_parms[parmValue] = parm 
				}
				console.log(form_parms)
			}
			console.log(form_parms) // open form for the toentity, with our values.
			$scope.openForm(lkuRow.ToEntityID, form_parms)
		})
	}
	
	$scope.openFormLookup = function(input){
		var cols = ltService.splitCSV(input.lookup.cols); // cols into array
		var sets = "", set = "", col_name = "", set_name = ""
		if(input.lookup.sets) 
			sets = ltService.splitCSV(input.lookup.sets); // sets into array
		$scope.openLookup(input.lookup.object, cols).then(function(data){
			if(!data && !data.entity) return;
			
			var retval = cols[0] // first row for now
			input.value = data.entity[retval] // set input value to first row, first col
			if(sets){ // if we specified sets, then we need to match each column returned to each set. TODO clean this up
				for (var col in cols) { // should be corresponding number of sets
					col_name = cols[col] // row column returned
					set = data.entity[col_name] // value
					set_name = sets[col]
					if(set){
						for (var i in $scope.form_data) {
							if($scope.form_data[i].field == set_name){
								console.log($scope.form_data[i].field)
								console.log(set)
								$scope.form_data[i].value = set
							}
						}
					}
				}
			}
		})
		
	}
	
	$scope.init(); // initialize!
});