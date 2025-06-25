const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  name: 'rename',
  async execute(client, interaction) {
    const modal = new ModalBuilder()
      .setCustomId('renameModal')
      .setTitle('تغيير اسم التذكرة');

    const nameInput = new TextInputBuilder()
      .setCustomId('newName')
      .setLabel('ادخل الاسم الجديد')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  },
};
