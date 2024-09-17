const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join('commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`Command file ${file} is missing "data" or "execute" property.`);
        }
    }
}

module.exports = { loadCommands };