/**
 * Kraftokase Hero Section Builder
 * 
 * This script fetches live product data from the MCP and generates
 * a dynamic hero section for the Shopify theme.
 */

const KraftokaseMCP = require('./cursor-integration');

class HeroSectionBuilder {
  constructor() {
    this.mcp = new KraftokaseMCP();
  }

  // Fetch a product with specific tags
  async fetchHeroProduct(tags = ['MagSafe', 'Leather']) {
    try {
      console.log('🔍 Fetching products with tags:', tags);
      const products = await this.mcp.getProducts(50);
      
      // Filter products by tags
      const matchingProducts = products.filter(product => {
        if (!product.tags || !Array.isArray(product.tags)) return false;
        return tags.some(tag => 
          product.tags.some(productTag => 
            productTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
      });

      if (matchingProducts.length > 0) {
        const heroProduct = matchingProducts[0];
        console.log('✅ Found hero product:', heroProduct.title);
        return heroProduct;
      }

      // Fallback: get any product with images
      const productsWithImages = products.filter(product => 
        product.images && product.images.length > 0
      );

      if (productsWithImages.length > 0) {
        console.log('⚠️ Using fallback product:', productsWithImages[0].title);
        return productsWithImages[0];
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return null;
    }
  }

  // Generate Liquid code for the hero section
  generateHeroSection(product = null) {
    const isLiveProduct = product && product.id;
    
    return `{% comment %}
  Kraftokase Hero Section
  Dynamic hero section with live product data
{% endcomment %}

<div class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
  
  {% comment %} Background Image {% endcomment %}
  <div class="absolute inset-0 z-0">
    {% if section.settings.background_image %}
      <img 
        src="{{ section.settings.background_image | img_url: 'master' }}" 
        alt="{{ section.settings.background_image.alt | default: 'Kraftokase Hero Background' }}"
        class="w-full h-full object-cover opacity-40"
        loading="eager"
      >
    {% elsif section.settings.product_image %}
      <img 
        src="{{ section.settings.product_image | img_url: 'master' }}" 
        alt="{{ section.settings.product_title | default: 'Kraftokase Product' }}"
        class="w-full h-full object-cover opacity-40"
        loading="eager"
      >
    {% else %}
      <div class="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
    {% endif %}
    
    {% comment %} Overlay {% endcomment %}
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
  </div>

  {% comment %} Content Container {% endcomment %}
  <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="max-w-4xl mx-auto">
      
      {% comment %} Badge {% endcomment %}
      {% if section.settings.show_badge %}
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-8">
          <span class="mr-2">🚀</span>
          {{ section.settings.badge_text | default: 'Ships in 24H ⏱️ | COD Available' }}
        </div>
      {% endif %}

      {% comment %} Main Headline {% endcomment %}
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        {{ section.settings.headline | default: 'Your Phone Deserves Better.' }}
      </h1>

      {% comment %} Subheadline {% endcomment %}
      <p class="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
        {% if section.settings.product_title %}
          {{ section.settings.product_title }}
        {% else %}
          {{ section.settings.subheadline | default: 'Explore curated, premium cases engineered for grip, style & performance.' }}
        {% endif %}
      </p>

      {% comment %} CTA Buttons {% endcomment %}
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        
        {% comment %} Primary CTA {% endcomment %}
        {% if section.settings.product_handle %}
          <a 
            href="/products/{{ section.settings.product_handle }}" 
            class="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span class="mr-2">🛍️</span>
            {{ section.settings.primary_cta | default: 'Shop Now' }}
          </a>
        {% else %}
          <a 
            href="{{ section.settings.primary_cta_link | default: '/collections/all' }}" 
            class="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span class="mr-2">🛍️</span>
            {{ section.settings.primary_cta | default: 'Shop Collections' }}
          </a>
        {% endif %}

        {% comment %} Secondary CTA {% endcomment %}
        <a 
          href="{{ section.settings.secondary_cta_link | default: '/collections/magsafe-leather-series' }}" 
          class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
        >
          <span class="mr-2">✨</span>
          {{ section.settings.secondary_cta | default: 'See Bestsellers' }}
        </a>
      </div>

      {% comment %} Trust Indicators {% endcomment %}
      {% if section.settings.show_trust_indicators %}
        <div class="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-300 text-sm">
          <div class="flex items-center">
            <span class="mr-2">🛡️</span>
            Premium Protection
          </div>
          <div class="flex items-center">
            <span class="mr-2">🚚</span>
            Free Shipping
          </div>
          <div class="flex items-center">
            <span class="mr-2">💎</span>
            Lifetime Warranty
          </div>
        </div>
      {% endif %}
    </div>
  </div>

  {% comment %} Scroll Indicator {% endcomment %}
  {% if section.settings.show_scroll_indicator %}
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div class="animate-bounce">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  {% endif %}
</div>

{% comment %} Custom CSS {% endcomment %}
<style>
  .hero-section {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  @media (max-width: 640px) {
    .hero-section {
      min-height: 80vh;
    }
  }
</style>`;
  }

  // Generate JSON schema for Shopify section settings
  generateSectionSchema() {
    return `{
  "name": "Hero Section",
  "tag": "section",
  "class": "hero-section",
  "settings": [
    {
      "type": "header",
      "content": "Content Settings"
    },
    {
      "type": "text",
      "id": "headline",
      "label": "Main Headline",
      "default": "Your Phone Deserves Better."
    },
    {
      "type": "textarea",
      "id": "subheadline",
      "label": "Subheadline",
      "default": "Explore curated, premium cases engineered for grip, style & performance."
    },
    {
      "type": "header",
      "content": "Product Settings"
    },
    {
      "type": "text",
      "id": "product_title",
      "label": "Product Title (overrides subheadline)"
    },
    {
      "type": "image_picker",
      "id": "product_image",
      "label": "Product Background Image"
    },
    {
      "type": "text",
      "id": "product_handle",
      "label": "Product Handle (for CTA link)"
    },
    {
      "type": "header",
      "content": "Call-to-Action"
    },
    {
      "type": "text",
      "id": "primary_cta",
      "label": "Primary CTA Text",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "primary_cta_link",
      "label": "Primary CTA Link (if no product)"
    },
    {
      "type": "text",
      "id": "secondary_cta",
      "label": "Secondary CTA Text",
      "default": "See Bestsellers"
    },
    {
      "type": "url",
      "id": "secondary_cta_link",
      "label": "Secondary CTA Link",
      "default": "/collections/magsafe-leather-series"
    },
    {
      "type": "header",
      "content": "Background"
    },
    {
      "type": "image_picker",
      "id": "background_image",
      "label": "Background Image (overrides product image)"
    },
    {
      "type": "header",
      "content": "Display Options"
    },
    {
      "type": "checkbox",
      "id": "show_badge",
      "label": "Show Badge",
      "default": true
    },
    {
      "type": "text",
      "id": "badge_text",
      "label": "Badge Text",
      "default": "Ships in 24H ⏱️ | COD Available"
    },
    {
      "type": "checkbox",
      "id": "show_trust_indicators",
      "label": "Show Trust Indicators",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_scroll_indicator",
      "label": "Show Scroll Indicator",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Hero Section",
      "category": "Custom Sections"
    }
  ]
}`;
  }

  // Build complete hero section with live data
  async buildHeroSection() {
    console.log('🏗️ Building Hero Section...\n');
    
    // Try to fetch live product data
    const heroProduct = await this.fetchHeroProduct();
    
    // Generate the Liquid code
    const liquidCode = this.generateHeroSection(heroProduct);
    const schemaCode = this.generateSectionSchema();
    
    // Create the complete section file
    const completeSection = `${liquidCode}

{% comment %} Section Schema {% endcomment %}
{% schema %}
${schemaCode}
{% endschema %}`;

    return {
      liquidCode,
      schemaCode,
      completeSection,
      heroProduct
    };
  }
}

// Export for use
module.exports = HeroSectionBuilder;

// Example usage
async function buildHeroSection() {
  const builder = new HeroSectionBuilder();
  const result = await builder.buildHeroSection();
  
  console.log('🎉 Hero Section Built Successfully!');
  console.log('📦 Hero Product:', result.heroProduct ? result.heroProduct.title : 'None (using fallback)');
  console.log('📄 Liquid Code Length:', result.liquidCode.length, 'characters');
  console.log('⚙️ Schema Code Length:', result.schemaCode.length, 'characters');
  
  return result;
}

// Run if called directly
if (require.main === module) {
  buildHeroSection().catch(console.error);
} 