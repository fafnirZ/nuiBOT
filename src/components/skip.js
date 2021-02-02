const config = require('../config.js')

const servers = config.servers;
const client = config.client;

function Skip(message) {
	try{
		var server = servers[message.guild.id];
		server.dispatcher.end();
	}
	catch(err) {
		console.log(err);
		message.channel.send('an error has occured in the skip function, make sure to request song before using skip function')
	}
}

module.exports = Skip;