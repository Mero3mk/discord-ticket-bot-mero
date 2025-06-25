const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  name: 'panel',
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('إرسال بانل تذاكر الحكم أو المدرب')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('نوع التذكرة')
        .setRequired(true)
        .addChoices(
          { name: 'طلب حكم', value: 'طلب-حكم' },
          { name: 'طلب مدرب', value: 'طلب-مدرب' },
        )
    )
    .addChannelOption(option =>
      option
        .setName('room')
        .setDescription('الروم اللي هيتبعت فيها البانل')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction) {
    const type = interaction.options.getString('type');
    const room = interaction.options.getChannel('room');

    const labels = {
      'طلب-حكم': { label: 'طلب حكم', emoji: '⚖️' },
      'طلب-مدرب': { label: 'طلب مدرب', emoji: '🏋️' },
    };

    const data = labels[type];

    if (!data) {
      return interaction.reply({ content: '❌ نوع التذكرة غير مدعوم.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle(`🎫 إنشاء تذكرة - ${data.label}`)
      .setDescription(`اضغط على الزر بالأسفل لفتح تذكرة **${data.label}**.`);

    const button = new ButtonBuilder()
      .setCustomId(type)
      .setLabel(data.label)
      .setStyle(ButtonStyle.Primary)
      .setEmoji(data.emoji);

    const row = new ActionRowBuilder().addComponents(button);

    await room.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ تم إرسال بانل ${data.label} إلى ${room}.`, ephemeral: true });
  }
};
