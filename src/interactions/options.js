const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonInteraction,
  StringSelectMenuOptionBuilder,
} = require('discord.js');

module.exports = {
  name: 'options',

  /**
   * @async
   * @function execute
   * @param {CustomClient} client
   * @param {ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticketOptions')
      .setPlaceholder('🛠️ تعديل التذكرة')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('🧑‍💼 Come')
          .setValue('come')
          .setDescription('استدعاء مسؤول للتذكرة'),
        new StringSelectMenuOptionBuilder()
          .setLabel('📝 Rename')
          .setValue('rename')
          .setDescription('إعادة تسمية التذكرة'),
        new StringSelectMenuOptionBuilder()
          .setLabel('➕ Add user')
          .setValue('add')
          .setDescription('إضافة عضو إلى التذكرة'),
        new StringSelectMenuOptionBuilder()
          .setLabel('➖ Remove user')
          .setValue('remove')
          .setDescription('إزالة عضو من التذكرة'),
        new StringSelectMenuOptionBuilder()
          .setLabel('🔄 Reset menu')
          .setValue('reset')
          .setDescription('إعادة تعيين القائمة')
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: 'يرجى اختيار أحد خيارات تعديل التذكرة:',
      components: [row],
      ephemeral: true,
    });
  },
};
