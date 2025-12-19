export declare class CreateSavedItemDto {
    productId?: string;
    productVariantId?: string;
    name?: string;
    notes?: string;
    quantity?: number;
    savedPrice?: number;
    listName?: string;
    tags?: string[];
}
export declare class UpdateSavedItemDto {
    name?: string;
    notes?: string;
    quantity?: number;
    savedPrice?: number;
    listName?: string;
    tags?: string[];
    isActive?: boolean;
}
export declare class AddSavedItemToCartDto {
    quantity?: number;
    notes?: string;
}
export declare class BulkAddSavedItemsToCartDto {
    savedItemIds: string[];
    useSavedQuantities?: boolean;
    customQuantities?: number[];
}
export declare class SavedItemResponseDto {
    id: string;
    userId: string;
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        images: string[];
        status: string;
        basePrice: number;
    };
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
        price?: number;
    };
    name?: string;
    notes?: string;
    quantity: number;
    savedPrice?: number;
    currentPrice?: number;
    priceChange: number;
    priceChangePercentage: number;
    listName?: string;
    tags: string[];
    isActive: boolean;
    isAvailable: boolean;
    availabilityMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateSavedListDto {
    name: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
}
export declare class UpdateSavedListDto {
    name?: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
}
export declare class SavedListResponseDto {
    id: string;
    name: string;
    description?: string;
    userId: string;
    tags: string[];
    isPublic: boolean;
    itemCount: number;
    totalEstimatedValue: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SavedItemsFilterDto {
    listName?: string;
    tags?: string[];
    search?: string;
    isAvailable?: boolean;
    isActive?: boolean;
    hasPriceChange?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class SavedItemsListDto {
    savedItems: SavedItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    availableLists: SavedListResponseDto[];
    availableTags: string[];
}
