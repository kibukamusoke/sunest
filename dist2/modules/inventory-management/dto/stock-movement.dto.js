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
exports.StockAdjustmentDto = exports.CreateStockTransferDto = exports.StockMovementSearchDto = exports.StockMovementListDto = exports.StockMovementResponseDto = exports.CreateStockMovementDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateStockMovementDto {
}
exports.CreateStockMovementDto = CreateStockMovementDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of stock movement',
        example: 'RECEIPT',
        enum: client_1.StockMovementType,
    }),
    (0, class_validator_1.IsEnum)(client_1.StockMovementType),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity change (positive for increases, negative for decreases)',
        example: 100,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateStockMovementDto.prototype, "quantityChange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for the movement',
        example: 'Goods received from supplier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Standardized reason code',
        example: 'SUPPLIER_RECEIPT',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference number (PO, order, transfer)',
        example: 'PO-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit cost for this movement',
        example: 299.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateStockMovementDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source warehouse ID for transfers',
        example: 'source-warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "sourceWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination warehouse ID for transfers',
        example: 'destination-warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "destinationWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Related order ID',
        example: 'order-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Related transfer ID',
        example: 'transfer-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "transferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Damaged items found during receipt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMovementDto.prototype, "notes", void 0);
class StockMovementResponseDto {
}
exports.StockMovementResponseDto = StockMovementResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock movement ID',
        example: 'movement-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of stock movement',
        example: 'RECEIPT',
        enum: client_1.StockMovementType,
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for the movement',
        example: 'Goods received from supplier',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Standardized reason code',
        example: 'SUPPLIER_RECEIPT',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference number',
        example: 'PO-2024-001',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity before movement',
        example: 50,
    }),
    __metadata("design:type", Number)
], StockMovementResponseDto.prototype, "quantityBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity change',
        example: 100,
    }),
    __metadata("design:type", Number)
], StockMovementResponseDto.prototype, "quantityChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity after movement',
        example: 150,
    }),
    __metadata("design:type", Number)
], StockMovementResponseDto.prototype, "quantityAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit cost for this movement',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], StockMovementResponseDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total cost for this movement',
        example: 29999.0,
    }),
    __metadata("design:type", Number)
], StockMovementResponseDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source warehouse ID',
        example: 'source-warehouse-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "sourceWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination warehouse ID',
        example: 'destination-warehouse-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "destinationWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Related order ID',
        example: 'order-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Related transfer ID',
        example: 'transfer-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "transferId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the movement',
        example: 'user-uuid',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the movement was performed',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], StockMovementResponseDto.prototype, "performedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Damaged items found during receipt',
    }),
    __metadata("design:type", String)
], StockMovementResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Inventory item information (if requested)',
    }),
    __metadata("design:type", Object)
], StockMovementResponseDto.prototype, "inventoryItem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source warehouse information (if requested)',
    }),
    __metadata("design:type", Object)
], StockMovementResponseDto.prototype, "sourceWarehouse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination warehouse information (if requested)',
    }),
    __metadata("design:type", Object)
], StockMovementResponseDto.prototype, "destinationWarehouse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who performed the movement (if requested)',
    }),
    __metadata("design:type", Object)
], StockMovementResponseDto.prototype, "performedByUser", void 0);
class StockMovementListDto {
}
exports.StockMovementListDto = StockMovementListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of stock movements',
        type: [StockMovementResponseDto],
    }),
    __metadata("design:type", Array)
], StockMovementListDto.prototype, "movements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
    }),
    __metadata("design:type", Object)
], StockMovementListDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Summary statistics',
    }),
    __metadata("design:type", Object)
], StockMovementListDto.prototype, "summary", void 0);
class StockMovementSearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.StockMovementSearchDto = StockMovementSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Inventory item ID filter',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Movement type filter',
        example: 'RECEIPT',
        enum: client_1.StockMovementType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StockMovementType),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order ID filter',
        example: 'order-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID filter',
        example: 'user-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date filter',
        example: '2024-01-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date filter',
        example: '2024-01-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StockMovementSearchDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include inventory item details',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], StockMovementSearchDto.prototype, "includeInventoryItem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include user details',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], StockMovementSearchDto.prototype, "includeUser", void 0);
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
], StockMovementSearchDto.prototype, "page", void 0);
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
], StockMovementSearchDto.prototype, "limit", void 0);
class CreateStockTransferDto {
}
exports.CreateStockTransferDto = CreateStockTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source warehouse ID',
        example: 'source-warehouse-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockTransferDto.prototype, "sourceWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination warehouse ID',
        example: 'destination-warehouse-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockTransferDto.prototype, "destinationWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items to transfer',
        type: [Object],
    }),
    __metadata("design:type", Array)
], CreateStockTransferDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Transfer reference number',
        example: 'TRANSFER-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockTransferDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Transfer notes',
        example: 'Quarterly stock rebalancing',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockTransferDto.prototype, "notes", void 0);
class StockAdjustmentDto {
}
exports.StockAdjustmentDto = StockAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inventory item ID',
        example: 'inventory-item-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New quantity on hand',
        example: 85,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StockAdjustmentDto.prototype, "newQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for adjustment',
        example: 'Cycle count adjustment',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason code',
        example: 'CYCLE_COUNT',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Physical count completed on 2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "notes", void 0);
//# sourceMappingURL=stock-movement.dto.js.map