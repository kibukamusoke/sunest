import { Injectable, Logger } from '@nestjs/common';
import { EnhancedNotificationService } from './enhanced-notification.service';
import {
    NotificationChannel,
    NotificationCategory,
    NotificationPriority,
    EventType,
    EmailTemplateType
} from '@prisma/client';

@Injectable()
export class NotificationIntegrationService {
    private readonly logger = new Logger(NotificationIntegrationService.name);

    constructor(
        private readonly notificationService: EnhancedNotificationService,
    ) { }

    // =============== USER & AUTHENTICATION NOTIFICATIONS ===============

    async sendWelcomeEmail(userId: string, userData: {
        name: string;
        email: string;
        loginUrl?: string;
    }): Promise<void> {
        try {
            await this.notificationService.createNotification({
                title: 'Welcome to Hardware World!',
                message: `Welcome ${userData.name}! Your account has been created successfully.`,
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.USER,
                priority: NotificationPriority.NORMAL,
                recipientId: userId,
                eventType: EventType.USER_REGISTERED,
                data: userData,
            });
        } catch (error) {
            this.logger.error(`Failed to send welcome email: ${error.message}`);
        }
    }

    async sendEmailVerification(userId: string, userData: {
        name: string;
        email: string;
        verificationUrl: string;
    }): Promise<void> {
        try {
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.VERIFICATION,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: 'Verify your email address',
                message: 'Please verify your email address to complete registration.',
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.USER,
                priority: NotificationPriority.HIGH,
                recipientId: userId,
                templateId: template.templates[0]?.id,
                data: userData,
            });
        } catch (error) {
            this.logger.error(`Failed to send verification email: ${error.message}`);
        }
    }

    async sendPasswordResetEmail(email: string, userData: {
        name: string;
        resetUrl: string;
    }): Promise<void> {
        try {
            await this.notificationService.createNotification({
                title: 'Password Reset Request',
                message: 'You have requested to reset your password.',
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.USER,
                priority: NotificationPriority.HIGH,
                recipientEmail: email,
                data: userData,
            });
        } catch (error) {
            this.logger.error(`Failed to send password reset email: ${error.message}`);
        }
    }

    // =============== ORDER NOTIFICATIONS ===============

    async sendOrderConfirmation(orderId: string, orderData: {
        userId: string;
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        totalAmount: string;
        orderDate: string;
        items: Array<{
            productName: string;
            quantity: number;
            itemTotal: string;
        }>;
        shippingAddress: string;
        orderUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.ORDER_CREATED,
                title: `Order Created: ${orderData.orderNumber}`,
                description: `New order from ${orderData.customerName}`,
                userId: orderData.userId,
                orderId,
                data: orderData,
            });

            // Send email notification
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.ORDER_CONFIRMATION,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: `Order Confirmed - #${orderData.orderNumber}`,
                message: `Your order has been confirmed and is being processed.`,
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: orderData.userId,
                templateId: template.templates[0]?.id,
                eventType: EventType.ORDER_CREATED,
                data: {
                    name: orderData.customerName,
                    ...orderData,
                },
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'Order Confirmed',
                message: `Your order #${orderData.orderNumber} has been confirmed.`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: orderData.userId,
                eventType: EventType.ORDER_CREATED,
                data: orderData,
            });
        } catch (error) {
            this.logger.error(`Failed to send order confirmation: ${error.message}`);
        }
    }

    async sendOrderShipped(orderId: string, shipmentData: {
        userId: string;
        orderNumber: string;
        customerName: string;
        trackingNumber: string;
        carrier: string;
        expectedDelivery: string;
        trackingUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.ORDER_SHIPPED,
                title: `Order Shipped: ${shipmentData.orderNumber}`,
                description: `Order shipped via ${shipmentData.carrier}`,
                userId: shipmentData.userId,
                orderId,
                data: shipmentData,
            });

            // Send email notification
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.ORDER_SHIPPED,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: `Your order #${shipmentData.orderNumber} has shipped!`,
                message: `Tracking: ${shipmentData.trackingNumber}`,
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: shipmentData.userId,
                templateId: template.templates[0]?.id,
                eventType: EventType.ORDER_SHIPPED,
                data: {
                    name: shipmentData.customerName,
                    ...shipmentData,
                },
            });

            // Send push notification
            await this.notificationService.createNotification({
                title: 'Order Shipped',
                message: `Your order #${shipmentData.orderNumber} is on its way!`,
                channel: NotificationChannel.PUSH,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: shipmentData.userId,
                eventType: EventType.ORDER_SHIPPED,
                data: shipmentData,
            });
        } catch (error) {
            this.logger.error(`Failed to send order shipped notification: ${error.message}`);
        }
    }

    async sendOrderDelivered(orderId: string, deliveryData: {
        userId: string;
        orderNumber: string;
        customerName: string;
        deliveredAt: string;
        orderUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.ORDER_DELIVERED,
                title: `Order Delivered: ${deliveryData.orderNumber}`,
                description: `Order successfully delivered`,
                userId: deliveryData.userId,
                orderId,
                data: deliveryData,
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'Order Delivered',
                message: `Your order #${deliveryData.orderNumber} has been delivered!`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: deliveryData.userId,
                eventType: EventType.ORDER_DELIVERED,
                data: deliveryData,
            });
        } catch (error) {
            this.logger.error(`Failed to send order delivered notification: ${error.message}`);
        }
    }

    // =============== MERCHANT NOTIFICATIONS ===============

    async sendMerchantApproval(merchantData: {
        userId: string;
        merchantId: string;
        companyName: string;
        contactName: string;
        email: string;
        merchantPortalUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.MERCHANT_APPROVED,
                title: `Merchant Approved: ${merchantData.companyName}`,
                description: `Merchant application approved`,
                userId: merchantData.userId,
                merchantId: merchantData.merchantId,
                data: merchantData,
            });

            // Send email notification
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.MERCHANT_APPROVED,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: 'Welcome to Hardware World Merchant Network!',
                message: 'Your merchant application has been approved.',
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.MERCHANT,
                priority: NotificationPriority.HIGH,
                recipientId: merchantData.userId,
                templateId: template.templates[0]?.id,
                eventType: EventType.MERCHANT_APPROVED,
                data: {
                    name: merchantData.contactName,
                    ...merchantData,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to send merchant approval notification: ${error.message}`);
        }
    }

    async sendProductApproval(productData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        merchantName: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.PRODUCT_APPROVED,
                title: `Product Approved: ${productData.productName}`,
                description: `Product ${productData.sku} has been approved`,
                userId: productData.merchantUserId,
                productId: productData.productId,
                data: productData,
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'Product Approved',
                message: `Your product "${productData.productName}" has been approved and is now live.`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.MERCHANT,
                priority: NotificationPriority.NORMAL,
                recipientId: productData.merchantUserId,
                eventType: EventType.PRODUCT_APPROVED,
                data: productData,
            });
        } catch (error) {
            this.logger.error(`Failed to send product approval notification: ${error.message}`);
        }
    }

    // =============== INVENTORY NOTIFICATIONS ===============

    async sendLowStockAlert(inventoryData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        currentStock: number;
        minThreshold: number;
        warehouse: string;
        merchantName: string;
        inventoryUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.INVENTORY_LOW,
                title: `Low Stock Alert: ${inventoryData.productName}`,
                description: `Stock level below threshold`,
                userId: inventoryData.merchantUserId,
                productId: inventoryData.productId,
                severity: NotificationPriority.HIGH,
                data: inventoryData,
            });

            // Send email notification
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.LOW_STOCK_ALERT,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: `Low Stock Alert - ${inventoryData.productName}`,
                message: `Current stock: ${inventoryData.currentStock}, Threshold: ${inventoryData.minThreshold}`,
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.INVENTORY,
                priority: NotificationPriority.HIGH,
                recipientId: inventoryData.merchantUserId,
                templateId: template.templates[0]?.id,
                eventType: EventType.INVENTORY_LOW,
                data: {
                    name: inventoryData.merchantName,
                    ...inventoryData,
                },
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'Low Stock Alert',
                message: `${inventoryData.productName} is running low (${inventoryData.currentStock} left)`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.INVENTORY,
                priority: NotificationPriority.HIGH,
                recipientId: inventoryData.merchantUserId,
                eventType: EventType.INVENTORY_LOW,
                data: inventoryData,
            });
        } catch (error) {
            this.logger.error(`Failed to send low stock alert: ${error.message}`);
        }
    }

    async sendOutOfStockAlert(inventoryData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        warehouse: string;
        merchantName: string;
        inventoryUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.INVENTORY_OUT,
                title: `Out of Stock: ${inventoryData.productName}`,
                description: `Product is out of stock`,
                userId: inventoryData.merchantUserId,
                productId: inventoryData.productId,
                severity: NotificationPriority.URGENT,
                data: inventoryData,
            });

            // Send email and in-app notifications
            await Promise.all([
                this.notificationService.createNotification({
                    title: `OUT OF STOCK - ${inventoryData.productName}`,
                    message: `${inventoryData.productName} is out of stock in ${inventoryData.warehouse}`,
                    channel: NotificationChannel.EMAIL,
                    category: NotificationCategory.INVENTORY,
                    priority: NotificationPriority.URGENT,
                    recipientId: inventoryData.merchantUserId,
                    eventType: EventType.INVENTORY_OUT,
                    data: inventoryData,
                }),
                this.notificationService.createNotification({
                    title: 'Out of Stock',
                    message: `${inventoryData.productName} is out of stock`,
                    channel: NotificationChannel.IN_APP,
                    category: NotificationCategory.INVENTORY,
                    priority: NotificationPriority.URGENT,
                    recipientId: inventoryData.merchantUserId,
                    eventType: EventType.INVENTORY_OUT,
                    data: inventoryData,
                }),
            ]);
        } catch (error) {
            this.logger.error(`Failed to send out of stock alert: ${error.message}`);
        }
    }

    // =============== RFQ NOTIFICATIONS ===============

    async sendRFQSubmitted(rfqData: {
        merchantUserId: string;
        buyerId: string;
        rfqId: string;
        rfqNumber: string;
        buyerName: string;
        buyerCompany: string;
        requestedDelivery: string;
        itemCount: number;
        items: Array<{
            productName: string;
            quantity: number;
        }>;
        responseTime: string;
        rfqUrl?: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.RFQ_CREATED,
                title: `New RFQ: ${rfqData.rfqNumber}`,
                description: `RFQ from ${rfqData.buyerCompany}`,
                userId: rfqData.merchantUserId,
                data: rfqData,
            });

            // Send email notification to merchant
            const template = await this.notificationService.getTemplates({
                type: EmailTemplateType.RFQ_SUBMITTED,
                limit: 1,
            });

            await this.notificationService.createNotification({
                title: `New RFQ Received - ${rfqData.rfqNumber}`,
                message: `RFQ from ${rfqData.buyerCompany} with ${rfqData.itemCount} items`,
                channel: NotificationChannel.EMAIL,
                category: NotificationCategory.SYSTEM,
                priority: NotificationPriority.HIGH,
                recipientId: rfqData.merchantUserId,
                templateId: template.templates[0]?.id,
                eventType: EventType.RFQ_CREATED,
                data: rfqData,
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'New RFQ Received',
                message: `${rfqData.buyerCompany} has sent you an RFQ`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.SYSTEM,
                priority: NotificationPriority.HIGH,
                recipientId: rfqData.merchantUserId,
                eventType: EventType.RFQ_CREATED,
                data: rfqData,
            });
        } catch (error) {
            this.logger.error(`Failed to send RFQ notification: ${error.message}`);
        }
    }

    // =============== PAYMENT NOTIFICATIONS ===============

    async sendPaymentReceived(paymentData: {
        userId: string;
        orderId: string;
        orderNumber: string;
        customerName: string;
        amount: string;
        paymentMethod: string;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.PAYMENT_PROCESSED,
                title: `Payment Received: ${paymentData.orderNumber}`,
                description: `Payment of ${paymentData.amount} received`,
                userId: paymentData.userId,
                orderId: paymentData.orderId,
                data: paymentData,
            });

            // Send in-app notification
            await this.notificationService.createNotification({
                title: 'Payment Received',
                message: `Payment for order #${paymentData.orderNumber} has been processed`,
                channel: NotificationChannel.IN_APP,
                category: NotificationCategory.ORDER,
                priority: NotificationPriority.NORMAL,
                recipientId: paymentData.userId,
                eventType: EventType.PAYMENT_PROCESSED,
                data: paymentData,
            });
        } catch (error) {
            this.logger.error(`Failed to send payment notification: ${error.message}`);
        }
    }

    // =============== SYSTEM NOTIFICATIONS ===============

    async sendSystemAlert(alertData: {
        title: string;
        message: string;
        severity: NotificationPriority;
        targetRoles?: string[];
        targetUserIds?: string[];
        data?: any;
    }): Promise<void> {
        try {
            // Create event
            await this.notificationService.createEvent({
                type: EventType.SYSTEM_ERROR,
                title: alertData.title,
                description: alertData.message,
                severity: alertData.severity,
                data: alertData.data,
            });

            // Send to specific users if provided
            if (alertData.targetUserIds?.length) {
                await Promise.all(
                    alertData.targetUserIds.map(userId =>
                        this.notificationService.createNotification({
                            title: alertData.title,
                            message: alertData.message,
                            channel: NotificationChannel.IN_APP,
                            category: NotificationCategory.SYSTEM,
                            priority: alertData.severity,
                            recipientId: userId,
                            eventType: EventType.SYSTEM_ERROR,
                            data: alertData.data,
                        })
                    )
                );
            }
        } catch (error) {
            this.logger.error(`Failed to send system alert: ${error.message}`);
        }
    }

    // =============== BULK NOTIFICATION HELPERS ===============

    async sendBulkUserNotification(userIds: string[], notificationData: {
        title: string;
        message: string;
        channel: NotificationChannel;
        category: NotificationCategory;
        priority?: NotificationPriority;
        data?: any;
    }): Promise<void> {
        try {
            await this.notificationService.createBulkNotifications({
                recipientIds: userIds,
                title: notificationData.title,
                message: notificationData.message,
                channel: notificationData.channel,
                category: notificationData.category,
                priority: notificationData.priority || NotificationPriority.NORMAL,
                data: notificationData.data,
            });
        } catch (error) {
            this.logger.error(`Failed to send bulk notification: ${error.message}`);
        }
    }
}
