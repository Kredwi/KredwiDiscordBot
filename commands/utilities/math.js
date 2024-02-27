const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const math = require('mathjs')
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('math')
    .setNameLocalizations({
        ru: 'пример'
    })
    .setDescription('Solve a mathematical expression')
    .setDescriptionLocalizations({
        ru: 'Решить математическое выражение'
    })
    .addStringOption(option => option.setName('expression').setNameLocalizations({
        ru: 'выражение'
    }).setDescription('Enter a mathematical expression')
    .setDescriptionLocalizations({
        ru: 'Введите математическое выражение'
    }).setRequired(true))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const visible = interaction.options.getBoolean('hide') || false;
        const value = interaction.options.getString('expression');
        try {
            const resuilt = math.evaluate(value);
            const embed = new EmbedBuilder()
            .setColor([44, 45, 49])
            .setDescription(`${lang.resMathNice}  \`${value}\`
            \`\`\` ${resuilt.toString()} \`\`\``);
            await interaction.reply({ embeds: [embed], ephemeral: visible });
        } catch (error) {
            const embed = new EmbedBuilder()
            .setTitle(lang.error)
            .setColor(0xff0000)
            .setDescription(`${lang.resMathNice}\`${value}\`
            \`\`\` ${error.toString()} \`\`\``);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}