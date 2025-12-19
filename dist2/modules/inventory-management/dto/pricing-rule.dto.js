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
exports.PriceCalculationResponseDto = exports.PriceCalculationDto = exports.PricingRuleSearchDto = exports.InventoryPricingRuleListDto = exports.InventoryPricingRuleResponseDto = exports.UpdateInventoryPricingRuleDto = exports.CreateInventoryPricingRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateInventoryPricingRuleDto {
}
exports.CreateInventoryPricingRuleDto = CreateInventoryPricingRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rule name',
        example: 'Bulk Discount 100+',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule description',
        example: '10% discount for orders of 100 or more units',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule priority (higher = applied first)',
        example: 1,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum quantity for rule to apply',
        example: 100,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "minimumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum quantity for rule to apply',
        example: 500,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "maximumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price adjustment amount',
        example: -10,
    }),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "priceAdjustment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: client_1.PriceAdjustmentType,
    }),
    (0, class_validator_1.IsEnum)(client_1.PriceAdjustmentType),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum stock level required for rule to apply',
        example: 50,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "minimumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level for rule to apply',
        example: 1000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryPricingRuleDto.prototype, "maximumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid from date',
        example: '2024-01-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryPricingRuleDto.prototype, "validTo", void 0);
class UpdateInventoryPricingRuleDto {
}
exports.UpdateInventoryPricingRuleDto = UpdateInventoryPricingRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule name',
        example: 'Updated Bulk Discount 100+',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInventoryPricingRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule description',
        example: '15% discount for orders of 100 or more units',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInventoryPricingRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule priority',
        example: 2,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum quantity for rule to apply',
        example: 80,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "minimumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum quantity for rule to apply',
        example: 600,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "maximumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price adjustment amount',
        example: -15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "priceAdjustment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: client_1.PriceAdjustmentType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PriceAdjustmentType),
    __metadata("design:type", String)
], UpdateInventoryPricingRuleDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum stock level required',
        example: 40,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "minimumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level for rule to apply',
        example: 1200,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInventoryPricingRuleDto.prototype, "maximumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid from date',
        example: '2024-02-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInventoryPricingRuleDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInventoryPricingRuleDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the rule is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateInventoryPricingRuleDto.prototype, "isActive", void 0);
class InventoryPricingRuleResponseDto {
}
exports.InventoryPricingRuleResponseDto = InventoryPricingRuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pricing rule ID',
        example: 'pricing-rule-uuid',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rule name',
        example: 'Bulk Discount 100+',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule description',
        example: '10% discount for orders of 100 or more units',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rule priority',
        example: 1,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum quantity for rule to apply',
        example: 100,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "minimumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum quantity for rule to apply',
        example: 500,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "maximumQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price adjustment amount',
        example: -10,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "priceAdjustment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of price adjustment',
        example: 'PERCENTAGE',
        enum: client_1.PriceAdjustmentType,
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum stock level required',
        example: 50,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "minimumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum stock level for rule to apply',
        example: 1000,
    }),
    __metadata("design:type", Number)
], InventoryPricingRuleResponseDto.prototype, "maximumStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid from date',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], InventoryPricingRuleResponseDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rule valid to date',
        example: '2024-12-31T23:59:59Z',
    }),
    __metadata("design:type", Date)
], InventoryPricingRuleResponseDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the rule is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], InventoryPricingRuleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the rule is currently valid (date-based)',
        example: true,
    }),
    __metadata("design:type", Boolean)
], InventoryPricingRuleResponseDto.prototype, "isCurrentlyValid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Inventory item information (if requested)',
    }),
    __metadata("design:type", Object)
], InventoryPricingRuleResponseDto.prototype, "inventoryItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created by user ID',
        example: 'user-uuid',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated by user ID',
        example: 'user-uuid',
    }),
    __metadata("design:type", String)
], InventoryPricingRuleResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryPricingRuleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], InventoryPricingRuleResponseDto.prototype, "updatedAt", void 0);
class InventoryPricingRuleListDto {
}
exports.InventoryPricingRuleListDto = InventoryPricingRuleListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of pricing rules',
        type: [InventoryPricingRuleResponseDto],
    }),
    __metadata("design:type", Array)
], InventoryPricingRuleListDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
    }),
    __metadata("design:type", Object)
], InventoryPricingRuleListDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Summary statistics',
    }),
    __metadata("design:type", Object)
], InventoryPricingRuleListDto.prototype, "summary", void 0);
class PricingRuleSearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.PricingRuleSearchDto = PricingRuleSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Inventory item ID filter',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PricingRuleSearchDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID filter',
        example: 'product-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PricingRuleSearchDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse ID filter',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PricingRuleSearchDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adjustment type filter',
        example: 'PERCENTAGE',
        enum: client_1.PriceAdjustmentType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PriceAdjustmentType),
    __metadata("design:type", String)
], PricingRuleSearchDto.prototype, "adjustmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only active rules',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PricingRuleSearchDto.prototype, "activeOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only currently valid rules (date-based)',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PricingRuleSearchDto.prototype, "currentlyValidOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include inventory item details',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PricingRuleSearchDto.prototype, "includeInventoryItem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PricingRuleSearchDto.prototype, "page", void 0);
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
    __metadata("design:type", Number)
], PricingRuleSearchDto.prototype, "limit", void 0);
class PriceCalculationDto {
}
exports.PriceCalculationDto = PriceCalculationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PriceCalculationDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity for price calculation',
        example: 150,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PriceCalculationDto.prototype, "quantity", void 0);
class PriceCalculationResponseDto {
}
exports.PriceCalculationResponseDto = PriceCalculationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base price per unit',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Final price per unit after rules',
        example: 269.99,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "finalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total price for quantity',
        example: 40498.5,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total discount amount',
        example: 4500.0,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "totalDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount percentage',
        example: 10.0,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Applied pricing rules',
        type: [Object],
    }),
    __metadata("design:type", Array)
], PriceCalculationResponseDto.prototype, "appliedRules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity for calculation',
        example: 150,
    }),
    __metadata("design:type", Number)
], PriceCalculationResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether stock is available for this quantity',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PriceCalculationResponseDto.prototype, "stockAvailable", void 0);
//# sourceMappingURL=pricing-rule.dto.js.map