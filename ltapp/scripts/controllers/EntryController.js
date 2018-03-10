'use strict';
ltapp.controller('EntryController', function EntryController($scope, $rootScope, $http, $log, $location, $uibModal){
	//angular.extend(this, $controller('BaseController', {$scope: $scope}));
	
	// ovrd
	$scope.setDefaults = function(){
		var col = "", field = ""
		for (var input in $scope.form_data) {
			col = $scope.form_data[input]
			field = col.field
			console.log(field)
			if(field == 'AgentID' && $rootScope.user)
				col.value = $rootScope.user
		}
	}
});