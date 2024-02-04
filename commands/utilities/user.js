const { SlashCommandBuilder, EmbedBuilder, Activity } = require('discord.js');
const moment = require('moment');
const getLocaleFile = require('../../locale.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setNameLocalizations({
        ru: 'юзер'
    })
    .setDescription('Information for Server')
    .setDescriptionLocalizations({
        ru: 'Информация о пользователе'
    })
    .addUserOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('select a member'))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const user = interaction.options.getUser('member');
        const member = interaction.options.getMember('member');
        const visible = interaction.options.getBoolean('hide') || false;
        async function getUserInfo(
            memberActivity,
            username,
            avatarUrl,
            userAccountCreate,
            userGuildJoin,
            displayName,
            discriminator
        ) {
            const activities = memberActivity?.activities?.map(activity => ({
                name: getTypeActivity(activity.type) + (activity?.name == 'Custom Status' && activity.type == 4 ? lang.customStatus : activity?.name),
                value: (activity.emoji?.name ? activity.emoji?.id ? `<${activity.emoji?.name}:${activity.emoji?.id}>` : activity.emoji?.name : '')
                + ' ' + (activity?.state == null ? lang.notFound : activity.state)
                + '\n' + (activity?.details == null ? '' : activity.details)
                + '\n' + (activity?.timestamps?.start ? `<t:${moment(activity?.timestamps.start).unix()}:R>`:  '')
                + '\n' + (activity?.timestamps?.end ? `<t:${moment(activity?.timestamps?.end).unix()}:R>`:  ''),
                inline: false
            })) || [];
            const userEmbed = new EmbedBuilder()
            .setTitle(username.toUpperCase())
            .setColor(0xff0000)
            .setThumbnail(avatarUrl)
            .setDescription(`
            ${displayName ? lang.displayName + displayName : []}
            ${lang.status} ${getMemberStatus(memberActivity?.status)}
            ${lang.device} ${memberActivity?.clientStatus ? Object.keys(memberActivity?.clientStatus).map(device => getDeviceName(device)).join(', ') : lang.notFound}
            ${lang.username} ${username}${discriminator >= 1 ? '#' + discriminator : ''}
            `)
            .setFields(
                {name: lang.createdAtU, value: '<t:' + moment(userAccountCreate).unix() + ':D>\n' + '<t:' + moment(userAccountCreate).unix() + ':R>', inline: true},
                {name: lang.joinGuildAt, value: '<t:' + moment(userGuildJoin).unix() + ':D>\n' + '<t:' + moment(userGuildJoin).unix() + ':R>', inline: true},
                ...activities
            )
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [userEmbed], ephemeral: visible });
        }
        function getTypeActivity(type) {
            switch (type) {
                case 0:
                    return lang.playing;
                case 1:
                    return lang.streaming;
                case 2:
                    return lang.listeningTo;
                case 3:
                    return lang.watching;
                case 4:
                    return '';
                case 5:
                    return lang.competing;
                default:
                    return '';
            }
        }
        function getMemberStatus(status) {
            switch (status) {
                case 'online':
                    return lang.online;
                case 'idle':
                    return lang.idle;
                case 'dnd':
                    return lang.dnd;
                default:
                    return lang.offline;
            }
        }
        function getDeviceName(device) {
            switch (device) {
                case 'desktop':
                    return lang.desktop;
                case 'web':
                    return lang.web;
                case 'mobile':
                    return lang.mobile;
                case 'xbox':
                    return lang.xbox;
                case 'playstation':
                    return lang.playstation;
                default:
                    return device;
            }
        }
        user ? getUserInfo(
            member.presence,
            user.username,
            user.displayAvatarURL(),
            user.createdAt,
            member.joinedTimestamp,
            user.globalName,
            user.discriminator
        ) : getUserInfo(
            interaction.member.presence,
            interaction.user.username,
            interaction.user.displayAvatarURL(),
            interaction.user.createdAt,
            interaction.member.joinedTimestamp,
            interaction.user.globalName,
            interaction.user.discriminator
        );
    }
}