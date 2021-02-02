const servers = require('../config.js').servers

function Queue (message) {
	try {
		const queue = servers[message.guild.id]['queue'].map((x, index)=> [index, x]);
		
		if (queue.length == 0) {
			message.channel.send('queue is currently empty')
		}
		else {
			message.channel.send(`current queue:\n${queue.map(song => {
			return `[${song[0]}] : ${song[1]}\n`
			})}
			`) 	
		}

	}
	catch(err) {
		console.log(err)
		message.channel.send('and error has occured the queue may not have been created yet')
	}
}

module.exports = Queue;
