export declare class MerchantApprovalDto {
    approvalNotes?: string;
    conditionalApproval?: boolean;
    restrictions?: string[];
    approvalDate?: Date;
}
export declare class MerchantRejectionDto {
    reason: string;
    rejectionNotes: string;
    canReapply?: boolean;
    requiredForReapplication?: string[];
}
export declare class MerchantStatusUpdateDto {
    status: string;
    reason: string;
    notes?: string;
    effectiveDate?: Date;
}
export declare class MerchantDocumentDto {
    documentType: string;
    description: string;
    expiryDate?: Date;
    issuingAuthority?: string;
}
export declare class MerchantDocumentResponseDto {
    id: string;
    documentType: string;
    description: string;
    uploadedAt: Date;
    fileUrl: string;
    expiryDate?: Date;
    issuingAuthority?: string;
    verificationStatus: string;
    verificationNotes?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
}
export declare class MerchantAuditLogDto {
    id: string;
    merchantId: string;
    action: string;
    details: string;
    performedBy: string;
    performedByUser: {
        id: string;
        email: string;
        displayName: string;
    };
    previousValue?: string;
    newValue?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export declare class MerchantAuditLogResponseDto {
    logs: MerchantAuditLogDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
