const APIKEY = process.env['STAT_API'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');

const getFortStats = async (interaction, username) => {
  //lookup username ID and get user stats through fortniteapi
   try {
    const userLookup = await axios.get(`https://fortniteapi.io/v1/lookup?username=${username}`, {
      headers: {
        'Authorization': `${APIKEY}`
      }
    });
    const userLookupID = userLookup.data.account_id;
    const statsLookup = await axios.get(`https://fortniteapi.io/v1/stats?account=${userLookupID}`, {
      headers: {
        'Authorization': `${APIKEY}`
      }
    });
    const statsLookupData = statsLookup.data;
    //console.log(statsLookupData);

    //create a simple clean embed for the stats
    const embed = new EmbedBuilder()
      .setTitle(statsLookupData.name)
      .setDescription(`Level ${statsLookupData.account.level.toString()}`)
      .setColor('Random')
      .addFields(
        { name: "Solo Ws", value: statsLookupData.global_stats.solo.placetop1.toString(), inline: true },
        { name: 'Solo Kills', value: statsLookupData.global_stats.solo.kills.toString(), inline: true, },
        { name: '\u200B', value: '\u200B' },
        { name: 'Duo Ws', value: statsLookupData.global_stats.duo.placetop1.toString(), inline: true },
        { name: 'Duo Kills', value: statsLookupData.global_stats.duo.kills.toString(), inline: true,  },
        { name: '\u200B', value: '\u200B' },
        { name: 'Trio Ws', value: statsLookupData.global_stats.trio.placetop1.toString(), inline: true },
        { name: 'Trio Kills', value: statsLookupData.global_stats.trio.kills.toString(), inline: true, },
        { name: '\u200B', value: '\u200B' },
        { name: 'Squad Ws', value: statsLookupData.global_stats.squad.placetop1.toString(), inline: true },
        { name: 'Squad Kills', value: statsLookupData.global_stats.squad.kills.toString(), inline: true, },
      )
    interaction.reply({ embeds: [embed] });
     
  } catch (error) {
    console.error(error);
    interaction.reply('Failed to retrieve stats. API is probably down.');
  }
};

module.exports = getFortStats;