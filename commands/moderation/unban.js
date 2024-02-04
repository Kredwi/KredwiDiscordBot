const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setNameLocalizations({
        ru: 'разбан'
    })
    .setDescription('Unban/Unblock the user')
    .setDescriptionLocalizations({
        ru: 'Разбанить/Разблокировать пользователя'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('enter the member ID or alias (without numbers after # and without #)').setDescriptionLocalizations({ // локализация
        ru: 'введите ID участника или псевдоним (без цифр после # и без #)'
    }).setRequired(true)),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const userTag = interaction.options.getString('member');
            const users = await interaction.guild.bans.fetch()
            .then(async bans => {
                return bans.map(member => {
                    while (
                        member.user.username == userTag ||
                        member.user.id == userTag
                    ) return member.user;
                });
            });
            const user = users.filter(user => user != undefined);
            if (!user[0]) return await interaction.reply({ content: userTag + lang.userNotBanned, ephemeral: true});
            interaction.guild.members.unban(user[0]);
            const embedUnban = new EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
                name: user[0].discriminator > 0 ? user[0].username + '#' + user[0].discriminator : user[0].username,
                iconURL: user[0].displayAvatarURL(),
            })
            .setTitle(lang.userUnbanned)
            .setDescription(lang.user + '<@' + user[0].id + '>')
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [embedUnban], ephemeral: false });
        } catch (error) {
            console.error(error);
        }
    }
}