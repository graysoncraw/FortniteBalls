const { deleteItem, listItems } = require('../database/notifications-db');
const LOG_PREFIX = '[notifs-delete]';

const deleteNotifications = async (interaction, item) => {
  const keys = await listItems();

  if (keys.includes(item)) {
    const deleted = await deleteItem(item);
    if (deleted) {
      console.log(`${LOG_PREFIX} deleted notification (item=${item})`);
      await interaction.reply(`Successfully deleted ${item} from the database.`);
    } else {
      console.error(`${LOG_PREFIX} delete failed (item=${item})`);
      await interaction.reply(`Failed to delete ${item}. Please try again.`);
    }
  } else {
    await interaction.reply(`${item} does not exist within the database (check your casing).`);
  }
};

module.exports = deleteNotifications;
