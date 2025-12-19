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
exports.ShippingAnalyticsResponseDto = exports.TrackingResponseDto = exports.TrackingEventDto = exports.RateQuoteResponseDto = exports.ShippingCarrierResponseDto = exports.ShipmentListResponseDto = exports.ShipmentResponseDto = exports.ShipmentItemResponseDto = exports.ShipmentFilterDto = exports.RateQuoteRequestDto = exports.UpdateShippingCarrierDto = exports.CreateShippingCarrierDto = exports.MarkShippedDto = exports.UpdateShipmentDto = exports.CreateShipmentDto = exports.PackageDto = exports.CreateShipmentItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateShipmentItemDto {
}
exports.CreateShipmentItemDto = CreateShipmentItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order item ID',
        example: 'uuid-order-item-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShipmentItemDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity being shipped',
        example: 5,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateShipmentItemDto.prototype, "quantityShipped", void 0);
class PackageDto {
}
exports.PackageDto = PackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Package weight in kg',
        example: 2.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], PackageDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 15, unit: 'cm' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PackageDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package value for insurance',
        example: 500.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], PackageDto.prototype, "value", void 0);
class CreateShipmentDto {
}
exports.CreateShipmentDto = CreateShipmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID for this shipment',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fulfillment ID if shipment is from fulfillment',
        example: 'uuid-fulfillment-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "fulfillmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Courier company name (manual)',
        example: 'DHL',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "courierCompanyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking URL (optional)',
        example: 'https://tracking.example.com/track/ABC123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "trackingUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipment notes (optional)',
        example: 'Left with front desk. Handle with care.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping cost',
        example: 15.99,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateShipmentDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping address as JSON object',
        example: {
            name: 'Acme Corp Receiving',
            contactName: 'John Doe',
            addressLine1: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateShipmentDto.prototype, "toAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking number',
        example: '1Z12345E1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estimated delivery date',
        example: '2024-08-18T17:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package weight in kg',
        example: 2.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateShipmentDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 15, unit: 'cm' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateShipmentDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of packages',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateShipmentDto.prototype, "packageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items to include in this shipment',
        type: [CreateShipmentItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateShipmentItemDto),
    __metadata("design:type", Array)
], CreateShipmentDto.prototype, "items", void 0);
class UpdateShipmentDto {
}
exports.UpdateShipmentDto = UpdateShipmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipment status',
        enum: client_1.ShipmentStatus,
        example: client_1.ShipmentStatus.SHIPPED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ShipmentStatus),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking number',
        example: '1Z12345E1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping carrier ID',
        example: 'uuid-carrier-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "carrierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping method/service',
        example: 'Express',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "shippingMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping cost',
        example: 25.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateShipmentDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estimated delivery date',
        example: '2024-08-17T17:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Actual delivery date',
        example: '2024-08-17T15:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "actualDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package weight in kg',
        example: 2.8,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateShipmentDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Package dimensions',
        example: { length: 30, width: 20, height: 18, unit: 'cm' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateShipmentDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery signature',
        example: 'J. Doe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "deliverySignature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery photo URL',
        example: 'https://storage.example.com/delivery-photos/123.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShipmentDto.prototype, "deliveryPhoto", void 0);
class MarkShippedDto {
}
exports.MarkShippedDto = MarkShippedDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking number',
        example: '1Z12345E1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkShippedDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipped date/time (defaults to now)',
        example: '2024-08-15T14:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MarkShippedDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Estimated delivery date',
        example: '2024-08-18T17:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MarkShippedDto.prototype, "estimatedDelivery", void 0);
class CreateShippingCarrierDto {
}
exports.CreateShippingCarrierDto = CreateShippingCarrierDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Carrier name',
        example: 'UPS',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Carrier code',
        example: 'ups',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Carrier website',
        example: 'https://www.ups.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking URL template',
        example: 'https://www.ups.com/track?loc=en_US&tracknum={trackingNumber}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "trackingUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API key (will be encrypted)',
        example: 'api-key-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API endpoint',
        example: 'https://api.ups.com/v1',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShippingCarrierDto.prototype, "apiEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supported services configuration',
        example: [
            {
                code: 'ground',
                name: 'Ground',
                description: 'Standard ground delivery',
            },
            { code: 'express', name: 'Express', description: 'Next day delivery' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateShippingCarrierDto.prototype, "services", void 0);
class UpdateShippingCarrierDto {
}
exports.UpdateShippingCarrierDto = UpdateShippingCarrierDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Carrier name',
        example: 'UPS Express',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShippingCarrierDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Carrier website',
        example: 'https://www.ups.com/express',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShippingCarrierDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking URL template',
        example: 'https://www.ups.com/track?tracknum={trackingNumber}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShippingCarrierDto.prototype, "trackingUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], UpdateShippingCarrierDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API key (will be encrypted)',
        example: 'new-api-key-456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShippingCarrierDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API endpoint',
        example: 'https://api.ups.com/v2',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShippingCarrierDto.prototype, "apiEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supported services configuration',
        example: [
            {
                code: 'ground',
                name: 'Ground',
                description: 'Standard ground delivery',
                cost: 15.99,
            },
            {
                code: 'express',
                name: 'Express',
                description: 'Next day delivery',
                cost: 35.99,
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateShippingCarrierDto.prototype, "services", void 0);
class RateQuoteRequestDto {
}
exports.RateQuoteRequestDto = RateQuoteRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Origin address',
        example: {
            addressLine1: '123 Warehouse St',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'US',
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RateQuoteRequestDto.prototype, "fromAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination address',
        example: {
            addressLine1: '456 Business Ave',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RateQuoteRequestDto.prototype, "toAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Package details',
        type: [PackageDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PackageDto),
    __metadata("design:type", Array)
], RateQuoteRequestDto.prototype, "packages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery date preference',
        example: '2024-08-18T17:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RateQuoteRequestDto.prototype, "deliveryDate", void 0);
class ShipmentFilterDto {
}
exports.ShipmentFilterDto = ShipmentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by shipment status',
        enum: client_1.ShipmentStatus,
        example: client_1.ShipmentStatus.IN_TRANSIT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ShipmentStatus),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by order ID',
        example: 'uuid-order-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by carrier ID',
        example: 'uuid-carrier-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "carrierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by warehouse ID',
        example: 'uuid-warehouse-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by tracking number',
        example: '1Z12345E1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter shipments created after date',
        example: '2024-08-01T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "createdAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter shipments created before date',
        example: '2024-08-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "createdBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ShipmentFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ShipmentFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ['createdAt', 'shippedAt', 'estimatedDelivery', 'status'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShipmentFilterDto.prototype, "sortOrder", void 0);
class ShipmentItemResponseDto {
}
exports.ShipmentItemResponseDto = ShipmentItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipment item ID' }),
    __metadata("design:type", String)
], ShipmentItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order item information' }),
    __metadata("design:type", Object)
], ShipmentItemResponseDto.prototype, "orderItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity shipped' }),
    __metadata("design:type", Number)
], ShipmentItemResponseDto.prototype, "quantityShipped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], ShipmentItemResponseDto.prototype, "createdAt", void 0);
class ShipmentResponseDto {
}
exports.ShipmentResponseDto = ShipmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipment ID' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipment number' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "shipmentNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tracking number' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Courier company name (manual)' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "courierCompanyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tracking URL (manual)' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "trackingUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipment notes (manual)' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order information' }),
    __metadata("design:type", Object)
], ShipmentResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fulfillment information' }),
    __metadata("design:type", Object)
], ShipmentResponseDto.prototype, "fulfillment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping carrier' }),
    __metadata("design:type", Object)
], ShipmentResponseDto.prototype, "carrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping method' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "shippingMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping cost' }),
    __metadata("design:type", Number)
], ShipmentResponseDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination address' }),
    __metadata("design:type", Object)
], ShipmentResponseDto.prototype, "toAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipment status', enum: client_1.ShipmentStatus }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipped date' }),
    __metadata("design:type", Date)
], ShipmentResponseDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated delivery date' }),
    __metadata("design:type", Date)
], ShipmentResponseDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Actual delivery date' }),
    __metadata("design:type", Date)
], ShipmentResponseDto.prototype, "actualDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Package weight' }),
    __metadata("design:type", Number)
], ShipmentResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Package dimensions' }),
    __metadata("design:type", Object)
], ShipmentResponseDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Package count' }),
    __metadata("design:type", Number)
], ShipmentResponseDto.prototype, "packageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tracking events' }),
    __metadata("design:type", Array)
], ShipmentResponseDto.prototype, "trackingEvents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delivery signature' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "deliverySignature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delivery photo URL' }),
    __metadata("design:type", String)
], ShipmentResponseDto.prototype, "deliveryPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipment items',
        type: [ShipmentItemResponseDto],
    }),
    __metadata("design:type", Array)
], ShipmentResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], ShipmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], ShipmentResponseDto.prototype, "updatedAt", void 0);
class ShipmentListResponseDto {
}
exports.ShipmentListResponseDto = ShipmentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipments', type: [ShipmentResponseDto] }),
    __metadata("design:type", Array)
], ShipmentListResponseDto.prototype, "shipments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of shipments matching filter' }),
    __metadata("design:type", Number)
], ShipmentListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], ShipmentListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], ShipmentListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], ShipmentListResponseDto.prototype, "totalPages", void 0);
class ShippingCarrierResponseDto {
}
exports.ShippingCarrierResponseDto = ShippingCarrierResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Carrier ID' }),
    __metadata("design:type", String)
], ShippingCarrierResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Carrier name' }),
    __metadata("design:type", String)
], ShippingCarrierResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Carrier code' }),
    __metadata("design:type", String)
], ShippingCarrierResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Carrier website' }),
    __metadata("design:type", String)
], ShippingCarrierResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tracking URL template' }),
    __metadata("design:type", String)
], ShippingCarrierResponseDto.prototype, "trackingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status' }),
    __metadata("design:type", Boolean)
], ShippingCarrierResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supported services' }),
    __metadata("design:type", Array)
], ShippingCarrierResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created date' }),
    __metadata("design:type", Date)
], ShippingCarrierResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated date' }),
    __metadata("design:type", Date)
], ShippingCarrierResponseDto.prototype, "updatedAt", void 0);
class RateQuoteResponseDto {
}
exports.RateQuoteResponseDto = RateQuoteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Carrier information' }),
    __metadata("design:type", Object)
], RateQuoteResponseDto.prototype, "carrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service information' }),
    __metadata("design:type", Object)
], RateQuoteResponseDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping cost' }),
    __metadata("design:type", Number)
], RateQuoteResponseDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency' }),
    __metadata("design:type", String)
], RateQuoteResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated delivery date' }),
    __metadata("design:type", Date)
], RateQuoteResponseDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transit time in days' }),
    __metadata("design:type", Number)
], RateQuoteResponseDto.prototype, "transitDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional details' }),
    __metadata("design:type", Object)
], RateQuoteResponseDto.prototype, "details", void 0);
class TrackingEventDto {
}
exports.TrackingEventDto = TrackingEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event timestamp' }),
    __metadata("design:type", Date)
], TrackingEventDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event location' }),
    __metadata("design:type", String)
], TrackingEventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event status/description' }),
    __metadata("design:type", String)
], TrackingEventDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event details' }),
    __metadata("design:type", String)
], TrackingEventDto.prototype, "description", void 0);
class TrackingResponseDto {
}
exports.TrackingResponseDto = TrackingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipment ID' }),
    __metadata("design:type", String)
], TrackingResponseDto.prototype, "shipmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tracking number' }),
    __metadata("design:type", String)
], TrackingResponseDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current status', enum: client_1.ShipmentStatus }),
    __metadata("design:type", String)
], TrackingResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated delivery date' }),
    __metadata("design:type", Date)
], TrackingResponseDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual delivery date' }),
    __metadata("design:type", Date)
], TrackingResponseDto.prototype, "actualDelivery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tracking events', type: [TrackingEventDto] }),
    __metadata("design:type", Array)
], TrackingResponseDto.prototype, "events", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last updated' }),
    __metadata("design:type", Date)
], TrackingResponseDto.prototype, "lastUpdated", void 0);
class ShippingAnalyticsResponseDto {
}
exports.ShippingAnalyticsResponseDto = ShippingAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total shipments' }),
    __metadata("design:type", Number)
], ShippingAnalyticsResponseDto.prototype, "totalShipments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipments by status' }),
    __metadata("design:type", Object)
], ShippingAnalyticsResponseDto.prototype, "shipmentsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipments by carrier' }),
    __metadata("design:type", Object)
], ShippingAnalyticsResponseDto.prototype, "shipmentsByCarrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average shipping cost' }),
    __metadata("design:type", Number)
], ShippingAnalyticsResponseDto.prototype, "averageShippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average delivery time (days)' }),
    __metadata("design:type", Number)
], ShippingAnalyticsResponseDto.prototype, "averageDeliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'On-time delivery rate (percentage)' }),
    __metadata("design:type", Number)
], ShippingAnalyticsResponseDto.prototype, "onTimeDeliveryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Damaged packages rate (percentage)' }),
    __metadata("design:type", Number)
], ShippingAnalyticsResponseDto.prototype, "damageRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top performing carrier' }),
    __metadata("design:type", Object)
], ShippingAnalyticsResponseDto.prototype, "topCarrier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    __metadata("design:type", Date)
], ShippingAnalyticsResponseDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    __metadata("design:type", Date)
], ShippingAnalyticsResponseDto.prototype, "periodEnd", void 0);
//# sourceMappingURL=shipping.dto.js.map