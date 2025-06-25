const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  name: 'reasonModal',

  async execute(client, interaction) {
    try {
      const reason = interaction.fields.getTextInputValue('ticketReason');
      const tempData = await client.db.get(`temp-${interaction.user.id}`);

      if (!tempData) {
        return interaction.reply({ content: '❌ لم يتم العثور على البيانات المؤقتة.', ephemeral: true });
      }

      const { selectedValue } = tempData;
      const { roleId, image } = client.config.optionConfig[selectedValue];
      const categoryId = client.config.categoryID;

      const ticketChannel = await interaction.guild.channels.create({
        name: `🎫・${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: categoryId,
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
          {
            id: roleId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ],
      });

      await client.db.set(`ticket-${interaction.guild.id}-${interaction.user.id}`, {
        id: ticketChannel.id,
        type: selectedValue,
        claimed: null,
        createdBy: interaction.user.id,
        createdAt: Date.now(),
      });

      const mainEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📩 تذكرة ${selectedValue}`)
        .setDescription('يرجى الانتظار حتى يتم الرد عليك من قبل الفريق المختص.')
        .setImage(image);

      const reasonEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`**✍️ السبب:**\n\`\`\`${reason}\`\`\``);

      const controlRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('close').setLabel('🔒 اغلاق').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('claim').setLabel('📌 استلام').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('ownercall').setLabel('📢 استدعاء الأونر').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('support').setLabel('🔔 طلب السبورت').setStyle(ButtonStyle.Secondary)
      );

      const menuRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticketOptions')
          .setPlaceholder('🛠️ تعديل التذكرة')
          .addOptions(
            { label: '🧑‍💼 Come', value: 'come', description: 'استدعاء مسؤول للتذكرة' },
            { label: '📝 Rename', value: 'rename', description: 'إعادة تسمية التذكرة' },
            { label: '➕ Add user', value: 'add', description: 'إضافة عضو إلى التذكرة' },
            { label: '➖ Remove user', value: 'remove', description: 'إزالة عضو من التذكرة' },
            { label: '🔄 Reset menu', value: 'reset', description: 'إعادة تعيين القائمة' }
          )
      );

      await ticketChannel.send({
        content: `<@${interaction.user.id}> <@&${roleId}>`,
        embeds: [mainEmbed, reasonEmbed],
        components: [controlRow, menuRow],
      });

      await interaction.reply({
        content: `✅ تم إنشاء التذكرة: ${ticketChannel}`,
        ephemeral: true,
      });

      await client.db.delete(`temp-${interaction.user.id}`);
    } catch (error) {
      console.error('Error in reasonModal:', error);
      await interaction.reply({
        content: '❌ حدث خطأ أثناء معالجة النموذج!',
        ephemeral: true,
      });
    }
  },
};
