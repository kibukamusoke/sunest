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
exports.SearchProductDto = exports.ProductPricingDto = exports.ProductAvailabilityDto = exports.SearchSuggestionDto = exports.BulkSkuSearchDto = exports.ProductSearchDto = exports.SearchSortDto = exports.SearchFiltersDto = exports.SpecificationFilterDto = exports.PriceRangeDto = exports.SortOrder = exports.SortField = exports.SearchType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
var SearchType;
(function (SearchType) {
    SearchType["FULL_TEXT"] = "FULL_TEXT";
    SearchType["SKU"] = "SKU";
    SearchType["CATEGORY"] = "CATEGORY";
    SearchType["SPECIFICATION"] = "SPECIFICATION";
    SearchType["FILTERED"] = "FILTERED";
    SearchType["COMPARISON"] = "COMPARISON";
})(SearchType || (exports.SearchType = SearchType = {}));
var SortField;
(function (SortField) {
    SortField["RELEVANCE"] = "relevance";
    SortField["NAME"] = "name";
    SortField["PRICE"] = "price";
    SortField["CREATED_AT"] = "createdAt";
    SortField["UPDATED_AT"] = "updatedAt";
    SortField["POPULARITY"] = "popularity";
    SortField["RATING"] = "rating";
})(SortField || (exports.SortField = SortField = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class PriceRangeDto {
}
exports.PriceRangeDto = PriceRangeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum price',
        example: 100,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceRangeDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum price',
        example: 1000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceRangeDto.prototype, "max", void 0);
class SpecificationFilterDto {
}
exports.SpecificationFilterDto = SpecificationFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification name',
        example: 'cores',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecificationFilterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification values to filter by',
        example: ['4', '6', '8'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SpecificationFilterDto.prototype, "values", void 0);
class SearchFiltersDto {
}
exports.SearchFiltersDto = SearchFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price range filter',
        type: PriceRangeDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceRangeDto),
    __metadata("design:type", PriceRangeDto)
], SearchFiltersDto.prototype, "priceRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand names to filter by',
        example: ['Intel', 'AMD'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "brands", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category IDs to filter by',
        example: ['category-1-uuid', 'category-2-uuid'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant IDs to filter by',
        example: ['merchant-1-uuid'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "merchants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product statuses to filter by',
        example: ['PUBLISHED'],
        enum: client_1.ProductStatus,
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.ProductStatus, { each: true }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "statuses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specification filters',
        type: [SpecificationFilterDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SpecificationFilterDto),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only products in stock',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchFiltersDto.prototype, "inStockOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only products with images',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchFiltersDto.prototype, "withImagesOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only products on sale',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchFiltersDto.prototype, "onSaleOnly", void 0);
class SearchSortDto {
    constructor() {
        this.field = SortField.RELEVANCE;
        this.order = SortOrder.ASC;
    }
}
exports.SearchSortDto = SearchSortDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field to sort by',
        example: 'price',
        enum: SortField,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortField),
    __metadata("design:type", String)
], SearchSortDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'asc',
        enum: SortOrder,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], SearchSortDto.prototype, "order", void 0);
class ProductSearchDto {
    constructor() {
        this.type = SearchType.FULL_TEXT;
        this.page = 1;
        this.limit = 20;
        this.includeVariants = false;
        this.includeInventory = true;
        this.includeCategory = true;
        this.includeMerchant = false;
        this.quantity = 1;
    }
}
exports.ProductSearchDto = ProductSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query term',
        example: 'intel processor',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search type',
        example: 'FULL_TEXT',
        enum: SearchType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SearchType),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search filters',
        type: SearchFiltersDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SearchFiltersDto),
    __metadata("design:type", SearchFiltersDto)
], ProductSearchDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort configuration',
        type: SearchSortDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SearchSortDto),
    __metadata("design:type", SearchSortDto)
], ProductSearchDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include product variants in results',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSearchDto.prototype, "includeVariants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include inventory information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSearchDto.prototype, "includeInventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include category information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSearchDto.prototype, "includeCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include merchant information',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSearchDto.prototype, "includeMerchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity for pricing calculations',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "quantity", void 0);
class BulkSkuSearchDto {
    constructor() {
        this.includeInventory = true;
        this.includePricing = true;
    }
}
exports.BulkSkuSearchDto = BulkSkuSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of SKUs to search for',
        example: ['INTEL-i7-12700K', 'AMD-RYZEN-5600X', 'NVIDIA-RTX-4070'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkSkuSearchDto.prototype, "skus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include inventory information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkSkuSearchDto.prototype, "includeInventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include pricing information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkSkuSearchDto.prototype, "includePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkSkuSearchDto.prototype, "warehouseId", void 0);
class SearchSuggestionDto {
    constructor() {
        this.limit = 10;
    }
}
exports.SearchSuggestionDto = SearchSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Partial search term for suggestions',
        example: 'intel',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SearchSuggestionDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of suggestions',
        example: 10,
        minimum: 1,
        maximum: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], SearchSuggestionDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category to limit suggestions to',
        example: 'category-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchSuggestionDto.prototype, "categoryId", void 0);
class ProductAvailabilityDto {
}
exports.ProductAvailabilityDto = ProductAvailabilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether product is in stock',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductAvailabilityDto.prototype, "inStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available quantity',
        example: 150,
    }),
    __metadata("design:type", Number)
], ProductAvailabilityDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warehouse information',
    }),
    __metadata("design:type", Object)
], ProductAvailabilityDto.prototype, "warehouse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estimated lead time in days',
        example: 3,
    }),
    __metadata("design:type", Number)
], ProductAvailabilityDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Restock date if out of stock',
        example: '2024-01-20T00:00:00Z',
    }),
    __metadata("design:type", Date)
], ProductAvailabilityDto.prototype, "restockDate", void 0);
class ProductPricingDto {
}
exports.ProductPricingDto = ProductPricingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base price per unit',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Final price after quantity discounts',
        example: 279.99,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "finalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity for pricing calculation',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount',
        example: 20.0,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount percentage',
        example: 6.67,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductPricingDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price breaks for different quantities',
        type: [Object],
    }),
    __metadata("design:type", Array)
], ProductPricingDto.prototype, "priceBreaks", void 0);
class SearchProductDto {
}
exports.SearchProductDto = SearchProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Intel Core i7-12700K',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product display name',
        example: 'Intel Core i7-12700K Desktop Processor',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product SKU',
        example: 'INTEL-i7-12700K',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product brand',
        example: 'Intel',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'i7-12700K',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short product description',
        example: 'High-performance desktop processor with 12 cores',
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product images',
        example: ['https://example.com/image1.jpg'],
        type: [String],
    }),
    __metadata("design:type", Array)
], SearchProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product availability information',
        type: ProductAvailabilityDto,
    }),
    __metadata("design:type", ProductAvailabilityDto)
], SearchProductDto.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product pricing information',
        type: ProductPricingDto,
    }),
    __metadata("design:type", ProductPricingDto)
], SearchProductDto.prototype, "pricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product category information',
    }),
    __metadata("design:type", Object)
], SearchProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant information',
    }),
    __metadata("design:type", Object)
], SearchProductDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product specifications',
        example: { cores: 12, threads: 20, baseFrequency: '3.6 GHz' },
    }),
    __metadata("design:type", Object)
], SearchProductDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search relevance score',
        example: 0.95,
    }),
    __metadata("design:type", Number)
], SearchProductDto.prototype, "relevanceScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variants (if requested)',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchProductDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product status',
        example: 'PUBLISHED',
        enum: client_1.ProductStatus,
    }),
    __metadata("design:type", String)
], SearchProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created date',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SearchProductDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last updated date',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SearchProductDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=search.dto.js.map