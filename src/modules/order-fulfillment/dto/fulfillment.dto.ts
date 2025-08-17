import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsInt, Min, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FulfillmentStatus, FulfillmentPriority, FulfillmentItemStatus } from '@prisma/client';

// ==================== CREATE FULFILLMENT DTOs ====================

export class CreateFulfillmentItemDto {
    @ApiProperty({
        description: 'Order item ID',
        example: 'uuid-order-item-id'
    })
    @IsUUID()
    orderItemId: string;

    @ApiProperty({
        description: 'Quantity to allocate for fulfillment',
        example: 5,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    quantityAllocated: number;

    @ApiPropertyOptional({
        description: 'Specific inventory item ID to use',
        example: 'uuid-inventory-item-id'
    })
    @IsOptional()
    @IsUUID()
    inventoryItemId?: string;

    @ApiPropertyOptional({
        description: 'Picking notes for this item',
        example: 'Located in aisle A-5, shelf 3'
    })
    @IsOptional()
    @IsString()
    pickingNotes?: string;
}

export class PickedItemDto {
    @ApiProperty({
        description: 'Fulfillment item ID',
        example: 'uuid-fulfillment-item-id'
    })
    @IsUUID()
    fulfillmentItemId: string;

    @ApiProperty({
        description: 'Quantity actually picked',
        example: 5,
        minimum: 0
    })
    @IsInt()
    @Min(0)
    quantityPicked: number;

    @ApiPropertyOptional({
        description: 'Picking notes for this item',
        example: 'Item condition excellent'
    })
    @IsOptional()
    @IsString()
    pickingNotes?: string;
}

export class PackedItemDto {
    @ApiProperty({
        description: 'Fulfillment item ID',
        example: 'uuid-fulfillment-item-id'
    })
    @IsUUID()
    fulfillmentItemId: string;

    @ApiProperty({
        description: 'Quantity actually packed',
        example: 5,
        minimum: 0
    })
    @IsInt()
    @Min(0)
    quantityPacked: number;
}

export class CreateFulfillmentDto {
    @ApiProperty({
        description: 'Order ID to fulfill',
        example: 'uuid-order-id'
    })
    @IsUUID()
    orderId: string;

    @ApiProperty({
        description: 'Warehouse ID where fulfillment will occur',
        example: 'uuid-warehouse-id'
    })
    @IsUUID()
    warehouseId: string;

    @ApiPropertyOptional({
        description: 'Fulfillment priority',
        enum: FulfillmentPriority,
        example: FulfillmentPriority.NORMAL
    })
    @IsOptional()
    @IsEnum(FulfillmentPriority)
    priority?: FulfillmentPriority;

    @ApiPropertyOptional({
        description: 'Scheduled fulfillment date/time',
        example: '2024-08-15T09:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @ApiPropertyOptional({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id'
    })
    @IsOptional()
    @IsUUID()
    assignedTo?: string;

    @ApiPropertyOptional({
        description: 'Picking instructions/notes',
        example: 'Fragile items - handle with care'
    })
    @IsOptional()
    @IsString()
    pickingNotes?: string;

    @ApiPropertyOptional({
        description: 'Packing instructions/notes',
        example: 'Use bubble wrap for electronic components'
    })
    @IsOptional()
    @IsString()
    packingNotes?: string;

    @ApiProperty({
        description: 'Fulfillment items to allocate',
        type: [CreateFulfillmentItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFulfillmentItemDto)
    items: CreateFulfillmentItemDto[];
}

// ==================== UPDATE FULFILLMENT DTOs ====================

export class UpdateFulfillmentDto {
    @ApiPropertyOptional({
        description: 'Fulfillment status',
        enum: FulfillmentStatus,
        example: FulfillmentStatus.PICKING
    })
    @IsOptional()
    @IsEnum(FulfillmentStatus)
    status?: FulfillmentStatus;

    @ApiPropertyOptional({
        description: 'Fulfillment priority',
        enum: FulfillmentPriority,
        example: FulfillmentPriority.HIGH
    })
    @IsOptional()
    @IsEnum(FulfillmentPriority)
    priority?: FulfillmentPriority;

    @ApiPropertyOptional({
        description: 'Scheduled fulfillment date/time',
        example: '2024-08-15T10:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @ApiPropertyOptional({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id'
    })
    @IsOptional()
    @IsUUID()
    assignedTo?: string;

    @ApiPropertyOptional({
        description: 'Picking instructions/notes',
        example: 'Updated: Use cart for heavy items'
    })
    @IsOptional()
    @IsString()
    pickingNotes?: string;

    @ApiPropertyOptional({
        description: 'Packing instructions/notes',
        example: 'Updated: Customer requested eco-friendly packaging'
    })
    @IsOptional()
    @IsString()
    packingNotes?: string;
}

export class AssignFulfillmentDto {
    @ApiProperty({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id'
    })
    @IsUUID()
    assignedTo: string;

    @ApiPropertyOptional({
        description: 'Assignment notes',
        example: 'Assigned to John - experienced with fragile items'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

// ==================== FULFILLMENT OPERATIONS DTOs ====================

export class RecordPickedItemsDto {
    @ApiProperty({
        description: 'Picked items',
        type: [PickedItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickedItemDto)
    pickedItems: PickedItemDto[];

    @ApiPropertyOptional({
        description: 'General picking notes',
        example: 'All items picked successfully'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class RecordPackedItemsDto {
    @ApiProperty({
        description: 'Packed items',
        type: [PackedItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackedItemDto)
    packedItems: PackedItemDto[];

    @ApiPropertyOptional({
        description: 'General packing notes',
        example: 'All items packed securely'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

// ==================== FILTER DTOs ====================

export class FulfillmentFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by fulfillment status',
        enum: FulfillmentStatus,
        example: FulfillmentStatus.PICKING
    })
    @IsOptional()
    @IsEnum(FulfillmentStatus)
    status?: FulfillmentStatus;

    @ApiPropertyOptional({
        description: 'Filter by priority',
        enum: FulfillmentPriority,
        example: FulfillmentPriority.HIGH
    })
    @IsOptional()
    @IsEnum(FulfillmentPriority)
    priority?: FulfillmentPriority;

    @ApiPropertyOptional({
        description: 'Filter by warehouse ID',
        example: 'uuid-warehouse-id'
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;

    @ApiPropertyOptional({
        description: 'Filter by assigned user ID',
        example: 'uuid-user-id'
    })
    @IsOptional()
    @IsUUID()
    assignedTo?: string;

    @ApiPropertyOptional({
        description: 'Filter by order ID',
        example: 'uuid-order-id'
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Filter fulfillments scheduled after date',
        example: '2024-08-01T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    scheduledAfter?: string;

    @ApiPropertyOptional({
        description: 'Filter fulfillments scheduled before date',
        example: '2024-08-31T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    scheduledBefore?: string;

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
        example: 'scheduledAt',
        enum: ['scheduledAt', 'createdAt', 'priority', 'status']
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'asc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE DTOs ====================

export class FulfillmentItemResponseDto {
    @ApiProperty({ description: 'Fulfillment item ID' })
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

    @ApiProperty({ description: 'Quantity allocated' })
    quantityAllocated: number;

    @ApiProperty({ description: 'Quantity picked' })
    quantityPicked: number;

    @ApiProperty({ description: 'Quantity packed' })
    quantityPacked: number;

    @ApiPropertyOptional({ description: 'Inventory item used' })
    inventoryItem?: {
        id: string;
        quantityOnHand: number;
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
    };

    @ApiProperty({ description: 'Item status', enum: FulfillmentItemStatus })
    status: FulfillmentItemStatus;

    @ApiPropertyOptional({ description: 'Picking notes' })
    pickingNotes?: string;

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class FulfillmentResponseDto {
    @ApiProperty({ description: 'Fulfillment ID' })
    id: string;

    @ApiProperty({ description: 'Fulfillment number' })
    fulfillmentNumber: string;

    @ApiProperty({ description: 'Order information' })
    order: {
        id: string;
        orderNumber: string;
        status: string;
        totalAmount: number;
        user: {
            id: string;
            email: string;
            displayName?: string;
        };
    };

    @ApiProperty({ description: 'Warehouse information' })
    warehouse: {
        id: string;
        name: string;
        code: string;
        addressLine1: string;
        city: string;
        state: string;
    };

    @ApiProperty({ description: 'Fulfillment status', enum: FulfillmentStatus })
    status: FulfillmentStatus;

    @ApiProperty({ description: 'Priority', enum: FulfillmentPriority })
    priority: FulfillmentPriority;

    @ApiPropertyOptional({ description: 'Scheduled date/time' })
    scheduledAt?: Date;

    @ApiPropertyOptional({ description: 'Started date/time' })
    startedAt?: Date;

    @ApiPropertyOptional({ description: 'Completed date/time' })
    completedAt?: Date;

    @ApiPropertyOptional({ description: 'Assigned user' })
    assignedUser?: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiPropertyOptional({ description: 'Picking notes' })
    pickingNotes?: string;

    @ApiPropertyOptional({ description: 'Packing notes' })
    packingNotes?: string;

    @ApiProperty({ description: 'Fulfillment items', type: [FulfillmentItemResponseDto] })
    items: FulfillmentItemResponseDto[];

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class FulfillmentListResponseDto {
    @ApiProperty({ description: 'Fulfillments', type: [FulfillmentResponseDto] })
    fulfillments: FulfillmentResponseDto[];

    @ApiProperty({ description: 'Total count of fulfillments matching filter' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Items per page' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

// ==================== PICK LIST DTOs ====================

export class PickListItemDto {
    @ApiProperty({ description: 'Fulfillment item ID' })
    fulfillmentItemId: string;

    @ApiProperty({ description: 'Product information' })
    product: {
        name: string;
        sku: string;
        description?: string;
        images: string[];
    };

    @ApiPropertyOptional({ description: 'Product variant' })
    productVariant?: {
        name: string;
        sku: string;
        attributes: any;
    };

    @ApiProperty({ description: 'Quantity to pick' })
    quantityToPick: number;

    @ApiProperty({ description: 'Inventory location' })
    location: {
        warehouse: string;
        aisle?: string;
        shelf?: string;
        bin?: string;
    };

    @ApiPropertyOptional({ description: 'Picking instructions' })
    pickingNotes?: string;

    @ApiProperty({ description: 'Item priority' })
    priority: FulfillmentPriority;
}

export class PickListResponseDto {
    @ApiProperty({ description: 'Fulfillment ID' })
    fulfillmentId: string;

    @ApiProperty({ description: 'Fulfillment number' })
    fulfillmentNumber: string;

    @ApiProperty({ description: 'Order information' })
    order: {
        orderNumber: string;
        customerName: string;
        rushOrder: boolean;
    };

    @ApiProperty({ description: 'Warehouse information' })
    warehouse: {
        name: string;
        code: string;
    };

    @ApiProperty({ description: 'Items to pick', type: [PickListItemDto] })
    items: PickListItemDto[];

    @ApiProperty({ description: 'Picking priority', enum: FulfillmentPriority })
    priority: FulfillmentPriority;

    @ApiPropertyOptional({ description: 'Special instructions' })
    specialInstructions?: string;

    @ApiProperty({ description: 'Generated at' })
    generatedAt: Date;

    @ApiPropertyOptional({ description: 'Assigned picker' })
    assignedPicker?: {
        id: string;
        name: string;
        email: string;
    };
}

// ==================== FULFILLMENT ANALYTICS DTOs ====================

export class FulfillmentAnalyticsResponseDto {
    @ApiProperty({ description: 'Total fulfillments' })
    totalFulfillments: number;

    @ApiProperty({ description: 'Fulfillments by status' })
    fulfillmentsByStatus: Record<FulfillmentStatus, number>;

    @ApiProperty({ description: 'Fulfillments by priority' })
    fulfillmentsByPriority: Record<FulfillmentPriority, number>;

    @ApiProperty({ description: 'Average pick time (minutes)' })
    averagePickTime: number;

    @ApiProperty({ description: 'Average pack time (minutes)' })
    averagePackTime: number;

    @ApiProperty({ description: 'Average total fulfillment time (hours)' })
    averageFulfillmentTime: number;

    @ApiProperty({ description: 'Pick accuracy rate (percentage)' })
    pickAccuracyRate: number;

    @ApiProperty({ description: 'On-time fulfillment rate (percentage)' })
    onTimeFulfillmentRate: number;

    @ApiProperty({ description: 'Items per hour (productivity)' })
    itemsPerHour: number;

    @ApiProperty({ description: 'Most productive picker' })
    topPicker?: {
        id: string;
        name: string;
        itemsPicked: number;
        accuracy: number;
    };

    @ApiProperty({ description: 'Period start date' })
    periodStart: Date;

    @ApiProperty({ description: 'Period end date' })
    periodEnd: Date;
}
