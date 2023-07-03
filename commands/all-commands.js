const { SlashCommandBuilder } = require('discord.js');
const getFortStats = require('../functions/fort-stats');
const getFortGifs = require('../functions/fort-gifs');
const getDailyShop = require('../functions/daily-shop');

//instantiates every command under "fb" and calls them
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fb')
    .setDescription("FortniteBalls")
    
    .addSubcommand((fortstats) => 
      fortstats.setName("fortstats")
      .setDescription('Displays a players fortnite stats')
      .addStringOption((option) => 
        option.setName('username')
        .setDescription('User to lookup')
        .setRequired(true)))
    
    .addSubcommand((fortgifs) => 
      fortgifs.setName("fortgifs")
      .setDescription('Send a random fortnite gif'))
      
    .addSubcommand((fortstore) => 
      fortstore.setName("fortstore")
      .setDescription('Sends the daily fortnite shop'))

    .addSubcommand((ping) => 
      ping.setName("ping")
      .setDescription('pong')),

  run: ({ interaction, client }) => {
    const username = interaction.options.getString('username');
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === "fortstats"){
      getFortStats(interaction, username);
    }
    else if (subcommand === "fortgifs"){
      getFortGifs(interaction);
    }
    else if (subcommand === "fortstore"){
      getDailyShop(interaction);
    }
    else if (subcommand === "ping"){
      interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
  },
};