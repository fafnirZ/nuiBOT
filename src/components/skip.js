import {servers,client} from '../config.js'

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

export default Skip;