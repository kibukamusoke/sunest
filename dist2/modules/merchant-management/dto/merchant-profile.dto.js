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
exports.UpdateMerchantUserDto = exports.AddMerchantUserDto = exports.MerchantUserDto = exports.MerchantListDto = exports.UpdateMerchantProfileDto = exports.MerchantProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MerchantProfileDto {
}
exports.MerchantProfileDto = MerchantProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant business name' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display name' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business description' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Logo URL' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business type' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Website' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full address' }),
    __metadata("design:type", Object)
], MerchantProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business settings' }),
    __metadata("design:type", Object)
], MerchantProfileDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax Identification Number for e-invoicing',
        example: 'TIN123456789',
    }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "tin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of identification document',
        enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'],
        example: 'BRN',
    }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Identification document number',
        example: '201501012345',
    }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'E-invoice submission opt-in status',
        default: false,
    }),
    __metadata("design:type", Boolean)
], MerchantProfileDto.prototype, "eInvoiceOptIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account status' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is account active' }),
    __metadata("design:type", Boolean)
], MerchantProfileDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval date' }),
    __metadata("design:type", Date)
], MerchantProfileDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approved by user ID' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rejection reason' }),
    __metadata("design:type", String)
], MerchantProfileDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", Date)
], MerchantProfileDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], MerchantProfileDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant users count' }),
    __metadata("design:type", Number)
], MerchantProfileDto.prototype, "userCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Performance metrics' }),
    __metadata("design:type", Object)
], MerchantProfileDto.prototype, "metrics", void 0);
class UpdateMerchantProfileDto {
}
exports.UpdateMerchantProfileDto = UpdateMerchantProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Logo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Website' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'State' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum order value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateMerchantProfileDto.prototype, "minimumOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping policy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "shippingPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Return policy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "returnPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax Identification Number for e-invoicing',
        example: 'TIN123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "tin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of identification document',
        enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'],
        example: 'BRN',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['NRIC', 'BRN', 'PASSPORT', 'ARMY']),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Identification document number',
        example: '201501012345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantProfileDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'E-invoice submission opt-in status',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantProfileDto.prototype, "eInvoiceOptIn", void 0);
class MerchantListDto {
}
exports.MerchantListDto = MerchantListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of merchants' }),
    __metadata("design:type", Array)
], MerchantListDto.prototype, "merchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagination info' }),
    __metadata("design:type", Object)
], MerchantListDto.prototype, "pagination", void 0);
class MerchantUserDto {
}
exports.MerchantUserDto = MerchantUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], MerchantUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email' }),
    __metadata("design:type", String)
], MerchantUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display name' }),
    __metadata("design:type", String)
], MerchantUserDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role within merchant' }),
    __metadata("design:type", String)
], MerchantUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Permissions within merchant' }),
    __metadata("design:type", Object)
], MerchantUserDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is user active' }),
    __metadata("design:type", Boolean)
], MerchantUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Join date' }),
    __metadata("design:type", Date)
], MerchantUserDto.prototype, "joinedAt", void 0);
class AddMerchantUserDto {
}
exports.AddMerchantUserDto = AddMerchantUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email to add' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddMerchantUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role within merchant' }),
    (0, class_validator_1.IsEnum)(['admin', 'manager', 'user']),
    __metadata("design:type", String)
], AddMerchantUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage products' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddMerchantUserDto.prototype, "canManageProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage orders' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddMerchantUserDto.prototype, "canManageOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage pricing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddMerchantUserDto.prototype, "canManagePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can view analytics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddMerchantUserDto.prototype, "canViewAnalytics", void 0);
class UpdateMerchantUserDto {
}
exports.UpdateMerchantUserDto = UpdateMerchantUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role within merchant' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['admin', 'manager', 'user']),
    __metadata("design:type", String)
], UpdateMerchantUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage products' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantUserDto.prototype, "canManageProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage orders' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantUserDto.prototype, "canManageOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can manage pricing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantUserDto.prototype, "canManagePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can view analytics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantUserDto.prototype, "canViewAnalytics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is user active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMerchantUserDto.prototype, "isActive", void 0);
//# sourceMappingURL=merchant-profile.dto.js.map