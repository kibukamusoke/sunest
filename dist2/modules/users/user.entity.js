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
exports.User = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class User {
    constructor(partial) {
        Object.assign(this, partial);
    }
    get isSystemAdmin() {
        return this.roles?.some((role) => role.name === 'system_admin') || false;
    }
    get isMerchantAdmin() {
        return this.roles?.some((role) => role.name === 'merchant_admin') || false;
    }
    get isMerchantUser() {
        return this.roles?.some((role) => role.name === 'merchant_user') || false;
    }
    get isBuyer() {
        return this.roles?.some((role) => role.name === 'buyer') || false;
    }
    get primaryRole() {
        if (this.isSystemAdmin)
            return 'system_admin';
        if (this.isMerchantAdmin)
            return 'merchant_admin';
        if (this.isMerchantUser)
            return 'merchant_user';
        if (this.isBuyer)
            return 'buyer';
        return 'unknown';
    }
    get fullName() {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        }
        return this.displayName || this.email;
    }
    hasRole(roleName) {
        return this.roles?.some((role) => role.name === roleName) || false;
    }
    getRoleNames() {
        return this.roles?.map((role) => role.name) || [];
    }
    belongsToCompany(companyId) {
        return this.companies?.some((uc) => uc.id === companyId) || false;
    }
    belongsToMerchant(merchantId) {
        return this.merchants?.some((um) => um.id === merchantId) || false;
    }
    toPublicUser() {
        const { password, refreshToken, verifyToken, resetToken, ...publicUser } = this;
        return publicUser;
    }
}
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User display name',
        example: 'John Doe',
    }),
    __metadata("design:type", Object)
], User.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User first name', example: 'John' }),
    __metadata("design:type", Object)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User last name', example: 'Doe' }),
    __metadata("design:type", Object)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1-555-0123',
    }),
    __metadata("design:type", Object)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to user avatar image',
        example: 'https://example.com/avatar.jpg',
    }),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user account is active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether user email is verified',
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "verifyToken", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "resetToken", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "resetTokenExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Authentication provider (local, google, github)',
        example: 'local',
    }),
    __metadata("design:type", Object)
], User.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID from auth provider',
        example: '123456789',
    }),
    __metadata("design:type", Object)
], User.prototype, "providerId", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User job title',
        example: 'Procurement Manager',
    }),
    __metadata("design:type", Object)
], User.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department user works in',
        example: 'Operations',
    }),
    __metadata("design:type", Object)
], User.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum order amount user can approve',
        example: 50000,
    }),
    __metadata("design:type", Object)
], User.prototype, "approvalLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of identification document',
        enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'],
        example: 'NRIC',
    }),
    __metadata("design:type", Object)
], User.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Identification document number',
        example: '800101141234',
    }),
    __metadata("design:type", Object)
], User.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User roles', type: [Object] }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Companies this user belongs to',
        type: [Object],
    }),
    __metadata("design:type", Array)
], User.prototype, "companies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchants this user belongs to',
        type: [Object],
    }),
    __metadata("design:type", Array)
], User.prototype, "merchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account creation date' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account last updated date' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
//# sourceMappingURL=user.entity.js.map