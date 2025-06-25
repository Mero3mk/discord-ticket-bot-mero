const { PermissionFlagsBits } = require('discord.js');
const { CustomClient } = require('../utils');

module.exports = {
  name: 'claim',

  /**
   * @param {CustomClient} client
   * @param {import('discord.js').ButtonInteraction} interaction
   */
  async execute(client, interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.channel;
      const userId = channel.topic;

      if (!userId) {
        return interaction.editReply({ content: '❌ لا يمكن العثور على معلومات التذكرة (topic).', ephemeral: true });
      }

      const ticketKey = `ticket-${interaction.guild.id}-${userId}`;
      const ticketData = await client.db.get(ticketKey);

      if (!ticketData) {
        return interaction.editReply({ content: '❌ لا يمكن العثور على معلومات التذكرة.', ephemeral: true });
      }

      if (ticketData.claimed) {
        const claimer = `<@${ticketData.claimed}>`;
        return interaction.editReply({ content: `📌 تم استلام هذه التذكرة بالفعل من قبل ${claimer}.`, ephemeral: true });
      }

      const isSupport = interaction.member.roles.cache.has(client.config.supportRoleId);
      const isOwner = interaction.user.id === client.config.ownerId;

      if (!isSupport && !isOwner) {
        return interaction.editReply({ content: '❌ ليس لديك صلاحية لاستلام التذكرة.', ephemeral: true });
      }

      if (interaction.user.id === userId) {
        return interaction.editReply({ content: '❌ لا يمكنك استلام التذكرة التي أنشأتها.', ephemeral: true });
      }

      // تحديث قاعدة البيانات
      await client.db.set(ticketKey, {
        ...ticketData,
        claimed: interaction.user.id,
      });

      // تعديل الصلاحيات
      await interaction.channel.permissionOverwrites.edit(client.config.supportRoleId, {
        ViewChannel: false,
        SendMessages: false,
      });

      await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      await interaction.channel.send({
        content: `📌 تم استلام هذه التذكرة من قبل ${interaction.user}.`,
      });

      await interaction.editReply({ content: '✅ تم استلام التذكرة بنجاح.', ephemeral: true });

    } catch (error) {
      console.error('❌ خطأ في أمر claim:', error);
      await interaction.editReply({ content: '❌ حدث خطأ أثناء محاولة استلام التذكرة.', ephemeral: true });
    }
  },
};
