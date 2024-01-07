const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('steam')
    .setNameLocalizations({
        ru: 'стим'
    })
    .setDescription('Get steam app')
    .setDescriptionLocalizations({
        ru: 'Получить информацию об приложении'
    })
    .addStringOption(option => option.setName('app').setNameLocalizations({
        ru: 'приложение'
    }).setDescription('appID and App name').setDescriptionLocalizations({
        ru: 'ID приложение или название'
    }).setRequired(true))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        try {
            const visible = interaction.options.getBoolean('hide') || false;
            await interaction.reply({ content: lang.wait, ephemeral: visible})
            const game = interaction.options.getString('app').toLowerCase();
            const gameList = await getSteamAPI('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
            const apps = await gameList?.applist?.apps.filter(app => app?.appid == game || app?.name.toLowerCase() == game);
            if (apps.length <= 0) return await interaction.editReply({ content: lang.gameNotFound, ephemeral: true });
            const dataApp = await getSteamAPI('https://store.steampowered.com/api/appdetails?appids=' + apps[0].appid + '&cc=us');
            const app = dataApp[String(apps[0].appid)];
            if (app.success) {
                const embedApp = new EmbedBuilder()
                .setTitle(lang.steamAPP + app?.data?.name)
                .setColor(0xff0000)
                .setThumbnail(app?.data?.capsule_imagev5)
                .setDescription(app?.data?.short_description)
                .setFields(
                    {name: lang.platforms, value: `
                    Windows: **${await boolean(app?.data?.platforms.windows, interaction.guildLocale)}**
                    Linux: **${await boolean(app?.data?.platforms.linux, interaction.guildLocale)}**
                    Mac: **${await boolean(app?.data?.platforms.mac, interaction.guildLocale)}**
                                        `, inline: true},
                    {name: lang.price, value: app?.data?.is_free ? lang.free : `
                    ${lang.priceIn} **${app?.data?.price_overview?.currency}**
                    ${lang.notDiscount} **${app?.data?.price_overview?.initial_formatted || lang.notDiscount}**
                    ${lang.discount} **${app?.data?.price_overview?.final_formatted}**
                `, inline: true},
                {name: lang.support, value: `${lang.site}\n${app?.data?.support_info?.url ? app?.data?.support_info?.url : lang.no}\n${lang.mail}\n${app?.data?.support_info?.email ? app?.data?.support_info?.email : lang.no}`, inline: true},
                    {name: lang.developer, value: app?.data?.developers.join('\n'), inline: true},
                    {name: lang.publisher, value: app?.data?.publishers.join('\n'), inline: true},
                    {name: lang.releaseDate, value: app?.data?.release_date?.coming_soon ? lang.releaseDateNot : '`' + app?.data?.release_date?.date + '`', inline: true},
                    {name: lang.achievements, value: String(app?.data?.achievements?.total > 0 ? app?.data?.achievements?.total : 0), inline: true},
                    {name: lang.recommendations, value: String(app?.data?.recommendations?.total), inline: true}
                );
                await interaction.editReply({ content : '', embeds: [embedApp], ephemeral: visible });
            } else await interaction.editReply({ content: lang.gameNotFound, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: lang.gameNotFound, ephemeral: true });
        }
    }
}
async function getSteamAPI(url) {
    const response = await fetch(url);
    return await response.json();
}
async function boolean(key, lang = 'en-us') {
    const langb = await getLocaleFile(lang);
    switch (key) {
        case true:
            return langb.accessYes;
        case false:
            return langb.accessNo;
        default:
            return key;
    }
}