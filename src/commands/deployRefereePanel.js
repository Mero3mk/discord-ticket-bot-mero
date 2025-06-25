const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  name: 'deployrefereepanel',
  data: new SlashCommandBuilder()
    .setName('deployrefereepanel')
    .setDescription('نشر بانل طلب حكم')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const channelId = '1387217179291815956'; // روم طلب حكم
    const channel = await client.channels.fetch(channelId);

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🧑‍⚖️ طلب حكم')
      .setDescription('اضغط على الزر أدناه لفتح تذكرة لطلب حكم.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('openTicket*طلب-حكم')
        .setLabel('🧑‍⚖️ فتح تذكرة حكم')
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ تم نشر بانل طلب حكم بنجاح!', ephemeral: true });
  }
};
