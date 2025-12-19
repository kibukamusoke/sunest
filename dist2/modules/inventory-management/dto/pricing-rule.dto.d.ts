import { PriceAdjustmentType } from '@prisma/client';
export declare class CreateInventoryPricingRuleDto {
    inventoryItemId: string;
    name: string;
    description?: string;
    priority?: number;
    minimumQuantity: number;
    maximumQuantity?: number;
    priceAdjustment: number;
    adjustmentType: PriceAdjustmentType;
    minimumStockLevel?: number;
    maximumStockLevel?: number;
    validFrom?: string;
    validTo?: string;
}
export declare class UpdateInventoryPricingRuleDto {
    name?: string;
    description?: string;
    priority?: number;
    minimumQuantity?: number;
    maximumQuantity?: number;
    priceAdjustment?: number;
    adjustmentType?: PriceAdjustmentType;
    minimumStockLevel?: number;
    maximumStockLevel?: number;
    validFrom?: string;
    validTo?: string;
    isActive?: boolean;
}
export declare class InventoryPricingRuleResponseDto {
    id: string;
    inventoryItemId: string;
    name: string;
    description?: string;
    priority: number;
    minimumQuantity: number;
    maximumQuantity?: number;
    priceAdjustment: number;
    adjustmentType: PriceAdjustmentType;
    minimumStockLevel?: number;
    maximumStockLevel?: number;
    validFrom?: Date;
    validTo?: Date;
    isActive: boolean;
    isCurrentlyValid: boolean;
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
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InventoryPricingRuleListDto {
    rules: InventoryPricingRuleResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary?: {
        totalRules: number;
        activeRules: number;
        expiredRules: number;
        rulesByType: Record<PriceAdjustmentType, number>;
    };
}
export declare class PricingRuleSearchDto {
    inventoryItemId?: string;
    productId?: string;
    warehouseId?: string;
    adjustmentType?: PriceAdjustmentType;
    activeOnly?: boolean;
    currentlyValidOnly?: boolean;
    includeInventoryItem?: boolean;
    page?: number;
    limit?: number;
}
export declare class PriceCalculationDto {
    inventoryItemId: string;
    quantity: number;
}
export declare class PriceCalculationResponseDto {
    basePrice: number;
    finalPrice: number;
    totalPrice: number;
    totalDiscount: number;
    discountPercentage: number;
    appliedRules: Array<{
        id: string;
        name: string;
        adjustmentType: PriceAdjustmentType;
        priceAdjustment: number;
        discountAmount: number;
    }>;
    quantity: number;
    stockAvailable: boolean;
}
