import chalk from 'chalk';
import { getConfig, setConfig, resetConfig } from '../utils/config.js';

export async function config(options: any) {
  if (options.setKey) {
    // Set API key
    await setConfig({ apiKey: options.setKey });
    console.log(chalk.green('API key saved successfully'));
    console.log('Test it with:', chalk.cyan('validkit verify test@example.com'));
  } else if (options.reset) {
    // Reset configuration
    await resetConfig();
    console.log(chalk.green('Configuration reset'));
  } else {
    // Show current configuration
    const config = await getConfig();
    
    if (!config.apiKey) {
      console.log(chalk.yellow('No configuration found'));
      console.log('Set your API key with:', chalk.cyan('validkit config --set-key YOUR_KEY'));
      console.log('Get an API key at:', chalk.cyan('https://validkit.com'));
    } else {
      console.log(chalk.bold('ValidKit Configuration:'));
      console.log('API Key:', chalk.gray(maskApiKey(config.apiKey)));
      console.log('Config file:', chalk.gray(config.configPath));
    }
  }
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return '***';
  return apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
}