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
exports.MetricDataResponseDto = exports.MetricDataQueryDto = exports.DataPointResponseDto = exports.CreateDataPointDto = exports.MetricListResponseDto = exports.MetricListQueryDto = exports.MetricResponseDto = exports.UpdateMetricDto = exports.CreateMetricDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMetricDto {
}
exports.CreateMetricDto = CreateMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MetricType, description: 'Metric type' }),
    (0, class_validator_1.IsEnum)(client_1.MetricType),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metric unit (e.g., USD, count, percentage)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Calculation formula' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data source table/view' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMetricDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric tags', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMetricDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is real-time metric' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMetricDto.prototype, "isRealTime", void 0);
class UpdateMetricDto {
}
exports.UpdateMetricDto = UpdateMetricDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric unit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Calculation formula' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMetricDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMetricDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric tags' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateMetricDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is active' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMetricDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is real-time metric' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMetricDto.prototype, "isRealTime", void 0);
class MetricResponseDto {
}
exports.MetricResponseDto = MetricResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric ID' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MetricType, description: 'Metric type' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric description' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric unit' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Calculation formula' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data source' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh rate in minutes' }),
    __metadata("design:type", Number)
], MetricResponseDto.prototype, "refreshRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is active' }),
    __metadata("design:type", Boolean)
], MetricResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is real-time metric' }),
    __metadata("design:type", Boolean)
], MetricResponseDto.prototype, "isRealTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric category' }),
    __metadata("design:type", String)
], MetricResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric tags' }),
    __metadata("design:type", Array)
], MetricResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], MetricResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], MetricResponseDto.prototype, "updatedAt", void 0);
class MetricListQueryDto {
}
exports.MetricListQueryDto = MetricListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MetricListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MetricListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.MetricType,
        description: 'Filter by metric type',
    }),
    (0, class_validator_1.IsEnum)(client_1.MetricType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MetricListQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MetricListQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MetricListQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by real-time status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MetricListQueryDto.prototype, "isRealTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MetricListQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by tag' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MetricListQueryDto.prototype, "tag", void 0);
class MetricListResponseDto {
}
exports.MetricListResponseDto = MetricListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MetricResponseDto], description: 'List of metrics' }),
    __metadata("design:type", Array)
], MetricListResponseDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], MetricListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], MetricListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page size' }),
    __metadata("design:type", Number)
], MetricListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], MetricListResponseDto.prototype, "totalPages", void 0);
class CreateDataPointDto {
}
exports.CreateDataPointDto = CreateDataPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data point value' }),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateDataPointDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp' }),
    __metadata("design:type", Date)
], CreateDataPointDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TimeGranularity, description: 'Time granularity' }),
    (0, class_validator_1.IsEnum)(client_1.TimeGranularity),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dimensions for filtering/grouping' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDataPointDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataPointDto.prototype, "orderId", void 0);
class DataPointResponseDto {
}
exports.DataPointResponseDto = DataPointResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data point ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data point value' }),
    __metadata("design:type", Number)
], DataPointResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp' }),
    __metadata("design:type", Date)
], DataPointResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TimeGranularity, description: 'Time granularity' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dimensions' }),
    __metadata("design:type", Object)
], DataPointResponseDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID' }),
    __metadata("design:type", String)
], DataPointResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], DataPointResponseDto.prototype, "createdAt", void 0);
class MetricDataQueryDto {
}
exports.MetricDataQueryDto = MetricDataQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date' }),
    __metadata("design:type", Date)
], MetricDataQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date' }),
    __metadata("design:type", Date)
], MetricDataQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.TimeGranularity,
        description: 'Data granularity',
    }),
    (0, class_validator_1.IsEnum)(client_1.TimeGranularity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MetricDataQueryDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter dimensions' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MetricDataQueryDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group by dimensions', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], MetricDataQueryDto.prototype, "groupBy", void 0);
class MetricDataResponseDto {
}
exports.MetricDataResponseDto = MetricDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric ID' }),
    __metadata("design:type", String)
], MetricDataResponseDto.prototype, "metricId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name' }),
    __metadata("design:type", String)
], MetricDataResponseDto.prototype, "metricName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data points', type: [DataPointResponseDto] }),
    __metadata("design:type", Array)
], MetricDataResponseDto.prototype, "dataPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Query parameters' }),
    __metadata("design:type", MetricDataQueryDto)
], MetricDataResponseDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total data points' }),
    __metadata("design:type", Number)
], MetricDataResponseDto.prototype, "totalPoints", void 0);
//# sourceMappingURL=metric.dto.js.map