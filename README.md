# 🚀 Kraftokase MCP (Middleware Control Panel)

A secure, full-stack middleware control panel for managing Kraftokase Shopify store operations. This MCP acts as an intermediary between GPT agents/Cursor and the Shopify Admin API, providing secure endpoints for product management, collection creation, and bulk operations.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GPT Agent     │───▶│   Kraftokase    │───▶│   Shopify       │
│   / Cursor      │    │      MCP        │    │   Admin API     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Logs &        │
                       │   Monitoring    │
                       └─────────────────┘
```

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Authentication**: API Key via Header
- **Validation**: Joi schema validation
- **Logging**: Winston with file rotation
- **Security**: Helmet, CORS, Rate limiting
- **Shopify**: Official Admin REST API
- **Hosting**: Ready for Vercel/Render deployment

## 📦 Features

### 🔐 Security
- API Key authentication for all endpoints
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi schemas
- CORS protection
- Helmet security headers

### 📊 Logging & Monitoring
- Comprehensive request/response logging
- Error tracking with stack traces
- Task-specific logging for operations
- File rotation and size management
- Health check endpoint

### 🛍️ Shopify Operations
- **Products**: Fetch, update tags, manage metafields
- **Collections**: Create smart collections with keyword rules
- **Bulk Operations**: Update multiple products by keyword
- **Rate Limiting**: Built-in delays to respect Shopify API limits

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd kraftokase-mcp
npm install
```

### 2. Environment Setup

Copy the environment example and configure your credentials:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Shopify Store Configuration
SHOPIFY_STORE_DOMAIN=ebbd7f-b0.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_XXXXXX
SHOPIFY_API_VERSION=2024-01

# MCP Configuration
MCP_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=production
```

### 3. Run Locally

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 4. Test Connection

```bash
curl http://localhost:3000/health
```

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_ACCESS_TOKEN`
   - `MCP_API_KEY`
   - `NODE_ENV=production`

### Render Deployment

1. **Connect Repository** to Render
2. **Set Build Command**: `npm install`
3. **Set Start Command**: `npm start`
4. **Add Environment Variables** in Render dashboard

## 📚 API Documentation

### Authentication

All endpoints require the `X-API-Key` header:

```bash
X-API-Key: YOUR_API_KEY
```

### Endpoints

#### Health Check
```http
GET /health
```
*No authentication required*

#### Products

**Get All Products**
```http
GET /products?limit=250
```

**Get Single Product**
```http
GET /products/:id
```

**Update Product Tags**
```http
PUT /products/:id/tags
Content-Type: application/json

{
  "tags": ["MagSafe", "iPhone 15", "Premium"]
}
```

**Get Product Metafields**
```http
GET /products/:id/metafields
```

**Update Product Metafield**
```http
POST /products/:id/metafields
Content-Type: application/json

{
  "namespace": "custom",
  "key": "featured",
  "value": "true",
  "type": "boolean"
}
```

#### Collections

**Get All Collections**
```http
GET /collections
```

**Create Smart Collection**
```http
POST /collections
Content-Type: application/json

{
  "title": "Premium Leather Cases",
  "rule_keywords": ["leather", "premium"],
  "description": "High-quality leather phone cases"
}
```

**Get Single Collection**
```http
GET /collections/:id
```

#### Bulk Operations

**Bulk Update Products by Keyword**
```http
POST /sync/products/metafield?keyword=iPhone
Content-Type: application/json

{
  "namespace": "custom",
  "key": "device_type",
  "value": "iPhone",
  "type": "single_line_text_field"
}
```

## 🔧 Usage Examples

### Using with Cursor/GPT Agents

```javascript
// Example: Update product tags via MCP
const response = await fetch('https://your-mcp.vercel.app/products/123/tags', {
  method: 'PUT',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tags: ['MagSafe', 'iPhone 15', 'Premium']
  })
});

const result = await response.json();
console.log(result);
```

### Using with curl

```bash
# Get all products
curl -X GET "https://your-mcp.vercel.app/products" \
  -H "X-API-Key: your-api-key"

# Create smart collection
curl -X POST "https://your-mcp.vercel.app/collections" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MagSafe Cases",
    "rule_keywords": ["MagSafe"],
    "description": "MagSafe compatible phone cases"
  }'

# Bulk update products
curl -X POST "https://your-mcp.vercel.app/sync/products/metafield?keyword=leather" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "custom",
    "key": "material",
    "value": "leather"
  }'
```

## 📊 Monitoring & Logs

### Log Files

- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/tasks.log` - Task-specific operations

### Health Check

```bash
curl https://your-mcp.vercel.app/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "shopify_connection": true,
  "environment": "production"
}
```

## 🔒 Security Considerations

1. **API Key**: Keep your MCP API key secure and rotate regularly
2. **Shopify Token**: Never expose your Shopify access token
3. **Rate Limiting**: Respect the built-in rate limits
4. **Environment Variables**: Use secure environment variable management
5. **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized**
- Check your `X-API-Key` header
- Verify the API key in your environment variables

**429 Rate Limited**
- Wait for the rate limit window to reset
- Reduce request frequency

**500 Internal Server Error**
- Check the logs in `logs/error.log`
- Verify Shopify credentials
- Ensure all environment variables are set

### Debug Mode

Set `NODE_ENV=development` to enable console logging:

```bash
NODE_ENV=development npm start
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Verify your environment configuration
3. Test with the provided `test.http` file
4. Check the health endpoint for system status

---

**Built for Kraftokase** 🛡️📱 