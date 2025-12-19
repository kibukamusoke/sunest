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
exports.UpdateSystemConfigurationsDto = exports.SystemConfigurationsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SystemConfigurationsResponseDto {
}
exports.SystemConfigurationsResponseDto = SystemConfigurationsResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'WhatsApp number (E.164 preferred).',
        example: '+60123456789',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Application name shown in the storefront.',
        example: 'Intelibuy',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "applicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Primary phone number shown in the storefront.',
        example: '+60-123456789',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Primary email address shown in the storefront.',
        example: 'sales@intelibuy.com',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "emailAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Canonical site URL used for building links (ticket links, share links, etc).',
        example: 'https://www.intelibuy.my',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "siteUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Business address shown in the storefront (footer, contact pages). Can be multi-line.',
        example: 'Lot 56, Jalan Gasing 2\nPetaling Jaya, Selangor, Malaysia',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        nullable: true,
        description: 'Business hours shown in the storefront. Can be multi-line.',
        example: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        nullable: true,
        description: 'Home page banner image URLs (ordered). These power the home page carousel.',
        example: [
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000000-abc123.jpg',
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000001-def456.jpg',
        ],
    }),
    __metadata("design:type", Object)
], SystemConfigurationsResponseDto.prototype, "homeBannerImages", void 0);
class UpdateSystemConfigurationsDto {
}
exports.UpdateSystemConfigurationsDto = UpdateSystemConfigurationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'WhatsApp number (E.164 preferred).',
        example: '+60123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Application name shown in the storefront.',
        example: 'Intelibuy',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "applicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Primary phone number shown in the storefront.',
        example: '+60-123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Primary email address shown in the storefront.',
        example: 'sales@intelibuy.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "emailAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Canonical site URL used for building links (ticket links, share links, etc).',
        example: 'https://www.intelibuy.my',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "siteUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Business address shown in the storefront (footer, contact pages). Can be multi-line.',
        example: 'Lot 56, Jalan Gasing 2\nPetaling Jaya, Selangor, Malaysia',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Business hours shown in the storefront. Can be multi-line.',
        example: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSystemConfigurationsDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Home page banner image URLs (ordered). These power the home page carousel.',
        example: [
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000000-abc123.jpg',
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000001-def456.jpg',
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSystemConfigurationsDto.prototype, "homeBannerImages", void 0);
//# sourceMappingURL=system-configurations.dto.js.map