'use strict';
ltapp.controller('LookupController', function LookupController($scope, $rootScope, $http, $log, $location, $templateCache, $controller, $uibModalInstance, ltService, url, cols, options) {
	console.log(url)
	$scope.cols = cols
	$scope.url = url;
	if(options && options.title)
		$scope.title = options.title
	if(options && options.data)
		$scope.data = options.data
	//----//
	//-- GRID PROPERTIES AND FUNCTIONS --//
	$scope.columns = [];
	  //{ field: 'name', name: 'Name', width:34 }

	$scope.gridOptions = {
		paginationPageSizes: [25, 50, 100, 250],
		paginationPageSize: 100,
		showGridFooter: true,
		showColumnFooter: false,
		enableSorting: true,
		columnDefs: $scope.columns,
		enableGridMenu: false,
		enableRowSelection: false,
		multiSelect: false,
		enableSelectAll: false,
		enableHorizontalScrollbar: 2,
		enableVerticalScrollbar: 2,
		enableFiltering: true,
		enableColumnResizing: true,
		onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, function(row){ 
				$uibModalInstance.close(row)
			});
		}
	};
	// Define columns
	if(!cols || !url){
	  alert("Missing parms")
	  return;
	}
	console.log(cols)
	var length = cols.length;
	var caption;
	for(var i = 0; i < length; i++){
	  console.log(cols[i])
		caption = cols[i].replace("_", " "); // swap out underscore for space.
		$scope.columns.push({ field: cols[i], enableSorting: true, displayName: caption }); // if field is passed in with a space it won't display. either trim spaces in csv function or here
	}
	//----//
	//-- FUNCTIONS --//
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	// $scope.finish = function(rows) { 
		// rows = $scope.gridApi.selection.getSelectedRows();
		// $uibModalInstance.close(rows); // close lookup and pass back selected row detail
	// };
	$scope.loadData = function() {
		if(!$scope.data){
			if(!url.includes('http')){ // in this case we are specifying full url for integration
				url = '/api/' + url
			}
			ltService.getData(url).then(function(data){
				console.log(data)
				$scope.gridOptions.data = data
			})
		}else{
			$scope.gridOptions.data = $scope.data // in this case we are supplying data for lookup
		}
	}
	$scope.loadData();
});

