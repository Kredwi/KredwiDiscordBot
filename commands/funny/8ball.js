const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('8ball')
    .setNameLocalizations({
        ru: 'шар',
    })
    .setDescription('A ball of laughter and riddles!')
    .setDescriptionLocalizations({
        ru: 'Шар смеха и загадок!'
    })
    .addStringOption(option => option.setName('question').setNameLocalizations({
        ru: 'вопрос'
    }).setDescription('Ask your question').setDescriptionLocalizations({
        ru: 'Задайте свой вопрос'
    }).setRequired(true))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const answers = lang.answers;
        const visible = interaction.options.getBoolean('hide') || false;
        const answer = interaction.options.getString('question').trim();
        const answerEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(lang.question + answer + '\n' + lang.answer + answers[randomInt(answers.length, 0)]);
        await interaction.reply({ embeds: [answerEmbed], ephemeral: visible });
    }
}


function randomInt(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}