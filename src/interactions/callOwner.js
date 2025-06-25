const { CustomClient } = require('../utils');
const { ButtonInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'owner',

  /**
   * @param {CustomClient} client
   * @param {ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    const ownerId = '959199146357719040'; // معرف الأونر
    const locale = client.locale.get(client.config.language);

    await interaction.deferReply({ ephemeral: true });

    try {
      const ownerMention = `<@${ownerId}>`;
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('📢 تم استدعاء الأونر')
        .setDescription(`تم استدعاء ${ownerMention} إلى التذكرة.`);

      await interaction.channel.send({ content: ownerMention, embeds: [embed] });
      await interaction.editReply({ content: '✅ تم استدعاء الأونر بنجاح.', ephemeral: true });
    } catch (error) {
      console.error('Error in callOwner:', error);
      await interaction.editReply({ content: '❌ حدث خطأ أثناء محاولة استدعاء الأونر.', ephemeral: true });
    }
  },
};
