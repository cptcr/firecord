const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const dbUri = process.env.DB_URI;
let client;

mongoose.set('strictQuery', false);
mongoose.connect(dbUri);

async function setupClient() {
    if (!client) {
        client = new MongoClient(dbUri);
        await client.connect();
    }
}

async function checkPing() {
    try {
        await setupClient();
        const admin = client.db().admin();
        const result = await admin.ping();
        return result.ok ? 'Ping successful' : 'Ping failed';
    } catch (error) {
        console.error('MongoDB ping error:', error);
        return 'Ping failed';
    }
}

module.exports = { checkPing };