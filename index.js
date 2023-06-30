const TOKEN = process.env['TOKEN'];
const CHANNEL = process.env['CHANNEL_ID'];
const GUILD = process.env['GUILD_ID'];

const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');

const path = require('path');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  testServer: GUILD,
});

// client.on("messageCreate", (msg) => {
//   if (msg.author.bot) {
//     return; // ignore bots
//   }
//   if (msg.content == "hi") {
//     msg.reply("Hello!");
//   }
// })

client.login(TOKEN);