const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('panda')
    .setNameLocalizations({
        ru: 'панда'
    })
    .setDescription('View random panda image')
    .setDescriptionLocalizations({
        ru: 'Показать картинку панды'
    })
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const response = await fetch('https://some-random-api.com/animal/panda');
            const data = await response.json()
            const visible = interaction.options.getBoolean('hide') || false;
            const embedCat = new EmbedBuilder()
            .setColor(0xff0000)
            .setImage(data.image)
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [embedCat], ephemeral: visible });
        } catch (err) {
            console.log(err);
        }
    }
}