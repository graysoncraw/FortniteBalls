const CHANNEL = process.env['CHANNEL_ID'];
const CRON_TIMEZONE = process.env['CRON_TIMEZONE'] || 'America/Chicago';
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
  // Runs daily at 19:05:00 in CRON_TIMEZONE.
  const scheduledMessage = new cron.CronJob('0 5 19 * * *', async () => {
    const channel = await client.channels.fetch(CHANNEL).catch(() => null);
    if (!channel) {
      console.error(`${LOG_PREFIX} scheduled shop notification skipped: CHANNEL_ID not found (${CHANNEL})`);
      return;
    }

    console.log(`${LOG_PREFIX} running scheduled shop notification`);
    await channel.send(`Daily Shop Notifications ${new Date().toLocaleDateString()}`);
    await inshopNotifications(channel);
    console.log(`${LOG_PREFIX} scheduled shop notification completed`);
  }, null, false, CRON_TIMEZONE);
  scheduledMessage.start();
  const nextRun = scheduledMessage.nextDate().toISO();
  console.log(`${LOG_PREFIX} cron job started (daily at 19:05:00 ${CRON_TIMEZONE}, next=${nextRun})`);
};
