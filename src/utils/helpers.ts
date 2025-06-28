import chalk from 'chalk';
import { getConfig } from './config.js';

export async function getApiKey(overrideKey?: string): Promise<string | undefined> {
  if (overrideKey) return overrideKey;
  
  const config = await getConfig();
  return config.apiKey;
}

export function formatOutput(result: any, format: string, quiet: boolean): void {
  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (format === 'compact' || quiet) {
    console.log(result.valid ? 'valid' : 'invalid');
    return;
  }

  // Table format (default)
  console.log();
  console.log(chalk.bold('Email Validation Result'));
  console.log(chalk.gray('─'.repeat(40)));
  
  console.log('Email:', chalk.cyan(result.email || result.data?.email));
  console.log('Valid:', result.valid ? chalk.green('✓ Yes') : chalk.red('✗ No'));
  console.log('Risk:', formatRisk(result.risk || result.data?.risk));
  
  if (result.data?.checks || result.checks) {
    const checks = result.data?.checks || result.checks;
    console.log();
    console.log(chalk.bold('Validation Checks:'));
    Object.entries(checks).forEach(([key, value]) => {
      const formatted = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`  ${formatted}:`, chalk.gray(String(value)));
    });
  }

  if (result.debug) {
    console.log();
    console.log(chalk.bold('Debug Information:'));
    console.log(chalk.gray(JSON.stringify(result.debug, null, 2)));
  }
}

export function formatBulkOutput(result: any, format: string, quiet: boolean): void {
  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Async job result
  if (result.job_id && !result.data) {
    console.log();
    console.log(chalk.bold('Async Batch Job Created'));
    console.log('Job ID:', chalk.cyan(result.job_id));
    console.log('Status:', chalk.yellow(result.status));
    if (result.webhook_url) {
      console.log('Webhook:', chalk.gray(result.webhook_url));
    }
    return;
  }

  // Sync results
  if (result.data) {
    const summary = result.data.summary;
    
    if (!quiet) {
      console.log();
      console.log(chalk.bold('Bulk Validation Summary'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log('Total:', summary.total);
      console.log('Valid:', chalk.green(summary.valid));
      console.log('Invalid:', chalk.red(summary.invalid));
      console.log('Processing Time:', chalk.gray(`${result.data.processing_time_ms || 0}ms`));
      
      if (result.data.from_pool !== undefined) {
        console.log();
        console.log(chalk.bold('Agent Signal Pool Stats'));
        console.log('Used from pool:', chalk.cyan(result.data.from_pool));
        console.log('Contributed:', chalk.cyan(result.data.contributed || 0));
        console.log('Pool confidence:', chalk.cyan(`${(result.data.pool_confidence || 0) * 100}%`));
      }
    }

    // Show invalid emails if not too many
    const invalidEmails = result.data.results?.filter((r: any) => !r.valid);
    if (invalidEmails && invalidEmails.length > 0 && invalidEmails.length <= 10 && !quiet) {
      console.log();
      console.log(chalk.bold('Invalid Emails:'));
      invalidEmails.forEach((email: any) => {
        console.log(`  ${chalk.red('✗')} ${email.email} (${email.risk})`);
      });
    }
  }
}

function formatRisk(risk: string): string {
  const riskColors: Record<string, any> = {
    low: chalk.green,
    medium: chalk.yellow,
    high: chalk.red,
    invalid: chalk.red
  };
  
  const color = riskColors[risk] || chalk.gray;
  return color(risk);
}