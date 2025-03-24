const { notificationsDB, setKeyValue, getKeyValue, listKeys } = require('../database/notifications-db');

const setNotifications = async (interaction, item) => {  
  setKeyValue(item, interaction.user.username.toString());
  console.log(`${item} added to DB`);
  console.log(listKeys()); // Print all keys
  console.log(getKeyValue(item));
  interaction.reply(`${item} added to notifications!`);
};

module.exports = setNotifications;
