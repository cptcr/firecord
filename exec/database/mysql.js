const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function setupMySQL() {
    connection = await mysql.createConnection(process.env.DB_URI);
    console.log('MySQL connected successfully.');
}

function getConnection() {
    if (!connection) {
        throw new Error('MySQL connection not initialized.');
    }
    return connection;
}

module.exports = { setupMySQL, getConnection };
