import { ValidKit, ResponseFormat } from '@validkit/sdk';
import chalk from 'chalk';
import ora from 'ora';
import { getApiKey, formatOutput } from '../utils/helpers.js';
import { Command } from 'commander';

export async function verify(email: string, options: any, command: Command) {
  const globalOptions = command.parent?.opts() || {};
  const format = options.format || globalOptions.format || 'table';
  const quiet = globalOptions.quiet;
  
  // Get API key from options or config
  const apiKey = await getApiKey(globalOptions.apiKey);
  if (!apiKey) {
    console.error(chalk.red('Error: No API key found'));
    console.log('Set your API key with:', chalk.cyan('validkit config --set-key YOUR_KEY'));
    console.log('Or get one at:', chalk.cyan('https://validkit.com'));
    process.exit(1);
  }

  const spinner = quiet ? null : ora('Validating email...').start();

  try {
    const client = new ValidKit({ api_key: apiKey });
    
    const result = await client.verifyEmail(email, {
      format: format === 'compact' ? ResponseFormat.COMPACT : ResponseFormat.FULL,
      debug: options.debug,
      trace_id: options.traceId
    });

    if (spinner) spinner.succeed('Email validated');

    // Format and display output
    formatOutput(result, format, quiet);

    // Exit with appropriate code for scripting
    const isValid = 'valid' in result ? result.valid : result.v;
    process.exit(isValid ? 0 : 1);
  } catch (error: any) {
    if (spinner) spinner.fail('Validation failed');
    
    if (error.response?.data) {
      console.error(chalk.red('API Error:'), error.response.data.error?.message || 'Unknown error');
    } else {
      console.error(chalk.red('Error:'), error.message);
    }
    
    process.exit(2);
  }
}