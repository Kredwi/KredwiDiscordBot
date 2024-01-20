const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fox')
    .setNameLocalizations({
        ru: 'лис'
    })
    .setDescription('View random fox image')
    .setDescriptionLocalizations({
        ru: 'Показать картинку лисы'
    })
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const response = await fetch('https://randomfox.ca/floof/');
            const data = await response.json()
            const visible = interaction.options.getBoolean('hide') || false;
            const embedCat = new EmbedBuilder()
            .setColor(0xff0000)
            .setImage(data.image)
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [embedCat], ephemeral: visible });
        } catch (err) {
            console.error(err);
        }
    }
}