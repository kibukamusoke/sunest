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
exports.MerchantDocumentsListDto = exports.UpdateDocumentStatusDto = exports.MerchantDocumentDto = exports.CreateMerchantDocumentDto = exports.DocumentStatus = exports.DocumentType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DocumentType;
(function (DocumentType) {
    DocumentType["SSM"] = "SSM";
    DocumentType["BUSINESS_LICENSE"] = "BUSINESS_LICENSE";
    DocumentType["TAX_CERTIFICATE"] = "TAX_CERTIFICATE";
    DocumentType["BANK_STATEMENT"] = "BANK_STATEMENT";
    DocumentType["INSURANCE_CERTIFICATE"] = "INSURANCE_CERTIFICATE";
    DocumentType["MEMORANDUM_ARTICLES"] = "MEMORANDUM_ARTICLES";
    DocumentType["FORM_24"] = "FORM_24";
    DocumentType["FORM_44"] = "FORM_44";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["VERIFIED"] = "VERIFIED";
    DocumentStatus["REJECTED"] = "REJECTED";
    DocumentStatus["EXPIRED"] = "EXPIRED";
    DocumentStatus["RESUBMISSION"] = "RESUBMISSION";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
class CreateMerchantDocumentDto {
}
exports.CreateMerchantDocumentDto = CreateMerchantDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the uploaded file',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMerchantDocumentDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of document being uploaded',
        enum: DocumentType,
        example: DocumentType.SSM,
    }),
    (0, class_validator_1.IsEnum)(DocumentType),
    __metadata("design:type", String)
], CreateMerchantDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional description of the document',
        example: 'Company registration certificate from SSM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMerchantDocumentDto.prototype, "description", void 0);
class MerchantDocumentDto {
}
exports.MerchantDocumentDto = MerchantDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Merchant ID this document belongs to',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File information',
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            filename: 'ssm-certificate.pdf',
            mimetype: 'application/pdf',
            size: 1024000,
            url: 'https://storage.example.com/files/ssm-certificate.pdf',
        },
    }),
    __metadata("design:type", Object)
], MerchantDocumentDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of document',
        enum: DocumentType,
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document description',
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document verification status',
        enum: DocumentStatus,
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the document was verified',
    }),
    __metadata("design:type", Date)
], MerchantDocumentDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who verified the document',
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Admin notes about the document',
    }),
    __metadata("design:type", String)
], MerchantDocumentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the document was uploaded',
    }),
    __metadata("design:type", Date)
], MerchantDocumentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the document was last updated',
    }),
    __metadata("design:type", Date)
], MerchantDocumentDto.prototype, "updatedAt", void 0);
class UpdateDocumentStatusDto {
}
exports.UpdateDocumentStatusDto = UpdateDocumentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the document',
        enum: DocumentStatus,
    }),
    (0, class_validator_1.IsEnum)(DocumentStatus),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Admin notes about the status change',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "notes", void 0);
class MerchantDocumentsListDto {
}
exports.MerchantDocumentsListDto = MerchantDocumentsListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of merchant documents',
        type: [MerchantDocumentDto],
    }),
    __metadata("design:type", Array)
], MerchantDocumentsListDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of documents',
        example: 5,
    }),
    __metadata("design:type", Number)
], MerchantDocumentsListDto.prototype, "total", void 0);
//# sourceMappingURL=merchant-document.dto.js.map