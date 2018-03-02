ltapp.factory('ltService', function($http, $rootScope, $cookies, $uibModal, $q) {
	var ltService = {};
	ltService.getData = function(url){
		var data = {}
		return $http({method:'GET', url: url, data:data, dataType:"json", headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}})
		.then(function(data){
			console.log(data)
			return data.data
		})
		/*
		.success(function(data){
			$rootScope.setBusy(false);
			return data;
		})
		.error(function(data){ // logic error
			$rootScope.setBusy(false);
			alert(data.message);
		})
		*/
	}
	
	ltService.createData = function(url, data){
		return($http({method:'POST', url: url, data: data, cache:false, dataType:"json", async:true, contentType:"application/json", headers: {'Content-Type' : 'application/json'}}))
		.then(function(data){
			console.log(data)
			return data
		})
	}
	ltService.updateData = function(url, data){
		return($http({method:'PUT', url: url, data: data, cache:false, dataType:"json", async:true, contentType:"application/json", headers: {'Content-Type' : 'application/json'}}))
		.then(function(data){
			console.log(data)
			return data
		})
	}
	ltService.deleteData = function(url, data){
		return($http({method:'DELETE', url: url, data: data, cache:false, dataType:"json", async:true, contentType:"application/json", headers: {'Content-Type' : 'application/json'}}))
		.then(function(data){
			console.log(data)
			return data
		})
	}
	
	/**
	 * Accepts a csv and returns an array.  This could be written out with csv.split(','), however this will protect against commas in quoted list values
	 * @param {string} csv - List to use
	 * @param {delimiter } [delimiter] - Allows using a list that is not comma delimited
	 */
	ltService.splitCSV = function(csv, delimiter){ 
		if(csv){
			if(!delimiter){delimiter = ","}
			for(var foo = csv.split(delimiter = delimiter || ","), x = foo.length - 1, tl; x >= 0; x--){
				if(foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
					if((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"'){
						foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
					} else if (x){
						foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(delimiter));
					} else foo = foo.shift().split(delimiter).concat(foo);
				}else foo[x].replace(/""/g, '"');
			} 
			return foo;
		}
	}
	
	/**
	* Takes a dt and converts to string for SQL use.  Or SQL string and convert to DT input format
	* @param {datetime} date
	* @param {integer} adddays - days to add to date
	*/
	ltService.formatDate = function(date, adddays, exclude_time) { 
		if(date){
			date = new Date(date) // ensure dt. 
			if(adddays){date.setDate(date.getDate() + adddays)}
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			var time = (("00" + date.getHours()).slice(-2) + ":" + 
				("00" + date.getMinutes()).slice(-2) + ":" + 
				("00" + date.getSeconds()).slice(-2))
			var retval = month + '/' + day + '/' + year
			if(!exclude_time) retval += " " + time;
			return retval;
		}
	};
	
	return ltService
})