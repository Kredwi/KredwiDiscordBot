const { SlashCommandBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('coin')
    .setNameLocalizations({
        ru: 'монетка'
    })
    .setDescription('Flip a coin')
    .setDescriptionLocalizations({
        ru: 'Подкиньте монетку'
    })
    .addStringOption(option => option.setName('side').setNameLocalizations({
        ru: 'сторона'
    }).setDescription('choose the side of the coin').setDescriptionLocalizations({
        ru: 'выберите сторону монетки'
    }).setRequired(true)
    .setChoices(
        {name: 'Eagle', name_localizations: {
            ru: 'Орёл'
        }, value: 'eagle'},
        {name: 'Tails', name_localizations: {
            ru: 'Решка'
        }, value: 'tails'}
    )),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const user = interaction.options.getString('side');
        const resuilt = lang.coinSide;
        const userRed = user.replace(/eagle/gi, lang.eagle).replace(/tails/gi, lang.tails);
        const random = resuilt[Math.floor(Math.random() * (resuilt.length - 0) + 0)];
        if (userRed == random ) await interaction.reply(lang.replyCoinMessageYes.replace(/krdwuserRed/gi, userRed).replace(/krdwrandom/gi, random));
        else await interaction.reply(lang.replyCoinMessageNo.replace(/krdwuserRed/gi, userRed).replace(/krdwrandom/gi, random));
    }
}