const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  name: 'deploysupportpanel',
  data: new SlashCommandBuilder()
    .setName('deploysupportpanel')
    .setDescription('نشر بانل الدعم الفني والشكوى')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const channelId = '1386841100337021039'; // روم بانل الدعم الفني والشكوى
    const channel = await client.channels.fetch(channelId);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎫 فتح تذكرة')
      .setDescription('يرجى اختيار نوع التذكرة من الأزرار التالية.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('openTicket*الدعم-الفني')
        .setLabel('📜 الدعم الفني')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('openTicket*الشكوى')
        .setLabel('🛠️ الشكوى')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ تم نشر بانل الدعم الفني والشكوى بنجاح!', ephemeral: true });
  }
};
