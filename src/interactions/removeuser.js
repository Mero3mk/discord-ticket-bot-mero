module.exports = {
  name: 'removeUser',
  async execute(client, interaction) {
    const userMention = interaction.message.mentions?.users?.first();
    if (!userMention) {
      await interaction.reply({ content: 'يجب منشن الشخص الذي تريد إزالته.', ephemeral: true });
      return;
    }

    await interaction.channel.permissionOverwrites.delete(userMention.id).catch(() => {});

    await interaction.reply({ content: `تمت إزالة ${userMention} من التذكرة.`, ephemeral: false });
  },
};
