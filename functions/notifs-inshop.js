const APIKEY = process.env['FNBR_API'];
const axios = require("axios");
const { listNotifications } = require('../database/notifications-db');
const LOG_PREFIX = '[notifs-inshop]';

const inshopNotifications = async (interaction) => {

  try {
    const response = await axios.get('https://fnbr.co/api/shop', {
      headers: {
        'x-api-key': `${APIKEY}`,
      },
    });

    const dailyshop = response.data;
    const featuredItems = dailyshop.data.featured;

    const notifications = await listNotifications();

    if (notifications.length === 0) {
      try {
        console.log(`${LOG_PREFIX} no notifications configured`);
        await interaction.reply('There are no notifications set');
      }
      catch (error) {
        await interaction.send('There are no notifications set');
      }
    } else {
      let itemString = '';
      let matchCount = 0;
      // Loop through each notification and compare with items in the current shop.
      for (const notification of notifications) {
        for (const item of featuredItems) {
          if (
            item.name.toLowerCase().includes(notification.item.toLowerCase()) &&
            !itemString.includes(item.name) &&
            Number.isInteger(parseInt(item.price))
          ) {
            const owner = `<@${notification.userId}>`;
            itemString += (`${owner} ${item.name} (${item.price.toString()} vBucks) is currently in the item shop!\n`);
            matchCount += 1;
          }
        }
      }
      console.log(`${LOG_PREFIX} checked ${notifications.length} notification(s), found ${matchCount} match(es)`);
      try {
        // If the interaction is an interaction
        if (itemString !== '') {
          await interaction.reply(itemString);
        }
        else {
          await interaction.reply('None of the notifications set are currently in the item shop.');
        }
      }
      catch (error) {
        // If the "interaction" is actually a channel
        if (itemString !== '') {
          await interaction.send(itemString);
        }
        else {
          await interaction.send('None of the notifications set are currently in the item shop.');
        }
      }
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} request failed`, error?.response?.data || error?.message || error);
    if (typeof interaction?.reply === 'function') {
      await interaction.reply('Something failed, idk. API is probably down, or my code sucks.');
    } else if (typeof interaction?.send === 'function') {
      await interaction.send('Something failed, idk. API is probably down, or my code sucks.');
    }
  }
};

module.exports = inshopNotifications;
