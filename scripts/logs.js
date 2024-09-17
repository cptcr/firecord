const fs = require('fs');
const path = require('path');

function logError(error) {
    const errorLogPath = path.join('logs', 'error.log');
    fs.appendFileSync(errorLogPath, `${new Date().toISOString()} - ${error}\n`);
}

function logCommandUsage(commandName, user) {
    const usageLogPath = path.join('logs', 'command-usage.log');
    fs.appendFileSync(usageLogPath, `${new Date().toISOString()} - Command: ${commandName}, User: ${user.tag}\n`);
}

module.exports = { logError, logCommandUsage };
