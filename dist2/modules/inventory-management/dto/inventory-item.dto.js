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
exports.BulkInventoryUpdateDto = exports.InventorySearchDto = exports.InventoryItemListDto = exports.InventoryItemResponseDto = exports.UpdateInventoryItemDto = exports.CreateInventoryItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInventoryItemDto {
}
exports.CreateInventoryItemDto = CreateInventoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant ID (optional)',
        example: 'variant-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "productVariantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Initial quantity on hand',
        example: 100,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "quantityOnHand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum stock level (reorder point)',
        example: 10,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "minimumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level',
        example: 500,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "maximumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reorder quantity',
        example: 100,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "reorderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time in days',
        example: 14,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average cost per unit',
        example: 299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "averageCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase cost per unit',
        example: 295.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "lastPurchaseCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase date',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "lastPurchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Batch number for lot tracking',
        example: 'BATCH-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date for perishable items',
        example: '2025-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturing date',
        example: '2024-01-01T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "manufacturingDate", void 0);
class UpdateInventoryItemDto {
}
exports.UpdateInventoryItemDto = UpdateInventoryItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity on hand',
        example: 150,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "quantityOnHand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity reserved',
        example: 20,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "quantityReserved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity committed',
        example: 10,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "quantityCommitted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum stock level',
        example: 15,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "minimumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level',
        example: 600,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "maximumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reorder quantity',
        example: 120,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "reorderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time in days',
        example: 12,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Average cost per unit',
        example: 305.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "averageCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase cost per unit',
        example: 300.0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "lastPurchaseCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase date',
        example: '2024-01-20T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInventoryItemDto.prototype, "lastPurchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the inventory item is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateInventoryItemDto.prototype, "isActive", void 0);
class InventoryItemResponseDto {
}
exports.InventoryItemResponseDto = InventoryItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant ID',
        example: 'variant-uuid',
    }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "productVariantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity on hand',
        example: 150,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "quantityOnHand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity reserved',
        example: 20,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "quantityReserved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity available (calculated)',
        example: 130,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "quantityAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity committed',
        example: 10,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "quantityCommitted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum stock level',
        example: 15,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "minimumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level',
        example: 600,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "maximumStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reorder quantity',
        example: 120,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "reorderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time in days',
        example: 12,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average cost per unit',
        example: 305.99,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "averageCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase cost per unit',
        example: 300.0,
    }),
    __metadata("design:type", Number)
], InventoryItemResponseDto.prototype, "lastPurchaseCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last purchase date',
        example: '2024-01-20T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "lastPurchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Batch number',
        example: 'BATCH-2024-001',
    }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date',
        example: '2025-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturing date',
        example: '2024-01-01T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "manufacturingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the item is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], InventoryItemResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether stock is below minimum threshold',
        example: false,
    }),
    __metadata("design:type", Boolean)
], InventoryItemResponseDto.prototype, "isLowStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether item is out of stock',
        example: false,
    }),
    __metadata("design:type", Boolean)
], InventoryItemResponseDto.prototype, "isOutOfStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product information (if requested)',
    }),
    __metadata("design:type", Object)
], InventoryItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant information (if requested)',
    }),
    __metadata("design:type", Object)
], InventoryItemResponseDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse information (if requested)',
    }),
    __metadata("design:type", Object)
], InventoryItemResponseDto.prototype, "warehouse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last count date',
        example: '2024-01-10T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "lastCountDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Last count performed by user ID',
        example: 'user-uuid',
    }),
    __metadata("design:type", String)
], InventoryItemResponseDto.prototype, "lastCountBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryItemResponseDto.prototype, "updatedAt", void 0);
class InventoryItemListDto {
}
exports.InventoryItemListDto = InventoryItemListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of inventory items',
        type: [InventoryItemResponseDto],
    }),
    __metadata("design:type", Array)
], InventoryItemListDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
    }),
    __metadata("design:type", Object)
], InventoryItemListDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Summary statistics',
    }),
    __metadata("design:type", Object)
], InventoryItemListDto.prototype, "summary", void 0);
class InventorySearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.InventorySearchDto = InventorySearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query (product name, SKU, batch)',
        example: 'Intel i7',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventorySearchDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID filter',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InventorySearchDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only low stock items',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InventorySearchDto.prototype, "lowStockOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only out of stock items',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InventorySearchDto.prototype, "outOfStockOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only active items',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InventorySearchDto.prototype, "activeOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include product information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InventorySearchDto.prototype, "includeProduct", void 0);
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
], InventorySearchDto.prototype, "page", void 0);
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
], InventorySearchDto.prototype, "limit", void 0);
class BulkInventoryUpdateDto {
}
exports.BulkInventoryUpdateDto = BulkInventoryUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of inventory updates',
        type: [Object],
    }),
    __metadata("design:type", Array)
], BulkInventoryUpdateDto.prototype, "updates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for bulk update',
        example: 'Weekly inventory sync',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkInventoryUpdateDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason code',
        example: 'BULK_SYNC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkInventoryUpdateDto.prototype, "reasonCode", void 0);
//# sourceMappingURL=inventory-item.dto.js.map