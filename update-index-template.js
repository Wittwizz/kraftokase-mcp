/**
 * Update Index Template for Kraftokase Theme
 * 
 * This script updates the index.json template to include the new hero section
 */

const fs = require('fs');
const path = require('path');

function generateIndexTemplate() {
  return `{
  "sections": {
    "hero_product": {
      "type": "hero-product",
      "settings": {
        "headline": "Your Phone Deserves Better.",
        "subheadline": "Explore curated, premium cases engineered for grip, style & performance.",
        "product_title": "Premium MagSafe Leather Case for iPhone 15 Pro",
        "product_handle": "premium-magsafe-leather-case-iphone-15-pro",
        "primary_cta": "Shop Now",
        "secondary_cta": "See Bestsellers",
        "secondary_cta_link": "/collections/magsafe-leather-series",
        "show_badge": true,
        "badge_text": "Ships in 24H ⏱️ | COD Available",
        "show_trust_indicators": true,
        "show_scroll_indicator": true
      }
    },
    "featured_collections": {
      "type": "featured-collections",
      "settings": {
        "title": "Shop by Category",
        "subtitle": "Find the perfect case for your device"
      }
    },
    "trust_block": {
      "type": "trust-block",
      "settings": {
        "title": "Why Choose Kraftokase?",
        "show_trust_indicators": true
      }
    },
    "newsletter_signup": {
      "type": "newsletter-signup",
      "settings": {
        "title": "Stay Updated",
        "subtitle": "Get notified about new products and exclusive offers"
      }
    }
  },
  "order": [
    "hero_product",
    "featured_collections", 
    "trust_block",
    "newsletter_signup"
  ]
}`;
}

async function updateIndexTemplate() {
  console.log('📝 Updating Index Template...\n');
  
  try {
    // Create theme directory structure if it doesn't exist
    const themeDir = path.join(__dirname, '..', 'kraftokase-preview-theme-v1');
    const templatesDir = path.join(themeDir, 'templates');
    
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir, { recursive: true });
      console.log('📁 Created theme directory:', themeDir);
    }
    
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
      console.log('📁 Created templates directory:', templatesDir);
    }
    
    // Generate the index template
    const indexTemplate = generateIndexTemplate();
    
    // Save the index template file
    const indexPath = path.join(templatesDir, 'index.json');
    fs.writeFileSync(indexPath, indexTemplate);
    
    console.log('✅ Index template saved to:', indexPath);
    
    // Display the template structure
    console.log('\n📋 Template Structure:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. hero_product - Dynamic hero section with product data');
    console.log('2. featured_collections - Category showcase');
    console.log('3. trust_block - Trust indicators and social proof');
    console.log('4. newsletter_signup - Email capture');
    
    console.log('\n🎯 Hero Section Settings:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('• Headline: "Your Phone Deserves Better."');
    console.log('• Product: Premium MagSafe Leather Case for iPhone 15 Pro');
    console.log('• Primary CTA: "Shop Now" → /products/premium-magsafe-leather-case-iphone-15-pro');
    console.log('• Secondary CTA: "See Bestsellers" → /collections/magsafe-leather-series');
    console.log('• Badge: "Ships in 24H ⏱️ | COD Available"');
    console.log('• Trust Indicators: Premium Protection, Free Shipping, Lifetime Warranty');
    
    return indexTemplate;
    
  } catch (error) {
    console.error('❌ Error updating index template:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  updateIndexTemplate().catch(console.error);
}

module.exports = { updateIndexTemplate, generateIndexTemplate }; 