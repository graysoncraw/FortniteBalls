const { remindersDB, deleteKey, listKeys } = require('../database/notifications-db');

const deleteNotifications = async (interaction, item) => {  
  var keys = listKeys();
  if (keys.includes(item)) {
    deleteKey(item);
    interaction.reply(`Successfully deleted ${item} from the database.`);
  } else {
    interaction.reply(`${item} does not exist within the database.`);
  }
  console.log(`${item} removed from DB`);
  console.log(listKeys()); // Print all keys
};

module.exports = deleteNotifications;