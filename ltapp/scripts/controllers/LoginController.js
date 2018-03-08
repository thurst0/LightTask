'use strict';
ltapp.controller('LoginController', function LoginController($scope, $rootScope, $http, $log, $location, $uibModal, $controller){
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

	// ovrd create
	$scope.createData = function() {
		if($scope.form_data[0].value){
			$rootScope.user = $scope.form_data[0].value // TODO - cookies
			$rootScope.addAlert("You've been logged in as " + $rootScope.user, "success")	
			$scope.cancel()
		}else{
			
		}
	}
});