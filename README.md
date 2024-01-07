# KredwiDiscordBot

## Example
- Replace all keys in the file `.env`
- Install library `npm install`
- After replacing all the keys in the `.env` file, run the bot `npm run start`

## Keys
- `clientId` - Discord Client Id
- `token` - Discord Bot Token
- `animalToken` - TheCatApi and TheDogApi token
- `lastFm` - Last.FM token
- `steamToken` - Steam token
- `steamIdToken` - SteamId.uk token

## Description
**KredwiBot** is a Public Discord bot.

The first public Discord bot by Kredwi written in JavaScript.
For all questions, write personally to @kredwi.
Supports **English** and **Russian** languages

## Issues
There are some issues with certain commands:
- `/ban` - If the bot's role is lower than the other roles, the bot goes offline.
- `/kick` - If the bot's role is lower than the other roles, the bot goes offline.
- `/addrole` - If the bot's role is lower than the other roles, the bot goes offline.
- `/removerole` - If the bot's role is lower than the other roles, the bot goes offline.
- `/cat`, `/dog`, `/fox`, `/panda` - Sometimes the image does not appear.

## Commands
- `/8ball` - Responds to your messages with random answers from a list.
- `/cat`, `/dog`, `/fox`, `/panda` - Commands to display animal images.
- `/coin` - Heads or tails.
- `/ping` - Simple command.
- `/random` - Generates a random number within a specified range.
- `/addrole` - Grants a role to a user.
- `/removerole` - Removes a role from a user.
- `/ban` - Bans a member.
- `/unban` - Unbans a member.
- `/kick` - Kicks a member.
- `/github` - Get information about a user on GitHub.
- `/scrobbler` - Get information about a user on Last.fm.
- `/steam` - Get information about a game.
- `/avatar` - View a user's avatar.
- `/math` - Perform a mathematical expression.
- `/server` - Information about the Discord server.
- `/words` - Get information about a piece of text.

Additionally, since I'm still new to JavaScript, the code looks a bit messy.
