const { Events, InteractionType, PermissionsBitField } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   * @param {CustomClient} client
   * @param {Interaction} interaction
   */
  async execute(client, interaction) {
    try {
      // أوامر الشات /slash
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return console.warn(`❌ لا يوجد أمر: ${interaction.commandName}`);
        try {
          await command.execute(client, interaction);
        } catch (error) {
          console.error(`خطأ أثناء تنفيذ الأمر ${interaction.commandName}:`, error);
          const reply = { content: '❌ حدث خطأ أثناء تنفيذ الأمر!', ephemeral: true };
          interaction.replied || interaction.deferred ? interaction.followUp(reply) : interaction.reply(reply);
        }
        return;
      }

      // النماذج (Modal)
      if (interaction.type === InteractionType.ModalSubmit) {
        const [interactionName] = interaction.customId.split('*');
        const modalInteraction = client.interactions.get(interactionName);
        if (!modalInteraction) return console.warn(`❌ لا يوجد معالج للنموذج: ${interactionName}`);
        try {
          await modalInteraction.execute(client, interaction);
        } catch (error) {
          console.error(`خطأ أثناء تنفيذ النموذج ${interaction.customId}:`, error);
          const reply = { content: '❌ حدث خطأ أثناء معالجة النموذج!', ephemeral: true };
          interaction.replied || interaction.deferred ? interaction.followUp(reply) : interaction.reply(reply);
        }
        return;
      }

      // الأزرار والقوائم
      if (interaction.isButton() || interaction.isAnySelectMenu()) {
        let interactionName = interaction.customId.split('*')[0];

        // منع غير الإداريين من استخدام القائمة (مثل: تعديل التذكرة)
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticketOptions') {
          const supportRole = client.config.supportRoleId;
          const ownerId = client.config.ownerId;

          const member = interaction.member;
          const isAdmin =
            member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            member.roles.cache.has(supportRole) ||
            member.id === ownerId;

          if (!isAdmin) {
            return interaction.reply({
              content: '❌ لا يمكنك استخدام هذا الخيار، مخصص فقط للإدارة.',
              ephemeral: true,
            });
          }
        }

        // التعامل مع التفاعل
        if (interaction.isUserSelectMenu()) interactionName = 'addUser';

        const interactionHandler = client.interactions.get(interactionName);
        if (!interactionHandler) return console.warn(`❌ لا يوجد معالج للتفاعل: ${interactionName}`);
        try {
          await interactionHandler.execute(client, interaction);
        } catch (error) {
          console.error(`خطأ أثناء تنفيذ التفاعل ${interaction.customId}:`, error);
          const reply = { content: '❌ حدث خطأ أثناء التفاعل!', ephemeral: true };
          interaction.replied || interaction.deferred ? interaction.followUp(reply) : interaction.reply(reply);
        }
        return;
      }
    } catch (error) {
      console.error('❌ خطأ غير متوقع في interactionCreate:', error);
    }
  },
};
