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
exports.CreateShipmentDto = exports.PackageDto = exports.CreateShipmentItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
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
        description: 'Warehouse ID where shipment originates',
        example: 'uuid-warehouse-id',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Shipping carrier ID',
        example: 'uuid-carrier-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "carrierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shipping method/service',
        example: 'Ground',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShipmentDto.prototype, "shippingMethod", void 0);
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
//# sourceMappingURL=temp-shipping.dto.js.map