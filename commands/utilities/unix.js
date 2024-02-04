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
    }).setDescription('enter date or now').setDescriptionLocalizations({
        ru: 'введите дату или сейчас'
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
            const userString = interaction.options.getString('date');
            const userStringF = ['how', 'current date', 'now', 'date', 'at', 'time', 'timestamp', 'сейчас', 'дата'];
            if (!userStringF.includes(userString.trim().toLowerCase())) {
                const date = moment(userString).unix();
                if (!isNaN(date))
                    await interaction.reply({ content: `\`${date}\` <t:${date}:R>`, ephemeral: visible })
                else 
                    await interaction.reply({ content: lang.enteredIncorrectDate, ephemeral: true })
            } else
                    await interaction.reply({ content: `\`${moment().utc().unix()}\` <t:${moment().utc().unix()}:R>`, ephemeral: visible })
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: lang.enteredIncorrectDate, ephemeral: true });
        }
    }
}