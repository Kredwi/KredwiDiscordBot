const { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder} = require('discord.js');
const getLocaleFile = require('../locale.js');

module.exports = {
    data: new ButtonBuilder()
    .setCustomId('sclcmd')
    .setEmoji('🪩')
    .setStyle(ButtonStyle.Primary),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        if (interaction.message.embeds[0].data.footer.text != interaction.user.id) {
            await interaction.reply({ content: lang.notPermissionControlMessage, ephemeral: true });
        } else {
            const embedUtil = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(lang.helpCommand.socials.description)
            .setFields(lang.helpCommand.socials.commands)
            .setFooter({
                text: interaction.message.embeds[0].data.footer.text,
                iconURL: interaction.message.embeds[0].data.footer.icon_url
            })
            .setTimestamp();
            const funnyButton = new ButtonBuilder(interaction.client.buttons.get('fnycmd').data.data)
            .setLabel(lang.helpCommand.funny.name)
            .setDisabled(false);
            const moderationButton = new ButtonBuilder(interaction.client.buttons.get('mdrcmd').data.data)
            .setLabel(lang.helpCommand.moderaton.name)
            .setDisabled(false);
            const socialsButton = new ButtonBuilder(interaction.client.buttons.get('sclcmd').data.data)
            .setLabel(lang.helpCommand.socials.name)
            .setDisabled(true);
            const utillityButton = new ButtonBuilder(interaction.client.buttons.get('utlcmd').data.data)
            .setLabel(lang.helpCommand.utilities.name)
            .setDisabled(false);
            const deleteButton = new ButtonBuilder(interaction.client.buttons.get('deleteMessage').data.data)
            .setLabel(lang.deleteMessage);
            const buttons = new ActionRowBuilder()
            .addComponents(funnyButton, moderationButton, socialsButton, utillityButton, deleteButton);
            await interaction.update({ embeds: [embedUtil], components: [buttons] });  
        }
    }
}