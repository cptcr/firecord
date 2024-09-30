import madge from 'madge';
import { exec } from 'child_process';
import * as fs from 'fs';

export async function scanAndInstallMissingDependencies() {
  try {
    const result = await madge('src');
    const dependencies = result.obj();

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const installedPackages = packageJson.dependencies || {};

    const missingPackages = [];

    for (const dep in dependencies) {
      if (!installedPackages[dep]) {
        missingPackages.push(dep);
      }
    }

    if (missingPackages.length > 0) {
      console.log('Installing missing dependencies:', missingPackages.join(', '));
      exec(`npm install ${missingPackages.join(' ')}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing packages: ${error.message}`);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(stdout);
      });
    } else {
      console.log('All required dependencies are installed.');
    }
  } catch (error) {
    console.error('Error scanning dependencies:', error);
  }
}
