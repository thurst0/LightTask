/******************************
	
*******************************/
module.exports = function() {
	
	var module = {};
	var express = require('express');
	var http = require('http');
	var https = require('https');
	var spa = require('express-spa');
	var app = express();
	var mysql = require('mysql')
	var bodyParser = require('body-parser');
	
	// post parms
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	
	// serve any directory on any port
	module.startServer = function(dir, port) {
		app.use(express.static(dir)); // dir to serve
		var server = app.listen(port, function () {
		   var host = server.address().address
		   var port = server.address().port
		   console.log('Server listening at http://%s:%s', host, port)
		});
	}
	
	// create connection pool 
	var pool =  mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: 'LT123',
		database: 'LTApp'
	});	
  
	// get
	app.get('/api/:object/:filter?',function(req, res){
		var object = req.params.object, pk = req.params.pk;
		var clauses = "", filter = ""
		
		if (req.params.filter)
			filter = JSON.parse(req.params.filter)
		for (var parm in filter) { // build clauses based on filter parms
			clauses += ' AND ' + parm + " = '" + filter[parm] + "'"
		}

		pool.getConnection(function(err, connection){
			var query = 'SELECT * FROM ' + object + ' WHERE 1 = 1 ' + clauses
			console.log(query)
			connection.query(query, function (err, rows, fields) {
				if (err){
					res.send({ success: false, message: err.sqlMessage, error: err });
					connection.release();
					return
				}
				res.send(rows)
				connection.release();
			})
		})
	})
	
	// create
	app.post('/api/:object/',function(req, res){
		var csvFields = "", csvValues = "", i = 0, field
		var object = req.params.object;
		
		for (field in req.body) { // build fields and values csv strings for insert
			csvFields += (i == 0) ? (field) : (", " + field)
			csvValues += (i == 0) ? ("'" + req.body[field] + "'") : (", '" + req.body[field] + "'")
			i += 1
		}
		pool.getConnection(function(err, connection){
			var query = 'INSERT INTO ' + object + '(' + csvFields + ')' + ' SELECT ' + csvValues
			console.log(query)
			connection.query(query, function (err, rows, fields) {
				if (err){
					res.send({ success: false, message: err.sqlMessage, error: err });
					connection.release();
					return
				}
				res.send(rows)
				connection.release();
			})
		})
	})
	
	// update
	app.put('/api/:object/:pk',function(req, res){
		var sets = "", i = 0
		var object = req.params.object, pk = req.params.pk;

		for (field in req.body) { // build sets csv string
			console.log(field)
			console.log(i)
			if(req.body[field] != null)
				sets += (i == 0) ? (field + " = '" + req.body[field] + "'") : (", " + field + " = '" + req.body[field] + "'")
			i += 1
		}
		pool.getConnection(function(err, connection){
			// ensure we are only effecting 1 row
			connection.query('SELECT 1 FROM ' + object + ' WHERE ' + pk + ' = "' +  req.body[pk] + '"' , function (err, rows, fields) {
				console.log(rows)
				if (err){
					res.send({ success: false, message:err.sqlMessage, error: err });
					connection.release();
					return
				}else if(rows.length != 1){
					res.send({ success: false, message: 'Operation would effect mutliple rows'});
					connection.release();
					return;
				}else{ // continue
					var query = 'UPDATE ' + object + ' SET ' + sets + ' WHERE ' + pk + ' = "' +  req.body[pk] + '"'
					console.log(query)
					connection.query(query, function (err, rows, fields) {
						if (err){
							res.send({ success: false, message: err.sqlMessage, error: err });
							connection.release();
							return
						}
						res.send(rows)
						connection.release();
					})
				}
			})
		})
	})
	
	// delete 
	app.delete('/api/:object/:pk',function(req, res){
		var sets = "", i = 0
		var object = req.params.object, pk = req.params.pk;
	
		for (field in req.body) {
			console.log(field)
			console.log(i)
			sets += (i == 0) ? (field + " = '" + req.body[field] + "'") : (", " + field + " = '" + req.body[field] + "'")
			i += 1
		}
		pool.getConnection(function(err, connection){
			// ensure we are only effecting 1 row
			connection.query('SELECT 1 FROM ' + object + ' WHERE ' + pk + ' = "' +  req.body[pk] + '"' , function (err, rows, fields) {
				console.log(rows)
				if (err){
					res.send({ success: false, message:err.sqlMessage, error: err });
					connection.release();
					return
				}else if(rows.length != 1){
					res.send({ success: false, message: 'Operation would effect mutliple rows'});
					connection.release();
					return;
				}else{ // continue
					var query = 'DELETE FROM ' + object + ' WHERE ' + pk + ' = "' +  req.body[pk] + '"' 
					console.log(query)
					connection.query(query, function (err, rows, fields) {
						console.log(err)
						if (err){
							res.send({ success: false, message: err.sqlMessage, error: err });
							connection.release();
							return
						}
						res.send(rows)
						connection.release();
					})
				}
			})
		})
	})
	
	return module;
};
