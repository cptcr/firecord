// /exec/setup.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const ping = require('ping'); // To check ping

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
    const token = await askQuestion('What is your Discord bot token? ');
    const botId = await askQuestion('What is your Discord bot ID? ');
    const dbType = await askQuestion('Which database would you like to use? (mongodb/mysql/postgresql/sqlite) ');
    const dbUri = await askQuestion('What is your database connection string? ');

    const envContent = `
TOKEN=${token}
ID=${botId}
DB_TYPE=${dbType}
DB_URI=${dbUri}
    `;
    
    const envFilePath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envFilePath)) {
        fs.writeFileSync(envFilePath, envContent);
        console.log(chalk.green('.env file created.'));
    } else {
        console.log(chalk.yellow('.env file already exists.'));
    }

    // Create database.js file
    const dbImportPath = `./exec/database/${dbType}.js`;
    const dbFilePath = path.resolve(__dirname, '../database.js');
    const dbFileContent = `
        module.exports = require('${dbImportPath}');
    `;
    
    fs.writeFileSync(dbFilePath, dbFileContent);
    console.log(chalk.green(`database.js file created, linked to ${dbImportPath}.`));

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
        console.error(chalk.red('Error checking ping:', error));
    }
}

async function setup() {
    await setupEnvironment();
    await checkPing();
}

module.exports = { setup };
