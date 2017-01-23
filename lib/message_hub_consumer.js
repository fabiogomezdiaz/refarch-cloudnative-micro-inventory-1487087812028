var Repeat = require('repeat');
var MessageHub = require('message-hub-rest');
var Elasticsearch = require('./elasticsearch_controller');
var topicName = process.env.mh_topic;
var message = process.env.mh_message;

// This check is for when running locally
var services = process.env.VCAP_SERVICES;
services = (typeof services === "string") ? JSON.parse(services) : services;
var instance = new MessageHub(services);

// Start consuming topic messages every second
module.exports.get_topic_messages = function () {
	instance.consume('my_consumer_group', 'my_consumer_instance', {'auto.offset.reset': 'largest'})
		.then(function (response) {
			console.log("Created consumer instance");
			var consumerInstance = response[0];
			get_messages(consumerInstance);

		})
		.fail(function (error) {
			// Message HUB Error
			console.error("Error creating consumer instance for topic", error);
			throw new Error(error);
		});
};

// Get topic messages
function get_messages(consumerInstance) {
	Repeat(function (done) {
		console.log("\n\n\nGetting messages for topic: " + topicName);
		consumerInstance.get(topicName)
			.then(function (data) {
				var valid_message = check_if_valid_message(data);
				var promise = valid_message ? Elasticsearch.refresh_cache() : Promise.resolve();

				return promise;
			})
			.then(function () {
				// Call this to be done with iteration
				done();

			})
			.fail(function (error) {
				console.error(error);
				done(error);
			});

	}).every(1000, 'ms').start.now();
}

function check_if_valid_message(data) {
	// For some reason, the received messages location in the response can vary
	var messages = Array.isArray(data) ? data : Array.isArray(data["0"]) ? data["0"] : [];
	var valid_message = false;
	console.log("messages: ", JSON.stringify(messages, null, 4));

	// Go through the messages and look for specific string
	for (var i = 0; i < messages.length; i++) {
		if (messages[i].includes(message)) {
			valid_message = true;
		}
	}
	return valid_message;
}