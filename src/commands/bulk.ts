import { ValidKit, ResponseFormat } from '@validkit/sdk';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import { getApiKey, formatBulkOutput } from '../utils/helpers.js';
import { Command } from 'commander';

export async function bulk(file: string, options: any, command: Command) {
  const globalOptions = command.parent?.opts() || {};
  const format = options.format || globalOptions.format || 'table';
  const quiet = globalOptions.quiet;
  
  // Get API key
  const apiKey = await getApiKey(globalOptions.apiKey);
  if (!apiKey) {
    console.error(chalk.red('Error: No API key found'));
    console.log('Set your API key with:', chalk.cyan('validkit config --set-key YOUR_KEY'));
    process.exit(1);
  }

  // Read emails from file
  let emails: string[];
  try {
    const content = await fs.readFile(file, 'utf-8');
    emails = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  } catch (error) {
    console.error(chalk.red('Error reading file:'), file);
    process.exit(1);
  }

  if (emails.length === 0) {
    console.error(chalk.red('Error: No emails found in file'));
    process.exit(1);
  }

  const spinner = quiet ? null : ora(`Validating ${emails.length} emails...`).start();
  const client = new ValidKit({ api_key: apiKey });

  try {
    // Use async for large batches
    const isAsync = options.async || emails.length > 1000;
    
    if (isAsync && !options.webhook) {
      if (spinner) spinner.warn('Large batch detected. Use --webhook for async processing');
    }

    let result: any;
    
    if (isAsync) {
      result = await client.verifyBatchAsync(emails, {
        format: format === 'compact' ? ResponseFormat.COMPACT : ResponseFormat.FULL,
        webhook_url: options.webhook,
        trace_id: options.traceId
      });
    } else {
      result = await client.verifyBatch(emails, {
        format: format === 'compact' ? ResponseFormat.COMPACT : ResponseFormat.FULL,
        trace_id: options.traceId
      });
    }

    if (spinner) {
      if (isAsync) {
        spinner.succeed(`Batch job created: ${result.job_id}`);
      } else {
        spinner.succeed(`Validated ${emails.length} emails`);
      }
    }

    // Handle output
    if (options.output) {
      await fs.writeFile(options.output, JSON.stringify(result, null, 2));
      if (!quiet) {
        console.log(chalk.green(`Results saved to: ${options.output}`));
      }
    } else {
      formatBulkOutput(result, format, quiet);
    }

    // Exit code based on validation results
    if (!isAsync && result) {
      let invalidCount = 0;
      if (Array.isArray(result)) {
        invalidCount = result.filter((r: any) => 
          'valid' in r ? !r.valid : !r.v
        ).length;
      } else if (result.results) {
        invalidCount = result.results.filter((r: any) => 
          'valid' in r ? !r.valid : !r.v
        ).length;
      }
      process.exit(invalidCount > 0 ? 1 : 0);
    } else {
      process.exit(0);
    }
  } catch (error: any) {
    if (spinner) spinner.fail('Bulk validation failed');
    
    if (error.response?.data) {
      console.error(chalk.red('API Error:'), error.response.data.error?.message || 'Unknown error');
    } else {
      console.error(chalk.red('Error:'), error.message);
    }
    
    process.exit(2);
  }
}