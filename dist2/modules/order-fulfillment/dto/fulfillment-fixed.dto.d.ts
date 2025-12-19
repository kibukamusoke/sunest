import { FulfillmentStatus, FulfillmentPriority, FulfillmentItemStatus } from '@prisma/client';
export declare class CreateFulfillmentItemDto {
    orderItemId: string;
    quantityAllocated: number;
    inventoryItemId?: string;
    pickingNotes?: string;
}
export declare class PickedItemDto {
    fulfillmentItemId: string;
    quantityPicked: number;
    pickingNotes?: string;
}
export declare class PackedItemDto {
    fulfillmentItemId: string;
    quantityPacked: number;
}
export declare class CreateFulfillmentDto {
    orderId: string;
    warehouseId: string;
    priority?: FulfillmentPriority;
    scheduledAt?: string;
    assignedTo?: string;
    pickingNotes?: string;
    packingNotes?: string;
    items: CreateFulfillmentItemDto[];
}
export declare class UpdateFulfillmentDto {
    status?: FulfillmentStatus;
    priority?: FulfillmentPriority;
    scheduledAt?: string;
    assignedTo?: string;
    pickingNotes?: string;
    packingNotes?: string;
}
export declare class AssignFulfillmentDto {
    assignedTo: string;
    notes?: string;
}
export declare class RecordPickedItemsDto {
    pickedItems: PickedItemDto[];
    notes?: string;
}
export declare class RecordPackedItemsDto {
    packedItems: PackedItemDto[];
    notes?: string;
}
export declare class FulfillmentFilterDto {
    status?: FulfillmentStatus;
    priority?: FulfillmentPriority;
    warehouseId?: string;
    assignedTo?: string;
    orderId?: string;
    scheduledAfter?: string;
    scheduledBefore?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class FulfillmentItemResponseDto {
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
    quantityAllocated: number;
    quantityPicked: number;
    quantityPacked: number;
    inventoryItem?: {
        id: string;
        quantityOnHand: number;
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
    };
    status: FulfillmentItemStatus;
    pickingNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FulfillmentResponseDto {
    id: string;
    fulfillmentNumber: string;
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
    warehouse: {
        id: string;
        name: string;
        code: string;
        addressLine1: string;
        city: string;
        state: string;
    };
    status: FulfillmentStatus;
    priority: FulfillmentPriority;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    assignedUser?: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
    pickingNotes?: string;
    packingNotes?: string;
    items: FulfillmentItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class FulfillmentListResponseDto {
    fulfillments: FulfillmentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class PickListItemDto {
    fulfillmentItemId: string;
    product: {
        name: string;
        sku: string;
        description?: string;
        images: string[];
    };
    productVariant?: {
        name: string;
        sku: string;
        attributes: any;
    };
    quantityToPick: number;
    location: {
        warehouse: string;
        aisle?: string;
        shelf?: string;
        bin?: string;
    };
    pickingNotes?: string;
    priority: FulfillmentPriority;
}
export declare class PickListResponseDto {
    fulfillmentId: string;
    fulfillmentNumber: string;
    order: {
        orderNumber: string;
        customerName: string;
        rushOrder: boolean;
    };
    warehouse: {
        name: string;
        code: string;
    };
    items: PickListItemDto[];
    priority: FulfillmentPriority;
    specialInstructions?: string;
    generatedAt: Date;
    assignedPicker?: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class FulfillmentAnalyticsResponseDto {
    totalFulfillments: number;
    fulfillmentsByStatus: Record<FulfillmentStatus, number>;
    fulfillmentsByPriority: Record<FulfillmentPriority, number>;
    averagePickTime: number;
    averagePackTime: number;
    averageFulfillmentTime: number;
    pickAccuracyRate: number;
    onTimeFulfillmentRate: number;
    itemsPerHour: number;
    topPicker?: {
        id: string;
        name: string;
        itemsPicked: number;
        accuracy: number;
    };
    periodStart: Date;
    periodEnd: Date;
}
