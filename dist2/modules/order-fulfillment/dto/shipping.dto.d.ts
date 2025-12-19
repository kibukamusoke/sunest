import { ShipmentStatus } from '@prisma/client';
export declare class CreateShipmentItemDto {
    orderItemId: string;
    quantityShipped: number;
}
export declare class PackageDto {
    weight: number;
    dimensions?: any;
    value?: number;
}
export declare class CreateShipmentDto {
    orderId: string;
    fulfillmentId?: string;
    courierCompanyName: string;
    trackingUrl?: string;
    notes?: string;
    shippingCost: number;
    toAddress: any;
    trackingNumber?: string;
    estimatedDelivery?: string;
    weight?: number;
    dimensions?: any;
    packageCount?: number;
    items: CreateShipmentItemDto[];
}
export declare class UpdateShipmentDto {
    status?: ShipmentStatus;
    trackingNumber?: string;
    carrierId?: string;
    shippingMethod?: string;
    shippingCost?: number;
    estimatedDelivery?: string;
    actualDelivery?: string;
    weight?: number;
    dimensions?: any;
    deliverySignature?: string;
    deliveryPhoto?: string;
}
export declare class MarkShippedDto {
    trackingNumber?: string;
    shippedAt?: string;
    estimatedDelivery?: string;
}
export declare class CreateShippingCarrierDto {
    name: string;
    code: string;
    website?: string;
    trackingUrl?: string;
    apiKey?: string;
    apiEndpoint?: string;
    services?: any[];
}
export declare class UpdateShippingCarrierDto {
    name?: string;
    website?: string;
    trackingUrl?: string;
    isActive?: boolean;
    apiKey?: string;
    apiEndpoint?: string;
    services?: any[];
}
export declare class RateQuoteRequestDto {
    fromAddress: any;
    toAddress: any;
    packages: PackageDto[];
    deliveryDate?: string;
}
export declare class ShipmentFilterDto {
    status?: ShipmentStatus;
    orderId?: string;
    carrierId?: string;
    fromWarehouseId?: string;
    trackingNumber?: string;
    createdAfter?: string;
    createdBefore?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class ShipmentItemResponseDto {
    id: string;
    orderItem: {
        id: string;
        quantity: number;
        product?: {
            id: string;
            name: string;
            sku: string;
        };
        productVariant?: {
            id: string;
            name: string;
            sku: string;
        };
        customProductName?: string;
        customSku?: string;
    };
    quantityShipped: number;
    createdAt: Date;
}
export declare class ShipmentResponseDto {
    id: string;
    shipmentNumber: string;
    trackingNumber?: string;
    courierCompanyName?: string;
    trackingUrl?: string;
    notes?: string;
    order: {
        id: string;
        orderNumber: string;
        user: {
            id: string;
            email: string;
            displayName?: string;
        };
    };
    fulfillment?: {
        id: string;
        fulfillmentNumber: string;
    };
    carrier?: {
        id: string;
        name: string;
        code: string;
        trackingUrl?: string;
    };
    shippingMethod: string;
    shippingCost: number;
    toAddress: any;
    status: ShipmentStatus;
    shippedAt?: Date;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    weight?: number;
    dimensions?: any;
    packageCount: number;
    trackingEvents: any[];
    deliverySignature?: string;
    deliveryPhoto?: string;
    items: ShipmentItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class ShipmentListResponseDto {
    shipments: ShipmentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class ShippingCarrierResponseDto {
    id: string;
    name: string;
    code: string;
    website?: string;
    trackingUrl?: string;
    isActive: boolean;
    services: any[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class RateQuoteResponseDto {
    carrier: {
        id: string;
        name: string;
        code: string;
    };
    service: {
        code: string;
        name: string;
        description: string;
    };
    cost: number;
    currency: string;
    estimatedDelivery: Date;
    transitDays: number;
    details?: any;
}
export declare class TrackingEventDto {
    timestamp: Date;
    location: string;
    status: string;
    description: string;
}
export declare class TrackingResponseDto {
    shipmentId: string;
    trackingNumber: string;
    status: ShipmentStatus;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    events: TrackingEventDto[];
    lastUpdated: Date;
}
export declare class ShippingAnalyticsResponseDto {
    totalShipments: number;
    shipmentsByStatus: Record<ShipmentStatus, number>;
    shipmentsByCarrier: Record<string, number>;
    averageShippingCost: number;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    damageRate: number;
    topCarrier?: {
        name: string;
        deliveryRate: number;
        averageCost: number;
    };
    periodStart: Date;
    periodEnd: Date;
}
