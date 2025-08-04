/**
 * Test script for Kraftokase MCP integration
 * Run this to verify your MCP is working correctly
 */

const KraftokaseMCP = require('./cursor-integration');

async function testMCPIntegration() {
  console.log('🧪 Testing Kraftokase MCP Integration...\n');
  
  const mcp = new KraftokaseMCP();
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await mcp.checkHealth();
    console.log('✅ Health Check Result:', health);
    console.log('');
    
    // Test 2: Get Products
    console.log('2️⃣ Testing Get Products...');
    const products = await mcp.getProducts(5); // Get first 5 products
    console.log(`✅ Found ${products.length} products`);
    if (products.length > 0) {
      console.log('📦 Sample Product:', {
        id: products[0].id,
        title: products[0].title,
        tags: products[0].tags
      });
    }
    console.log('');
    
    // Test 3: Get Collections
    console.log('3️⃣ Testing Get Collections...');
    const collections = await mcp.getCollections();
    console.log(`✅ Found ${collections.length} collections`);
    console.log('');
    
    console.log('🎉 All tests passed! Your MCP is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMCPIntegration(); 