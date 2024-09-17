const fs = require('fs');
const path = require('path');

function loadConfig() {
    const configPath = '.env';
    if (fs.existsSync(configPath)) {
        require('dotenv').config();
    } else {
        console.warn('No .env file found. Please create one with the necessary configurations.');
    }
}

module.exports = { loadConfig };