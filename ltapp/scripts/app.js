var ltapp = angular.module('app', ['ngCookies', 'ui.grid', 'ui.grid.edit', 'ngAnimate', 'ui.grid.exporter', 'ui.grid.resizeColumns', 'ngRoute', 'ui.grid.selection', 'ui.grid.saveState', 'ui.grid.pagination', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.grid.grouping', 'ui.grid.autoResize', 'ui.grid.cellNav'])

// routes
ltapp.config(function($routeProvider, $logProvider){
	$routeProvider.when('/form/:object/',
	{
		title: 'Form',
		templateUrl:'templates/form.html',
		controller: 'FormController as ctrl'
	})	
});

// base controller for extends
ltapp.controller('BaseController', function BaseController($scope, $rootScope, $http, $log, $location, $uibModal) {
	$rootScope.alerts = [];
	$rootScope.addAlert = function(msg, type, timeout) {
		if (!type) {
		  type = 'danger'
		}
		if (!timeout) {
		  timeout = '4000'
		};
		$rootScope.alerts.push({
			msg: msg, type: type, timeout: timeout
		});
	};
	$rootScope.closeAlert = function(index) {
		$scope.alerts.splice(0); 
	};
	/**
	* Get the next number for a data entity no.
	* @param {string} schema - schema to use from $scope.schema object
	* @param {array} values - value ovrd
	*/
	$scope.openForm = function(schema, values) {
		var modalInstance = $uibModal.open({
			size: 'lg',
			templateUrl: 'templates/form.html',
			controller: 'FormController',
			resolve: {
				schema: function() {
				  return $rootScope.schema[schema];
				},
				options: function(){
				  return $rootScope.options[schema]
				},
				values: function(){
				  return values
				}
			}
		});
		return modalInstance.result.then(function(data) {
			console.log(data)
		}, function() { // cancel

		});
	}
	/**
	* @param {string} url - url to use in get
	* @param {array} cols - columns to return in lookup grid.  first col passed in will be returned to calling UI.
	*/
	$scope.openLookup = function(url, cols, options){ 
		var modalInstance = $uibModal.open({
			// size should be small to overlay other modal.
			templateUrl: 'templates/lookup.html',
			controller: 'LookupController',
			resolve: {
				url: function () {
				  return url;
				},
				cols: function () {
				  return cols;
				},
				options: function () {
				  return options;
				}
			}
		});
		return modalInstance.result.then(function (data) {
		  return data
		}, function () { // cancel
			
		});
	}
	// define schema and related options for implementation
	$rootScope.schema = []
	$rootScope.schema.entry = '[{"name":"ID","field":"OwnerID","read_only":1,"required":1,"lookup":{"object":"ventity","cols":"ID,Type"}},{"name":"Entity ID","field":"EntityID","read_only":1,"required":1,"lookup":{"object":"tentitytype","cols":"Name"}},{"name":"Actual Hours","field":"ActualHours"},{"name":"Billable Hours","field":"BillableHours"},{"name":"Notes","field":"Notes"},{"name":"Invoice ID","field":"Invoice ID"},{"name":"Entry Date","field":"EntryDate","type":"date"}]'
	$rootScope.schema.agent = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name","required":1},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]'
	$rootScope.schema.client = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]'
	$rootScope.schema.project = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Client ID","field":"ClientID","caption":"Client ID","required":1, "lookup":{"object":"tclient","cols":"ID,Name"}}]'
	$rootScope.schema.task = '[{"name":"ID","field":"ID","required":1},{"name":"Name","field":"Name"},{"name":"Description","field":"Description"},{"name":"Project ID","field":"ProjectID","caption":"Project ID","lookup":{"object":"tproject","cols":"ID,Name"}},{"name":"Agent","field":"AgentID","caption":"Agent ID","lookup":{"object":"tagent","cols":"ID,Name"}}]'
	$rootScope.options = []
	$rootScope.options.agent = {"object":"tagent","pk":"ID","title":"Agents"}
	$rootScope.options.entry = {"object":"tentry","title":"Entries","pk":"OwnerID","controller":"EntryController"} // TODO PK is two part actually
	$rootScope.options.client = {"object":"tclient","pk":"ID","title":"Clients"}
	$rootScope.options.project = {"object":"tproject","pk":"ID","title":"Projects"}
	$rootScope.options.task = {"object":"ttask","pk":"ID","title":"Tasks"}
})



