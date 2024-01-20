const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('words')
    .setNameLocalizations({
        ru: 'слова'
    })
    .setDescription('Information for text')
    .setDescriptionLocalizations({
        ru: 'Информация о тексте'
    })
    .addStringOption(option => option.setName('text').setNameLocalizations({
        ru: 'текст'
    }).setDescription('enter the text').setDescriptionLocalizations({
        ru: 'введите текст'
    }).setRequired(true))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const text = interaction.options.getString('text');
            const visible = interaction.options.getBoolean('hide') || false;
            const textSpace = text.split(' ').filter(word => word.length > 0);
            const embedText = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(lang.infoForText)
            .setDescription(lang.text + text)
            .setFields(
                {name: lang.characters, value: String(text.length), inline: true},
                {name: lang.words, value: String(textSpace.length), inline: true},
            );
            await interaction.reply({ embeds: [embedText], ephemeral: visible });
        } catch (error) {
            console.error(error);
        }
    }
}