const CHANNEL = process.env['CHANNEL_ID'];
const { ActivityType } = require('discord.js');
const cron = require('cron');
//const getDailyShop = require('../../functions/daily-shop');
const inshopNotifications = require('../../functions/notifs-inshop');
const LOG_PREFIX = '[ready]';

//readys up the bot on startup with a streaming link and a timer for sending the daily shop at 7:01
module.exports= (client) => {
  console.log(`${LOG_PREFIX} logged in as ${client.user.tag}`);
  client.user.setActivity({
    name: "Fortnite",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=d84t0duPrKc",
  });
  let scheduledMessage = new cron.CronJob('00 05 00 * * *', async () => {
    const channel = client.channels.cache.get(CHANNEL);
    if (!channel) {
      console.error(`${LOG_PREFIX} scheduled shop notification skipped: CHANNEL_ID not found in cache`);
      return;
    }

    console.log(`${LOG_PREFIX} running scheduled shop notification`);
    channel.send(`Daily Shop Notifications ${new Date().toLocaleDateString()}`);
    await inshopNotifications(channel);
    console.log(`${LOG_PREFIX} scheduled shop notification completed`);
  });
  scheduledMessage.start();
  console.log(`${LOG_PREFIX} cron job started (00:05:00 daily)`);
};
