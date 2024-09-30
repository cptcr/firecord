import * as fs from 'fs';
import * as path from 'path';
import { Client, Collection, CommandInteraction } from 'discord.js';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const devUsers = process.env.DEVELOPER_ID?.split(',') || [];
const devGuilds = process.env.DEVELOPER_GUILDS?.split(',') || [];

export function loadCommands(client: any) {
  client.commands = new Collection();

  try {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));

    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of commandFiles) {
        const command = require(path.join(__dirname, `../commands/${folder}/${file}`));
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(chalk.green(`Loaded command: ${command.data.name}`));
        } else {
          console.log(chalk.red(`Failed to load command at ${file}: Missing 'data' or 'execute' property.`));
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error loading commands: ${error}`));
  }
}

export async function handleCommandInteraction(interaction: any, client: any) {
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return interaction.reply({ content: 'Command not found!', ephemeral: true });
  }

  if (command.devOnly && (!devUsers.includes(interaction.user.id) || !devGuilds.includes(interaction.guild?.id))) {
    return interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true });
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(chalk.red(`Error executing command: ${interaction.commandName}`));
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
}
