var ltapp = angular.module('app', ['ngCookies', 'ui.grid', 'ui.grid.edit', 'ngAnimate', 'ui.grid.exporter', 'ui.grid.resizeColumns', 'ngRoute', 'ui.grid.selection', 'ui.grid.saveState', 'ui.grid.pagination', 'ui.grid.moveColumns', 'ui.bootstrap', 'ui.grid.grouping', 'ui.grid.autoResize', 'ui.grid.cellNav'])
function runBlock($rootScope, $route){
	/* PROTOTYPES
	*/
	Date.prototype.toYMD = function(){
		  var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
	}
}


//
ltapp.run(runBlock)
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
	$rootScope.schema.entry = '[{"name":"Agent ID","field":"AgentID","read_only":1,"required":1,"type":"text","lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"ID","field":"OwnerID","read_only":1,"required":1,"type":"text","lookup":{"object":"ventity","cols":"ID,Type","sets":"OwnerID,EntityID"}},{"name":"Entity ID","field":"EntityID","read_only":1,"required":1,"type":"text","lookup":{"object":"tentitytype","cols":"Name"}},{"name":"Actual Hours","field":"ActualHours","type":"number"},{"name":"Billable Hours","field":"BillableHours","type":"number"},{"name":"Notes","field":"Notes","type":"longtext"},{"name":"Invoice ID","field":"InvoiceID","type":"text"},{"name":"Entry Date","field":"EntryDate","type":"date", "required":1}]'
	$rootScope.schema.agent = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name","required":1},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]'
	$rootScope.schema.client = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Address Line 1","field":"AddrLine1","caption":"Address Line 1"},{"name":"Address Line 2","field":"AddrLine2","caption":"Address Line 2"},{"name":"City","field":"City","caption":"City"},{"name":"State","field":"State","caption":"State"},{"name":"Country","field":"Country","caption":"Country"},{"name":"Postal","field":"Postal","caption":"Postal"}]'
	$rootScope.schema.project = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Client ID","field":"ClientID","caption":"Client ID","required":1, "lookup":{"object":"tclient","cols":"ID,Name"}},{"name":"Product ID","field":"ProductID","caption":"Product ID","required":0, "lookup":{"object":"tproduct","cols":"ID,Name"}}]'
	$rootScope.schema.product = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Repo","field":"Repo","caption":"Repo","required":0},{"name":"Repo Owner","field":"RepoOwner","caption":"Repo Owner"}]'
	$rootScope.schema.task = '[{"name":"ID","field":"ID","required":1},{"name":"Name","field":"Name"},{"name":"Description","field":"Description","type":"longtext"},{"name":"Project ID","field":"ProjectID","caption":"Project ID","lookup":{"object":"tproject","cols":"ID,Name"}},{"name":"Agent","field":"AgentID","caption":"Agent ID","lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"Est Hours","field":"EstHours","required":0,"type":"number"},{"name":"Status ID","field":"StatusID","caption":"Status","lookup":{"object":"tstatus","cols":"ID,Name"}}]'
	$rootScope.schema.status = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Entity ID","field":"EntityID","read_only":1,"required":1,"type":"text","lookup":{"object":"tentitytype","cols":"Name"}}]'
	$rootScope.schema.period = '[{"name":"ID","field":"ID","caption":"ID","required":1},{"name":"Name","field":"Name","caption":"Name"},{"name":"Start Date","field":"StartDate","type":"date"},{"name":"End Date","field":"EndDate","type":"date"}]'
	$rootScope.schema.login = '[{"name":"Agent","field":"User","type":"cookie","lookup":{"object":"tagent","cols":"ID,Name"}}]'
	$rootScope.schema.gitcomments = '[{"name":"Agent","field":"user","type":"cookie","required":1,"lookup":{"object":"tagent","cols":"ID,Name"}},{"name":"Repo","field":"repo","required":1}]'

	$rootScope.options = []
	$rootScope.options.agent = {"object":"tagent","pk":"ID","title":"Agents"}
	$rootScope.options.entry = {"object":"tentry","title":"Entries","pk":"PK","controller":"EntryController"}
	$rootScope.options.client = {"object":"tclient","pk":"ID","title":"Clients"}
	$rootScope.options.project = {"object":"tproject","pk":"ID","title":"Projects"}
	$rootScope.options.product = {"object":"tproduct","pk":"ID","title":"Products"}
	$rootScope.options.period = {"object":"tperiod","pk":"ID","title":"Periods"}
	$rootScope.options.status = {"object":"tStatus","pk":"ID","title":"Statuses"}
	$rootScope.options.task = {"object":"ttask","pk":"ID","title":"Tasks"}
	$rootScope.options.login = {"object":"","title":"Login","controller":"LoginController"}
	$rootScope.options.gitcomments = {"object":"","title":"Git Comments","controller":"GitCommentController"}
})
