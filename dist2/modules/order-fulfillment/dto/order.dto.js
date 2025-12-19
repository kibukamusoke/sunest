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
exports.OrderAnalyticsResponseDto = exports.OrderTimelineResponseDto = exports.OrderEventResponseDto = exports.CreateOrderEventDto = exports.OrderListResponseDto = exports.OrderResponseDto = exports.PaymentProofResponseDto = exports.OrderItemResponseDto = exports.OrderFilterDto = exports.UpdateOrderItemDto = exports.UploadPaymentProofDto = exports.UpdateOrderDto = exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const shipping_dto_1 = require("./shipping.dto");
class CreateOrderItemDto {
}
exports.CreateOrderItemDto = CreateOrderItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID',
        example: 'uuid-product-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant ID',
        example: 'uuid-variant-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "productVariantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product name (for quote-derived items)',
        example: 'Custom Steel Component',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom SKU',
        example: 'CUSTOM-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product description',
        example: 'Custom manufactured steel component per specifications',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "customDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity ordered',
        example: 10,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit price',
        example: 99.99,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item-specific delivery date',
        example: '2024-08-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item notes',
        example: 'Customer prefers blue color if available',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "itemNotes", void 0);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Checkout ID to create order from',
        example: 'uuid-checkout-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "checkoutId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quote ID to create order from',
        example: 'uuid-quote-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer purchase order number',
        example: 'PO-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company ID for B2B orders',
        example: 'uuid-company-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping address ID',
        example: 'uuid-address-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing address ID',
        example: 'uuid-address-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "billingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CORPORATE_ACCOUNT,
    }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requested delivery date',
        example: '2024-08-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer notes',
        example: 'Please deliver after 2 PM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special delivery instructions',
        example: 'Fragile items - handle with care',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mark as rush order',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "rushOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credit terms',
        example: 'NET30',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "creditTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order items to create',
        type: [CreateOrderItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
class UpdateOrderDto {
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer purchase order number',
        example: 'PO-2024-001-UPDATED',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order status',
        enum: client_1.OrderStatus,
        example: client_1.OrderStatus.CONFIRMED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment status',
        enum: client_1.PaymentStatus,
        example: client_1.PaymentStatus.PAID,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentStatus),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requested delivery date',
        example: '2024-08-20T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer notes',
        example: 'Updated delivery instructions',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes',
        example: 'Customer contacted about delay',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special delivery instructions',
        example: 'Updated: Use loading dock entrance',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference',
        example: 'PAY-REF-12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: 79.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateOrderDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping / delivery fee amount',
        example: 15.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateOrderDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount (positive number reduces total)',
        example: 10.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateOrderDto.prototype, "discountAmount", void 0);
class UploadPaymentProofDto {
}
exports.UploadPaymentProofDto = UploadPaymentProofDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Uploaded file ID (from Storage presigned upload + confirm)',
        example: 'uuid-file-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UploadPaymentProofDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optionally update payment status at the same time',
        enum: client_1.PaymentStatus,
        example: client_1.PaymentStatus.PAID,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentStatus),
    __metadata("design:type", String)
], UploadPaymentProofDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional notes about the payment proof',
        example: 'Bank transfer receipt uploaded by admin',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPaymentProofDto.prototype, "notes", void 0);
class UpdateOrderItemDto {
}
exports.UpdateOrderItemDto = UpdateOrderItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantity ordered',
        example: 15,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit price',
        example: 89.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item-specific delivery date',
        example: '2024-08-20T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item notes',
        example: 'Updated customer preferences',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "itemNotes", void 0);
class OrderFilterDto {
}
exports.OrderFilterDto = OrderFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by order status',
        enum: client_1.OrderStatus,
        example: client_1.OrderStatus.PROCESSING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by fulfillment status',
        enum: client_1.FulfillmentStatus,
        example: client_1.FulfillmentStatus.PICKING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FulfillmentStatus),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "fulfillmentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by payment status',
        enum: client_1.PaymentStatus,
        example: client_1.PaymentStatus.PAID,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentStatus),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by company ID',
        example: 'uuid-company-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by user ID',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by order number',
        example: 'HW-2024-000001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by purchase order number',
        example: 'PO-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter orders created after date',
        example: '2024-08-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "createdAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter orders created before date',
        example: '2024-08-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "createdBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter rush orders',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], OrderFilterDto.prototype, "rushOrder", void 0);
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
], OrderFilterDto.prototype, "page", void 0);
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
], OrderFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ['createdAt', 'orderNumber', 'totalAmount', 'status'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilterDto.prototype, "sortOrder", void 0);
class OrderItemResponseDto {
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order item ID' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product information' }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product variant information' }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom product name' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom SKU' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom description' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "customDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity ordered' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity fulfilled' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantityFulfilled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity shipped' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantityShipped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity delivered' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantityDelivered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity cancelled' }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantityCancelled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requested delivery date' }),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated delivery date' }),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Item notes' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "itemNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Complete product data snapshot at time of order',
    }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "productSnapshot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Complete variant data snapshot at time of order',
    }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "variantSnapshot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the product snapshot was created' }),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "snapshotCreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product name at time of order (snapshot)' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product SKU at time of order (snapshot)' }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product brand at time of order (snapshot)',
    }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productBrand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product category at time of order (snapshot)',
    }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images at time of order (snapshot)',
    }),
    __metadata("design:type", Array)
], OrderItemResponseDto.prototype, "productImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant name at time of order (snapshot)',
    }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant SKU at time of order (snapshot)',
    }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variant attributes at time of order (snapshot)',
    }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "variantAttributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "updatedAt", void 0);
class PaymentProofResponseDto {
}
exports.PaymentProofResponseDto = PaymentProofResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Uploaded file ID' }),
    __metadata("design:type", String)
], PaymentProofResponseDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Public URL to the proof file' }),
    __metadata("design:type", String)
], PaymentProofResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Original filename' }),
    __metadata("design:type", String)
], PaymentProofResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the proof was uploaded' }),
    __metadata("design:type", Date)
], PaymentProofResponseDto.prototype, "uploadedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who uploaded the proof' }),
    __metadata("design:type", Object)
], PaymentProofResponseDto.prototype, "uploadedBy", void 0);
class OrderResponseDto {
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order number' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Purchase order number' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User information' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company information' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping address' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing address' }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order totals' }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax amount' }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping amount' }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount amount' }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount' }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order status', enum: client_1.OrderStatus }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fulfillment status', enum: client_1.FulfillmentStatus }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "fulfillmentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment status', enum: client_1.PaymentStatus }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requested delivery date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "requestedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated delivery date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Actual delivery date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer notes' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Internal notes' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rush order flag' }),
    __metadata("design:type", Boolean)
], OrderResponseDto.prototype, "rushOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method', enum: client_1.PaymentMethod }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Uploaded payment proofs (if any)',
        type: [PaymentProofResponseDto],
    }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "paymentProofs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Credit terms' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "creditTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order items', type: [OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipments for this order',
        type: [shipping_dto_1.ShipmentResponseDto],
    }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "shipments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confirmed date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "confirmedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipped date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delivered date' }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "deliveredAt", void 0);
class OrderListResponseDto {
}
exports.OrderListResponseDto = OrderListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders', type: [OrderResponseDto] }),
    __metadata("design:type", Array)
], OrderListResponseDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of orders matching filter' }),
    __metadata("design:type", Number)
], OrderListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], OrderListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], OrderListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], OrderListResponseDto.prototype, "totalPages", void 0);
class CreateOrderEventDto {
}
exports.CreateOrderEventDto = CreateOrderEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Event type',
        enum: client_1.OrderEventType,
        example: client_1.OrderEventType.ORDER_CONFIRMED,
    }),
    (0, class_validator_1.IsEnum)(client_1.OrderEventType),
    __metadata("design:type", String)
], CreateOrderEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Event description',
        example: 'Order confirmed and ready for fulfillment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional event metadata',
        example: { previousStatus: 'PENDING', newStatus: 'CONFIRMED' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOrderEventDto.prototype, "metadata", void 0);
class OrderEventResponseDto {
}
exports.OrderEventResponseDto = OrderEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID' }),
    __metadata("design:type", String)
], OrderEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event type', enum: client_1.OrderEventType }),
    __metadata("design:type", String)
], OrderEventResponseDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event description' }),
    __metadata("design:type", String)
], OrderEventResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who triggered the event' }),
    __metadata("design:type", Object)
], OrderEventResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional event metadata' }),
    __metadata("design:type", Object)
], OrderEventResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event timestamp' }),
    __metadata("design:type", Date)
], OrderEventResponseDto.prototype, "createdAt", void 0);
class OrderTimelineResponseDto {
}
exports.OrderTimelineResponseDto = OrderTimelineResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order events', type: [OrderEventResponseDto] }),
    __metadata("design:type", Array)
], OrderTimelineResponseDto.prototype, "events", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order summary' }),
    __metadata("design:type", Object)
], OrderTimelineResponseDto.prototype, "orderSummary", void 0);
class OrderAnalyticsResponseDto {
}
exports.OrderAnalyticsResponseDto = OrderAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders count' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total order value' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "totalValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order value' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders by status' }),
    __metadata("design:type", Object)
], OrderAnalyticsResponseDto.prototype, "ordersByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders by fulfillment status' }),
    __metadata("design:type", Object)
], OrderAnalyticsResponseDto.prototype, "ordersByFulfillmentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders by payment status' }),
    __metadata("design:type", Object)
], OrderAnalyticsResponseDto.prototype, "ordersByPaymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rush orders count' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "rushOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'On-time delivery rate (percentage)' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "onTimeDeliveryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average fulfillment time (hours)' }),
    __metadata("design:type", Number)
], OrderAnalyticsResponseDto.prototype, "averageFulfillmentTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    __metadata("design:type", Date)
], OrderAnalyticsResponseDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    __metadata("design:type", Date)
], OrderAnalyticsResponseDto.prototype, "periodEnd", void 0);
//# sourceMappingURL=order.dto.js.map