const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me').setNameLocalizations({
            ru: 'сделать'
        })
        .setDescription('Describe your actions').setDescriptionLocalizations({
            ru: 'Описать свои действия'
        })
        .addStringOption(option => option.setName('action').setNameLocalizations({
            ru: 'действие'
        }).setDescription('Enter your action').setDescriptionLocalizations({
            ru: 'Введите ваше действие'
        }).setRequired(true)),
    async execute (interaction) {
        await interaction.reply({ content: interaction.user.globalName + ' ' + interaction.options.getString('action'), ephemeral: false });
    }
}