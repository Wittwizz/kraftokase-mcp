/**
 * Kraftokase MCP - Cursor Integration
 * 
 * This file provides easy access to your Kraftokase MCP endpoints
 * from within Cursor or any JavaScript environment.
 */

class KraftokaseMCP {
  constructor() {
    this.baseURL = 'https://kraftokase-ifvniehl1-workxdipanshu-6189s-projects.vercel.app';
    this.apiKey = 'b7c9dd0e79ea96b6d8ab9b2606df491a';
    this.headers = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  // Health check
  async checkHealth() {
    const response = await fetch(`${this.baseURL}/health`);
    return await response.json();
  }

  // Get all products
  async getProducts(limit = 250) {
    const response = await fetch(`${this.baseURL}/products?limit=${limit}`, {
      headers: this.headers
    });
    return await response.json();
  }

  // Get single product
  async getProduct(productId) {
    const response = await fetch(`${this.baseURL}/products/${productId}`, {
      headers: this.headers
    });
    return await response.json();
  }

  // Update product tags
  async updateProductTags(productId, tags) {
    const response = await fetch(`${this.baseURL}/products/${productId}/tags`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({ tags })
    });
    return await response.json();
  }

  // Get product metafields
  async getProductMetafields(productId) {
    const response = await fetch(`${this.baseURL}/products/${productId}/metafields`, {
      headers: this.headers
    });
    return await response.json();
  }

  // Update product metafield
  async updateProductMetafield(productId, namespace, key, value, type = 'single_line_text_field') {
    const response = await fetch(`${this.baseURL}/products/${productId}/metafields`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ namespace, key, value, type })
    });
    return await response.json();
  }

  // Get all collections
  async getCollections() {
    const response = await fetch(`${this.baseURL}/collections`, {
      headers: this.headers
    });
    return await response.json();
  }

  // Create smart collection
  async createSmartCollection(title, ruleKeywords, description = '') {
    const response = await fetch(`${this.baseURL}/collections`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        title,
        rule_keywords: ruleKeywords,
        description
      })
    });
    return await response.json();
  }

  // Bulk update products by keyword
  async bulkUpdateProductsByKeyword(keyword, namespace, key, value, type = 'single_line_text_field') {
    const response = await fetch(`${this.baseURL}/sync/products/metafield?keyword=${encodeURIComponent(keyword)}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ namespace, key, value, type })
    });
    return await response.json();
  }
}

// Export for use in Cursor
module.exports = KraftokaseMCP;

// Example usage:
/*
const mcp = new KraftokaseMCP();

// Check health
mcp.checkHealth().then(console.log);

// Get all products
mcp.getProducts().then(products => {
  console.log(`Found ${products.length} products`);
});

// Update product tags
mcp.updateProductTags(123, ['MagSafe', 'iPhone 15', 'Premium']).then(console.log);

// Create smart collection
mcp.createSmartCollection('MagSafe Cases', ['MagSafe'], 'MagSafe compatible phone cases').then(console.log);
*/ 