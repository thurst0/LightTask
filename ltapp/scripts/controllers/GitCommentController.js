'use strict';
ltapp.controller('GitCommentController', function GitCommentController($scope, $rootScope, $http, $log, $location, $uibModal, $controller, ltService){
	angular.extend(this, $controller('BaseController', {$scope: $scope}));

	// ovrd
	$scope.clearForm = function(){
		var col = "", field = ""
		for (var input in $scope.form_data) {
			col = $scope.form_data[input]
			field = col.field
			console.log(field)
			if(field == 'user' && $rootScope.user)
				col.value = $rootScope.user
		}
	}

	// ovrd create, git COMMIT messages
	$scope.createData = function() {
		var data = {}, len = $scope.form_data.length
		var url = 'https://api.github.com/repos/' //https://api.github.com/repos/thurst0/LightTask/commits
		for (var i in $scope.form_data) {
			if($scope.form_data[i].field == 'repo'){
				data.repo = $scope.form_data[i].value
			}else if($scope.form_data[i].field == 'user'){
				data.owner = $scope.form_data[i].value
			}
			if(i == len - 1){
				url = url + data.owner + '/' + data.repo + '/commits'
				ltService.getData(url).then(function(data){
					$scope.gitCommitLookup(data, url)
				})
			}
		}
	}
	$scope.gitCommitLookup = function(data, url){
		var len = data.length
		for(var i in data)
		{
			data[i].Notes = data[i].commit.message // transform data as needed
			data[i].EntryDate = data[i].commit.committer.date 
			
			if(i == len - 1){
				$scope.openLookup('url', ["Notes","EntryDate","commit"], {title:"Git Commits", data:data}).then(function(data){
					if(!data.entity)
						return
					$scope.createEntryFromGit(data.entity)
				})
			}
		}
	}
	$scope.createEntryFromGit = function(row){
		row.EntityID = ''
		row.OwnerID = ''
		console.log(row)
		// go to entry form with selected comment
		$scope.openForm('entry', row)
		/*
		ltService.createData('/api/tentry', row).then(function(data){
			if(data.data)data=data.data
			if(data && data.message && data.success == false ){
				$rootScope.addAlert(data.message)
			}
		})
		*/
	}
});