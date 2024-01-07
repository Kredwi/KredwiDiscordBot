const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping-pong')
        .addBooleanOption(option => option.setName('hide').setNameLocalizations({
            ru: 'скрыть'
        }).setDescription('hide a message from other users').setDescriptionLocalizations({
            ru: 'скрыть сообщение от других пользователей'
        })),
    async execute (interaction) {
        const visible = interaction.options.getBoolean('hide') || false;
        await interaction.reply({ content: 'pong!', ephemeral: visible });
    }
}