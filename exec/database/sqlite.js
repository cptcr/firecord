const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
require('dotenv').config();

let db;

async function setupSQLite() {
    db = await open({
        filename: process.env.DB_URI,
        driver: sqlite3.Database
    });
    console.log('SQLite connected successfully.');
}

function getDB() {
    if (!db) {
        throw new Error('SQLite database not initialized.');
    }
    return db;
}

module.exports = { setupSQLite, getDB };
