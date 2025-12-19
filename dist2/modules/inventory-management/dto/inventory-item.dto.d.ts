export declare class CreateInventoryItemDto {
    productId: string;
    productVariantId?: string;
    quantityOnHand?: number;
    minimumStock?: number;
    maximumStock?: number;
    reorderQuantity?: number;
    leadTimeDays?: number;
    averageCost?: number;
    lastPurchaseCost?: number;
    lastPurchaseDate?: string;
    batchNumber?: string;
    expirationDate?: string;
    manufacturingDate?: string;
}
export declare class UpdateInventoryItemDto {
    quantityOnHand?: number;
    quantityReserved?: number;
    quantityCommitted?: number;
    minimumStock?: number;
    maximumStock?: number;
    reorderQuantity?: number;
    leadTimeDays?: number;
    averageCost?: number;
    lastPurchaseCost?: number;
    lastPurchaseDate?: string;
    isActive?: boolean;
}
export declare class InventoryItemResponseDto {
    id: string;
    productId: string;
    productVariantId?: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
    quantityCommitted: number;
    minimumStock: number;
    maximumStock?: number;
    reorderQuantity?: number;
    leadTimeDays?: number;
    averageCost: number;
    lastPurchaseCost?: number;
    lastPurchaseDate?: Date;
    batchNumber?: string;
    expirationDate?: Date;
    manufacturingDate?: Date;
    isActive: boolean;
    isLowStock: boolean;
    isOutOfStock: boolean;
    product?: {
        id: string;
        name: string;
        sku: string;
        displayName?: string;
    };
    productVariant?: {
        id: string;
        name: string;
        sku: string;
    };
    warehouse?: {
        id: string;
        name: string;
        code: string;
    };
    lastCountDate?: Date;
    lastCountBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InventoryItemListDto {
    items: InventoryItemResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary?: {
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
        outOfStockItems: number;
        averageStockLevel: number;
    };
}
export declare class InventorySearchDto {
    search?: string;
    productId?: string;
    lowStockOnly?: boolean;
    outOfStockOnly?: boolean;
    activeOnly?: boolean;
    includeProduct?: boolean;
    page?: number;
    limit?: number;
}
export declare class BulkInventoryUpdateDto {
    updates: Array<{
        productSku: string;
        warehouseCode: string;
        quantityOnHand?: number;
        averageCost?: number;
        batchNumber?: string;
    }>;
    reason: string;
    reasonCode?: string;
}
