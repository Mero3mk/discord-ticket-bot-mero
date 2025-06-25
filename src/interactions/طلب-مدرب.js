const {
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');
const { CustomClient } = require('../utils');

module.exports = {
  name: 'طلب-مدرب',

  /**
   * @param {CustomClient} client
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    const userId = interaction.user.id;
    const existing = interaction.guild.channels.cache.find(c =>
      c.topic === userId && c.name.includes('طلب-مدرب')
    );
    if (existing) {
      return interaction.reply({
        content: '❌ لديك بالفعل تذكرة مدرب مفتوحة.',
        ephemeral: true,
      });
    }

    const channel = await interaction.guild.channels.create({
      name: `طلب-مدرب-${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: userId,
      parent: '1387217234732253195',
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: client.config.supportRoleId,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    const mainEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('🏋️ تذكرة طلب مدرب')
      .setDescription('تم إنشاء تذكرتك بنجاح، الرجاء الانتظار حتى يتم الرد عليك.');

    const imageEmbed = {
      image: { url: client.config.BACKGROUND },
    };

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('🔒 اغلاق')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('claim')
        .setLabel('📌 استلام')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('callOwner')
        .setLabel('📢 استدعاء الأونر')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('support')
        .setLabel('🔔 طلب السبورت')
        .setStyle(ButtonStyle.Primary)
    );

    const controlPanel = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticketOptions')
        .setPlaceholder('🛠️ تعديل التذكرة')
        .addOptions([
          { label: 'استدعاء مسؤول', value: 'come', emoji: '📣' },
          { label: 'إعادة التسمية', value: 'rename', emoji: '✏️' },
          { label: 'إضافة عضو', value: 'add', emoji: '➕' },
          { label: 'إزالة عضو', value: 'remove', emoji: '➖' },
          { label: 'إعادة تعيين', value: 'reset', emoji: '♻️' },
        ])
    );

    await channel.send({
      embeds: [mainEmbed, imageEmbed],
      components: [buttons, controlPanel],
    });

    await interaction.reply({ content: `✅ تم فتح تذكرتك: ${channel}`, ephemeral: true });

    const ticketKey = `ticket-${interaction.guild.id}-${userId}`;
    await client.db.set(ticketKey, {
      type: 'طلب-مدرب',
      claimed: null,
      supportRequested: false,
      channelId: channel.id,
    });
  },
};
