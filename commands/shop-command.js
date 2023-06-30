const { SlashCommandBuilder } = require('discord.js');
const getDailyShop = require('../functions/daily-shop');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('dailyshop')
          .setDescription('Fortnite Daily Shop'),
          
  run: ({ interaction, client, handler }) => {
    getDailyShop(interaction);
  },
};