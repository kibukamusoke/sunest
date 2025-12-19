export declare enum DocumentType {
    SSM = "SSM",
    BUSINESS_LICENSE = "BUSINESS_LICENSE",
    TAX_CERTIFICATE = "TAX_CERTIFICATE",
    BANK_STATEMENT = "BANK_STATEMENT",
    INSURANCE_CERTIFICATE = "INSURANCE_CERTIFICATE",
    MEMORANDUM_ARTICLES = "MEMORANDUM_ARTICLES",
    FORM_24 = "FORM_24",
    FORM_44 = "FORM_44",
    OTHER = "OTHER"
}
export declare enum DocumentStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    RESUBMISSION = "RESUBMISSION"
}
export declare class CreateMerchantDocumentDto {
    fileId: string;
    documentType: DocumentType;
    description?: string;
}
export declare class MerchantDocumentDto {
    id: string;
    merchantId: string;
    file: {
        id: string;
        filename: string;
        mimetype: string;
        size?: number;
        url?: string;
    };
    documentType: DocumentType;
    description?: string;
    status: DocumentStatus;
    verifiedAt?: Date;
    verifiedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UpdateDocumentStatusDto {
    status: DocumentStatus;
    notes?: string;
}
export declare class MerchantDocumentsListDto {
    documents: MerchantDocumentDto[];
    total: number;
}
