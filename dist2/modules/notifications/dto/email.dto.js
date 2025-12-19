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
exports.EmailStatsDto = exports.EmailQueueListResponseDto = exports.EmailQueueListQueryDto = exports.EmailQueueResponseDto = exports.QueueEmailDto = exports.EmailTemplateDto = exports.EmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class EmailDto {
}
exports.EmailDto = EmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], description: 'Email recipients' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], EmailDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'CC recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailDto.prototype, "cc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'BCC recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailDto.prototype, "bcc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plain text email body' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML email body' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailDto.prototype, "html", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'Email attachments' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailDto.prototype, "attachments", void 0);
class EmailTemplateDto {
}
exports.EmailTemplateDto = EmailTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], description: 'Email recipients' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], EmailTemplateDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'CC recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailTemplateDto.prototype, "cc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'BCC recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailTemplateDto.prototype, "bcc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name/identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailTemplateDto.prototype, "templateName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template variables' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], EmailTemplateDto.prototype, "templateVars", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'Email attachments' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EmailTemplateDto.prototype, "attachments", void 0);
class QueueEmailDto {
}
exports.QueueEmailDto = QueueEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'From email address' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "fromEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'From name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "fromName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'To email address' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "toEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'To name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "toName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plain text body' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML body' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "bodyHtml", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'CC email addresses' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], QueueEmailDto.prototype, "ccEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'BCC email addresses' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], QueueEmailDto.prototype, "bccEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'Email attachments' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], QueueEmailDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related notification ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "notificationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule email for later' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email expiration time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueEmailDto.prototype, "expiresAt", void 0);
class EmailQueueResponseDto {
}
exports.EmailQueueResponseDto = EmailQueueResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email queue ID' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'From email address' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "fromEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'From name' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "fromName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'To email address' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "toEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'To name' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "toName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plain text body' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML body' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "bodyHtml", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'CC email addresses' }),
    __metadata("design:type", Array)
], EmailQueueResponseDto.prototype, "ccEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'BCC email addresses' }),
    __metadata("design:type", Array)
], EmailQueueResponseDto.prototype, "bccEmails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'Email attachments' }),
    __metadata("design:type", Array)
], EmailQueueResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationStatus, description: 'Email status' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When email was sent' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When email was delivered' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "deliveredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When email was opened' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "openedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When email was clicked' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "clickedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When email bounced' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "bouncedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Failure reason if failed' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "failureReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Retry count' }),
    __metadata("design:type", Number)
], EmailQueueResponseDto.prototype, "retryCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum retries' }),
    __metadata("design:type", Number)
], EmailQueueResponseDto.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related notification ID' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "notificationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled time' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration time' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email provider' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider message ID' }),
    __metadata("design:type", String)
], EmailQueueResponseDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider-specific data' }),
    __metadata("design:type", Object)
], EmailQueueResponseDto.prototype, "providerData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], EmailQueueResponseDto.prototype, "updatedAt", void 0);
class EmailQueueListQueryDto {
}
exports.EmailQueueListQueryDto = EmailQueueListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmailQueueListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmailQueueListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by to email' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "toEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by from email' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "fromEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by subject (contains)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter from date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter to date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailQueueListQueryDto.prototype, "toDate", void 0);
class EmailQueueListResponseDto {
}
exports.EmailQueueListResponseDto = EmailQueueListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [EmailQueueResponseDto],
        description: 'List of queued emails',
    }),
    __metadata("design:type", Array)
], EmailQueueListResponseDto.prototype, "emails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], EmailQueueListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], EmailQueueListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], EmailQueueListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], EmailQueueListResponseDto.prototype, "totalPages", void 0);
class EmailStatsDto {
}
exports.EmailStatsDto = EmailStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total emails sent' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "totalSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emails delivered' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "delivered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emails opened' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "opened", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emails clicked' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "clicked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emails bounced' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "bounced", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emails failed' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery rate (%)' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "deliveryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Open rate (%)' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "openRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Click rate (%)' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "clickRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bounce rate (%)' }),
    __metadata("design:type", Number)
], EmailStatsDto.prototype, "bounceRate", void 0);
//# sourceMappingURL=email.dto.js.map