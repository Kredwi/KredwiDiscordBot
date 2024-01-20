const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new ButtonBuilder()
    .setCustomId('cancelBan')
    .setStyle(ButtonStyle.Danger)
    .setLabel('No'),
    async execute(interaction) {
        return;
    }
}