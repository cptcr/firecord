import * as fs from 'fs';
import * as path from 'path';
export function loadCommands(client) {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
            }
        }
    }
}
