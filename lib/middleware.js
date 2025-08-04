const Joi = require('joi');
const logger = require('./logger');

// API Key authentication middleware
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedKey = process.env.MCP_API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    logger.warn('Unauthorized access attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }

  next();
};

// Request validation schemas
const schemas = {
  updateProductTags: Joi.object({
    tags: Joi.array().items(Joi.string().min(1)).min(1).required()
  }),

  createCollection: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    rule_keywords: Joi.array().items(Joi.string().min(1)).min(1).required(),
    description: Joi.string().max(1000).optional()
  }),

  updateMetafield: Joi.object({
    namespace: Joi.string().min(1).max(20).required(),
    key: Joi.string().min(1).max(30).required(),
    value: Joi.string().min(1).max(1000).required(),
    type: Joi.string().valid(
      'single_line_text_field',
      'multi_line_text_field',
      'number_integer',
      'number_decimal',
      'url',
      'json_string',
      'boolean'
    ).optional()
  })
};

// Validation middleware factory
const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn('Validation error', {
        schema: schemaName,
        errors: error.details,
        body: req.body
      });

      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
    }

    // Replace request body with validated data
    req.body = value;
    next();
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      error: 'Rate Limited',
      message: 'Too many requests to Shopify API. Please try again later.'
    });
  }

  if (err.response?.status === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });

  next();
};

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

module.exports = {
  authenticateAPIKey,
  validateRequest,
  errorHandler,
  requestLogger,
  corsOptions
}; 