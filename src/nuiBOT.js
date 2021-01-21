//imports
const Play = require('./components/play.js')
const Stop = require('./components/stop.js')
const Queue = require('./components/queue.js')
const config = require('./config.js')


const client = config.client;
const servers = config.servers;
const PREFIX = config.prefix;


client.login(process.env.DISCORDJS_BOT_TOKEN);


client.on('ready', ()=> {
	console.log(`${client.user.tag} has logged on`)
})

client.on('message', message => {
	if (message.author.bot) return;

	let args = message.content.substring(PREFIX.length).split(" ");


	switch(args[0]) {
		case 'play':
			Play(args, message);
			return;
		case 'queue':
			Queue(message);
			return;
		
		case 'stop':
			Stop(message);
			return;

		/*debugging commands */
		case 'server':
			var server = servers[message.guild.id];
			console.log(server);
			return;
		case 'quit':
			var server = servers[message.guild.id];
			try {
				server.dispatcher.destroy();
				delete server.dispatcher;
				message.guild.voice.connection.disconnect();
				console.log('force disconnected');
			}
			catch(err) {
				console.log('the bot is not running');
				console.log(err);
			}
			return;

		case 'client':
			console.log(client.voice);
		/*
		case 'OP':
			let admin = message.guild.roles.cache.find(role => role.name === 'Visible');
			message.member.roles.add(admin);
			console.log(message.member);
		*/

	}

})

