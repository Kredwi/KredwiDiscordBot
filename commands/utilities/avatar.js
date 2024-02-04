const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setNameLocalizations({
            ru: 'аватар'
        })
        .setDescription('View the user\'s avatar')
        .setDescriptionLocalizations({
            ru: 'Посмотреть аватарку пользователя'
        })
        .addUserOption(option => option.setName('user').setNameLocalizations({
            ru: 'пользователь'
        }).setDescription('view the user\'s avatar').setDescriptionLocalizations({
            ru: 'посмотреть аватарку пользователя'
        }))
        .addBooleanOption(option => option.setName('hide').setNameLocalizations({
            ru: 'скрыть'
        }).setDescription('hide a message from other users').setDescriptionLocalizations({
            ru: 'скрыть сообщение от других пользователей'
        })),
    async execute (interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const user = interaction.options.getUser('user');
        const visible = interaction.options.getBoolean('hide') || false;
        const replyEmbed = async (username, avatarUrl, isVisible) => {
            const avatarEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(lang.avatarMessage + username)
            .setImage(avatarUrl + '?size=512')
            .setFooter({ text: lang.discordServer + interaction.guild.name })
            .setTimestamp();
            await interaction.reply({ embeds: [avatarEmbed], ephemeral: isVisible ? true : false });
        }
        user ?
        replyEmbed(user.username, user.displayAvatarURL(), visible) :
        replyEmbed(interaction.user.username, interaction.user.displayAvatarURL(), visible);
    }
}