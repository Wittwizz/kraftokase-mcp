const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist (only in non-serverless environments)
const fs = require('fs');
let logsDir;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'kraftokase-mcp' },
  transports: [
    // Always log to console in serverless environments
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
});

// Add file transports only in non-serverless environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
  
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
  
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'tasks.log'),
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  }));
}

// Console logging is already added above for serverless environments

// Helper methods for specific log types
logger.logTask = (task, details) => {
  logger.info('Task executed', {
    task,
    details,
    timestamp: new Date().toISOString(),
    user_agent: 'kraftokase-mcp'
  });
};

logger.logShopifyOperation = (operation, productId, details) => {
  logger.info('Shopify operation', {
    operation,
    product_id: productId,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logError = (error, context = {}) => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger; 