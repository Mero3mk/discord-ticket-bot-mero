const { CustomClient } = require('../utils');
const { ButtonInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'support',

  /**
   * @param {CustomClient} client
   * @param {ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const channelName = interaction.channel.name;
      let supportMention = `<@&${client.config.supportRoleId}>`;
      let title = '🆘 تم طلب الدعم';

      if (channelName.includes('حكم')) {
        supportMention = '<@&1387216547113734245>';
        title = '🔔 تم طلب حكم';
      } else if (channelName.includes('مدرب')) {
        supportMention = '<@&1387217002795634748>';
        title = '🔔 تم طلب مدرب';
      }

      // جلب آخر 20 رسالة من البوت فقط
      const recentMessages = await interaction.channel.messages.fetch({ limit: 20 });
      const alreadyRequested = recentMessages.some(
        msg =>
          msg.author.id === client.user.id &&
          msg.embeds.length > 0 &&
          msg.embeds[0].title === title
      );

      if (alreadyRequested) {
        return interaction.editReply({
          content: '⚠️ تم بالفعل طلب السبورت لهذه التذكرة، لا يمكنك إعادة الطلب.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#00b0f4')
        .setTitle(title)
        .setDescription(`قام ${interaction.user} بطلب الدعم.\n${supportMention}`);

      await interaction.channel.send({ content: supportMention, embeds: [embed] });
      await interaction.editReply({ content: '✅ تم طلب الدعم بنجاح.', ephemeral: true });
    } catch (error) {
      console.error('Error in support interaction:', error);
      await interaction.editReply({ content: '❌ حدث خطأ أثناء محاولة طلب الدعم.', ephemeral: true });
    }
  },
};
