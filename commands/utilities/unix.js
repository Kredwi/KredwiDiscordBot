const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unix').setNameLocalizations({
        ru: 'юникс'
    })
    .setDescription('Convert regular date to Unix time').setDescriptionLocalizations({
        ru: 'Преобразовать обычную дату в Unix время'
    })
    .addStringOption(option => option.setName('date').setNameLocalizations({
        ru: 'дата'
    }).setDescription('enter date').setDescriptionLocalizations({
        ru: 'введите дату'
    }).setRequired(true))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        try {
            const visible = interaction.options.getBoolean('hide') || false;
            const date = moment(interaction.options.getString('date')).unix();
            if (!isNaN(date))
                await interaction.reply({ content: `\`${date}\` <t:${date}:R>`, ephemeral: visible })
            else 
                await interaction.reply({ content: lang.enteredIncorrectDate, ephemeral: true })
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: lang.enteredIncorrectDate, ephemeral: true })
        }
    }
}