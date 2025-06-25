const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'close',

  /**
   * @param {CustomClient} client
   * @param {ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    const locale = client.locale.get(client.config.language);

    // 🔒 تحقق من الصلاحيات
    const allowedRoles = [
      '1386841906172137603', // ID تيم الدعم
      '959199146357719040',  // ID الأونر
    ];

    const memberRoles = interaction.member.roles.cache;
    const isAdmin = memberRoles.some(role => allowedRoles.includes(role.id));

    if (!isAdmin) {
      return interaction.reply({
        content: '❌ ليس لديك إذن لإغلاق التذكرة.',
        ephemeral: true
      });
    }

    // ✅ اغلاق التذكرة مباشرة
    await interaction.deferReply({ ephemeral: true });

    try {
      await interaction.channel.delete();
    } catch (error) {
      console.error('حدث خطأ أثناء حذف التذكرة:', error);
      await interaction.editReply({
        content: '❌ حدث خطأ أثناء محاولة إغلاق التذكرة.',
        ephemeral: true
      });
    }
  },
};
