require('dotenv').config();
const { exec } = require('child_process');

const startCommand = process.env.AUTO_RESTART === "true" 
  ? 'nodemon dist/index.js'
  : 'node dist/index.js';

exec(startCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(stdout);
});
