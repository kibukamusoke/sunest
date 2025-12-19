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
exports.GenerateVariantsDto = exports.VariantAttributeDto = exports.BulkUpdateVariantsDto = exports.BulkCreateVariantsDto = exports.ProductVariantListDto = exports.ProductVariantResponseDto = exports.UpdateProductVariantDto = exports.CreateProductVariantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateProductVariantDto {
}
exports.CreateProductVariantDto = CreateProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant SKU (must be unique)',
        example: 'INTEL-i7-12700K-TRAY',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant name',
        example: 'Tray Version',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant attributes as JSON string',
        example: '{"packaging": "tray", "warranty": "1-year"}',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific price (overrides product base price)',
        example: 279.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific cost price',
        example: 230.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant weight in kg',
        example: 0.15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant barcode',
        example: '5032037234068',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant Manufacturer Part Number',
        example: 'CM8071504553828',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific images URLs',
        example: ['https://example.com/intel-i7-tray.jpg'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], CreateProductVariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity for this variant',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order multiple for this variant',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is the default variant',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductVariantDto.prototype, "isDefault", void 0);
class UpdateProductVariantDto {
}
exports.UpdateProductVariantDto = UpdateProductVariantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant name',
        example: 'Tray Version',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant attributes as JSON string',
        example: '{"packaging": "tray", "warranty": "2-year"}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific price (overrides product base price)',
        example: 279.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific cost price',
        example: 230.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant weight in kg',
        example: 0.15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant barcode',
        example: '5032037234068',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant Manufacturer Part Number',
        example: 'CM8071504553828',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific images URLs',
        example: ['https://example.com/intel-i7-tray.jpg'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateProductVariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity for this variant',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order multiple for this variant',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the variant is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductVariantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is the default variant',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductVariantDto.prototype, "isDefault", void 0);
class ProductVariantResponseDto {
}
exports.ProductVariantResponseDto = ProductVariantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant ID',
        example: 'variant-uuid',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID this variant belongs to',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant SKU',
        example: 'INTEL-i7-12700K-TRAY',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant name',
        example: 'Tray Version',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant attributes as JSON object',
        example: { packaging: 'tray', warranty: '1-year' },
    }),
    __metadata("design:type", Object)
], ProductVariantResponseDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific price',
        example: 279.99,
    }),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant-specific cost price',
        example: 230.0,
    }),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant weight in kg',
        example: 0.15,
    }),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant barcode',
        example: '5032037234068',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant Manufacturer Part Number',
        example: 'CM8071504553828',
    }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant-specific images URLs',
        example: ['https://example.com/intel-i7-tray.jpg'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductVariantResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum order quantity for this variant',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order multiple for this variant',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the variant is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductVariantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is the default variant',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductVariantResponseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product information (if requested)',
    }),
    __metadata("design:type", Object)
], ProductVariantResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductVariantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductVariantResponseDto.prototype, "updatedAt", void 0);
class ProductVariantListDto {
}
exports.ProductVariantListDto = ProductVariantListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of product variants',
        type: [ProductVariantResponseDto],
    }),
    __metadata("design:type", Array)
], ProductVariantListDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of variants for the product',
        example: 3,
    }),
    __metadata("design:type", Number)
], ProductVariantListDto.prototype, "totalCount", void 0);
class BulkCreateVariantsDto {
}
exports.BulkCreateVariantsDto = BulkCreateVariantsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of variant data to create',
        type: [CreateProductVariantDto],
    }),
    __metadata("design:type", Array)
], BulkCreateVariantsDto.prototype, "variants", void 0);
class BulkUpdateVariantsDto {
}
exports.BulkUpdateVariantsDto = BulkUpdateVariantsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of variant updates with IDs',
        type: [Object],
    }),
    __metadata("design:type", Array)
], BulkUpdateVariantsDto.prototype, "variants", void 0);
class VariantAttributeDto {
}
exports.VariantAttributeDto = VariantAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute name',
        example: 'color',
    }),
    __metadata("design:type", String)
], VariantAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute display name',
        example: 'Color',
    }),
    __metadata("design:type", String)
], VariantAttributeDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Possible attribute values',
        example: ['Red', 'Blue', 'Green'],
        type: [String],
    }),
    __metadata("design:type", Array)
], VariantAttributeDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this attribute is required for variants',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VariantAttributeDto.prototype, "required", void 0);
class GenerateVariantsDto {
}
exports.GenerateVariantsDto = GenerateVariantsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attributes to generate variants from',
        type: [VariantAttributeDto],
    }),
    __metadata("design:type", Array)
], GenerateVariantsDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base SKU pattern (will append variant suffix)',
        example: 'INTEL-i7-12700K',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateVariantsDto.prototype, "baseSkuPattern", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to set first variant as default',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GenerateVariantsDto.prototype, "setFirstAsDefault", void 0);
//# sourceMappingURL=product-variant.dto.js.map