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
exports.ProductSearchDto = exports.ProductListDto = exports.ProductResponseDto = exports.UpdateProductDto = exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Intel Core i7-12700K',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the product',
        example: 'Intel Core i7-12700K Desktop Processor',
        maxLength: 250,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250),
    __metadata("design:type", String)
], CreateProductDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed product description',
        example: '12th Gen Intel Core i7-12700K desktop processor with 12 cores and 20 threads...',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short product description for listings',
        example: 'High-performance 12-core desktop processor',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product SKU (Stock Keeping Unit)',
        example: 'INTEL-i7-12700K',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product barcode',
        example: '5032037234051',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Part Number',
        example: 'BX8071512700K',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: 'processors-category-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product brand',
        example: 'Intel',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'Core i7-12700K',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product weight in kg',
        example: 0.2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product dimensions as JSON string',
        example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base product price',
        example: 299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Suggested Retail Price',
        example: 349.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "msrp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant cost price',
        example: 250.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images URLs',
        example: [
            'https://example.com/intel-i7-front.jpg',
            'https://example.com/intel-i7-back.jpg',
        ],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product videos URLs',
        example: ['https://example.com/intel-i7-demo.mp4'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product documents URLs',
        example: ['https://example.com/intel-i7-specs.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the product is digital',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isDigital", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to track inventory for this product',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "trackInventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order multiple (must order in multiples of this number)',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product URL slug',
        example: 'intel-core-i7-12700k',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product tags for search',
        example: ['intel', 'processor', 'desktop', '12th-gen'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta title',
        example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta description',
        example: 'Buy Intel Core i7-12700K 12-core desktop processor online at Hardware World',
        maxLength: 300,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaDescription", void 0);
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product name',
        example: 'Intel Core i7-12700K',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the product',
        example: 'Intel Core i7-12700K Desktop Processor',
        maxLength: 250,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed product description',
        example: '12th Gen Intel Core i7-12700K desktop processor with 12 cores and 20 threads...',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short product description for listings',
        example: 'High-performance 12-core desktop processor',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product barcode',
        example: '5032037234051',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Part Number',
        example: 'BX8071512700K',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID',
        example: 'processors-category-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product brand',
        example: 'Intel',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'Core i7-12700K',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product weight in kg',
        example: 0.2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product dimensions as JSON string',
        example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base product price',
        example: 299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Suggested Retail Price',
        example: 349.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "msrp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant cost price',
        example: 250.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseFloat(value) : value),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images URLs',
        example: [
            'https://example.com/intel-i7-front.jpg',
            'https://example.com/intel-i7-back.jpg',
        ],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product videos URLs',
        example: ['https://example.com/intel-i7-demo.mp4'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product documents URLs',
        example: ['https://example.com/intel-i7-specs.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product status',
        example: 'PUBLISHED',
        enum: client_1.ProductStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProductStatus),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the product is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the product is digital',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isDigital", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to track inventory for this product',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "trackInventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order multiple (must order in multiples of this number)',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product URL slug',
        example: 'intel-core-i7-12700k',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product tags for search',
        example: ['intel', 'processor', 'desktop', '12th-gen'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta title',
        example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta description',
        example: 'Buy Intel Core i7-12700K 12-core desktop processor online at Hardware World',
        maxLength: 300,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "metaDescription", void 0);
class ProductResponseDto {
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Intel Core i7-12700K',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the product',
        example: 'Intel Core i7-12700K Desktop Processor',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed product description',
        example: '12th Gen Intel Core i7-12700K desktop processor...',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short product description for listings',
        example: 'High-performance 12-core desktop processor',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product SKU',
        example: 'INTEL-i7-12700K',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product barcode',
        example: '5032037234051',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Part Number',
        example: 'BX8071512700K',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "mpn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: 'processors-category-id',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant ID',
        example: 'merchant-uuid',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product brand',
        example: 'Intel',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'Core i7-12700K',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product weight in kg',
        example: 0.2,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product dimensions as JSON string',
        example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base product price',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer Suggested Retail Price',
        example: 349.99,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "msrp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant cost price',
        example: 250.0,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product images URLs',
        example: ['https://example.com/intel-i7-front.jpg'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product videos URLs',
        example: ['https://example.com/intel-i7-demo.mp4'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product documents URLs',
        example: ['https://example.com/intel-i7-specs.pdf'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product status',
        example: 'PUBLISHED',
        enum: client_1.ProductStatus,
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the product is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the product is digital',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isDigital", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to track inventory for this product',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "trackInventory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum order quantity',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "minimumOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order multiple',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "orderMultiple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product URL slug',
        example: 'intel-core-i7-12700k',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product tags for search',
        example: ['intel', 'processor', 'desktop', '12th-gen'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta title',
        example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SEO meta description',
        example: 'Buy Intel Core i7-12700K 12-core desktop processor online',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category information (if requested)',
    }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant information (if requested)',
    }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variants (if requested)',
        type: [Object],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created by user ID',
        example: 'merchant-user-id',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated by user ID',
        example: 'merchant-user-id',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "updatedAt", void 0);
class ProductListDto {
}
exports.ProductListDto = ProductListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of products',
        type: [ProductResponseDto],
    }),
    __metadata("design:type", Array)
], ProductListDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
    }),
    __metadata("design:type", Object)
], ProductListDto.prototype, "pagination", void 0);
class ProductSearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.sortBy = 'createdAt';
        this.sortOrder = 'desc';
    }
}
exports.ProductSearchDto = ProductSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query',
        example: 'Intel processor',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID filter',
        example: 'processors-category-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant ID filter',
        example: 'merchant-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product status filter',
        example: 'PUBLISHED',
        enum: client_1.ProductStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProductStatus),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand filter',
        example: 'Intel',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum price filter',
        example: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum price filter',
        example: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags filter (comma-separated)',
        example: 'intel,desktop',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "tags", void 0);
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
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ProductSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ['name', 'basePrice', 'createdAt', 'updatedAt'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSearchDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=product.dto.js.map