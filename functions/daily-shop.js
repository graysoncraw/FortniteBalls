const APIKEY = process.env['FNBR_API'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');

const getDailyShop = async (interaction) => {
  // Get shop through fnbr.co API
  try {
    const response = await axios.get('https://fnbr.co/api/shop', {
      headers: {
        'x-api-key': `${APIKEY}`,
      },
    });

    const dailyshop = response.data;
    const featuredItems = dailyshop.data.featured;

    let embedArray = [];

    for (const item of featuredItems) {
      // Initial checks in case API is incorrect in a field
      const description = item.description ? String(item.description) : 'No description available';
      const price = item.price ? String(item.price) : 'N/A';
      const rarity = item.rarity ? item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1) : 'Unknown';
      const icon = item.images && item.images.icon ? item.images.icon : '';

      const embed = new EmbedBuilder()
        .setTitle(item.name || 'Unknown Item') // Fallback for title if item.name is undefined
        .setColor('Random')
        .addFields({
          name: 'Description',
          value: description,
          inline: false,
        })
        .addFields({
          name: 'vBucks',
          value: price,
          inline: false,
        })
        .addFields({
          name: 'Rarity',
          value: rarity,
          inline: false,
        });

      if (icon) {
        embed.setThumbnail(icon);
      }

      embedArray.push(embed);
    }

    try{
      // Split embedArray into chunks of 10 or fewer
      const chunks = [];
      while (embedArray.length > 0) {
        chunks.push(embedArray.splice(0, 10));
      }

      // Send the first chunk with reply
      await interaction.reply({ embeds: chunks[0] });

      // Send the remaining chunks with followUp
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ embeds: chunks[i] });
      }
    }
    catch (error) {
      // If the "interaction" is actually a channel
      interaction.send({ embeds: embedArray });
    }
  } catch (error) {
    console.error(error);
    interaction.reply('Something failed, idk. API is probably down, or my code sucks.');
  }
};

module.exports = getDailyShop;
