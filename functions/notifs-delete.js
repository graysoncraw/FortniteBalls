const { deleteItem, listItems } = require('../database/notifications-db');

const deleteNotifications = async (interaction, item) => {  
  var keys = await listItems();
  console.log(keys)

  if (keys.includes(item)) {
    deleteItem(item);
    interaction.reply(`Successfully deleted ${item} from the database.`);
  } else {
    interaction.reply(`${item} does not exist within the database.`);
  }
  console.log(`${item} removed from DB`);
};

module.exports = deleteNotifications;
