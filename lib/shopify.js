const axios = require('axios');
const logger = require('./logger');

class ShopifyAPI {
  constructor() {
    this.storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
    this.baseURL = `https://${this.storeDomain}/admin/api/${this.apiVersion}`;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`Shopify API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Shopify API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`Shopify API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Shopify API Response Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  // Rate limiting helper
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all products with basic info
  async getProducts(limit = 250) {
    try {
      const response = await this.client.get('/products.json', {
        params: {
          limit,
          fields: 'id,title,handle,tags,images,vendor,product_type,created_at,updated_at'
        }
      });
      
      await this.delay(); // Rate limiting
      return response.data.products;
    } catch (error) {
      logger.error('Error fetching products:', error.message);
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(productId) {
    try {
      const response = await this.client.get(`/products/${productId}.json`);
      await this.delay();
      return response.data.product;
    } catch (error) {
      logger.error(`Error fetching product ${productId}:`, error.message);
      throw error;
    }
  }

  // Update product tags
  async updateProductTags(productId, tags) {
    try {
      const response = await this.client.put(`/products/${productId}.json`, {
        product: {
          id: productId,
          tags: tags.join(', ')
        }
      });
      
      await this.delay();
      logger.info(`Updated tags for product ${productId}: ${tags.join(', ')}`);
      return response.data.product;
    } catch (error) {
      logger.error(`Error updating tags for product ${productId}:`, error.message);
      throw error;
    }
  }

  // Create smart collection
  async createSmartCollection(collectionData) {
    try {
      const { title, rule_keywords, description = '' } = collectionData;
      
      const rules = rule_keywords.map(keyword => ({
        column: 'tag',
        relation: 'equals',
        condition: keyword
      }));

      const response = await this.client.post('/collections.json', {
        collection: {
          title,
          body_html: description,
          collection_type: 'smart',
          rules: rules,
          published: true
        }
      });
      
      await this.delay();
      logger.info(`Created smart collection: ${title}`);
      return response.data.collection;
    } catch (error) {
      logger.error('Error creating smart collection:', error.message);
      throw error;
    }
  }

  // Get all collections
  async getCollections() {
    try {
      const response = await this.client.get('/collections.json');
      await this.delay();
      return response.data.collections;
    } catch (error) {
      logger.error('Error fetching collections:', error.message);
      throw error;
    }
  }

  // Update product metafield
  async updateProductMetafield(productId, namespace, key, value, type = 'single_line_text_field') {
    try {
      const response = await this.client.post(`/products/${productId}/metafields.json`, {
        metafield: {
          namespace,
          key,
          value: value.toString(),
          type
        }
      });
      
      await this.delay();
      logger.info(`Updated metafield for product ${productId}: ${namespace}.${key} = ${value}`);
      return response.data.metafield;
    } catch (error) {
      logger.error(`Error updating metafield for product ${productId}:`, error.message);
      throw error;
    }
  }

  // Bulk update products by title keyword
  async updateProductsByKeyword(keyword, metafieldData) {
    try {
      const products = await this.getProducts();
      const matchingProducts = products.filter(product => 
        product.title.toLowerCase().includes(keyword.toLowerCase())
      );

      logger.info(`Found ${matchingProducts.length} products matching keyword: ${keyword}`);

      const results = [];
      for (const product of matchingProducts) {
        try {
          const result = await this.updateProductMetafield(
            product.id,
            metafieldData.namespace,
            metafieldData.key,
            metafieldData.value,
            metafieldData.type
          );
          results.push({ product_id: product.id, success: true, metafield: result });
        } catch (error) {
          results.push({ product_id: product.id, success: false, error: error.message });
        }
        await this.delay(1000); // Longer delay for bulk operations
      }

      return {
        keyword,
        total_products: matchingProducts.length,
        results
      };
    } catch (error) {
      logger.error('Error in bulk metafield update:', error.message);
      throw error;
    }
  }

  // Get product metafields
  async getProductMetafields(productId) {
    try {
      const response = await this.client.get(`/products/${productId}/metafields.json`);
      await this.delay();
      return response.data.metafields;
    } catch (error) {
      logger.error(`Error fetching metafields for product ${productId}:`, error.message);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const response = await this.client.get('/shop.json');
      await this.delay();
      return {
        success: true,
        shop: response.data.shop,
        message: 'Connection successful'
      };
    } catch (error) {
      logger.error('Connection test failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ShopifyAPI(); 