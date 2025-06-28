import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function getVersion(): Promise<string> {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packagePath = join(__dirname, '../../package.json');
    const packageData = await readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageData);
    return packageJson.version;
  } catch (error) {
    return '1.0.0';
  }
}