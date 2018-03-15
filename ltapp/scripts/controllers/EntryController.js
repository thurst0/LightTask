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
	// below is WIP.. re-write TODO
	// ovrd create, git COMMIT messages
	/*
	$scope.gitCommitLookup = function() {
		var parms = $scope.getParms(); // filter by any form criteria
		var url = '/api/' + $scope.options.object
		if(parms) 
			url += ('/' + JSON.stringify(parms))
		ltService.getData('/api/tproject').then(function(data){
			var url = 'https://api.github.com/repos/' //https://api.github.com/repos/thurst0/LightTask/commits
			url = url + data.owner + '/' + data.repo + '/commits'
			ltService.getData(url).then(function(data){
				$scope._gitCommitLookup(data, url)
			})
		})
	}
	$scope._gitCommitLookup = function(data, url){
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
	*/
});