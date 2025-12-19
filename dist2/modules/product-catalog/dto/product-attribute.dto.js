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
exports.AttributeFilterDto = exports.ProductAttributeValueDto = exports.AttributeValueDto = exports.BulkCreateAttributeTemplatesDto = exports.ProductAttributeTemplateListDto = exports.ProductAttributeTemplateResponseDto = exports.UpdateProductAttributeTemplateDto = exports.CreateProductAttributeTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateProductAttributeTemplateDto {
}
exports.CreateProductAttributeTemplateDto = CreateProductAttributeTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute name (internal identifier)',
        example: 'processor_cores',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the attribute',
        example: 'Number of Cores',
        maxLength: 150,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute description',
        example: 'Total number of processor cores',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute type',
        example: 'NUMBER',
        enum: client_1.AttributeType,
    }),
    (0, class_validator_1.IsEnum)(client_1.AttributeType),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute is required',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductAttributeTemplateDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute can be used for filtering',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductAttributeTemplateDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute can be used for product variants',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductAttributeTemplateDto.prototype, "isVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Possible options for SELECT/MULTI_SELECT types',
        example: ['2', '4', '6', '8', '12', '16'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateProductAttributeTemplateDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules as JSON string',
        example: '{"min": 1, "max": 128}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID this attribute template belongs to',
        example: 'processors-category-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order for display',
        example: 1,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductAttributeTemplateDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Measurement unit for the attribute',
        example: 'cores',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateProductAttributeTemplateDto.prototype, "unit", void 0);
class UpdateProductAttributeTemplateDto {
}
exports.UpdateProductAttributeTemplateDto = UpdateProductAttributeTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the attribute',
        example: 'Number of Cores',
        maxLength: 150,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateProductAttributeTemplateDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute description',
        example: 'Total number of processor cores',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateProductAttributeTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute type',
        example: 'NUMBER',
        enum: client_1.AttributeType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AttributeType),
    __metadata("design:type", String)
], UpdateProductAttributeTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute is required',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductAttributeTemplateDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute can be used for filtering',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductAttributeTemplateDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute can be used for product variants',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductAttributeTemplateDto.prototype, "isVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Possible options for SELECT/MULTI_SELECT types',
        example: ['2', '4', '6', '8', '12', '16'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProductAttributeTemplateDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules as JSON string',
        example: '{"min": 1, "max": 128}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductAttributeTemplateDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order for display',
        example: 1,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductAttributeTemplateDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Measurement unit for the attribute',
        example: 'cores',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateProductAttributeTemplateDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the attribute template is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductAttributeTemplateDto.prototype, "isActive", void 0);
class ProductAttributeTemplateResponseDto {
}
exports.ProductAttributeTemplateResponseDto = ProductAttributeTemplateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute template ID',
        example: 'attribute-uuid',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute name',
        example: 'processor_cores',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the attribute',
        example: 'Number of Cores',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute description',
        example: 'Total number of processor cores',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute type',
        example: 'NUMBER',
        enum: client_1.AttributeType,
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this attribute is required',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductAttributeTemplateResponseDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this attribute can be used for filtering',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductAttributeTemplateResponseDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this attribute can be used for product variants',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductAttributeTemplateResponseDto.prototype, "isVariant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Possible options for SELECT/MULTI_SELECT types',
        example: ['2', '4', '6', '8', '12', '16'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductAttributeTemplateResponseDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules as JSON object',
        example: { min: 1, max: 128 },
    }),
    __metadata("design:type", Object)
], ProductAttributeTemplateResponseDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID this attribute template belongs to',
        example: 'processors-category-id',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort order for display',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductAttributeTemplateResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Measurement unit for the attribute',
        example: 'cores',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the attribute template is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductAttributeTemplateResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category information (if requested)',
    }),
    __metadata("design:type", Object)
], ProductAttributeTemplateResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of parent category this attribute was inherited from (if applicable)',
        example: 'Electronics',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "inheritedFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created by user ID',
        example: 'admin-user-id',
    }),
    __metadata("design:type", String)
], ProductAttributeTemplateResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductAttributeTemplateResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ProductAttributeTemplateResponseDto.prototype, "updatedAt", void 0);
class ProductAttributeTemplateListDto {
}
exports.ProductAttributeTemplateListDto = ProductAttributeTemplateListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of attribute templates',
        type: [ProductAttributeTemplateResponseDto],
    }),
    __metadata("design:type", Array)
], ProductAttributeTemplateListDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of attribute templates',
        example: 15,
    }),
    __metadata("design:type", Number)
], ProductAttributeTemplateListDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of active attribute templates',
        example: 12,
    }),
    __metadata("design:type", Number)
], ProductAttributeTemplateListDto.prototype, "activeCount", void 0);
class BulkCreateAttributeTemplatesDto {
}
exports.BulkCreateAttributeTemplatesDto = BulkCreateAttributeTemplatesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of attribute templates to create',
        type: [CreateProductAttributeTemplateDto],
    }),
    __metadata("design:type", Array)
], BulkCreateAttributeTemplatesDto.prototype, "attributes", void 0);
class AttributeValueDto {
}
exports.AttributeValueDto = AttributeValueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute template ID',
        example: 'attribute-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttributeValueDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attribute value',
        example: '8',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttributeValueDto.prototype, "value", void 0);
class ProductAttributeValueDto {
}
exports.ProductAttributeValueDto = ProductAttributeValueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProductAttributeValueDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of attribute values for the product',
        type: [AttributeValueDto],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ProductAttributeValueDto.prototype, "attributes", void 0);
class AttributeFilterDto {
}
exports.AttributeFilterDto = AttributeFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID to filter attributes',
        example: 'category-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttributeFilterDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attribute type filter',
        enum: client_1.AttributeType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AttributeType),
    __metadata("design:type", String)
], AttributeFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by required attributes only',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AttributeFilterDto.prototype, "requiredOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by filterable attributes only',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AttributeFilterDto.prototype, "filterableOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by variant attributes only',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AttributeFilterDto.prototype, "variantOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active attributes only',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AttributeFilterDto.prototype, "activeOnly", void 0);
//# sourceMappingURL=product-attribute.dto.js.map