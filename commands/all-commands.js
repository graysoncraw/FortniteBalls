const { SlashCommandBuilder } = require('discord.js');
const getFortStats = require('../functions/fort-stats');
const getFortGifs = require('../functions/fort-gifs');
const getDailyShop = require('../functions/daily-shop');
const setNotifications = require('../functions/notifs-set');
const inshopNotifications = require('../functions/notifs-inshop');
const storedNotifications = require('../functions/notifs-stored');
const deleteNotifications = require('../functions/notifs-delete');
const LOG_PREFIX = '[commands]';

// Instantiates every command under "/fb" and calls them
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
        .setRequired(true))
      .addStringOption((twoption) =>
        twoption.setName('time-window')
        .setDescription('Time Window: Lifetime or Season Stats')
        .setRequired(false)
        .addChoices(
          { name: 'Lifetime', value: 'lifetime' },
          { name: 'Season', value: 'season' }
        )
      ))
    
    .addSubcommand((fortgifs) => 
      fortgifs.setName("gif")
      .setDescription('Send a random fortnite gif'))
      
    .addSubcommand((fortstore) => 
      fortstore.setName("dailyshop")
      .setDescription('Sends the daily fortnite shop'))

    .addSubcommand((setNotif) => 
      setNotif.setName("notify")
      .setDescription('Setup a notification for when an item comes to the shop')
      .addStringOption((roption) => 
        roption.setName('item')
        .setDescription('Item to save')
        .setRequired(true)))

    .addSubcommandGroup((managenotifs) => 
      managenotifs
        .setName("managenotifs")
        .setDescription('Manage notifications')
          .addSubcommand((storednotifs) => 
            storednotifs
            .setName("shoplist")
            .setDescription('Notifications in shop'))
          .addSubcommand((inshopnotifs) => 
            inshopnotifs
            .setName("stored")
            .setDescription('Notifications stored in database'))
          .addSubcommand((deletenotif) => 
            deletenotif
            .setName("delete")
            .setDescription('Delete notification')
            .addStringOption((doption) => 
              doption.setName('item')
              .setDescription('Item to delete')
              .setRequired(true)))
    ),
  

  run: async ({ interaction, client }) => {
    const username = interaction.options.getString('username');
    const timeWindow = interaction.options.getString('time-window');
    const item = interaction.options.getString('item');
    const subcommand = interaction.options.getSubcommand();

    console.log(`${LOG_PREFIX} /fb ${subcommand} requested by ${interaction.user?.tag || interaction.user?.id}`);

    if (subcommand === 'stats') {
      await getFortStats(interaction, username, timeWindow);
    }
    else if (subcommand === 'gif') {
      await getFortGifs(interaction);
    }
    else if (subcommand === 'dailyshop') {
      await getDailyShop(interaction);
    }
    else if (subcommand === 'notify') {
      await setNotifications(interaction, item);
    }
    else if (subcommand === 'shoplist') {
      await inshopNotifications(interaction);
    }
    else if (subcommand === 'stored') {
      await storedNotifications(interaction);
    }
    else if (subcommand === 'delete') {
      await deleteNotifications(interaction, item);
    }
  },
};
