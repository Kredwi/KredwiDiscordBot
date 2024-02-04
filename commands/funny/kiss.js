const { SlashCommandBuilder } = require("discord.js");
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kiss')
    .setNameLocalizations({
        ru: 'поцеловать'
    })
    .setDescription('Kiss the a member')
    .setDescriptionLocalizations({
        ru: 'Поцеловать участника'
    }).addUserOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('Select the participant you wanted to kiss').setDescriptionLocalizations({
        ru: 'Выберите участника которого вы хотели поцеловать'
    }).setRequired(true)),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        try {
            const user = interaction.options.getUser('member');
            if (interaction.user.id != user.id)
                await interaction.reply({ content: `😘 <@${interaction.user.id}> ` + lang.kissed + ' ' + user.username
                + (user.discriminator > 1 ? '#' + user.discriminator : '') });
            else
                await interaction.reply({ content: `😘 <@${interaction.user.id}> ` + lang.himselfkiss })
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: lang.cmdNotWork, ephemeral: true });
        }
    }
}