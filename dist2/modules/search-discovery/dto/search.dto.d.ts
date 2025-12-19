import { ProductStatus } from '@prisma/client';
export declare enum SearchType {
    FULL_TEXT = "FULL_TEXT",
    SKU = "SKU",
    CATEGORY = "CATEGORY",
    SPECIFICATION = "SPECIFICATION",
    FILTERED = "FILTERED",
    COMPARISON = "COMPARISON"
}
export declare enum SortField {
    RELEVANCE = "relevance",
    NAME = "name",
    PRICE = "price",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    POPULARITY = "popularity",
    RATING = "rating"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class PriceRangeDto {
    min?: number;
    max?: number;
}
export declare class SpecificationFilterDto {
    name: string;
    values: string[];
}
export declare class SearchFiltersDto {
    priceRange?: PriceRangeDto;
    brands?: string[];
    categories?: string[];
    merchants?: string[];
    statuses?: ProductStatus[];
    specifications?: SpecificationFilterDto[];
    inStockOnly?: boolean;
    withImagesOnly?: boolean;
    onSaleOnly?: boolean;
}
export declare class SearchSortDto {
    field?: SortField;
    order?: SortOrder;
}
export declare class ProductSearchDto {
    q?: string;
    type?: SearchType;
    filters?: SearchFiltersDto;
    sort?: SearchSortDto;
    page?: number;
    limit?: number;
    includeVariants?: boolean;
    includeInventory?: boolean;
    includeCategory?: boolean;
    includeMerchant?: boolean;
    warehouseId?: string;
    quantity?: number;
}
export declare class BulkSkuSearchDto {
    skus: string[];
    includeInventory?: boolean;
    includePricing?: boolean;
    warehouseId?: string;
}
export declare class SearchSuggestionDto {
    term: string;
    limit?: number;
    categoryId?: string;
}
export declare class ProductAvailabilityDto {
    inStock: boolean;
    quantity: number;
    warehouse?: {
        id: string;
        name: string;
        code: string;
    };
    leadTimeDays?: number;
    restockDate?: Date;
}
export declare class ProductPricingDto {
    basePrice: number;
    finalPrice: number;
    quantity: number;
    discount?: number;
    discountPercentage?: number;
    minimumOrderQuantity?: number;
    priceBreaks?: Array<{
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
}
export declare class SearchProductDto {
    id: string;
    name: string;
    displayName?: string;
    sku: string;
    brand?: string;
    model?: string;
    shortDescription?: string;
    images: string[];
    availability?: ProductAvailabilityDto;
    pricing?: ProductPricingDto;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    merchant?: {
        id: string;
        name: string;
        displayName?: string;
    };
    specifications: Record<string, any>;
    relevanceScore: number;
    variants?: Array<{
        id: string;
        name: string;
        sku: string;
        price?: number;
        availability?: ProductAvailabilityDto;
    }>;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
}
