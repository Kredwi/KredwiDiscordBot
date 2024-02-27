const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const moment = require('moment');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('github')
    .setNameLocalizations({
        ru: 'гитхаб'
    })
    .setDescription('Information from github')
    .setDescriptionLocalizations({
        ru: 'Информация с гитхаба'
    })
    .addStringOption(option => option
        .setName('user')
        .setNameLocalizations({
            ru: 'пользователь'
        })
        .setDescription('Enter the user name')
        .setDescriptionLocalizations({
            ru: 'Введите имя пользователя'
        }))
        .addBooleanOption(option => option.setName('hide').setNameLocalizations({
            ru: 'скрыть'
        }).setDescription('hide a message from other users').setDescriptionLocalizations({
            ru: 'скрыть сообщение от других пользователей'
        })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const user = interaction.options.getString('user') || 'kredwi';
            const response = await fetch('https://api.github.com/users/' + user);
            const data = await response.json();
            const visible = interaction.options.getBoolean('hide') || false;
            const company = data?.company || '`None`';
            const location = data?.location || '`None`';
            if (data?.message != 'Not Found') {
                const embedGitHub = new EmbedBuilder()
                .setTitle(lang.InfoFromGitHub)
                .setColor([44, 45, 49])
                .setDescription(data?.bio)
                .setThumbnail(data?.avatar_url)
                .setFields(
                    {name: lang.name, value: data?.login, inline: true},
                    {name: lang.company, value: company, inline: true},
                    {name: lang.country, value: location, inline: true},
                    {name: lang.numbers, value: `
                    ${lang.publicRepos} \`${data?.public_repos}\`
                    ${lang.publicGists} \`${data?.public_gists}\`
                    ${lang.followers} \`${data?.followers}\`
                    ${lang.following} \`${data?.following}\`
                    `},
                    {name: lang.createdAt, value: '<t:' + moment(data?.created_at).unix() + ':f>\n' + '<t:' + moment(data?.created_at).unix() + ':R>', inline: true},
                    {name: lang.updatedAt, value: '<t:' + moment(data.updated_at).unix() + ':f>\n' + '<t:' + moment(data?.updated_at).unix() + ':R>', inline: true},
                    data.twitter_username ? {name: 'Twitter', value: '[@' + data?.twitter_username + ']' + '(https://twitter.com/' + data?.twitter_username + ')', inline: true} : {name: 'Twitter', value: '`None`'}
                )
                .setFooter({ text: lang.discordServer + interaction.guild.name })
                .setTimestamp();
                const urlButton = new ButtonBuilder()
                .setURL(data?.html_url)
                .setLabel(lang.profile + data?.login)
                .setStyle(ButtonStyle.Link);
                const buttons = new ActionRowBuilder()
                .setComponents(urlButton)
                await interaction.reply({ embeds: [embedGitHub], components: [buttons], ephemeral: visible });
            }
            else await interaction.reply({ content: lang.userNameNot, ephemeral: true });
        } catch (error) {
            console.error(error);
        }
    }
}