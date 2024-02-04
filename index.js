const {
    Client,
    Events,
    GatewayIntentBits,
    ActivityType,
    Collection
} = require('discord.js');
const fs = require('node:fs')
const package = require('./package.json');
require('dotenv').config();
let servers = [];
let index = 0;
const getLocaleFile = require('./locale.js');
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
})
const commands = [];
bot.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const files = fs.readdirSync('./commands/' + folder).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            bot.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}
bot.buttons = new Collection();
const buttonFolders = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFolders) {
    const button = require('./buttons/' + file);
    if ('data' in button && 'execute' in button) bot.buttons.set(button.data.data.custom_id, button);
}
bot.once(Events.ClientReady, async (ctx) => {
    const commandExecutes = await bot.application?.commands.fetch();
    commandExecutes.map(com => {
        if (!commands.some(cmd => cmd.name == com.name)) bot.application?.commands.delete(com);
    })
    for (let i = 0; i < commands.length; i++) {
        setActivity('dnd', 'Command: ' + i + '/' + commands.length + ' registered', ActivityType.Playing);
        await bot.application.commands.create(commands[i]);
    }
    getListGuilds();
    console.log(ctx.user.username + " started\n" + "Count guilds: " + servers.length);
    setInterval(getListGuilds, 10800000); // 10800000 ms == 3 hours
})
bot.on(Events.GuildCreate, () => getListGuilds());
bot.on(Events.GuildDelete, () => getListGuilds());
bot.on(Events.Error, (error) => console.error(error));
bot.on(Events.InteractionCreate, async interaction => {
    const lang = await getLocaleFile(interaction.guildLocale || interaction.locale);
    if (!interaction.guildId) return await interaction.reply({ content: lang.cmdNotWorkInDM, ephemeral: true });
    if (!interaction.isChatInputCommand()) {
        const button = bot.buttons.get(interaction.customId);
        if (!button) await interaction.reply({ content: lang.btnNotFound, ephemeral: true });
        try {
            await button.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: lang.btnNotWork, ephemeral: true });
        }
    } else {
        const command = bot.commands.get(interaction.commandName);
        if (!command) return await interaction.reply({ content: lang.cmdNotFound, ephemeral: true });
        try {
            await command.execute(interaction);
        } catch (error) {
            if (interaction.replied || interaction.deferred)
                await interaction.reply({ content: lang.cmdNotWork, ephemeral: true });
            else
                await interaction.reply({ content: lang.cmdNotFound, ephemeral: true });

            console.error(error);
        }
    }
})
function getListGuilds() {
    index = 0;
    bot.guilds.cache.forEach(guild => {
        servers[index] = guild.id;
        index++;
    });
    setActivity('idle', ('/help | ' + servers.length + ' servers | v' + package.version), ActivityType.Competing);
}
function setActivity(status, nameActivity, typeActivity) {
    bot.user.setPresence({
        status: status,
        activities: [{ name: nameActivity, type: typeActivity }],
        afk: false
    })
}
bot.login(process.env.token);