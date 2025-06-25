const {
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  name: 'ticketOptions',

  async execute(client, interaction) {
    const selected = interaction.values[0];

    const member = interaction.member;
    const isStaff =
      member.roles.cache.has(client.config.supportRoleId) ||
      member.id === client.config.ownerId;

    if (!isStaff) {
      return interaction.reply({
        content: '❌ ليس لديك صلاحية لاستخدام هذه القائمة.',
        ephemeral: true,
      });
    }

    switch (selected) {
      case 'come':
        await interaction.reply({ content: 'تم استدعاء المسؤولين إلى التذكرة ✅', ephemeral: true });
        await interaction.channel.send(`<@&${client.config.supportRoleId}> الرجاء التوجه لهذه التذكرة.`);
        break;

      case 'rename': {
        const modal = new ModalBuilder()
          .setCustomId('renameModal')
          .setTitle('إعادة تسمية التذكرة')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('newName')
                .setLabel('الاسم الجديد للتذكرة')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
        break;
      }

      case 'add': {
        const modal = new ModalBuilder()
          .setCustomId('addUserModal')
          .setTitle('إضافة عضو للتذكرة')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('userIdToAdd')
                .setLabel('اكتب آيدي العضو أو منشنه')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
        break;
      }

      case 'remove': {
        const modal = new ModalBuilder()
          .setCustomId('removeUserModal')
          .setTitle('إزالة عضو من التذكرة')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('userIdToRemove')
                .setLabel('اكتب آيدي العضو أو منشنه')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
        break;
      }

      case 'reset': {
        await interaction.deferReply({ ephemeral: true });

        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const botMessage = messages.find((m) => m.author.id === client.user.id && m.components.length > 0);

        if (!botMessage) {
          return interaction.editReply({ content: '⚠️ لم أستطع إيجاد رسالة البوت لإعادة تعيينها.' });
        }

        const controlRow = botMessage.components[0];
        const menuRow = botMessage.components[1];

        // التحقق من وجود صفوف صالحة
        const newComponents = [];
        if (controlRow) newComponents.push(controlRow);
        if (menuRow) newComponents.push(menuRow);

        if (newComponents.length === 0) {
          return interaction.editReply({ content: '⚠️ لا يوجد صفوف قابلة لإعادة التعيين في الرسالة.' });
        }

        await botMessage.edit({ components: newComponents });

        await interaction.editReply({ content: '✅ تم إعادة تعيين الأزرار والقائمة.' });
        break;
      }

      default:
        await interaction.reply({ content: '❌ خيار غير معروف.', ephemeral: true });
    }
  },
};
