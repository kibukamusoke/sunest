import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsUUID, IsArray, IsObject, Min, Max, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export enum SearchType {
    FULL_TEXT = 'FULL_TEXT',
    SKU = 'SKU',
    CATEGORY = 'CATEGORY',
    SPECIFICATION = 'SPECIFICATION',
    FILTERED = 'FILTERED',
    COMPARISON = 'COMPARISON',
}

export enum SortField {
    RELEVANCE = 'relevance',
    NAME = 'name',
    PRICE = 'price',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    POPULARITY = 'popularity',
    RATING = 'rating',
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export class PriceRangeDto {
    @ApiPropertyOptional({
        description: 'Minimum price',
        example: 100,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    min?: number;

    @ApiPropertyOptional({
        description: 'Maximum price',
        example: 1000,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    max?: number;
}

export class SpecificationFilterDto {
    @ApiProperty({
        description: 'Specification name',
        example: 'cores',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Specification values to filter by',
        example: ['4', '6', '8'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    values: string[];
}

export class SearchFiltersDto {
    @ApiPropertyOptional({
        description: 'Price range filter',
        type: PriceRangeDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => PriceRangeDto)
    priceRange?: PriceRangeDto;

    @ApiPropertyOptional({
        description: 'Brand names to filter by',
        example: ['Intel', 'AMD'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    brands?: string[];

    @ApiPropertyOptional({
        description: 'Category IDs to filter by',
        example: ['category-1-uuid', 'category-2-uuid'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsUUID(4, { each: true })
    categories?: string[];

    @ApiPropertyOptional({
        description: 'Merchant IDs to filter by',
        example: ['merchant-1-uuid'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsUUID(4, { each: true })
    merchants?: string[];

    @ApiPropertyOptional({
        description: 'Product statuses to filter by',
        example: ['PUBLISHED'],
        enum: ProductStatus,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @IsEnum(ProductStatus, { each: true })
    statuses?: ProductStatus[];

    @ApiPropertyOptional({
        description: 'Specification filters',
        type: [SpecificationFilterDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpecificationFilterDto)
    specifications?: SpecificationFilterDto[];

    @ApiPropertyOptional({
        description: 'Show only products in stock',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    inStockOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Show only products with images',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    withImagesOnly?: boolean;

    @ApiPropertyOptional({
        description: 'Show only products on sale',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    onSaleOnly?: boolean;
}

export class SearchSortDto {
    @ApiPropertyOptional({
        description: 'Field to sort by',
        example: 'price',
        enum: SortField,
    })
    @IsOptional()
    @IsEnum(SortField)
    field?: SortField = SortField.RELEVANCE;

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'asc',
        enum: SortOrder,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.ASC;
}

export class ProductSearchDto {
    @ApiPropertyOptional({
        description: 'Search query term',
        example: 'intel processor',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    q?: string;

    @ApiPropertyOptional({
        description: 'Search type',
        example: 'FULL_TEXT',
        enum: SearchType,
    })
    @IsOptional()
    @IsEnum(SearchType)
    type?: SearchType = SearchType.FULL_TEXT;

    @ApiPropertyOptional({
        description: 'Search filters',
        type: SearchFiltersDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => SearchFiltersDto)
    filters?: SearchFiltersDto;

    @ApiPropertyOptional({
        description: 'Sort configuration',
        type: SearchSortDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => SearchSortDto)
    sort?: SearchSortDto;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'Include product variants in results',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    includeVariants?: boolean = false;

    @ApiPropertyOptional({
        description: 'Include inventory information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeInventory?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include category information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeCategory?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include merchant information',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    includeMerchant?: boolean = false;

    @ApiPropertyOptional({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;

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

export class BulkSkuSearchDto {
    @ApiProperty({
        description: 'List of SKUs to search for',
        example: ['INTEL-i7-12700K', 'AMD-RYZEN-5600X', 'NVIDIA-RTX-4070'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    skus: string[];

    @ApiPropertyOptional({
        description: 'Include inventory information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeInventory?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include pricing information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includePricing?: boolean = true;

    @ApiPropertyOptional({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;
}

export class SearchSuggestionDto {
    @ApiProperty({
        description: 'Partial search term for suggestions',
        example: 'intel',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    term: string;

    @ApiPropertyOptional({
        description: 'Maximum number of suggestions',
        example: 10,
        minimum: 1,
        maximum: 20,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Category to limit suggestions to',
        example: 'category-uuid',
    })
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class ProductAvailabilityDto {
    @ApiProperty({
        description: 'Whether product is in stock',
        example: true,
    })
    inStock: boolean;

    @ApiProperty({
        description: 'Available quantity',
        example: 150,
    })
    quantity: number;

    @ApiProperty({
        description: 'Warehouse information',
    })
    warehouse?: {
        id: string;
        name: string;
        code: string;
    };

    @ApiPropertyOptional({
        description: 'Estimated lead time in days',
        example: 3,
    })
    leadTimeDays?: number;

    @ApiPropertyOptional({
        description: 'Restock date if out of stock',
        example: '2024-01-20T00:00:00Z',
    })
    restockDate?: Date;
}

export class ProductPricingDto {
    @ApiProperty({
        description: 'Base price per unit',
        example: 299.99,
    })
    basePrice: number;

    @ApiProperty({
        description: 'Final price after quantity discounts',
        example: 279.99,
    })
    finalPrice: number;

    @ApiProperty({
        description: 'Quantity for pricing calculation',
        example: 1,
    })
    quantity: number;

    @ApiPropertyOptional({
        description: 'Discount amount',
        example: 20.00,
    })
    discount?: number;

    @ApiPropertyOptional({
        description: 'Discount percentage',
        example: 6.67,
    })
    discountPercentage?: number;

    @ApiPropertyOptional({
        description: 'Minimum order quantity',
        example: 1,
    })
    minimumOrderQuantity?: number;

    @ApiPropertyOptional({
        description: 'Price breaks for different quantities',
        type: [Object],
    })
    priceBreaks?: Array<{
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
}

export class SearchProductDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'product-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Intel Core i7-12700K',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Product display name',
        example: 'Intel Core i7-12700K Desktop Processor',
    })
    displayName?: string;

    @ApiProperty({
        description: 'Product SKU',
        example: 'INTEL-i7-12700K',
    })
    sku: string;

    @ApiPropertyOptional({
        description: 'Product brand',
        example: 'Intel',
    })
    brand?: string;

    @ApiPropertyOptional({
        description: 'Product model',
        example: 'i7-12700K',
    })
    model?: string;

    @ApiPropertyOptional({
        description: 'Short product description',
        example: 'High-performance desktop processor with 12 cores',
    })
    shortDescription?: string;

    @ApiProperty({
        description: 'Product images',
        example: ['https://example.com/image1.jpg'],
        type: [String],
    })
    images: string[];

    @ApiPropertyOptional({
        description: 'Product availability information',
        type: ProductAvailabilityDto,
    })
    availability?: ProductAvailabilityDto;

    @ApiPropertyOptional({
        description: 'Product pricing information',
        type: ProductPricingDto,
    })
    pricing?: ProductPricingDto;

    @ApiPropertyOptional({
        description: 'Product category information',
    })
    category?: {
        id: string;
        name: string;
        slug: string;
    };

    @ApiPropertyOptional({
        description: 'Merchant information',
    })
    merchant?: {
        id: string;
        name: string;
        displayName?: string;
    };

    @ApiProperty({
        description: 'Product specifications',
        example: { cores: 12, threads: 20, baseFrequency: '3.6 GHz' },
    })
    specifications: Record<string, any>;

    @ApiProperty({
        description: 'Search relevance score',
        example: 0.95,
    })
    relevanceScore: number;

    @ApiPropertyOptional({
        description: 'Product variants (if requested)',
        type: [Object],
    })
    variants?: Array<{
        id: string;
        name: string;
        sku: string;
        price?: number;
        availability?: ProductAvailabilityDto;
    }>;

    @ApiProperty({
        description: 'Product status',
        example: 'PUBLISHED',
        enum: ProductStatus,
    })
    status: ProductStatus;

    @ApiProperty({
        description: 'Created date',
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last updated date',
        example: '2024-01-15T10:30:00Z',
    })
    updatedAt: Date;
}
