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
exports.ApprovalRequirementDto = exports.CheckoutListDto = exports.CheckoutFilterDto = exports.CheckoutResponseDto = exports.CheckoutItemDto = exports.CheckoutCalculationDto = exports.ApproveCheckoutDto = exports.SubmitCheckoutDto = exports.UpdateCheckoutNotesDto = exports.UpdateCheckoutPaymentDto = exports.UpdateCheckoutBillingDto = exports.UpdateCheckoutShippingDto = exports.InitiateCheckoutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const address_dto_1 = require("./address.dto");
class InitiateCheckoutDto {
}
exports.InitiateCheckoutDto = InitiateCheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart ID to checkout',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InitiateCheckoutDto.prototype, "cartId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID for B2B context',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InitiateCheckoutDto.prototype, "companyId", void 0);
class UpdateCheckoutShippingDto {
}
exports.UpdateCheckoutShippingDto = UpdateCheckoutShippingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping address ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCheckoutShippingDto.prototype, "shippingAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred delivery date',
        example: '2024-09-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCheckoutShippingDto.prototype, "preferredDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery instructions',
        example: 'Leave at loading dock if no one available',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutShippingDto.prototype, "deliveryInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping method',
        example: 'Standard Ground',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutShippingDto.prototype, "shippingMethod", void 0);
class UpdateCheckoutBillingDto {
}
exports.UpdateCheckoutBillingDto = UpdateCheckoutBillingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing address ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCheckoutBillingDto.prototype, "billingAddressId", void 0);
class UpdateCheckoutPaymentDto {
}
exports.UpdateCheckoutPaymentDto = UpdateCheckoutPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CORPORATE_ACCOUNT,
    }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], UpdateCheckoutPaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encrypted payment details (for credit cards)',
        example: 'encrypted_payment_token_12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutPaymentDto.prototype, "paymentDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purchase order number (for corporate purchases)',
        example: 'PO-2024-08-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutPaymentDto.prototype, "purchaseOrderNumber", void 0);
class UpdateCheckoutNotesDto {
}
exports.UpdateCheckoutNotesDto = UpdateCheckoutNotesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer notes for the order',
        example: 'Please coordinate delivery with our receiving department',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutNotesDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes (admin/merchant only)',
        example: 'Large order - may require freight shipping',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCheckoutNotesDto.prototype, "internalNotes", void 0);
class SubmitCheckoutDto {
}
exports.SubmitCheckoutDto = SubmitCheckoutDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Final customer notes',
        example: 'Rush order - needed by end of week',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitCheckoutDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to bypass approval for authorized users',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubmitCheckoutDto.prototype, "bypassApproval", void 0);
class ApproveCheckoutDto {
}
exports.ApproveCheckoutDto = ApproveCheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Approval decision',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ApproveCheckoutDto.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval notes',
        example: 'Approved with budget allocation from Q3 capital expenses',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveCheckoutDto.prototype, "approvalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rejection reason (if not approved)',
        example: 'Exceeds monthly budget limit',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveCheckoutDto.prototype, "rejectionReason", void 0);
class CheckoutCalculationDto {
}
exports.CheckoutCalculationDto = CheckoutCalculationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items subtotal',
        example: 2499.95,
    }),
    __metadata("design:type", Number)
], CheckoutCalculationDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax amount',
        example: 199.99,
    }),
    __metadata("design:type", Number)
], CheckoutCalculationDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping amount',
        example: 49.99,
    }),
    __metadata("design:type", Number)
], CheckoutCalculationDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount amount',
        example: 100.0,
    }),
    __metadata("design:type", Number)
], CheckoutCalculationDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount',
        example: 2649.93,
    }),
    __metadata("design:type", Number)
], CheckoutCalculationDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency',
        example: 'USD',
    }),
    __metadata("design:type", String)
], CheckoutCalculationDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax breakdown by jurisdiction',
        example: {
            state: { rate: 0.06, amount: 149.99 },
            local: { rate: 0.02, amount: 50.0 },
        },
    }),
    __metadata("design:type", Object)
], CheckoutCalculationDto.prototype, "taxBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Applied discounts',
        type: [Object],
        example: [
            {
                type: 'volume_discount',
                description: 'Volume discount (>$2000)',
                amount: 100.0,
                percentage: 4.0,
            },
        ],
    }),
    __metadata("design:type", Array)
], CheckoutCalculationDto.prototype, "appliedDiscounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping options',
        type: [Object],
        example: [
            {
                method: 'Standard Ground',
                cost: 49.99,
                estimatedDays: 5,
            },
            {
                method: 'Express',
                cost: 129.99,
                estimatedDays: 2,
            },
        ],
    }),
    __metadata("design:type", Array)
], CheckoutCalculationDto.prototype, "shippingOptions", void 0);
class CheckoutItemDto {
}
exports.CheckoutItemDto = CheckoutItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Checkout item ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product information',
    }),
    __metadata("design:type", Object)
], CheckoutItemDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product variant information',
    }),
    __metadata("design:type", Object)
], CheckoutItemDto.prototype, "productVariant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity',
        example: 5,
    }),
    __metadata("design:type", Number)
], CheckoutItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit price',
        example: 299.99,
    }),
    __metadata("design:type", Number)
], CheckoutItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total price',
        example: 1499.95,
    }),
    __metadata("design:type", Number)
], CheckoutItemDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether item is approved',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CheckoutItemDto.prototype, "isApproved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    }),
    __metadata("design:type", String)
], CheckoutItemDto.prototype, "requiredByDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Item notes',
        example: 'Please ensure 240V configuration',
    }),
    __metadata("design:type", String)
], CheckoutItemDto.prototype, "notes", void 0);
class CheckoutResponseDto {
}
exports.CheckoutResponseDto = CheckoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Checkout ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "cartId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company information',
    }),
    __metadata("design:type", Object)
], CheckoutResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping address',
        type: address_dto_1.AddressResponseDto,
    }),
    __metadata("design:type", address_dto_1.AddressResponseDto)
], CheckoutResponseDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing address',
        type: address_dto_1.AddressResponseDto,
    }),
    __metadata("design:type", address_dto_1.AddressResponseDto)
], CheckoutResponseDto.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CORPORATE_ACCOUNT,
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purchase order number',
        example: 'PO-2024-08-001',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pricing calculation',
        type: CheckoutCalculationDto,
    }),
    __metadata("design:type", CheckoutCalculationDto)
], CheckoutResponseDto.prototype, "calculation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Checkout status',
        enum: client_1.CheckoutStatus,
        example: client_1.CheckoutStatus.PENDING,
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether checkout requires approval',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CheckoutResponseDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Approval status',
        enum: client_1.ApprovalStatus,
        example: client_1.ApprovalStatus.NONE,
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "approvalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval requested timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "approvalRequestedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who requested approval',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "approvalRequestedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval timestamp',
        example: '2024-08-07T15:45:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who approved',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rejection timestamp',
        example: '2024-08-07T15:45:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "rejectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who rejected',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "rejectedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rejection reason',
        example: 'Exceeds monthly budget limit',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred delivery date',
        example: '2024-09-15T00:00:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "preferredDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery instructions',
        example: 'Leave at loading dock if no one available',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "deliveryInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping method',
        example: 'Standard Ground',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "shippingMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer notes',
        example: 'Rush order - needed by end of week',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Internal notes',
        example: 'Large order - may require freight shipping',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "internalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Created order ID (when checkout completes)',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment intent ID (Stripe, etc.)',
        example: 'pi_1234567890',
    }),
    __metadata("design:type", String)
], CheckoutResponseDto.prototype, "paymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Completion timestamp',
        example: '2024-08-07T16:00:00Z',
    }),
    __metadata("design:type", Date)
], CheckoutResponseDto.prototype, "completedAt", void 0);
class CheckoutFilterDto {
}
exports.CheckoutFilterDto = CheckoutFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by status',
        enum: client_1.CheckoutStatus,
        example: client_1.CheckoutStatus.PENDING_APPROVAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CheckoutStatus),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by approval status',
        enum: client_1.ApprovalStatus,
        example: client_1.ApprovalStatus.PENDING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ApprovalStatus),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "approvalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by company ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by user ID',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by minimum total amount',
        example: 1000.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CheckoutFilterDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by maximum total amount',
        example: 5000.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CheckoutFilterDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by creation date from',
        example: '2024-08-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "createdFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by creation date to',
        example: '2024-08-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "createdTo", void 0);
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
], CheckoutFilterDto.prototype, "page", void 0);
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
], CheckoutFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        example: 'createdAt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'desc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutFilterDto.prototype, "sortOrder", void 0);
class CheckoutListDto {
}
exports.CheckoutListDto = CheckoutListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of checkouts',
        type: [CheckoutResponseDto],
    }),
    __metadata("design:type", Array)
], CheckoutListDto.prototype, "checkouts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of checkouts',
        example: 45,
    }),
    __metadata("design:type", Number)
], CheckoutListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], CheckoutListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
    }),
    __metadata("design:type", Number)
], CheckoutListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 3,
    }),
    __metadata("design:type", Number)
], CheckoutListDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are more pages',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CheckoutListDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are previous pages',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CheckoutListDto.prototype, "hasPrev", void 0);
class ApprovalRequirementDto {
}
exports.ApprovalRequirementDto = ApprovalRequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether approval is required',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ApprovalRequirementDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for approval requirement',
        example: 'Order total exceeds user approval limit of $1,000',
    }),
    __metadata("design:type", String)
], ApprovalRequirementDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User approval limit',
        example: 1000.0,
    }),
    __metadata("design:type", Number)
], ApprovalRequirementDto.prototype, "userApprovalLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order total amount',
        example: 2649.93,
    }),
    __metadata("design:type", Number)
], ApprovalRequirementDto.prototype, "orderTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Required approval level',
        example: 'manager',
    }),
    __metadata("design:type", String)
], ApprovalRequirementDto.prototype, "requiredLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Eligible approvers',
        type: [Object],
        example: [
            {
                userId: 'clh1234567890',
                name: 'John Manager',
                email: 'john.manager@company.com',
                approvalLimit: 10000.0,
            },
        ],
    }),
    __metadata("design:type", Array)
], ApprovalRequirementDto.prototype, "eligibleApprovers", void 0);
//# sourceMappingURL=checkout.dto.js.map