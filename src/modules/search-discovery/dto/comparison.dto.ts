import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsInt, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchProductDto, ProductAvailabilityDto, ProductPricingDto } from './search.dto';

export class AddToComparisonDto {
    @ApiProperty({
        description: 'Product ID to add to comparison',
        example: 'product-uuid',
    })
    @IsUUID()
    productId: string;

    @ApiPropertyOptional({
        description: 'Comparison session ID (creates new if not provided)',
        example: 'comparison-session-uuid',
    })
    @IsOptional()
    @IsUUID()
    sessionId?: string;

    @ApiPropertyOptional({
        description: 'Quantity for pricing comparison',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number = 1;

    @ApiPropertyOptional({
        description: 'Warehouse ID for availability comparison',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;
}

export class RemoveFromComparisonDto {
    @ApiProperty({
        description: 'Product ID to remove from comparison',
        example: 'product-uuid',
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    @IsUUID()
    sessionId: string;
}

export class ComparisonSessionDto {
    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    @IsUUID()
    sessionId: string;

    @ApiPropertyOptional({
        description: 'Maximum number of products to include',
        example: 5,
        minimum: 2,
        maximum: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(2)
    @Max(10)
    maxProducts?: number = 5;

    @ApiPropertyOptional({
        description: 'Include detailed specifications',
        example: true,
    })
    @IsOptional()
    includeSpecs?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include pricing information',
        example: true,
    })
    @IsOptional()
    includePricing?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include availability information',
        example: true,
    })
    @IsOptional()
    includeAvailability?: boolean = true;

    @ApiPropertyOptional({
        description: 'Quantity for pricing calculations',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number = 1;
}

export class BulkAddToComparisonDto {
    @ApiProperty({
        description: 'Product IDs to add to comparison',
        example: ['product-1-uuid', 'product-2-uuid'],
        type: [String],
    })
    @IsArray()
    @IsUUID(4, { each: true })
    productIds: string[];

    @ApiPropertyOptional({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    @IsOptional()
    @IsUUID()
    sessionId?: string;

    @ApiPropertyOptional({
        description: 'Replace existing comparison',
        example: false,
    })
    @IsOptional()
    replace?: boolean = false;
}

export class ComparisonProductDto {
    @ApiProperty({
        description: 'Product information',
        type: SearchProductDto,
    })
    product: SearchProductDto;

    @ApiPropertyOptional({
        description: 'Product availability for comparison',
        type: ProductAvailabilityDto,
    })
    availability?: ProductAvailabilityDto;

    @ApiPropertyOptional({
        description: 'Product pricing for comparison',
        type: ProductPricingDto,
    })
    pricing?: ProductPricingDto;

    @ApiProperty({
        description: 'When this product was added to comparison',
        example: '2024-01-15T10:30:00Z',
    })
    addedAt: Date;

    @ApiPropertyOptional({
        description: 'Comparison specific notes',
        example: 'Preferred option for this project',
    })
    notes?: string;
}

export class ComparisonFieldDto {
    @ApiProperty({
        description: 'Field name',
        example: 'cores',
    })
    field: string;

    @ApiProperty({
        description: 'Display label',
        example: 'Number of Cores',
    })
    label: string;

    @ApiProperty({
        description: 'Field category',
        example: 'Performance',
    })
    category: string;

    @ApiProperty({
        description: 'Values for each product',
        example: { 'product-1-uuid': 12, 'product-2-uuid': 8 },
    })
    values: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Product ID with the best value',
        example: 'product-1-uuid',
    })
    winner?: string;

    @ApiProperty({
        description: 'Field type for rendering',
        example: 'number',
        enum: ['text', 'number', 'boolean', 'array', 'price', 'date'],
    })
    type: string;

    @ApiPropertyOptional({
        description: 'Unit of measurement',
        example: 'cores',
    })
    unit?: string;

    @ApiPropertyOptional({
        description: 'Whether higher values are better',
        example: true,
    })
    higherIsBetter?: boolean;
}

export class ComparisonMatrixDto {
    @ApiProperty({
        description: 'Comparison fields organized by category',
        type: Object,
    })
    categories: Record<string, ComparisonFieldDto[]>;

    @ApiProperty({
        description: 'Overall comparison scores',
        example: { 'product-1-uuid': 0.85, 'product-2-uuid': 0.75 },
    })
    scores: Record<string, number>;

    @ApiProperty({
        description: 'Recommendation based on comparison',
        example: 'product-1-uuid',
    })
    recommendation: string;

    @ApiPropertyOptional({
        description: 'Reasoning for recommendation',
        example: 'Best performance-to-price ratio',
    })
    recommendationReason?: string;
}

export class ProductComparisonResponseDto {
    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    sessionId: string;

    @ApiProperty({
        description: 'Products in comparison',
        type: [ComparisonProductDto],
    })
    products: ComparisonProductDto[];

    @ApiProperty({
        description: 'Comparison matrix with side-by-side data',
        type: ComparisonMatrixDto,
    })
    comparisonMatrix: ComparisonMatrixDto;

    @ApiProperty({
        description: 'Comparison summary statistics',
    })
    summary: {
        totalProducts: number;
        priceRange: { min: number; max: number };
        avgRating?: number;
        categories: string[];
        brands: string[];
    };

    @ApiProperty({
        description: 'Export options available',
        type: [String],
    })
    exportOptions: string[];

    @ApiProperty({
        description: 'Comparison created/updated timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Similar products to consider',
        type: [SearchProductDto],
    })
    similarProducts?: SearchProductDto[];
}

export class ComparisonSummaryDto {
    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    sessionId: string;

    @ApiProperty({
        description: 'Number of products in comparison',
        example: 3,
    })
    productCount: number;

    @ApiProperty({
        description: 'Product names in comparison',
        example: ['Intel Core i7-12700K', 'AMD Ryzen 7 5800X'],
        type: [String],
    })
    productNames: string[];

    @ApiProperty({
        description: 'Price range of compared products',
    })
    priceRange: {
        min: number;
        max: number;
        avg: number;
    };

    @ApiProperty({
        description: 'Last updated timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Recommended product ID',
        example: 'product-uuid',
    })
    recommendation?: string;
}

export class ComparisonExportDto {
    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    @IsUUID()
    sessionId: string;

    @ApiProperty({
        description: 'Export format',
        example: 'pdf',
        enum: ['pdf', 'excel', 'csv', 'json'],
    })
    format: string;

    @ApiPropertyOptional({
        description: 'Include images in export',
        example: true,
    })
    @IsOptional()
    includeImages?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include pricing information',
        example: true,
    })
    @IsOptional()
    includePricing?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include availability information',
        example: true,
    })
    @IsOptional()
    includeAvailability?: boolean = true;

    @ApiPropertyOptional({
        description: 'Custom fields to include',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    customFields?: string[];

    @ApiPropertyOptional({
        description: 'Company branding to include',
        example: false,
    })
    @IsOptional()
    includeBranding?: boolean = false;
}

export class ComparisonShareDto {
    @ApiProperty({
        description: 'Comparison session ID',
        example: 'comparison-session-uuid',
    })
    @IsUUID()
    sessionId: string;

    @ApiPropertyOptional({
        description: 'Share with specific users by email',
        example: ['colleague@company.com'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    shareWithEmails?: string[];

    @ApiPropertyOptional({
        description: 'Public sharing (generate shareable link)',
        example: false,
    })
    @IsOptional()
    publicShare?: boolean = false;

    @ApiPropertyOptional({
        description: 'Share expiration in days',
        example: 30,
        minimum: 1,
        maximum: 365,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(365)
    expirationDays?: number = 30;

    @ApiPropertyOptional({
        description: 'Custom message for shared comparison',
        example: 'Please review these processor options for our upcoming project',
    })
    @IsOptional()
    @IsString()
    message?: string;
}
