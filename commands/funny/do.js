const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('do').setNameLocalizations({
            ru: 'сделал'
        })
        .setDescription('Describe the actions of the surrounding world').setDescriptionLocalizations({
            ru: 'Описать действия окружающего мира'
        })
        .addStringOption(option => option.setName('action').setNameLocalizations({
            ru: 'действие'
        }).setDescription('Enter your action').setDescriptionLocalizations({
            ru: 'Введите ваше действие'
        }).setRequired(true)),
    async execute (interaction) {
        await interaction.reply({ content: interaction.options.getString('action') + ' (' + interaction.user.globalName + ')', ephemeral: false });
    }
}