const { ButtonBuilder, ButtonStyle } = require('discord.js');
const getLocaleFile = require('../locale.js');
module.exports = {
    data: new ButtonBuilder()
    .setCustomId('deleteMessage')
    .setEmoji('🗑️')
    .setStyle(ButtonStyle.Danger),
    async execute(interaction) {
        try {
            const lang = await getLocaleFile(interaction.guildLocale);
            if (
                interaction.member.user.id == interaction.message.embeds[0].data.footer.text ||
                interaction.member.user.id == interaction.member.guild.ownerId
            ) await interaction.message.delete()
            else return await interaction.reply({ content: lang.notPermissionControlMessage, ephemeral: true });
        } catch (error) {
            console.log(error);
        }
    }
}