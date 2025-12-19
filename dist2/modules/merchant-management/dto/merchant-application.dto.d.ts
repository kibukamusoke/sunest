export declare class MerchantApplicationDto {
    name: string;
    displayName?: string;
    description?: string;
    businessType: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    minimumOrderValue?: number;
    shippingPolicy?: string;
    returnPolicy?: string;
    tin?: string;
    idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';
    idValue?: string;
    eInvoiceOptIn?: boolean;
    password: string;
    firstName: string;
    lastName: string;
}
export declare class MerchantApplicationResponseDto {
    id: string;
    status: string;
    submittedAt: Date;
    message: string;
    requiredDocuments: string[];
}
export declare class CheckApplicationStatusDto {
    id: string;
    businessName: string;
    status: string;
    statusMessage: string;
    submittedAt: Date;
    lastUpdated: Date;
    processedAt?: Date;
    estimatedCompletion?: string;
    notes?: string;
    rejectionReason?: string;
    nextSteps: string[];
    documents: {
        type: string;
        required: boolean;
        uploaded: boolean;
        uploadedAt?: Date;
    }[];
    applicationData: {
        name: string;
        displayName?: string;
        description?: string;
        businessType?: string;
        contactEmail?: string;
        contactPhone?: string;
        website?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        tin?: string;
        idType?: string;
        idValue?: string;
        eInvoiceOptIn?: boolean;
    };
    canEdit: boolean;
}
