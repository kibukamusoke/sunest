import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUUID, IsDecimal, IsBoolean, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInventoryItemDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'product-uuid',
    })
    @IsUUID()
    productId: string;

    @ApiPropertyOptional({
        description: 'Product variant ID (optional)',
        example: 'variant-uuid',
    })
    @IsOptional()
    @IsUUID()
    productVariantId?: string;

    @ApiProperty({
        description: 'Warehouse ID',
        example: 'warehouse-uuid',
    })
    @IsUUID()
    warehouseId: string;

    @ApiPropertyOptional({
        description: 'Initial quantity on hand',
        example: 100,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantityOnHand?: number;

    @ApiPropertyOptional({
        description: 'Minimum stock level (reorder point)',
        example: 10,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    minimumStock?: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level',
        example: 500,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    maximumStock?: number;

    @ApiPropertyOptional({
        description: 'Reorder quantity',
        example: 100,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    reorderQuantity?: number;

    @ApiPropertyOptional({
        description: 'Lead time in days',
        example: 14,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    leadTimeDays?: number;

    @ApiPropertyOptional({
        description: 'Average cost per unit',
        example: 299.99,
        minimum: 0,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    @Min(0)
    averageCost?: number;

    @ApiPropertyOptional({
        description: 'Last purchase cost per unit',
        example: 295.00,
        minimum: 0,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    @Min(0)
    lastPurchaseCost?: number;

    @ApiPropertyOptional({
        description: 'Last purchase date',
        example: '2024-01-15T10:30:00Z',
    })
    @IsOptional()
    @IsDateString()
    lastPurchaseDate?: string;

    @ApiPropertyOptional({
        description: 'Batch number for lot tracking',
        example: 'BATCH-2024-001',
    })
    @IsOptional()
    @IsString()
    batchNumber?: string;

    @ApiPropertyOptional({
        description: 'Expiration date for perishable items',
        example: '2025-01-15T10:30:00Z',
    })
    @IsOptional()
    @IsDateString()
    expirationDate?: string;

    @ApiPropertyOptional({
        description: 'Manufacturing date',
        example: '2024-01-01T10:30:00Z',
    })
    @IsOptional()
    @IsDateString()
    manufacturingDate?: string;
}

export class UpdateInventoryItemDto {
    @ApiPropertyOptional({
        description: 'Quantity on hand',
        example: 150,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantityOnHand?: number;

    @ApiPropertyOptional({
        description: 'Quantity reserved',
        example: 20,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantityReserved?: number;

    @ApiPropertyOptional({
        description: 'Quantity committed',
        example: 10,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantityCommitted?: number;

    @ApiPropertyOptional({
        description: 'Minimum stock level',
        example: 15,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    minimumStock?: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level',
        example: 600,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    maximumStock?: number;

    @ApiPropertyOptional({
        description: 'Reorder quantity',
        example: 120,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    reorderQuantity?: number;

    @ApiPropertyOptional({
        description: 'Lead time in days',
        example: 12,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    leadTimeDays?: number;

    @ApiPropertyOptional({
        description: 'Average cost per unit',
        example: 305.99,
        minimum: 0,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    @Min(0)
    averageCost?: number;

    @ApiPropertyOptional({
        description: 'Last purchase cost per unit',
        example: 300.00,
        minimum: 0,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    @Min(0)
    lastPurchaseCost?: number;

    @ApiPropertyOptional({
        description: 'Last purchase date',
        example: '2024-01-20T10:30:00Z',
    })
    @IsOptional()
    @IsDateString()
    lastPurchaseDate?: string;

    @ApiPropertyOptional({
        description: 'Whether the inventory item is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class InventoryItemResponseDto {
    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Product ID',
        example: 'product-uuid',
    })
    productId: string;

    @ApiPropertyOptional({
        description: 'Product variant ID',
        example: 'variant-uuid',
    })
    productVariantId?: string;

    @ApiProperty({
        description: 'Warehouse ID',
        example: 'warehouse-uuid',
    })
    warehouseId: string;

    @ApiProperty({
        description: 'Quantity on hand',
        example: 150,
    })
    quantityOnHand: number;

    @ApiProperty({
        description: 'Quantity reserved',
        example: 20,
    })
    quantityReserved: number;

    @ApiProperty({
        description: 'Quantity available (calculated)',
        example: 130,
    })
    quantityAvailable: number;

    @ApiProperty({
        description: 'Quantity committed',
        example: 10,
    })
    quantityCommitted: number;

    @ApiProperty({
        description: 'Minimum stock level',
        example: 15,
    })
    minimumStock: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level',
        example: 600,
    })
    maximumStock?: number;

    @ApiPropertyOptional({
        description: 'Reorder quantity',
        example: 120,
    })
    reorderQuantity?: number;

    @ApiPropertyOptional({
        description: 'Lead time in days',
        example: 12,
    })
    leadTimeDays?: number;

    @ApiProperty({
        description: 'Average cost per unit',
        example: 305.99,
    })
    averageCost: number;

    @ApiPropertyOptional({
        description: 'Last purchase cost per unit',
        example: 300.00,
    })
    lastPurchaseCost?: number;

    @ApiPropertyOptional({
        description: 'Last purchase date',
        example: '2024-01-20T10:30:00Z',
    })
    lastPurchaseDate?: Date;

    @ApiPropertyOptional({
        description: 'Batch number',
        example: 'BATCH-2024-001',
    })
    batchNumber?: string;

    @ApiPropertyOptional({
        description: 'Expiration date',
        example: '2025-01-15T10:30:00Z',
    })
    expirationDate?: Date;

    @ApiPropertyOptional({
        description: 'Manufacturing date',
        example: '2024-01-01T10:30:00Z',
    })
    manufacturingDate?: Date;

    @ApiProperty({
        description: 'Whether the item is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Whether stock is below minimum threshold',
        example: false,
    })
    isLowStock: boolean;

    @ApiProperty({
        description: 'Whether item is out of stock',
        example: false,
    })
    isOutOfStock: boolean;

    @ApiPropertyOptional({
        description: 'Product information (if requested)',
    })
    product?: {
        id: string;
        name: string;
        sku: string;
        displayName?: string;
    };

    @ApiPropertyOptional({
        description: 'Product variant information (if requested)',
    })
    productVariant?: {
        id: string;
        name: string;
        sku: string;
    };

    @ApiPropertyOptional({
        description: 'Warehouse information (if requested)',
    })
    warehouse?: {
        id: string;
        name: string;
        code: string;
    };

    @ApiPropertyOptional({
        description: 'Last count date',
        example: '2024-01-10T10:30:00Z',
    })
    lastCountDate?: Date;

    @ApiPropertyOptional({
        description: 'Last count performed by user ID',
        example: 'user-uuid',
    })
    lastCountBy?: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    updatedAt: Date;
}

export class InventoryItemListDto {
    @ApiProperty({
        description: 'List of inventory items',
        type: [InventoryItemResponseDto],
    })
    items: InventoryItemResponseDto[];

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
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
        outOfStockItems: number;
        averageStockLevel: number;
    };
}

export class InventorySearchDto {
    @ApiPropertyOptional({
        description: 'Search query (product name, SKU, batch)',
        example: 'Intel i7',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Product ID filter',
        example: 'product-uuid',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiPropertyOptional({
        description: 'Warehouse ID filter',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;

    @ApiPropertyOptional({
        description: 'Show only low stock items',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    lowStockOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Show only out of stock items',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    outOfStockOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Show only active items',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    activeOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Include product information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeProduct?: boolean;

    @ApiPropertyOptional({
        description: 'Include warehouse information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeWarehouse?: boolean;

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

export class BulkInventoryUpdateDto {
    @ApiProperty({
        description: 'Array of inventory updates',
        type: [Object],
    })
    updates: Array<{
        productSku: string;
        warehouseCode: string;
        quantityOnHand?: number;
        averageCost?: number;
        batchNumber?: string;
    }>;

    @ApiProperty({
        description: 'Reason for bulk update',
        example: 'Weekly inventory sync',
    })
    @IsString()
    reason: string;

    @ApiPropertyOptional({
        description: 'Reason code',
        example: 'BULK_SYNC',
    })
    @IsOptional()
    @IsString()
    reasonCode?: string;
}
