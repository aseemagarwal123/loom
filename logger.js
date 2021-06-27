const winston = require('winston');
const MESSAGE = Symbol.for('message');

const jsonFormatter = (logEntry) => {
  const json =JSON.parse(JSON.stringify(logEntry)).message;
  logEntry[MESSAGE] = json;
  return logEntry;
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
    }),
  ],
  format: winston.format(jsonFormatter)(),
});

logger.stream = {
  write: (info) => {
    logger.info(info);
  },
};

module.exports = logger;
