'use strict';
var mysql = require('./mysql_controller');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: process.env.es_connection_string
});

// Using the following will make the ES query match
// the URL path structure from API Connect
var index = process.env.es_index;
var type = process.env.es_doc_type;

exports.refresh_cache = function () {
	return new Promise(function(resolve, reject) {
		mysql.get_all_items().then(function(rows) {
			console.log("Got inventory items\n\n");
			return load_rows_into_cache(rows);

		}).then(function(results) {
			console.log("Loaded objects into cache");
			resolve({
				success: true
			});

		}).catch(function(error) {
			console.log("error: ", error);
			reject(error);
		});
	});
};

function load_rows_into_cache(rows) {
	var promises = [];

	// Update items in cache or create them if they don't exist
	// Create promises
	for (var i = 0; i < rows.length; i++) {
		var promise = new Promise(function(resolve, reject) {
			var row = rows[i];
			client.index({
				index: index,
				id: row.id,
				type: type,
				body: row
			}, function(error, response) {
				if (error) {
					console.log(`Unable to create/update item: ${row.id}`);
					reject(error);
				} else {
					var create_or_update = response.created ? "Created" : "Updated";
					console.log(create_or_update + " item: " + response._id);
					console.log(`${create_or_update} item: ${response._id}`);
					resolve(response);
				}
			});
		});
		promises.push(promise);
	}

	// Execute all promises in parallel
	// If one of them fails, then the whole things fails
	console.log("Loading objects into cache:");
	return Promise.all(promises);
}