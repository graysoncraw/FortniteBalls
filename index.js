const TOKEN = process.env['TOKEN'];
const CHANNEL = process.env['CHANNEL_ID'];
const APIKEY = process.env['TRN_API_KEY'];
const { Client, IntentsBitField, ActivityType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const cron = require('cron');
const axios = require("axios");
const getDailyShop = require('./functions/daily-shop');
const getFortGifs = require('./functions/fort-gifs');


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

//initializes bot
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity({
    name: "Fortnite",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=yLt5Vw5u2YM&pp=ygUMZ3JpZGR5IGVtb3Rl",
  });

  let scheduledMessage = new cron.CronJob('00 01 00 * * *', () => {
    console.log("success cron");
    const channel = client.channels.cache.get(CHANNEL);
    getDailyShop(channel);
  });
  scheduledMessage.start();
});

//detecting keywords
client.on("messageCreate", (msg) => {
  if (msg.author.bot) {
    return; // ignore bots
  }
  if (msg.content == "hi") {
    msg.reply("Hello!");
  }
})

//detecting slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName == "ping") {
    interaction.reply("pong");
  }
  //Get daily shop via TRN API
  if (interaction.commandName == "dailyshop") {
    getDailyShop(interaction);
  }
  if (interaction.commandName == "fortniteballs") {
    getFortGifs(interaction);
  }
})

client.login(TOKEN);

require('./register-commands');