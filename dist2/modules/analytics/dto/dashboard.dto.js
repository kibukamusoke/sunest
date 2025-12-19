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
exports.WidgetDataDto = exports.DashboardWithWidgetsDto = exports.DashboardListResponseDto = exports.DashboardListQueryDto = exports.WidgetResponseDto = exports.UpdateWidgetDto = exports.CreateWidgetDto = exports.DashboardResponseDto = exports.UpdateDashboardDto = exports.CreateDashboardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDashboardDto {
}
exports.CreateDashboardDto = CreateDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DashboardType, description: 'Dashboard type' }),
    (0, class_validator_1.IsEnum)(client_1.DashboardType),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget layout configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDashboardDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is dashboard public' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDashboardDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User IDs with access', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDashboardDto.prototype, "sharedWith", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Roles that can access dashboard',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDashboardDto.prototype, "allowedRoles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDashboardDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default date range' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDashboardDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto refresh enabled' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDashboardDto.prototype, "autoRefresh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard tags', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDashboardDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is template dashboard' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDashboardDto.prototype, "isTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Source template ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "templateSource", void 0);
class UpdateDashboardDto {
}
exports.UpdateDashboardDto = UpdateDashboardDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget layout configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDashboardDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is dashboard public' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDashboardDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User IDs with access' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDashboardDto.prototype, "sharedWith", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Roles that can access dashboard' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDashboardDto.prototype, "allowedRoles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDashboardDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default date range' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDashboardDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto refresh enabled' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDashboardDto.prototype, "autoRefresh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard tags' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDashboardDto.prototype, "tags", void 0);
class DashboardResponseDto {
}
exports.DashboardResponseDto = DashboardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard ID' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard name' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard description' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DashboardType, description: 'Dashboard type' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget layout configuration' }),
    __metadata("design:type", Object)
], DashboardResponseDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner ID' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is dashboard public' }),
    __metadata("design:type", Boolean)
], DashboardResponseDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User IDs with access' }),
    __metadata("design:type", Array)
], DashboardResponseDto.prototype, "sharedWith", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Roles that can access dashboard' }),
    __metadata("design:type", Array)
], DashboardResponseDto.prototype, "allowedRoles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refresh rate in seconds' }),
    __metadata("design:type", Number)
], DashboardResponseDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default date range' }),
    __metadata("design:type", Object)
], DashboardResponseDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Auto refresh enabled' }),
    __metadata("design:type", Boolean)
], DashboardResponseDto.prototype, "autoRefresh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is template dashboard' }),
    __metadata("design:type", Boolean)
], DashboardResponseDto.prototype, "isTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Source template ID' }),
    __metadata("design:type", String)
], DashboardResponseDto.prototype, "templateSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard tags' }),
    __metadata("design:type", Array)
], DashboardResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget count' }),
    __metadata("design:type", Number)
], DashboardResponseDto.prototype, "widgetCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], DashboardResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], DashboardResponseDto.prototype, "updatedAt", void 0);
class CreateWidgetDto {
}
exports.CreateWidgetDto = CreateWidgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "dashboardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ChartType, description: 'Chart type' }),
    (0, class_validator_1.IsEnum)(client_1.ChartType),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget position and size' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget order' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWidgetDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom data query configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "dataQuery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chart-specific configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "chartConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget-specific filters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWidgetDto.prototype, "refreshRate", void 0);
class UpdateWidgetDto {
}
exports.UpdateWidgetDto = UpdateWidgetDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWidgetDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWidgetDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget position and size' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateWidgetDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget order' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateWidgetDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWidgetDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom data query configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateWidgetDto.prototype, "dataQuery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chart-specific configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateWidgetDto.prototype, "chartConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget-specific filters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateWidgetDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateWidgetDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is widget visible' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateWidgetDto.prototype, "isVisible", void 0);
class WidgetResponseDto {
}
exports.WidgetResponseDto = WidgetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget ID' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard ID' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "dashboardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget title' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ChartType, description: 'Chart type' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget description' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget position and size' }),
    __metadata("design:type", Object)
], WidgetResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget order' }),
    __metadata("design:type", Number)
], WidgetResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric ID' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom data query configuration' }),
    __metadata("design:type", Object)
], WidgetResponseDto.prototype, "dataQuery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chart-specific configuration' }),
    __metadata("design:type", Object)
], WidgetResponseDto.prototype, "chartConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Widget-specific filters' }),
    __metadata("design:type", Object)
], WidgetResponseDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refresh rate in seconds' }),
    __metadata("design:type", Number)
], WidgetResponseDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is widget visible' }),
    __metadata("design:type", Boolean)
], WidgetResponseDto.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], WidgetResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], WidgetResponseDto.prototype, "updatedAt", void 0);
class DashboardListQueryDto {
}
exports.DashboardListQueryDto = DashboardListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DashboardListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DashboardListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.DashboardType,
        description: 'Filter by dashboard type',
    }),
    (0, class_validator_1.IsEnum)(client_1.DashboardType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardListQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by public status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardListQueryDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by template status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardListQueryDto.prototype, "isTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardListQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by tag' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardListQueryDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by owner ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardListQueryDto.prototype, "ownerId", void 0);
class DashboardListResponseDto {
}
exports.DashboardListResponseDto = DashboardListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [DashboardResponseDto],
        description: 'List of dashboards',
    }),
    __metadata("design:type", Array)
], DashboardListResponseDto.prototype, "dashboards", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], DashboardListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], DashboardListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], DashboardListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], DashboardListResponseDto.prototype, "totalPages", void 0);
class DashboardWithWidgetsDto extends DashboardResponseDto {
}
exports.DashboardWithWidgetsDto = DashboardWithWidgetsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WidgetResponseDto], description: 'Dashboard widgets' }),
    __metadata("design:type", Array)
], DashboardWithWidgetsDto.prototype, "widgets", void 0);
class WidgetDataDto {
}
exports.WidgetDataDto = WidgetDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget ID' }),
    __metadata("design:type", String)
], WidgetDataDto.prototype, "widgetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget data' }),
    __metadata("design:type", Object)
], WidgetDataDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data timestamp' }),
    __metadata("design:type", Date)
], WidgetDataDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if data fetch failed' }),
    __metadata("design:type", String)
], WidgetDataDto.prototype, "error", void 0);
//# sourceMappingURL=dashboard.dto.js.map