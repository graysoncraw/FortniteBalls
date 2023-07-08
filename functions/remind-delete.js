const Database = require("@replit/database");
const db = new Database();

const deleteReminders = async (interaction, item) => {  

  async function listKeys() {
    let keys = await db.list()
    return keys;
  };
  
  async function deleteKey(key) {
    await db.delete(key);
  };

  const keys = await listKeys();

  if (keys.includes(item)) {
    await deleteKey(item);
    interaction.reply(`Successfully deleted ${item} from the database.`);
  } else {
    interaction.reply(`${item} does not exist within the database.`);
  }

};

module.exports = deleteReminders;