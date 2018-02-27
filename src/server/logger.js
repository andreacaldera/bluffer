import winston from 'winston';

import config from './config';

const logger = new (winston.Logger)({
  levels: {
    debug: 5,
    info: 4,
    help: 3,
    warn: 2,
    error: 1,
  },
  colors: {
    debug: 'green',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
  },
});

logger.add(winston.transports.Console, {
  level: config.logLevel,
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
});

logger[config.logLevel](`Logging level set to ${config.logLevel}`);

export default logger;
