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
exports.EventStatsDto = exports.ProcessEventDto = exports.EventListResponseDto = exports.EventListQueryDto = exports.EventResponseDto = exports.CreateEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EventType, description: 'Event type' }),
    (0, class_validator_1.IsEnum)(client_1.EventType),
    __metadata("design:type", String)
], CreateEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event-specific data' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEventDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who triggered the event' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related merchant ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related order ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related product ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationPriority,
        description: 'Event severity',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'System component that generated the event',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "userAgent", void 0);
class EventResponseDto {
}
exports.EventResponseDto = EventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EventType, description: 'Event type' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event title' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event description' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event-specific data' }),
    __metadata("design:type", Object)
], EventResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who triggered the event' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related merchant ID' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related order ID' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related product ID' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationPriority, description: 'Event severity' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'System component that generated the event',
    }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }),
    __metadata("design:type", String)
], EventResponseDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event processed status' }),
    __metadata("design:type", Boolean)
], EventResponseDto.prototype, "processed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When event was processed' }),
    __metadata("design:type", Date)
], EventResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], EventResponseDto.prototype, "createdAt", void 0);
class EventListQueryDto {
}
exports.EventListQueryDto = EventListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], EventListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], EventListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EventType, description: 'Filter by event type' }),
    (0, class_validator_1.IsEnum)(client_1.EventType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by user ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by product ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationPriority,
        description: 'Filter by severity',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by processed status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EventListQueryDto.prototype, "processed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter from date (ISO string)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter to date (ISO string)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventListQueryDto.prototype, "toDate", void 0);
class EventListResponseDto {
}
exports.EventListResponseDto = EventListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EventResponseDto], description: 'List of events' }),
    __metadata("design:type", Array)
], EventListResponseDto.prototype, "events", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], EventListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], EventListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], EventListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], EventListResponseDto.prototype, "totalPages", void 0);
class ProcessEventDto {
}
exports.ProcessEventDto = ProcessEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID to process' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProcessEventDto.prototype, "eventId", void 0);
class EventStatsDto {
}
exports.EventStatsDto = EventStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total events' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events by type' }),
    __metadata("design:type", Object)
], EventStatsDto.prototype, "byType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events by severity' }),
    __metadata("design:type", Object)
], EventStatsDto.prototype, "bySeverity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Processed events' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "processed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unprocessed events' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "unprocessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events in last 24 hours' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "last24Hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events in last 7 days' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "last7Days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events in last 30 days' }),
    __metadata("design:type", Number)
], EventStatsDto.prototype, "last30Days", void 0);
//# sourceMappingURL=event.dto.js.map