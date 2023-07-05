const APIKEY = process.env['TRN_API_KEY'];
const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

const listReminders = async (interaction) => {  
  
  async function listKeys() {
    let keys = await db.list()
    return keys;
  };
  
  try {
    const response = await axios.get('https://api.fortnitetracker.com/v1/store/', {
      headers: {
        'TRN-API-KEY': `${APIKEY}`
      }
    });
    const dailyshop = response.data;
    
   //get the keys from the database
    const keys = await listKeys();

    if (keys.length === 0) {
      try{
        interaction.reply("There are no reminders set");
      }
      catch(error){
        interaction.send("There are no reminders set");
      }
    } else {
      let itemString = "";
      //loop through each item that is in the shop and compare with item in the DB
      keys.forEach(function(key) {
        //console.log(key);
        dailyshop.forEach(shopItem => {
          if (shopItem.name === key){
            itemString += (`${key} is currently in the item shop!\n`);
            console.log(`${key} match!`);
          }
        });
      });
      try {
        //if the interaction is an interaction
        if (itemString != ""){
          interaction.reply(itemString);
        }
        else{
          interaction.reply("None of the reminders set are currently in the item shop.");
        }
      }
      catch (error) {
        //if the "interaction" is actually a channel
        if (itemString != ""){
          interaction.send(itemString);
        }
        else{
          interaction.send("None of the reminders set are currently in the item shop.");
        }
      }
    }
  } catch (error) {
    console.error(error);
    interaction.reply('Something failed, idk. API is probably down.');
  }  
};

module.exports = listReminders;