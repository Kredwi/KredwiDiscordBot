const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        async function getUserInfo(username, avatarUrl, userAccountCreate, userGuildJoin, displayName, discriminator) {
            const userEmbed = new EmbedBuilder()
            .setTitle(username.toUpperCase())
            .setColor(0xff0000)
            .setThumbnail(avatarUrl)
            .setDescription(`
            ${displayName ? lang.displayName + displayName : []}
            ${lang.username} ${username}${discriminator >= 1 ? '#' + discriminator : ''}
            `)
            .setFields(
                {name: lang.createdAtU, value: '<t:' + moment(userAccountCreate).unix() + ':D>\n' + '<t:' + moment(userAccountCreate).unix() + ':R>', inline: true},
                {name: lang.joinGuildAt, value: '<t:' + moment(userGuildJoin).unix() + ':D>\n' + '<t:' + moment(userGuildJoin).unix() + ':R>', inline: true}
            )
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [userEmbed], ephemeral: visible });
        }
        user ? getUserInfo(
            user.username,
            user.displayAvatarURL(),
            user.createdAt,
            member.joinedTimestamp,
            user.globalName,
            user.discriminator
        ) : getUserInfo(
            interaction.user.username,
            interaction.user.displayAvatarURL(),
            interaction.user.createdAt,
            interaction.member.joinedTimestamp,
            interaction.user.globalName,
            interaction.user.discriminator
        );
    }
}