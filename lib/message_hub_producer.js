/*
	- Not needed for normal operation of the app
	- Only used for testing cache reload using by producing reload_cache message
 */

var MessageHub = require('message-hub-rest');
// This check is for when running locally
var services = process.env.VCAP_SERVICES;
services = (typeof services === "string") ? JSON.parse(services) : services;
var instance = new MessageHub(services);
var topicName = process.env.mh_topic;
var message = process.env.mh_message;
var producedMessages = 1;

// Produce messages forever!
// One at random will be the right
// message to trigger a cache reload
setInterval(function() {
	var random = Math.floor(Math.random() * 10) + 1;
	var message = (random === 5) ? `${producedMessages}. ${message}` :
		`${producedMessages}. Text which will not query cache reload`;
	var list = new MessageHub.MessageList([message]);

	instance.produce(topicName, list.messages)
		.then(function() {
			console.log(`Produced ${producedMessages} messages`);
			producedMessages++;
		})
		.fail(function(error) {
			throw new Error(error);
		});

}, 1000);