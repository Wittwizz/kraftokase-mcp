const express = require('express');
const router = express.Router();
const shopify = require('../lib/shopify');
const logger = require('../lib/logger');
const { validateRequest } = require('../lib/middleware');

// GET /collections - Fetch all collections
router.get('/', async (req, res) => {
  try {
    const collections = await shopify.getCollections();
    
    logger.logTask('get_collections', {
      count: collections.length,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        collections,
        count: collections.length
      }
    });
  } catch (error) {
    logger.logError(error, { endpoint: 'GET /collections', request_id: req.id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections',
      message: error.message
    });
  }
});

// POST /collections - Create smart collection
router.post('/', validateRequest('createCollection'), async (req, res) => {
  try {
    const { title, rule_keywords, description } = req.body;
    
    const collection = await shopify.createSmartCollection({
      title,
      rule_keywords,
      description
    });
    
    logger.logTask('create_smart_collection', {
      title,
      rule_keywords,
      collection_id: collection.id,
      request_id: req.id
    });

    res.status(201).json({
      success: true,
      data: {
        collection,
        message: `Successfully created smart collection: ${title}`
      }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'POST /collections', 
      collection_data: req.body,
      request_id: req.id 
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to create collection',
      message: error.message
    });
  }
});

// POST /sync/products/metafield - Bulk update products by keyword
router.post('/sync/products/metafield', validateRequest('updateMetafield'), async (req, res) => {
  try {
    const { namespace, key, value, type = 'single_line_text_field' } = req.body;
    const keyword = req.query.keyword || req.body.keyword;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Missing keyword',
        message: 'Keyword parameter is required for bulk metafield updates'
      });
    }
    
    const result = await shopify.updateProductsByKeyword(keyword, {
      namespace,
      key,
      value,
      type
    });
    
    logger.logTask('bulk_metafield_update', {
      keyword,
      namespace,
      key,
      value,
      total_products: result.total_products,
      successful_updates: result.results.filter(r => r.success).length,
      failed_updates: result.results.filter(r => !r.success).length,
      request_id: req.id
    });

    res.json({
      success: true,
      data: {
        ...result,
        message: `Bulk metafield update completed for keyword: ${keyword}`
      }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'POST /sync/products/metafield', 
      metafield_data: req.body,
      keyword: req.query.keyword || req.body.keyword,
      request_id: req.id 
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to perform bulk metafield update',
      message: error.message
    });
  }
});

// GET /collections/:id - Get single collection
router.get('/:id', async (req, res) => {
  try {
    const collectionId = req.params.id;
    const collections = await shopify.getCollections();
    const collection = collections.find(c => c.id.toString() === collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
        message: 'The specified collection was not found'
      });
    }
    
    logger.logTask('get_collection', {
      collection_id: collectionId,
      request_id: req.id
    });

    res.json({
      success: true,
      data: { collection }
    });
  } catch (error) {
    logger.logError(error, { 
      endpoint: 'GET /collections/:id', 
      collection_id: req.params.id,
      request_id: req.id 
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection',
      message: error.message
    });
  }
});

module.exports = router; 