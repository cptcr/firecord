const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const ping = require('ping');
const Discord = require("discord.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
    console.log(chalk.red("FIRECORD SETUP"));
    console.log(chalk.blue("Available languages: \n[DE] German/Deutsch \n[EN] English/English \n[ES] Spanish/Espanol \n[PR] Portuguese/Português  \n[IT] Italiano/Italian \n[SE] Swedish/Svenska \n[FR] French/Français"));

    async function whichLang() {
        const language = await askQuestion("Which language would you like to use for the setup? ");

        const validLanguages = ["DE", "EN", "ES", "PR", "IT", "SE", "FR"];

        if (!validLanguages.includes(language)) {
            console.log(chalk.red("Invalid language. Please select a valid one. (Also you have to use the two letters of the language for example English = EN)"));
            return whichLang();
        }

        return language;
    }

    const language = await whichLang();

    const filePath = path.join(__dirname, `./langs/${language}.json`);
    if (!fs.existsSync(filePath)) {
        console.log(chalk.red(`Language file ${filePath} not found.`));
        return;
    }

    const json = require(filePath);
    checkDiscordToken();
    const botId = await askQuestion(json.botId + " ");
    const developerIds = await askQuestion(json.devIds + " ");
    const dbType = await askQuestion(json.dbType + " ");
    const dbUri = await askQuestion(json.dbUri + " ");

    async function checkDiscordToken () {
        const token = await askQuestion(json.token + " ");
        await console.log(chalk.red("Validating Discord Token..."))
        const client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent
            ]
        });
    
        try {
            await client.login(token);
            console.log(chalk.green("Token valid!"));
            await client.destroy();
        } catch (err) {
            console.log(chalk.red("Invalid Token provided!"));
            checkDiscordToken();
        }
    }

    const envContent = `
    TOKEN=${token}
    ID=${botId}
    DEVELOPER_IDS=${developerIds}
    DB_TYPE=${dbType}
    DB_URI=${dbUri}
    `;

    const envFilePath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envFilePath)) {
        fs.writeFileSync(envFilePath, envContent.trim());
        console.log(chalk.green(json.envCreatedSuccess));
    } else {
        console.log(chalk.yellow(json.envExistsAlready));
    }

    const dbImportPath = `./exec/database/${dbType}.js`;
    const dbFilePath = path.resolve(__dirname, '../database.js');
    const dbFileContent = `module.exports = require('${dbImportPath}');`;

    fs.writeFileSync(dbFilePath, dbFileContent);
    console.log(chalk.green(`${dbImportPath}.`));

    rl.close();
}

async function checkPing() {
    try {
        const response = await ping.promise.probe('discord.com');
        console.log(chalk.green(`Discord API ping: ${response.time} ms`));

        if (process.env.DB_TYPE === 'mongodb') {
            const { ping } = require('../database');
            const latency = await ping();
            console.log(chalk.green(`MongoDB ping: ${latency} ms`));
        }
    } catch (error) {
        console.error(chalk.red(json.errorCheckPing + " ", error));
    }
}

async function setup() {
    await setupEnvironment();
    await checkPing();
}

module.exports = { setup };