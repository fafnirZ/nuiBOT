//required modules
import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

// adding intentions
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, 
              Intents.FLAGS.GUILD_MESSAGES,
              Intents.FLAGS.GUILD_VOICE_STATES
              );


const client = new Client({ intents: myIntents});
const prefix = '!';
var servers = {};

// initialise dotenv to enable env variables
dotenv.config();


export {client, prefix, servers}

