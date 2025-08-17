import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { EmailTemplateType, NotificationCategory } from '@prisma/client';

@Injectable()
export class TemplateSeederService {
    private readonly logger = new Logger(TemplateSeederService.name);

    constructor(private prisma: PrismaService) { }

    async seedDefaultTemplates(): Promise<void> {
        try {
            const templates = [
                // User Authentication Templates
                {
                    name: 'welcome-email',
                    type: EmailTemplateType.WELCOME,
                    category: NotificationCategory.USER,
                    subject: 'Welcome to Hardware World! 🎉',
                    bodyText: `Hi {{name}},

Welcome to Hardware World! We're excited to have you join our B2B procurement platform.

Your account has been successfully created. You can now:
- Browse thousands of hardware products
- Request quotes from verified merchants
- Manage your company's procurement needs
- Track orders and deliveries

If you have any questions, our support team is here to help.

Best regards,
The Hardware World Team`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Welcome to Hardware World! 🎉</h1>
  <p>Hi {{name}},</p>
  <p>Welcome to Hardware World! We're excited to have you join our B2B procurement platform.</p>
  <p>Your account has been successfully created. You can now:</p>
  <ul>
    <li>Browse thousands of hardware products</li>
    <li>Request quotes from verified merchants</li>
    <li>Manage your company's procurement needs</li>
    <li>Track orders and deliveries</li>
  </ul>
  <div style="margin: 30px 0;">
    <a href="{{loginUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
  </div>
  <p>If you have any questions, our support team is here to help.</p>
  <p>Best regards,<br>The Hardware World Team</p>
</div>`,
                    variables: { name: 'User name', loginUrl: 'Login URL' },
                },
                {
                    name: 'email-verification',
                    type: EmailTemplateType.VERIFICATION,
                    category: NotificationCategory.USER,
                    subject: 'Verify your Hardware World email address',
                    bodyText: `Hi {{name}},

Please verify your email address by clicking the link below:

{{verificationUrl}}

This link will expire in 24 hours. If you didn't create an account with Hardware World, please ignore this email.

Best regards,
Hardware World Team`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Verify Your Email Address</h1>
  <p>Hi {{name}},</p>
  <p>Please verify your email address by clicking the button below:</p>
  <div style="margin: 30px 0; text-align: center;">
    <a href="{{verificationUrl}}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
  </div>
  <p>This link will expire in 24 hours. If you didn't create an account with Hardware World, please ignore this email.</p>
  <p>Best regards,<br>Hardware World Team</p>
</div>`,
                    variables: { name: 'User name', verificationUrl: 'Verification URL' },
                },
                // Order Templates
                {
                    name: 'order-confirmation',
                    type: EmailTemplateType.ORDER_CONFIRMATION,
                    category: NotificationCategory.ORDER,
                    subject: 'Order Confirmed - #{{orderNumber}}',
                    bodyText: `Hi {{name}},

Your order has been confirmed! Here are the details:

Order Number: {{orderNumber}}
Order Date: {{orderDate}}
Total Amount: {{totalAmount}}

Items:
{{#items}}
- {{productName}} x {{quantity}} - {{itemTotal}}
{{/items}}

Shipping Address:
{{shippingAddress}}

We'll send you tracking information once your order ships.

View Order: {{orderUrl}}

Thank you for your business!

Hardware World Team`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Order Confirmed! ✅</h1>
  <p>Hi {{name}},</p>
  <p>Your order has been confirmed! Here are the details:</p>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Order #{{orderNumber}}</h3>
    <p><strong>Order Date:</strong> {{orderDate}}</p>
    <p><strong>Total Amount:</strong> {{totalAmount}}</p>
  </div>

  <h3>Items Ordered:</h3>
  <table style="width: 100%; border-collapse: collapse;">
    {{#items}}
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px;">{{productName}}</td>
      <td style="padding: 10px; text-align: center;">{{quantity}}</td>
      <td style="padding: 10px; text-align: right;">{{itemTotal}}</td>
    </tr>
    {{/items}}
  </table>

  <h3>Shipping Address:</h3>
  <p style="background: #f8fafc; padding: 15px; border-radius: 5px;">{{shippingAddress}}</p>

  <div style="margin: 30px 0; text-align: center;">
    <a href="{{orderUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Order</a>
  </div>

  <p>We'll send you tracking information once your order ships.</p>
  <p>Thank you for your business!</p>
  <p>Hardware World Team</p>
</div>`,
                    variables: { name: 'Customer name', orderNumber: 'Order number', orderDate: 'Order date', totalAmount: 'Total amount', items: 'Order items', shippingAddress: 'Shipping address', orderUrl: 'Order view URL' },
                },
                {
                    name: 'order-shipped',
                    type: EmailTemplateType.ORDER_SHIPPED,
                    category: NotificationCategory.ORDER,
                    subject: 'Your order #{{orderNumber}} has shipped! 📦',
                    bodyText: `Hi {{name}},

Great news! Your order #{{orderNumber}} has shipped.

Tracking Information:
Carrier: {{carrier}}
Tracking Number: {{trackingNumber}}
Expected Delivery: {{expectedDelivery}}

Track your package: {{trackingUrl}}

If you have any questions about your shipment, please contact us.

Best regards,
Hardware World Team`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Your Order Has Shipped! 📦</h1>
  <p>Hi {{name}},</p>
  <p>Great news! Your order #{{orderNumber}} has shipped.</p>
  
  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Tracking Information</h3>
    <p><strong>Carrier:</strong> {{carrier}}</p>
    <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
    <p><strong>Expected Delivery:</strong> {{expectedDelivery}}</p>
  </div>

  <div style="margin: 30px 0; text-align: center;">
    <a href="{{trackingUrl}}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Track Package</a>
  </div>

  <p>If you have any questions about your shipment, please contact us.</p>
  <p>Best regards,<br>Hardware World Team</p>
</div>`,
                    variables: { name: 'Customer name', orderNumber: 'Order number', carrier: 'Shipping carrier', trackingNumber: 'Tracking number', expectedDelivery: 'Expected delivery date', trackingUrl: 'Tracking URL' },
                },
                // Merchant Templates
                {
                    name: 'merchant-approved',
                    type: EmailTemplateType.MERCHANT_APPROVED,
                    category: NotificationCategory.MERCHANT,
                    subject: 'Welcome to Hardware World Merchant Network! 🎉',
                    bodyText: `Hi {{name}},

Congratulations! Your merchant application has been approved.

Company: {{companyName}}
Merchant ID: {{merchantId}}

You can now:
- List your products on our platform
- Manage inventory and pricing
- Receive and respond to RFQs
- Process orders and track sales

Get started: {{merchantPortalUrl}}

Our merchant success team will contact you within 24 hours to help you get started.

Welcome to the Hardware World family!

Best regards,
Hardware World Merchant Team`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Welcome to Hardware World! 🎉</h1>
  <p>Hi {{name}},</p>
  <p>Congratulations! Your merchant application has been <strong style="color: #16a34a;">approved</strong>.</p>
  
  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Company:</strong> {{companyName}}</p>
    <p><strong>Merchant ID:</strong> {{merchantId}}</p>
  </div>

  <p>You can now:</p>
  <ul>
    <li>List your products on our platform</li>
    <li>Manage inventory and pricing</li>
    <li>Receive and respond to RFQs</li>
    <li>Process orders and track sales</li>
  </ul>

  <div style="margin: 30px 0; text-align: center;">
    <a href="{{merchantPortalUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Access Merchant Portal</a>
  </div>

  <p>Our merchant success team will contact you within 24 hours to help you get started.</p>
  <p>Welcome to the Hardware World family!</p>
  <p>Best regards,<br>Hardware World Merchant Team</p>
</div>`,
                    variables: { name: 'Merchant name', companyName: 'Company name', merchantId: 'Merchant ID', merchantPortalUrl: 'Merchant portal URL' },
                },
                // Inventory Alerts
                {
                    name: 'low-stock-alert',
                    type: EmailTemplateType.LOW_STOCK_ALERT,
                    category: NotificationCategory.INVENTORY,
                    subject: 'Low Stock Alert - {{productName}}',
                    bodyText: `Hi {{name}},

Low stock alert for one of your products:

Product: {{productName}}
SKU: {{sku}}
Current Stock: {{currentStock}}
Minimum Threshold: {{minThreshold}}
Warehouse: {{warehouse}}

Please restock soon to avoid stockouts.

Manage Inventory: {{inventoryUrl}}

Best regards,
Hardware World System`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #dc2626;">Low Stock Alert ⚠️</h1>
  <p>Hi {{name}},</p>
  <p>Low stock alert for one of your products:</p>
  
  <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
    <h3>{{productName}}</h3>
    <p><strong>SKU:</strong> {{sku}}</p>
    <p><strong>Current Stock:</strong> {{currentStock}}</p>
    <p><strong>Minimum Threshold:</strong> {{minThreshold}}</p>
    <p><strong>Warehouse:</strong> {{warehouse}}</p>
  </div>

  <p>Please restock soon to avoid stockouts.</p>

  <div style="margin: 30px 0; text-align: center;">
    <a href="{{inventoryUrl}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Manage Inventory</a>
  </div>

  <p>Best regards,<br>Hardware World System</p>
</div>`,
                    variables: { name: 'Merchant name', productName: 'Product name', sku: 'Product SKU', currentStock: 'Current stock level', minThreshold: 'Minimum threshold', warehouse: 'Warehouse name', inventoryUrl: 'Inventory management URL' },
                },
                // RFQ Templates
                {
                    name: 'rfq-submitted',
                    type: EmailTemplateType.RFQ_SUBMITTED,
                    category: NotificationCategory.SYSTEM,
                    subject: 'New RFQ Received - {{rfqNumber}}',
                    bodyText: `Hi {{name}},

You have received a new Request for Quote:

RFQ Number: {{rfqNumber}}
From: {{buyerName}} ({{buyerCompany}})
Requested Delivery: {{requestedDelivery}}
Total Items: {{itemCount}}

Items Requested:
{{#items}}
- {{productName}} x {{quantity}}
{{/items}}

Please review and respond to this RFQ within {{responseTime}}.

Review RFQ: {{rfqUrl}}

Best regards,
Hardware World System`,
                    bodyHtml: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">New RFQ Received 📋</h1>
  <p>Hi {{name}},</p>
  <p>You have received a new Request for Quote:</p>
  
  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>RFQ #{{rfqNumber}}</h3>
    <p><strong>From:</strong> {{buyerName}} ({{buyerCompany}})</p>
    <p><strong>Requested Delivery:</strong> {{requestedDelivery}}</p>
    <p><strong>Total Items:</strong> {{itemCount}}</p>
  </div>

  <h3>Items Requested:</h3>
  <ul>
    {{#items}}
    <li>{{productName}} x {{quantity}}</li>
    {{/items}}
  </ul>

  <p>Please review and respond to this RFQ within <strong>{{responseTime}}</strong>.</p>

  <div style="margin: 30px 0; text-align: center;">
    <a href="{{rfqUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Review RFQ</a>
  </div>

  <p>Best regards,<br>Hardware World System</p>
</div>`,
                    variables: { name: 'Merchant name', rfqNumber: 'RFQ number', buyerName: 'Buyer name', buyerCompany: 'Buyer company', requestedDelivery: 'Requested delivery date', itemCount: 'Number of items', items: 'RFQ items', responseTime: 'Response time limit', rfqUrl: 'RFQ review URL' },
                },
            ];

            for (const template of templates) {
                await this.prisma.notificationTemplate.upsert({
                    where: { name: template.name },
                    create: template,
                    update: {
                        subject: template.subject,
                        bodyText: template.bodyText,
                        bodyHtml: template.bodyHtml,
                        variables: template.variables,
                        version: { increment: 1 },
                    },
                });
            }

            this.logger.log(`Seeded ${templates.length} notification templates`);
        } catch (error) {
            this.logger.error(`Failed to seed templates: ${error.message}`, error.stack);
            throw error;
        }
    }
}
