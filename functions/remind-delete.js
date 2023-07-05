const Database = require("@replit/database");
const db = new Database();

const deleteReminders = async (interaction, item) => {  
  
  async function deleteKey(key) {
    await db.delete(key);
  };
  
  deleteKey(item);
  interaction.reply(`Successfully deleted ${item} from the database.`);
};

module.exports = deleteReminders;