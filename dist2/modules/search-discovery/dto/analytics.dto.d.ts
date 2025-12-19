export declare enum AnalyticsPeriod {
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}
export declare enum SearchAnalyticsType {
    SEARCH_VOLUME = "SEARCH_VOLUME",
    TOP_TERMS = "TOP_TERMS",
    ZERO_RESULTS = "ZERO_RESULTS",
    CLICK_THROUGH = "CLICK_THROUGH",
    CONVERSION = "CONVERSION",
    PERFORMANCE = "PERFORMANCE"
}
export declare class SearchAnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    period?: AnalyticsPeriod;
    type?: SearchAnalyticsType;
    merchantId?: string;
    category?: string;
    limit?: number;
}
export declare class CreateSearchAnalyticsDto {
    searchTerm: string;
    searchType: string;
    filters?: string;
    resultCount: number;
    clickedResult?: string;
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
    merchantId?: string;
    executionTime?: number;
}
export declare class SearchVolumeDto {
    date: string;
    searchCount: number;
    uniqueUsers: number;
    avgExecutionTime: number;
    successRate: number;
}
export declare class PopularSearchTermDto {
    term: string;
    count: number;
    percentage: number;
    avgResults: number;
    clickThroughRate: number;
    trend?: string;
    changePercentage?: number;
}
export declare class ZeroResultSearchDto {
    term: string;
    count: number;
    lastSearched: Date;
    suggestions?: string[];
    similarProductsCount?: number;
}
export declare class CategoryAnalyticsDto {
    category: string;
    categoryId: string;
    searchCount: number;
    percentage: number;
    avgProductsPerSearch: number;
    clickThroughRate: number;
    topTerms: string[];
}
export declare class SearchPerformanceDto {
    avgExecutionTime: number;
    p95ExecutionTime: number;
    successRate: number;
    avgResultsPerSearch: number;
    clickThroughRate: number;
    conversionRate: number;
    trends: Array<{
        date: string;
        avgExecutionTime: number;
        successRate: number;
        clickThroughRate: number;
    }>;
}
export declare class SearchAnalyticsResponseDto {
    volume: SearchVolumeDto[];
    topTerms: PopularSearchTermDto[];
    zeroResults: ZeroResultSearchDto[];
    categories: CategoryAnalyticsDto[];
    performance: SearchPerformanceDto;
    summary: {
        totalSearches: number;
        uniqueUsers: number;
        avgSearchesPerUser: number;
        avgExecutionTime: number;
        successRate: number;
        topCategory: string;
        topSearchTerm: string;
    };
    period: {
        startDate: Date;
        endDate: Date;
        duration: string;
    };
}
export declare class SearchTrendDto {
    date: string;
    term: string;
    count: number;
    rank: number;
}
export declare class SearchInsightsDto {
    trending: Array<{
        term: string;
        currentCount: number;
        previousCount: number;
        growth: number;
        growthPercentage: number;
    }>;
    declining: Array<{
        term: string;
        currentCount: number;
        previousCount: number;
        decline: number;
        declinePercentage: number;
    }>;
    seasonal: Array<{
        term: string;
        pattern: string;
        peak: string;
        description: string;
    }>;
    opportunities: Array<{
        term: string;
        searchVolume: number;
        resultCount: number;
        competition: string;
        recommendation: string;
    }>;
}
