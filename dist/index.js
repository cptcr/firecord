import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { loadComponents } from './handlers/componentHandler';
dotenv.config();
class ExtendedClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        this.commands = new Collection();
        this.events = new Collection();
        this.components = new Collection();
    }
}
export default ExtendedClient;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
loadCommands(client);
loadEvents(client);
loadComponents(client);
client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
