import { EnhancedNotificationService } from './enhanced-notification.service';
import { NotificationChannel, NotificationCategory, NotificationPriority } from '@prisma/client';
export declare class NotificationIntegrationService {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: EnhancedNotificationService);
    sendWelcomeEmail(userId: string, userData: {
        name: string;
        email: string;
        loginUrl?: string;
    }): Promise<void>;
    sendEmailVerification(userId: string, userData: {
        name: string;
        email: string;
        verificationUrl: string;
    }): Promise<void>;
    sendPasswordResetEmail(email: string, userData: {
        name: string;
        resetUrl: string;
    }): Promise<void>;
    sendOrderConfirmation(orderId: string, orderData: {
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
    }): Promise<void>;
    sendOrderShipped(orderId: string, shipmentData: {
        userId: string;
        orderNumber: string;
        customerName: string;
        trackingNumber: string;
        carrier: string;
        expectedDelivery: string;
        trackingUrl?: string;
    }): Promise<void>;
    sendOrderDelivered(orderId: string, deliveryData: {
        userId: string;
        orderNumber: string;
        customerName: string;
        deliveredAt: string;
        orderUrl?: string;
    }): Promise<void>;
    sendMerchantApproval(merchantData: {
        userId: string;
        merchantId: string;
        companyName: string;
        contactName: string;
        email: string;
        merchantPortalUrl?: string;
    }): Promise<void>;
    sendProductApproval(productData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        merchantName: string;
    }): Promise<void>;
    sendLowStockAlert(inventoryData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        currentStock: number;
        minThreshold: number;
        warehouse: string;
        merchantName: string;
        inventoryUrl?: string;
    }): Promise<void>;
    sendOutOfStockAlert(inventoryData: {
        merchantUserId: string;
        productId: string;
        productName: string;
        sku: string;
        warehouse: string;
        merchantName: string;
        inventoryUrl?: string;
    }): Promise<void>;
    sendRFQSubmitted(rfqData: {
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
    }): Promise<void>;
    sendPaymentReceived(paymentData: {
        userId: string;
        orderId: string;
        orderNumber: string;
        customerName: string;
        amount: string;
        paymentMethod: string;
    }): Promise<void>;
    sendSystemAlert(alertData: {
        title: string;
        message: string;
        severity: NotificationPriority;
        targetRoles?: string[];
        targetUserIds?: string[];
        data?: any;
    }): Promise<void>;
    sendBulkUserNotification(userIds: string[], notificationData: {
        title: string;
        message: string;
        channel: NotificationChannel;
        category: NotificationCategory;
        priority?: NotificationPriority;
        data?: any;
    }): Promise<void>;
}
