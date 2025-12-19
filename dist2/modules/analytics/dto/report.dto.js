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
exports.ReportGenerationResponseDto = exports.GenerateReportDto = exports.ScheduleResponseDto = exports.UpdateScheduleDto = exports.CreateScheduleDto = exports.ReportListResponseDto = exports.ReportListQueryDto = exports.ReportResponseDto = exports.UpdateReportDto = exports.CreateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportType, description: 'Report type' }),
    (0, class_validator_1.IsEnum)(client_1.ReportType),
    __metadata("design:type", String)
], CreateReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ReportFormat, description: 'Report format' }),
    (0, class_validator_1.IsEnum)(client_1.ReportFormat),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report parameters/filters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report template ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "template", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email recipients', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric IDs to include', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "metricIds", void 0);
class UpdateReportDto {
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ReportFormat, description: 'Report format' }),
    (0, class_validator_1.IsEnum)(client_1.ReportFormat),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report parameters/filters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report template ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "template", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateReportDto.prototype, "recipients", void 0);
class ReportResponseDto {
}
exports.ReportResponseDto = ReportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report name' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report description' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportType, description: 'Report type' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportFormat, description: 'Report format' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportStatus, description: 'Report status' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report parameters/filters' }),
    __metadata("design:type", Object)
], ReportResponseDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report template ID' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "template", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is scheduled report' }),
    __metadata("design:type", Boolean)
], ReportResponseDto.prototype, "isScheduled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cron expression for scheduling' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created by user ID' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email recipients' }),
    __metadata("design:type", Array)
], ReportResponseDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generated file name' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], ReportResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'File storage path' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Download URL' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "downloadUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generation started at' }),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generation completed at' }),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if failed' }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "updatedAt", void 0);
class ReportListQueryDto {
}
exports.ReportListQueryDto = ReportListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ReportListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ReportListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ReportType,
        description: 'Filter by report type',
    }),
    (0, class_validator_1.IsEnum)(client_1.ReportType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportListQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ReportStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsEnum)(client_1.ReportStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by scheduled status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportListQueryDto.prototype, "isScheduled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportListQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by creator ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportListQueryDto.prototype, "createdBy", void 0);
class ReportListResponseDto {
}
exports.ReportListResponseDto = ReportListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReportResponseDto], description: 'List of reports' }),
    __metadata("design:type", Array)
], ReportListResponseDto.prototype, "reports", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], ReportListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], ReportListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], ReportListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], ReportListResponseDto.prototype, "totalPages", void 0);
class CreateScheduleDto {
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cron expression' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email recipients', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateScheduleDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email subject' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "message", void 0);
class UpdateScheduleDto {
}
exports.UpdateScheduleDto = UpdateScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cron expression' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is active' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateScheduleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateScheduleDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email subject' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "message", void 0);
class ScheduleResponseDto {
}
exports.ScheduleResponseDto = ScheduleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule ID' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule name' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cron expression' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timezone' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is active' }),
    __metadata("design:type", Boolean)
], ScheduleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email recipients' }),
    __metadata("design:type", Array)
], ScheduleResponseDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email subject' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email message' }),
    __metadata("design:type", String)
], ScheduleResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last run timestamp' }),
    __metadata("design:type", Date)
], ScheduleResponseDto.prototype, "lastRun", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next run timestamp' }),
    __metadata("design:type", Date)
], ScheduleResponseDto.prototype, "nextRun", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Run count' }),
    __metadata("design:type", Number)
], ScheduleResponseDto.prototype, "runCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Failure count' }),
    __metadata("design:type", Number)
], ScheduleResponseDto.prototype, "failureCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ScheduleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], ScheduleResponseDto.prototype, "updatedAt", void 0);
class GenerateReportDto {
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Override parameters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Send to additional recipients' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "additionalRecipients", void 0);
class ReportGenerationResponseDto {
}
exports.ReportGenerationResponseDto = ReportGenerationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generation job ID' }),
    __metadata("design:type", String)
], ReportGenerationResponseDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    __metadata("design:type", String)
], ReportGenerationResponseDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated completion time' }),
    __metadata("design:type", Date)
], ReportGenerationResponseDto.prototype, "estimatedCompletion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status check URL' }),
    __metadata("design:type", String)
], ReportGenerationResponseDto.prototype, "statusUrl", void 0);
//# sourceMappingURL=report.dto.js.map