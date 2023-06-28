const TOKEN = process.env['TOKEN']
const { Client, IntentsBitField, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity({
    name: "Fortnite",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=yLt5Vw5u2YM&pp=ygUMZ3JpZGR5IGVtb3Rl",
  });
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) {
    return; // ignore bots
  }
  if (msg.content == "hi") {
    msg.reply("Hello!");
  }
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName == "hey") {
    interaction.reply("Hi there!");
  }
  if (interaction.commandName == "ping") {
    interaction.reply("pong");
  }
})

client.login(TOKEN);