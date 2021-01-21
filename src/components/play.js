const ytdl = require('ytdl-core')
const yts = require('yt-search')
const config = require('../config.js')


const servers = config.servers;
const client = config.client;




async function Play(args, message) {

	function play(connection, message) {

		var server = servers[message.guild.id];
		const broadcast = client.voice.createBroadcast();
		console.log(server)
		server.dispatcher = broadcast.play(ytdl(server.queue[0],{filter:"audioonly"}));
		connection.play(broadcast);
		server.queue.shift();

		server.dispatcher.on("finish", ()=> {
			if(server.queue[0]) {
				console.log('continuing');
				play(connection, message);
			}else {
				console.log('disconnect');
				//server.dispatcher.end();
				connection.disconnect();
				//console.log(server.dispatcher.destroyed)
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


	async function getURL(args){
		const search = args.slice(1)
		
		//if only args 1 then it could be url or search key
		if (search.length == 1) {
			console.log(search[0]);
			if(search[0].match(/https:\/\/(www.)*youtube\.com\/watch\?v\=.*/)) {
				server.queue.push(search[0]);
				return;
			}
			else {
				await yts(search[0]).then(result => server.queue.push(result.videos.slice(0,1)[0].url));
				return;
			}
		}
		else {
			const key_search = search.join(' ');
			console.log(key_search)
			await yts(key_search).then(result => server.queue.push(result.videos.slice(0,1)[0].url));
			return;
		}
		//check if args[1] i.e. message content is url or title of video

	}

	


	try{

		await getURL(args);
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