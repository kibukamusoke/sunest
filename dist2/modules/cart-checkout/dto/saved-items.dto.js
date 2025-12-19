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
exports.SavedItemsListDto = exports.SavedItemsFilterDto = exports.SavedListResponseDto = exports.UpdateSavedListDto = exports.CreateSavedListDto = exports.SavedItemResponseDto = exports.BulkAddSavedItemsToCartDto = exports.AddSavedItemToCartDto = exports.UpdateSavedItemDto = exports.CreateSavedItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSavedItemDto {
}
exports.CreateSavedItemDto = CreateSavedItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID to save',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSavedItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant ID to save',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSavedItemDto.prototype, "productVariantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom name for the saved item',
        example: 'High-Efficiency Motor for Line 3',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the saved item',
        example: 'Need to verify voltage requirements before ordering',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity to save',
        example: 3,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreateSavedItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price when saved (for tracking price changes)',
        example: 299.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSavedItemDto.prototype, "savedPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List name to save item to',
        example: 'Q4 Equipment Needs',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedItemDto.prototype, "listName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for organization',
        type: [String],
        example: ['motors', 'high-priority', 'line-3'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSavedItemDto.prototype, "tags", void 0);
class UpdateSavedItemDto {
}
exports.UpdateSavedItemDto = UpdateSavedItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated custom name',
        example: 'High-Efficiency Motor for Line 3 - Updated Specs',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated notes',
        example: 'Confirmed 240V requirement with engineering team',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated quantity',
        example: 5,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], UpdateSavedItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated saved price',
        example: 279.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateSavedItemDto.prototype, "savedPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated list name',
        example: 'Q4 Equipment Needs - Priority Items',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedItemDto.prototype, "listName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated tags',
        type: [String],
        example: ['motors', 'urgent', 'line-3', 'approved'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSavedItemDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether item is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSavedItemDto.prototype, "isActive", void 0);
class AddSavedItemToCartDto {
}
exports.AddSavedItemToCartDto = AddSavedItemToCartDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity to add to cart (defaults to saved quantity)',
        example: 2,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], AddSavedItemToCartDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes for the cart item',
        example: 'Adding from saved list - verify availability',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddSavedItemToCartDto.prototype, "notes", void 0);
class BulkAddSavedItemsToCartDto {
}
exports.BulkAddSavedItemsToCartDto = BulkAddSavedItemsToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of saved item IDs to add to cart',
        type: [String],
        example: ['clh1234567890', 'clh0987654321'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BulkAddSavedItemsToCartDto.prototype, "savedItemIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to use saved quantities or custom quantities',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkAddSavedItemsToCartDto.prototype, "useSavedQuantities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom quantities for each item (if useSavedQuantities is false)',
        type: [Number],
        example: [2, 5, 1],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsPositive)({ each: true }),
    __metadata("design:type", Array)
], BulkAddSavedItemsToCartDto.prototype, "customQuantities", void 0);
class SavedItemResponseDto {
}
exports.SavedItemResponseDto = SavedItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saved item ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who saved the item',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product information',
    }),
    __metadata("design:type", Object)
], SavedItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant information',
    }),
    __metadata("design:type", Object)
], SavedItemResponseDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom name for the saved item',
        example: 'High-Efficiency Motor for Line 3',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the saved item',
        example: 'Need to verify voltage requirements before ordering',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saved quantity',
        example: 3,
    }),
    __metadata("design:type", Number)
], SavedItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price when saved',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], SavedItemResponseDto.prototype, "savedPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current price (for comparison)',
        example: 279.99,
    }),
    __metadata("design:type", Number)
], SavedItemResponseDto.prototype, "currentPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price change since saved',
        example: -20.0,
    }),
    __metadata("design:type", Number)
], SavedItemResponseDto.prototype, "priceChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price change percentage',
        example: -6.67,
    }),
    __metadata("design:type", Number)
], SavedItemResponseDto.prototype, "priceChangePercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List name',
        example: 'Q4 Equipment Needs',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "listName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tags for organization',
        type: [String],
        example: ['motors', 'high-priority', 'line-3'],
    }),
    __metadata("design:type", Array)
], SavedItemResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether item is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SavedItemResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether product is currently available',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SavedItemResponseDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Availability message',
        example: 'In stock - 12 available',
    }),
    __metadata("design:type", String)
], SavedItemResponseDto.prototype, "availabilityMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], SavedItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], SavedItemResponseDto.prototype, "updatedAt", void 0);
class CreateSavedListDto {
}
exports.CreateSavedListDto = CreateSavedListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the saved list',
        example: 'Q4 Equipment Procurement',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedListDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the list',
        example: 'Equipment needed for Q4 production line expansion',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedListDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for the list',
        type: [String],
        example: ['q4', 'production', 'expansion'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSavedListDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the list is public (for team sharing)',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSavedListDto.prototype, "isPublic", void 0);
class UpdateSavedListDto {
}
exports.UpdateSavedListDto = UpdateSavedListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated list name',
        example: 'Q4 Equipment Procurement - Revised',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedListDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated description',
        example: 'Updated equipment list for Q4 production line expansion',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedListDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated tags',
        type: [String],
        example: ['q4', 'production', 'expansion', 'revised'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSavedListDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated public status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSavedListDto.prototype, "isPublic", void 0);
class SavedListResponseDto {
}
exports.SavedListResponseDto = SavedListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], SavedListResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List name',
        example: 'Q4 Equipment Procurement',
    }),
    __metadata("design:type", String)
], SavedListResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List description',
        example: 'Equipment needed for Q4 production line expansion',
    }),
    __metadata("design:type", String)
], SavedListResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Owner user ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], SavedListResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List tags',
        type: [String],
        example: ['q4', 'production', 'expansion'],
    }),
    __metadata("design:type", Array)
], SavedListResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether list is public',
        example: false,
    }),
    __metadata("design:type", Boolean)
], SavedListResponseDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items in list',
        example: 12,
    }),
    __metadata("design:type", Number)
], SavedListResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total estimated value',
        example: 3499.88,
    }),
    __metadata("design:type", Number)
], SavedListResponseDto.prototype, "totalEstimatedValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], SavedListResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], SavedListResponseDto.prototype, "updatedAt", void 0);
class SavedItemsFilterDto {
}
exports.SavedItemsFilterDto = SavedItemsFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by list name',
        example: 'Q4 Equipment Needs',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SavedItemsFilterDto.prototype, "listName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by tags',
        type: [String],
        example: ['motors', 'high-priority'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SavedItemsFilterDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by product name or SKU',
        example: 'motor',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SavedItemsFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by availability',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SavedItemsFilterDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SavedItemsFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by price changes (true = items with price changes)',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SavedItemsFilterDto.prototype, "hasPriceChange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], SavedItemsFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], SavedItemsFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        example: 'createdAt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SavedItemsFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'desc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SavedItemsFilterDto.prototype, "sortOrder", void 0);
class SavedItemsListDto {
}
exports.SavedItemsListDto = SavedItemsListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of saved items',
        type: [SavedItemResponseDto],
    }),
    __metadata("design:type", Array)
], SavedItemsListDto.prototype, "savedItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of saved items',
        example: 35,
    }),
    __metadata("design:type", Number)
], SavedItemsListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], SavedItemsListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], SavedItemsListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 2,
    }),
    __metadata("design:type", Number)
], SavedItemsListDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are more pages',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SavedItemsListDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are previous pages',
        example: false,
    }),
    __metadata("design:type", Boolean)
], SavedItemsListDto.prototype, "hasPrev", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available lists',
        type: [SavedListResponseDto],
    }),
    __metadata("design:type", Array)
], SavedItemsListDto.prototype, "availableLists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available tags',
        type: [String],
        example: ['motors', 'high-priority', 'line-3', 'approved'],
    }),
    __metadata("design:type", Array)
], SavedItemsListDto.prototype, "availableTags", void 0);
//# sourceMappingURL=saved-items.dto.js.map