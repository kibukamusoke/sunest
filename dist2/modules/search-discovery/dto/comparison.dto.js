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
exports.ComparisonShareDto = exports.ComparisonExportDto = exports.ComparisonSummaryDto = exports.ProductComparisonResponseDto = exports.ComparisonMatrixDto = exports.ComparisonFieldDto = exports.ComparisonProductDto = exports.BulkAddToComparisonDto = exports.ComparisonSessionDto = exports.RemoveFromComparisonDto = exports.AddToComparisonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const search_dto_1 = require("./search.dto");
class AddToComparisonDto {
    constructor() {
        this.quantity = 1;
    }
}
exports.AddToComparisonDto = AddToComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID to add to comparison',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddToComparisonDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Comparison session ID (creates new if not provided)',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddToComparisonDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity for pricing comparison',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddToComparisonDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse ID for availability comparison',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddToComparisonDto.prototype, "warehouseId", void 0);
class RemoveFromComparisonDto {
}
exports.RemoveFromComparisonDto = RemoveFromComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID to remove from comparison',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RemoveFromComparisonDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RemoveFromComparisonDto.prototype, "sessionId", void 0);
class ComparisonSessionDto {
    constructor() {
        this.maxProducts = 5;
        this.includeSpecs = true;
        this.includePricing = true;
        this.includeAvailability = true;
        this.quantity = 1;
    }
}
exports.ComparisonSessionDto = ComparisonSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ComparisonSessionDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of products to include',
        example: 5,
        minimum: 2,
        maximum: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ComparisonSessionDto.prototype, "maxProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include detailed specifications',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonSessionDto.prototype, "includeSpecs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include pricing information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonSessionDto.prototype, "includePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include availability information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonSessionDto.prototype, "includeAvailability", void 0);
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
], ComparisonSessionDto.prototype, "quantity", void 0);
class BulkAddToComparisonDto {
    constructor() {
        this.replace = false;
    }
}
exports.BulkAddToComparisonDto = BulkAddToComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product IDs to add to comparison',
        example: ['product-1-uuid', 'product-2-uuid'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], BulkAddToComparisonDto.prototype, "productIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkAddToComparisonDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Replace existing comparison',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BulkAddToComparisonDto.prototype, "replace", void 0);
class ComparisonProductDto {
}
exports.ComparisonProductDto = ComparisonProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product information',
        type: search_dto_1.SearchProductDto,
    }),
    __metadata("design:type", search_dto_1.SearchProductDto)
], ComparisonProductDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product availability for comparison',
        type: search_dto_1.ProductAvailabilityDto,
    }),
    __metadata("design:type", search_dto_1.ProductAvailabilityDto)
], ComparisonProductDto.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product pricing for comparison',
        type: search_dto_1.ProductPricingDto,
    }),
    __metadata("design:type", search_dto_1.ProductPricingDto)
], ComparisonProductDto.prototype, "pricing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When this product was added to comparison',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ComparisonProductDto.prototype, "addedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Comparison specific notes',
        example: 'Preferred option for this project',
    }),
    __metadata("design:type", String)
], ComparisonProductDto.prototype, "notes", void 0);
class ComparisonFieldDto {
}
exports.ComparisonFieldDto = ComparisonFieldDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Field name',
        example: 'cores',
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display label',
        example: 'Number of Cores',
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Field category',
        example: 'Performance',
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Values for each product',
        example: { 'product-1-uuid': 12, 'product-2-uuid': 8 },
    }),
    __metadata("design:type", Object)
], ComparisonFieldDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID with the best value',
        example: 'product-1-uuid',
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "winner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Field type for rendering',
        example: 'number',
        enum: ['text', 'number', 'boolean', 'array', 'price', 'date'],
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit of measurement',
        example: 'cores',
    }),
    __metadata("design:type", String)
], ComparisonFieldDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether higher values are better',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ComparisonFieldDto.prototype, "higherIsBetter", void 0);
class ComparisonMatrixDto {
}
exports.ComparisonMatrixDto = ComparisonMatrixDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison fields organized by category',
        type: Object,
    }),
    __metadata("design:type", Object)
], ComparisonMatrixDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall comparison scores',
        example: { 'product-1-uuid': 0.85, 'product-2-uuid': 0.75 },
    }),
    __metadata("design:type", Object)
], ComparisonMatrixDto.prototype, "scores", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recommendation based on comparison',
        example: 'product-1-uuid',
    }),
    __metadata("design:type", String)
], ComparisonMatrixDto.prototype, "recommendation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reasoning for recommendation',
        example: 'Best performance-to-price ratio',
    }),
    __metadata("design:type", String)
], ComparisonMatrixDto.prototype, "recommendationReason", void 0);
class ProductComparisonResponseDto {
}
exports.ProductComparisonResponseDto = ProductComparisonResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    __metadata("design:type", String)
], ProductComparisonResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Products in comparison',
        type: [ComparisonProductDto],
    }),
    __metadata("design:type", Array)
], ProductComparisonResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison matrix with side-by-side data',
        type: ComparisonMatrixDto,
    }),
    __metadata("design:type", ComparisonMatrixDto)
], ProductComparisonResponseDto.prototype, "comparisonMatrix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison summary statistics',
    }),
    __metadata("design:type", Object)
], ProductComparisonResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Export options available',
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductComparisonResponseDto.prototype, "exportOptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison created/updated timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductComparisonResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Similar products to consider',
        type: [search_dto_1.SearchProductDto],
    }),
    __metadata("design:type", Array)
], ProductComparisonResponseDto.prototype, "similarProducts", void 0);
class ComparisonSummaryDto {
}
exports.ComparisonSummaryDto = ComparisonSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    __metadata("design:type", String)
], ComparisonSummaryDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of products in comparison',
        example: 3,
    }),
    __metadata("design:type", Number)
], ComparisonSummaryDto.prototype, "productCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product names in comparison',
        example: ['Intel Core i7-12700K', 'AMD Ryzen 7 5800X'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ComparisonSummaryDto.prototype, "productNames", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price range of compared products',
    }),
    __metadata("design:type", Object)
], ComparisonSummaryDto.prototype, "priceRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last updated timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ComparisonSummaryDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recommended product ID',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], ComparisonSummaryDto.prototype, "recommendation", void 0);
class ComparisonExportDto {
    constructor() {
        this.includeImages = true;
        this.includePricing = true;
        this.includeAvailability = true;
        this.includeBranding = false;
    }
}
exports.ComparisonExportDto = ComparisonExportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ComparisonExportDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Export format',
        example: 'pdf',
        enum: ['pdf', 'excel', 'csv', 'json'],
    }),
    __metadata("design:type", String)
], ComparisonExportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include images in export',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonExportDto.prototype, "includeImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include pricing information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonExportDto.prototype, "includePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include availability information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonExportDto.prototype, "includeAvailability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom fields to include',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ComparisonExportDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company branding to include',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonExportDto.prototype, "includeBranding", void 0);
class ComparisonShareDto {
    constructor() {
        this.publicShare = false;
        this.expirationDays = 30;
    }
}
exports.ComparisonShareDto = ComparisonShareDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ComparisonShareDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Share with specific users by email',
        example: ['colleague@company.com'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ComparisonShareDto.prototype, "shareWithEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Public sharing (generate shareable link)',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComparisonShareDto.prototype, "publicShare", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Share expiration in days',
        example: 30,
        minimum: 1,
        maximum: 365,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], ComparisonShareDto.prototype, "expirationDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom message for shared comparison',
        example: 'Please review these processor options for our upcoming project',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComparisonShareDto.prototype, "message", void 0);
//# sourceMappingURL=comparison.dto.js.map