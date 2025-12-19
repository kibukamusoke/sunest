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
exports.SubmitRFQDto = exports.RFQFilterDto = exports.RFQListDto = exports.RFQResponseDto = exports.RFQItemResponseDto = exports.UpdateRFQDto = exports.CreateRFQDto = exports.CreateRFQItemDto = exports.RFQItemSpecificationDto = exports.RFQRequirementsDto = exports.UrgencyLevel = exports.RFQStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const library_1 = require("@prisma/client/runtime/library");
var RFQStatus;
(function (RFQStatus) {
    RFQStatus["DRAFT"] = "DRAFT";
    RFQStatus["SUBMITTED"] = "SUBMITTED";
    RFQStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    RFQStatus["QUOTES_RECEIVED"] = "QUOTES_RECEIVED";
    RFQStatus["QUOTES_COMPARED"] = "QUOTES_COMPARED";
    RFQStatus["QUOTE_SELECTED"] = "QUOTE_SELECTED";
    RFQStatus["NEGOTIATING"] = "NEGOTIATING";
    RFQStatus["APPROVED"] = "APPROVED";
    RFQStatus["CONVERTED"] = "CONVERTED";
    RFQStatus["EXPIRED"] = "EXPIRED";
    RFQStatus["CANCELLED"] = "CANCELLED";
})(RFQStatus || (exports.RFQStatus = RFQStatus = {}));
var UrgencyLevel;
(function (UrgencyLevel) {
    UrgencyLevel["LOW"] = "LOW";
    UrgencyLevel["NORMAL"] = "NORMAL";
    UrgencyLevel["HIGH"] = "HIGH";
    UrgencyLevel["URGENT"] = "URGENT";
    UrgencyLevel["CRITICAL"] = "CRITICAL";
})(UrgencyLevel || (exports.UrgencyLevel = UrgencyLevel = {}));
class RFQRequirementsDto {
}
exports.RFQRequirementsDto = RFQRequirementsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special delivery requirements',
        example: 'Delivery to loading dock, business hours only',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQRequirementsDto.prototype, "deliveryRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quality or certification requirements',
        example: 'ISO 9001 certified, RoHS compliant',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQRequirementsDto.prototype, "qualityRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment preferences',
        example: 'NET30, credit card accepted',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQRequirementsDto.prototype, "paymentPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional terms and conditions',
        example: 'Warranty must be minimum 2 years',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQRequirementsDto.prototype, "additionalTerms", void 0);
class RFQItemSpecificationDto {
}
exports.RFQItemSpecificationDto = RFQItemSpecificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification name',
        example: 'Operating Temperature',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RFQItemSpecificationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification value',
        example: '-20°C to +60°C',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RFQItemSpecificationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specification unit',
        example: '°C',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQItemSpecificationDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this specification is required or preferred',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RFQItemSpecificationDto.prototype, "isRequired", void 0);
class CreateRFQItemDto {
    constructor() {
        this.priority = 1;
    }
}
exports.CreateRFQItemDto = CreateRFQItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Existing product ID if requesting quote for catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product name for non-catalog items',
        example: 'High-Performance Industrial Router',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom SKU or part number',
        example: 'HPR-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product category',
        example: 'Network Equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred brand',
        example: 'Cisco',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'ISR4321',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed specifications for the product',
        type: [RFQItemSpecificationDto],
        example: [
            { name: 'Throughput', value: '100 Mbps', unit: 'Mbps', isRequired: true },
            { name: 'Ports', value: '4x Gigabit Ethernet', isRequired: true },
        ],
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        if (typeof value === 'string') {
            if (value.trim() === '') {
                return [];
            }
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed === 'object' &&
                    !Array.isArray(parsed) &&
                    parsed !== null) {
                    return Object.entries(parsed).map(([name, val]) => ({
                        name,
                        value: String(val),
                    }));
                }
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
            catch {
                return [];
            }
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return Object.entries(value).map(([name, val]) => ({
                name,
                value: String(val),
            }));
        }
        return [];
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RFQItemSpecificationDto),
    __metadata("design:type", Array)
], CreateRFQItemDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to technical drawing or datasheet',
        example: 'https://storage.example.com/technical-drawings/router-specs.pdf',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "technicalDrawing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity tiers for pricing',
        example: [10, 50, 100],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    __metadata("design:type", Array)
], CreateRFQItemDto.prototype, "quantities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target unit price',
        example: '1500.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,2' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new library_1.Decimal(value) : undefined)),
    __metadata("design:type", library_1.Decimal)
], CreateRFQItemDto.prototype, "targetPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Budget range description',
        example: '$10,000 - $15,000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "budgetRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required delivery date',
        example: '2024-12-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quality standards or certifications required',
        example: 'UL Listed, FCC certified',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "qualityStandards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for this item',
        example: 'Must be compatible with existing network infrastructure',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority of this item within the RFQ (1 = highest)',
        example: 1,
        minimum: 1,
        maximum: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateRFQItemDto.prototype, "priority", void 0);
class CreateRFQDto {
    constructor() {
        this.urgencyLevel = UrgencyLevel.NORMAL;
    }
}
exports.CreateRFQDto = CreateRFQDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the RFQ',
        example: 'Network Infrastructure Equipment RFQ',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed description of the RFQ',
        example: 'We are seeking quotes for network equipment to upgrade our corporate infrastructure.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company ID making the request',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Urgency level of the request',
        example: 'NORMAL',
        enum: UrgencyLevel,
    }),
    (0, class_validator_1.IsEnum)(UrgencyLevel),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "urgencyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected delivery date',
        example: '2024-12-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "expectedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery location address',
        example: '123 Business Park Dr, Technology City, TC 12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "deliveryLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deadline for quote submissions',
        example: '2024-11-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRFQDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional requirements and terms',
        type: RFQRequirementsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RFQRequirementsDto),
    __metadata("design:type", RFQRequirementsDto)
], CreateRFQDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/technical-spec.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRFQDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items being requested for quote',
        type: [CreateRFQItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateRFQItemDto),
    __metadata("design:type", Array)
], CreateRFQDto.prototype, "items", void 0);
class UpdateRFQDto {
}
exports.UpdateRFQDto = UpdateRFQDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title of the RFQ',
        example: 'Updated Network Infrastructure Equipment RFQ',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed description of the RFQ',
        example: 'Updated description with additional requirements.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Urgency level of the request',
        example: 'HIGH',
        enum: UrgencyLevel,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UrgencyLevel),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "urgencyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected delivery date',
        example: '2024-12-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "expectedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery location address',
        example: '456 Updated Business Park Dr, Technology City, TC 12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "deliveryLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deadline for quote submissions',
        example: '2024-11-20',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateRFQDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional requirements and terms',
        type: RFQRequirementsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RFQRequirementsDto),
    __metadata("design:type", RFQRequirementsDto)
], UpdateRFQDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/updated-spec.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateRFQDto.prototype, "attachments", void 0);
class RFQItemResponseDto {
}
exports.RFQItemResponseDto = RFQItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ item ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "rfqId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product ID if referencing catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product details if available',
    }),
    __metadata("design:type", Object)
], RFQItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom product name for non-catalog items',
        example: 'High-Performance Industrial Router',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "customProductName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom SKU or part number',
        example: 'HPR-2024-001',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "customSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product category',
        example: 'Network Equipment',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred brand',
        example: 'Cisco',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'ISR4321',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product specifications',
        example: [
            { name: 'Throughput', value: '100 Mbps', unit: 'Mbps', isRequired: true },
        ],
    }),
    __metadata("design:type", Array)
], RFQItemResponseDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to technical drawing',
        example: 'https://storage.example.com/technical-drawings/router-specs.pdf',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "technicalDrawing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity tiers for pricing',
        example: [10, 50, 100],
    }),
    __metadata("design:type", Array)
], RFQItemResponseDto.prototype, "quantities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target unit price',
        example: '1500.00',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "targetPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Budget range description',
        example: '$10,000 - $15,000',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "budgetRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required delivery date',
        example: '2024-12-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quality standards required',
        example: 'UL Listed, FCC certified',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "qualityStandards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Must be compatible with existing infrastructure',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item priority',
        example: 1,
    }),
    __metadata("design:type", Number)
], RFQItemResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQItemResponseDto.prototype, "updatedAt", void 0);
class RFQResponseDto {
}
exports.RFQResponseDto = RFQResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auto-generated RFQ number',
        example: 'RFQ-2024-001',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "rfqNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ title',
        example: 'Network Infrastructure Equipment RFQ',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RFQ description',
        example: 'Seeking quotes for network equipment upgrade',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requester information',
    }),
    __metadata("design:type", Object)
], RFQResponseDto.prototype, "requester", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company information',
    }),
    __metadata("design:type", Object)
], RFQResponseDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Urgency level',
        example: 'NORMAL',
        enum: UrgencyLevel,
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "urgencyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected delivery date',
        example: '2024-12-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "expectedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delivery location',
        example: '123 Business Park Dr, Technology City, TC 12345',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "deliveryLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ status',
        example: 'SUBMITTED',
        enum: RFQStatus,
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Submission timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quote submission deadline',
        example: '2024-11-15T23:59:59Z',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional requirements',
    }),
    __metadata("design:type", RFQRequirementsDto)
], RFQResponseDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/specs.pdf'],
    }),
    __metadata("design:type", Array)
], RFQResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ items',
        type: [RFQItemResponseDto],
    }),
    __metadata("design:type", Array)
], RFQResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of quotes received',
        example: 3,
    }),
    __metadata("design:type", Number)
], RFQResponseDto.prototype, "quoteCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RFQResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQResponseDto.prototype, "updatedAt", void 0);
class RFQListDto {
}
exports.RFQListDto = RFQListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of RFQs',
        type: [RFQResponseDto],
    }),
    __metadata("design:type", Array)
], RFQListDto.prototype, "rfqs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of RFQs',
        example: 25,
    }),
    __metadata("design:type", Number)
], RFQListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], RFQListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], RFQListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 3,
    }),
    __metadata("design:type", Number)
], RFQListDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are more pages',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RFQListDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there are previous pages',
        example: false,
    }),
    __metadata("design:type", Boolean)
], RFQListDto.prototype, "hasPrev", void 0);
class RFQFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.RFQFilterDto = RFQFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by RFQ status',
        enum: RFQStatus,
        example: 'SUBMITTED',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RFQStatus),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by urgency level',
        enum: UrgencyLevel,
        example: 'HIGH',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UrgencyLevel),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "urgencyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by company ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by requester ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "requesterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by submitted date (from)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "submittedFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by submitted date (to)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "submittedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by deadline (from)',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "deadlineFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by deadline (to)',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "deadlineTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search in title and description',
        example: 'network equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RFQFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], RFQFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], RFQFilterDto.prototype, "limit", void 0);
class SubmitRFQDto {
}
exports.SubmitRFQDto = SubmitRFQDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Final deadline for quote submissions',
        example: '2024-11-30',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SubmitRFQDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for submission',
        example: 'Please provide detailed technical specifications with quotes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitRFQDto.prototype, "submissionNotes", void 0);
//# sourceMappingURL=rfq.dto.js.map