const pino = require('pino');
const env = require('./env');

const transport = env.nodeEnv === 'development'
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

module.exports = pino({
  level: env.logLevel,
  transport,
});
