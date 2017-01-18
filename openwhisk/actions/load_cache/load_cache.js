function get_all_inventory(db) {
  return new Promise(function(resolve, reject) {
    var mysql = require('mysql');
    // Uses port 3306 by default
    var connection = mysql.createConnection({
      host: db.host,
      user: db.user,
      password: db.password,
      database: db.database
    });
    console.log("querying all items from inventory db");

    connection.query('select * from items', function(error, results, fields) {
      if (error) {
        console.log("error: ", error);
        reject(error);
      } else {
        var rows = null;
        try {
          rows = JSON.parse(JSON.stringify(results));
          console.log("it worked!");
        } catch (e) {
          console.log("the error: ", e);
          rows = results;
        }
        console.log("results: \n\n");
        for (var i = rows.length - 1; i >= 0; i--) {
          console.log(rows[i]);
          console.log("\n\n");
        }

        resolve(rows);
      }
    });
  });
}

function load_rows_into_cache(rows, config) {
  var elasticsearch = require('elasticsearch');
  var client = new elasticsearch.Client({
    host: config.es_connection_string
  });

  // Using the following will make the ES query match
  // the URL path structure from API Connect
  var index = config.es_index;
  var type = config.es_doc_type;
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
          console.log("Unable to create/update item: " + row.id);
          reject(error);
        } else {
          var create_or_update = response.created ? "Created" : "Updated";
          console.log(create_or_update + " item: " + response._id);
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

function myAction(args) {
  return new Promise(function(resolve, reject) {
    var path = require('path');
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./config.json"), 'utf8'));

    get_all_inventory(config).then(function(rows) {
      console.log("Got inventory items\n\n");
      return load_rows_into_cache(rows, config);

    }).then(function(success) {
      console.log("Loaded objects into cache");
      resolve({
        success: true
      });

    }).catch(function(error) {
      console.log("error: ", error);
      reject(error);
    });
  });
}

exports.main = myAction;