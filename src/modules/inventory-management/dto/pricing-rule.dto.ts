import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUUID, IsDecimal, IsEnum, IsBoolean, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PriceAdjustmentType } from '@prisma/client';

export class CreateInventoryPricingRuleDto {
    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    @IsUUID()
    inventoryItemId: string;

    @ApiProperty({
        description: 'Rule name',
        example: 'Bulk Discount 100+',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Rule description',
        example: '10% discount for orders of 100 or more units',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Rule priority (higher = applied first)',
        example: 1,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    priority?: number;

    @ApiProperty({
        description: 'Minimum quantity for rule to apply',
        example: 100,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    minimumQuantity: number;

    @ApiPropertyOptional({
        description: 'Maximum quantity for rule to apply',
        example: 500,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    maximumQuantity?: number;

    @ApiProperty({
        description: 'Price adjustment amount',
        example: -10,
    })
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    priceAdjustment: number;

    @ApiProperty({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: PriceAdjustmentType,
    })
    @IsEnum(PriceAdjustmentType)
    adjustmentType: PriceAdjustmentType;

    @ApiPropertyOptional({
        description: 'Minimum stock level required for rule to apply',
        example: 50,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    minimumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level for rule to apply',
        example: 1000,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    maximumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Rule valid from date',
        example: '2024-01-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    validFrom?: string;

    @ApiPropertyOptional({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    validTo?: string;
}

export class UpdateInventoryPricingRuleDto {
    @ApiPropertyOptional({
        description: 'Rule name',
        example: 'Updated Bulk Discount 100+',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Rule description',
        example: '15% discount for orders of 100 or more units',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Rule priority',
        example: 2,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    priority?: number;

    @ApiPropertyOptional({
        description: 'Minimum quantity for rule to apply',
        example: 80,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    minimumQuantity?: number;

    @ApiPropertyOptional({
        description: 'Maximum quantity for rule to apply',
        example: 600,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    maximumQuantity?: number;

    @ApiPropertyOptional({
        description: 'Price adjustment amount',
        example: -15,
    })
    @IsOptional()
    @IsDecimal()
    @Transform(({ value }) => parseFloat(value))
    priceAdjustment?: number;

    @ApiPropertyOptional({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: PriceAdjustmentType,
    })
    @IsOptional()
    @IsEnum(PriceAdjustmentType)
    adjustmentType?: PriceAdjustmentType;

    @ApiPropertyOptional({
        description: 'Minimum stock level required',
        example: 40,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    minimumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level for rule to apply',
        example: 1200,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    maximumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Rule valid from date',
        example: '2024-02-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    validFrom?: string;

    @ApiPropertyOptional({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    validTo?: string;

    @ApiPropertyOptional({
        description: 'Whether the rule is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class InventoryPricingRuleResponseDto {
    @ApiProperty({
        description: 'Pricing rule ID',
        example: 'pricing-rule-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    inventoryItemId: string;

    @ApiProperty({
        description: 'Rule name',
        example: 'Bulk Discount 100+',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Rule description',
        example: '10% discount for orders of 100 or more units',
    })
    description?: string;

    @ApiProperty({
        description: 'Rule priority',
        example: 1,
    })
    priority: number;

    @ApiProperty({
        description: 'Minimum quantity for rule to apply',
        example: 100,
    })
    minimumQuantity: number;

    @ApiPropertyOptional({
        description: 'Maximum quantity for rule to apply',
        example: 500,
    })
    maximumQuantity?: number;

    @ApiProperty({
        description: 'Price adjustment amount',
        example: -10,
    })
    priceAdjustment: number;

    @ApiProperty({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: PriceAdjustmentType,
    })
    adjustmentType: PriceAdjustmentType;

    @ApiPropertyOptional({
        description: 'Minimum stock level required',
        example: 50,
    })
    minimumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Maximum stock level for rule to apply',
        example: 1000,
    })
    maximumStockLevel?: number;

    @ApiPropertyOptional({
        description: 'Rule valid from date',
        example: '2024-01-01T00:00:00Z',
    })
    validFrom?: Date;

    @ApiPropertyOptional({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    })
    validTo?: Date;

    @ApiProperty({
        description: 'Whether the rule is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Whether the rule is currently valid (date-based)',
        example: true,
    })
    isCurrentlyValid: boolean;

    @ApiPropertyOptional({
        description: 'Inventory item information (if requested)',
    })
    inventoryItem?: {
        id: string;
        product: {
            id: string;
            name: string;
            sku: string;
            basePrice: number;
        };
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
        quantityOnHand: number;
        quantityAvailable: number;
    };

    @ApiProperty({
        description: 'Created by user ID',
        example: 'user-uuid',
    })
    createdBy?: string;

    @ApiProperty({
        description: 'Updated by user ID',
        example: 'user-uuid',
    })
    updatedBy?: string;

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

export class InventoryPricingRuleListDto {
    @ApiProperty({
        description: 'List of pricing rules',
        type: [InventoryPricingRuleResponseDto],
    })
    rules: InventoryPricingRuleResponseDto[];

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
        totalRules: number;
        activeRules: number;
        expiredRules: number;
        rulesByType: Record<PriceAdjustmentType, number>;
    };
}

export class PricingRuleSearchDto {
    @ApiPropertyOptional({
        description: 'Inventory item ID filter',
        example: 'inventory-item-uuid',
    })
    @IsOptional()
    @IsUUID()
    inventoryItemId?: string;

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
        description: 'Adjustment type filter',
        example: 'PERCENTAGE',
        enum: PriceAdjustmentType,
    })
    @IsOptional()
    @IsEnum(PriceAdjustmentType)
    adjustmentType?: PriceAdjustmentType;

    @ApiPropertyOptional({
        description: 'Show only active rules',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    activeOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Show only currently valid rules (date-based)',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    currentlyValidOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Include inventory item details',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeInventoryItem?: boolean;

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

export class PriceCalculationDto {
    @ApiProperty({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    })
    @IsUUID()
    inventoryItemId: string;

    @ApiProperty({
        description: 'Quantity for price calculation',
        example: 150,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    quantity: number;
}

export class PriceCalculationResponseDto {
    @ApiProperty({
        description: 'Base price per unit',
        example: 299.99,
    })
    basePrice: number;

    @ApiProperty({
        description: 'Final price per unit after rules',
        example: 269.99,
    })
    finalPrice: number;

    @ApiProperty({
        description: 'Total price for quantity',
        example: 40498.50,
    })
    totalPrice: number;

    @ApiProperty({
        description: 'Total discount amount',
        example: 4500.00,
    })
    totalDiscount: number;

    @ApiProperty({
        description: 'Discount percentage',
        example: 10.0,
    })
    discountPercentage: number;

    @ApiProperty({
        description: 'Applied pricing rules',
        type: [Object],
    })
    appliedRules: Array<{
        id: string;
        name: string;
        adjustmentType: PriceAdjustmentType;
        priceAdjustment: number;
        discountAmount: number;
    }>;

    @ApiProperty({
        description: 'Quantity for calculation',
        example: 150,
    })
    quantity: number;

    @ApiProperty({
        description: 'Whether stock is available for this quantity',
        example: true,
    })
    stockAvailable: boolean;
}
