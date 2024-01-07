const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const getLocaleFile = require('../locale.js');

module.exports = {
    data: new ButtonBuilder()
    .setCustomId('userInfo')
    .setLabel('User info')
    .setStyle(ButtonStyle.Secondary),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            if (interaction.member.user.id == interaction.message.embeds[0].data.footer.text) {
                const user = interaction.message.embeds[0].data.title;
                const limit = interaction.message.embeds[0].data.fields[0].value;
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${user}&api_key=${process.env.lastFm}&format=json&limit=${limit}`);
                const data = await response.json();
                const channel = interaction.member.guild.channels.cache.get(interaction.channelId);
                const response2 = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${user}&api_key=${process.env.lastFm}&format=json&limit=1`);
                const recentTracks = await response2.json();
                const nowplaying = recentTracks.recenttracks.track[0];
                const deleteButton = new ButtonBuilder()
                .setCustomId('deleteMessage')
                .setStyle(ButtonStyle.Danger)
                .setLabel(lang.deleteMessage);
                const buttons = new ActionRowBuilder()
                .setComponents(deleteButton);
                const embedScrobbler = new EmbedBuilder()
                .setTitle(lang.infoFor +  data.user.name)
                .setColor(0xff0000)
                .setThumbnail(data.user.image[3]['#text'] + '?size=512')
                .setFields(
                    {name: lang.listened, value: `
                    ${lang.tracks} ${data.user.playcount}
                    ${lang.artist} ${data.user.artist_count}
                    ${lang.album} ${data.user.album_count}`, inline: true},
                    {name: lang.country, value: data.user.country, inline: true},
                nowplaying['@attr']?.nowplaying ? {name: lang.listening, value: `${nowplaying.artist['#text']} - ${nowplaying.name}`} : {name: lang.listening, value: lang.NowPlayingNot},
                )
                .setFooter({
                    text: interaction.message.embeds[0].data.footer.text,
                    iconURL: interaction.message.embeds[0].data.footer.icon_url
                })
                .setTimestamp();
                await interaction.message.delete();
                await channel.send({ embeds: [embedScrobbler], components: [buttons] });
            } else return await interaction.reply({ content: lang.notPermissionControlMessage, ephemeral: true });
        } catch (error) {
            console.error(error);
        }
    }
}