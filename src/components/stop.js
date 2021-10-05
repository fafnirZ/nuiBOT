import {servers} from '../config.js';

function Stop(message) {
	try {
		var server = servers[message.guild.id]
		if(message.guild.voice.connection) {
			for(var i = server.queue.length-1; i >= 0; i--) {
				server.queue.splice(i, 1);
			}
			server.dispatcher.destroy();
			message.guild.voice.connection.disconnect();

			delete server.dispatcher
			console.log('stopped playing');
		}else {
			try{
				for(var i = server.queue.length-1; i >= 0; i--) {
					server.queue.splice(i, 1);
				}
			}
			catch(err) {
				console.log(err);
			}
		}
	}
	catch(err) {
		console.log(err);
		message.channel.send('an err has occured, make sure you have requested a song before you use the stop function')
	}


}

export default Stop