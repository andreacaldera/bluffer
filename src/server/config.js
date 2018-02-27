import fs from 'fs';
import logger from './logger';

const blufferConfig = process.env.BLUFFER_CONFIG;
if (!blufferConfig) {
  logger.warn('You forgot to set BLUFFER_CONFIG, defaulting to local');
}

const config = JSON.parse(fs.readFileSync(`./config/${blufferConfig || 'local'}.json`, 'utf8'));

export default config;
