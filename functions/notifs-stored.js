const { getUsername, listItems } = require('../database/notifications-db');

const storedNotifications = async (interaction) => {  
  
  const keys = await listItems();

  if (keys.length === 0) {
    interaction.reply("There are no notifications set");
  } else {
    let itemString = "Current notifications set\n--------------------------\n";
    for (const key of keys) {
      const value = await getUsername(key);
      itemString += `${key} - ${value}\n`;
    }
    console.log("Retreived stored notifs successfully")
    interaction.reply(itemString);
  }
};

module.exports = storedNotifications;
