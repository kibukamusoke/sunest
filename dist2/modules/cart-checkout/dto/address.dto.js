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
exports.SetDefaultAddressDto = exports.AddressValidationDto = exports.AddressListDto = exports.AddressResponseDto = exports.UpdateAddressDto = exports.CreateAddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAddressDto {
}
exports.CreateAddressDto = CreateAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID (for company addresses)',
        example: 'clh1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address type',
        enum: client_1.AddressType,
        example: client_1.AddressType.BOTH,
    }),
    (0, class_validator_1.IsEnum)(client_1.AddressType),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address nickname/name',
        example: 'Headquarters - Main Office',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact person name',
        example: 'John Smith',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact phone number',
        example: '+1-555-123-4567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact email address',
        example: 'shipping@company.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 2 (suite, floor, etc.)',
        example: 'Suite 400',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'Atlanta',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State/Province',
        example: 'GA',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal/ZIP code',
        example: '30309',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country code',
        example: 'US',
        default: 'US',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original formatted address from Google Places search',
        example: '123 Industrial Blvd, Atlanta, GA 30309, USA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "formattedAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is the default address',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery instructions',
        example: 'Use loading dock entrance on the west side. Ring bell twice.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "deliveryInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Access codes for delivery',
        example: 'Gate code: 1234, Building code: 5678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "accessCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 8:00 AM - 5:00 PM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "businessHours", void 0);
class UpdateAddressDto {
}
exports.UpdateAddressDto = UpdateAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address type',
        enum: client_1.AddressType,
        example: client_1.AddressType.SHIPPING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AddressType),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address nickname/name',
        example: 'Warehouse - East Coast',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact person name',
        example: 'Jane Doe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact phone number',
        example: '+1-555-987-6543',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact email address',
        example: 'warehouse@company.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 1',
        example: '456 Warehouse Ave',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 2',
        example: 'Building B',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'City',
        example: 'Charlotte',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/Province',
        example: 'NC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal/ZIP code',
        example: '28202',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country code',
        example: 'US',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original formatted address from Google Places search',
        example: '123 Industrial Blvd, Atlanta, GA 30309, USA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "formattedAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is the default address',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAddressDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether address is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAddressDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery instructions',
        example: 'Updated: Use main entrance during business hours',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "deliveryInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Access codes for delivery',
        example: 'Updated gate code: 9876',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "accessCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 7:00 AM - 6:00 PM, Saturday 9:00 AM - 2:00 PM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "businessHours", void 0);
class AddressResponseDto {
}
exports.AddressResponseDto = AddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address ID',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID (if personal address)',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID (if company address)',
        example: 'clh1234567890',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company information',
    }),
    __metadata("design:type", Object)
], AddressResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address type',
        enum: client_1.AddressType,
        example: client_1.AddressType.BOTH,
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address nickname/name',
        example: 'Headquarters - Main Office',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact person name',
        example: 'John Smith',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact phone number',
        example: '+1-555-123-4567',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact email address',
        example: 'shipping@company.com',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 2',
        example: 'Suite 400',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'Atlanta',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State/Province',
        example: 'GA',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal/ZIP code',
        example: '30309',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country code',
        example: 'US',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original formatted address from Google Places search',
        example: '123 Industrial Blvd, Atlanta, GA 30309, USA',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "formattedAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is the default address',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddressResponseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether address is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddressResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery instructions',
        example: 'Use loading dock entrance on the west side. Ring bell twice.',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "deliveryInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Access codes for delivery',
        example: 'Gate code: 1234, Building code: 5678',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "accessCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 8:00 AM - 5:00 PM',
    }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "updatedAt", void 0);
class AddressListDto {
}
exports.AddressListDto = AddressListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of addresses',
        type: [AddressResponseDto],
    }),
    __metadata("design:type", Array)
], AddressListDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of addresses',
        example: 5,
    }),
    __metadata("design:type", Number)
], AddressListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default shipping address',
        type: AddressResponseDto,
    }),
    __metadata("design:type", AddressResponseDto)
], AddressListDto.prototype, "defaultShipping", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default billing address',
        type: AddressResponseDto,
    }),
    __metadata("design:type", AddressResponseDto)
], AddressListDto.prototype, "defaultBilling", void 0);
class AddressValidationDto {
}
exports.AddressValidationDto = AddressValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether address is valid',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddressValidationDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Validation errors',
        type: [String],
        example: ['Invalid postal code for state'],
    }),
    __metadata("design:type", Array)
], AddressValidationDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Validation warnings',
        type: [String],
        example: ['Address may be incomplete'],
    }),
    __metadata("design:type", Array)
], AddressValidationDto.prototype, "warnings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Suggested corrections',
        example: {
            postalCode: '30309-1234',
            city: 'Atlanta',
        },
    }),
    __metadata("design:type", Object)
], AddressValidationDto.prototype, "suggestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Standardized address components',
    }),
    __metadata("design:type", Object)
], AddressValidationDto.prototype, "standardized", void 0);
class SetDefaultAddressDto {
}
exports.SetDefaultAddressDto = SetDefaultAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address type to set as default',
        enum: client_1.AddressType,
        example: client_1.AddressType.SHIPPING,
    }),
    (0, class_validator_1.IsEnum)(client_1.AddressType),
    __metadata("design:type", String)
], SetDefaultAddressDto.prototype, "type", void 0);
//# sourceMappingURL=address.dto.js.map