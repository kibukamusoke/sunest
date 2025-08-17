import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUUID, IsDecimal, IsEnum, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { StockMovementType } from '@prisma/client';

export class CreateStockMovementDto {
    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    @IsUUID()
    inventoryItemId: string;

    @ApiProperty({
        description: 'Type of stock movement',
        example: 'RECEIPT',
        enum: StockMovementType,
    })
    @IsEnum(StockMovementType)
    type: StockMovementType;

    @ApiProperty({
        description: 'Quantity change (positive for increases, negative for decreases)',
        example: 100,
    })
    @IsInt()
    quantityChange: number;

    @ApiPropertyOptional({
        description: 'Reason for the movement',
        example: 'Goods received from supplier',
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({
        description: 'Standardized reason code',
        example: 'SUPPLIER_RECEIPT',
    })
    @IsOptional()
    @IsString()
    reasonCode?: string;

    @ApiPropertyOptional({
        description: 'Reference number (PO, order, transfer)',
        example: 'PO-2024-001',
    })
    @IsOptional()
    @IsString()
    reference?: string;

    @ApiPropertyOptional({
        description: 'Unit cost for this movement',
        example: 299.99,
        minimum: 0,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    @Min(0)
    unitCost?: number;

    @ApiPropertyOptional({
        description: 'Source warehouse ID for transfers',
        example: 'source-warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    sourceWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Destination warehouse ID for transfers',
        example: 'destination-warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    destinationWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Related order ID',
        example: 'order-uuid',
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Related transfer ID',
        example: 'transfer-uuid',
    })
    @IsOptional()
    @IsUUID()
    transferId?: string;

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Damaged items found during receipt',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class StockMovementResponseDto {
    @ApiProperty({
        description: 'Stock movement ID',
        example: 'movement-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    inventoryItemId: string;

    @ApiProperty({
        description: 'Type of stock movement',
        example: 'RECEIPT',
        enum: StockMovementType,
    })
    type: StockMovementType;

    @ApiPropertyOptional({
        description: 'Reason for the movement',
        example: 'Goods received from supplier',
    })
    reason?: string;

    @ApiPropertyOptional({
        description: 'Standardized reason code',
        example: 'SUPPLIER_RECEIPT',
    })
    reasonCode?: string;

    @ApiPropertyOptional({
        description: 'Reference number',
        example: 'PO-2024-001',
    })
    reference?: string;

    @ApiProperty({
        description: 'Quantity before movement',
        example: 50,
    })
    quantityBefore: number;

    @ApiProperty({
        description: 'Quantity change',
        example: 100,
    })
    quantityChange: number;

    @ApiProperty({
        description: 'Quantity after movement',
        example: 150,
    })
    quantityAfter: number;

    @ApiPropertyOptional({
        description: 'Unit cost for this movement',
        example: 299.99,
    })
    unitCost?: number;

    @ApiPropertyOptional({
        description: 'Total cost for this movement',
        example: 29999.00,
    })
    totalCost?: number;

    @ApiPropertyOptional({
        description: 'Source warehouse ID',
        example: 'source-warehouse-uuid',
    })
    sourceWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Destination warehouse ID',
        example: 'destination-warehouse-uuid',
    })
    destinationWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Related order ID',
        example: 'order-uuid',
    })
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Related transfer ID',
        example: 'transfer-uuid',
    })
    transferId?: string;

    @ApiProperty({
        description: 'User who performed the movement',
        example: 'user-uuid',
    })
    performedBy: string;

    @ApiProperty({
        description: 'When the movement was performed',
        example: '2024-01-15T10:30:00Z',
    })
    performedAt: Date;

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Damaged items found during receipt',
    })
    notes?: string;

    @ApiPropertyOptional({
        description: 'Inventory item information (if requested)',
    })
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

    @ApiPropertyOptional({
        description: 'Source warehouse information (if requested)',
    })
    sourceWarehouse?: {
        id: string;
        name: string;
        code: string;
    };

    @ApiPropertyOptional({
        description: 'Destination warehouse information (if requested)',
    })
    destinationWarehouse?: {
        id: string;
        name: string;
        code: string;
    };

    @ApiPropertyOptional({
        description: 'User who performed the movement (if requested)',
    })
    performedByUser?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}

export class StockMovementListDto {
    @ApiProperty({
        description: 'List of stock movements',
        type: [StockMovementResponseDto],
    })
    movements: StockMovementResponseDto[];

    @ApiProperty({
        description: 'Pagination information',
    })
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    @ApiPropertyOptional({
        description: 'Summary statistics',
    })
    summary?: {
        totalMovements: number;
        totalValueChange: number;
        movementsByType: Record<StockMovementType, number>;
    };
}

export class StockMovementSearchDto {
    @ApiPropertyOptional({
        description: 'Inventory item ID filter',
        example: 'inventory-item-uuid',
    })
    @IsOptional()
    @IsUUID()
    inventoryItemId?: string;

    @ApiPropertyOptional({
        description: 'Movement type filter',
        example: 'RECEIPT',
        enum: StockMovementType,
    })
    @IsOptional()
    @IsEnum(StockMovementType)
    type?: StockMovementType;

    @ApiPropertyOptional({
        description: 'Warehouse ID filter',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;

    @ApiPropertyOptional({
        description: 'Order ID filter',
        example: 'order-uuid',
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        description: 'User ID filter',
        example: 'user-uuid',
    })
    @IsOptional()
    @IsUUID()
    performedBy?: string;

    @ApiPropertyOptional({
        description: 'Start date filter',
        example: '2024-01-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'End date filter',
        example: '2024-01-31T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({
        description: 'Include inventory item details',
        example: true,
    })
    @IsOptional()
    includeInventoryItem?: boolean;

    @ApiPropertyOptional({
        description: 'Include user details',
        example: false,
    })
    @IsOptional()
    includeUser?: boolean;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 20;
}

export class CreateStockTransferDto {
    @ApiProperty({
        description: 'Source warehouse ID',
        example: 'source-warehouse-uuid',
    })
    @IsUUID()
    sourceWarehouseId: string;

    @ApiProperty({
        description: 'Destination warehouse ID',
        example: 'destination-warehouse-uuid',
    })
    @IsUUID()
    destinationWarehouseId: string;

    @ApiProperty({
        description: 'Items to transfer',
        type: [Object],
    })
    items: Array<{
        inventoryItemId: string;
        quantity: number;
        reason?: string;
    }>;

    @ApiPropertyOptional({
        description: 'Transfer reference number',
        example: 'TRANSFER-2024-001',
    })
    @IsOptional()
    @IsString()
    reference?: string;

    @ApiPropertyOptional({
        description: 'Transfer notes',
        example: 'Quarterly stock rebalancing',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class StockAdjustmentDto {
    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    @IsUUID()
    inventoryItemId: string;

    @ApiProperty({
        description: 'New quantity on hand',
        example: 85,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    newQuantity: number;

    @ApiProperty({
        description: 'Reason for adjustment',
        example: 'Cycle count adjustment',
    })
    @IsString()
    reason: string;

    @ApiPropertyOptional({
        description: 'Reason code',
        example: 'CYCLE_COUNT',
    })
    @IsOptional()
    @IsString()
    reasonCode?: string;

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Physical count completed on 2024-01-15',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}
