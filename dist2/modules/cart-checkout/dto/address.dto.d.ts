import { AddressType } from '@prisma/client';
export declare class CreateAddressDto {
    companyId?: string;
    type: AddressType;
    name: string;
    contactName: string;
    contactPhone?: string;
    contactEmail?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    formattedAddress?: string;
    isDefault?: boolean;
    deliveryInstructions?: string;
    accessCodes?: string;
    businessHours?: string;
}
export declare class UpdateAddressDto {
    type?: AddressType;
    name?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    formattedAddress?: string;
    isDefault?: boolean;
    isActive?: boolean;
    deliveryInstructions?: string;
    accessCodes?: string;
    businessHours?: string;
}
export declare class AddressResponseDto {
    id: string;
    userId?: string;
    companyId?: string;
    company?: {
        id: string;
        name: string;
        domain: string;
    };
    type: AddressType;
    name: string;
    contactName: string;
    contactPhone?: string;
    contactEmail?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    formattedAddress?: string;
    isDefault: boolean;
    isActive: boolean;
    deliveryInstructions?: string;
    accessCodes?: string;
    businessHours?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AddressListDto {
    addresses: AddressResponseDto[];
    total: number;
    defaultShipping?: AddressResponseDto;
    defaultBilling?: AddressResponseDto;
}
export declare class AddressValidationDto {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions?: Record<string, string>;
    standardized?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}
export declare class SetDefaultAddressDto {
    type: AddressType;
}
