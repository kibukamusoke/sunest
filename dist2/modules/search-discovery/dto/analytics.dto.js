"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInsightsDto = exports.SearchTrendDto = exports.SearchAnalyticsResponseDto = exports.SearchPerformanceDto = exports.CategoryAnalyticsDto = exports.ZeroResultSearchDto = exports.PopularSearchTermDto = exports.SearchVolumeDto = exports.CreateSearchAnalyticsDto = exports.SearchAnalyticsQueryDto = exports.SearchAnalyticsType = exports.AnalyticsPeriod = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AnalyticsPeriod;
(function (AnalyticsPeriod) {
    AnalyticsPeriod["HOUR"] = "HOUR";
    AnalyticsPeriod["DAY"] = "DAY";
    AnalyticsPeriod["WEEK"] = "WEEK";
    AnalyticsPeriod["MONTH"] = "MONTH";
    AnalyticsPeriod["QUARTER"] = "QUARTER";
    AnalyticsPeriod["YEAR"] = "YEAR";
})(AnalyticsPeriod || (exports.AnalyticsPeriod = AnalyticsPeriod = {}));
var SearchAnalyticsType;
(function (SearchAnalyticsType) {
    SearchAnalyticsType["SEARCH_VOLUME"] = "SEARCH_VOLUME";
    SearchAnalyticsType["TOP_TERMS"] = "TOP_TERMS";
    SearchAnalyticsType["ZERO_RESULTS"] = "ZERO_RESULTS";
    SearchAnalyticsType["CLICK_THROUGH"] = "CLICK_THROUGH";
    SearchAnalyticsType["CONVERSION"] = "CONVERSION";
    SearchAnalyticsType["PERFORMANCE"] = "PERFORMANCE";
})(SearchAnalyticsType || (exports.SearchAnalyticsType = SearchAnalyticsType = {}));
class SearchAnalyticsQueryDto {
    constructor() {
        this.period = AnalyticsPeriod.DAY;
        this.limit = 100;
    }
}
exports.SearchAnalyticsQueryDto = SearchAnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for analytics',
        example: '2024-01-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for analytics',
        example: '2024-01-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Analytics period',
        example: 'DAY',
        enum: AnalyticsPeriod,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AnalyticsPeriod),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Analytics type',
        example: 'SEARCH_VOLUME',
        enum: SearchAnalyticsType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SearchAnalyticsType),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant ID filter',
        example: 'merchant-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category filter',
        example: 'processors',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchAnalyticsQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of results',
        example: 100,
        minimum: 1,
        maximum: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], SearchAnalyticsQueryDto.prototype, "limit", void 0);
class CreateSearchAnalyticsDto {
}
exports.CreateSearchAnalyticsDto = CreateSearchAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term',
        example: 'intel processor',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search type',
        example: 'FULL_TEXT',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "searchType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Applied filters as JSON',
        example: '{"category": "processors", "priceRange": {"min": 100, "max": 500}}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of results returned',
        example: 45,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSearchAnalyticsDto.prototype, "resultCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID that was clicked (if any)',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "clickedResult", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Session ID',
        example: 'session-uuid',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User agent string',
        example: 'Mozilla/5.0...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address',
        example: '192.168.1.100',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant ID (if applicable)',
        example: 'merchant-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSearchAnalyticsDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search execution time in milliseconds',
        example: 125,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSearchAnalyticsDto.prototype, "executionTime", void 0);
class SearchVolumeDto {
}
exports.SearchVolumeDto = SearchVolumeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date/time period',
        example: '2024-01-15',
    }),
    __metadata("design:type", String)
], SearchVolumeDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of searches in this period',
        example: 1250,
    }),
    __metadata("design:type", Number)
], SearchVolumeDto.prototype, "searchCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of unique users searching',
        example: 350,
    }),
    __metadata("design:type", Number)
], SearchVolumeDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average search execution time in ms',
        example: 125,
    }),
    __metadata("design:type", Number)
], SearchVolumeDto.prototype, "avgExecutionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success rate (searches with results)',
        example: 0.92,
    }),
    __metadata("design:type", Number)
], SearchVolumeDto.prototype, "successRate", void 0);
class PopularSearchTermDto {
}
exports.PopularSearchTermDto = PopularSearchTermDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term',
        example: 'graphics card',
    }),
    __metadata("design:type", String)
], PopularSearchTermDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of searches',
        example: 1250,
    }),
    __metadata("design:type", Number)
], PopularSearchTermDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of total searches',
        example: 8.5,
    }),
    __metadata("design:type", Number)
], PopularSearchTermDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average number of results',
        example: 45,
    }),
    __metadata("design:type", Number)
], PopularSearchTermDto.prototype, "avgResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Click-through rate',
        example: 0.15,
    }),
    __metadata("design:type", Number)
], PopularSearchTermDto.prototype, "clickThroughRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trend direction compared to previous period',
        example: 'up',
        enum: ['up', 'down', 'stable'],
    }),
    __metadata("design:type", String)
], PopularSearchTermDto.prototype, "trend", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Change percentage from previous period',
        example: 15.5,
    }),
    __metadata("design:type", Number)
], PopularSearchTermDto.prototype, "changePercentage", void 0);
class ZeroResultSearchDto {
}
exports.ZeroResultSearchDto = ZeroResultSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term that returned no results',
        example: 'rtx 5090',
    }),
    __metadata("design:type", String)
], ZeroResultSearchDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of times this search returned zero results',
        example: 45,
    }),
    __metadata("design:type", Number)
], ZeroResultSearchDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last occurrence of this search',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ZeroResultSearchDto.prototype, "lastSearched", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Suggested alternatives',
        example: ['rtx 4090', 'rtx 4080'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ZeroResultSearchDto.prototype, "suggestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Similar products found for this term',
        example: 3,
    }),
    __metadata("design:type", Number)
], ZeroResultSearchDto.prototype, "similarProductsCount", void 0);
class CategoryAnalyticsDto {
}
exports.CategoryAnalyticsDto = CategoryAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category name',
        example: 'Graphics Cards',
    }),
    __metadata("design:type", String)
], CategoryAnalyticsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: 'category-uuid',
    }),
    __metadata("design:type", String)
], CategoryAnalyticsDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of searches in this category',
        example: 2100,
    }),
    __metadata("design:type", Number)
], CategoryAnalyticsDto.prototype, "searchCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of total searches',
        example: 15.2,
    }),
    __metadata("design:type", Number)
], CategoryAnalyticsDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average products per search',
        example: 35,
    }),
    __metadata("design:type", Number)
], CategoryAnalyticsDto.prototype, "avgProductsPerSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Click-through rate for this category',
        example: 0.18,
    }),
    __metadata("design:type", Number)
], CategoryAnalyticsDto.prototype, "clickThroughRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most popular search terms in this category',
        example: ['rtx 4080', 'nvidia graphics', 'gaming gpu'],
        type: [String],
    }),
    __metadata("design:type", Array)
], CategoryAnalyticsDto.prototype, "topTerms", void 0);
class SearchPerformanceDto {
}
exports.SearchPerformanceDto = SearchPerformanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average search execution time in milliseconds',
        example: 125,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "avgExecutionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '95th percentile execution time',
        example: 250,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "p95ExecutionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search success rate',
        example: 0.92,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "successRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average number of results per search',
        example: 35,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "avgResultsPerSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Click-through rate',
        example: 0.15,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "clickThroughRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search-to-conversion rate',
        example: 0.05,
    }),
    __metadata("design:type", Number)
], SearchPerformanceDto.prototype, "conversionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Performance trends over time',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchPerformanceDto.prototype, "trends", void 0);
class SearchAnalyticsResponseDto {
}
exports.SearchAnalyticsResponseDto = SearchAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search volume over time',
        type: [SearchVolumeDto],
    }),
    __metadata("design:type", Array)
], SearchAnalyticsResponseDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Popular search terms',
        type: [PopularSearchTermDto],
    }),
    __metadata("design:type", Array)
], SearchAnalyticsResponseDto.prototype, "topTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Searches with zero results',
        type: [ZeroResultSearchDto],
    }),
    __metadata("design:type", Array)
], SearchAnalyticsResponseDto.prototype, "zeroResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category-wise search analytics',
        type: [CategoryAnalyticsDto],
    }),
    __metadata("design:type", Array)
], SearchAnalyticsResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search performance metrics',
        type: SearchPerformanceDto,
    }),
    __metadata("design:type", SearchPerformanceDto)
], SearchAnalyticsResponseDto.prototype, "performance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Summary statistics',
    }),
    __metadata("design:type", Object)
], SearchAnalyticsResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Analysis period',
    }),
    __metadata("design:type", Object)
], SearchAnalyticsResponseDto.prototype, "period", void 0);
class SearchTrendDto {
}
exports.SearchTrendDto = SearchTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date',
        example: '2024-01-15',
    }),
    __metadata("design:type", String)
], SearchTrendDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term',
        example: 'graphics card',
    }),
    __metadata("design:type", String)
], SearchTrendDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search count for this date',
        example: 150,
    }),
    __metadata("design:type", Number)
], SearchTrendDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rank for this date',
        example: 1,
    }),
    __metadata("design:type", Number)
], SearchTrendDto.prototype, "rank", void 0);
class SearchInsightsDto {
}
exports.SearchInsightsDto = SearchInsightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trending search terms',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchInsightsDto.prototype, "trending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Declining search terms',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchInsightsDto.prototype, "declining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Seasonal patterns',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchInsightsDto.prototype, "seasonal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search opportunities (high volume, low competition)',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchInsightsDto.prototype, "opportunities", void 0);
//# sourceMappingURL=analytics.dto.js.map