const {
    Client,
    Events,
    GatewayIntentBits,
    ActivityType,
    Collection
} = require('discord.js');
const fs = require('node:fs')
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
        GatewayIntentBits.GuildMembers
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
bot.once(Events.ClientReady, (ctx) => {
    bot.guilds.cache.forEach(guild => {
        servers[index] = guild.id;
        index++;
    });
    commands.forEach(comm => bot.application?.commands.create(comm))
    console.log(ctx.user.username + " started\n" + "Count guilds: " + servers.length);
    bot.user.setPresence({
        status: 'idle',
        activities: [{ name: String(servers.length) + ' guilds', type: ActivityType.Watching }],
        afk: false
    })
})
bot.on(Events.InteractionCreate, async interaction => {
    const lang = await getLocaleFile(interaction.guildLocale);
    if (!interaction.isChatInputCommand()) {
        const button = bot.buttons.get(interaction.customId);
        if (!button) await interaction.followUp({ content: lang.btnNotFound, ephemeral: true });
        try {
            await button.execute(interaction);
        } catch (error) {
            await interaction.followUp({ content: lang.btnNotWork, ephemeral: true });
            console.log(error);
        }
    } else {
        const command = bot.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            if (interaction.replied || interaction.deferred)
                await interaction.followUp({ content: lang.cmdNotWork, ephemeral: true })
            else
                await interaction.followUp({ content: lang.cmdNotFound, ephemeral: true })
            console.error(error);
        }
    }
})
bot.login(process.env.token);