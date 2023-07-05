const CHANNEL = process.env['CHANNEL_ID'];
const { ActivityType } = require('discord.js');
const cron = require('cron');
const getDailyShop = require('../../functions/daily-shop');
const listReminders = require('../../functions/remind-list');

//readys up the bot on startup with a streaming link and a timer for sending the daily shop at 7:01
module.exports= (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity({
    name: "Fortnite",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=yLt5Vw5u2YM&pp=ygUMZ3JpZGR5IGVtb3Rl",
  });
  let scheduledMessage = new cron.CronJob('00 01 00 * * *', () => {
    const channel = client.channels.cache.get(CHANNEL);
    channel.send(`Item shop for ${new Date().toLocaleDateString()}`);
    getDailyShop(channel);
    listReminders(channel);
    console.log("Daily Shop Success");
  });
  scheduledMessage.start();
};