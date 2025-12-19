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
exports.QuoteRevisionDto = exports.CounterOfferDto = exports.RejectQuoteDto = exports.AcceptQuoteDto = exports.QuoteFilterDto = exports.QuoteListDto = exports.QuoteResponseDto = exports.QuoteItemResponseDto = exports.UpdateQuoteDto = exports.CreateQuoteDto = exports.CreateQuoteItemDto = exports.AlternativeProductDto = exports.QuoteItemPricingDto = exports.QuoteStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const library_1 = require("@prisma/client/runtime/library");
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["DRAFT"] = "DRAFT";
    QuoteStatus["SUBMITTED"] = "SUBMITTED";
    QuoteStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    QuoteStatus["APPROVED"] = "APPROVED";
    QuoteStatus["REJECTED"] = "REJECTED";
    QuoteStatus["EXPIRED"] = "EXPIRED";
    QuoteStatus["ACCEPTED"] = "ACCEPTED";
    QuoteStatus["COUNTER_OFFERED"] = "COUNTER_OFFERED";
    QuoteStatus["WITHDRAWN"] = "WITHDRAWN";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
class QuoteItemPricingDto {
}
exports.QuoteItemPricingDto = QuoteItemPricingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity for this pricing tier',
        example: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuoteItemPricingDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit price for this quantity',
        example: '150.00',
    }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => new library_1.Decimal(value).toString()),
    __metadata("design:type", String)
], QuoteItemPricingDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total price for this quantity',
        example: '15000.00',
    }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => new library_1.Decimal(value).toString()),
    __metadata("design:type", String)
], QuoteItemPricingDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount percentage applied',
        example: 5.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QuoteItemPricingDto.prototype, "discountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time for this quantity in days',
        example: 14,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], QuoteItemPricingDto.prototype, "leadTimeDays", void 0);
class AlternativeProductDto {
}
exports.AlternativeProductDto = AlternativeProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alternative product ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AlternativeProductDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alternative product name',
        example: 'Enhanced Industrial Router Model B',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AlternativeProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alternative product SKU',
        example: 'EIR-2024-B',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlternativeProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for suggesting this alternative',
        example: 'Better performance at similar price point',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlternativeProductDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price difference from original request',
        example: '+50.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlternativeProductDto.prototype, "priceDifference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional specifications',
        example: { throughput: '200 Mbps', warranty: '3 years' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AlternativeProductDto.prototype, "specifications", void 0);
class CreateQuoteItemDto {
}
exports.CreateQuoteItemDto = CreateQuoteItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ item ID this quote item responds to',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuoteItemDto.prototype, "rfqItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID if quoting existing catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuoteItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pricing for different quantity tiers',
        type: [QuoteItemPricingDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteItemPricingDto),
    __metadata("design:type", Array)
], CreateQuoteItemDto.prototype, "quantityPricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item description or notes',
        example: 'High-performance router with extended warranty',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item-specific specifications',
        example: { warranty: '3 years', support: '24/7' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateQuoteItemDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time for this item in days',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuoteItemDto.prototype, "leadTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Suggested alternative products',
        type: [AlternativeProductDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AlternativeProductDto),
    __metadata("design:type", Array)
], CreateQuoteItemDto.prototype, "suggestedAlternatives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for this item',
        example: 'Free installation included for orders over 50 units',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteItemDto.prototype, "notes", void 0);
class CreateQuoteDto {
    constructor() {
        this.currency = 'USD';
    }
}
exports.CreateQuoteDto = CreateQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ ID this quote responds to',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "rfqId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote valid until date',
        example: '2024-12-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery terms',
        example: 'FOB destination, free shipping on orders over $10,000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "deliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty terms',
        example: '2-year manufacturer warranty with optional extended warranty available',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "warrantyTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Overall lead time in days',
        example: 14,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "leadTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currency code',
        example: 'USD',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount',
        example: '500.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], CreateQuoteDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: '750.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], CreateQuoteDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping amount',
        example: '200.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], CreateQuoteDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes (not visible to customer)',
        example: 'High-priority customer, consider additional discount',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer-visible notes',
        example: 'Thank you for your inquiry. We look forward to working with you.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supporting document URLs',
        example: ['https://storage.example.com/quotes/technical-specs.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote items',
        type: [CreateQuoteItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuoteItemDto),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "items", void 0);
class UpdateQuoteDto {
}
exports.UpdateQuoteDto = UpdateQuoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quote valid until date',
        example: '2024-12-20',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted, early payment discount available',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery terms',
        example: 'FOB destination, expedited shipping available',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "deliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty terms',
        example: '3-year extended warranty included',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "warrantyTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Overall lead time in days',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateQuoteDto.prototype, "leadTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount',
        example: '750.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], UpdateQuoteDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: '800.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], UpdateQuoteDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping amount',
        example: '150.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], UpdateQuoteDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes',
        example: 'Updated pricing based on volume discount',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer-visible notes',
        example: 'Updated quote with improved pricing and terms',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supporting document URLs',
        example: ['https://storage.example.com/quotes/updated-specs.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateQuoteDto.prototype, "attachments", void 0);
class QuoteItemResponseDto {
}
exports.QuoteItemResponseDto = QuoteItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote item ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ item ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "rfqItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product details',
    }),
    __metadata("design:type", Object)
], QuoteItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pricing for different quantities',
        type: [QuoteItemPricingDto],
    }),
    __metadata("design:type", Array)
], QuoteItemResponseDto.prototype, "quantityPricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item description',
        example: 'Premium router with extended warranty',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item specifications',
        example: { warranty: '3 years', support: '24/7' },
    }),
    __metadata("design:type", Object)
], QuoteItemResponseDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time in days',
        example: 10,
    }),
    __metadata("design:type", Number)
], QuoteItemResponseDto.prototype, "leadTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Suggested alternatives',
        type: [AlternativeProductDto],
    }),
    __metadata("design:type", Array)
], QuoteItemResponseDto.prototype, "suggestedAlternatives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Free installation included',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteItemResponseDto.prototype, "updatedAt", void 0);
class QuoteResponseDto {
}
exports.QuoteResponseDto = QuoteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auto-generated quote number',
        example: 'QUO-2024-001',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "quoteNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "rfqId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RFQ details',
    }),
    __metadata("design:type", Object)
], QuoteResponseDto.prototype, "rfq", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant information',
    }),
    __metadata("design:type", Object)
], QuoteResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount',
        example: '15750.00',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency',
        example: 'USD',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote valid until',
        example: '2024-12-15T23:59:59Z',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery terms',
        example: 'FOB destination, free shipping',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "deliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty terms',
        example: '2-year manufacturer warranty',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "warrantyTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lead time in days',
        example: 14,
    }),
    __metadata("design:type", Number)
], QuoteResponseDto.prototype, "leadTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote status',
        example: 'SUBMITTED',
        enum: QuoteStatus,
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Submission timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Response timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "respondedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtotal amount',
        example: '15000.00',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount',
        example: '500.00',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: '750.00',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping amount',
        example: '200.00',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer-visible notes',
        example: 'Thank you for your business',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supporting documents',
        example: ['https://storage.example.com/quotes/specs.pdf'],
    }),
    __metadata("design:type", Array)
], QuoteResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote version',
        example: 1,
    }),
    __metadata("design:type", Number)
], QuoteResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent quote ID for revisions',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "parentQuoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote items',
        type: [QuoteItemResponseDto],
    }),
    __metadata("design:type", Array)
], QuoteResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], QuoteResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteResponseDto.prototype, "updatedAt", void 0);
class QuoteListDto {
}
exports.QuoteListDto = QuoteListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of quotes',
        type: [QuoteResponseDto],
    }),
    __metadata("design:type", Array)
], QuoteListDto.prototype, "quotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of quotes',
        example: 15,
    }),
    __metadata("design:type", Number)
], QuoteListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], QuoteListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], QuoteListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 2,
    }),
    __metadata("design:type", Number)
], QuoteListDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are more pages',
        example: true,
    }),
    __metadata("design:type", Boolean)
], QuoteListDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are previous pages',
        example: false,
    }),
    __metadata("design:type", Boolean)
], QuoteListDto.prototype, "hasPrev", void 0);
class QuoteFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.QuoteFilterDto = QuoteFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by quote status',
        enum: QuoteStatus,
        example: 'SUBMITTED',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(QuoteStatus),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "rfqId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by merchant ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by submitted date (from)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "submittedFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by submitted date (to)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "submittedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by valid until date (from)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by valid until date (to)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by minimum total amount',
        example: '1000.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by maximum total amount',
        example: '50000.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    __metadata("design:type", String)
], QuoteFilterDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], QuoteFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], QuoteFilterDto.prototype, "limit", void 0);
class AcceptQuoteDto {
}
exports.AcceptQuoteDto = AcceptQuoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the acceptance',
        example: 'Approved by procurement team',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcceptQuoteDto.prototype, "acceptanceNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected start date for fulfillment',
        example: '2024-12-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AcceptQuoteDto.prototype, "expectedStartDate", void 0);
class RejectQuoteDto {
}
exports.RejectQuoteDto = RejectQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for rejection',
        example: 'Price exceeds budget',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectQuoteDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional feedback',
        example: 'Please consider a lower price point for future opportunities',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectQuoteDto.prototype, "feedback", void 0);
class CounterOfferDto {
}
exports.CounterOfferDto = CounterOfferDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Counter offer total amount',
        example: '14500.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], CounterOfferDto.prototype, "counterAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requested delivery terms',
        example: 'FOB origin, expedited shipping',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CounterOfferDto.prototype, "requestedDeliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requested payment terms',
        example: 'NET45 terms preferred',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CounterOfferDto.prototype, "requestedPaymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requested lead time in days',
        example: 7,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CounterOfferDto.prototype, "requestedLeadTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Counter offer notes',
        example: 'Can you match this price with the same delivery terms?',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CounterOfferDto.prototype, "counterOfferNotes", void 0);
class QuoteRevisionDto {
}
exports.QuoteRevisionDto = QuoteRevisionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for revision',
        example: 'Customer requested pricing adjustment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QuoteRevisionDto.prototype, "revisionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated quote data',
        type: UpdateQuoteDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateQuoteDto),
    __metadata("design:type", UpdateQuoteDto)
], QuoteRevisionDto.prototype, "updates", void 0);
//# sourceMappingURL=quote.dto.js.map