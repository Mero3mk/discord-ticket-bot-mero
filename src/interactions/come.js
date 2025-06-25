const { CustomClient } = require('../utils');

module.exports = {
  name: 'come',
  async execute(client, interaction) {
    await interaction.reply({
      content: `🔔 <@&${client.config.supportTeamID}>، ${interaction.user} دخل التذكرة!`,
      ephemeral: false,
    });
  },
};
