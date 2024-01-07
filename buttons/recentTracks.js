const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const getLocaleFile = require('../locale.js');

module.exports = {
    data: new ButtonBuilder()
    .setCustomId('recentTracks')
    .setLabel('Recent Tracks')
    .setStyle(ButtonStyle.Secondary),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            if (interaction.member.user.id == interaction.message.embeds[0].data.footer.text) {
                const user = interaction.message.embeds[0].data.title;
                const limit = interaction.message.embeds[0].data.fields[0].value;
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${user}&api_key=${process.env.lastFm}&format=json&limit=${limit}`);
                const data = await response.json();
                const channel = interaction.member.guild.channels.cache.get(interaction.channelId);
                const tracks = data.recenttracks.track;
                const trackList = tracks.map((track, index = 0) => `${index + 1}. **${track.artist['#text']}** - *${track.name}*`);
                const deleteButton = new ButtonBuilder()
                .setCustomId('deleteMessage')
                .setStyle(ButtonStyle.Danger)
                .setLabel(lang.deleteMessage);
                const buttons = new ActionRowBuilder()
                .setComponents(deleteButton);
                const embedScrobbler = new EmbedBuilder()
                .setTitle(lang.lastTracksListened + ' ' + data.recenttracks['@attr'].user)
                .setColor(0xff0000)
                .setFields({name: lang.listened, value: `${trackList.join('\n')}`, inline: true})
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