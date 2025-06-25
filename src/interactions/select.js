const {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  name: 'select',

  async execute(client, interaction) {
    const selectedValue = interaction.isAnySelectMenu()
      ? interaction.values[0]
      : interaction.customId.split('*')[1];

    const { roleId, image, categoryID } = client.config.optionConfig[selectedValue];
    const categoryId = categoryID || client.config.categoryID;
    const ticketCategory = interaction.guild.channels.cache.get(categoryId);

    if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) return;

    const hasTicket = interaction.guild.channels.cache.find(
      (ch) => ch.parentId === categoryId && ch.topic === interaction.user.id
    );
    if (hasTicket) {
      return interaction.reply({
        content: '❌ لديك بالفعل تذكرة مفتوحة!',
        ephemeral: true,
      });
    }

    // 🧠 تخزين مؤقت في قاعدة البيانات
    await client.db.set(`temp-${interaction.user.id}`, {
      selectedValue,
      guildId: interaction.guild.id,
    });

    // 📝 عرض مودال السبب
    const modal = new ModalBuilder()
      .setCustomId('reasonModal')
      .setTitle('سبب فتح التذكرة');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ticketReason')
      .setLabel('يرجى كتابة سبب فتح التذكرة')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('مثال: أريد شراء رتبة... أو عندي شكوى عن شخص...');

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },
};
