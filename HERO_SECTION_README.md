# 🎨 Kraftokase Hero Section

A dynamic, responsive hero section for the Kraftokase Shopify store that showcases premium phone cases with live product data integration.

## 📋 Overview

This hero section is designed to:
- **Display live product data** from your Shopify store
- **Showcase premium phone cases** with MagSafe and leather options
- **Drive conversions** with clear CTAs and trust indicators
- **Provide a luxury tech aesthetic** with modern design elements

## 🏗️ Architecture

### Files Created
```
kraftokase-preview-theme-v1/
├── sections/
│   └── hero-product.liquid          # Main hero section
├── templates/
│   └── index.json                   # Homepage template with hero section
└── kraftokase-mcp/
    ├── hero-section-builder.js      # MCP integration builder
    ├── hero-section-fallback.js     # Fallback generator
    ├── update-index-template.js     # Template updater
    └── hero-section-preview.html    # Visual preview
```

### Key Features

#### 🎯 **Dynamic Product Integration**
- Fetches live product data from Shopify via MCP
- Filters products by tags (MagSafe, Leather, etc.)
- Falls back gracefully if no products found
- Uses real product images, titles, and handles

#### 🎨 **Luxury Design Elements**
- Full-screen hero with gradient backgrounds
- Premium typography (Inter font family)
- Smooth hover animations and transitions
- Responsive design for all devices
- Backdrop blur effects and overlays

#### 🛒 **Conversion Optimization**
- Clear primary CTA ("Shop Now")
- Secondary CTA for collections
- Trust indicators (Premium Protection, Free Shipping, Lifetime Warranty)
- Shipping badge ("Ships in 24H ⏱️ | COD Available")
- Scroll indicator for engagement

## 🚀 Installation

### Step 1: Copy Files to Theme
```bash
# Copy the hero section to your Shopify theme
cp kraftokase-preview-theme-v1/sections/hero-product.liquid /path/to/your/theme/sections/

# Copy the updated index template
cp kraftokase-preview-theme-v1/templates/index.json /path/to/your/theme/templates/
```

### Step 2: Add to Theme
1. Go to Shopify Admin → Online Store → Themes
2. Click "Actions" → "Edit code"
3. Navigate to `sections/` and upload `hero-product.liquid`
4. Navigate to `templates/` and update `index.json`

### Step 3: Configure Settings
1. In Shopify theme editor, go to "Customize"
2. Select "Homepage"
3. Find "Hero Section" in the sections list
4. Configure:
   - **Headline**: "Your Phone Deserves Better."
   - **Product Title**: Your featured product
   - **Product Handle**: Product URL slug
   - **CTA Text**: "Shop Now"
   - **Background Image**: Upload product image

## ⚙️ Configuration Options

### Content Settings
- **Main Headline**: Primary hero text
- **Subheadline**: Supporting description
- **Product Title**: Overrides subheadline with product name

### Product Settings
- **Product Title**: Display product name as subheadline
- **Product Image**: Background image from product
- **Product Handle**: Link to specific product page

### Call-to-Action
- **Primary CTA Text**: "Shop Now" button text
- **Primary CTA Link**: Fallback link if no product
- **Secondary CTA Text**: "See Bestsellers" button text
- **Secondary CTA Link**: Collection or category page

### Display Options
- **Show Badge**: Toggle shipping badge
- **Badge Text**: Customize badge message
- **Show Trust Indicators**: Toggle trust elements
- **Show Scroll Indicator**: Toggle scroll animation

## 🔗 MCP Integration

### Live Product Data
The hero section can fetch real product data from your Shopify store via the Kraftokase MCP:

```javascript
// Example: Fetch products with MagSafe tags
const mcp = new KraftokaseMCP();
const products = await mcp.getProducts();
const magsafeProducts = products.filter(p => 
  p.tags.some(tag => tag.toLowerCase().includes('magsafe'))
);
```

### Fallback Mode
If MCP is unavailable, the section uses fallback data:
- **Product**: "Premium MagSafe Leather Case for iPhone 15 Pro"
- **Handle**: "premium-magsafe-leather-case-iphone-15-pro"
- **Image**: High-quality placeholder from Unsplash
- **Tags**: MagSafe, Leather, iPhone 15, Premium

## 🎨 Customization

### Styling
The hero section uses Tailwind CSS classes for styling:
- **Background**: Gradient from gray-900 to black
- **Typography**: Inter font family with responsive sizing
- **Animations**: Hover effects and scroll indicators
- **Responsive**: Mobile-first design approach

### Custom CSS
Add custom styles in the `<style>` block:
```css
.hero-section {
  font-family: 'Inter', sans-serif;
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 80vh;
  }
}
```

### Liquid Variables
Use Shopify Liquid variables for dynamic content:
```liquid
{{ section.settings.headline | default: 'Your Phone Deserves Better.' }}
{{ section.settings.product_title }}
{{ section.settings.product_handle }}
```

## 📱 Responsive Design

### Mobile (< 640px)
- Reduced font sizes
- Stacked CTA buttons
- 80vh minimum height
- Optimized spacing

### Tablet (640px - 1024px)
- Medium font sizes
- Side-by-side CTAs
- Balanced layout

### Desktop (> 1024px)
- Large typography
- Full-screen experience
- Maximum visual impact

## 🔧 Development

### Building with MCP
```bash
# Generate hero section with live data
node hero-section-builder.js

# Generate fallback version
node hero-section-fallback.js

# Update index template
node update-index-template.js
```

### Preview
Open `hero-section-preview.html` in a browser to see the design:
```bash
# View preview
open hero-section-preview.html
```

## 📊 Performance

### Optimizations
- **Lazy loading**: Images load with `loading="eager"` for hero
- **Minimal CSS**: Tailwind CSS for efficient styling
- **Fast rendering**: Optimized Liquid templates
- **CDN images**: Shopify CDN for product images

### Best Practices
- Use high-quality product images (1200x800px minimum)
- Optimize images for web (JPEG/WebP format)
- Test on multiple devices and screen sizes
- Monitor Core Web Vitals

## 🎯 A/B Testing

The hero section supports A/B testing through Shopify's built-in features:

### Headline Variations
1. "Your Phone Deserves Better." (emotional)
2. "Built for Your Life. Not the Shelf." (practical)
3. "Precision Grip. Camera Safe. MagSafe Ready." (feature-led)

### CTA Testing
- Primary: "Shop Now" vs "Buy Now"
- Secondary: "See Bestsellers" vs "Explore Collections"

### Trust Elements
- Badge: "Ships in 24H" vs "Free Shipping"
- Indicators: Different trust messages

## 🚀 Deployment

### Shopify Theme Upload
1. Zip the theme directory
2. Upload via Shopify Admin → Online Store → Themes
3. Preview and test the hero section
4. Publish when ready

### MCP Integration
1. Ensure MCP is deployed and accessible
2. Configure environment variables
3. Test product data fetching
4. Update hero section with live data

## 📞 Support

For questions or issues:
1. Check the preview HTML for visual verification
2. Test MCP connectivity with `test-cursor-integration.js`
3. Review Shopify theme documentation
4. Contact development team

---

**Built for Kraftokase** 🛡️ | **Premium Phone Cases** 📱 | **Luxury Tech Aesthetic** ✨ 