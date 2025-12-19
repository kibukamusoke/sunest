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
exports.FulfillmentAnalyticsResponseDto = exports.PickListResponseDto = exports.PickListItemDto = exports.FulfillmentListResponseDto = exports.FulfillmentResponseDto = exports.FulfillmentItemResponseDto = exports.FulfillmentFilterDto = exports.RecordPackedItemsDto = exports.RecordPickedItemsDto = exports.AssignFulfillmentDto = exports.UpdateFulfillmentDto = exports.CreateFulfillmentDto = exports.PackedItemDto = exports.PickedItemDto = exports.CreateFulfillmentItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateFulfillmentItemDto {
}
exports.CreateFulfillmentItemDto = CreateFulfillmentItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order item ID',
        example: 'uuid-order-item-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFulfillmentItemDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity to allocate for fulfillment',
        example: 5,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFulfillmentItemDto.prototype, "quantityAllocated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific inventory item ID to use',
        example: 'uuid-inventory-item-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFulfillmentItemDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Picking notes for this item',
        example: 'Located in aisle A-5, shelf 3',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFulfillmentItemDto.prototype, "pickingNotes", void 0);
class PickedItemDto {
}
exports.PickedItemDto = PickedItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fulfillment item ID',
        example: 'uuid-fulfillment-item-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PickedItemDto.prototype, "fulfillmentItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity actually picked',
        example: 5,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PickedItemDto.prototype, "quantityPicked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Picking notes for this item',
        example: 'Item condition excellent',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PickedItemDto.prototype, "pickingNotes", void 0);
class PackedItemDto {
}
exports.PackedItemDto = PackedItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fulfillment item ID',
        example: 'uuid-fulfillment-item-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PackedItemDto.prototype, "fulfillmentItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity actually packed',
        example: 5,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackedItemDto.prototype, "quantityPacked", void 0);
class CreateFulfillmentDto {
}
exports.CreateFulfillmentDto = CreateFulfillmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID to fulfill',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Warehouse ID where fulfillment will occur',
        example: 'uuid-warehouse-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fulfillment priority',
        enum: client_1.FulfillmentPriority,
        example: client_1.FulfillmentPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentPriority),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled fulfillment date/time',
        example: '2024-08-15T09:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Picking instructions/notes',
        example: 'Fragile items - handle with care',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "pickingNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Packing instructions/notes',
        example: 'Use bubble wrap for electronic components',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFulfillmentDto.prototype, "packingNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fulfillment items to allocate',
        type: [CreateFulfillmentItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFulfillmentItemDto),
    __metadata("design:type", Array)
], CreateFulfillmentDto.prototype, "items", void 0);
class UpdateFulfillmentDto {
}
exports.UpdateFulfillmentDto = UpdateFulfillmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fulfillment status',
        enum: client_1.FulfillmentStatus,
        example: client_1.FulfillmentStatus.PICKING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentStatus),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fulfillment priority',
        enum: client_1.FulfillmentPriority,
        example: client_1.FulfillmentPriority.HIGH,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentPriority),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled fulfillment date/time',
        example: '2024-08-15T10:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Picking instructions/notes',
        example: 'Updated: Use cart for heavy items',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "pickingNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Packing instructions/notes',
        example: 'Updated: Customer requested eco-friendly packaging',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFulfillmentDto.prototype, "packingNotes", void 0);
class AssignFulfillmentDto {
}
exports.AssignFulfillmentDto = AssignFulfillmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to assign for picking',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AssignFulfillmentDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assignment notes',
        example: 'Assigned to John - experienced with fragile items',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignFulfillmentDto.prototype, "notes", void 0);
class RecordPickedItemsDto {
}
exports.RecordPickedItemsDto = RecordPickedItemsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Picked items',
        type: [PickedItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickedItemDto),
    __metadata("design:type", Array)
], RecordPickedItemsDto.prototype, "pickedItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'General picking notes',
        example: 'All items picked successfully',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPickedItemsDto.prototype, "notes", void 0);
class RecordPackedItemsDto {
}
exports.RecordPackedItemsDto = RecordPackedItemsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Packed items',
        type: [PackedItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PackedItemDto),
    __metadata("design:type", Array)
], RecordPackedItemsDto.prototype, "packedItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'General packing notes',
        example: 'All items packed securely',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPackedItemsDto.prototype, "notes", void 0);
class FulfillmentFilterDto {
}
exports.FulfillmentFilterDto = FulfillmentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by fulfillment status',
        enum: client_1.FulfillmentStatus,
        example: client_1.FulfillmentStatus.PICKING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentStatus),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by priority',
        enum: client_1.FulfillmentPriority,
        example: client_1.FulfillmentPriority.HIGH,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentPriority),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by warehouse ID',
        example: 'uuid-warehouse-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by assigned user ID',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by order ID',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter fulfillments scheduled after date',
        example: '2024-08-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "scheduledAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter fulfillments scheduled before date',
        example: '2024-08-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "scheduledBefore", void 0);
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
], FulfillmentFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], FulfillmentFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'scheduledAt',
        enum: ['scheduledAt', 'createdAt', 'priority', 'status'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'asc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FulfillmentFilterDto.prototype, "sortOrder", void 0);
class FulfillmentItemResponseDto {
}
exports.FulfillmentItemResponseDto = FulfillmentItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment item ID' }),
    __metadata("design:type", String)
], FulfillmentItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order item information' }),
    __metadata("design:type", Object)
], FulfillmentItemResponseDto.prototype, "orderItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity allocated' }),
    __metadata("design:type", Number)
], FulfillmentItemResponseDto.prototype, "quantityAllocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity picked' }),
    __metadata("design:type", Number)
], FulfillmentItemResponseDto.prototype, "quantityPicked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity packed' }),
    __metadata("design:type", Number)
], FulfillmentItemResponseDto.prototype, "quantityPacked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inventory item used' }),
    __metadata("design:type", Object)
], FulfillmentItemResponseDto.prototype, "inventoryItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item status', enum: client_1.FulfillmentItemStatus }),
    __metadata("design:type", String)
], FulfillmentItemResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Picking notes' }),
    __metadata("design:type", String)
], FulfillmentItemResponseDto.prototype, "pickingNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], FulfillmentItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], FulfillmentItemResponseDto.prototype, "updatedAt", void 0);
class FulfillmentResponseDto {
}
exports.FulfillmentResponseDto = FulfillmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment ID' }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment number' }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "fulfillmentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], FulfillmentResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Warehouse information' }),
    __metadata("design:type", Object)
], FulfillmentResponseDto.prototype, "warehouse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment status', enum: client_1.FulfillmentStatus }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority', enum: client_1.FulfillmentPriority }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled date/time' }),
    __metadata("design:type", Date)
], FulfillmentResponseDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Started date/time' }),
    __metadata("design:type", Date)
], FulfillmentResponseDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Completed date/time' }),
    __metadata("design:type", Date)
], FulfillmentResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned user' }),
    __metadata("design:type", Object)
], FulfillmentResponseDto.prototype, "assignedUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Picking notes' }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "pickingNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Packing notes' }),
    __metadata("design:type", String)
], FulfillmentResponseDto.prototype, "packingNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fulfillment items',
        type: [FulfillmentItemResponseDto],
    }),
    __metadata("design:type", Array)
], FulfillmentResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], FulfillmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], FulfillmentResponseDto.prototype, "updatedAt", void 0);
class FulfillmentListResponseDto {
}
exports.FulfillmentListResponseDto = FulfillmentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillments', type: [FulfillmentResponseDto] }),
    __metadata("design:type", Array)
], FulfillmentListResponseDto.prototype, "fulfillments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of fulfillments matching filter' }),
    __metadata("design:type", Number)
], FulfillmentListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], FulfillmentListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], FulfillmentListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], FulfillmentListResponseDto.prototype, "totalPages", void 0);
class PickListItemDto {
}
exports.PickListItemDto = PickListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment item ID' }),
    __metadata("design:type", String)
], PickListItemDto.prototype, "fulfillmentItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product information' }),
    __metadata("design:type", Object)
], PickListItemDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product variant' }),
    __metadata("design:type", Object)
], PickListItemDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity to pick' }),
    __metadata("design:type", Number)
], PickListItemDto.prototype, "quantityToPick", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inventory location' }),
    __metadata("design:type", Object)
], PickListItemDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Picking instructions' }),
    __metadata("design:type", String)
], PickListItemDto.prototype, "pickingNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item priority' }),
    __metadata("design:type", String)
], PickListItemDto.prototype, "priority", void 0);
class PickListResponseDto {
}
exports.PickListResponseDto = PickListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment ID' }),
    __metadata("design:type", String)
], PickListResponseDto.prototype, "fulfillmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment number' }),
    __metadata("design:type", String)
], PickListResponseDto.prototype, "fulfillmentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], PickListResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Warehouse information' }),
    __metadata("design:type", Object)
], PickListResponseDto.prototype, "warehouse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items to pick', type: [PickListItemDto] }),
    __metadata("design:type", Array)
], PickListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Picking priority', enum: client_1.FulfillmentPriority }),
    __metadata("design:type", String)
], PickListResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions' }),
    __metadata("design:type", String)
], PickListResponseDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated at' }),
    __metadata("design:type", Date)
], PickListResponseDto.prototype, "generatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned picker' }),
    __metadata("design:type", Object)
], PickListResponseDto.prototype, "assignedPicker", void 0);
class FulfillmentAnalyticsResponseDto {
}
exports.FulfillmentAnalyticsResponseDto = FulfillmentAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total fulfillments' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "totalFulfillments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillments by status' }),
    __metadata("design:type", Object)
], FulfillmentAnalyticsResponseDto.prototype, "fulfillmentsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillments by priority' }),
    __metadata("design:type", Object)
], FulfillmentAnalyticsResponseDto.prototype, "fulfillmentsByPriority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average pick time (minutes)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "averagePickTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average pack time (minutes)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "averagePackTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average total fulfillment time (hours)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "averageFulfillmentTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pick accuracy rate (percentage)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "pickAccuracyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'On-time fulfillment rate (percentage)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "onTimeFulfillmentRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per hour (productivity)' }),
    __metadata("design:type", Number)
], FulfillmentAnalyticsResponseDto.prototype, "itemsPerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Most productive picker' }),
    __metadata("design:type", Object)
], FulfillmentAnalyticsResponseDto.prototype, "topPicker", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    __metadata("design:type", Date)
], FulfillmentAnalyticsResponseDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    __metadata("design:type", Date)
], FulfillmentAnalyticsResponseDto.prototype, "periodEnd", void 0);
//# sourceMappingURL=fulfillment-fixed.dto.js.map