const { insertItem } = require('../database/notifications-db');
const LOG_PREFIX = '[notifs-set]';

const setNotifications = async (interaction, item) => {
  const username = interaction.user.username.toString();
  const userId = interaction.user.id;
  const inserted = await insertItem(item, username, userId);

  if (inserted) {
    console.log(`${LOG_PREFIX} upserted notification (item=${item}, username=${username}, userId=${userId})`);
    await interaction.reply(`${item} added to notifications!`);
    return;
  }

  console.error(`${LOG_PREFIX} failed to upsert notification (item=${item}, username=${username}, userId=${userId})`);
  await interaction.reply('Failed to save notification. Please try again.');
};

module.exports = setNotifications;
