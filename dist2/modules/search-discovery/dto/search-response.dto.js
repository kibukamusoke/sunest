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
exports.PopularSearchDto = exports.SearchHistoryDto = exports.QuickSearchResponseDto = exports.SearchSuggestionResponseDto = exports.BulkSkuSearchResponseDto = exports.ProductSearchResponseDto = exports.AvailableFiltersDto = exports.AvailableSpecificationFilterDto = exports.PriceRangeFilterDto = exports.FilterOptionDto = exports.SearchPaginationDto = exports.SearchMetadataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const search_dto_1 = require("./search.dto");
class SearchMetadataDto {
}
exports.SearchMetadataDto = SearchMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search execution time in milliseconds',
        example: 45,
    }),
    __metadata("design:type", Number)
], SearchMetadataDto.prototype, "executionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Applied filters summary',
        example: ['category:processors', 'brand:Intel'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchMetadataDto.prototype, "appliedFilters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Suggested search terms',
        example: ['intel core', 'intel processors'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchMetadataDto.prototype, "suggestedTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Did you mean suggestions',
        example: ['intel core i7'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchMetadataDto.prototype, "didYouMean", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total products found before pagination',
        example: 156,
    }),
    __metadata("design:type", Number)
], SearchMetadataDto.prototype, "totalFound", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query that was executed',
        example: 'intel processor',
    }),
    __metadata("design:type", String)
], SearchMetadataDto.prototype, "searchQuery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search type used',
        example: 'FULL_TEXT',
    }),
    __metadata("design:type", String)
], SearchMetadataDto.prototype, "searchType", void 0);
class SearchPaginationDto {
}
exports.SearchPaginationDto = SearchPaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], SearchPaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], SearchPaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items',
        example: 156,
    }),
    __metadata("design:type", Number)
], SearchPaginationDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 8,
    }),
    __metadata("design:type", Number)
], SearchPaginationDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a next page',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SearchPaginationDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a previous page',
        example: false,
    }),
    __metadata("design:type", Boolean)
], SearchPaginationDto.prototype, "hasPrev", void 0);
class FilterOptionDto {
}
exports.FilterOptionDto = FilterOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter option value',
        example: 'Intel',
    }),
    __metadata("design:type", String)
], FilterOptionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display label for the option',
        example: 'Intel Corporation',
    }),
    __metadata("design:type", String)
], FilterOptionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of products matching this filter',
        example: 45,
    }),
    __metadata("design:type", Number)
], FilterOptionDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this filter is currently selected',
        example: false,
    }),
    __metadata("design:type", Boolean)
], FilterOptionDto.prototype, "selected", void 0);
class PriceRangeFilterDto {
}
exports.PriceRangeFilterDto = PriceRangeFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum price in the range',
        example: 89.99,
    }),
    __metadata("design:type", Number)
], PriceRangeFilterDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum price in the range',
        example: 899.99,
    }),
    __metadata("design:type", Number)
], PriceRangeFilterDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Suggested price step for sliders',
        example: 10,
    }),
    __metadata("design:type", Number)
], PriceRangeFilterDto.prototype, "step", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currently selected minimum',
        example: 200,
    }),
    __metadata("design:type", Number)
], PriceRangeFilterDto.prototype, "selectedMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currently selected maximum',
        example: 500,
    }),
    __metadata("design:type", Number)
], PriceRangeFilterDto.prototype, "selectedMax", void 0);
class AvailableSpecificationFilterDto {
}
exports.AvailableSpecificationFilterDto = AvailableSpecificationFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification name',
        example: 'cores',
    }),
    __metadata("design:type", String)
], AvailableSpecificationFilterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display label',
        example: 'Number of Cores',
    }),
    __metadata("design:type", String)
], AvailableSpecificationFilterDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available specification values',
        type: [FilterOptionDto],
    }),
    __metadata("design:type", Array)
], AvailableSpecificationFilterDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter type',
        example: 'multiselect',
        enum: ['select', 'multiselect', 'range', 'boolean'],
    }),
    __metadata("design:type", String)
], AvailableSpecificationFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit of measurement',
        example: 'cores',
    }),
    __metadata("design:type", String)
], AvailableSpecificationFilterDto.prototype, "unit", void 0);
class AvailableFiltersDto {
}
exports.AvailableFiltersDto = AvailableFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price range filter',
        type: PriceRangeFilterDto,
    }),
    __metadata("design:type", PriceRangeFilterDto)
], AvailableFiltersDto.prototype, "priceRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand filters',
        type: [FilterOptionDto],
    }),
    __metadata("design:type", Array)
], AvailableFiltersDto.prototype, "brands", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category filters',
        type: [FilterOptionDto],
    }),
    __metadata("design:type", Array)
], AvailableFiltersDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant filters',
        type: [FilterOptionDto],
    }),
    __metadata("design:type", Array)
], AvailableFiltersDto.prototype, "merchants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specification filters',
        type: [AvailableSpecificationFilterDto],
    }),
    __metadata("design:type", Array)
], AvailableFiltersDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Availability filters',
        type: [FilterOptionDto],
    }),
    __metadata("design:type", Array)
], AvailableFiltersDto.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Other dynamic filters',
        type: Object,
    }),
    __metadata("design:type", Object)
], AvailableFiltersDto.prototype, "other", void 0);
class ProductSearchResponseDto {
}
exports.ProductSearchResponseDto = ProductSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search results',
        type: [search_dto_1.SearchProductDto],
    }),
    __metadata("design:type", Array)
], ProductSearchResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
        type: SearchPaginationDto,
    }),
    __metadata("design:type", SearchPaginationDto)
], ProductSearchResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search metadata',
        type: SearchMetadataDto,
    }),
    __metadata("design:type", SearchMetadataDto)
], ProductSearchResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Available filters for current search',
        type: AvailableFiltersDto,
    }),
    __metadata("design:type", AvailableFiltersDto)
], ProductSearchResponseDto.prototype, "availableFilters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search facets and aggregations',
        type: Object,
    }),
    __metadata("design:type", Object)
], ProductSearchResponseDto.prototype, "facets", void 0);
class BulkSkuSearchResponseDto {
}
exports.BulkSkuSearchResponseDto = BulkSkuSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Found products mapped by SKU',
        type: Object,
    }),
    __metadata("design:type", Object)
], BulkSkuSearchResponseDto.prototype, "found", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SKUs that were not found',
        example: ['INVALID-SKU-1', 'OUT-OF-STOCK-SKU'],
        type: [String],
    }),
    __metadata("design:type", Array)
], BulkSkuSearchResponseDto.prototype, "notFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of SKUs searched',
        example: 15,
    }),
    __metadata("design:type", Number)
], BulkSkuSearchResponseDto.prototype, "totalSearched", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of SKUs found',
        example: 13,
    }),
    __metadata("design:type", Number)
], BulkSkuSearchResponseDto.prototype, "totalFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search execution time in milliseconds',
        example: 125,
    }),
    __metadata("design:type", Number)
], BulkSkuSearchResponseDto.prototype, "executionTime", void 0);
class SearchSuggestionResponseDto {
}
exports.SearchSuggestionResponseDto = SearchSuggestionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name suggestions',
        example: ['Intel Core i7', 'Intel Core i9', 'Intel Xeon'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchSuggestionResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category suggestions',
        example: ['Processors', 'Graphics Cards'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchSuggestionResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brand suggestions',
        example: ['Intel', 'AMD'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchSuggestionResponseDto.prototype, "brands", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Popular search suggestions',
        example: ['intel processor', 'graphics card'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchSuggestionResponseDto.prototype, "popular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of suggestions',
        example: 8,
    }),
    __metadata("design:type", Number)
], SearchSuggestionResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term used for suggestions',
        example: 'intel',
    }),
    __metadata("design:type", String)
], SearchSuggestionResponseDto.prototype, "searchTerm", void 0);
class QuickSearchResponseDto {
}
exports.QuickSearchResponseDto = QuickSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quick search results (limited)',
        type: [search_dto_1.SearchProductDto],
    }),
    __metadata("design:type", Array)
], QuickSearchResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total matches found',
        example: 156,
    }),
    __metadata("design:type", Number)
], QuickSearchResponseDto.prototype, "totalMatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether more results are available',
        example: true,
    }),
    __metadata("design:type", Boolean)
], QuickSearchResponseDto.prototype, "hasMore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search suggestions',
        type: [String],
    }),
    __metadata("design:type", Array)
], QuickSearchResponseDto.prototype, "suggestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search execution time',
        example: 23,
    }),
    __metadata("design:type", Number)
], QuickSearchResponseDto.prototype, "executionTime", void 0);
class SearchHistoryDto {
}
exports.SearchHistoryDto = SearchHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term',
        example: 'intel processor',
    }),
    __metadata("design:type", String)
], SearchHistoryDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of results found',
        example: 45,
    }),
    __metadata("design:type", Number)
], SearchHistoryDto.prototype, "resultCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the search was performed',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SearchHistoryDto.prototype, "searchedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search type used',
        example: 'FULL_TEXT',
    }),
    __metadata("design:type", String)
], SearchHistoryDto.prototype, "searchType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filters that were applied',
        type: Object,
    }),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "filters", void 0);
class PopularSearchDto {
}
exports.PopularSearchDto = PopularSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term',
        example: 'graphics card',
    }),
    __metadata("design:type", String)
], PopularSearchDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of times searched',
        example: 1250,
    }),
    __metadata("design:type", Number)
], PopularSearchDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trend direction',
        example: 'up',
        enum: ['up', 'down', 'stable'],
    }),
    __metadata("design:type", String)
], PopularSearchDto.prototype, "trend", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average result count',
        example: 45,
    }),
    __metadata("design:type", Number)
], PopularSearchDto.prototype, "avgResultCount", void 0);
//# sourceMappingURL=search-response.dto.js.map