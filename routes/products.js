const express = require('express');
const router = express.Router();
const shopify = require('../lib/shopify');
const logger = require('../lib/logger');
const { validateRequest } = require('../lib/middleware');

// GET /products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 250;
    const products = await shopify.getProducts(limit);
    
    logger.logTask('get_products', {
      limit,
      count: products.length,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
        limit
      }
    });
  } catch (error) {
    logger.logError(error, { endpoint: 'GET /products', request_id: req.id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await shopify.getProduct(productId);
    
    logger.logTask('get_product', {
      product_id: productId,
      request_id: req.id
    });

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'GET /products/:id', 
      product_id: req.params.id,
      request_id: req.id 
    });
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The specified product was not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// PUT /products/:id/tags - Update product tags
router.put('/:id/tags', validateRequest('updateProductTags'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { tags } = req.body;
    
    const updatedProduct = await shopify.updateProductTags(productId, tags);
    
    logger.logTask('update_product_tags', {
      product_id: productId,
      tags,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        product: updatedProduct,
        message: `Successfully updated tags for product ${productId}`
      }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'PUT /products/:id/tags', 
      product_id: req.params.id,
      tags: req.body.tags,
      request_id: req.id 
    });
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The specified product was not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update product tags',
      message: error.message
    });
  }
});

// GET /products/:id/metafields - Get product metafields
router.get('/:id/metafields', async (req, res) => {
  try {
    const productId = req.params.id;
    const metafields = await shopify.getProductMetafields(productId);
    
    logger.logTask('get_product_metafields', {
      product_id: productId,
      count: metafields.length,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        metafields,
        count: metafields.length
      }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'GET /products/:id/metafields', 
      product_id: req.params.id,
      request_id: req.id 
    });
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The specified product was not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product metafields',
      message: error.message
    });
  }
});

// POST /products/:id/metafields - Update product metafield
router.post('/:id/metafields', validateRequest('updateMetafield'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { namespace, key, value, type = 'single_line_text_field' } = req.body;
    
    const metafield = await shopify.updateProductMetafield(productId, namespace, key, value, type);
    
    logger.logTask('update_product_metafield', {
      product_id: productId,
      namespace,
      key,
      value,
      type,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        metafield,
        message: `Successfully updated metafield ${namespace}.${key} for product ${productId}`
      }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'POST /products/:id/metafields', 
      product_id: req.params.id,
      metafield_data: req.body,
      request_id: req.id 
    });
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The specified product was not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update product metafield',
      message: error.message
    });
  }
});

module.exports = router; 