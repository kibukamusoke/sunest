import { Decimal } from '@prisma/client/runtime/library';
export declare enum RFQStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    QUOTES_RECEIVED = "QUOTES_RECEIVED",
    QUOTES_COMPARED = "QUOTES_COMPARED",
    QUOTE_SELECTED = "QUOTE_SELECTED",
    NEGOTIATING = "NEGOTIATING",
    APPROVED = "APPROVED",
    CONVERTED = "CONVERTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare enum UrgencyLevel {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
export declare class RFQRequirementsDto {
    deliveryRequirements?: string;
    qualityRequirements?: string;
    paymentPreferences?: string;
    additionalTerms?: string;
}
export declare class RFQItemSpecificationDto {
    name: string;
    value: string;
    unit?: string;
    isRequired?: boolean;
}
export declare class CreateRFQItemDto {
    productId?: string;
    customProductName?: string;
    customSku?: string;
    category?: string;
    brand?: string;
    model?: string;
    specifications: RFQItemSpecificationDto[];
    technicalDrawing?: string;
    quantities: number[];
    targetPrice?: Decimal;
    budgetRange?: string;
    deliveryDate?: string;
    qualityStandards?: string;
    notes?: string;
    priority?: number;
}
export declare class CreateRFQDto {
    title: string;
    description?: string;
    companyId?: string;
    urgencyLevel: UrgencyLevel;
    expectedDelivery?: string;
    deliveryLocation?: string;
    deadline?: string;
    requirements?: RFQRequirementsDto;
    attachments?: string[];
    items: CreateRFQItemDto[];
}
export declare class UpdateRFQDto {
    title?: string;
    description?: string;
    urgencyLevel?: UrgencyLevel;
    expectedDelivery?: string;
    deliveryLocation?: string;
    deadline?: string;
    requirements?: RFQRequirementsDto;
    attachments?: string[];
}
export declare class RFQItemResponseDto {
    id: string;
    rfqId: string;
    productId?: string;
    product?: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        model?: string;
    };
    customProductName?: string;
    customSku?: string;
    category?: string;
    brand?: string;
    model?: string;
    specifications: RFQItemSpecificationDto[];
    technicalDrawing?: string;
    quantities: number[];
    targetPrice?: string;
    budgetRange?: string;
    deliveryDate?: string;
    qualityStandards?: string;
    notes?: string;
    priority: number;
    createdAt: string;
    updatedAt: string;
}
export declare class RFQResponseDto {
    id: string;
    rfqNumber: string;
    title: string;
    description?: string;
    requester: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
    company?: {
        id: string;
        name: string;
        displayName?: string;
    };
    urgencyLevel: UrgencyLevel;
    expectedDelivery?: string;
    deliveryLocation?: string;
    status: RFQStatus;
    submittedAt?: string;
    deadline?: string;
    requirements?: RFQRequirementsDto;
    attachments?: string[];
    items: RFQItemResponseDto[];
    quoteCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare class RFQListDto {
    rfqs: RFQResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class RFQFilterDto {
    status?: RFQStatus;
    urgencyLevel?: UrgencyLevel;
    companyId?: string;
    requesterId?: string;
    submittedFrom?: string;
    submittedTo?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class SubmitRFQDto {
    deadline?: string;
    submissionNotes?: string;
}
