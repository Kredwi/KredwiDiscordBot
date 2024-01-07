const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const getLocaleFile = require('../../locale.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('removerole')
    .setNameLocalizations({
        ru: 'убратьроль'
    })
    .setDescription('Remove role for the member')
    .setDescriptionLocalizations({
        ru: 'Убрать роль у участника'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option => option.setName('member').setNameLocalizations({
        ru: 'участник'
    }).setDescription('select the member').setDescriptionLocalizations({
        ru: 'выберите участника'
    }).setRequired(true))
    .addRoleOption(option => option.setName('role').setNameLocalizations({
        ru: 'роль'
    }).setDescription('select the role').setDescriptionLocalizations({
        ru: 'выберите роль'
    }).setRequired(true)),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        try {
            await member.roles.remove(role);
            await interaction.reply({ content: lang.deletedRole, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: lang.noAccessToRole.replace(/krdwrole/gi, role.name), ephemeral: true });
        }
    }
}