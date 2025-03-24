const { insertItem } = require('../database/notifications-db');

const setNotifications = async (interaction, item) => {  
  insertItem(item, interaction.user.username.toString());
  console.log(`${item} added to DB`);
  interaction.reply(`${item} added to notifications!`);
};

module.exports = setNotifications;
