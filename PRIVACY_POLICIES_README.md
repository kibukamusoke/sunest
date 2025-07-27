# Privacy Policies API & Web Pages

This module provides both API endpoints and web pages for managing and displaying privacy policies for applications.

## Features

- **API Endpoints**: RESTful API for managing privacy policies
- **Web Pages**: Beautiful, responsive web pages for displaying privacy policies
- **Search Functionality**: Search policies by app name, content, or language
- **Multiple Access Methods**: Access policies by ID, app ID, or app name

## API Endpoints

### Base URL: `/api/privacy-policies`

#### GET `/api/privacy-policies`
Get all privacy policies

#### GET `/api/privacy-policies/ids`
Get all privacy policy IDs

#### GET `/api/privacy-policies/:id`
Get privacy policy by ID

#### GET `/api/privacy-policies/app/:appId`
Get privacy policy by app ID

#### GET `/api/privacy-policies/app/name/:appName`
Get privacy policy by app name

#### GET `/api/privacy-policies/:id/content`
Get privacy policy content only

#### GET `/api/privacy-policies/search/query?q=query&language=en`
Search privacy policies

#### POST `/api/privacy-policies`
Create a new privacy policy

#### PUT `/api/privacy-policies/:id`
Update an existing privacy policy

#### DELETE `/api/privacy-policies/:id`
Delete a privacy policy

## Web Pages

### Base URL: `/` (no API prefix)

#### GET `/privacy-policies`
Display a list of all privacy policies with search functionality

#### GET `/privacy-policy/:id`
Display a specific privacy policy by ID

#### GET `/privacy-policy/app/:appId`
Display a privacy policy by app ID

#### GET `/privacy-policy/app/name/:appName`
Display a privacy policy by app name

## Usage Examples

### API Examples

```bash
# Get all policies
curl http://localhost:3000/api/privacy-policies

# Get Docker Monitor policy by app ID
curl http://localhost:3000/api/privacy-policies/app/88101862-20ac-40cf-a3b0-2e21dfe1032c

# Search policies
curl "http://localhost:3000/api/privacy-policies/search/query?q=docker&language=en"

# Create a new policy
curl -X POST http://localhost:3000/api/privacy-policies \
  -H "Content-Type: application/json" \
  -d '{
    "id": "my-app",
    "appName": "My App",
    "appId": "12345678-1234-1234-1234-123456789012",
    "version": "1.0.0",
    "content": "# Privacy Policy\n\nThis is my app's privacy policy...",
    "language": "en"
  }'
```

### Web Page Examples

```bash
# View all policies
open http://localhost:3000/privacy-policies

# View Docker Monitor policy
open http://localhost:3000/privacy-policy/docker-monitor

# View by app ID
open http://localhost:3000/privacy-policy/app/88101862-20ac-40cf-a3b0-2e21dfe1032c

# View by app name
open http://localhost:3000/privacy-policy/app/name/Docker%20Monitor
```

## Privacy Policy Structure

```typescript
interface PrivacyPolicy {
  id: string;           // Unique identifier
  appName: string;      // Application name
  appId: string;        // Application ID
  version: string;      // Policy version
  lastUpdated: string;  // Last update date (YYYY-MM-DD)
  content: string;      // Policy content (Markdown)
  language: string;     // Language code (en, es, fr, etc.)
}
```

## Current Policies

### Docker Monitor
- **ID**: `docker-monitor`
- **App Name**: Docker Monitor
- **App ID**: `88101862-20ac-40cf-a3b0-2e21dfe1032c`
- **Version**: 1.0.0
- **Language**: English
- **Features**: 
  - Local data storage
  - SSH tunneling
  - No cloud dependencies
  - GDPR/CCPA compliant

## Adding New Policies

To add a new privacy policy, you can either:

1. **Use the API**:
   ```bash
   curl -X POST http://localhost:3000/api/privacy-policies \
     -H "Content-Type: application/json" \
     -d '{
       "id": "your-app-id",
       "appName": "Your App Name",
       "appId": "your-app-uuid",
       "version": "1.0.0",
       "content": "# Your Privacy Policy\n\nContent here...",
       "language": "en"
     }'
   ```

2. **Add to the service** (for permanent policies):
   Edit `src/modules/privacy-policies/privacy-policies.service.ts` and add to the `initializePolicies()` method.

## Templates

The web pages use Handlebars templates:

- `src/views/privacy-policies-list.hbs` - List of all policies
- `src/views/privacy-policy.hbs` - Individual policy display

## Styling

The web pages include responsive CSS with:
- Modern, clean design
- Mobile-friendly layout
- Professional typography
- Consistent branding
- Accessibility features

## Security

- All API endpoints are properly validated
- Input sanitization for search queries
- Proper error handling and status codes
- No sensitive data exposure

## Future Enhancements

- [ ] Multi-language support with automatic translation
- [ ] Policy versioning and history
- [ ] PDF export functionality
- [ ] Policy comparison tools
- [ ] Automated compliance checking
- [ ] Integration with legal compliance services 