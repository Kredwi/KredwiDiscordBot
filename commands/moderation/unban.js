const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js'); // Подключение библиотеки Discord.JS
const getLocaleFile = require('../../locale.js'); // Подключение файла который отвечает за локализацию

module.exports = { // экспорт модуля для других файлов
    data: new SlashCommandBuilder() // Запуск класса SlashCommandBuilder
    .setName('unban') // Название команды
    .setNameLocalizations({ // Название команды в локализации
        ru: 'разбан'
    })
    .setDescription('Unban/Unblock the user') // Описание команды
    .setDescriptionLocalizations({ // Описание команды в локализации
        ru: 'Разбанить/Разблокировать пользователя'
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Установка прав для вывода команды
    .addStringOption(option => option.setName('member').setNameLocalizations({ // Пользователь должен ввести тут что-то лень писать
        ru: 'участник'
    }).setDescription('enter the member ID or alias (without numbers after # and without #)').setDescriptionLocalizations({ // локализация
        ru: 'введите ID участника или псевдоним (без цифр после # и без #)'
    }).setRequired(true)),
    async execute(interaction) { // Создание асинхронной функции
        try {
            const lang = await getLocaleFile(interaction.guildLocale); // Вызов функции для получение файла локализации
            const userTag = interaction.options.getString('member'); // Получение информации которую ввёл пользователь
            const users = await interaction.guild.bans.fetch() // Получение списка банов
            .then(async bans => { // Обработка банов
                return bans.map(member => { // перебор массива
                    while (
                        member.user.username == userTag || // Если псевдоним будет равен тому что ввёл пользователь то тогда его разбанит
                        member.user.id == userTag // Если id будет равен тому что ввёл пользователь то тогда его разбанит
                    ) return member.user; // Возрашение списка пользователя в массив
                });
            });
            const user = users.filter(user => user != undefined); // Удаление всех записей где пусто
            if (!user[0]) return await interaction.reply({ content: userTag + lang.userNotBanned, ephemeral: true}); // Проверка есть ли такой пользователь, нету нету то отправляется сообщение что такого пользователя не найдено
            interaction.guild.members.unban(user[0]); // Разбанивание пользователя
            const embedUnban = new EmbedBuilder() // Создание embed-сообщение
            .setColor(0xff0000) // Цвет карсный
            .setAuthor({ // Автор кого разбанивают
                name: user[0].discriminator > 0 ? user[0].username + '#' + user[0].discriminator : user[0].username,
                iconURL: user[0].displayAvatarURL(),
            })
            .setTitle(lang.userUnbanned) // Загловок embed-сообщение
            .setDescription(lang.user + '<@' + user[0].id + '>') // Описание embed-сообщение
            .setFooter({ text: lang.discordServer + interaction.guild.name }) // Футер embed-сообщение
            .setTimestamp(); // Вывод даты создание сообщение
            await interaction.reply({ embeds: [embedUnban], ephemeral: false }); // Отправка всех сообщений
        } catch (error) { // Обработка ошибок
            console.log(error); // Вывод ошибки
        }
    }
}