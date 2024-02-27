const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');
const { lang } = require('moment/moment.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setNameLocalizations({
        ru: 'кик'
    })
    .setDescription('Kick the user')
    .setDescriptionLocalizations({
        ru: 'Кикнуть/Выгнать пользователя'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('select a member').setDescriptionLocalizations({
        ru: 'выберите участника'
    }).setRequired(true))
    .addStringOption(option => option.setName('reason').setNameLocalizations({
        ru: 'причина'
    }).setDescription('enter the reason for the kick').setDescriptionLocalizations({
        ru: 'введите причину кика'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        try {
            const user = interaction.options.getUser('member');
            const member = interaction.guild.members.cache.get(user.id);
            const reason = interaction.options.getString('reason') || lang.notReason;
            const embedKick = new EmbedBuilder()
            .setColor(0, 204, 0)
            .setAuthor({
                name: user.discriminator > 0 ? user.username + '#' + user.discriminator : user.username,
                iconURL: user.displayAvatarURL(),
            })
            .setTitle(lang.userKicked)
            .setFields(
                {name: lang.user, value: '<@' + user.id + '>', inline: true},
                {name: lang.reason, value: interaction.options.getString('reason') || lang.notReason, inline: false}
            )
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            if (user.id != interaction.guild.ownerId) {
                if (!user.bot) return await interaction.reply({ content: lang.botNotAccess, ephemeral: true });
                    await member.kick(reason);
                    await interaction.reply({ embeds: [embedKick], ephemeral: false });
            } else await interaction.reply({ content: lang.notKickedOwnerGuild, ephemeral: true });   
        } catch (error) {
            await interaction.reply({ content: lang.notPermissionUser, ephemeral: true });
        }
    }
}