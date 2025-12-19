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
exports.UpdateTicketDto = exports.TicketsListResponseDto = exports.CreateSupportTicketMessageDto = exports.CreateTicketMessageDto = exports.PublicTicketResponseDto = exports.TicketMessageResponseDto = exports.TicketResponseDto = exports.CreateTicketDto = exports.TicketPriority = exports.TicketStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["NORMAL"] = "NORMAL";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
class CreateTicketDto {
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ticket subject', example: 'Need help with an order' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed message describing the issue/request',
        example: 'My order HW-2024-000123 arrived with missing items...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer name', example: 'Jane Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer email', example: 'jane@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer phone number', example: '+60-12-3456789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related order number', example: 'HW-2024-000123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "orderNumber", void 0);
class TicketResponseDto {
}
exports.TicketResponseDto = TicketResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TCK-20251217-1A2B3C' }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "ticketNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Public token used to view/respond to the ticket without authentication (shared via email link).',
    }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "publicToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TicketStatus }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TicketPriority }),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TicketResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], TicketResponseDto.prototype, "assignedToId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TicketResponseDto.prototype, "updatedAt", void 0);
class TicketMessageResponseDto {
}
exports.TicketMessageResponseDto = TicketMessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TicketMessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CUSTOMER', 'SUPPORT'] }),
    __metadata("design:type", String)
], TicketMessageResponseDto.prototype, "authorType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TicketMessageResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TicketMessageResponseDto.prototype, "createdAt", void 0);
class PublicTicketResponseDto {
}
exports.PublicTicketResponseDto = PublicTicketResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicTicketResponseDto.prototype, "ticketNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TicketStatus }),
    __metadata("design:type", String)
], PublicTicketResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicTicketResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PublicTicketResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PublicTicketResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TicketMessageResponseDto] }),
    __metadata("design:type", Array)
], PublicTicketResponseDto.prototype, "messages", void 0);
class CreateTicketMessageDto {
}
exports.CreateTicketMessageDto = CreateTicketMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email used to verify ownership', example: 'jane@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTicketMessageDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional information / reply', example: 'Here are more details...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateTicketMessageDto.prototype, "message", void 0);
class CreateSupportTicketMessageDto {
}
exports.CreateSupportTicketMessageDto = CreateSupportTicketMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Support reply message', example: 'Thanks! Can you share a photo of the label?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateSupportTicketMessageDto.prototype, "message", void 0);
class TicketsListResponseDto {
}
exports.TicketsListResponseDto = TicketsListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TicketResponseDto] }),
    __metadata("design:type", Array)
], TicketsListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    __metadata("design:type", Number)
], TicketsListResponseDto.prototype, "total", void 0);
class UpdateTicketDto {
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TicketStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TicketStatus),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TicketPriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TicketPriority),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assign ticket to a user (admin)', example: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateTicketDto.prototype, "assignedToId", void 0);
//# sourceMappingURL=tickets.dto.js.map