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
    fromWarehouseId: string;
    carrierId?: string;
    shippingMethod: string;
    shippingCost: number;
    toAddress: any;
    trackingNumber?: string;
    estimatedDelivery?: string;
    weight?: number;
    dimensions?: any;
    packageCount?: number;
    items: CreateShipmentItemDto[];
}
