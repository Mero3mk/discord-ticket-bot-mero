// src/commands/closeCommand.js
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'closeCommand',
  async execute(client, message) {
    const supportRoleId = client.config.supportRoleId;
    const ownerId = client.config.ownerId;

    // تحقق من الصلاحيات
    if (
      !message.member.roles.cache.has(supportRoleId) &&
      message.author.id !== ownerId
    ) {
      return message.reply('❌ لا تمتلك صلاحية استخدام هذا الأمر.');
    }

    // تحقق من أن الأمر داخل قناة تذكرة
    const ticketCategory = client.config.categoryID;
    if (message.channel.parentId !== ticketCategory) {
      return message.reply('❌ هذا الأمر يمكن استخدامه فقط داخل قسم التذاكر.');
    }

    try {
      await message.reply('📪 يتم الآن حذف التذكرة...');
      await message.channel.delete();
    } catch (error) {
      console.error('خطأ أثناء حذف التذكرة:', error);
      message.reply('❌ حدث خطأ أثناء حذف التذكرة.');
    }
  }
};
