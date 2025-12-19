import { CartItemSource, CartItemStatus } from '@prisma/client';
export declare class CreateCartItemDto {
    productId?: string;
    productVariantId?: string;
    customProductName?: string;
    customSku?: string;
    customDescription?: string;
    quantity: number;
    unitPrice?: number;
    sourceType?: CartItemSource;
    sourceId?: string;
    requiredByDate?: string;
    notes?: string;
}
export declare class UpdateCartItemDto {
    quantity?: number;
    unitPrice?: number;
    requiredByDate?: string;
    notes?: string;
    status?: CartItemStatus;
}
export declare class BulkAddToCartDto {
    items: CreateCartItemDto[];
    sourceType?: CartItemSource;
    sourceId?: string;
}
export declare class CartItemResponseDto {
    id: string;
    cartId: string;
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        images: string[];
        status: string;
    };
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
    };
    customProductName?: string;
    customSku?: string;
    customDescription?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    originalPrice?: number;
    sourceType: CartItemSource;
    sourceId?: string;
    requiredByDate?: string;
    notes?: string;
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    status: CartItemStatus;
    isAvailable: boolean;
    availabilityMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateCartDto {
    name?: string;
    companyId?: string;
    sessionId?: string;
    isGuest?: boolean;
}
export declare class UpdateCartDto {
    name?: string;
    shippingAddressId?: string;
    billingAddressId?: string;
}
export declare class MergeCartDto {
    guestSessionId: string;
    mergeStrategy?: 'combine_quantities' | 'keep_latest' | 'keep_both';
}
export declare class CartSummaryDto {
    itemCount: number;
    totalQuantity: number;
    subtotal: number;
    estimatedTax: number;
    estimatedShipping: number;
    estimatedTotal: number;
    itemsRequiringApproval: number;
    unavailableItems: number;
}
export declare class CartResponseDto {
    id: string;
    userId?: string;
    sessionId?: string;
    company?: {
        id: string;
        name: string;
        domain: string;
    };
    name?: string;
    isActive: boolean;
    isGuest: boolean;
    currency: string;
    shippingAddressId?: string;
    billingAddressId?: string;
    items: CartItemResponseDto[];
    summary: CartSummaryDto;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
export declare class QuoteToCartDto {
    quoteId: string;
    quoteItemIds?: string[];
    preserveQuotedPrices?: boolean;
}
export declare class CartValidationDto {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    itemValidation: Record<string, {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    availability: Record<string, {
        available: number;
        requested: number;
        leadTime?: number;
        message?: string;
    }>;
}
