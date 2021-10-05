import ytdl from 'ytdl-core';
import yts from 'yt-search';
import {servers, client} from '../config.js';

//voice connections are part of a new discordjs package now
import { joinVoiceChannel } from '@discordjs/voice';


async function Play(args, message) {

	function play(connection, message) {

		var server = servers[message.guild.id];
		//const broadcast = client.voice.createBroadcast();
		//server.dispatcher = broadcast.play(ytdl(server.queue[0],{filter:"audioonly"}));
		
		const subscription = connection.subscribe(ytdl(server.queue[0],{filter:"audioonly"}))
		
		//connection.play(broadcast);
		server.queue.shift();

		



		// server.dispatcher.on("finish", ()=> {
		// 	if(server.queue[0]) {
				
		// 		message.channel.send("now playing: " + server.queue[0])
		// 		play(connection, message);
		// 	}else {
		// 		console.log('disconnect');
		// 		//server.dispatcher.end();
		// 		connection.disconnect();
		// 		//console.log(server.dispatcher.destroyed)
		// 		//make sure that the dispatcher object is removed from server
		// 		delete server.dispatcher;
		// 		console.log(servers[message.guild.id])
		// 		return;
		// 	}
		// })
	}


	if (!args[1]) {
		message.channel.send('please provide a link');
		return;
	}
	console.log(message.member.voice.channelId);
	if (!message.member.voice.channelId) {
		message.channel.send('you must be in a channel first');
		return;
	}
	if (!servers[message.guild.id]) {
		servers[message.guild.id] = {queue: []}
	}


	var server = servers[message.guild.id];


	async function getURL(args){
		const search = args.slice(1)
		
		//if only args 1 then it could be url or search key
		if (search.length == 1) {
			if(search[0].match(/https:\/\/(www.)*youtube\.com\/watch\?v\=.*/)) {
				server.queue.push(search[0]);
				return;
			}
			else {
				try {
					await yts(search[0]).then(result => server.queue.push(result.videos.slice(0,1)[0].url));
				}
				catch(err) {
					console.log(err)
					
				}
				return;
			}
		}
		else {
			const key_search = search.join(' ');
			console.log(key_search)
			try {
				await yts(key_search).then(result => server.queue.push(result.videos.slice(0,1)[0].url));
			}
			catch (err) {
				console.log(err)
			}
			return;
		}
		//check if args[1] i.e. message content is url or title of video

	}

	


	try{

		await getURL(args);

		//checks if the current client has 0 voice connections 
		//this bot only works for 1 server 

		const voice_channel_id = message.member.voice.channel.id
		const guild_id = message.member.guild.id;
		const adapterCreator = message.member.voice.guild.voiceAdapterCreator;
		const connection = joinVoiceChannel({
			channelId: voice_channel_id,
			guildId: guild_id,
			adapterCreator: adapterCreator
		})

		if(connection) {
			play(connection, message);
		}
	}
	catch(err){
		message.channel.send('an err has occured in getURL fnct')
		console.log(err)
	}

};


export default Play;