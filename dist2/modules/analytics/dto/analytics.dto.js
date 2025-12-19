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
exports.AnalyticsQueryDto = exports.AnalyticsOverviewDto = exports.BusinessMetricResponseDto = exports.BusinessMetricQueryDto = exports.AnalyticsEventResponseDto = exports.CreateAnalyticsEventDto = exports.AnalyticsSessionResponseDto = exports.UpdateAnalyticsSessionDto = exports.CreateAnalyticsSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAnalyticsSessionDto {
}
exports.CreateAnalyticsSessionDto = CreateAnalyticsSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "deviceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Browser type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "browserType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Platform' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session start time' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsSessionDto.prototype, "merchantId", void 0);
class UpdateAnalyticsSessionDto {
}
exports.UpdateAnalyticsSessionDto = UpdateAnalyticsSessionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session end time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAnalyticsSessionDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session duration in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAnalyticsSessionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page views count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAnalyticsSessionDto.prototype, "pageViews", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Events count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAnalyticsSessionDto.prototype, "eventCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID if purchase made' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAnalyticsSessionDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Revenue generated' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAnalyticsSessionDto.prototype, "revenue", void 0);
class AnalyticsSessionResponseDto {
}
exports.AnalyticsSessionResponseDto = AnalyticsSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique session identifier' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device type' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "deviceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Browser type' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "browserType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Platform' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session start time' }),
    __metadata("design:type", Date)
], AnalyticsSessionResponseDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session end time' }),
    __metadata("design:type", Date)
], AnalyticsSessionResponseDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session duration in seconds' }),
    __metadata("design:type", Number)
], AnalyticsSessionResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page views count' }),
    __metadata("design:type", Number)
], AnalyticsSessionResponseDto.prototype, "pageViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Events count' }),
    __metadata("design:type", Number)
], AnalyticsSessionResponseDto.prototype, "eventCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID' }),
    __metadata("design:type", String)
], AnalyticsSessionResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Revenue generated' }),
    __metadata("design:type", Number)
], AnalyticsSessionResponseDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], AnalyticsSessionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], AnalyticsSessionResponseDto.prototype, "updatedAt", void 0);
class CreateAnalyticsEventDto {
}
exports.CreateAnalyticsEventDto = CreateAnalyticsEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "eventName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event action' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event label' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAnalyticsEventDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "pageTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referrer URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom properties' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAnalyticsEventDto.prototype, "properties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event timestamp' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "timestamp", void 0);
class AnalyticsEventResponseDto {
}
exports.AnalyticsEventResponseDto = AnalyticsEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event type' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event name' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "eventName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event category' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event action' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event label' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event value' }),
    __metadata("design:type", Number)
], AnalyticsEventResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page URL' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page title' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "pageTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referrer URL' }),
    __metadata("design:type", String)
], AnalyticsEventResponseDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom properties' }),
    __metadata("design:type", Object)
], AnalyticsEventResponseDto.prototype, "properties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event timestamp' }),
    __metadata("design:type", Date)
], AnalyticsEventResponseDto.prototype, "timestamp", void 0);
class BusinessMetricQueryDto {
}
exports.BusinessMetricQueryDto = BusinessMetricQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.TimeGranularity,
        description: 'Time granularity',
    }),
    (0, class_validator_1.IsEnum)(client_1.TimeGranularity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant ID filter' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID filter' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID filter' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessMetricQueryDto.prototype, "userId", void 0);
class BusinessMetricResponseDto {
}
exports.BusinessMetricResponseDto = BusinessMetricResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric ID' }),
    __metadata("design:type", String)
], BusinessMetricResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name' }),
    __metadata("design:type", String)
], BusinessMetricResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric category' }),
    __metadata("design:type", String)
], BusinessMetricResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric description' }),
    __metadata("design:type", String)
], BusinessMetricResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date' }),
    __metadata("design:type", Date)
], BusinessMetricResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TimeGranularity, description: 'Time granularity' }),
    __metadata("design:type", String)
], BusinessMetricResponseDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total revenue' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total orders' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total users' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active users' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "activeUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New users' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "newUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Average order value' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversion rate' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "conversionRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer lifetime value' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "customerLifetimeValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active merchants' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "activeMerchants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New merchants' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "newMerchants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Merchant revenue' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "merchantRevenue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Average orders per merchant' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "averageOrdersPerMerchant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total products' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "totalProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active products' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "activeProducts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product views' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "productViews", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Add to cart rate' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "addToCartRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Average fulfillment time (hours)' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "averageFulfillmentTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping cost' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Return rate' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "returnRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer satisfaction' }),
    __metadata("design:type", Number)
], BusinessMetricResponseDto.prototype, "customerSatisfaction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom metrics' }),
    __metadata("design:type", Object)
], BusinessMetricResponseDto.prototype, "customMetrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], BusinessMetricResponseDto.prototype, "createdAt", void 0);
class AnalyticsOverviewDto {
}
exports.AnalyticsOverviewDto = AnalyticsOverviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total revenue' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Revenue growth percentage' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "revenueGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders growth percentage' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "ordersGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active users' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "activeUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New users' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "newUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order value' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AOV growth percentage' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "averageOrderValueGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversion rate' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "conversionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversion rate growth percentage' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "conversionRateGrowth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active merchants' }),
    __metadata("design:type", Number)
], AnalyticsOverviewDto.prototype, "activeMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top products by revenue' }),
    __metadata("design:type", Array)
], AnalyticsOverviewDto.prototype, "topProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top merchants by revenue' }),
    __metadata("design:type", Array)
], AnalyticsOverviewDto.prototype, "topMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Revenue by time period' }),
    __metadata("design:type", Array)
], AnalyticsOverviewDto.prototype, "revenueChart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders by time period' }),
    __metadata("design:type", Array)
], AnalyticsOverviewDto.prototype, "ordersChart", void 0);
class AnalyticsQueryDto {
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.TimeGranularity,
        description: 'Time granularity',
    }),
    (0, class_validator_1.IsEnum)(client_1.TimeGranularity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "granularity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AnalyticsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AnalyticsQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=analytics.dto.js.map