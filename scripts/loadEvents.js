const fs = require('fs');
const path = require('path');

function loadEvents(client) {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.name && event.execute) {
            client.on(event.name, (...args) => event.execute(...args, client));
        } else {
            console.warn(`Event file ${file} is missing "name" or "execute" property.`);
        }
    }
}

module.exports = { loadEvents };
