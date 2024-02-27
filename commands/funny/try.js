const { SlashCommandBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('try').setNameLocalizations({
            ru: 'попытка'
        })
        .setDescription('Describe the action with a 50% probability').setDescriptionLocalizations({
            ru: 'Описать действие с 50% вероятностью'
        })
        .addStringOption(option => option.setName('action').setNameLocalizations({
            ru: 'действие'
        }).setDescription('Enter your action').setDescriptionLocalizations({
            ru: 'Введите ваше действие'
        }).setRequired(true)),
    async execute (interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const variant = [ '✅ ' + lang.success, '❌ ' + lang.unsuccess];
        await interaction.reply({ content: interaction.user.globalName + ' ' + interaction.options.getString('action') + ': ' + variant[Math.floor(Math.random() * (variant.length - 0) + 0)], ephemeral: false });
    }
}