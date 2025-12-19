import { StockMovementType } from '@prisma/client';
export declare class CreateStockMovementDto {
    inventoryItemId: string;
    type: StockMovementType;
    quantityChange: number;
    reason?: string;
    reasonCode?: string;
    reference?: string;
    unitCost?: number;
    sourceWarehouseId?: string;
    destinationWarehouseId?: string;
    orderId?: string;
    transferId?: string;
    notes?: string;
}
export declare class StockMovementResponseDto {
    id: string;
    inventoryItemId: string;
    type: StockMovementType;
    reason?: string;
    reasonCode?: string;
    reference?: string;
    quantityBefore: number;
    quantityChange: number;
    quantityAfter: number;
    unitCost?: number;
    totalCost?: number;
    sourceWarehouseId?: string;
    destinationWarehouseId?: string;
    orderId?: string;
    transferId?: string;
    performedBy: string;
    performedAt: Date;
    notes?: string;
    inventoryItem?: {
        id: string;
        product: {
            id: string;
            name: string;
            sku: string;
        };
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
    };
    sourceWarehouse?: {
        id: string;
        name: string;
        code: string;
    };
    destinationWarehouse?: {
        id: string;
        name: string;
        code: string;
    };
    performedByUser?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}
export declare class StockMovementListDto {
    movements: StockMovementResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary?: {
        totalMovements: number;
        totalValueChange: number;
        movementsByType: Record<StockMovementType, number>;
    };
}
export declare class StockMovementSearchDto {
    inventoryItemId?: string;
    type?: StockMovementType;
    orderId?: string;
    performedBy?: string;
    startDate?: string;
    endDate?: string;
    includeInventoryItem?: boolean;
    includeUser?: boolean;
    page?: number;
    limit?: number;
}
export declare class CreateStockTransferDto {
    sourceWarehouseId: string;
    destinationWarehouseId: string;
    items: Array<{
        inventoryItemId: string;
        quantity: number;
        reason?: string;
    }>;
    reference?: string;
    notes?: string;
}
export declare class StockAdjustmentDto {
    inventoryItemId: string;
    newQuantity: number;
    reason: string;
    reasonCode?: string;
    notes?: string;
}
