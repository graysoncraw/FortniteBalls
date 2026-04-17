const FORTAPI = process.env['FORT_GIF_API'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const LOG_PREFIX = '[fort-gifs]';

const getFortGifs = async (interaction) => {
  //get fortnite gifs through giphy api
  try {
    const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${FORTAPI}&q=fortnite&limit=200&offset=0&rating=g&lang=en&bundle=messaging_non_clips`);
    const gifsJson = response.data;
    const gifIndex = Math.floor(Math.random() * 50);
    const imageEmbed = new EmbedBuilder()
      //get a random gif through Math.random
      .setImage(gifsJson.data[gifIndex].images.original.url);
    await interaction.reply({ embeds: [imageEmbed] });
    console.log(`${LOG_PREFIX} sent gif (index=${gifIndex})`);
  } catch (error) {
    console.error(`${LOG_PREFIX} request failed`, error?.response?.data || error?.message || error);
    await interaction.reply('Failed to retrieve a gif. API is probably down.');
  }
};

module.exports = getFortGifs;
