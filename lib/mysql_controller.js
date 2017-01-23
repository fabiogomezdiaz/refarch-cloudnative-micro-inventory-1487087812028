'use strict';
let mysql = require('mysql');

function create_connection() {
	return mysql.createConnection({
		host: process.env.db_host,
		user: process.env.db_user,
		password: process.env.db_password,
		database: process.env.db_database
	});
}

// Get item by id
module.exports.get_item = function (id) {
	return new Promise(function (resolve, reject) {
		let connection = create_connection();
		let query = 'select * from items where id= ' + id;
		console.log("query: " + query);

		connection.query(query, function (error, results, fields) {
			// End connection
			connection.end();

			if (error) {
				reject({
					status: 500,
					code: error.code
				});
			} else if (results.length === 0) {
				reject({
					status: 404
				});
			} else {
				resolve(results[0]);
			}
		});
	});

};

// Common query code
function handle_query(query) {
	return new Promise(function (resolve, reject) {
		let connection = create_connection();
		console.log("query: " + query);
		connection.query(query, function (error, results, fields) {
			// End connection
			connection.end();

			if (error) {
				reject({
					status: 500,
					code: error.code
				});
			} else {
				resolve(results);
			}
		});
	});
}

// Get all inventory
module.exports.get_all_items = function () {
	let query = 'select * from items';
	return handle_query(query);
};

// Get by name or similar name
module.exports.get_by_name = function (name) {
	let query = 'select * from items where name like \"%' + name + '%\"';
	return handle_query(query);
};

// Get by price less or equal
module.exports.get_by_price = function (price) {
	let query = 'select * from items where price<= ' + price;
	return handle_query(query);
};