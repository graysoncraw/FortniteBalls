const APIKEY = process.env['TRN_API_KEY'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const { notificationsDB, setKeyValue, getKeyValue, listKeys } = require('../database/notifications-db');

const storedNotifications = async (interaction) => {  
  
  const keys = await listKeys();

  if (keys.length === 0) {
    interaction.reply("There are no notifications set");
  } else {
    let itemString = "Current notifications set\n-----------\n";
    //loop through each item that is in the shop and compare with item in the DB
    for (const key of keys) {
      const value = await getKeyValue(key);
      itemString += `${key} - ${value}\n`;
    }
    interaction.reply(itemString);
  }
};

module.exports = storedNotifications;