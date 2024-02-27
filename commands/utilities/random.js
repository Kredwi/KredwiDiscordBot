const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('random')
    .setNameLocalizations({
        ru: 'рандом'
    })
    .setDescription('get random number')
    .setDescriptionLocalizations({
        ru: 'Получить рандомное число'
    })
    .addIntegerOption(option => option.setName('max').setNameLocalizations({
        ru: 'максимальное'
    }).setDescription('print max number').setDescriptionLocalizations({
        ru: 'введите максимальное число'
    }).setRequired(true))
    .addIntegerOption(option => option.setName('min').setNameLocalizations({
        ru: 'минимальное'
    }).setDescription('print min number').setDescriptionLocalizations({
        ru: 'введите минимальное число'
    }).setRequired(true)),
    async execute(interaction) {
        const maxNumber = interaction.options.getInteger('max');
        const minNumber = interaction.options.getInteger('min');
        if (maxNumber <= minNumber) return interaction.reply({ content: lang.noR, ephemeral: true });
        const resuilt = Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
        await interaction.reply(String(resuilt));
    }
}