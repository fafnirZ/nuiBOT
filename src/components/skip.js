const config = require('../config.js')

const servers = config.servers;
const client = config.client;

function Skip(message) {
	var server = servers[message.guild.id];
	try{
		server.dispatcher.end();
	}
	catch(err) {
		console.log(err);
	}
}

module.exports = Skip;