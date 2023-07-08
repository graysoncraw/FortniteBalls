const Database = require("@replit/database");
const db = new Database();

const setReminders = async (interaction, item) => {  
  async function setKeyValue(key, value) {
    await db.set(key, value);
  };

  async function listKeys() {
    let keys = await db.list()
    return keys;
  };
  
  await setKeyValue(item, interaction.user.username.toString());
  console.log(`${item} added to DB`);
  listKeys().then((keys) => console.log(keys));
};

module.exports = setReminders;