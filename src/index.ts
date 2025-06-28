#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { verify } from './commands/verify.js';
import { bulk } from './commands/bulk.js';
import { config } from './commands/config.js';
import { getVersion } from './utils/version.js';

const program = new Command();

async function main() {
  const version = await getVersion();
  
  program
    .name('validkit')
    .description('ValidKit CLI - Email validation for AI agents')
    .version(version)
    .option('-k, --api-key <key>', 'API key (overrides config)')
    .option('-f, --format <format>', 'Output format: json, compact, table', 'table')
    .option('-q, --quiet', 'Suppress non-essential output');

  // Single email verification
  program
    .command('verify <email>')
    .description('Verify a single email address')
    .option('-d, --debug', 'Include debug information')
    .option('-t, --trace-id <id>', 'Trace ID for agent tracking')
    .action(verify);

  // Bulk verification
  program
    .command('bulk <file>')
    .description('Verify emails from a file (one per line)')
    .option('-o, --output <file>', 'Save results to file')
    .option('-a, --async', 'Process asynchronously (for 1000+ emails)')
    .option('-w, --webhook <url>', 'Webhook URL for async results')
    .option('-t, --trace-id <id>', 'Trace ID for agent tracking')
    .option('--share-signals', 'Contribute to Agent Signal Pool')
    .action(bulk);

  // Configuration management
  program
    .command('config')
    .description('Manage ValidKit configuration')
    .option('-s, --set-key <key>', 'Set API key')
    .option('-g, --get', 'Show current configuration')
    .option('-r, --reset', 'Reset configuration')
    .action(config);

  // Error handling
  program.exitOverride();

  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    if (error.code === 'commander.unknownCommand') {
      console.error(chalk.red(`Unknown command: ${error.command}`));
      console.log('Run', chalk.cyan('validkit --help'), 'for usage information');
    } else if (error.code === 'commander.help') {
      // Help was displayed, exit gracefully
    } else {
      console.error(chalk.red('Error:'), error.message);
    }
    process.exit(1);
  }
}

main().catch(console.error);