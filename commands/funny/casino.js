const { SlashCommandBuilder } = require('discord.js');
const getLocaleFile = require('../../locale.js');

const randomInt = (icons) => Math.floor(Math.random() * (icons.length - 0) + 0);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('casino')
    .setNameLocalizations({
        ru: 'казино'
    })
    .setDescription('A regular casino where you can test your luck')
    .setDescriptionLocalizations({
        ru: 'Обычное казино, где можно испытать свою удачу'
    })
    .addNumberOption(option => option.setName('slots').setNameLocalizations({
        ru: 'слоты'
    }).setDescription('enter the number of slots you want to spin at once').setDescriptionLocalizations({
        ru: 'введите количество слотов которое вы хотите прокрутить разом'
    }).setMinValue(1).setMaxValue(3))
    .addBooleanOption(option => option.setName('hide').setNameLocalizations({
        ru: 'скрыть'
    }).setDescription('hide a message from other users').setDescriptionLocalizations({
        ru: 'скрыть сообщение от других пользователей'
    })),
    async execute(interaction) {
        const lang = await getLocaleFile(interaction.guildLocale);
        const icons = ['✅', '🪙', '💰', '🧱', '☑️', '🔓', '💳', '💸'];
        const visible = interaction.options.getBoolean('hide') || false;
        const slots = interaction.options.getNumber('slots') || 1;
        let casinoResult = [];
        let casinoWin = false;
        for (let i = 0; i < slots; i++) {
            casinoResult[i] = [ icons[randomInt(icons)], icons[randomInt(icons)], icons[randomInt(icons)] ];
        }
        for (const casino of casinoResult) if (casino[0] == casino[1] && casino[1] == casino[2]) casinoWin = true;
        const message = casinoResult.map(result => `${result[0]} ${result[1]} ${result[2]}`);
        if (casinoWin) {
            interaction.reply({
                content: `# ${lang.yourWin} 👑:\n${message.join("\n")}\n<@${interaction.user.id}>`,
                ephemeral: false 
            });
        } else {
            interaction.reply({
                content: `### ${lang.yourLose}:\n${message.join("\n")}`,
                ephemeral: visible 
            });
        }
    }
}