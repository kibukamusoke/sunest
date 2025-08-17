import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEnum,
    IsArray,
    IsDateString,
    IsUUID,
    IsBoolean,
    ValidateNested,
    IsNumber,
    IsDecimal,
    Min,
    Max,
    IsNotEmpty,
    ArrayMinSize,
    ArrayMaxSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export enum RFQStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    QUOTES_RECEIVED = 'QUOTES_RECEIVED',
    QUOTES_COMPARED = 'QUOTES_COMPARED',
    QUOTE_SELECTED = 'QUOTE_SELECTED',
    NEGOTIATING = 'NEGOTIATING',
    APPROVED = 'APPROVED',
    CONVERTED = 'CONVERTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

export enum UrgencyLevel {
    LOW = 'LOW',
    NORMAL = 'NORMAL',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
    CRITICAL = 'CRITICAL',
}

export class RFQRequirementsDto {
    @ApiPropertyOptional({
        description: 'Special delivery requirements',
        example: 'Delivery to loading dock, business hours only',
    })
    @IsOptional()
    @IsString()
    deliveryRequirements?: string;

    @ApiPropertyOptional({
        description: 'Quality or certification requirements',
        example: 'ISO 9001 certified, RoHS compliant',
    })
    @IsOptional()
    @IsString()
    qualityRequirements?: string;

    @ApiPropertyOptional({
        description: 'Payment preferences',
        example: 'NET30, credit card accepted',
    })
    @IsOptional()
    @IsString()
    paymentPreferences?: string;

    @ApiPropertyOptional({
        description: 'Additional terms and conditions',
        example: 'Warranty must be minimum 2 years',
    })
    @IsOptional()
    @IsString()
    additionalTerms?: string;
}

export class RFQItemSpecificationDto {
    @ApiProperty({
        description: 'Specification name',
        example: 'Operating Temperature',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Specification value',
        example: '-20°C to +60°C',
    })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiPropertyOptional({
        description: 'Specification unit',
        example: '°C',
    })
    @IsOptional()
    @IsString()
    unit?: string;

    @ApiPropertyOptional({
        description: 'Whether this specification is required or preferred',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;
}

export class CreateRFQItemDto {
    @ApiPropertyOptional({
        description: 'Existing product ID if requesting quote for catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiPropertyOptional({
        description: 'Custom product name for non-catalog items',
        example: 'High-Performance Industrial Router',
    })
    @IsOptional()
    @IsString()
    customProductName?: string;

    @ApiPropertyOptional({
        description: 'Custom SKU or part number',
        example: 'HPR-2024-001',
    })
    @IsOptional()
    @IsString()
    customSku?: string;

    @ApiPropertyOptional({
        description: 'Product category',
        example: 'Network Equipment',
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        description: 'Preferred brand',
        example: 'Cisco',
    })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({
        description: 'Product model',
        example: 'ISR4321',
    })
    @IsOptional()
    @IsString()
    model?: string;

    @ApiProperty({
        description: 'Detailed specifications for the product',
        type: [RFQItemSpecificationDto],
        example: [
            { name: 'Throughput', value: '100 Mbps', unit: 'Mbps', isRequired: true },
            { name: 'Ports', value: '4x Gigabit Ethernet', isRequired: true },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RFQItemSpecificationDto)
    specifications: RFQItemSpecificationDto[];

    @ApiPropertyOptional({
        description: 'URL to technical drawing or datasheet',
        example: 'https://storage.example.com/technical-drawings/router-specs.pdf',
    })
    @IsOptional()
    @IsString()
    technicalDrawing?: string;

    @ApiProperty({
        description: 'Quantity tiers for pricing',
        example: [10, 50, 100],
        type: [Number],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @IsNumber({}, { each: true })
    @Min(1, { each: true })
    quantities: number[];

    @ApiPropertyOptional({
        description: 'Target unit price',
        example: '1500.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    targetPrice?: Decimal;

    @ApiPropertyOptional({
        description: 'Budget range description',
        example: '$10,000 - $15,000',
    })
    @IsOptional()
    @IsString()
    budgetRange?: string;

    @ApiPropertyOptional({
        description: 'Required delivery date',
        example: '2024-12-01',
    })
    @IsOptional()
    @IsDateString()
    deliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Quality standards or certifications required',
        example: 'UL Listed, FCC certified',
    })
    @IsOptional()
    @IsString()
    qualityStandards?: string;

    @ApiPropertyOptional({
        description: 'Additional notes for this item',
        example: 'Must be compatible with existing network infrastructure',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Priority of this item within the RFQ (1 = highest)',
        example: 1,
        minimum: 1,
        maximum: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    priority?: number = 1;
}

export class CreateRFQDto {
    @ApiProperty({
        description: 'Title of the RFQ',
        example: 'Network Infrastructure Equipment RFQ',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        description: 'Detailed description of the RFQ',
        example: 'We are seeking quotes for network equipment to upgrade our corporate infrastructure.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Company ID making the request',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiProperty({
        description: 'Urgency level of the request',
        example: 'NORMAL',
        enum: UrgencyLevel,
    })
    @IsEnum(UrgencyLevel)
    urgencyLevel: UrgencyLevel = UrgencyLevel.NORMAL;

    @ApiPropertyOptional({
        description: 'Expected delivery date',
        example: '2024-12-01',
    })
    @IsOptional()
    @IsDateString()
    expectedDelivery?: string;

    @ApiPropertyOptional({
        description: 'Delivery location address',
        example: '123 Business Park Dr, Technology City, TC 12345',
    })
    @IsOptional()
    @IsString()
    deliveryLocation?: string;

    @ApiPropertyOptional({
        description: 'Deadline for quote submissions',
        example: '2024-11-15',
    })
    @IsOptional()
    @IsDateString()
    deadline?: string;

    @ApiPropertyOptional({
        description: 'Additional requirements and terms',
        type: RFQRequirementsDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => RFQRequirementsDto)
    requirements?: RFQRequirementsDto;

    @ApiPropertyOptional({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/technical-spec.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @ApiProperty({
        description: 'Items being requested for quote',
        type: [CreateRFQItemDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => CreateRFQItemDto)
    items: CreateRFQItemDto[];
}

export class UpdateRFQDto {
    @ApiPropertyOptional({
        description: 'Title of the RFQ',
        example: 'Updated Network Infrastructure Equipment RFQ',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @ApiPropertyOptional({
        description: 'Detailed description of the RFQ',
        example: 'Updated description with additional requirements.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Urgency level of the request',
        example: 'HIGH',
        enum: UrgencyLevel,
    })
    @IsOptional()
    @IsEnum(UrgencyLevel)
    urgencyLevel?: UrgencyLevel;

    @ApiPropertyOptional({
        description: 'Expected delivery date',
        example: '2024-12-15',
    })
    @IsOptional()
    @IsDateString()
    expectedDelivery?: string;

    @ApiPropertyOptional({
        description: 'Delivery location address',
        example: '456 Updated Business Park Dr, Technology City, TC 12345',
    })
    @IsOptional()
    @IsString()
    deliveryLocation?: string;

    @ApiPropertyOptional({
        description: 'Deadline for quote submissions',
        example: '2024-11-20',
    })
    @IsOptional()
    @IsDateString()
    deadline?: string;

    @ApiPropertyOptional({
        description: 'Additional requirements and terms',
        type: RFQRequirementsDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => RFQRequirementsDto)
    requirements?: RFQRequirementsDto;

    @ApiPropertyOptional({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/updated-spec.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];
}

export class RFQItemResponseDto {
    @ApiProperty({
        description: 'RFQ item ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    rfqId: string;

    @ApiPropertyOptional({
        description: 'Product ID if referencing catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    })
    productId?: string;

    @ApiPropertyOptional({
        description: 'Product details if available',
    })
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        model?: string;
    };

    @ApiPropertyOptional({
        description: 'Custom product name for non-catalog items',
        example: 'High-Performance Industrial Router',
    })
    customProductName?: string;

    @ApiPropertyOptional({
        description: 'Custom SKU or part number',
        example: 'HPR-2024-001',
    })
    customSku?: string;

    @ApiPropertyOptional({
        description: 'Product category',
        example: 'Network Equipment',
    })
    category?: string;

    @ApiPropertyOptional({
        description: 'Preferred brand',
        example: 'Cisco',
    })
    brand?: string;

    @ApiPropertyOptional({
        description: 'Product model',
        example: 'ISR4321',
    })
    model?: string;

    @ApiProperty({
        description: 'Product specifications',
        example: [
            { name: 'Throughput', value: '100 Mbps', unit: 'Mbps', isRequired: true },
        ],
    })
    specifications: RFQItemSpecificationDto[];

    @ApiPropertyOptional({
        description: 'URL to technical drawing',
        example: 'https://storage.example.com/technical-drawings/router-specs.pdf',
    })
    technicalDrawing?: string;

    @ApiProperty({
        description: 'Quantity tiers for pricing',
        example: [10, 50, 100],
    })
    quantities: number[];

    @ApiPropertyOptional({
        description: 'Target unit price',
        example: '1500.00',
    })
    targetPrice?: string;

    @ApiPropertyOptional({
        description: 'Budget range description',
        example: '$10,000 - $15,000',
    })
    budgetRange?: string;

    @ApiPropertyOptional({
        description: 'Required delivery date',
        example: '2024-12-01T00:00:00Z',
    })
    deliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Quality standards required',
        example: 'UL Listed, FCC certified',
    })
    qualityStandards?: string;

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Must be compatible with existing infrastructure',
    })
    notes?: string;

    @ApiProperty({
        description: 'Item priority',
        example: 1,
    })
    priority: number;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: string;
}

export class RFQResponseDto {
    @ApiProperty({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'Auto-generated RFQ number',
        example: 'RFQ-2024-001',
    })
    rfqNumber: string;

    @ApiProperty({
        description: 'RFQ title',
        example: 'Network Infrastructure Equipment RFQ',
    })
    title: string;

    @ApiPropertyOptional({
        description: 'RFQ description',
        example: 'Seeking quotes for network equipment upgrade',
    })
    description?: string;

    @ApiProperty({
        description: 'Requester information',
    })
    requester: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiPropertyOptional({
        description: 'Company information',
    })
    company?: {
        id: string;
        name: string;
        displayName?: string;
    };

    @ApiProperty({
        description: 'Urgency level',
        example: 'NORMAL',
        enum: UrgencyLevel,
    })
    urgencyLevel: UrgencyLevel;

    @ApiPropertyOptional({
        description: 'Expected delivery date',
        example: '2024-12-01T00:00:00Z',
    })
    expectedDelivery?: string;

    @ApiPropertyOptional({
        description: 'Delivery location',
        example: '123 Business Park Dr, Technology City, TC 12345',
    })
    deliveryLocation?: string;

    @ApiProperty({
        description: 'RFQ status',
        example: 'SUBMITTED',
        enum: RFQStatus,
    })
    status: RFQStatus;

    @ApiPropertyOptional({
        description: 'Submission timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    submittedAt?: string;

    @ApiPropertyOptional({
        description: 'Quote submission deadline',
        example: '2024-11-15T23:59:59Z',
    })
    deadline?: string;

    @ApiPropertyOptional({
        description: 'Additional requirements',
    })
    requirements?: RFQRequirementsDto;

    @ApiPropertyOptional({
        description: 'Attachment URLs',
        example: ['https://storage.example.com/rfq-attachments/specs.pdf'],
    })
    attachments?: string[];

    @ApiProperty({
        description: 'RFQ items',
        type: [RFQItemResponseDto],
    })
    items: RFQItemResponseDto[];

    @ApiProperty({
        description: 'Number of quotes received',
        example: 3,
    })
    quoteCount: number;

    @ApiProperty({
        description: 'Active status',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: string;
}

export class RFQListDto {
    @ApiProperty({
        description: 'List of RFQs',
        type: [RFQResponseDto],
    })
    rfqs: RFQResponseDto[];

    @ApiProperty({
        description: 'Total number of RFQs',
        example: 25,
    })
    total: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 3,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Whether there are more pages',
        example: true,
    })
    hasNext: boolean;

    @ApiProperty({
        description: 'Whether there are previous pages',
        example: false,
    })
    hasPrev: boolean;
}

export class RFQFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by RFQ status',
        enum: RFQStatus,
        example: 'SUBMITTED',
    })
    @IsOptional()
    @IsEnum(RFQStatus)
    status?: RFQStatus;

    @ApiPropertyOptional({
        description: 'Filter by urgency level',
        enum: UrgencyLevel,
        example: 'HIGH',
    })
    @IsOptional()
    @IsEnum(UrgencyLevel)
    urgencyLevel?: UrgencyLevel;

    @ApiPropertyOptional({
        description: 'Filter by company ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiPropertyOptional({
        description: 'Filter by requester ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    requesterId?: string;

    @ApiPropertyOptional({
        description: 'Filter by submitted date (from)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    submittedFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter by submitted date (to)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    submittedTo?: string;

    @ApiPropertyOptional({
        description: 'Filter by deadline (from)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    deadlineFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter by deadline (to)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    deadlineTo?: string;

    @ApiPropertyOptional({
        description: 'Search in title and description',
        example: 'network equipment',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;
}

export class SubmitRFQDto {
    @ApiPropertyOptional({
        description: 'Final deadline for quote submissions',
        example: '2024-11-30',
    })
    @IsOptional()
    @IsDateString()
    deadline?: string;

    @ApiPropertyOptional({
        description: 'Additional notes for submission',
        example: 'Please provide detailed technical specifications with quotes',
    })
    @IsOptional()
    @IsString()
    submissionNotes?: string;
}
