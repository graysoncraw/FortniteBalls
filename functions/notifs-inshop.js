const APIKEY = process.env['FNBR_API'];
const axios = require("axios");
const { listItems } = require('../database/notifications-db');

const inshopNotifications = async (interaction) => {

  try {
    const response = await axios.get('https://fnbr.co/api/shop', {
      headers: {
        'x-api-key': `${APIKEY}`,
      },
    });

    const dailyshop = response.data;
    const featuredItems = dailyshop.data.featured;

    // Get the keys from the database
    const keys = await listItems();

    if (keys.length === 0) {
      try {
        console.log("no notifs")
        interaction.reply("There are no notifications set");
      }
      catch (error) {
        console.log("error inshop")
        interaction.send("There are no notifications set");
      }
    } else {
      let itemString = "";
      // Loop through each item that is in the shop and compare with item in the DB
      for (const key of keys) {
        for (const item of featuredItems) {
          if (item.name.toLowerCase().includes(key.toLowerCase()) && !itemString.includes(key.toLowerCase())) {
            itemString += (`${item.name} (${item.price.toString()} vBucks) is currently in the item shop!\n`);
            console.log(`${key} match!`);
          }
        }
      }
      try {
        // If the interaction is an interaction
        if (itemString != "") {
          interaction.reply(itemString);
        }
        else {
          interaction.reply("None of the notifications set are currently in the item shop.");
        }
      }
      catch (error) {
        // If the "interaction" is actually a channel
        if (itemString != "") {
          interaction.send(itemString);
        }
        else {
          interaction.send("None of the notifications set are currently in the item shop.");
        }
      }
    }
  } catch (error) {
    console.error(error);
    interaction.reply('Something failed, idk. API is probably down, or my code sucks.');
  }
};

module.exports = inshopNotifications;
