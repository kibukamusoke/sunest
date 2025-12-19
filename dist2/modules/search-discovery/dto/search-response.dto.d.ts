import { SearchProductDto } from './search.dto';
export declare class SearchMetadataDto {
    executionTime: number;
    appliedFilters: string[];
    suggestedTerms?: string[];
    didYouMean?: string[];
    totalFound: number;
    searchQuery?: string;
    searchType?: string;
}
export declare class SearchPaginationDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class FilterOptionDto {
    value: string;
    label: string;
    count: number;
    selected?: boolean;
}
export declare class PriceRangeFilterDto {
    min: number;
    max: number;
    step: number;
    selectedMin?: number;
    selectedMax?: number;
}
export declare class AvailableSpecificationFilterDto {
    name: string;
    label: string;
    options: FilterOptionDto[];
    type: string;
    unit?: string;
}
export declare class AvailableFiltersDto {
    priceRange?: PriceRangeFilterDto;
    brands?: FilterOptionDto[];
    categories?: FilterOptionDto[];
    merchants?: FilterOptionDto[];
    specifications?: AvailableSpecificationFilterDto[];
    availability?: FilterOptionDto[];
    other?: Record<string, FilterOptionDto[]>;
}
export declare class ProductSearchResponseDto {
    products: SearchProductDto[];
    pagination: SearchPaginationDto;
    metadata: SearchMetadataDto;
    availableFilters?: AvailableFiltersDto;
    facets?: Record<string, any>;
}
export declare class BulkSkuSearchResponseDto {
    found: Record<string, SearchProductDto>;
    notFound: string[];
    totalSearched: number;
    totalFound: number;
    executionTime: number;
}
export declare class SearchSuggestionResponseDto {
    products: string[];
    categories: string[];
    brands: string[];
    popular: string[];
    total: number;
    searchTerm: string;
}
export declare class QuickSearchResponseDto {
    products: SearchProductDto[];
    totalMatches: number;
    hasMore: boolean;
    suggestions: string[];
    executionTime: number;
}
export declare class SearchHistoryDto {
    searchTerm: string;
    resultCount: number;
    searchedAt: Date;
    searchType: string;
    filters?: Record<string, any>;
}
export declare class PopularSearchDto {
    term: string;
    count: number;
    trend: string;
    avgResultCount?: number;
}
