const Eureka = require('eureka-js-client').Eureka;

exports.start_eureka = function () {
	// example configuration
	/*const client = new Eureka({
		// application instance information
		instance: {
			app: 'micro-service',
			hostName: 'localhost',
			ipAddr: '127.0.0.1',
			port: 3000,
			vipAddress: 'jq.test.something.com',
			dataCenterInfo: {
				name: 'MyOwn',
			},
		},
		eureka: {
			// eureka server host / port
			host: '192.168.99.100',
			port: 32768,
		},
	});
	*/

	const client = new Eureka({
		// application instance information
		instance: {
			app: 'inventory-microservice',
			hostName: 'ac51b726.ngrok.io',
			ipAddr: 'ac51b726.ngrok.io',
			port: 8080,
			vipAddress: 'testystuff.com',
			dataCenterInfo: {
				name: 'MyOwn',
			},
		},
		eureka: {
			// eureka server host / port
			host: 'netflix-eureka-fabio-case.mybluemix.net',
			port: true
		},
	});

	client.logger.level('debug');
	client.start(function(error){
		console.log(error || 'complete');
	});
};