# Open Food Facts API Integration

This backend is configured to use authenticated Open Food Facts API for reliable product data retrieval.

## Configuration

The API credentials are configured in the `.env` file:

```bash
# Open Food Facts API credentials
OPENFOODFACTS_USERNAME=your_openfoodfacts_username
OPENFOODFACTS_PASSWORD=your_openfoodfacts_password
OPENFOODFACTS_USER_AGENT=YourAppName/1.0 (your_email@example.com)
```

## Features Enabled

- ✅ **Authenticated Requests**: Higher rate limits (100 req/min vs anonymous limits)
- ✅ **Proper User-Agent**: Identifies your app to prevent bot detection
- ✅ **Real-time Data**: Fresh product information from Open Food Facts database
- ✅ **Product Caching**: Products stored locally for faster subsequent requests

## Rate Limits

With authenticated access, you get:
- **100 requests/minute** for product queries (vs lower limits for anonymous users)
- **More reliable access** without IP banning risk
- **Better priority** during high-traffic periods

## Test Products

Try these barcodes to test the integration:

1. **3228857000906** - Harry's Bread (HealthScore: 7)
2. **5449000000996** - Coca-Cola (HealthScore: 7) 
3. **5449000131805** - Coca-Cola Zero (HealthScore: 6)

## API Endpoints

### Get Product (from database cache)
```bash
GET /api/products/barcode/{barcode}
```

### Fetch Product (from Open Food Facts API)
```bash
POST /api/products/barcode/{barcode}/fetch
```

## Authentication Notes

- Uses Basic Authentication with your Open Food Facts credentials
- Includes proper User-Agent header as per API documentation
- Follows Open Food Facts API usage guidelines
- Ready for production deployment

For more details, see: https://openfoodfacts.github.io/openfoodfacts-server/api/
