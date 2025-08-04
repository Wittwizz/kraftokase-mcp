/**
 * Fallback Hero Section Generator
 * 
 * This generates a hero section without requiring MCP connectivity
 */

const fs = require('fs');
const path = require('path');

// Sample product data for fallback
const FALLBACK_PRODUCT = {
  id: 'sample-1',
  title: 'Premium MagSafe Leather Case for iPhone 15 Pro',
  handle: 'premium-magsafe-leather-case-iphone-15-pro',
  tags: ['MagSafe', 'Leather', 'iPhone 15', 'Premium'],
  images: [{
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop&crop=center'
  }],
  price: '₹2,499',
  vendor: 'Kraftokase'
};

function generateHeroSectionLiquid(product = FALLBACK_PRODUCT) {
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

function generateSectionSchema() {
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

function generatePreviewHtml(product = FALLBACK_PRODUCT) {
  const productTitle = product.title;
  const productHandle = product.handle;
  const productImage = product.images && product.images.length > 0 
    ? product.images[0].src 
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kraftokase Hero Section Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce {
            0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
    </style>
</head>
<body>
    <div class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
            <img 
                src="${productImage}" 
                alt="${productTitle}"
                class="w-full h-full object-cover opacity-40"
                loading="eager"
            >
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <!-- Content Container -->
        <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="max-w-4xl mx-auto">
                
                <!-- Badge -->
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-8">
                    <span class="mr-2">🚀</span>
                    Ships in 24H ⏱️ | COD Available
                </div>

                <!-- Main Headline -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Your Phone Deserves Better.
                </h1>

                <!-- Subheadline -->
                <p class="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                    ${productTitle}
                </p>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    
                    <!-- Primary CTA -->
                    <a 
                        href="/products/${productHandle}" 
                        class="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <span class="mr-2">🛍️</span>
                        Shop Now
                    </a>

                    <!-- Secondary CTA -->
                    <a 
                        href="/collections/magsafe-leather-series" 
                        class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                    >
                        <span class="mr-2">✨</span>
                        See Bestsellers
                    </a>
                </div>

                <!-- Trust Indicators -->
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
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div class="animate-bounce">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </div>
    </div>

    <div class="bg-gray-100 p-8">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Hero Section Preview</h2>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="font-semibold mb-2">Product Data Used:</h3>
                <ul class="text-sm space-y-1">
                    <li><strong>Title:</strong> ${productTitle}</li>
                    <li><strong>Handle:</strong> ${productHandle}</li>
                    <li><strong>Image:</strong> ${productImage}</li>
                    <li><strong>Tags:</strong> ${product.tags ? product.tags.join(', ') : 'None'}</li>
                    <li><strong>Price:</strong> ${product.price || 'N/A'}</li>
                    <li><strong>Vendor:</strong> ${product.vendor || 'N/A'}</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
}

async function generateHeroSectionFallback() {
  console.log('🎨 Generating Kraftokase Hero Section (Fallback Mode)...\n');
  
  try {
    // Create theme directory structure if it doesn't exist
    const themeDir = path.join(__dirname, '..', 'kraftokase-preview-theme-v1');
    const sectionsDir = path.join(themeDir, 'sections');
    
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir, { recursive: true });
      console.log('📁 Created theme directory:', themeDir);
    }
    
    if (!fs.existsSync(sectionsDir)) {
      fs.mkdirSync(sectionsDir, { recursive: true });
      console.log('📁 Created sections directory:', sectionsDir);
    }
    
    // Generate the hero section
    const liquidCode = generateHeroSectionLiquid(FALLBACK_PRODUCT);
    const schemaCode = generateSectionSchema();
    const completeSection = `${liquidCode}

{% comment %} Section Schema {% endcomment %}
{% schema %}
${schemaCode}
{% endschema %}`;
    
    // Save the hero section file
    const heroSectionPath = path.join(sectionsDir, 'hero-product.liquid');
    fs.writeFileSync(heroSectionPath, completeSection);
    
    console.log('✅ Hero section saved to:', heroSectionPath);
    
    // Create a preview HTML file
    const previewHtml = generatePreviewHtml(FALLBACK_PRODUCT);
    const previewPath = path.join(__dirname, 'hero-section-preview.html');
    fs.writeFileSync(previewPath, previewHtml);
    
    console.log('✅ Preview HTML saved to:', previewPath);
    
    // Display results
    console.log('\n📊 Generation Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Hero Product:', FALLBACK_PRODUCT.title);
    console.log('   - ID:', FALLBACK_PRODUCT.id);
    console.log('   - Handle:', FALLBACK_PRODUCT.handle);
    console.log('   - Tags:', FALLBACK_PRODUCT.tags.join(', '));
    console.log('   - Price:', FALLBACK_PRODUCT.price);
    console.log('   - Vendor:', FALLBACK_PRODUCT.vendor);
    console.log('📄 Liquid Code Length:', liquidCode.length, 'characters');
    console.log('⚙️ Schema Code Length:', schemaCode.length, 'characters');
    console.log('📁 Files Created:');
    console.log('   - sections/hero-product.liquid');
    console.log('   - hero-section-preview.html');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Copy sections/hero-product.liquid to your Shopify theme');
    console.log('2. Add the section to your index.json template');
    console.log('3. Configure the section settings in Shopify admin');
    console.log('4. View the preview HTML to see the design');
    console.log('5. Replace with live product data when MCP is connected');
    
    return {
      liquidCode,
      schemaCode,
      completeSection,
      heroProduct: FALLBACK_PRODUCT
    };
    
  } catch (error) {
    console.error('❌ Error generating hero section:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateHeroSectionFallback().catch(console.error);
}

module.exports = { 
  generateHeroSectionFallback, 
  generateHeroSectionLiquid, 
  generateSectionSchema, 
  generatePreviewHtml,
  FALLBACK_PRODUCT 
}; 