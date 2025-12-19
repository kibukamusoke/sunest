export declare class MerchantProfileDto {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    logoUrl?: string;
    businessType?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    address: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    settings: {
        minimumOrderValue?: number;
        shippingPolicy?: string;
        returnPolicy?: string;
    };
    tin?: string;
    idType?: string;
    idValue?: string;
    eInvoiceOptIn: boolean;
    status: string;
    isActive: boolean;
    approvedAt?: Date;
    approvedBy?: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
    userCount?: number;
    metrics?: {
        totalOrders?: number;
        totalRevenue?: number;
        averageRating?: number;
        completionRate?: number;
    };
}
export declare class UpdateMerchantProfileDto {
    displayName?: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    minimumOrderValue?: number;
    shippingPolicy?: string;
    returnPolicy?: string;
    tin?: string;
    idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';
    idValue?: string;
    eInvoiceOptIn?: boolean;
}
export declare class MerchantListDto {
    merchants: MerchantProfileDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class MerchantUserDto {
    id: string;
    email: string;
    displayName: string;
    role: string;
    permissions: {
        canManageProducts: boolean;
        canManageOrders: boolean;
        canManagePricing: boolean;
        canViewAnalytics: boolean;
    };
    isActive: boolean;
    joinedAt: Date;
}
export declare class AddMerchantUserDto {
    email: string;
    role: string;
    canManageProducts?: boolean;
    canManageOrders?: boolean;
    canManagePricing?: boolean;
    canViewAnalytics?: boolean;
}
export declare class UpdateMerchantUserDto {
    role?: string;
    canManageProducts?: boolean;
    canManageOrders?: boolean;
    canManagePricing?: boolean;
    canViewAnalytics?: boolean;
    isActive?: boolean;
}
