import { SearchDiscoveryService } from './search-discovery.service';
import { ProductSearchDto, BulkSkuSearchDto, SearchSuggestionDto, ProductSearchResponseDto, BulkSkuSearchResponseDto, SearchSuggestionResponseDto, QuickSearchResponseDto, CreateSavedSearchDto, UpdateSavedSearchDto, SavedSearchResponseDto, SavedSearchListDto, ExecuteSavedSearchDto, SearchAnalyticsResponseDto, AnalyticsPeriod } from './dto';
export declare class SearchDiscoveryController {
    private readonly searchService;
    constructor(searchService: SearchDiscoveryService);
    searchProducts(searchDto: ProductSearchDto, req: any): Promise<ProductSearchResponseDto>;
    quickSearch(query: string, limit: number): Promise<QuickSearchResponseDto>;
    bulkSkuSearch(bulkSearchDto: BulkSkuSearchDto, warehouseId?: string): Promise<BulkSkuSearchResponseDto>;
    getSearchSuggestions(suggestionDto: SearchSuggestionDto): Promise<SearchSuggestionResponseDto>;
    getSavedSearches(req: any): Promise<SavedSearchListDto>;
    createSavedSearch(createDto: CreateSavedSearchDto, req: any): Promise<SavedSearchResponseDto>;
    updateSavedSearch(searchId: string, updateDto: UpdateSavedSearchDto, req: any): Promise<SavedSearchResponseDto>;
    deleteSavedSearch(searchId: string, req: any): Promise<void>;
    executeSavedSearch(searchId: string, executeDto: ExecuteSavedSearchDto, req: any): Promise<ProductSearchResponseDto>;
    getSearchAnalytics(startDate?: string, endDate?: string, period?: AnalyticsPeriod, merchantId?: string, category?: string, limit?: number): Promise<SearchAnalyticsResponseDto>;
    trackProductClick(trackingData: {
        productId: string;
        searchTerm?: string;
        sessionId?: string;
    }, req: any): Promise<void>;
    getSearchHealth(): Promise<any>;
    getPopularSearchTerms(limit: number, period: AnalyticsPeriod): Promise<any>;
}
