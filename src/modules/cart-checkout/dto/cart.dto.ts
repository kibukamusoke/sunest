import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, IsPositive, IsEnum, IsDateString, IsDecimal, ValidateNested, IsArray, ArrayMinSize, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CartItemSource, CartItemStatus } from '@prisma/client';

// ==================== CART ITEM DTOs ====================

export class CreateCartItemDto {
    @ApiPropertyOptional({
        description: 'Product ID to add to cart',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiPropertyOptional({
        description: 'Product variant ID for specific variant',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    productVariantId?: string;

    @ApiPropertyOptional({
        description: 'Custom product name (for quote-derived items)',
        example: 'Custom Industrial Motor - 5HP',
    })
    @IsOptional()
    @IsString()
    customProductName?: string;

    @ApiPropertyOptional({
        description: 'Custom SKU (for quote-derived items)',
        example: 'CUSTOM-MOTOR-5HP',
    })
    @IsOptional()
    @IsString()
    customSku?: string;

    @ApiPropertyOptional({
        description: 'Custom product description',
        example: 'High-efficiency industrial motor with specific requirements',
    })
    @IsOptional()
    @IsString()
    customDescription?: string;

    @ApiProperty({
        description: 'Quantity to add to cart',
        example: 5,
        minimum: 1,
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(10000)
    quantity: number;

    @ApiPropertyOptional({
        description: 'Unit price for custom items',
        example: 299.99,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    unitPrice?: number;

    @ApiPropertyOptional({
        description: 'Source of the cart item',
        enum: CartItemSource,
        example: CartItemSource.MANUAL,
    })
    @IsOptional()
    @IsEnum(CartItemSource)
    sourceType?: CartItemSource;

    @ApiPropertyOptional({
        description: 'Source ID (Quote ID, Order ID, etc.)',
        example: 'quote_123456',
    })
    @IsOptional()
    @IsString()
    sourceId?: string;

    @ApiPropertyOptional({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    requiredByDate?: string;

    @ApiPropertyOptional({
        description: 'Special notes for this item',
        example: 'Please ensure 240V configuration',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateCartItemDto {
    @ApiPropertyOptional({
        description: 'Updated quantity',
        example: 10,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(10000)
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Updated unit price for custom items',
        example: 279.99,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    unitPrice?: number;

    @ApiPropertyOptional({
        description: 'Updated required delivery date',
        example: '2024-09-20T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    requiredByDate?: string;

    @ApiPropertyOptional({
        description: 'Updated notes for this item',
        example: 'Changed to 480V configuration',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({
        description: 'Cart item status',
        enum: CartItemStatus,
        example: CartItemStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(CartItemStatus)
    status?: CartItemStatus;
}

export class BulkAddToCartDto {
    @ApiProperty({
        description: 'Array of items to add to cart',
        type: [CreateCartItemDto],
        minItems: 1,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateCartItemDto)
    items: CreateCartItemDto[];

    @ApiPropertyOptional({
        description: 'Source of the bulk add operation',
        enum: CartItemSource,
        example: CartItemSource.BULK_UPLOAD,
    })
    @IsOptional()
    @IsEnum(CartItemSource)
    sourceType?: CartItemSource;

    @ApiPropertyOptional({
        description: 'Source ID for bulk operation',
        example: 'bulk_upload_123',
    })
    @IsOptional()
    @IsString()
    sourceId?: string;
}

export class CartItemResponseDto {
    @ApiProperty({
        description: 'Cart item ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiProperty({
        description: 'Cart ID',
        example: 'clh1234567890',
    })
    cartId: string;

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
    };

    @ApiPropertyOptional({
        description: 'Product variant information',
    })
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
    };

    @ApiPropertyOptional({
        description: 'Custom product name',
        example: 'Custom Industrial Motor - 5HP',
    })
    customProductName?: string;

    @ApiPropertyOptional({
        description: 'Custom SKU',
        example: 'CUSTOM-MOTOR-5HP',
    })
    customSku?: string;

    @ApiPropertyOptional({
        description: 'Custom description',
        example: 'High-efficiency industrial motor with specific requirements',
    })
    customDescription?: string;

    @ApiProperty({
        description: 'Quantity in cart',
        example: 5,
    })
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 299.99,
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Total price for this line item',
        example: 1499.95,
    })
    totalPrice: number;

    @ApiPropertyOptional({
        description: 'Original price before discounts',
        example: 349.99,
    })
    originalPrice?: number;

    @ApiProperty({
        description: 'Source of cart item',
        enum: CartItemSource,
        example: CartItemSource.MANUAL,
    })
    sourceType: CartItemSource;

    @ApiPropertyOptional({
        description: 'Source ID',
        example: 'quote_123456',
    })
    sourceId?: string;

    @ApiPropertyOptional({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    })
    requiredByDate?: string;

    @ApiPropertyOptional({
        description: 'Item notes',
        example: 'Please ensure 240V configuration',
    })
    notes?: string;

    @ApiProperty({
        description: 'Whether item is approved',
        example: false,
    })
    isApproved: boolean;

    @ApiPropertyOptional({
        description: 'ID of user who approved',
        example: 'clh1234567890',
    })
    approvedBy?: string;

    @ApiPropertyOptional({
        description: 'Approval timestamp',
        example: '2024-08-07T15:30:00Z',
    })
    approvedAt?: string;

    @ApiProperty({
        description: 'Cart item status',
        enum: CartItemStatus,
        example: CartItemStatus.ACTIVE,
    })
    status: CartItemStatus;

    @ApiProperty({
        description: 'Whether item is available',
        example: true,
    })
    isAvailable: boolean;

    @ApiPropertyOptional({
        description: 'Availability message',
        example: 'In stock - 15 available',
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

// ==================== CART DTOs ====================

export class CreateCartDto {
    @ApiPropertyOptional({
        description: 'Cart name for collaborative shopping',
        example: 'Q3 Equipment Purchase',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Company ID for B2B context',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiPropertyOptional({
        description: 'Session ID for guest carts',
        example: 'guest_session_123456',
    })
    @IsOptional()
    @IsString()
    sessionId?: string;

    @ApiPropertyOptional({
        description: 'Whether this is a guest cart',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isGuest?: boolean;
}

export class UpdateCartDto {
    @ApiPropertyOptional({
        description: 'Updated cart name',
        example: 'Q3 Equipment Purchase - Revised',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Updated shipping address ID',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    shippingAddressId?: string;

    @ApiPropertyOptional({
        description: 'Updated billing address ID',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    billingAddressId?: string;
}

export class MergeCartDto {
    @ApiProperty({
        description: 'Guest cart session ID to merge',
        example: 'guest_session_123456',
    })
    @IsString()
    guestSessionId: string;

    @ApiPropertyOptional({
        description: 'Strategy for merging duplicate items',
        enum: ['combine_quantities', 'keep_latest', 'keep_both'],
        example: 'combine_quantities',
    })
    @IsOptional()
    @IsString()
    mergeStrategy?: 'combine_quantities' | 'keep_latest' | 'keep_both';
}

export class CartSummaryDto {
    @ApiProperty({
        description: 'Total number of items in cart',
        example: 15,
    })
    itemCount: number;

    @ApiProperty({
        description: 'Total quantity of all items',
        example: 42,
    })
    totalQuantity: number;

    @ApiProperty({
        description: 'Subtotal before taxes and shipping',
        example: 2499.95,
    })
    subtotal: number;

    @ApiProperty({
        description: 'Estimated tax amount',
        example: 199.99,
    })
    estimatedTax: number;

    @ApiProperty({
        description: 'Estimated shipping cost',
        example: 49.99,
    })
    estimatedShipping: number;

    @ApiProperty({
        description: 'Total estimated cost',
        example: 2749.93,
    })
    estimatedTotal: number;

    @ApiProperty({
        description: 'Number of items requiring approval',
        example: 3,
    })
    itemsRequiringApproval: number;

    @ApiProperty({
        description: 'Number of unavailable items',
        example: 1,
    })
    unavailableItems: number;
}

export class CartResponseDto {
    @ApiProperty({
        description: 'Cart ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiPropertyOptional({
        description: 'User ID (null for guest carts)',
        example: 'clh1234567890',
    })
    userId?: string;

    @ApiPropertyOptional({
        description: 'Session ID for guest carts',
        example: 'guest_session_123456',
    })
    sessionId?: string;

    @ApiPropertyOptional({
        description: 'Company information',
    })
    company?: {
        id: string;
        name: string;
        domain: string;
    };

    @ApiPropertyOptional({
        description: 'Cart name',
        example: 'Q3 Equipment Purchase',
    })
    name?: string;

    @ApiProperty({
        description: 'Whether cart is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Whether this is a guest cart',
        example: false,
    })
    isGuest: boolean;

    @ApiProperty({
        description: 'Cart currency',
        example: 'USD',
    })
    currency: string;

    @ApiPropertyOptional({
        description: 'Shipping address ID',
        example: 'clh1234567890',
    })
    shippingAddressId?: string;

    @ApiPropertyOptional({
        description: 'Billing address ID',
        example: 'clh1234567890',
    })
    billingAddressId?: string;

    @ApiProperty({
        description: 'Cart items',
        type: [CartItemResponseDto],
    })
    items: CartItemResponseDto[];

    @ApiProperty({
        description: 'Cart summary',
        type: CartSummaryDto,
    })
    summary: CartSummaryDto;

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

    @ApiPropertyOptional({
        description: 'Expiration date for guest carts',
        example: '2024-08-14T15:30:00Z',
    })
    expiresAt?: Date;
}

// ==================== QUOTE TO CART DTOs ====================

export class QuoteToCartDto {
    @ApiProperty({
        description: 'Quote ID to convert to cart',
        example: 'clh1234567890',
    })
    @IsUUID()
    quoteId: string;

    @ApiPropertyOptional({
        description: 'Specific quote item IDs to add (if not provided, all items will be added)',
        type: [String],
        example: ['clh1234567890', 'clh0987654321'],
    })
    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    quoteItemIds?: string[];

    @ApiPropertyOptional({
        description: 'Whether to preserve quoted prices',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    preserveQuotedPrices?: boolean;
}

// ==================== CART VALIDATION DTOs ====================

export class CartValidationDto {
    @ApiProperty({
        description: 'Overall cart validation status',
        example: true,
    })
    isValid: boolean;

    @ApiProperty({
        description: 'Cart-level validation errors',
        type: [String],
        example: ['Cart is empty', 'Billing address required'],
    })
    errors: string[];

    @ApiProperty({
        description: 'Cart-level warnings',
        type: [String],
        example: ['Some items may have longer lead times'],
    })
    warnings: string[];

    @ApiProperty({
        description: 'Item-level validation results',
        example: {
            'clh1234567890': {
                isValid: false,
                errors: ['Product out of stock'],
                warnings: ['Price may have changed']
            }
        },
    })
    itemValidation: Record<string, {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;

    @ApiProperty({
        description: 'Availability check results',
        example: {
            'clh1234567890': {
                available: 8,
                requested: 10,
                leadTime: 7
            }
        },
    })
    availability: Record<string, {
        available: number;
        requested: number;
        leadTime?: number;
        message?: string;
    }>;
}
