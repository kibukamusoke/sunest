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
exports.BulkNotificationDto = exports.UpdateNotificationDto = exports.NotificationListResponseDto = exports.NotificationListQueryDto = exports.NotificationResponseDto = exports.CreateNotificationDto = exports.NotificationType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
var NotificationType;
(function (NotificationType) {
    NotificationType["INFO"] = "INFO";
    NotificationType["WARNING"] = "WARNING";
    NotificationType["ERROR"] = "ERROR";
    NotificationType["SUCCESS"] = "SUCCESS";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional data payload' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationChannel,
        description: 'Notification channel',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationChannel),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationCategory,
        description: 'Notification category',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationPriority,
        description: 'Notification priority',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recipient user ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recipient email (for external notifications)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recipient phone (for SMS notifications)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template ID to use' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated event ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EventType, description: 'Event type' }),
    (0, class_validator_1.IsEnum)(client_1.EventType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule notification for later' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notification expiration time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group ID for related notifications' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "groupId", void 0);
class NotificationResponseDto {
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional data payload' }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationChannel,
        description: 'Notification channel',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationCategory,
        description: 'Notification category',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationPriority,
        description: 'Notification priority',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationStatus, description: 'Notification status' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When notification was sent' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When notification was delivered' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "deliveredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When notification was read' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "readAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Failure reason if failed' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "failureReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Retry count' }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "retryCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recipient user ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recipient email' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recipient phone' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EventType, description: 'Event type' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled time' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration time' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "updatedAt", void 0);
class NotificationListQueryDto {
}
exports.NotificationListQueryDto = NotificationListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationChannel,
        description: 'Filter by channel',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationChannel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by recipient ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by group ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter from date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter to date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "toDate", void 0);
class NotificationListResponseDto {
}
exports.NotificationListResponseDto = NotificationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [NotificationResponseDto],
        description: 'List of notifications',
    }),
    __metadata("design:type", Array)
], NotificationListResponseDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "totalPages", void 0);
class UpdateNotificationDto {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationStatus,
        description: 'Update notification status',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mark as read' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "markAsRead", void 0);
class BulkNotificationDto {
}
exports.BulkNotificationDto = BulkNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Recipient IDs' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BulkNotificationDto.prototype, "recipientIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional data payload' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BulkNotificationDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationChannel,
        description: 'Notification channel',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationChannel),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NotificationCategory,
        description: 'Notification category',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationPriority,
        description: 'Notification priority',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template ID to use' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "templateId", void 0);
//# sourceMappingURL=notification.dto.js.map