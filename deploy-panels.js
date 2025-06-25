const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require('discord.js');

/**
 * بانل إرسال التذاكر في رومات الحكم والمدرب فقط.
 * @param {import('./src/utils').CustomClient} client 
 */
module.exports = async (client) => {
  const panels = [
    {
      channelId: "1387217179291815956", // روم طلب حكم
      label: "طلب حكم",
      value: "طلب-حكم",
      emoji: "⚖️"
    },
    {
      channelId: "1387217251211546665", // روم طلب مدرب
      label: "طلب مدرب",
      value: "طلب-مدرب",
      emoji: "🏋️"
    }
  ];

  for (const panel of panels) {
    try {
      const channel = await client.channels.fetch(panel.channelId);
      if (!channel) {
        console.warn(`❌ لم أستطع الوصول إلى الروم: ${panel.channelId}`);
        continue;
      }

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle(`🎫 إنشاء تذكرة - ${panel.label}`)
        .setDescription(`اضغط على الزر بالأسفل لفتح تذكرة **${panel.label}**.`);

      const button = new ButtonBuilder()
        .setCustomId(panel.value)
        .setLabel(panel.label)
        .setStyle(ButtonStyle.Primary)
        .setEmoji(panel.emoji);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({ embeds: [embed], components: [row] });
      console.log(`✅ تم إرسال بانل ${panel.label} إلى الروم ${channel.name}`);
    } catch (err) {
      console.error(`❌ فشل إرسال بانل ${panel.label}:`, err);
    }
  }
};
