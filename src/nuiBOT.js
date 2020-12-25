require('dotenv').config();

const { Client } = require('discord.js');
const ytdl = require('ytdl-core')

const client = new Client();

const PREFIX = '!';

var servers = {};



client.on('ready', ()=> {
	console.log(`${client.user.tag} has logged on`)
})

client.on('message', message => {
	if (message.author.bot) return;

	let args = message.content.substring(PREFIX.length).split(" ");
	function play(connection, message) {
		var server = servers[message.guild.id];
		const broadcast = client.voice.createBroadcast();

		server.dispatcher = broadcast.play(ytdl(server.queue[0],{filter:"audioonly"}));
		connection.play(broadcast);
		server.queue.shift();

		server.dispatcher.on("finish", ()=> {
			if(server.queue[0]) {
				console.log('continuing');
				play(connection, message);
			}else {
				console.log('disconnect');
				server.dispatcher.destroy();
				connection.disconnect();
				console.log(server.dispatcher.destroyed)
				//make sure that the dispatcher object is removed from server
				delete server.dispatcher;
				console.log(servers[message.guild.id])
				return;
			}
		})
	}

	switch(args[0]) {
		case 'play':


			if (!args[1]) {
				message.channel.send('please provide a link');
				return;
			}
			if (!message.member.voice.channelID) {
				message.channel.send('you must be in a channel first');
				return;
			}
			if (!servers[message.guild.id]) {
				servers[message.guild.id] = {queue: []}
			}

			var server = servers[message.guild.id];

			server.queue.push(args[1]);

			try{
				if (!message.guild.voice) {
					message.member.voice.channel.join().then(connection => {
						play(connection, message);
					})
					
				}
			}
			catch(err){

				console.log(err)
			}
			return;
		case 'queue':

			const queue = servers[message.guild.id]['queue'].map((x, index)=> [index, x]);
			console.log(queue)
			message.channel.send(`current queue:\n${queue.map(song => {
					return `[${song[0]}] : ${song[1]}\n`
				})}
			`) 
			return;

		
		case 'stop':
			var server = servers[message.guild.id]
			if(message.guild.voice.connection) {
				for(var i = server.queue.length-1; i >= 0; i--) {
					server.queue.splice(i, 1);
				}
				server.dispatcher.destroy();
				message.guild.voice.connection.disconnect();
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
			return;

		/*debugging commands */
		case 'server':
			var server = servers[message.guild.id];
			console.log(server);
			return;
		case 'quit':
			try {
				message.guild.voice.connection.disconnect();
				console.log('force disconnected');
			}
			catch(err) {
				console.log(err);
			}
			return;
	}

})


client.login(process.env.DISCORDJS_BOT_TOKEN);