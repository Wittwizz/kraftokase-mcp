require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const logger = require('./lib/logger');
const shopify = require('./lib/shopify');
const { 
  authenticateAPIKey, 
  errorHandler, 
  requestLogger, 
  corsOptions 
} = require('./lib/middleware');

// Import routes
const productsRouter = require('./routes/products');
const collectionsRouter = require('./routes/collections');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Request logging
app.use(requestLogger);

// Health check endpoint (no auth required)
app.get('/health', async (req, res) => {
  try {
    const connectionTest = await shopify.testConnection();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      shopify_connection: connectionTest.success,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Kraftokase MCP',
    version: '1.0.0',
    description: 'Middleware Control Panel for Kraftokase Shopify Store',
    endpoints: {
      health: 'GET /health',
      products: {
        list: 'GET /products',
        single: 'GET /products/:id',
        update_tags: 'PUT /products/:id/tags',
        metafields: 'GET /products/:id/metafields',
        update_metafield: 'POST /products/:id/metafields'
      },
      collections: {
        list: 'GET /collections',
        create: 'POST /collections',
        single: 'GET /collections/:id',
        bulk_metafield: 'POST /sync/products/metafield'
      }
    },
    authentication: 'All endpoints require X-API-Key header',
    documentation: 'See README.md for detailed usage'
  });
});

// API routes (all require authentication)
app.use('/products', authenticateAPIKey, productsRouter);
app.use('/collections', authenticateAPIKey, collectionsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    available_endpoints: [
      'GET /health',
      'GET /products',
      'GET /products/:id',
      'PUT /products/:id/tags',
      'GET /products/:id/metafields',
      'POST /products/:id/metafields',
      'GET /collections',
      'POST /collections',
      'GET /collections/:id',
      'POST /sync/products/metafield'
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Kraftokase MCP server started on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    shopify_store: process.env.SHOPIFY_STORE_DOMAIN
  });
  
  console.log(`
🚀 Kraftokase MCP Server Started!
📍 Port: ${PORT}
🏪 Store: ${process.env.SHOPIFY_STORE_DOMAIN}
🔐 API Key: ${process.env.MCP_API_KEY ? 'Configured' : 'Missing'}
📊 Health Check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/
  `);
});

module.exports = app; 