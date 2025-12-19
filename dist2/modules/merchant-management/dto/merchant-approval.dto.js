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
exports.MerchantAuditLogResponseDto = exports.MerchantAuditLogDto = exports.MerchantDocumentResponseDto = exports.MerchantDocumentDto = exports.MerchantStatusUpdateDto = exports.MerchantRejectionDto = exports.MerchantApprovalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MerchantApprovalDto {
}
exports.MerchantApprovalDto = MerchantApprovalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval notes from admin',
        example: 'All documents verified and business credentials confirmed.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantApprovalDto.prototype, "approvalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a conditional approval with restrictions',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MerchantApprovalDto.prototype, "conditionalApproval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of restrictions or conditions for approval',
        example: [
            'Limited to electronics category',
            'Maximum 100 products initially',
        ],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MerchantApprovalDto.prototype, "restrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Approval effective date (defaults to now)',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MerchantApprovalDto.prototype, "approvalDate", void 0);
class MerchantRejectionDto {
}
exports.MerchantRejectionDto = MerchantRejectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary reason for rejection',
        example: 'incomplete_documentation',
        enum: [
            'incomplete_documentation',
            'invalid_business_license',
            'failed_verification',
            'duplicate_application',
            'business_type_not_supported',
            'geographic_restrictions',
            'other',
        ],
    }),
    (0, class_validator_1.IsEnum)([
        'incomplete_documentation',
        'invalid_business_license',
        'failed_verification',
        'duplicate_application',
        'business_type_not_supported',
        'geographic_restrictions',
        'other',
    ]),
    __metadata("design:type", String)
], MerchantRejectionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed explanation for rejection',
        example: 'Business license document is expired. Please submit a current license.',
        minLength: 20,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(20, 1000),
    __metadata("design:type", String)
], MerchantRejectionDto.prototype, "rejectionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether merchant can reapply after addressing issues',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MerchantRejectionDto.prototype, "canReapply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific documents or information needed for reapplication',
        example: ['Current business license', 'Updated tax registration'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MerchantRejectionDto.prototype, "requiredForReapplication", void 0);
class MerchantStatusUpdateDto {
}
exports.MerchantStatusUpdateDto = MerchantStatusUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the merchant',
        example: 'SUSPENDED',
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE'],
    }),
    (0, class_validator_1.IsEnum)(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE']),
    __metadata("design:type", String)
], MerchantStatusUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for status change',
        example: 'Temporary suspension due to policy violations',
        minLength: 10,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], MerchantStatusUpdateDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the status change',
        example: 'Merchant will be contacted via email with details',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], MerchantStatusUpdateDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Effective date of status change (defaults to now)',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MerchantStatusUpdateDto.prototype, "effectiveDate", void 0);
class MerchantDocumentDto {
}
exports.MerchantDocumentDto = MerchantDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document type',
        example: 'business_license',
        enum: [
            'business_license',
            'tax_certificate',
            'insurance_certificate',
            'bank_verification',
            'signatory_authorization',
            'compliance_certificate',
            'other',
        ],
    }),
    (0, class_validator_1.IsEnum)([
        'business_license',
        'tax_certificate',
        'insurance_certificate',
        'bank_verification',
        'signatory_authorization',
        'compliance_certificate',
        'other',
    ]),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document description',
        example: 'Official business license certificate',
        minLength: 1,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document expiry date (if applicable)',
        example: '2025-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MerchantDocumentDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document issuing authority',
        example: 'California Department of Consumer Affairs',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "issuingAuthority", void 0);
class MerchantDocumentResponseDto {
}
exports.MerchantDocumentResponseDto = MerchantDocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document ID' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document type' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document description' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Upload date' }),
    __metadata("design:type", Date)
], MerchantDocumentResponseDto.prototype, "uploadedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File URL' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiry date' }),
    __metadata("design:type", Date)
], MerchantDocumentResponseDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Issuing authority' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "issuingAuthority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification status',
        enum: ['pending', 'verified', 'rejected', 'expired'],
    }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification notes' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "verificationNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verified by admin ID' }),
    __metadata("design:type", String)
], MerchantDocumentResponseDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification date' }),
    __metadata("design:type", Date)
], MerchantDocumentResponseDto.prototype, "verifiedAt", void 0);
class MerchantAuditLogDto {
}
exports.MerchantAuditLogDto = MerchantAuditLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Audit log entry ID' }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action performed',
        example: 'status_change',
        enum: [
            'application_submitted',
            'document_uploaded',
            'status_change',
            'profile_updated',
            'user_added',
            'user_removed',
            'document_verified',
            'note_added',
        ],
    }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Details of the action',
        example: 'Status changed from PENDING to APPROVED',
    }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who performed the action' }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User details' }),
    __metadata("design:type", Object)
], MerchantAuditLogDto.prototype, "performedByUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Previous value (for updates)' }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "previousValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New value (for updates)' }),
    __metadata("design:type", String)
], MerchantAuditLogDto.prototype, "newValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of action' }),
    __metadata("design:type", Date)
], MerchantAuditLogDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    __metadata("design:type", Object)
], MerchantAuditLogDto.prototype, "metadata", void 0);
class MerchantAuditLogResponseDto {
}
exports.MerchantAuditLogResponseDto = MerchantAuditLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of audit log entries',
        type: [MerchantAuditLogDto],
    }),
    __metadata("design:type", Array)
], MerchantAuditLogResponseDto.prototype, "logs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagination information' }),
    __metadata("design:type", Object)
], MerchantAuditLogResponseDto.prototype, "pagination", void 0);
//# sourceMappingURL=merchant-approval.dto.js.map