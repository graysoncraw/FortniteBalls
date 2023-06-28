const CLIENT_ID = process.env['CLIENT_ID']
const GUILD_ID = process.env['GUILD_ID']
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'hey',
    description: 'replies with hey!',
  },
  {
    name: 'ping',
    description: 'replies with pong',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log("registering slash commands");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    )
    console.log("slash commands success");
  }
  catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
