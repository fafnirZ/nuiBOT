require('dotenv').config();

//required modules
const { Client } = require('discord.js');


const client = new Client();
const PREFIX = '!';
var servers = {};

//exporting
exports.client = client;
exports.prefix = PREFIX;
exports.servers = servers;

