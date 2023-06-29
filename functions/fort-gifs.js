const APIKEY = process.env['TRN_API_KEY'];
const FORTAPI = process.env['FORT_GIF_API']
const axios = require("axios");
const { EmbedBuilder, MessageEmbed } = require('discord.js');

const getFortGifs = async (interaction) => {
  try {
    const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${FORTAPI}&q=fortnite&limit=200&offset=0&rating=g&lang=en&bundle=messaging_non_clips`);
    const gifsJson = response.data;
    //console.log(gifsJson);
    const imageEmbed = new EmbedBuilder()
      .setImage(gifsJson.data[Math.floor(Math.random()*50)].images.original.url);
    interaction.reply({embeds: [imageEmbed]});
  } catch (error) {
    console.error(error);
    interaction.reply('Failed to retrieve a gif. API is probably down.');
  }
};

module.exports = getFortGifs;