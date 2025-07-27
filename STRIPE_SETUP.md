# Stripe Integration Setup Guide

## Overview
This guide helps you set up the Stripe integration for the subscription system in the Doctopus backend.

## Required Environment Variables

Add these variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to your Stripe Dashboard → Products
2. Create a new product called "Doctopus Premium"
3. Add two prices:
   - Monthly: `$9.99/month` (recurring)
   - Yearly: `$99.99/year` (recurring)

### 2. Configure Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Create a new webhook endpoint: `https://yourdomain.com/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
4. Copy the webhook secret and add it to your `.env` file

### 3. Test the Integration

Use Stripe's test mode:
- Use test credit cards: `4242 4242 4242 4242`
- Test webhooks with Stripe CLI: `stripe listen --forward-to localhost:3000/webhooks/stripe`

## API Endpoints

### Get Available Prices
```
GET /subscriptions/prices
```

### Create Checkout Session
```
POST /subscriptions/checkout
{
  "deviceId": "device-uuid",
  "email": "user@example.com",
  "priceId": "price_1234567890",
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel",
  "displayName": "John Doe"
}
```

### Check Subscription Status
```
GET /subscriptions/status/:deviceId
```

### Register Device
```
POST /subscriptions/device/register
{
  "deviceId": "device-uuid",
  "deviceName": "iPhone 14",
  "platform": "ios",
  "appVersion": "1.0.0"
}
```

### Check Feature Access
```
GET /subscriptions/device/:deviceId/can-create-server
GET /subscriptions/device/:deviceId/can-view-logs
```

## Subscription Logic

### Free Tier Limits
- **Max Servers**: 1
- **Log Viewing**: Disabled
- **All Other Features**: Enabled

### Premium Tier Benefits
- **Max Servers**: Unlimited (999)
- **Log Viewing**: Enabled
- **All Features**: Enabled

## Implementation Notes

1. **Anonymous Users**: The system supports anonymous device tracking without requiring user registration
2. **Device Identification**: Each app instance should generate a unique device ID
3. **Server Tracking**: Server creation/deletion is tracked per device
4. **Subscription Linking**: When a user subscribes, their device gets linked to the user account
5. **Webhook Processing**: All subscription changes are processed via Stripe webhooks

## Error Handling

The system returns appropriate error messages for:
- Server creation limit reached
- Log viewing restriction
- Invalid device ID
- Subscription processing errors

## Testing

1. Start the backend server
2. Use the API endpoints to register a device
3. Try creating servers (should be limited to 1)
4. Try accessing logs (should be denied)
5. Create a subscription via checkout
6. Verify limits are lifted after successful subscription 