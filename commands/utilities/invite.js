const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setNameLocalizations({
            ru: 'приглашение'
        })
        .setDescription('View information about the link or the invitation code')
        .setDescriptionLocalizations({
            ru: 'Посмотреть информацию об ссылке или код приглашение'
        })
        .addStringOption(option => option.setName('invite').setNameLocalizations({
            ru: 'приглашение'
        }).setDescription('Enter the link or the invitation code').setDescriptionLocalizations({
            ru: 'Введите ссылку или код приглашение'
        }).setRequired(true))
        .addBooleanOption(option => option.setName('hide').setNameLocalizations({
            ru: 'скрыть'
        }).setDescription('hide a message from other users').setDescriptionLocalizations({
            ru: 'скрыть сообщение от других пользователей'
        })),
    async execute (interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const invite = interaction.options.getString('invite');
        const visible = interaction.options.getBoolean('hide') || false;
        try {
            const infoInvite = await interaction.client.fetchInvite(invite);
            const embed = new EmbedBuilder()
            .setTitle(infoInvite.guild.name + ` (${infoInvite.guild.id})`)
            .setColor(0xff0000)
            .setThumbnail(infoInvite.guild.iconURL())
            .setDescription(infoInvite.guild.description)
            .setFields(
                {name: lang.members, value: `${infoInvite.memberCount}`, inline: true},
                {name: lang.code, value: '`' + infoInvite.code + '`', inline: true},
                {name: lang.boosters, value: String(infoInvite.guild.premiumSubscriptionCount), inline: true},
                {name: lang.inviter, value: infoInvite.inviterId ? `<@${infoInvite.inviterId}>` : lang.notFound, inline: true},
                {name: lang.verifyLevel, value: '```' + checkLevelVerefication(String(infoInvite.guild.verificationLevel)) + '```', inline: true},
                {name: lang.invchannel, value: `
                **🆔 ${lang.id}**: ${infoInvite.channel.id}
                **🏷️ ${lang.name}**: \`#${infoInvite.channel.name}\`
                **🔞 ${lang.nsfw}?**: ${getBoolean(infoInvite.channel.nsfw)}
                `, inline: false},
            );
            await interaction.reply({ embeds: [embed], ephemeral: visible });
        } catch (error) {
            console.log(error)
            const embed = new EmbedBuilder()
            .setTitle(invite + ' ' + lang.notFound)
            .setColor(0xff0000)
            .setDescription(lang.InvUrlNotFound);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        function getBoolean(bool) {
            switch (bool) {
                case true:
                    return '✅ ' + lang.yesR;
                case false:
                    return '❌ ' + lang.noR;
                default:
                    return key;
            }
        }
        function checkLevelVerefication(level) {
            switch (level) {
                case '0':
                    return lang.none;
                case '1':
                    return lang.low;
                case '2':
                    return lang.medium;
                case '3':
                    return lang.high;
                case '4':
                    return lang.vhigh;
                default:
                    return lang.notFound;
            }
        }
    }
}