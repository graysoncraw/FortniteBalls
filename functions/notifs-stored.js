const { listNotifications } = require('../database/notifications-db');
const LOG_PREFIX = '[notifs-stored]';

const storedNotifications = async (interaction) => {
  const notifications = await listNotifications();

  if (notifications.length === 0) {
    await interaction.reply('There are no notifications set');
  } else {
    let itemString = 'Current notifications set\n--------------------------\n';
    for (const notification of notifications) {
      const owner = notification.username;
      itemString += `${notification.item} - ${owner}\n`;
    }
    console.log(`${LOG_PREFIX} returned ${notifications.length} stored notification(s)`);
    await interaction.reply(itemString);
  }
};

module.exports = storedNotifications;
