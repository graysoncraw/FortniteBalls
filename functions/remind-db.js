const Database = require("@replit/database");
const db = new Database();

const setReminders = async (interaction, item) => {  
  async function setKeyValue(key, value) {
    await db.set(key, value);
  };
  
  setKeyValue(item, "item");
  listKeys().then((keys) => console.log(keys));
};

module.exports = setReminders;