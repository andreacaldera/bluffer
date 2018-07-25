import fs from 'fs';
import { merge } from 'lodash';
import logger from './logger';

const blufferConfig = process.env.BLUFFER_CONFIG;
if (!blufferConfig) {
  logger.warn('You forgot to set BLUFFER_CONFIG, defaulting to local');
}

const config = merge(
  JSON.parse(fs.readFileSync('./config/default.json', 'utf8')),
  JSON.parse(fs.readFileSync(`./config/${blufferConfig || 'local'}.json`, 'utf8'))
);

config.mongodb.password = process.env.MONGODB_PASSWORD;

export default config;
