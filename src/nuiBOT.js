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

	switch(args[0]) {
		case 'play':
			function play(connection, message) {
				var server = servers[message.guild.id];
				
				server.dispatcher = connection.play(ytdl(server.queue[0],{filter:"audioonly"}));
				server.queue.shift();

				server.dispatcher.on("end", ()=> {
					if(server.queue[0]) {
						play(connection, message);
					}else {
						connection.disconnect();
					}
				})
			}

			if (!args[1]) {
				message.channel.send('please provide a link');
				return;
			}
			if (!message.member.voice.channelID) {
				console.log(message.member.channelID);
				message.channel.send('you must be in a channel first');
				return;
			}
			if (!servers[message.guild.id]) {
				servers[message.guild.id] = {queue: []}
			}

			var server = servers[message.guild.id];

			server.queue.push(args[1]);
			console.log(message.guild.voice)
			if (!message.guild.voice.channelID) {
				console.log('here');
				message.member.voice.channel.join().then(connection => {
					play(connection, message);
				})
				
			}
		case 'queue':

			const queue = servers[message.guild.id]['queue'].map((x, index)=> [index, x]);
			console.log(queue)
			message.channel.send(`current queue:\n${queue.map(song => {
					return `[${song[0]}] : ${song[1]}\n`
				})}
			`)
	}

})


client.login(process.env.DISCORDJS_BOT_TOKEN);