import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { loadComponents } from './handlers/componentHandler';
import { validateIntents } from './utils/intents';
import { scanAndInstallMissingDependencies } from './utils/dependencyScanner';
import * as dotenv from 'dotenv';

dotenv.config();

class ExtendedClient extends Client {
  commands: Collection<string, any>;
  events: Collection<string, any>;
  components: Collection<string, any>;

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

const client = new ExtendedClient();

await scanAndInstallMissingDependencies();
loadCommands(client);
loadEvents(client);
loadComponents(client);
validateIntents(client.options.intents);

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
