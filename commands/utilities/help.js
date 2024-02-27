const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setNameLocalizations({
        ru: 'помощь'
    })
    .setDescription('Even if you\'re drunk, I\'ll help you')
    .setDescriptionLocalizations({
        ru: 'Поможет даже если вы пьяный'
    }),
    async execute(interaction) {
        try {
            const getCommands = await interaction.client.application?.commands.fetch();
            const commands = getCommands.map(command => `</${command.name}:${command.id}>`);
            const lang = await getLocaleFile(interaction.guildLocale);
            const embedHelp = new EmbedBuilder()
            .setColor([44, 45, 49])
            .setTitle(lang.helpWith + interaction.client.user.username)
            .setDescription('*' + interaction.client.user.username + '*' + lang.helpCommand.description.value)
            .setFields({name: lang.allcommands + ` (${commands.length})`, value: commands.join(' ')})
            .setFooter({
                text: interaction.user.id,
                iconURL: interaction.user.displayAvatarURL() || undefined
            })
            .setTimestamp();
            const funnyButton = new ButtonBuilder(interaction.client.buttons.get('fnycmd').data.data)
            .setLabel(lang.helpCommand.funny.name)
            const moderationButton = new ButtonBuilder(interaction.client.buttons.get('mdrcmd').data.data)
            .setLabel(lang.helpCommand.moderaton.name)
            const socialsButton = new ButtonBuilder(interaction.client.buttons.get('sclcmd').data.data)
            .setLabel(lang.helpCommand.socials.name)
            const utillityButton = new ButtonBuilder(interaction.client.buttons.get('utlcmd').data.data)
            .setLabel(lang.helpCommand.utilities.name)
            const deleteButton = new ButtonBuilder(interaction.client.buttons.get('deleteMessage').data.data)
            .setLabel(lang.deleteMessage);
            const buttons = new ActionRowBuilder()
            .addComponents(funnyButton, moderationButton, socialsButton, utillityButton, deleteButton);
            await interaction.reply({ embeds: [embedHelp], components: [buttons] });   
        } catch (error) {
            console.error(error);
        }
    }
}