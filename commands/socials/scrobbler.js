const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('scrobbler')
    .setNameLocalizations({
        ru: 'скробблер'
    })
    .setDescription('get information from last fm').setDescriptionLocalizations({
        ru: 'получить информацию с last fm'
    })
    .addStringOption(option => option.setName('user').setNameLocalizations({
        ru: 'пользователь'
    }).setDescription('Please enter the Last.Fm user username').setDescriptionLocalizations({
        ru: 'Введите имя пользователя last.fm'
    }).setRequired(true))
    .addIntegerOption(option => option.setName('limit').setNameLocalizations({
        ru: 'количество'
    }).setDescription('The information output limit').setDescriptionLocalizations({
        ru: 'Введите количество выводимой информации'
    }).setMaxValue(10).setMinValue(1)),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const limit = interaction.options.getInteger('limit') || 5;
            const user = interaction.options.getString('user');
            const data = await getInfoScrobbler('user.getInfo', user, limit);
            if (!data?.user?.name) return await interaction.reply({ content: lang.sUser + user + lang.sUserNotFound, ephemeral: true });
            const userInfo = new ButtonBuilder(interaction.client.buttons.get('userInfo').data.data)
                .setLabel(lang.sBasicInfo)
            const recentTracks = new ButtonBuilder(interaction.client.buttons.get('recentTracks').data.data)
                .setLabel(lang.lastTracksListened)
            const topTracks = new ButtonBuilder(interaction.client.buttons.get('topTracks').data.data)
                .setLabel(lang.topTracksListened)
            const deleteButton = new ButtonBuilder(interaction.client.buttons.get('deleteMessage').data.data)
                .setLabel(lang.deleteMessage);
            const buttons = new ActionRowBuilder()
            .addComponents(userInfo, recentTracks, topTracks, deleteButton);
            const userEmbed = new EmbedBuilder()
            .setTitle(user)
            .setColor([44, 45, 49])
            .setDescription(lang.sMethod)
            .setFields(
                {name: lang.count, value: String(limit), inline: true},
                {name: lang.user, value: data?.user?.name, inline: true}
            )
            .setFooter({
                text: interaction.user.id,
                iconURL: interaction.user.displayAvatarURL() || undefined
            })
            .setTimestamp();
            await interaction.reply({
                components: [buttons],
                embeds: [userEmbed]
            });
        } catch (error) {
            console.error(error);
        }
    }
}
async function getInfoScrobbler(method, user, limit) {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=${method}&user=${user}&api_key=${process.env.lastFm}&format=json&limit=${limit}`);
    return await response.json();
}