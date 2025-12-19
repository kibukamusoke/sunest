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
exports.CheckApplicationStatusDto = exports.MerchantApplicationResponseDto = exports.MerchantApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MerchantApplicationDto {
}
exports.MerchantApplicationDto = MerchantApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant business name',
        example: 'TechParts Supplier Inc.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the merchant',
        example: 'TechParts Supplier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business description',
        example: 'Premium electronic components supplier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of business', example: 'distributor' }),
    (0, class_validator_1.IsEnum)(['manufacturer', 'distributor', 'retailer', 'wholesaler']),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Business contact email',
        example: 'admin@techparts.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business contact phone',
        example: '+1-555-0200',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business website',
        example: 'https://techparts.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary business address line 1',
        example: '456 Supplier Blvd',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2', example: 'Suite 200' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', example: 'San Francisco' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State/Province', example: 'CA' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal/ZIP code', example: '94105' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 20),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', example: 'USA' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum order value', example: 100.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], MerchantApplicationDto.prototype, "minimumOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping policy summary' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 1000),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "shippingPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Return policy summary' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 1000),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "returnPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax Identification Number for e-invoicing',
        example: 'TIN123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.tin && o.tin.length > 0),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "tin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of identification document',
        enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'],
        example: 'BRN',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['NRIC', 'BRN', 'PASSPORT', 'ARMY']),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Identification document number',
        example: '201501012345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.idValue && o.idValue.length > 0),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Opt-in for e-invoice submission',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MerchantApplicationDto.prototype, "eInvoiceOptIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password for merchant account',
        example: 'SecurePassword123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First name of the primary contact',
        example: 'John',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last name of the primary contact',
        example: 'Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MerchantApplicationDto.prototype, "lastName", void 0);
class MerchantApplicationResponseDto {
}
exports.MerchantApplicationResponseDto = MerchantApplicationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application ID' }),
    __metadata("design:type", String)
], MerchantApplicationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application status' }),
    __metadata("design:type", String)
], MerchantApplicationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application submission date' }),
    __metadata("design:type", Date)
], MerchantApplicationResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Next steps message' }),
    __metadata("design:type", String)
], MerchantApplicationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required documents list' }),
    __metadata("design:type", Array)
], MerchantApplicationResponseDto.prototype, "requiredDocuments", void 0);
class CheckApplicationStatusDto {
}
exports.CheckApplicationStatusDto = CheckApplicationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application ID' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business name' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current status' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status description' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "statusMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Submitted date' }),
    __metadata("design:type", Date)
], CheckApplicationStatusDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last updated date' }),
    __metadata("design:type", Date)
], CheckApplicationStatusDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval/rejection date' }),
    __metadata("design:type", Date)
], CheckApplicationStatusDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated completion date' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "estimatedCompletion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Admin notes or rejection reason' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rejection reason' }),
    __metadata("design:type", String)
], CheckApplicationStatusDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Next steps for the applicant' }),
    __metadata("design:type", Array)
], CheckApplicationStatusDto.prototype, "nextSteps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required documents checklist' }),
    __metadata("design:type", Array)
], CheckApplicationStatusDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Complete application data for editing' }),
    __metadata("design:type", Object)
], CheckApplicationStatusDto.prototype, "applicationData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether application can be edited' }),
    __metadata("design:type", Boolean)
], CheckApplicationStatusDto.prototype, "canEdit", void 0);
//# sourceMappingURL=merchant-application.dto.js.map