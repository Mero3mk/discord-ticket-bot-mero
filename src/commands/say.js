const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'say',
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('📢 إرسال رسالة إمبد في نفس الروم')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('عنوان الإمبد')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('وصف الإمبد')
        .setRequired(true)),

  /**
   * @param {import('../../utils').CustomClient} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor('#0099ff')
      .setImage('https://media.discordapp.net/attachments/1385340506199949382/1385340658633670859/image.png?ex=685c4e07&is=685afc87&hm=6e3f048283c2ba1302064f1457ea0a84b8ca5a45a460da02e52466cb382ef746&=&format=webp&quality=lossless&width=1240&height=826');

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ تم إرسال الإمبد بنجاح!', ephemeral: true });
  },
};
