import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

// Load .env file if present
dotenv.config();

interface Config {
  apiKey?: string;
  configPath?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.validkit');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function getConfig(): Promise<Config> {
  // Check environment variable first
  if (process.env.VALIDKIT_API_KEY) {
    return {
      apiKey: process.env.VALIDKIT_API_KEY,
      configPath: 'Environment Variable'
    };
  }

  // Then check config file
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(data);
    return {
      ...config,
      configPath: CONFIG_FILE
    };
  } catch (error) {
    return {
      configPath: CONFIG_FILE
    };
  }
}

export async function setConfig(config: Partial<Config>): Promise<void> {
  // Ensure config directory exists
  await fs.mkdir(CONFIG_DIR, { recursive: true });

  // Read existing config
  let existingConfig: Config = {};
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    existingConfig = JSON.parse(data);
  } catch (error) {
    // File doesn't exist, that's ok
  }

  // Merge and save
  const newConfig = { ...existingConfig, ...config };
  delete newConfig.configPath; // Don't save this
  
  await fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}

export async function resetConfig(): Promise<void> {
  try {
    await fs.unlink(CONFIG_FILE);
  } catch (error) {
    // File doesn't exist, that's ok
  }
}