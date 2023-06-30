const { SlashCommandBuilder } = require('discord.js');
const getFortGifs = require('../functions/fort-gifs');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('fortniteballs')
          .setDescription('Sends a Fortnite Gif'),
          
  run: ({ interaction, client, handler }) => {
    getFortGifs(interaction);
  },
};