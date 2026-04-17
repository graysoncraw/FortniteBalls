const APIKEY = process.env['STAT_API'];
const axios = require('axios');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const LOG_PREFIX = '[fort-stats]';

const MODES = ['overall', 'solo', 'duo', 'squad'];

const modeLabel = (mode) => mode.charAt(0).toUpperCase() + mode.slice(1);

const safeStatValue = (statsByMode, mode, metric) => {
  const value = statsByMode?.[mode]?.[metric];
  return value === undefined || value === null ? 'N/A' : value.toString();
};

const buildModeButtons = (selectedMode, disabled = false) =>
  new ActionRowBuilder().addComponents(
    ...MODES.map((mode) =>
      new ButtonBuilder()
        .setCustomId(`stats_mode_${mode}`)
        .setLabel(modeLabel(mode))
        .setStyle(mode === selectedMode ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(disabled)
    )
  );

const buildStatsEmbed = (statsLookupData, selectedMode) => {
  const allStats = statsLookupData?.stats?.all || {};

  return new EmbedBuilder()
    .setTitle(`${statsLookupData?.account?.name ?? 'Unknown Player'} • ${modeLabel(selectedMode)}`)
    .setDescription(`Battle Pass Level ${statsLookupData?.battlePass?.level?.toString() ?? 'N/A'}`)
    .setColor(0x1f8b4c)
    .addFields(
      { name: 'Wins', value: safeStatValue(allStats, selectedMode, 'wins'), inline: true },
      { name: 'Kills', value: safeStatValue(allStats, selectedMode, 'kills'), inline: true },
      { name: 'K/D', value: safeStatValue(allStats, selectedMode, 'kd'), inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Matches', value: safeStatValue(allStats, selectedMode, 'matches'), inline: true },
      { name: 'Win %', value: safeStatValue(allStats, selectedMode, 'winRate'), inline: true },
      { name: 'Minutes Played', value: safeStatValue(allStats, selectedMode, 'minutesPlayed'), inline: true }
    )
    .setFooter({ text: 'Use buttons below to switch modes' });
};

const getFortStats = async (interaction, username, timeWindow) => {
  try {
    const normalizedTimeWindow = (timeWindow || 'lifetime').toLowerCase();
    console.log(`${LOG_PREFIX} lookup requested (username=${username}, timeWindow=${normalizedTimeWindow})`);

    const userStatsLookup = await axios.get('https://fortnite-api.com/v2/stats/br/v2', {
      headers: {
        Authorization: APIKEY,
      },
      params: {
        name: username,
        timeWindow: normalizedTimeWindow,
      },
    });

    const statsLookupData = userStatsLookup?.data?.data;

    if (!statsLookupData) {
      console.log(`${LOG_PREFIX} no stats returned (username=${username})`);
      await interaction.reply(`${username}'s profile is private or they don't exist.`);
      return;
    }
    console.log(`${LOG_PREFIX} stats retrieved (username=${statsLookupData?.account?.name || username})`);

    let selectedMode = 'overall';
    const message = await interaction.reply({
      embeds: [buildStatsEmbed(statsLookupData, selectedMode)],
      components: [buildModeButtons(selectedMode)],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000,
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        await buttonInteraction.reply({
          content: 'Only the command user can switch stat modes.',
          ephemeral: true,
        });
        return;
      }

      selectedMode = buttonInteraction.customId.replace('stats_mode_', '');

      await buttonInteraction.update({
        embeds: [buildStatsEmbed(statsLookupData, selectedMode)],
        components: [buildModeButtons(selectedMode)],
      });
    });

    collector.on('end', async () => {
      try {
        await interaction.editReply({
          components: [buildModeButtons(selectedMode, true)],
        });
      } catch (collectorError) {
        console.error(`${LOG_PREFIX} failed to disable mode buttons`, collectorError?.message || collectorError);
      }
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} request failed`, error?.response?.data || error?.message || error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp('Failed to retrieve stats.');
    } else {
      await interaction.reply('Failed to retrieve stats.');
    }
  }
};

module.exports = getFortStats;
