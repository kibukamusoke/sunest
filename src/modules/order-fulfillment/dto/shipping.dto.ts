import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsInt, Min, IsArray, ValidateNested, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentStatus } from '@prisma/client';

// ==================== CREATE SHIPMENT DTOs ====================

export class CreateShipmentItemDto {
    @ApiProperty({
        description: 'Order item ID',
        example: 'uuid-order-item-id'
    })
    @IsUUID()
    orderItemId: string;

    @ApiProperty({
        description: 'Quantity being shipped',
        example: 5,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    quantityShipped: number;
}

export class PackageDto {
    @ApiProperty({
        description: 'Package weight in kg',
        example: 2.5
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    weight: number;

    @ApiPropertyOptional({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 15, unit: 'cm' }
    })
    @IsOptional()
    @IsObject()
    dimensions?: any;

    @ApiPropertyOptional({
        description: 'Package value for insurance',
        example: 500.00
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    value?: number;
}

export class CreateShipmentDto {
    @ApiProperty({
        description: 'Order ID for this shipment',
        example: 'uuid-order-id'
    })
    @IsUUID()
    orderId: string;

    @ApiPropertyOptional({
        description: 'Fulfillment ID if shipment is from fulfillment',
        example: 'uuid-fulfillment-id'
    })
    @IsOptional()
    @IsUUID()
    fulfillmentId?: string;

    @ApiProperty({
        description: 'Warehouse ID where shipment originates',
        example: 'uuid-warehouse-id'
    })
    @IsUUID()
    fromWarehouseId: string;

    @ApiPropertyOptional({
        description: 'Shipping carrier ID',
        example: 'uuid-carrier-id'
    })
    @IsOptional()
    @IsUUID()
    carrierId?: string;

    @ApiProperty({
        description: 'Shipping method/service',
        example: 'Ground'
    })
    @IsString()
    @IsNotEmpty()
    shippingMethod: string;

    @ApiProperty({
        description: 'Shipping cost',
        example: 15.99
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    shippingCost: number;

    @ApiProperty({
        description: 'Shipping address as JSON object',
        example: {
            name: 'Acme Corp Receiving',
            contactName: 'John Doe',
            addressLine1: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
        }
    })
    @IsObject()
    toAddress: any;

    @ApiPropertyOptional({
        description: 'Tracking number',
        example: '1Z12345E1234567890'
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({
        description: 'Estimated delivery date',
        example: '2024-08-18T17:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    estimatedDelivery?: string;

    @ApiPropertyOptional({
        description: 'Package weight in kg',
        example: 2.5
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    weight?: number;

    @ApiPropertyOptional({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 15, unit: 'cm' }
    })
    @IsOptional()
    @IsObject()
    dimensions?: any;

    @ApiPropertyOptional({
        description: 'Number of packages',
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    packageCount?: number;

    @ApiProperty({
        description: 'Items to include in this shipment',
        type: [CreateShipmentItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateShipmentItemDto)
    items: CreateShipmentItemDto[];
}

// ==================== UPDATE SHIPMENT DTOs ====================

export class UpdateShipmentDto {
    @ApiPropertyOptional({
        description: 'Shipment status',
        enum: ShipmentStatus,
        example: ShipmentStatus.SHIPPED
    })
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;

    @ApiPropertyOptional({
        description: 'Tracking number',
        example: '1Z12345E1234567890'
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({
        description: 'Shipping carrier ID',
        example: 'uuid-carrier-id'
    })
    @IsOptional()
    @IsUUID()
    carrierId?: string;

    @ApiPropertyOptional({
        description: 'Shipping method/service',
        example: 'Express'
    })
    @IsOptional()
    @IsString()
    shippingMethod?: string;

    @ApiPropertyOptional({
        description: 'Shipping cost',
        example: 25.99
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    shippingCost?: number;

    @ApiPropertyOptional({
        description: 'Estimated delivery date',
        example: '2024-08-17T17:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    estimatedDelivery?: string;

    @ApiPropertyOptional({
        description: 'Actual delivery date',
        example: '2024-08-17T15:30:00Z'
    })
    @IsOptional()
    @IsDateString()
    actualDelivery?: string;

    @ApiPropertyOptional({
        description: 'Package weight in kg',
        example: 2.8
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    weight?: number;

    @ApiPropertyOptional({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 18, unit: 'cm' }
    })
    @IsOptional()
    @IsObject()
    dimensions?: any;

    @ApiPropertyOptional({
        description: 'Delivery signature',
        example: 'J. Doe'
    })
    @IsOptional()
    @IsString()
    deliverySignature?: string;

    @ApiPropertyOptional({
        description: 'Delivery photo URL',
        example: 'https://storage.example.com/delivery-photos/123.jpg'
    })
    @IsOptional()
    @IsString()
    deliveryPhoto?: string;
}

export class MarkShippedDto {
    @ApiPropertyOptional({
        description: 'Tracking number',
        example: '1Z12345E1234567890'
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({
        description: 'Shipped date/time (defaults to now)',
        example: '2024-08-15T14:30:00Z'
    })
    @IsOptional()
    @IsDateString()
    shippedAt?: string;

    @ApiPropertyOptional({
        description: 'Estimated delivery date',
        example: '2024-08-18T17:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    estimatedDelivery?: string;
}

// ==================== SHIPPING CARRIER DTOs ====================

export class CreateShippingCarrierDto {
    @ApiProperty({
        description: 'Carrier name',
        example: 'UPS'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Carrier code',
        example: 'ups'
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiPropertyOptional({
        description: 'Carrier website',
        example: 'https://www.ups.com'
    })
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional({
        description: 'Tracking URL template',
        example: 'https://www.ups.com/track?loc=en_US&tracknum={trackingNumber}'
    })
    @IsOptional()
    @IsString()
    trackingUrl?: string;

    @ApiPropertyOptional({
        description: 'API key (will be encrypted)',
        example: 'api-key-123'
    })
    @IsOptional()
    @IsString()
    apiKey?: string;

    @ApiPropertyOptional({
        description: 'API endpoint',
        example: 'https://api.ups.com/v1'
    })
    @IsOptional()
    @IsString()
    apiEndpoint?: string;

    @ApiPropertyOptional({
        description: 'Supported services configuration',
        example: [
            { code: 'ground', name: 'Ground', description: 'Standard ground delivery' },
            { code: 'express', name: 'Express', description: 'Next day delivery' }
        ]
    })
    @IsOptional()
    @IsArray()
    services?: any[];
}

export class UpdateShippingCarrierDto {
    @ApiPropertyOptional({
        description: 'Carrier name',
        example: 'UPS Express'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Carrier website',
        example: 'https://www.ups.com/express'
    })
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional({
        description: 'Tracking URL template',
        example: 'https://www.ups.com/track?tracknum={trackingNumber}'
    })
    @IsOptional()
    @IsString()
    trackingUrl?: string;

    @ApiPropertyOptional({
        description: 'Active status',
        example: true
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'API key (will be encrypted)',
        example: 'new-api-key-456'
    })
    @IsOptional()
    @IsString()
    apiKey?: string;

    @ApiPropertyOptional({
        description: 'API endpoint',
        example: 'https://api.ups.com/v2'
    })
    @IsOptional()
    @IsString()
    apiEndpoint?: string;

    @ApiPropertyOptional({
        description: 'Supported services configuration',
        example: [
            { code: 'ground', name: 'Ground', description: 'Standard ground delivery', cost: 15.99 },
            { code: 'express', name: 'Express', description: 'Next day delivery', cost: 35.99 }
        ]
    })
    @IsOptional()
    @IsArray()
    services?: any[];
}

// ==================== RATE QUOTE DTOs ====================

export class RateQuoteRequestDto {
    @ApiProperty({
        description: 'Origin address',
        example: {
            addressLine1: '123 Warehouse St',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'US'
        }
    })
    @IsObject()
    fromAddress: any;

    @ApiProperty({
        description: 'Destination address',
        example: {
            addressLine1: '456 Business Ave',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
        }
    })
    @IsObject()
    toAddress: any;

    @ApiProperty({
        description: 'Package details',
        type: [PackageDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageDto)
    packages: PackageDto[];

    @ApiPropertyOptional({
        description: 'Delivery date preference',
        example: '2024-08-18T17:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    deliveryDate?: string;
}


// ==================== FILTER DTOs ====================

export class ShipmentFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by shipment status',
        enum: ShipmentStatus,
        example: ShipmentStatus.IN_TRANSIT
    })
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;

    @ApiPropertyOptional({
        description: 'Filter by order ID',
        example: 'uuid-order-id'
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Filter by carrier ID',
        example: 'uuid-carrier-id'
    })
    @IsOptional()
    @IsUUID()
    carrierId?: string;

    @ApiPropertyOptional({
        description: 'Filter by warehouse ID',
        example: 'uuid-warehouse-id'
    })
    @IsOptional()
    @IsUUID()
    fromWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Filter by tracking number',
        example: '1Z12345E1234567890'
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({
        description: 'Filter shipments created after date',
        example: '2024-08-01T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    createdAfter?: string;

    @ApiPropertyOptional({
        description: 'Filter shipments created before date',
        example: '2024-08-31T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    createdBefore?: string;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number;

    @ApiPropertyOptional({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ['createdAt', 'shippedAt', 'estimatedDelivery', 'status']
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE DTOs ====================

export class ShipmentItemResponseDto {
    @ApiProperty({ description: 'Shipment item ID' })
    id: string;

    @ApiProperty({ description: 'Order item information' })
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

    @ApiProperty({ description: 'Quantity shipped' })
    quantityShipped: number;

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;
}

export class ShipmentResponseDto {
    @ApiProperty({ description: 'Shipment ID' })
    id: string;

    @ApiProperty({ description: 'Shipment number' })
    shipmentNumber: string;

    @ApiPropertyOptional({ description: 'Tracking number' })
    trackingNumber?: string;

    @ApiProperty({ description: 'Order information' })
    order: {
        id: string;
        orderNumber: string;
        user: {
            id: string;
            email: string;
            displayName?: string;
        };
    };

    @ApiPropertyOptional({ description: 'Fulfillment information' })
    fulfillment?: {
        id: string;
        fulfillmentNumber: string;
    };

    @ApiPropertyOptional({ description: 'Shipping carrier' })
    carrier?: {
        id: string;
        name: string;
        code: string;
        trackingUrl?: string;
    };

    @ApiProperty({ description: 'Shipping method' })
    shippingMethod: string;

    @ApiProperty({ description: 'Shipping cost' })
    shippingCost: number;

    @ApiProperty({ description: 'Origin warehouse' })
    fromWarehouse: {
        id: string;
        name: string;
        code: string;
        addressLine1: string;
        city: string;
        state: string;
    };

    @ApiProperty({ description: 'Destination address' })
    toAddress: any;

    @ApiProperty({ description: 'Shipment status', enum: ShipmentStatus })
    status: ShipmentStatus;

    @ApiPropertyOptional({ description: 'Shipped date' })
    shippedAt?: Date;

    @ApiPropertyOptional({ description: 'Estimated delivery date' })
    estimatedDelivery?: Date;

    @ApiPropertyOptional({ description: 'Actual delivery date' })
    actualDelivery?: Date;

    @ApiPropertyOptional({ description: 'Package weight' })
    weight?: number;

    @ApiPropertyOptional({ description: 'Package dimensions' })
    dimensions?: any;

    @ApiProperty({ description: 'Package count' })
    packageCount: number;

    @ApiProperty({ description: 'Tracking events' })
    trackingEvents: any[];

    @ApiPropertyOptional({ description: 'Delivery signature' })
    deliverySignature?: string;

    @ApiPropertyOptional({ description: 'Delivery photo URL' })
    deliveryPhoto?: string;

    @ApiProperty({ description: 'Shipment items', type: [ShipmentItemResponseDto] })
    items: ShipmentItemResponseDto[];

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class ShipmentListResponseDto {
    @ApiProperty({ description: 'Shipments', type: [ShipmentResponseDto] })
    shipments: ShipmentResponseDto[];

    @ApiProperty({ description: 'Total count of shipments matching filter' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Items per page' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class ShippingCarrierResponseDto {
    @ApiProperty({ description: 'Carrier ID' })
    id: string;

    @ApiProperty({ description: 'Carrier name' })
    name: string;

    @ApiProperty({ description: 'Carrier code' })
    code: string;

    @ApiPropertyOptional({ description: 'Carrier website' })
    website?: string;

    @ApiPropertyOptional({ description: 'Tracking URL template' })
    trackingUrl?: string;

    @ApiProperty({ description: 'Active status' })
    isActive: boolean;

    @ApiProperty({ description: 'Supported services' })
    services: any[];

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class RateQuoteResponseDto {
    @ApiProperty({ description: 'Carrier information' })
    carrier: {
        id: string;
        name: string;
        code: string;
    };

    @ApiProperty({ description: 'Service information' })
    service: {
        code: string;
        name: string;
        description: string;
    };

    @ApiProperty({ description: 'Shipping cost' })
    cost: number;

    @ApiProperty({ description: 'Currency' })
    currency: string;

    @ApiProperty({ description: 'Estimated delivery date' })
    estimatedDelivery: Date;

    @ApiProperty({ description: 'Transit time in days' })
    transitDays: number;

    @ApiPropertyOptional({ description: 'Additional details' })
    details?: any;
}

// ==================== TRACKING DTOs ====================

export class TrackingEventDto {
    @ApiProperty({ description: 'Event timestamp' })
    timestamp: Date;

    @ApiProperty({ description: 'Event location' })
    location: string;

    @ApiProperty({ description: 'Event status/description' })
    status: string;

    @ApiProperty({ description: 'Event details' })
    description: string;
}

export class TrackingResponseDto {
    @ApiProperty({ description: 'Shipment ID' })
    shipmentId: string;

    @ApiProperty({ description: 'Tracking number' })
    trackingNumber: string;

    @ApiProperty({ description: 'Current status', enum: ShipmentStatus })
    status: ShipmentStatus;

    @ApiProperty({ description: 'Estimated delivery date' })
    estimatedDelivery?: Date;

    @ApiProperty({ description: 'Actual delivery date' })
    actualDelivery?: Date;

    @ApiProperty({ description: 'Tracking events', type: [TrackingEventDto] })
    events: TrackingEventDto[];

    @ApiProperty({ description: 'Last updated' })
    lastUpdated: Date;
}

// ==================== SHIPPING ANALYTICS DTOs ====================

export class ShippingAnalyticsResponseDto {
    @ApiProperty({ description: 'Total shipments' })
    totalShipments: number;

    @ApiProperty({ description: 'Shipments by status' })
    shipmentsByStatus: Record<ShipmentStatus, number>;

    @ApiProperty({ description: 'Shipments by carrier' })
    shipmentsByCarrier: Record<string, number>;

    @ApiProperty({ description: 'Average shipping cost' })
    averageShippingCost: number;

    @ApiProperty({ description: 'Average delivery time (days)' })
    averageDeliveryTime: number;

    @ApiProperty({ description: 'On-time delivery rate (percentage)' })
    onTimeDeliveryRate: number;

    @ApiProperty({ description: 'Damaged packages rate (percentage)' })
    damageRate: number;

    @ApiProperty({ description: 'Top performing carrier' })
    topCarrier?: {
        name: string;
        deliveryRate: number;
        averageCost: number;
    };

    @ApiProperty({ description: 'Period start date' })
    periodStart: Date;

    @ApiProperty({ description: 'Period end date' })
    periodEnd: Date;
}
