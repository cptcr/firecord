import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);
// Helper function to append environment variables
function appendEnvVariable(key, value) {
    const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf-8') : '';
    const newLine = `${key}=${value}\n`;
    if (!envContent.includes(`${key}=`)) {
        fs.appendFileSync(".env", newLine);
    }
    else {
        console.log(`${key} already exists in .env, skipping...`);
    }
}
// Main setup function
export async function setup() {
    console.log("\n--- Initial Setup ---");
    // Install required dependencies
    console.log("Installing required dependencies and updating packages...");
    await installDependencies();
    console.log("Installed all required dependencies!");
    // Dynamically import inquirer
    const { default: inquirer } = await import('inquirer');
    // Ask for Discord bot details
    const botDetails = await inquirer.prompt([
        {
            type: "input",
            name: "botId",
            message: "Enter your Discord Bot ID:",
            validate: (input) => input ? true : "Bot ID cannot be empty."
        },
        {
            type: "input",
            name: "token",
            message: "Enter your Discord Bot Token:",
            validate: (input) => input ? true : "Token cannot be empty."
        }
    ]);
    appendEnvVariable("DISCORD_BOT_ID", botDetails.botId);
    appendEnvVariable("DISCORD_BOT_TOKEN", botDetails.token);
    // Ask for database type and configuration
    const { dbType } = await inquirer.prompt([
        {
            type: "list",
            name: "dbType",
            message: "Choose your database type:",
            choices: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "MariaDB"]
        }
    ]);
    const dbTemplatePath = path.join(__dirname, `../db-types/${dbType.toLowerCase()}.txt`);
    if (!fs.existsSync(dbTemplatePath)) {
        console.error(`Error: Template for ${dbType} does not exist.`);
        return;
    }
    let dbContent = fs.readFileSync(dbTemplatePath, "utf-8");
    if (dbType === "MongoDB") {
        const mongoDetails = await inquirer.prompt([
            { type: "input", name: "connectionString", message: "Enter MongoDB Connection String:" }
        ]);
        dbContent = dbContent.replace("{{CONNECTION_STRING}}", mongoDetails.connectionString);
        appendEnvVariable("MONGODB_URI", mongoDetails.connectionString);
    }
    else if (dbType === "PostgreSQL" || dbType === "MariaDB" || dbType === "MySQL") {
        await dbSetupConsole(dbType, inquirer);
    }
    fs.writeFileSync("database.ts", dbContent);
    console.log(`Database setup complete: ${dbType}.`);
    // Ask for API and Website port configuration
    const { apiPort } = await inquirer.prompt([
        { type: "input", name: "apiPort", message: "Enter the API Port (default is 3000):", default: "3000" }
    ]);
    appendEnvVariable("API_PORT", apiPort);
    const { websitePort } = await inquirer.prompt([
        { type: "input", name: "websitePort", message: "Enter the Website Port (default is 8080):", default: "8080" }
    ]);
    appendEnvVariable("WEBSITE_PORT", websitePort);
    console.log("\nSetup complete. You can now start the bot, API, and website.");
}
// Function to configure database credentials for SQL-based databases
async function dbSetupConsole(name, inquirer) {
    console.log(`--- ADDITIONAL CONFIGURATION FOR ${name.toUpperCase()} ---`);
    const detailsDB = await inquirer.prompt([
        {
            type: "input",
            name: "hostname",
            message: "Enter the hostname here:",
            validate: (input) => input ? true : "Hostname cannot be empty."
        },
        {
            type: "input",
            name: "dbFile",
            message: "Enter the database filename here (for example database.db):",
            validate: (input) => input ? true : "Database filename cannot be empty."
        },
        {
            type: "input",
            name: "dbPassword",
            message: "Enter the database password here:",
            validate: (input) => input ? true : "DB Password cannot be empty."
        }
    ]);
    await dbSetupWrite(detailsDB.hostname, detailsDB.dbFile, detailsDB.dbPassword);
}
// Function to write database credentials to the .env file
async function dbSetupWrite(hostname, dbFile, dbPassword) {
    appendEnvVariable("DB_PASSWORD", dbPassword);
    appendEnvVariable("DB_HOSTNAME", hostname);
    appendEnvVariable("DB_FILE", dbFile);
}
// Function to install dependencies
async function installDependencies() {
    const packages = [
        "discord.js",
        "mongoose",
        "mongodb",
        "chalk",
        "concurrently",
        "dotenv",
        "ejs",
        "express",
        "readline-sync",
        "inquirer"
    ];
    const devDependencies = [
        "@types/chalk",
        "@types/dotenv",
        "@types/ejs",
        "@types/express",
        "@types/inquirer",
        "@types/node",
        "@types/ping",
        "@types/readline-sync",
        "ts-node",
        "typescript"
    ];
    // Install packages
    for (const p of packages) {
        try {
            console.log(`Installing package: ${p}`);
            const { stdout, stderr } = await execPromise(`npm install ${p}`);
            if (stdout)
                console.log(stdout);
            if (stderr)
                console.error(stderr);
        }
        catch (error) {
            console.error(`Failed to install package ${p}:`, error);
        }
    }
    // Install dev dependencies
    for (const p of devDependencies) {
        try {
            console.log(`Installing dev dependency: ${p}`);
            const { stdout, stderr } = await execPromise(`npm install ${p} --save-dev`);
            if (stdout)
                console.log(stdout);
            if (stderr)
                console.error(stderr);
        }
        catch (error) {
            console.error(`Failed to install dev dependency ${p}:`, error);
        }
    }
}
// Start the setup process
setup().catch(console.error);
