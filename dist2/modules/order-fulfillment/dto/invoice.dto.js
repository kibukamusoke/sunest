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
exports.BulkInvoiceResultDto = exports.BulkInvoiceActionDto = exports.InvoiceAnalyticsResponseDto = exports.InvoicePdfResponseDto = exports.InvoiceListResponseDto = exports.InvoiceResponseDto = exports.InvoiceFilterDto = exports.RecordPaymentDto = exports.SendInvoiceDto = exports.UpdateInvoiceDto = exports.CreateInvoiceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateInvoiceDto {
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID to create invoice for',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID for B2B invoicing',
        example: 'uuid-company-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtotal amount',
        example: 999.99,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax amount',
        example: 79.99,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount',
        example: 1079.98,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currency code',
        example: 'USD',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Issue date (defaults to now)',
        example: '2024-08-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "issuedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Due date',
        example: '2024-09-15T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method used',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CORPORATE_ACCOUNT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference/transaction ID',
        example: 'TXN-12345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "paymentReference", void 0);
class UpdateInvoiceDto {
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice status',
        enum: client_1.InvoiceStatus,
        example: client_1.InvoiceStatus.SENT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.InvoiceStatus),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Subtotal amount',
        example: 899.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax amount',
        example: 72.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total amount',
        example: 971.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Issue date',
        example: '2024-08-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "issuedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Due date',
        example: '2024-09-15T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "dueAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Paid date',
        example: '2024-08-20T14:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method used',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CREDIT_CARD,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference/transaction ID',
        example: 'TXN-87654321',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'PDF URL',
        example: 'https://storage.example.com/invoices/INV-2024-001.pdf',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "pdfUrl", void 0);
class SendInvoiceDto {
}
exports.SendInvoiceDto = SendInvoiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email addresses to send invoice to (defaults to order customer)',
        example: ['customer@company.com', 'accounting@company.com'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SendInvoiceDto.prototype, "emailTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom email subject',
        example: 'Invoice INV-2024-001 from Hardware World',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvoiceDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom email message',
        example: 'Please find attached your invoice. Payment is due within 30 days.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvoiceDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Send copy to internal team',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], SendInvoiceDto.prototype, "sendCopy", void 0);
class RecordPaymentDto {
}
exports.RecordPaymentDto = RecordPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount',
        example: 1079.98,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], RecordPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method used',
        enum: client_1.PaymentMethod,
        example: client_1.PaymentMethod.CREDIT_CARD,
    }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment reference/transaction ID',
        example: 'TXN-12345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment date (defaults to now)',
        example: '2024-08-20T14:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment notes',
        example: 'Payment received via Stripe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "notes", void 0);
class InvoiceFilterDto {
}
exports.InvoiceFilterDto = InvoiceFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by invoice status',
        enum: client_1.InvoiceStatus,
        example: client_1.InvoiceStatus.SENT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.InvoiceStatus),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by company ID',
        example: 'uuid-company-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by user ID',
        example: 'uuid-user-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by order ID',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by invoice number',
        example: 'INV-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter invoices issued after date',
        example: '2024-08-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "issuedAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter invoices issued before date',
        example: '2024-08-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "issuedBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter invoices due after date',
        example: '2024-09-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "dueAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter invoices due before date',
        example: '2024-09-30T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "dueBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter overdue invoices',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InvoiceFilterDto.prototype, "overdue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum invoice amount',
        example: 100.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], InvoiceFilterDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum invoice amount',
        example: 5000.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], InvoiceFilterDto.prototype, "maxAmount", void 0);
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
], InvoiceFilterDto.prototype, "page", void 0);
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
], InvoiceFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'issuedAt',
        enum: ['issuedAt', 'dueAt', 'totalAmount', 'status', 'invoiceNumber'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceFilterDto.prototype, "sortOrder", void 0);
class InvoiceResponseDto {
}
exports.InvoiceResponseDto = InvoiceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice ID' }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice number' }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], InvoiceResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer information' }),
    __metadata("design:type", Object)
], InvoiceResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company information' }),
    __metadata("design:type", Object)
], InvoiceResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subtotal amount' }),
    __metadata("design:type", Number)
], InvoiceResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax amount' }),
    __metadata("design:type", Number)
], InvoiceResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount' }),
    __metadata("design:type", Number)
], InvoiceResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency' }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice status', enum: client_1.InvoiceStatus }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Issue date' }),
    __metadata("design:type", Date)
], InvoiceResponseDto.prototype, "issuedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Due date' }),
    __metadata("design:type", Date)
], InvoiceResponseDto.prototype, "dueAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Paid date' }),
    __metadata("design:type", Date)
], InvoiceResponseDto.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method', enum: client_1.PaymentMethod }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference' }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PDF URL' }),
    __metadata("design:type", String)
], InvoiceResponseDto.prototype, "pdfUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is overdue' }),
    __metadata("design:type", Boolean)
], InvoiceResponseDto.prototype, "isOverdue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Days overdue (if applicable)' }),
    __metadata("design:type", Number)
], InvoiceResponseDto.prototype, "daysOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], InvoiceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], InvoiceResponseDto.prototype, "updatedAt", void 0);
class InvoiceListResponseDto {
}
exports.InvoiceListResponseDto = InvoiceListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoices', type: [InvoiceResponseDto] }),
    __metadata("design:type", Array)
], InvoiceListResponseDto.prototype, "invoices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of invoices matching filter' }),
    __metadata("design:type", Number)
], InvoiceListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], InvoiceListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], InvoiceListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], InvoiceListResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Summary statistics' }),
    __metadata("design:type", Object)
], InvoiceListResponseDto.prototype, "summary", void 0);
class InvoicePdfResponseDto {
}
exports.InvoicePdfResponseDto = InvoicePdfResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'PDF file URL' }),
    __metadata("design:type", String)
], InvoicePdfResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'PDF file name' }),
    __metadata("design:type", String)
], InvoicePdfResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], InvoicePdfResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated at' }),
    __metadata("design:type", Date)
], InvoicePdfResponseDto.prototype, "generatedAt", void 0);
class InvoiceAnalyticsResponseDto {
}
exports.InvoiceAnalyticsResponseDto = InvoiceAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total invoices count' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "totalInvoices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total invoice value' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "totalValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total paid amount' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total outstanding amount' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "outstandingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total overdue amount' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "overdueAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average invoice value' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "averageInvoiceValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average days to payment' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "averageDaysToPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Collection rate (percentage)' }),
    __metadata("design:type", Number)
], InvoiceAnalyticsResponseDto.prototype, "collectionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoices by status' }),
    __metadata("design:type", Object)
], InvoiceAnalyticsResponseDto.prototype, "invoicesByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment methods distribution' }),
    __metadata("design:type", Object)
], InvoiceAnalyticsResponseDto.prototype, "paymentMethodsDistribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top customers by invoice value' }),
    __metadata("design:type", Array)
], InvoiceAnalyticsResponseDto.prototype, "topCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aging analysis' }),
    __metadata("design:type", Object)
], InvoiceAnalyticsResponseDto.prototype, "agingAnalysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monthly trends' }),
    __metadata("design:type", Array)
], InvoiceAnalyticsResponseDto.prototype, "monthlyTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    __metadata("design:type", Date)
], InvoiceAnalyticsResponseDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    __metadata("design:type", Date)
], InvoiceAnalyticsResponseDto.prototype, "periodEnd", void 0);
class BulkInvoiceActionDto {
}
exports.BulkInvoiceActionDto = BulkInvoiceActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invoice IDs to perform action on',
        example: ['uuid-invoice-1', 'uuid-invoice-2', 'uuid-invoice-3'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BulkInvoiceActionDto.prototype, "invoiceIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to perform',
        example: 'send',
        enum: ['send', 'mark_paid', 'cancel', 'regenerate_pdf'],
    }),
    (0, class_validator_1.IsEnum)(['send', 'mark_paid', 'cancel', 'regenerate_pdf']),
    __metadata("design:type", String)
], BulkInvoiceActionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional data for the action',
        example: { emailTo: ['customer@company.com'], sendCopy: true },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BulkInvoiceActionDto.prototype, "actionData", void 0);
class BulkInvoiceResultDto {
}
exports.BulkInvoiceResultDto = BulkInvoiceResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Successfully processed invoice IDs' }),
    __metadata("design:type", Array)
], BulkInvoiceResultDto.prototype, "successful", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Failed invoice IDs with error messages' }),
    __metadata("design:type", Array)
], BulkInvoiceResultDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total processed' }),
    __metadata("design:type", Number)
], BulkInvoiceResultDto.prototype, "totalProcessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success count' }),
    __metadata("design:type", Number)
], BulkInvoiceResultDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Failure count' }),
    __metadata("design:type", Number)
], BulkInvoiceResultDto.prototype, "failureCount", void 0);
//# sourceMappingURL=invoice.dto.js.map