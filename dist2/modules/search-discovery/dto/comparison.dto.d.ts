import { SearchProductDto, ProductAvailabilityDto, ProductPricingDto } from './search.dto';
export declare class AddToComparisonDto {
    productId: string;
    sessionId?: string;
    quantity?: number;
    warehouseId?: string;
}
export declare class RemoveFromComparisonDto {
    productId: string;
    sessionId: string;
}
export declare class ComparisonSessionDto {
    sessionId: string;
    maxProducts?: number;
    includeSpecs?: boolean;
    includePricing?: boolean;
    includeAvailability?: boolean;
    quantity?: number;
}
export declare class BulkAddToComparisonDto {
    productIds: string[];
    sessionId?: string;
    replace?: boolean;
}
export declare class ComparisonProductDto {
    product: SearchProductDto;
    availability?: ProductAvailabilityDto;
    pricing?: ProductPricingDto;
    addedAt: Date;
    notes?: string;
}
export declare class ComparisonFieldDto {
    field: string;
    label: string;
    category: string;
    values: Record<string, any>;
    winner?: string;
    type: string;
    unit?: string;
    higherIsBetter?: boolean;
}
export declare class ComparisonMatrixDto {
    categories: Record<string, ComparisonFieldDto[]>;
    scores: Record<string, number>;
    recommendation: string;
    recommendationReason?: string;
}
export declare class ProductComparisonResponseDto {
    sessionId: string;
    products: ComparisonProductDto[];
    comparisonMatrix: ComparisonMatrixDto;
    summary: {
        totalProducts: number;
        priceRange: {
            min: number;
            max: number;
        };
        avgRating?: number;
        categories: string[];
        brands: string[];
    };
    exportOptions: string[];
    updatedAt: Date;
    similarProducts?: SearchProductDto[];
}
export declare class ComparisonSummaryDto {
    sessionId: string;
    productCount: number;
    productNames: string[];
    priceRange: {
        min: number;
        max: number;
        avg: number;
    };
    updatedAt: Date;
    recommendation?: string;
}
export declare class ComparisonExportDto {
    sessionId: string;
    format: string;
    includeImages?: boolean;
    includePricing?: boolean;
    includeAvailability?: boolean;
    customFields?: string[];
    includeBranding?: boolean;
}
export declare class ComparisonShareDto {
    sessionId: string;
    shareWithEmails?: string[];
    publicShare?: boolean;
    expirationDays?: number;
    message?: string;
}
