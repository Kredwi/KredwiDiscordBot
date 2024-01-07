const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalizations({
        ru: 'бан'
    })
    .setDescription('Ban the user')
    .setDescriptionLocalizations({
        ru: 'Забанить/Заблокировать пользователя'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('select a member').setDescriptionLocalizations({
        ru: 'выберите участника'
    }).setRequired(true))
    .addStringOption(option => option.setName('reason').setNameLocalizations({
        ru: 'причина'
    }).setDescription('enter the reason for the ban').setDescriptionLocalizations({
        ru: 'введите причину бана'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const user = interaction.options.getUser('member');
        const guild = interaction.guild;
        const reason = interaction.options.getString('reason') || lang.notReason;
        const embedBan = new EmbedBuilder()
        .setColor(0xff0000)
        .setAuthor({
            name: user.discriminator > 0 ? user.username + '#' + user.discriminator : user.username,
            iconURL: user.displayAvatarURL(),
        })
        .setTitle(lang.userBanned)
        .setFields(
            {name: lang.user, value: '<@' + user.id + '>', inline: true},
            {name: lang.reason, value: interaction.options.getString('reason') || lang.notReason, inline: false}
        )
        .setFooter({ text: lang.discordServer + interaction.guild.name })
        .setTimestamp();
        try {
            if (user.id != interaction.guild.ownerId) {
                if (guild.members.cache.get(user.id).roles.highest.comparePositionTo(interaction.member.roles.highest) <= 0) return await interaction.reply({ content: lang.notPermissionUser, ephemeral: true });
                guild.members.ban(user, { reason });
                await interaction.reply({ embeds: [embedBan], ephemeral: false });
            } else await interaction.reply({ content: lang.notBannedOwnerGuild, ephemeral: true });   
        } catch (error) {
            console.log(error)
        }
    }
}