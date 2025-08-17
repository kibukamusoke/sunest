import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber, IsPositive, IsArray, IsBoolean, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ==================== SAVED ITEMS DTOs ====================

export class CreateSavedItemDto {
    @ApiPropertyOptional({
        description: 'Product ID to save',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiPropertyOptional({
        description: 'Product variant ID to save',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    productVariantId?: string;

    @ApiPropertyOptional({
        description: 'Custom name for the saved item',
        example: 'High-Efficiency Motor for Line 3',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Notes about the saved item',
        example: 'Need to verify voltage requirements before ordering',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Quantity to save',
        example: 3,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(10000)
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Price when saved (for tracking price changes)',
        example: 299.99,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    savedPrice?: number;

    @ApiPropertyOptional({
        description: 'List name to save item to',
        example: 'Q4 Equipment Needs',
    })
    @IsOptional()
    @IsString()
    listName?: string;

    @ApiPropertyOptional({
        description: 'Tags for organization',
        type: [String],
        example: ['motors', 'high-priority', 'line-3'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

export class UpdateSavedItemDto {
    @ApiPropertyOptional({
        description: 'Updated custom name',
        example: 'High-Efficiency Motor for Line 3 - Updated Specs',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Updated notes',
        example: 'Confirmed 240V requirement with engineering team',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Updated quantity',
        example: 5,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(10000)
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Updated saved price',
        example: 279.99,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    savedPrice?: number;

    @ApiPropertyOptional({
        description: 'Updated list name',
        example: 'Q4 Equipment Needs - Priority Items',
    })
    @IsOptional()
    @IsString()
    listName?: string;

    @ApiPropertyOptional({
        description: 'Updated tags',
        type: [String],
        example: ['motors', 'urgent', 'line-3', 'approved'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Whether item is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class AddSavedItemToCartDto {
    @ApiPropertyOptional({
        description: 'Quantity to add to cart (defaults to saved quantity)',
        example: 2,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(10000)
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Notes for the cart item',
        example: 'Adding from saved list - verify availability',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class BulkAddSavedItemsToCartDto {
    @ApiProperty({
        description: 'Array of saved item IDs to add to cart',
        type: [String],
        example: ['clh1234567890', 'clh0987654321'],
    })
    @IsArray()
    @IsUUID(undefined, { each: true })
    savedItemIds: string[];

    @ApiPropertyOptional({
        description: 'Whether to use saved quantities or custom quantities',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    useSavedQuantities?: boolean;

    @ApiPropertyOptional({
        description: 'Custom quantities for each item (if useSavedQuantities is false)',
        type: [Number],
        example: [2, 5, 1],
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    customQuantities?: number[];
}

export class SavedItemResponseDto {
    @ApiProperty({
        description: 'Saved item ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiProperty({
        description: 'User ID who saved the item',
        example: 'clh1234567890',
    })
    userId: string;

    @ApiPropertyOptional({
        description: 'Product information',
    })
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        images: string[];
        status: string;
        basePrice: number;
    };

    @ApiPropertyOptional({
        description: 'Product variant information',
    })
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
        price?: number;
    };

    @ApiPropertyOptional({
        description: 'Custom name for the saved item',
        example: 'High-Efficiency Motor for Line 3',
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Notes about the saved item',
        example: 'Need to verify voltage requirements before ordering',
    })
    notes?: string;

    @ApiProperty({
        description: 'Saved quantity',
        example: 3,
    })
    quantity: number;

    @ApiPropertyOptional({
        description: 'Price when saved',
        example: 299.99,
    })
    savedPrice?: number;

    @ApiPropertyOptional({
        description: 'Current price (for comparison)',
        example: 279.99,
    })
    currentPrice?: number;

    @ApiProperty({
        description: 'Price change since saved',
        example: -20.00,
    })
    priceChange: number;

    @ApiProperty({
        description: 'Price change percentage',
        example: -6.67,
    })
    priceChangePercentage: number;

    @ApiPropertyOptional({
        description: 'List name',
        example: 'Q4 Equipment Needs',
    })
    listName?: string;

    @ApiProperty({
        description: 'Tags for organization',
        type: [String],
        example: ['motors', 'high-priority', 'line-3'],
    })
    tags: string[];

    @ApiProperty({
        description: 'Whether item is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Whether product is currently available',
        example: true,
    })
    isAvailable: boolean;

    @ApiPropertyOptional({
        description: 'Availability message',
        example: 'In stock - 12 available',
    })
    availabilityMessage?: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    })
    updatedAt: Date;
}

// ==================== SAVED ITEM LIST MANAGEMENT DTOs ====================

export class CreateSavedListDto {
    @ApiProperty({
        description: 'Name of the saved list',
        example: 'Q4 Equipment Procurement',
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Description of the list',
        example: 'Equipment needed for Q4 production line expansion',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Tags for the list',
        type: [String],
        example: ['q4', 'production', 'expansion'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Whether the list is public (for team sharing)',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}

export class UpdateSavedListDto {
    @ApiPropertyOptional({
        description: 'Updated list name',
        example: 'Q4 Equipment Procurement - Revised',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Updated description',
        example: 'Updated equipment list for Q4 production line expansion',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Updated tags',
        type: [String],
        example: ['q4', 'production', 'expansion', 'revised'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Updated public status',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}

export class SavedListResponseDto {
    @ApiProperty({
        description: 'List ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiProperty({
        description: 'List name',
        example: 'Q4 Equipment Procurement',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'List description',
        example: 'Equipment needed for Q4 production line expansion',
    })
    description?: string;

    @ApiProperty({
        description: 'Owner user ID',
        example: 'clh1234567890',
    })
    userId: string;

    @ApiProperty({
        description: 'List tags',
        type: [String],
        example: ['q4', 'production', 'expansion'],
    })
    tags: string[];

    @ApiProperty({
        description: 'Whether list is public',
        example: false,
    })
    isPublic: boolean;

    @ApiProperty({
        description: 'Number of items in list',
        example: 12,
    })
    itemCount: number;

    @ApiProperty({
        description: 'Total estimated value',
        example: 3499.88,
    })
    totalEstimatedValue: number;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    })
    updatedAt: Date;
}

// ==================== SAVED ITEMS FILTER DTOs ====================

export class SavedItemsFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by list name',
        example: 'Q4 Equipment Needs',
    })
    @IsOptional()
    @IsString()
    listName?: string;

    @ApiPropertyOptional({
        description: 'Filter by tags',
        type: [String],
        example: ['motors', 'high-priority'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Filter by product name or SKU',
        example: 'motor',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by availability',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by price changes (true = items with price changes)',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    hasPriceChange?: boolean;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'desc',
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}

export class SavedItemsListDto {
    @ApiProperty({
        description: 'List of saved items',
        type: [SavedItemResponseDto],
    })
    savedItems: SavedItemResponseDto[];

    @ApiProperty({
        description: 'Total number of saved items',
        example: 35,
    })
    total: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 20,
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

    @ApiProperty({
        description: 'Available lists',
        type: [SavedListResponseDto],
    })
    availableLists: SavedListResponseDto[];

    @ApiProperty({
        description: 'Available tags',
        type: [String],
        example: ['motors', 'high-priority', 'line-3', 'approved'],
    })
    availableTags: string[];
}
