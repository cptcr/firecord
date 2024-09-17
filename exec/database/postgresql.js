const { Client } = require('pg');
require('dotenv').config();

let client;

async function setupPostgreSQL() {
    client = new Client({
        connectionString: process.env.DB_URI
    });
    await client.connect();
    console.log('PostgreSQL connected successfully.');
}

function getClient() {
    if (!client) {
        throw new Error('PostgreSQL client not initialized.');
    }
    return client;
}

module.exports = { setupPostgreSQL, getClient };
