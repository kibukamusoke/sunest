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
exports.BulkPreferenceUpdateDto = exports.PreferenceResponseDto = exports.UpdatePreferenceDto = exports.CreatePreferenceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePreferenceDto {
}
exports.CreatePreferenceDto = CreatePreferenceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationCategory,
        description: 'Notification category',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    __metadata("design:type", String)
], CreatePreferenceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationChannel,
        isArray: true,
        description: 'Preferred channels',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.NotificationChannel, { each: true }),
    __metadata("design:type", Array)
], CreatePreferenceDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable email notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePreferenceDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable SMS notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePreferenceDto.prototype, "smsEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable push notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePreferenceDto.prototype, "pushEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable in-app notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePreferenceDto.prototype, "inAppEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours start time (HH:mm format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePreferenceDto.prototype, "quietHoursStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours end time (HH:mm format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePreferenceDto.prototype, "quietHoursEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePreferenceDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Receive email digest instead of individual emails',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePreferenceDto.prototype, "emailDigest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Digest frequency (daily, weekly)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePreferenceDto.prototype, "digestFrequency", void 0);
class UpdatePreferenceDto {
}
exports.UpdatePreferenceDto = UpdatePreferenceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationChannel,
        isArray: true,
        description: 'Preferred channels',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.NotificationChannel, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdatePreferenceDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable email notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable SMS notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "smsEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable push notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "pushEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable in-app notifications' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "inAppEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours start time (HH:mm format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferenceDto.prototype, "quietHoursStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours end time (HH:mm format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferenceDto.prototype, "quietHoursEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferenceDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Receive email digest instead of individual emails',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "emailDigest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Digest frequency (daily, weekly)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferenceDto.prototype, "digestFrequency", void 0);
class PreferenceResponseDto {
}
exports.PreferenceResponseDto = PreferenceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preference ID' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationCategory,
        description: 'Notification category',
    }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationChannel,
        isArray: true,
        description: 'Preferred channels',
    }),
    __metadata("design:type", Array)
], PreferenceResponseDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email notifications enabled' }),
    __metadata("design:type", Boolean)
], PreferenceResponseDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS notifications enabled' }),
    __metadata("design:type", Boolean)
], PreferenceResponseDto.prototype, "smsEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notifications enabled' }),
    __metadata("design:type", Boolean)
], PreferenceResponseDto.prototype, "pushEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'In-app notifications enabled' }),
    __metadata("design:type", Boolean)
], PreferenceResponseDto.prototype, "inAppEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours start time' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "quietHoursStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quiet hours end time' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "quietHoursEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User timezone' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email digest enabled' }),
    __metadata("design:type", Boolean)
], PreferenceResponseDto.prototype, "emailDigest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Digest frequency' }),
    __metadata("design:type", String)
], PreferenceResponseDto.prototype, "digestFrequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], PreferenceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], PreferenceResponseDto.prototype, "updatedAt", void 0);
class BulkPreferenceUpdateDto {
}
exports.BulkPreferenceUpdateDto = BulkPreferenceUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [UpdatePreferenceDto],
        description: 'Array of preference updates by category',
    }),
    __metadata("design:type", Array)
], BulkPreferenceUpdateDto.prototype, "preferences", void 0);
//# sourceMappingURL=preference.dto.js.map