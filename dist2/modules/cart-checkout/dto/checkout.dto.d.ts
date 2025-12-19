import { PaymentMethod, CheckoutStatus, ApprovalStatus } from '@prisma/client';
import { AddressResponseDto } from './address.dto';
export declare class InitiateCheckoutDto {
    cartId: string;
    companyId?: string;
}
export declare class UpdateCheckoutShippingDto {
    shippingAddressId: string;
    preferredDeliveryDate?: string;
    deliveryInstructions?: string;
    shippingMethod?: string;
}
export declare class UpdateCheckoutBillingDto {
    billingAddressId: string;
}
export declare class UpdateCheckoutPaymentDto {
    paymentMethod: PaymentMethod;
    paymentDetails?: string;
    purchaseOrderNumber?: string;
}
export declare class UpdateCheckoutNotesDto {
    customerNotes?: string;
    internalNotes?: string;
}
export declare class SubmitCheckoutDto {
    customerNotes?: string;
    bypassApproval?: boolean;
}
export declare class ApproveCheckoutDto {
    approved: boolean;
    approvalNotes?: string;
    rejectionReason?: string;
}
export declare class CheckoutCalculationDto {
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    taxBreakdown: Record<string, {
        rate: number;
        amount: number;
        description?: string;
    }>;
    appliedDiscounts: Array<{
        type: string;
        description: string;
        amount: number;
        percentage?: number;
    }>;
    shippingOptions: Array<{
        method: string;
        cost: number;
        estimatedDays: number;
        description?: string;
    }>;
}
export declare class CheckoutItemDto {
    id: string;
    product: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        images: string[];
    };
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isApproved: boolean;
    requiredByDate?: string;
    notes?: string;
}
export declare class CheckoutResponseDto {
    id: string;
    cartId: string;
    userId: string;
    company?: {
        id: string;
        name: string;
        domain: string;
    };
    shippingAddress?: AddressResponseDto;
    billingAddress?: AddressResponseDto;
    paymentMethod?: PaymentMethod;
    purchaseOrderNumber?: string;
    calculation: CheckoutCalculationDto;
    status: CheckoutStatus;
    requiresApproval: boolean;
    approvalStatus: ApprovalStatus;
    approvalRequestedAt?: Date;
    approvalRequestedBy?: string;
    approvedAt?: Date;
    approvedBy?: string;
    rejectedAt?: Date;
    rejectedBy?: string;
    rejectionReason?: string;
    preferredDeliveryDate?: Date;
    deliveryInstructions?: string;
    shippingMethod?: string;
    customerNotes?: string;
    internalNotes?: string;
    orderId?: string;
    paymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}
export declare class CheckoutFilterDto {
    status?: CheckoutStatus;
    approvalStatus?: ApprovalStatus;
    companyId?: string;
    userId?: string;
    minAmount?: number;
    maxAmount?: number;
    createdFrom?: string;
    createdTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class CheckoutListDto {
    checkouts: CheckoutResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ApprovalRequirementDto {
    required: boolean;
    reason: string;
    userApprovalLimit: number;
    orderTotal: number;
    requiredLevel: string;
    eligibleApprovers: Array<{
        userId: string;
        name: string;
        email: string;
        approvalLimit: number;
    }>;
}
