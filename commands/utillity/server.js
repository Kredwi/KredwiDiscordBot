const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('server')
    .setNameLocalizations({
        ru: 'сервер'
    })
    .setDescription('Information for Server')
    .setDescriptionLocalizations({
        ru: 'Информация о сервере'
    })
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            const visible = interaction.options.getBoolean('hide') || false;
            const server = interaction.guild;
            const embedServerInfo = new EmbedBuilder()
            .setTitle(server.name.toUpperCase())
            .setColor(0xff0000)
            .setDescription(server.description ? lang.aboutOfGuild + server.description : lang.aboutOfGuildNotFound)
            .setThumbnail(server.iconURL())
            .addFields(
                {name: lang.owner, value: `${await server.fetchOwner()}`, inline: true},
                {name: lang.country, value: String(server?.preferredLocale), inline: true},
                {name: lang.members, value: String(server?.memberCount), inline: true},
                {name: lang.boosters, value: String(server?.premiumSubscriptionCount), inline: true},
                {name: lang.timeAFK, value: String(server?.afkTimeout) + lang.secTime, inline: true},
                {name: lang.createdAt, value: '<t:' + moment(server.createdAt).unix() + ':D>\n' + '<t:' + moment(server.createdAt).unix() +':R>', inline: true},
                server?.rulesChannelId ? {name: lang.rules, value: `<#${server.rulesChannelId}>`, inline: true} : {name: lang.rules, value: lang.notFound, inline: true},
                server?.afkChannelId ? {name: lang.afkChannel, value: `<#${server.afkChannelId}>`, inline: true} : {name: lang.afkChannel, value: lang.notFound, inline: true},
                server?.publicUpdatesChannelId ? {name: lang.updateChannel, value: `<#${server.publicUpdatesChannelId}>`, inline: true} : {name: lang.updateChannel, value: lang.notFound, inline: true},
                server?.safetyAlertsChannelId ? {name: lang.dangerChannel, value: `<#${server.safetyAlertsChannelId}>`, inline: true} : {name: lang.dangerChannel, value: lang.notFound, inline: true},
                server?.systemChannelId ? {name: lang.systemChannel, value: `<#${server.systemChannelId}>`, inline: true} : {name: lang.systemChannel, value: lang.notFound, inline: true}
            )
            .setFooter({ text: lang.discordServer + server.name })
            .setTimestamp();
            await interaction.reply({ embeds: [embedServerInfo], ephemeral: visible });   
        } catch (error) {
            console.log(error);
        }
    }
}