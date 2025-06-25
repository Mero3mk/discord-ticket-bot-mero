const { ButtonInteraction } = require('discord.js');

module.exports = {
  name: 'ownerCall',

  /**
   * @param {CustomClient} client
   * @param {ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    const ownerId = '959199146357719040'; // ID الأونر

    try {
      await interaction.deferReply({ ephemeral: true });

      // تأكد إن الزر مش معمول عليه سبام
      const lastCalled = client.lastOwnerCall?.get(interaction.channel.id);
      const now = Date.now();
      if (lastCalled && now - lastCalled < 60000) { // أقل من دقيقة
        await interaction.editReply({ content: '⏳ تم استدعاء الأونر مؤخرًا، الرجاء الانتظار قليلاً.', ephemeral: true });
        return;
      }

      client.lastOwnerCall ??= new Map();
      client.lastOwnerCall.set(interaction.channel.id, now);

      const mention = `<@${ownerId}>`;
      await interaction.channel.send({ content: `📢 تم استدعاء الأونر ${mention} من قبل <@${interaction.user.id}>.` });

      await interaction.editReply({ content: '✅ تم استدعاء الأونر بنجاح.', ephemeral: true });
    } catch (err) {
      console.error('Error in ownerCall interaction:', err);
      await interaction.editReply({ content: '❌ حدث خطأ أثناء محاولة استدعاء الأونر.', ephemeral: true });
    }
  },
};
