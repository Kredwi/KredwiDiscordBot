const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({
        ru: 'собака'
    })
    .setDescription('View random dog image')
    .setDescriptionLocalizations({
        ru: 'Показать картинку собаки'
    })
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=1&api_key=${process.env.animalToken}` + '&size=full');
            const data = await response.json()
            const visible = interaction.options.getBoolean('hide') || false;
            const embedCat = new EmbedBuilder()
            .setColor(0xff0000)
            .setImage(data[0].url)
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [embedCat], ephemeral: visible });
        } catch (err) {
            console.log(err);
        }
    }
}