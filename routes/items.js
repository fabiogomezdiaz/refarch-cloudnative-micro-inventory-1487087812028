'use strict';
let express = require('express');
let router = express.Router();
let mysql = require('../lib/mysql_controller');

// Get item by id
router.get('/micro/inventory/:id', function (req, res, next) {
	mysql.get_item(req.params.id).then(function (results) {
		console.log("results: ", results);
		res.status(200).json(results);

	}).catch(function (error) {
		console.error(`error getting item ${req.params.id}: `, error);
		res.status(error.status).json((error.status === 404) ? {} : {code: error.code});
	});

});


// Get all inventory
router.get('/micro/inventory', function (req, res) {
	mysql.get_all_items().then(function (results) {
		console.log("results: ", results);
		res.status(200).json(results);

	}).catch(function (error) {
		console.error("Error getting all items: ", error);
		res.status(error.status).json({code: error.code});
	});
});

// Get items with similar name
router.get('/micro/inventory/name/:name', function (req, res, next) {
	mysql.get_by_name(req.params.name).then(function (results) {
		console.log("results: ", results);
		res.status(200).json(results);

	}).catch(function (error) {
		console.error(`error getting items with name ${req.params.name}: `, error);
		res.status(error.status).json({code: error.code});
	});
});

// Get items with price less or equal to
router.get('/micro/inventory/price/:price', function (req, res, next) {
	mysql.get_by_price(req.params.price).then(function (results) {
		console.log("results: ", results);
		res.status(200).json(results);

	}).catch(function (error) {
		console.error(`error getting items with price ${req.params.price}: `, error);
		res.status(error.status).json({code: error.code});
	});
});

module.exports = router;
