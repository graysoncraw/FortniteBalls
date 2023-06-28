const TOKEN = process.env['TOKEN'];
const CHANNEL = process.env['CHANNEL_ID'];
const APIKEY = process.env['TRN_API_KEY'];
const { Client, IntentsBitField, ActivityType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const cron = require('cron');
const axios = require("axios");

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

  let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
    console.log("success cron");
    const channel = client.channels.cache.get(CHANNEL);
    getDailyShop(channel);
  });

  scheduledMessage.start();
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) {
    return; // ignore bots
  }
  if (msg.content == "hi") {
    msg.reply("Hello!");
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName == "hey") {
    interaction.reply("Hi there!");
  }
  if (interaction.commandName == "ping") {
    interaction.reply("pong");
  }

  if (interaction.commandName == "embed") {
    const embed = new EmbedBuilder()
      .setTitle('Embed title')
      .setDescription('This is a description')
      .setColor('Random')
      .addFields({
        name: 'Field title',
        value: 'Some random value',
        inline: true,
      })
      .setThumbnail('https://i.imgur.com/AfFp7pu.png');
    interaction.reply({ embeds: [embed] });
  }

  //Get daily shop via TRN API
  if (interaction.commandName == "dailyshop") {
    getDailyShop(interaction);
  }
})

//Function to get daily shop
const getDailyShop = async (interaction) => {
  try {
    const response = await axios.get('https://api.fortnitetracker.com/v1/store/', {
      headers: {
        'TRN-API-KEY': `${APIKEY}`
      }
    });
    const dailyshop = response.data;

    let replyString = '';
    dailyshop.forEach(item => {
      if (item.storeCategory == "BRDailyStorefront") {
        replyString += item.name + '\n';
      }
    });

    interaction.reply(replyString);
  } catch (error) {
    console.error(error);
    interaction.reply('Failed to retrieve the daily shop. Please try again later.');
  }
};

client.login(TOKEN);