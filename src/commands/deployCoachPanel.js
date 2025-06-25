const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  name: 'deploycoachpanel',
  data: new SlashCommandBuilder()
    .setName('deploycoachpanel')
    .setDescription('نشر بانل طلب مدرب')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const channelId = '1387217251211546665'; // روم طلب مدرب
    const channel = await client.channels.fetch(channelId);

    const embed = new EmbedBuilder()
      .setColor('#57F287')
      .setTitle('🎯 طلب مدرب')
      .setDescription('اضغط على الزر أدناه لفتح تذكرة لطلب مدرب.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('openTicket*طلب-مدرب')
        .setLabel('🎯 فتح تذكرة مدرب')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ تم نشر بانل طلب مدرب بنجاح!', ephemeral: true });
  }
};
