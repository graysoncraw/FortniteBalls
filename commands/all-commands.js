const { SlashCommandBuilder } = require('discord.js');
const getFortStats = require('../functions/fort-stats');
const getFortGifs = require('../functions/fort-gifs');
const getDailyShop = require('../functions/daily-shop');
const setReminders = require('../functions/remind-db');
const listReminders = require('../functions/remind-list');
const activeReminders = require('../functions/remind-active');
const deleteReminders = require('../functions/remind-delete');


//instantiates every command under "fb" and calls them
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fb')
    .setDescription("FortniteBalls")
    
    .addSubcommand((fortstats) => 
      fortstats.setName("stats")
      .setDescription('Displays a players fortnite stats')
      .addStringOption((option) => 
        option.setName('username')
        .setDescription('User to lookup')
        .setRequired(true)))
    
    .addSubcommand((fortgifs) => 
      fortgifs.setName("gif")
      .setDescription('Send a random fortnite gif'))
      
    .addSubcommand((fortstore) => 
      fortstore.setName("dailyshop")
      .setDescription('Sends the daily fortnite shop'))

    .addSubcommand((fortremind) => 
      fortremind.setName("remind")
      .setDescription('Set a reminder for when an item comes to the shop')
      .addStringOption((roption) => 
        roption.setName('item')
        .setDescription('Item to save')
        .setRequired(true)))

    .addSubcommandGroup((managereminders) => 
      managereminders
        .setName("managereminders")
        .setDescription('Manage reminders')
          .addSubcommand((listreminders) => 
          listreminders
            .setName("shoplist")
            .setDescription('Reminders in shop'))
          .addSubcommand((activereminders) => 
          activereminders
            .setName("active")
            .setDescription('Reminders active in database'))
          .addSubcommand((deletereminders) => 
            deletereminders
            .setName("delete")
            .setDescription('Delete reminders')
            .addStringOption((doption) => 
              doption.setName('item')
              .setDescription('Item to delete')
              .setRequired(true)))
    ),
  

  run: ({ interaction, client }) => {
    const username = interaction.options.getString('username');
    const item = interaction.options.getString('item');
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === "stats"){
      getFortStats(interaction, username);
    }
    else if (subcommand === "gif"){
      getFortGifs(interaction);
    }
    else if (subcommand === "dailyshop"){
      getDailyShop(interaction);
    }
    else if (subcommand === "remind"){
      setReminders(interaction, item);
      interaction.reply(`${item} added to reminders!`);
    }
    else if (subcommand === "shoplist"){
      listReminders(interaction);      
    }
    else if (subcommand === "active"){
      activeReminders(interaction);      
    }
    else if (subcommand === "delete"){
      deleteReminders(interaction, item);      
    }
  },
};