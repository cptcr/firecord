const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { setup } = require('./exec/setup');
require('dotenv').config();
const ping = require("ping");
const os = require("os");

const ls = require("./scripts/loadCommands");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function initialize() {
    const databaseFilePath = path.resolve(__dirname, 'database.js');

    if (!fs.existsSync(databaseFilePath)) {
        console.log(chalk.yellow('Database setup required. Running setup...'));
        try {
            await setup();
        } catch (error) {
            console.error(chalk.red('Error during setup:', error));
            process.exit(1); 
        }
    }

    try {
        const dbModule = require('./database');
        client.db = dbModule;
        console.log(chalk.green('Database connected and added to the Discord client.'));
    } catch (error) {
        console.error(chalk.red('Failed to import database module:', error));
    }

    await loadCommandsAndEvents();
}

async function loadCommandsAndEvents() {
    client.commands = new Collection();
    client.events = new Collection();

    // Load commands
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = getFiles(commandsPath);

    for (const file of commandFiles) {
        if (file.endsWith('.js')) {
            try {
                const command = require(file);
                if (command.data && command.data.name) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.error(chalk.red(`Invalid command structure in file ${file}`));
                }
            } catch (error) {
                console.error(chalk.red(`Error loading command ${file}:`, error));
            }
        }
    }

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = getFiles(eventsPath);

    for (const file of eventFiles) {
        if (file.endsWith('.js')) {
            try {
                const event = require(file);
                if (event.name && typeof event.execute === 'function') {
                    client.events.set(event.name, event);
                    client.on(event.name, (...args) => event.execute(...args, client));
                } else {
                    console.error(chalk.red(`Invalid event structure in file ${file}`));
                }
            } catch (error) {
                console.error(chalk.red(`Error loading event ${file}:`, error));
            }
        }
    }
}

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else {
            results.push(fullPath);
        }
    });

    return results;
}

client.once('ready', async () => {
    console.log(chalk.blue(`Logged in as ${client.user.tag}`));

    await displayClientStats();
});

async function displayClientStats() {
    try {
        const discordPing = await ping.promise.probe('discord.com');
        console.log(chalk.green(`Discord API ping: ${discordPing.time} ms`));

        const uptime = formatUptime(process.uptime());

        const memoryUsage = process.memoryUsage();
        const memoryStats = `Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB, RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`;

        if (process.env.DB_TYPE === 'mongodb') {
            const { checkPing } = require('./database');
            const mongoPingStatus = await checkPing();
            console.log(chalk.green(`MongoDB ping: ${mongoPingStatus}`));
        }

        console.log(chalk.blue(`Bot Uptime: ${uptime}`));
        console.log(chalk.blue(`Memory Usage: ${memoryStats}`));
        console.log(chalk.blue(`System CPU Usage: ${os.cpus().length} CPUs`));
        console.log(chalk.blue(`System Memory: Total: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB, Free: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`));

    } catch (error) {
        console.error(chalk.red('Error displaying client stats:', error));
    }
}

function formatUptime(seconds) {
    const pad = (num) => (num < 10 ? '0' : '') + num;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});


ls.loadCommands(client);

initialize().then(() => {
    client.login(process.env.TOKEN)
        .then(() => console.log(chalk.green('Discord client logged in successfully.')))
        .catch((error) => console.error(chalk.red('Error logging into Discord:', error)));
});
