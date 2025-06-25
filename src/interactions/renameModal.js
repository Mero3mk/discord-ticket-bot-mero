const { ModalSubmitInteraction, ChannelType } = require('discord.js');

module.exports = {
  name: 'renameModal',

  /**
   * @param {CustomClient} client
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(client, interaction) {
    const newName = interaction.fields.getTextInputValue('newName');

    if (!newName || newName.length > 100) {
      await interaction.reply({ content: '❌ يجب أن يكون الاسم بين 1 و 100 حرف.', ephemeral: true });
      return;
    }

    try {
      const oldName = interaction.channel.name;
      await interaction.channel.setName(newName);
      await interaction.reply({
        content: `✅ تم تغيير اسم التذكرة من \`${oldName}\` إلى \`${newName}\`.`,
        ephemeral: false,
      });
    } catch (err) {
      console.error('Error renaming channel:', err);
      await interaction.reply({
        content: '❌ حدث خطأ أثناء محاولة تغيير الاسم.',
        ephemeral: true,
      });
    }
  },
};
