/**
 * Generate Hero Section for Kraftokase Theme
 * 
 * This script builds the hero section and saves it to the theme directory
 */

const fs = require('fs');
const path = require('path');
const HeroSectionBuilder = require('./hero-section-builder');

async function generateHeroSection() {
  console.log('🎨 Generating Kraftokase Hero Section...\n');
  
  try {
    // Build the hero section
    const builder = new HeroSectionBuilder();
    const result = await builder.buildHeroSection();
    
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
    
    // Save the hero section file
    const heroSectionPath = path.join(sectionsDir, 'hero-product.liquid');
    fs.writeFileSync(heroSectionPath, result.completeSection);
    
    console.log('✅ Hero section saved to:', heroSectionPath);
    
    // Create a preview HTML file
    const previewHtml = generatePreviewHtml(result.heroProduct);
    const previewPath = path.join(__dirname, 'hero-section-preview.html');
    fs.writeFileSync(previewPath, previewHtml);
    
    console.log('✅ Preview HTML saved to:', previewPath);
    
    // Display results
    console.log('\n📊 Generation Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Hero Product:', result.heroProduct ? result.heroProduct.title : 'None (using fallback)');
    if (result.heroProduct) {
      console.log('   - ID:', result.heroProduct.id);
      console.log('   - Handle:', result.heroProduct.handle);
      console.log('   - Tags:', result.heroProduct.tags ? result.heroProduct.tags.join(', ') : 'None');
      console.log('   - Images:', result.heroProduct.images ? result.heroProduct.images.length : 0);
    }
    console.log('📄 Liquid Code Length:', result.liquidCode.length, 'characters');
    console.log('⚙️ Schema Code Length:', result.schemaCode.length, 'characters');
    console.log('📁 Files Created:');
    console.log('   - sections/hero-product.liquid');
    console.log('   - hero-section-preview.html');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Copy sections/hero-product.liquid to your Shopify theme');
    console.log('2. Add the section to your index.json template');
    console.log('3. Configure the section settings in Shopify admin');
    console.log('4. View the preview HTML to see the design');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error generating hero section:', error.message);
    throw error;
  }
}

function generatePreviewHtml(heroProduct) {
  const productTitle = heroProduct ? heroProduct.title : 'Explore MagSafe Leather Cases';
  const productHandle = heroProduct ? heroProduct.handle : 'magsafe-leather-series';
  const productImage = heroProduct && heroProduct.images && heroProduct.images.length > 0 
    ? heroProduct.images[0].src 
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
                    <li><strong>Tags:</strong> ${heroProduct && heroProduct.tags ? heroProduct.tags.join(', ') : 'None'}</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Run if called directly
if (require.main === module) {
  generateHeroSection().catch(console.error);
}

module.exports = { generateHeroSection, generatePreviewHtml }; 