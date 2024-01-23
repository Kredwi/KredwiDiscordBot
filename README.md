# KredwiDiscordBot

## Description
**KredwiBot** is a Public Discord bot.

**KredwiDiscordBot** is the first public bot made by Kredwi.
There is no specific goal or theme in this bot, I just did and added whatever came to mind. That’s how it turned out, this bot has some fun commands and some frankly unnecessary commands, and it also works with some APIs in order to expand the functionality. There is something in this bot that I am proud of, and there is something that I will soon delete. Perhaps soon I will be able to make it cooler, but now I have run out of ideas on what else to add there. The bot adds some useful commands and some useless ones. For example, the `/words` command is really useless, so why not use it? Or the commands `/ban`, `/kick`, they seem to be useful, but no one will use them. I hope no one will hate this bot, it’s just my little project.
Supports **English** and **Russian** languages

## Keys
- `clientId` - Discord Client Id
- `token` - Discord Bot Token
- `animalToken` - TheCatApi and TheDogApi token
- `lastFm` - Last.FM token
- `steamToken` - Steam token
- `steamIdToken` - SteamId.uk token

## Example
- Replace all keys in the file `.env`
- Install library `npm install`
- After replacing all the keys in the `.env` file, run the bot `npm run start`

## Issues
There are some issues with certain commands:
- `/ban` - If the bot's role is lower than the other roles, the bot goes offline.
- `/kick` - If the bot's role is lower than the other roles, the bot goes offline.
- `/addrole` - If the bot's role is lower than the other roles, the bot goes offline.
- `/removerole` - If the bot's role is lower than the other roles, the bot goes offline.
- `/cat`, `/dog`, `/fox`, `/panda` - Sometimes the image does not appear.
- It is impossible to change the bot language if `Server Community` is not enabled
There is no automatic deletion of commands when deleting a command.

## Commands
- `/8ball` - Responds to your messages with random answers from a list.
- `/cat`, `/dog`, `/fox`, `/panda` - Commands to display animal images.
- `/coin` - Heads or tails.
- `/ping` - Simple command.
- `/random` - Generates a random number within a specified range.
- `/addrole` - Grants a role to a user.
- `/removerole` - Removes a role from a user.
- `/ban` - Bans a member.
- `/help` - Help with the bot.
- `/unban` - Unbans a member.
- `/kick` - Kicks a member.
- `/github` - Get information about a user on GitHub.
- `/scrobbler` - Get information about a user on Last.fm.
- `/steam` - Get information about a game.
- `/avatar` - View a user's avatar.
- `/math` - Perform a mathematical expression.
- `/server` - Information about the Discord server.
- `/words` - Get information about a piece of text.
- `/unix` - Convert a regular date to UNIX time.

Additionally, since I'm still new to JavaScript, the code looks a bit messy.
