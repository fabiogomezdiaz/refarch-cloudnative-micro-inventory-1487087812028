'use strict'
let express = require('express');
let router = express.Router();
let db = require('../config.json');
let mysql = require('mysql');
let connection = mysql.createConnection({
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});

// Get item by id
router.get('/micro/inventory/:id', function (req, res, next) {
	let query = 'select * from items where id= ' + req.params.id;
	console.log("query: " + query);

	connection.query(query, function (error, results, fields) {
		if (error) {
			console.log("error: ", error);
			res.status(500).json({code: error.code});
		} else if (results.length === 0) {
			res.status(404).json({});
		} else {
			console.log("results: ", results);
			res.status(200).json(results[0]);
		}
	});
});

// Common query code
function handle_query (query, res) {
	console.log("query: " + query);
	connection.query(query, function (error, results, fields) {
		if (error) {
			console.log("error: ", error);
			res.status(500).json({code: error.code});
		} else {
			console.log("results: ", results);
			res.status(200).json(results);
		}
	});
}

// Get all inventory
router.get('/micro/inventory', function (req, res) {
	let query = 'select * from items';
	handle_query(query, res);
});

router.get('/micro/inventory/name/:name', function (req, res, next) {
	let query = 'select * from items where name like \"%' + req.params.name + '%\"';
	handle_query(query, res);
});

router.get('/micro/inventory/price/:price', function (req, res, next) {
	let query = 'select * from items where price<= ' + req.params.price;
	handle_query(query, res);
});

module.exports = router;
