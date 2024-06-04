const APIKEY = process.env['FNBR_API'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');

const getDailyShop = async (interaction) => {
  //get shop through fortnitetracker api
  try {
    const response = await axios.get('https://fnbr.co/api/shop', {
      headers: {
        'x-api-key': `${APIKEY}`
      }
    });
    const dailyshop = response.data;
    const dailyItems = dailyshop.shop;

    //loop through each item that is marked as daily, adding it to an array of embeds
    // let count = 0;
    // let embedArray = [];
    // for (const item of dailyItems) {
    //   if (item.section.id == "Rufus2") {
    //     const embed = new EmbedBuilder()
    //       .setTitle(item.displayName)
    //       .setColor('Random')
    //       .addFields({
    //         name: 'Description',
    //         value: item.displayDescription,
    //         inline: false,
    //       })
    //       .addFields({
    //         name: 'vBucks',
    //         value: item.price.regularPrice.toString(),
    //         inline: false,
    //       })
    //       .setThumbnail(item.displayAssets[0].url);
    //     count++;
    //     embedArray.push(embed);
    //     //console.log(embed);
    //   }
    // }

    // try {
    //   //if the interaction is an interaction
    //   interaction.reply({ embeds: embedArray });
    // }
    // catch (error) {
    //   //if the "interaction" is actually a channel
    //   interaction.send({ embeds: embedArray });
    // }
    //console.log(embedArray);
  } catch (error) {
    console.error(error);
    interaction.reply('OG Fort killed daily.');
  }
};

module.exports = getDailyShop;