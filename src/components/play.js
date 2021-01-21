const ytdl = require('ytdl-core')
const config = require('../config.js')

const servers = config.servers;
const client = config.client;




function Play(args, message) {

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
		//checks if the current client has 0 voice connections 
		//this bot only works for 1 server 
		if (client.voice.connections.size == 0){
			message.member.voice.channel.join().then(connection => {
				play(connection, message);
			})
			
		}
	}
	catch(err){

		console.log(err)
	}

};


module.exports = Play;