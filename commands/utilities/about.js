const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getLocaleFile = require('../../locale.js');
const moment = require("moment");
const package = require('../../package.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('about')
    .setNameLocalizations({
        ru: 'обомне'
    })
    .setDescription('Get information for this bot')
    .setDescriptionLocalizations({
        ru: 'Узнать информацию об Боте'
    })
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        try {
            const visible = interaction.options.getBoolean('hide') || false;
            let servers = 0;
            const user = interaction.client.user;
            const botAvatar = await user.displayAvatarURL();
            await interaction.client.guilds.cache.map(() => servers++);
            const dateBuild = "1709023679";
            const embed = new EmbedBuilder()
            .setAuthor({
                name: user.username + (user.discriminator > 1 ? '#' + user.discriminator : ''),
                iconURL: botAvatar,
                url: lang.sourceCode
            })
            .setColor([44, 45, 49])
            .setThumbnail(botAvatar)
            .setDescription('**' + user.username + '** - ' + lang.botDescription)
            .setTimestamp();
            const fields = lang.aboutFields.map(field => ({
                name: field.name,
                value: field.value
                .replace(/krdwbuildverssg/gi, package.version)
                .replace(/krwnumbersg/gi, String(servers))
                .replace(/krwstatussg/gi, getMemberStatus(interaction.client.presence.status))
                .replace(/krdwbuilddatesg/gi, dateBuild),
                inline: field?.inline
            }));
            embed.setFields(fields);
            await interaction.reply({ embeds: [embed], ephemeral: visible });
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
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: lang.cmdNotWork, ephemeral: true });
        }
    }
}