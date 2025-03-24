require('dotenv').config();
const TOKEN = process.env.TOKEN;

const { Client: DiscordClient, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');

const path = require('path');
const keepAlive = require('./server');

const client = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

// djs-commander for setting up a clean and easy command handler
new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  //testServer: GUILD,
});

keepAlive();
client.login(TOKEN);
