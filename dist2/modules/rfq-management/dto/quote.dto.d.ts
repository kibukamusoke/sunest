import { Decimal } from '@prisma/client/runtime/library';
export declare enum QuoteStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    ACCEPTED = "ACCEPTED",
    COUNTER_OFFERED = "COUNTER_OFFERED",
    WITHDRAWN = "WITHDRAWN"
}
export declare class QuoteItemPricingDto {
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    discountPercent?: number;
    leadTimeDays?: number;
}
export declare class AlternativeProductDto {
    productId?: string;
    name: string;
    sku?: string;
    reason?: string;
    priceDifference?: string;
    specifications?: Record<string, any>;
}
export declare class CreateQuoteItemDto {
    rfqItemId: string;
    productId?: string;
    quantityPricing: QuoteItemPricingDto[];
    description?: string;
    specifications?: Record<string, any>;
    leadTime?: number;
    suggestedAlternatives?: AlternativeProductDto[];
    notes?: string;
}
export declare class CreateQuoteDto {
    rfqId: string;
    validUntil: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    warrantyTerms?: string;
    leadTime?: number;
    currency?: string;
    discountAmount?: Decimal;
    taxAmount?: Decimal;
    shippingAmount?: Decimal;
    notes?: string;
    customerNotes?: string;
    attachments?: string[];
    items: CreateQuoteItemDto[];
}
export declare class UpdateQuoteDto {
    validUntil?: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    warrantyTerms?: string;
    leadTime?: number;
    discountAmount?: Decimal;
    taxAmount?: Decimal;
    shippingAmount?: Decimal;
    notes?: string;
    customerNotes?: string;
    attachments?: string[];
}
export declare class QuoteItemResponseDto {
    id: string;
    quoteId: string;
    rfqItemId: string;
    productId?: string;
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        model?: string;
    };
    quantityPricing: QuoteItemPricingDto[];
    description?: string;
    specifications?: Record<string, any>;
    leadTime?: number;
    suggestedAlternatives?: AlternativeProductDto[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class QuoteResponseDto {
    id: string;
    quoteNumber: string;
    rfqId: string;
    rfq?: {
        id: string;
        rfqNumber: string;
        title: string;
        status: string;
    };
    merchant: {
        id: string;
        name: string;
        displayName?: string;
        businessType?: string;
    };
    totalAmount: string;
    currency: string;
    validUntil: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    warrantyTerms?: string;
    leadTime?: number;
    status: QuoteStatus;
    submittedAt?: string;
    respondedAt?: string;
    subtotal: string;
    discountAmount?: string;
    taxAmount?: string;
    shippingAmount?: string;
    customerNotes?: string;
    attachments?: string[];
    version: number;
    parentQuoteId?: string;
    items: QuoteItemResponseDto[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare class QuoteListDto {
    quotes: QuoteResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class QuoteFilterDto {
    status?: QuoteStatus;
    rfqId?: string;
    merchantId?: string;
    submittedFrom?: string;
    submittedTo?: string;
    validFrom?: string;
    validTo?: string;
    minAmount?: string;
    maxAmount?: string;
    page?: number;
    limit?: number;
}
export declare class AcceptQuoteDto {
    acceptanceNotes?: string;
    expectedStartDate?: string;
}
export declare class RejectQuoteDto {
    rejectionReason: string;
    feedback?: string;
}
export declare class CounterOfferDto {
    counterAmount?: Decimal;
    requestedDeliveryTerms?: string;
    requestedPaymentTerms?: string;
    requestedLeadTime?: number;
    counterOfferNotes: string;
}
export declare class QuoteRevisionDto {
    revisionReason: string;
    updates?: UpdateQuoteDto;
}
