import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, IsUUID, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum AnalyticsPeriod {
    HOUR = 'HOUR',
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
}

export enum SearchAnalyticsType {
    SEARCH_VOLUME = 'SEARCH_VOLUME',
    TOP_TERMS = 'TOP_TERMS',
    ZERO_RESULTS = 'ZERO_RESULTS',
    CLICK_THROUGH = 'CLICK_THROUGH',
    CONVERSION = 'CONVERSION',
    PERFORMANCE = 'PERFORMANCE',
}

export class SearchAnalyticsQueryDto {
    @ApiPropertyOptional({
        description: 'Start date for analytics',
        example: '2024-01-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'End date for analytics',
        example: '2024-01-31T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({
        description: 'Analytics period',
        example: 'DAY',
        enum: AnalyticsPeriod,
    })
    @IsOptional()
    @IsEnum(AnalyticsPeriod)
    period?: AnalyticsPeriod = AnalyticsPeriod.DAY;

    @ApiPropertyOptional({
        description: 'Analytics type',
        example: 'SEARCH_VOLUME',
        enum: SearchAnalyticsType,
    })
    @IsOptional()
    @IsEnum(SearchAnalyticsType)
    type?: SearchAnalyticsType;

    @ApiPropertyOptional({
        description: 'Merchant ID filter',
        example: 'merchant-uuid',
    })
    @IsOptional()
    @IsUUID()
    merchantId?: string;

    @ApiPropertyOptional({
        description: 'Category filter',
        example: 'processors',
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        description: 'Maximum number of results',
        example: 100,
        minimum: 1,
        maximum: 1000,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    limit?: number = 100;
}

export class CreateSearchAnalyticsDto {
    @ApiProperty({
        description: 'Search term',
        example: 'intel processor',
    })
    @IsString()
    searchTerm: string;

    @ApiProperty({
        description: 'Search type',
        example: 'FULL_TEXT',
    })
    @IsString()
    searchType: string;

    @ApiPropertyOptional({
        description: 'Applied filters as JSON',
        example: '{"category": "processors", "priceRange": {"min": 100, "max": 500}}',
    })
    @IsOptional()
    @IsString()
    filters?: string;

    @ApiProperty({
        description: 'Number of results returned',
        example: 45,
    })
    @IsInt()
    @Min(0)
    resultCount: number;

    @ApiPropertyOptional({
        description: 'Product ID that was clicked (if any)',
        example: 'product-uuid',
    })
    @IsOptional()
    @IsUUID()
    clickedResult?: string;

    @ApiProperty({
        description: 'Session ID',
        example: 'session-uuid',
    })
    @IsString()
    sessionId: string;

    @ApiPropertyOptional({
        description: 'User agent string',
        example: 'Mozilla/5.0...',
    })
    @IsOptional()
    @IsString()
    userAgent?: string;

    @ApiPropertyOptional({
        description: 'IP address',
        example: '192.168.1.100',
    })
    @IsOptional()
    @IsString()
    ipAddress?: string;

    @ApiPropertyOptional({
        description: 'Merchant ID (if applicable)',
        example: 'merchant-uuid',
    })
    @IsOptional()
    @IsUUID()
    merchantId?: string;

    @ApiPropertyOptional({
        description: 'Search execution time in milliseconds',
        example: 125,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    executionTime?: number;
}

export class SearchVolumeDto {
    @ApiProperty({
        description: 'Date/time period',
        example: '2024-01-15',
    })
    date: string;

    @ApiProperty({
        description: 'Number of searches in this period',
        example: 1250,
    })
    searchCount: number;

    @ApiProperty({
        description: 'Number of unique users searching',
        example: 350,
    })
    uniqueUsers: number;

    @ApiProperty({
        description: 'Average search execution time in ms',
        example: 125,
    })
    avgExecutionTime: number;

    @ApiProperty({
        description: 'Success rate (searches with results)',
        example: 0.92,
    })
    successRate: number;
}

export class PopularSearchTermDto {
    @ApiProperty({
        description: 'Search term',
        example: 'graphics card',
    })
    term: string;

    @ApiProperty({
        description: 'Number of searches',
        example: 1250,
    })
    count: number;

    @ApiProperty({
        description: 'Percentage of total searches',
        example: 8.5,
    })
    percentage: number;

    @ApiProperty({
        description: 'Average number of results',
        example: 45,
    })
    avgResults: number;

    @ApiProperty({
        description: 'Click-through rate',
        example: 0.15,
    })
    clickThroughRate: number;

    @ApiPropertyOptional({
        description: 'Trend direction compared to previous period',
        example: 'up',
        enum: ['up', 'down', 'stable'],
    })
    trend?: string;

    @ApiPropertyOptional({
        description: 'Change percentage from previous period',
        example: 15.5,
    })
    changePercentage?: number;
}

export class ZeroResultSearchDto {
    @ApiProperty({
        description: 'Search term that returned no results',
        example: 'rtx 5090',
    })
    term: string;

    @ApiProperty({
        description: 'Number of times this search returned zero results',
        example: 45,
    })
    count: number;

    @ApiProperty({
        description: 'Last occurrence of this search',
        example: '2024-01-15T10:30:00Z',
    })
    lastSearched: Date;

    @ApiPropertyOptional({
        description: 'Suggested alternatives',
        example: ['rtx 4090', 'rtx 4080'],
        type: [String],
    })
    suggestions?: string[];

    @ApiPropertyOptional({
        description: 'Similar products found for this term',
        example: 3,
    })
    similarProductsCount?: number;
}

export class CategoryAnalyticsDto {
    @ApiProperty({
        description: 'Category name',
        example: 'Graphics Cards',
    })
    category: string;

    @ApiProperty({
        description: 'Category ID',
        example: 'category-uuid',
    })
    categoryId: string;

    @ApiProperty({
        description: 'Number of searches in this category',
        example: 2100,
    })
    searchCount: number;

    @ApiProperty({
        description: 'Percentage of total searches',
        example: 15.2,
    })
    percentage: number;

    @ApiProperty({
        description: 'Average products per search',
        example: 35,
    })
    avgProductsPerSearch: number;

    @ApiProperty({
        description: 'Click-through rate for this category',
        example: 0.18,
    })
    clickThroughRate: number;

    @ApiProperty({
        description: 'Most popular search terms in this category',
        example: ['rtx 4080', 'nvidia graphics', 'gaming gpu'],
        type: [String],
    })
    topTerms: string[];
}

export class SearchPerformanceDto {
    @ApiProperty({
        description: 'Average search execution time in milliseconds',
        example: 125,
    })
    avgExecutionTime: number;

    @ApiProperty({
        description: '95th percentile execution time',
        example: 250,
    })
    p95ExecutionTime: number;

    @ApiProperty({
        description: 'Search success rate',
        example: 0.92,
    })
    successRate: number;

    @ApiProperty({
        description: 'Average number of results per search',
        example: 35,
    })
    avgResultsPerSearch: number;

    @ApiProperty({
        description: 'Click-through rate',
        example: 0.15,
    })
    clickThroughRate: number;

    @ApiProperty({
        description: 'Search-to-conversion rate',
        example: 0.05,
    })
    conversionRate: number;

    @ApiProperty({
        description: 'Performance trends over time',
        type: [Object],
    })
    trends: Array<{
        date: string;
        avgExecutionTime: number;
        successRate: number;
        clickThroughRate: number;
    }>;
}

export class SearchAnalyticsResponseDto {
    @ApiProperty({
        description: 'Search volume over time',
        type: [SearchVolumeDto],
    })
    volume: SearchVolumeDto[];

    @ApiProperty({
        description: 'Popular search terms',
        type: [PopularSearchTermDto],
    })
    topTerms: PopularSearchTermDto[];

    @ApiProperty({
        description: 'Searches with zero results',
        type: [ZeroResultSearchDto],
    })
    zeroResults: ZeroResultSearchDto[];

    @ApiProperty({
        description: 'Category-wise search analytics',
        type: [CategoryAnalyticsDto],
    })
    categories: CategoryAnalyticsDto[];

    @ApiProperty({
        description: 'Search performance metrics',
        type: SearchPerformanceDto,
    })
    performance: SearchPerformanceDto;

    @ApiProperty({
        description: 'Summary statistics',
    })
    summary: {
        totalSearches: number;
        uniqueUsers: number;
        avgSearchesPerUser: number;
        avgExecutionTime: number;
        successRate: number;
        topCategory: string;
        topSearchTerm: string;
    };

    @ApiProperty({
        description: 'Analysis period',
    })
    period: {
        startDate: Date;
        endDate: Date;
        duration: string;
    };
}

export class SearchTrendDto {
    @ApiProperty({
        description: 'Date',
        example: '2024-01-15',
    })
    date: string;

    @ApiProperty({
        description: 'Search term',
        example: 'graphics card',
    })
    term: string;

    @ApiProperty({
        description: 'Search count for this date',
        example: 150,
    })
    count: number;

    @ApiProperty({
        description: 'Rank for this date',
        example: 1,
    })
    rank: number;
}

export class SearchInsightsDto {
    @ApiProperty({
        description: 'Trending search terms',
        type: [Object],
    })
    trending: Array<{
        term: string;
        currentCount: number;
        previousCount: number;
        growth: number;
        growthPercentage: number;
    }>;

    @ApiProperty({
        description: 'Declining search terms',
        type: [Object],
    })
    declining: Array<{
        term: string;
        currentCount: number;
        previousCount: number;
        decline: number;
        declinePercentage: number;
    }>;

    @ApiProperty({
        description: 'Seasonal patterns',
        type: [Object],
    })
    seasonal: Array<{
        term: string;
        pattern: string; // 'weekday', 'weekend', 'monthly', etc.
        peak: string;
        description: string;
    }>;

    @ApiProperty({
        description: 'Search opportunities (high volume, low competition)',
        type: [Object],
    })
    opportunities: Array<{
        term: string;
        searchVolume: number;
        resultCount: number;
        competition: string; // 'low', 'medium', 'high'
        recommendation: string;
    }>;
}
