import * as fs from 'fs';
import * as path from 'path';
export function loadComponents(client) {
    const componentFolders = fs.readdirSync(path.join(__dirname, '../components'));
    for (const folder of componentFolders) {
        const componentFiles = fs.readdirSync(path.join(__dirname, `../components/${folder}`)).filter(file => file.endsWith('.ts'));
        for (const file of componentFiles) {
            const component = require(`../components/${folder}/${file}`);
            client.components.set(component.data.name, component);
        }
    }
}
