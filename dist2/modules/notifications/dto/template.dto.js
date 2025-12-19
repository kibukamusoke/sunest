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
exports.RenderedTemplateDto = exports.RenderTemplateDto = exports.TemplateListResponseDto = exports.TemplateListQueryDto = exports.TemplateResponseDto = exports.UpdateTemplateDto = exports.CreateTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTemplateDto {
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name/identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EmailTemplateType, description: 'Template type' }),
    (0, class_validator_1.IsEnum)(client_1.EmailTemplateType),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationCategory, description: 'Template category' }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plain text body template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'HTML body template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "bodyHtml", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Available template variables' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template active status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isActive", void 0);
class UpdateTemplateDto {
}
exports.UpdateTemplateDto = UpdateTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template name/identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email subject template' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plain text body template' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML body template' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "bodyHtml", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Available template variables' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template active status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTemplateDto.prototype, "isActive", void 0);
class TemplateResponseDto {
}
exports.TemplateResponseDto = TemplateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template ID' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name/identifier' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EmailTemplateType, description: 'Template type' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationCategory, description: 'Template category' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject template' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plain text body template' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'HTML body template' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "bodyHtml", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Available template variables' }),
    __metadata("design:type", Object)
], TemplateResponseDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template description' }),
    __metadata("design:type", String)
], TemplateResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template active status' }),
    __metadata("design:type", Boolean)
], TemplateResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template version' }),
    __metadata("design:type", Number)
], TemplateResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], TemplateResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], TemplateResponseDto.prototype, "updatedAt", void 0);
class TemplateListQueryDto {
}
exports.TemplateListQueryDto = TemplateListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TemplateListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TemplateListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.EmailTemplateType,
        description: 'Filter by type',
    }),
    (0, class_validator_1.IsEnum)(client_1.EmailTemplateType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TemplateListQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.NotificationCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsEnum)(client_1.NotificationCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TemplateListQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TemplateListQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TemplateListQueryDto.prototype, "search", void 0);
class TemplateListResponseDto {
}
exports.TemplateListResponseDto = TemplateListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TemplateResponseDto],
        description: 'List of templates',
    }),
    __metadata("design:type", Array)
], TemplateListResponseDto.prototype, "templates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], TemplateListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], TemplateListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], TemplateListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], TemplateListResponseDto.prototype, "totalPages", void 0);
class RenderTemplateDto {
}
exports.RenderTemplateDto = RenderTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template data/variables' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RenderTemplateDto.prototype, "data", void 0);
class RenderedTemplateDto {
}
exports.RenderedTemplateDto = RenderedTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rendered subject' }),
    __metadata("design:type", String)
], RenderedTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rendered plain text body' }),
    __metadata("design:type", String)
], RenderedTemplateDto.prototype, "bodyText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rendered HTML body' }),
    __metadata("design:type", String)
], RenderedTemplateDto.prototype, "bodyHtml", void 0);
//# sourceMappingURL=template.dto.js.map