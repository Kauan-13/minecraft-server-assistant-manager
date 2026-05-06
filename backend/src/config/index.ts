import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.js';
import type { AppConfig } from '../types/config.js';

const configPath = path.join(process.cwd(), 'config.json');

let config: AppConfig;

try {
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(fileContent);
} catch {
    logger.error('Erro ao carregar config.json');
}

const env = {
    PORT: process.env.PORT || 3000,
    API_TOKEN: process.env.API_TOKEN!,
    RCON_PASSWORD: process.env.RCON_PASSWORD!,
    DISCORD_WEB_HOOK: process.env.URL_DISCORD_WEBHOOK!,
    RADMIN_IP: process.env.RADMIN_IP,
    FRONTEND_URL: process.env.FRONTEND_URL
};

export { env, config };