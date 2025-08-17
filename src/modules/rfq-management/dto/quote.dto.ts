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
    IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export enum QuoteStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    ACCEPTED = 'ACCEPTED',
    COUNTER_OFFERED = 'COUNTER_OFFERED',
    WITHDRAWN = 'WITHDRAWN',
}

export class QuoteItemPricingDto {
    @ApiProperty({
        description: 'Quantity for this pricing tier',
        example: 100,
    })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'Unit price for this quantity',
        example: '150.00',
    })
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => new Decimal(value).toString())
    unitPrice: string;

    @ApiProperty({
        description: 'Total price for this quantity',
        example: '15000.00',
    })
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => new Decimal(value).toString())
    totalPrice: string;

    @ApiPropertyOptional({
        description: 'Discount percentage applied',
        example: 5.0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercent?: number;

    @ApiPropertyOptional({
        description: 'Lead time for this quantity in days',
        example: 14,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    leadTimeDays?: number;
}

export class AlternativeProductDto {
    @ApiPropertyOptional({
        description: 'Alternative product ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiProperty({
        description: 'Alternative product name',
        example: 'Enhanced Industrial Router Model B',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        description: 'Alternative product SKU',
        example: 'EIR-2024-B',
    })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({
        description: 'Reason for suggesting this alternative',
        example: 'Better performance at similar price point',
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({
        description: 'Price difference from original request',
        example: '+50.00',
    })
    @IsOptional()
    @IsString()
    priceDifference?: string;

    @ApiPropertyOptional({
        description: 'Additional specifications',
        example: { throughput: '200 Mbps', warranty: '3 years' },
    })
    @IsOptional()
    @IsObject()
    specifications?: Record<string, any>;
}

export class CreateQuoteItemDto {
    @ApiProperty({
        description: 'RFQ item ID this quote item responds to',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsUUID()
    rfqItemId: string;

    @ApiPropertyOptional({
        description: 'Product ID if quoting existing catalog product',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiProperty({
        description: 'Pricing for different quantity tiers',
        type: [QuoteItemPricingDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => QuoteItemPricingDto)
    quantityPricing: QuoteItemPricingDto[];

    @ApiPropertyOptional({
        description: 'Item description or notes',
        example: 'High-performance router with extended warranty',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Item-specific specifications',
        example: { warranty: '3 years', support: '24/7' },
    })
    @IsOptional()
    @IsObject()
    specifications?: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Lead time for this item in days',
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    leadTime?: number;

    @ApiPropertyOptional({
        description: 'Suggested alternative products',
        type: [AlternativeProductDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AlternativeProductDto)
    suggestedAlternatives?: AlternativeProductDto[];

    @ApiPropertyOptional({
        description: 'Additional notes for this item',
        example: 'Free installation included for orders over 50 units',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateQuoteDto {
    @ApiProperty({
        description: 'RFQ ID this quote responds to',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsUUID()
    rfqId: string;

    @ApiProperty({
        description: 'Quote valid until date',
        example: '2024-12-15',
    })
    @IsDateString()
    validUntil: string;

    @ApiPropertyOptional({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted',
    })
    @IsOptional()
    @IsString()
    paymentTerms?: string;

    @ApiPropertyOptional({
        description: 'Delivery terms',
        example: 'FOB destination, free shipping on orders over $10,000',
    })
    @IsOptional()
    @IsString()
    deliveryTerms?: string;

    @ApiPropertyOptional({
        description: 'Warranty terms',
        example: '2-year manufacturer warranty with optional extended warranty available',
    })
    @IsOptional()
    @IsString()
    warrantyTerms?: string;

    @ApiPropertyOptional({
        description: 'Overall lead time in days',
        example: 14,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    leadTime?: number;

    @ApiPropertyOptional({
        description: 'Currency code',
        example: 'USD',
    })
    @IsOptional()
    @IsString()
    currency?: string = 'USD';

    @ApiPropertyOptional({
        description: 'Discount amount',
        example: '500.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    discountAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Tax amount',
        example: '750.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    taxAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Shipping amount',
        example: '200.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    shippingAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Internal notes (not visible to customer)',
        example: 'High-priority customer, consider additional discount',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Customer-visible notes',
        example: 'Thank you for your inquiry. We look forward to working with you.',
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Supporting document URLs',
        example: ['https://storage.example.com/quotes/technical-specs.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @ApiProperty({
        description: 'Quote items',
        type: [CreateQuoteItemDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => CreateQuoteItemDto)
    items: CreateQuoteItemDto[];
}

export class UpdateQuoteDto {
    @ApiPropertyOptional({
        description: 'Quote valid until date',
        example: '2024-12-20',
    })
    @IsOptional()
    @IsDateString()
    validUntil?: string;

    @ApiPropertyOptional({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted, early payment discount available',
    })
    @IsOptional()
    @IsString()
    paymentTerms?: string;

    @ApiPropertyOptional({
        description: 'Delivery terms',
        example: 'FOB destination, expedited shipping available',
    })
    @IsOptional()
    @IsString()
    deliveryTerms?: string;

    @ApiPropertyOptional({
        description: 'Warranty terms',
        example: '3-year extended warranty included',
    })
    @IsOptional()
    @IsString()
    warrantyTerms?: string;

    @ApiPropertyOptional({
        description: 'Overall lead time in days',
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    leadTime?: number;

    @ApiPropertyOptional({
        description: 'Discount amount',
        example: '750.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    discountAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Tax amount',
        example: '800.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    taxAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Shipping amount',
        example: '150.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    shippingAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Internal notes',
        example: 'Updated pricing based on volume discount',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Customer-visible notes',
        example: 'Updated quote with improved pricing and terms',
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Supporting document URLs',
        example: ['https://storage.example.com/quotes/updated-specs.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];
}

export class QuoteItemResponseDto {
    @ApiProperty({
        description: 'Quote item ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    quoteId: string;

    @ApiProperty({
        description: 'RFQ item ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    rfqItemId: string;

    @ApiPropertyOptional({
        description: 'Product ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    productId?: string;

    @ApiPropertyOptional({
        description: 'Product details',
    })
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        model?: string;
    };

    @ApiProperty({
        description: 'Pricing for different quantities',
        type: [QuoteItemPricingDto],
    })
    quantityPricing: QuoteItemPricingDto[];

    @ApiPropertyOptional({
        description: 'Item description',
        example: 'Premium router with extended warranty',
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Item specifications',
        example: { warranty: '3 years', support: '24/7' },
    })
    specifications?: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Lead time in days',
        example: 10,
    })
    leadTime?: number;

    @ApiPropertyOptional({
        description: 'Suggested alternatives',
        type: [AlternativeProductDto],
    })
    suggestedAlternatives?: AlternativeProductDto[];

    @ApiPropertyOptional({
        description: 'Additional notes',
        example: 'Free installation included',
    })
    notes?: string;

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

export class QuoteResponseDto {
    @ApiProperty({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'Auto-generated quote number',
        example: 'QUO-2024-001',
    })
    quoteNumber: string;

    @ApiProperty({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    rfqId: string;

    @ApiPropertyOptional({
        description: 'RFQ details',
    })
    rfq?: {
        id: string;
        rfqNumber: string;
        title: string;
        status: string;
    };

    @ApiProperty({
        description: 'Merchant information',
    })
    merchant: {
        id: string;
        name: string;
        displayName?: string;
        businessType?: string;
    };

    @ApiProperty({
        description: 'Total amount',
        example: '15750.00',
    })
    totalAmount: string;

    @ApiProperty({
        description: 'Currency',
        example: 'USD',
    })
    currency: string;

    @ApiProperty({
        description: 'Quote valid until',
        example: '2024-12-15T23:59:59Z',
    })
    validUntil: string;

    @ApiPropertyOptional({
        description: 'Payment terms',
        example: 'NET30, Credit Card accepted',
    })
    paymentTerms?: string;

    @ApiPropertyOptional({
        description: 'Delivery terms',
        example: 'FOB destination, free shipping',
    })
    deliveryTerms?: string;

    @ApiPropertyOptional({
        description: 'Warranty terms',
        example: '2-year manufacturer warranty',
    })
    warrantyTerms?: string;

    @ApiPropertyOptional({
        description: 'Lead time in days',
        example: 14,
    })
    leadTime?: number;

    @ApiProperty({
        description: 'Quote status',
        example: 'SUBMITTED',
        enum: QuoteStatus,
    })
    status: QuoteStatus;

    @ApiPropertyOptional({
        description: 'Submission timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    submittedAt?: string;

    @ApiPropertyOptional({
        description: 'Response timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    respondedAt?: string;

    @ApiProperty({
        description: 'Subtotal amount',
        example: '15000.00',
    })
    subtotal: string;

    @ApiPropertyOptional({
        description: 'Discount amount',
        example: '500.00',
    })
    discountAmount?: string;

    @ApiPropertyOptional({
        description: 'Tax amount',
        example: '750.00',
    })
    taxAmount?: string;

    @ApiPropertyOptional({
        description: 'Shipping amount',
        example: '200.00',
    })
    shippingAmount?: string;

    @ApiPropertyOptional({
        description: 'Customer-visible notes',
        example: 'Thank you for your business',
    })
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Supporting documents',
        example: ['https://storage.example.com/quotes/specs.pdf'],
    })
    attachments?: string[];

    @ApiProperty({
        description: 'Quote version',
        example: 1,
    })
    version: number;

    @ApiPropertyOptional({
        description: 'Parent quote ID for revisions',
        example: '12345678-1234-1234-1234-123456789012',
    })
    parentQuoteId?: string;

    @ApiProperty({
        description: 'Quote items',
        type: [QuoteItemResponseDto],
    })
    items: QuoteItemResponseDto[];

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

export class QuoteListDto {
    @ApiProperty({
        description: 'List of quotes',
        type: [QuoteResponseDto],
    })
    quotes: QuoteResponseDto[];

    @ApiProperty({
        description: 'Total number of quotes',
        example: 15,
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
        example: 2,
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

export class QuoteFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by quote status',
        enum: QuoteStatus,
        example: 'SUBMITTED',
    })
    @IsOptional()
    @IsEnum(QuoteStatus)
    status?: QuoteStatus;

    @ApiPropertyOptional({
        description: 'Filter by RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    rfqId?: string;

    @ApiPropertyOptional({
        description: 'Filter by merchant ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    @IsOptional()
    @IsUUID()
    merchantId?: string;

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
        description: 'Filter by valid until date (from)',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    validFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter by valid until date (to)',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    validTo?: string;

    @ApiPropertyOptional({
        description: 'Filter by minimum total amount',
        example: '1000.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    minAmount?: string;

    @ApiPropertyOptional({
        description: 'Filter by maximum total amount',
        example: '50000.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    maxAmount?: string;

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

export class AcceptQuoteDto {
    @ApiPropertyOptional({
        description: 'Notes about the acceptance',
        example: 'Approved by procurement team',
    })
    @IsOptional()
    @IsString()
    acceptanceNotes?: string;

    @ApiPropertyOptional({
        description: 'Expected start date for fulfillment',
        example: '2024-12-01',
    })
    @IsOptional()
    @IsDateString()
    expectedStartDate?: string;
}

export class RejectQuoteDto {
    @ApiProperty({
        description: 'Reason for rejection',
        example: 'Price exceeds budget',
    })
    @IsString()
    @IsNotEmpty()
    rejectionReason: string;

    @ApiPropertyOptional({
        description: 'Additional feedback',
        example: 'Please consider a lower price point for future opportunities',
    })
    @IsOptional()
    @IsString()
    feedback?: string;
}

export class CounterOfferDto {
    @ApiPropertyOptional({
        description: 'Counter offer total amount',
        example: '14500.00',
    })
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({ value }) => value ? new Decimal(value) : undefined)
    counterAmount?: Decimal;

    @ApiPropertyOptional({
        description: 'Requested delivery terms',
        example: 'FOB origin, expedited shipping',
    })
    @IsOptional()
    @IsString()
    requestedDeliveryTerms?: string;

    @ApiPropertyOptional({
        description: 'Requested payment terms',
        example: 'NET45 terms preferred',
    })
    @IsOptional()
    @IsString()
    requestedPaymentTerms?: string;

    @ApiPropertyOptional({
        description: 'Requested lead time in days',
        example: 7,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    requestedLeadTime?: number;

    @ApiProperty({
        description: 'Counter offer notes',
        example: 'Can you match this price with the same delivery terms?',
    })
    @IsString()
    @IsNotEmpty()
    counterOfferNotes: string;
}

export class QuoteRevisionDto {
    @ApiProperty({
        description: 'Reason for revision',
        example: 'Customer requested pricing adjustment',
    })
    @IsString()
    @IsNotEmpty()
    revisionReason: string;

    @ApiPropertyOptional({
        description: 'Updated quote data',
        type: UpdateQuoteDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateQuoteDto)
    updates?: UpdateQuoteDto;
}
