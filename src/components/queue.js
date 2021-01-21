const servers = require('../config.js').servers

function Queue (message) {
	const queue = servers[message.guild.id]['queue'].map((x, index)=> [index, x]);
	console.log(queue)
	message.channel.send(`current queue:\n${queue.map(song => {
			return `[${song[0]}] : ${song[1]}\n`
		})}
	`) 	
}

module.exports = Queue;
