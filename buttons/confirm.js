const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new ButtonBuilder()
    .setCustomId('confirm')
    .setStyle(ButtonStyle.Danger)
    .setLabel('click'),
    async execute(interaction) {
        // try {
        // console.log(interaction.message.interaction);
        // const button = new ButtonBuilder()
        // .setCustomId('confirm')
        // .setStyle(ButtonStyle.Danger)
        // .setLabel('click');

        // const buttons = new ActionRowBuilder()
        // .addComponents(button);

        // await interaction.message.interaction.editReply({ content: 'Здарова1', components: [buttons] });
        // } catch (err) {
        //     console.log(err);
        // }
    }
}