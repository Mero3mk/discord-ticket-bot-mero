const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'addUser',
  async execute(client, interaction) {
    if (!interaction.isUserSelectMenu()) return;

    const member = interaction.guild.members.cache.get(interaction.values[0]);
    if (!member) {
      await interaction.reply({ content: 'لم أتمكن من العثور على العضو.', ephemeral: true });
      return;
    }

    await interaction.channel.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await interaction.reply({ content: `تمت إضافة ${member} إلى التذكرة.`, ephemeral: false });
  },
};
