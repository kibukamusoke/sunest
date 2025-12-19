export declare enum AlertFrequency {
    IMMEDIATE = "IMMEDIATE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY"
}
export declare class CreateSavedSearchDto {
    name: string;
    searchTerm?: string;
    filters: Record<string, any>;
    alertOnNewResults?: boolean;
    alertOnPriceChange?: boolean;
    alertFrequency?: AlertFrequency;
    priceChangeThreshold?: number;
    description?: string;
}
export declare class UpdateSavedSearchDto {
    name?: string;
    searchTerm?: string;
    filters?: Record<string, any>;
    alertOnNewResults?: boolean;
    alertOnPriceChange?: boolean;
    alertFrequency?: AlertFrequency;
    priceChangeThreshold?: number;
    description?: string;
    isActive?: boolean;
}
export declare class SavedSearchResponseDto {
    id: string;
    userId: string;
    name: string;
    searchTerm?: string;
    filters: Record<string, any>;
    alerts: {
        onNewResults: boolean;
        onPriceChange: boolean;
        frequency: AlertFrequency;
        priceChangeThreshold: number;
    };
    statistics: {
        lastExecuted?: Date;
        resultCount: number;
        executionCount: number;
        avgExecutionTime?: number;
    };
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SavedSearchListDto {
    searches: SavedSearchResponseDto[];
    total: number;
    activeCount: number;
    alertEnabledCount: number;
}
export declare class ExecuteSavedSearchDto {
    searchId: string;
    page?: number;
    limit?: number;
    includeAvailability?: boolean;
    includePricing?: boolean;
    warehouseId?: string;
}
export declare class SearchAlertDto {
    id: string;
    savedSearch: SavedSearchResponseDto;
    alertType: string;
    message: string;
    newResultCount?: number;
    priceChanges?: Array<{
        productId: string;
        productName: string;
        oldPrice: number;
        newPrice: number;
        changePercentage: number;
    }>;
    createdAt: Date;
    isRead: boolean;
}
export declare class SearchAlertListDto {
    alerts: SearchAlertDto[];
    total: number;
    unreadCount: number;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare class MarkAlertReadDto {
    alertId: string;
}
export declare class BulkMarkAlertsReadDto {
    alertIds: string[];
}
export declare class SearchPreferencesDto {
    defaultPageSize?: number;
    defaultSortField?: string;
    defaultSortOrder?: string;
    saveSearchHistory?: boolean;
    enableSuggestions?: boolean;
    enableTypoCorrection?: boolean;
    preferredCategories?: string[];
    preferredBrands?: string[];
    defaultWarehouseId?: string;
    emailNotifications?: {
        enabled: boolean;
        frequency: AlertFrequency;
        digest: boolean;
    };
}
