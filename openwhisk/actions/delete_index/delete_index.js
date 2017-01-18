function myAction(args) {
  return new Promise(function(resolve, reject) {
    var path = require('path');
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./config.json"), 'utf8'));

    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
      host: config.es_connection_string
    });

    // Create index
    console.log("Deleting index: " + config.es_index);
    client.indices.delete({
      index: config.es_index

    }, function(error, response) {
      if (error) {
        console.log("Error: " + JSON.stringify(error, null, 2));
        reject(error);
      } else {
        console.log("Response: " + JSON.stringify(response, null, 2));
        resolve({
          success: true
        });
      }
    });
  });
}

exports.main = myAction;