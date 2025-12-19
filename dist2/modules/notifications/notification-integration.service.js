"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationIntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const enhanced_notification_service_1 = require("./enhanced-notification.service");
const client_1 = require("@prisma/client");
let NotificationIntegrationService = NotificationIntegrationService_1 = class NotificationIntegrationService {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(NotificationIntegrationService_1.name);
    }
    async sendWelcomeEmail(userId, userData) {
        try {
            await this.notificationService.createNotification({
                title: 'Welcome to Hardware World!',
                message: `Welcome ${userData.name}! Your account has been created successfully.`,
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.USER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: userId,
                eventType: client_1.EventType.USER_REGISTERED,
                data: userData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email: ${error.message}`);
        }
    }
    async sendEmailVerification(userId, userData) {
        try {
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.VERIFICATION,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: 'Verify your email address',
                message: 'Please verify your email address to complete registration.',
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.USER,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: userId,
                templateId: template.templates[0]?.id,
                data: userData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send verification email: ${error.message}`);
        }
    }
    async sendPasswordResetEmail(email, userData) {
        try {
            await this.notificationService.createNotification({
                title: 'Password Reset Request',
                message: 'You have requested to reset your password.',
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.USER,
                priority: client_1.NotificationPriority.HIGH,
                recipientEmail: email,
                data: userData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email: ${error.message}`);
        }
    }
    async sendOrderConfirmation(orderId, orderData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.ORDER_CREATED,
                title: `Order Created: ${orderData.orderNumber}`,
                description: `New order from ${orderData.customerName}`,
                userId: orderData.userId,
                orderId,
                data: orderData,
            });
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.ORDER_CONFIRMATION,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: `Order Confirmed - #${orderData.orderNumber}`,
                message: `Your order has been confirmed and is being processed.`,
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: orderData.userId,
                templateId: template.templates[0]?.id,
                eventType: client_1.EventType.ORDER_CREATED,
                data: {
                    name: orderData.customerName,
                    ...orderData,
                },
            });
            await this.notificationService.createNotification({
                title: 'Order Confirmed',
                message: `Your order #${orderData.orderNumber} has been confirmed.`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: orderData.userId,
                eventType: client_1.EventType.ORDER_CREATED,
                data: orderData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send order confirmation: ${error.message}`);
        }
    }
    async sendOrderShipped(orderId, shipmentData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.ORDER_SHIPPED,
                title: `Order Shipped: ${shipmentData.orderNumber}`,
                description: `Order shipped via ${shipmentData.carrier}`,
                userId: shipmentData.userId,
                orderId,
                data: shipmentData,
            });
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.ORDER_SHIPPED,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: `Your order #${shipmentData.orderNumber} has shipped!`,
                message: `Tracking: ${shipmentData.trackingNumber}`,
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: shipmentData.userId,
                templateId: template.templates[0]?.id,
                eventType: client_1.EventType.ORDER_SHIPPED,
                data: {
                    name: shipmentData.customerName,
                    ...shipmentData,
                },
            });
            await this.notificationService.createNotification({
                title: 'Order Shipped',
                message: `Your order #${shipmentData.orderNumber} is on its way!`,
                channel: client_1.NotificationChannel.PUSH,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: shipmentData.userId,
                eventType: client_1.EventType.ORDER_SHIPPED,
                data: shipmentData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send order shipped notification: ${error.message}`);
        }
    }
    async sendOrderDelivered(orderId, deliveryData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.ORDER_DELIVERED,
                title: `Order Delivered: ${deliveryData.orderNumber}`,
                description: `Order successfully delivered`,
                userId: deliveryData.userId,
                orderId,
                data: deliveryData,
            });
            await this.notificationService.createNotification({
                title: 'Order Delivered',
                message: `Your order #${deliveryData.orderNumber} has been delivered!`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: deliveryData.userId,
                eventType: client_1.EventType.ORDER_DELIVERED,
                data: deliveryData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send order delivered notification: ${error.message}`);
        }
    }
    async sendMerchantApproval(merchantData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.MERCHANT_APPROVED,
                title: `Merchant Approved: ${merchantData.companyName}`,
                description: `Merchant application approved`,
                userId: merchantData.userId,
                merchantId: merchantData.merchantId,
                data: merchantData,
            });
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.MERCHANT_APPROVED,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: 'Welcome to Hardware World Merchant Network!',
                message: 'Your merchant application has been approved.',
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.MERCHANT,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: merchantData.userId,
                templateId: template.templates[0]?.id,
                eventType: client_1.EventType.MERCHANT_APPROVED,
                data: {
                    name: merchantData.contactName,
                    ...merchantData,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to send merchant approval notification: ${error.message}`);
        }
    }
    async sendProductApproval(productData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.PRODUCT_APPROVED,
                title: `Product Approved: ${productData.productName}`,
                description: `Product ${productData.sku} has been approved`,
                userId: productData.merchantUserId,
                productId: productData.productId,
                data: productData,
            });
            await this.notificationService.createNotification({
                title: 'Product Approved',
                message: `Your product "${productData.productName}" has been approved and is now live.`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.MERCHANT,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: productData.merchantUserId,
                eventType: client_1.EventType.PRODUCT_APPROVED,
                data: productData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send product approval notification: ${error.message}`);
        }
    }
    async sendLowStockAlert(inventoryData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.INVENTORY_LOW,
                title: `Low Stock Alert: ${inventoryData.productName}`,
                description: `Stock level below threshold`,
                userId: inventoryData.merchantUserId,
                productId: inventoryData.productId,
                severity: client_1.NotificationPriority.HIGH,
                data: inventoryData,
            });
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.LOW_STOCK_ALERT,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: `Low Stock Alert - ${inventoryData.productName}`,
                message: `Current stock: ${inventoryData.currentStock}, Threshold: ${inventoryData.minThreshold}`,
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.INVENTORY,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: inventoryData.merchantUserId,
                templateId: template.templates[0]?.id,
                eventType: client_1.EventType.INVENTORY_LOW,
                data: {
                    name: inventoryData.merchantName,
                    ...inventoryData,
                },
            });
            await this.notificationService.createNotification({
                title: 'Low Stock Alert',
                message: `${inventoryData.productName} is running low (${inventoryData.currentStock} left)`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.INVENTORY,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: inventoryData.merchantUserId,
                eventType: client_1.EventType.INVENTORY_LOW,
                data: inventoryData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send low stock alert: ${error.message}`);
        }
    }
    async sendOutOfStockAlert(inventoryData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.INVENTORY_OUT,
                title: `Out of Stock: ${inventoryData.productName}`,
                description: `Product is out of stock`,
                userId: inventoryData.merchantUserId,
                productId: inventoryData.productId,
                severity: client_1.NotificationPriority.URGENT,
                data: inventoryData,
            });
            await Promise.all([
                this.notificationService.createNotification({
                    title: `OUT OF STOCK - ${inventoryData.productName}`,
                    message: `${inventoryData.productName} is out of stock in ${inventoryData.warehouse}`,
                    channel: client_1.NotificationChannel.EMAIL,
                    category: client_1.NotificationCategory.INVENTORY,
                    priority: client_1.NotificationPriority.URGENT,
                    recipientId: inventoryData.merchantUserId,
                    eventType: client_1.EventType.INVENTORY_OUT,
                    data: inventoryData,
                }),
                this.notificationService.createNotification({
                    title: 'Out of Stock',
                    message: `${inventoryData.productName} is out of stock`,
                    channel: client_1.NotificationChannel.IN_APP,
                    category: client_1.NotificationCategory.INVENTORY,
                    priority: client_1.NotificationPriority.URGENT,
                    recipientId: inventoryData.merchantUserId,
                    eventType: client_1.EventType.INVENTORY_OUT,
                    data: inventoryData,
                }),
            ]);
        }
        catch (error) {
            this.logger.error(`Failed to send out of stock alert: ${error.message}`);
        }
    }
    async sendRFQSubmitted(rfqData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.RFQ_CREATED,
                title: `New RFQ: ${rfqData.rfqNumber}`,
                description: `RFQ from ${rfqData.buyerCompany}`,
                userId: rfqData.merchantUserId,
                data: rfqData,
            });
            const template = await this.notificationService.getTemplates({
                type: client_1.EmailTemplateType.RFQ_SUBMITTED,
                limit: 1,
            });
            await this.notificationService.createNotification({
                title: `New RFQ Received - ${rfqData.rfqNumber}`,
                message: `RFQ from ${rfqData.buyerCompany} with ${rfqData.itemCount} items`,
                channel: client_1.NotificationChannel.EMAIL,
                category: client_1.NotificationCategory.SYSTEM,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: rfqData.merchantUserId,
                templateId: template.templates[0]?.id,
                eventType: client_1.EventType.RFQ_CREATED,
                data: rfqData,
            });
            await this.notificationService.createNotification({
                title: 'New RFQ Received',
                message: `${rfqData.buyerCompany} has sent you an RFQ`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.SYSTEM,
                priority: client_1.NotificationPriority.HIGH,
                recipientId: rfqData.merchantUserId,
                eventType: client_1.EventType.RFQ_CREATED,
                data: rfqData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send RFQ notification: ${error.message}`);
        }
    }
    async sendPaymentReceived(paymentData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.PAYMENT_PROCESSED,
                title: `Payment Received: ${paymentData.orderNumber}`,
                description: `Payment of ${paymentData.amount} received`,
                userId: paymentData.userId,
                orderId: paymentData.orderId,
                data: paymentData,
            });
            await this.notificationService.createNotification({
                title: 'Payment Received',
                message: `Payment for order #${paymentData.orderNumber} has been processed`,
                channel: client_1.NotificationChannel.IN_APP,
                category: client_1.NotificationCategory.ORDER,
                priority: client_1.NotificationPriority.NORMAL,
                recipientId: paymentData.userId,
                eventType: client_1.EventType.PAYMENT_PROCESSED,
                data: paymentData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send payment notification: ${error.message}`);
        }
    }
    async sendSystemAlert(alertData) {
        try {
            await this.notificationService.createEvent({
                type: client_1.EventType.SYSTEM_ERROR,
                title: alertData.title,
                description: alertData.message,
                severity: alertData.severity,
                data: alertData.data,
            });
            if (alertData.targetUserIds?.length) {
                await Promise.all(alertData.targetUserIds.map((userId) => this.notificationService.createNotification({
                    title: alertData.title,
                    message: alertData.message,
                    channel: client_1.NotificationChannel.IN_APP,
                    category: client_1.NotificationCategory.SYSTEM,
                    priority: alertData.severity,
                    recipientId: userId,
                    eventType: client_1.EventType.SYSTEM_ERROR,
                    data: alertData.data,
                })));
            }
        }
        catch (error) {
            this.logger.error(`Failed to send system alert: ${error.message}`);
        }
    }
    async sendBulkUserNotification(userIds, notificationData) {
        try {
            await this.notificationService.createBulkNotifications({
                recipientIds: userIds,
                title: notificationData.title,
                message: notificationData.message,
                channel: notificationData.channel,
                category: notificationData.category,
                priority: notificationData.priority || client_1.NotificationPriority.NORMAL,
                data: notificationData.data,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send bulk notification: ${error.message}`);
        }
    }
};
exports.NotificationIntegrationService = NotificationIntegrationService;
exports.NotificationIntegrationService = NotificationIntegrationService = NotificationIntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [enhanced_notification_service_1.EnhancedNotificationService])
], NotificationIntegrationService);
//# sourceMappingURL=notification-integration.service.js.map