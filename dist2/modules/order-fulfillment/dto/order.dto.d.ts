import { OrderStatus, FulfillmentStatus, PaymentStatus, PaymentMethod, OrderEventType } from '@prisma/client';
import { ShipmentResponseDto } from './shipping.dto';
export declare class CreateOrderItemDto {
    productId?: string;
    productVariantId?: string;
    customProductName?: string;
    customSku?: string;
    customDescription?: string;
    quantity: number;
    unitPrice: number;
    requestedDeliveryDate?: string;
    itemNotes?: string;
}
export declare class CreateOrderDto {
    checkoutId?: string;
    quoteId?: string;
    purchaseOrderNumber?: string;
    companyId?: string;
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: PaymentMethod;
    requestedDeliveryDate?: string;
    customerNotes?: string;
    specialInstructions?: string;
    rushOrder?: boolean;
    creditTerms?: string;
    items: CreateOrderItemDto[];
}
export declare class UpdateOrderDto {
    purchaseOrderNumber?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    requestedDeliveryDate?: string;
    customerNotes?: string;
    internalNotes?: string;
    specialInstructions?: string;
    paymentReference?: string;
    taxAmount?: number;
    shippingAmount?: number;
    discountAmount?: number;
}
export declare class UploadPaymentProofDto {
    fileId: string;
    paymentStatus?: PaymentStatus;
    notes?: string;
}
export declare class UpdateOrderItemDto {
    quantity?: number;
    unitPrice?: number;
    requestedDeliveryDate?: string;
    itemNotes?: string;
}
export declare class OrderFilterDto {
    status?: OrderStatus;
    fulfillmentStatus?: FulfillmentStatus;
    paymentStatus?: PaymentStatus;
    companyId?: string;
    userId?: string;
    orderNumber?: string;
    purchaseOrderNumber?: string;
    createdAfter?: string;
    createdBefore?: string;
    rushOrder?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class OrderItemResponseDto {
    id: string;
    product?: {
        id: string;
        name: string;
        sku: string;
        images: string[];
    };
    productVariant?: {
        id: string;
        name: string;
        sku: string;
        attributes: any;
    };
    customProductName?: string;
    customSku?: string;
    customDescription?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    quantityFulfilled: number;
    quantityShipped: number;
    quantityDelivered: number;
    quantityCancelled: number;
    requestedDeliveryDate?: Date;
    estimatedDeliveryDate?: Date;
    itemNotes?: string;
    productSnapshot?: any;
    variantSnapshot?: any;
    snapshotCreatedAt?: Date;
    productName: string;
    productSku: string;
    productBrand?: string;
    productCategory?: string;
    productImages?: string[];
    variantName?: string;
    variantSku?: string;
    variantAttributes?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaymentProofResponseDto {
    fileId: string;
    url?: string;
    filename?: string;
    uploadedAt?: Date;
    uploadedBy?: {
        id: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
}
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    purchaseOrderNumber?: string;
    user: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
    company?: {
        id: string;
        name: string;
        displayName?: string;
    };
    shippingAddress: {
        id: string;
        name: string;
        contactName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    billingAddress: {
        id: string;
        name: string;
        contactName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    fulfillmentStatus: FulfillmentStatus;
    paymentStatus: PaymentStatus;
    requestedDeliveryDate?: Date;
    estimatedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    customerNotes?: string;
    internalNotes?: string;
    specialInstructions?: string;
    rushOrder: boolean;
    paymentMethod: PaymentMethod;
    paymentReference?: string;
    paymentProofs?: PaymentProofResponseDto[];
    creditTerms?: string;
    items: OrderItemResponseDto[];
    shipments?: ShipmentResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
}
export declare class OrderListResponseDto {
    orders: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class CreateOrderEventDto {
    eventType: OrderEventType;
    description: string;
    metadata?: any;
}
export declare class OrderEventResponseDto {
    id: string;
    eventType: OrderEventType;
    description: string;
    user?: {
        id: string;
        email: string;
        displayName?: string;
    };
    metadata?: any;
    createdAt: Date;
}
export declare class OrderTimelineResponseDto {
    events: OrderEventResponseDto[];
    orderSummary: {
        id: string;
        orderNumber: string;
        status: OrderStatus;
        fulfillmentStatus: FulfillmentStatus;
        paymentStatus: PaymentStatus;
        totalAmount: number;
        createdAt: Date;
    };
}
export declare class OrderAnalyticsResponseDto {
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    ordersByFulfillmentStatus: Record<FulfillmentStatus, number>;
    ordersByPaymentStatus: Record<PaymentStatus, number>;
    rushOrders: number;
    onTimeDeliveryRate: number;
    averageFulfillmentTime: number;
    periodStart: Date;
    periodEnd: Date;
}
