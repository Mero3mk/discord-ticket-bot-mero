const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  name: 'ticketOptions',
  async execute(client, interaction) {
    const selected = interaction.values[0];
    const member = interaction.member;
    const supportRole = client.config.supportRoleId;
    const ownerId = client.config.ownerId;

    // ❌ منع غير الإداريين من استخدام القائمة بالكامل
    if (
      !member.roles.cache.has(supportRole) &&
      member.id !== ownerId
    ) {
      return interaction.reply({
        content: '❌ لا تملك صلاحية استخدام هذا الخيار.',
        ephemeral: true,
      });
    }

    if (selected === 'reset') {
      const ticketData = await client.db.get(`ticket-${interaction.guild.id}-${interaction.channel.id}`);
      const channel = interaction.channel;
      const userId = channel.topic;

      const type = ticketData?.type || 'تذكرة';

      const mainEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📩 تذكرة ${type}`)
        .setDescription('يرجى الانتظار حتى يتم الرد عليك من قبل الفريق المختص.');

      const reasonEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`**✍️ السبب:**\n\`\`\`تمت إعادة ضبط القائمة بواسطة الإدارة\`\`\``);

      const controlRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('🔒 اغلاق')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('claim')
          .setLabel('📌 استلام')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('ownercall')
          .setLabel('📢 استدعاء الأونر')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('support')
          .setLabel('🔔 طلب السبورت')
          .setStyle(ButtonStyle.Secondary)
      );

      const menuRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticketOptions')
          .setPlaceholder('🛠️ تعديل التذكرة')
          .addOptions(
            { label: '🧑‍💼 Come', value: 'come', description: 'استدعاء مسؤول للتذكرة' },
            { label: '📝 Rename', value: 'rename', description: 'إعادة تسمية التذكرة' },
            { label: '➕ Add user', value: 'add', description: 'إضافة عضو إلى التذكرة' },
            { label: '➖ Remove user', value: 'remove', description: 'إزالة عضو من التذكرة' },
            { label: '🔄 Reset menu', value: 'reset', description: 'إعادة تعيين القائمة' }
          )
      );

      await interaction.update({
        content: `<@${userId}> <@&${supportRole}>`,
        embeds: [mainEmbed, reasonEmbed],
        components: [controlRow, menuRow],
      });
    }

    // يمكنك إضافة بقية الخيارات (rename / come / add / remove) هنا لاحقاً
  },
};
