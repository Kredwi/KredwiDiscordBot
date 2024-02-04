# KREDWIBOT CHANGELOG 02.04.2024

## Fixed
- The bot crash in the buttons of the `/scrobbler` command has been fixed, provided that the `Last.FM` list is empty.
- In the `/user` command, the localization was corrected, in which only the Russian version of the word "**Phone**" was available.

## Added
 - Added `/kiss` command.
  - This command allows you to kiss your interlocutor or kiss yourself.
 - Added `/about` command.
  - This command allows you to find out information about the Bot.
- Added `/invite` command.
 - This command allows you to find out information about the link - Discord invitation code.
- Added a default option to the `/avatar` command regarding display to other users.
- Added an error that triggers if the user executes a command not on the server.

## Change
- In the `/ping` command, the visibility cannot be changed anymore; it will now always be displayed to the user.
- The `/help` command now displays the number of commands.
- A new field has been added to the `/server` command with information about the server's security level.
- The `/unix` command now responds to keywords.
 - `current date`, `now`, `date`, `at`, `time`, `timestamp`, and so on..
- All `followUp` methods have been changed to `reply`
- Changed status with new information added
 - `/command | number of servers servers | vbuild version`

## Example
- `/invite invite:Q82DrzvQDe`
- `/kiss member:@kredwi`

That seems to be all for now.