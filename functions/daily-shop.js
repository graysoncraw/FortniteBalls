const APIKEY = process.env['FNBR_API'];
const axios = require('axios');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');
const LOG_PREFIX = '[daily-shop]';

const ITEMS_PER_RANGE = 25;

const toTitleCase = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';

const truncate = (value, max) =>
  value && value.length > max ? `${value.slice(0, max - 3)}...` : value;

const getRangeStart = (index) => Math.floor(index / ITEMS_PER_RANGE) * ITEMS_PER_RANGE;

const buildItemEmbed = (items, selectedIndex) => {
  if (!items.length) {
    return new EmbedBuilder()
      .setTitle('Fortnite Daily Shop')
      .setDescription('No shop items found.')
      .setColor(0x1f8b4c)
      .setFooter({ text: 'Shop is currently empty' });
  }

  const item = items[selectedIndex];
  const name = item?.name || 'Unknown Item';
  const description = item?.description ? String(item.description) : 'No description available.';
  const price = item?.price ? `${item.price} vBucks` : 'N/A';
  const rarity = toTitleCase(item?.rarity);
  const imageUrl = item?.images?.featured || item?.images?.icon || null;

  const embed = new EmbedBuilder()
    .setTitle(name)
    .setDescription(truncate(description, 1000))
    .setColor(0x1f8b4c)
    .addFields(
      { name: 'Price', value: price, inline: true },
      { name: 'Rarity', value: rarity, inline: true },
      { name: '\u200B', value: '\u200B', inline: true }
    )
    .setFooter({ text: `Item ${selectedIndex + 1}/${items.length}` });

  if (imageUrl) {
    embed.setThumbnail(imageUrl);
  }

  return embed;
};

const buildControls = (items, selectedIndex, disabled = false) => {
  if (!items.length) return [];

  const totalRanges = Math.ceil(items.length / ITEMS_PER_RANGE);
  const rangeStart = getRangeStart(selectedIndex);
  const rangeEnd = Math.min(rangeStart + ITEMS_PER_RANGE, items.length);

  const navRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('shop_prev_item')
      .setLabel('Prev Item')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || selectedIndex === 0),
    new ButtonBuilder()
      .setCustomId('shop_next_item')
      .setLabel('Next Item')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || selectedIndex >= items.length - 1)
  );

  const rangeSelect = new StringSelectMenuBuilder()
    .setCustomId('shop_pick_range')
    .setPlaceholder('Jump to item range')
    .setDisabled(disabled)
    .addOptions(
      Array.from({ length: totalRanges }, (_, i) => {
        const start = i * ITEMS_PER_RANGE;
        const end = Math.min(start + ITEMS_PER_RANGE, items.length);
        return {
          label: `Items ${start + 1}-${end}`,
          value: String(start),
          default: start === rangeStart,
        };
      })
    );

  const itemSelect = new StringSelectMenuBuilder()
    .setCustomId('shop_pick_item')
    .setPlaceholder(`Pick item (${rangeStart + 1}-${rangeEnd})`)
    .setDisabled(disabled)
    .addOptions(
      items.slice(rangeStart, rangeEnd).map((item, offset) => {
        const globalIndex = rangeStart + offset;
        const price = item?.price ? `${item.price} vB` : 'N/A';
        return {
          label: truncate(`${globalIndex + 1}. ${item?.name || 'Unknown Item'}`, 100),
          description: truncate(`${price} • ${toTitleCase(item?.rarity)}`, 100),
          value: String(globalIndex),
          default: globalIndex === selectedIndex,
        };
      })
    );

  return [
    navRow,
    new ActionRowBuilder().addComponents(rangeSelect),
    new ActionRowBuilder().addComponents(itemSelect),
  ];
};

const getDailyShop = async (interaction) => {
  try {
    console.log(`${LOG_PREFIX} request started`);
    const response = await axios.get('https://fnbr.co/api/shop', {
      headers: {
        'x-api-key': `${APIKEY}`,
      },
    });

    const featuredItems = response?.data?.data?.featured || [];
    console.log(`${LOG_PREFIX} loaded ${featuredItems.length} featured item(s)`);

    if (typeof interaction.reply === 'function') {
      let selectedIndex = 0;

      const message = await interaction.reply({
        embeds: [buildItemEmbed(featuredItems, selectedIndex)],
        components: buildControls(featuredItems, selectedIndex),
        fetchReply: true,
      });

      if (!featuredItems.length) return;

      const collector = message.createMessageComponentCollector({ time: 180000 });

      collector.on('collect', async (componentInteraction) => {
        if (componentInteraction.user.id !== interaction.user.id) {
          await componentInteraction.reply({
            content: 'Only the command user can control this menu.',
            ephemeral: true,
          });
          return;
        }

        if (componentInteraction.customId === 'shop_prev_item' && selectedIndex > 0) {
          selectedIndex -= 1;
        } else if (componentInteraction.customId === 'shop_next_item' && selectedIndex < featuredItems.length - 1) {
          selectedIndex += 1;
        } else if (componentInteraction.customId === 'shop_pick_range') {
          selectedIndex = Number(componentInteraction.values[0]);
        } else if (componentInteraction.customId === 'shop_pick_item') {
          selectedIndex = Number(componentInteraction.values[0]);
        }

        await componentInteraction.update({
          embeds: [buildItemEmbed(featuredItems, selectedIndex)],
          components: buildControls(featuredItems, selectedIndex),
        });
      });

      collector.on('end', async () => {
        try {
          await interaction.editReply({
            components: buildControls(featuredItems, selectedIndex, true),
          });
        } catch (collectorError) {
          console.error(`${LOG_PREFIX} failed to disable shop controls`, collectorError?.message || collectorError);
        }
      });
      return;
    }

    if (typeof interaction.send === 'function') {
      await interaction.send({ embeds: [buildItemEmbed(featuredItems, 0)] });
      return;
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} request failed`, error?.response?.data || error?.message || error);
    if (interaction?.replied || interaction?.deferred) {
      await interaction.followUp('Something failed, idk. API is probably down, or my code sucks.');
    } else if (typeof interaction?.reply === 'function') {
      await interaction.reply('Something failed, idk. API is probably down, or my code sucks.');
    } else if (typeof interaction?.send === 'function') {
      await interaction.send('Something failed, idk. API is probably down, or my code sucks.');
    }
  }
};

module.exports = getDailyShop;
