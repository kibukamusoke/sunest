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
exports.CartValidationDto = exports.QuoteToCartDto = exports.CartResponseDto = exports.CartSummaryDto = exports.MergeCartDto = exports.UpdateCartDto = exports.CreateCartDto = exports.CartItemResponseDto = exports.BulkAddToCartDto = exports.UpdateCartItemDto = exports.CreateCartItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateCartItemDto {
}
exports.CreateCartItemDto = CreateCartItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID to add to cart',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant ID for specific variant',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "productVariantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product name (for quote-derived items)',
        example: 'Custom Industrial Motor - 5HP',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom SKU (for quote-derived items)',
        example: 'CUSTOM-MOTOR-5HP',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product description',
        example: 'High-efficiency industrial motor with specific requirements',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "customDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity to add to cart',
        example: 5,
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit price for custom items',
        example: 299.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source of the cart item',
        enum: client_1.CartItemSource,
        example: client_1.CartItemSource.MANUAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CartItemSource),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source ID (Quote ID, Order ID, etc.)',
        example: 'quote_123456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "sourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "requiredByDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special notes for this item',
        example: 'Please ensure 240V configuration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "notes", void 0);
class UpdateCartItemDto {
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated quantity',
        example: 10,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated unit price for custom items',
        example: 279.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated required delivery date',
        example: '2024-09-20T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCartItemDto.prototype, "requiredByDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated notes for this item',
        example: 'Changed to 480V configuration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCartItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cart item status',
        enum: client_1.CartItemStatus,
        example: client_1.CartItemStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CartItemStatus),
    __metadata("design:type", String)
], UpdateCartItemDto.prototype, "status", void 0);
class BulkAddToCartDto {
}
exports.BulkAddToCartDto = BulkAddToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of items to add to cart',
        type: [CreateCartItemDto],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateCartItemDto),
    __metadata("design:type", Array)
], BulkAddToCartDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source of the bulk add operation',
        enum: client_1.CartItemSource,
        example: client_1.CartItemSource.BULK_UPLOAD,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CartItemSource),
    __metadata("design:type", String)
], BulkAddToCartDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source ID for bulk operation',
        example: 'bulk_upload_123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkAddToCartDto.prototype, "sourceId", void 0);
class CartItemResponseDto {
}
exports.CartItemResponseDto = CartItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart item ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "cartId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product information',
    }),
    __metadata("design:type", Object)
], CartItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant information',
    }),
    __metadata("design:type", Object)
], CartItemResponseDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product name',
        example: 'Custom Industrial Motor - 5HP',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom SKU',
        example: 'CUSTOM-MOTOR-5HP',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom description',
        example: 'High-efficiency industrial motor with specific requirements',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "customDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity in cart',
        example: 5,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit price',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total price for this line item',
        example: 1499.95,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original price before discounts',
        example: 349.99,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "originalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source of cart item',
        enum: client_1.CartItemSource,
        example: client_1.CartItemSource.MANUAL,
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source ID',
        example: 'quote_123456',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "sourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "requiredByDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item notes',
        example: 'Please ensure 240V configuration',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether item is approved',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CartItemResponseDto.prototype, "isApproved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who approved',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart item status',
        enum: client_1.CartItemStatus,
        example: client_1.CartItemStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether item is available',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CartItemResponseDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Availability message',
        example: 'In stock - 15 available',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "availabilityMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], CartItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], CartItemResponseDto.prototype, "updatedAt", void 0);
class CreateCartDto {
}
exports.CreateCartDto = CreateCartDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cart name for collaborative shopping',
        example: 'Q3 Equipment Purchase',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID for B2B context',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Session ID for guest carts',
        example: 'guest_session_123456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a guest cart',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCartDto.prototype, "isGuest", void 0);
class UpdateCartDto {
}
exports.UpdateCartDto = UpdateCartDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated cart name',
        example: 'Q3 Equipment Purchase - Revised',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCartDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated shipping address ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCartDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated billing address ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCartDto.prototype, "billingAddressId", void 0);
class MergeCartDto {
}
exports.MergeCartDto = MergeCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Guest cart session ID to merge',
        example: 'guest_session_123456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MergeCartDto.prototype, "guestSessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Strategy for merging duplicate items',
        enum: ['combine_quantities', 'keep_latest', 'keep_both'],
        example: 'combine_quantities',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MergeCartDto.prototype, "mergeStrategy", void 0);
class CartSummaryDto {
}
exports.CartSummaryDto = CartSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items in cart',
        example: 15,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total quantity of all items',
        example: 42,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtotal before taxes and shipping',
        example: 2499.95,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated tax amount',
        example: 199.99,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "estimatedTax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated shipping cost',
        example: 49.99,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "estimatedShipping", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total estimated cost',
        example: 2749.93,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "estimatedTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items requiring approval',
        example: 3,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "itemsRequiringApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of unavailable items',
        example: 1,
    }),
    __metadata("design:type", Number)
], CartSummaryDto.prototype, "unavailableItems", void 0);
class CartResponseDto {
}
exports.CartResponseDto = CartResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID (null for guest carts)',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Session ID for guest carts',
        example: 'guest_session_123456',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company information',
    }),
    __metadata("design:type", Object)
], CartResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cart name',
        example: 'Q3 Equipment Purchase',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether cart is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CartResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a guest cart',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CartResponseDto.prototype, "isGuest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart currency',
        example: 'USD',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping address ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing address ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "billingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart items',
        type: [CartItemResponseDto],
    }),
    __metadata("design:type", Array)
], CartResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart summary',
        type: CartSummaryDto,
    }),
    __metadata("design:type", CartSummaryDto)
], CartResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date for guest carts',
        example: '2024-08-14T15:30:00Z',
    }),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "expiresAt", void 0);
class QuoteToCartDto {
}
exports.QuoteToCartDto = QuoteToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote ID to convert to cart',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuoteToCartDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific quote item IDs to add (if not provided, all items will be added)',
        type: [String],
        example: ['clh1234567890', 'clh0987654321'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], QuoteToCartDto.prototype, "quoteItemIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to preserve quoted prices',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QuoteToCartDto.prototype, "preserveQuotedPrices", void 0);
class CartValidationDto {
}
exports.CartValidationDto = CartValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall cart validation status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CartValidationDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart-level validation errors',
        type: [String],
        example: ['Cart is empty', 'Billing address required'],
    }),
    __metadata("design:type", Array)
], CartValidationDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart-level warnings',
        type: [String],
        example: ['Some items may have longer lead times'],
    }),
    __metadata("design:type", Array)
], CartValidationDto.prototype, "warnings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item-level validation results',
        example: {
            clh1234567890: {
                isValid: false,
                errors: ['Product out of stock'],
                warnings: ['Price may have changed'],
            },
        },
    }),
    __metadata("design:type", Object)
], CartValidationDto.prototype, "itemValidation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Availability check results',
        example: {
            clh1234567890: {
                available: 8,
                requested: 10,
                leadTime: 7,
            },
        },
    }),
    __metadata("design:type", Object)
], CartValidationDto.prototype, "availability", void 0);
//# sourceMappingURL=cart.dto.js.map