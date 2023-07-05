const APIKEY = process.env['TRN_API_KEY'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');

const getDailyShop = async (interaction) => {
  //get shop through fortnitetracker api
  try {
    const response = await axios.get('https://api.fortnitetracker.com/v1/store/', {
      headers: {
        'TRN-API-KEY': `${APIKEY}`
      }
    });
    const dailyshop = response.data;

    //loop through each item that is marked as daily, adding it to an array of embeds
    let embedArray = [];
    dailyshop.forEach(item => {
      if (item.storeCategory == "BRDailyStorefront") {
        const embed = new EmbedBuilder()
          .setTitle(item.name)
          .setColor('Random')
          .addFields({
            name: 'vBucks',
            value: item.vBucks.toString(),
            inline: true,
          })
          .addFields({
            name: 'Rarity',
            value: item.rarity,
            inline: true,
          })
          .setThumbnail(item.imageUrl);
        embedArray.push(embed);
        //console.log(embed);
      }
    });

    try {
      //if the interaction is an interaction
      interaction.reply({ embeds: embedArray });
    }
    catch (error) {
      //if the "interaction" is actually a channel
      interaction.send({ embeds: embedArray });
    }
    //console.log(embedArray);
  } catch (error) {
    console.error(error);
    interaction.reply('Failed to retrieve the daily shop. API is probably down.');
  }
};

module.exports = getDailyShop;