const APIKEY = process.env['TRN_API_KEY'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

const activeReminders = async (interaction) => {  
  
  async function listKeys() {
    let keys = await db.list()
    return keys;
  };
  
  async function getKeyValue(key) {
    let value = await db.get(key);
    return value;
  };
  
  const keys = await listKeys();

  if (keys.length === 0) {
    interaction.reply("There are no reminders set");
  } else {
    let itemString = "Current reminders set\n-----------\n";
    //loop through each item that is in the shop and compare with item in the DB
    for (const key of keys) {
      const value = await getKeyValue(key);
      itemString += `${key} - ${value}\n`;
    }
    interaction.reply(itemString);
  }
};

module.exports = activeReminders;