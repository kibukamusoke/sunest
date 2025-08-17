import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { AddressType } from '@prisma/client';

// ==================== ADDRESS DTOs ====================

export class CreateAddressDto {
    @ApiPropertyOptional({
        description: 'Company ID (for company addresses)',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiProperty({
        description: 'Address type',
        enum: AddressType,
        example: AddressType.BOTH,
    })
    @IsEnum(AddressType)
    type: AddressType;

    @ApiProperty({
        description: 'Address nickname/name',
        example: 'Headquarters - Main Office',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Contact person name',
        example: 'John Smith',
    })
    @IsString()
    contactName: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+1-555-123-4567',
    })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiPropertyOptional({
        description: 'Contact email address',
        example: 'shipping@company.com',
    })
    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @ApiProperty({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
    })
    @IsString()
    addressLine1: string;

    @ApiPropertyOptional({
        description: 'Address line 2 (suite, floor, etc.)',
        example: 'Suite 400',
    })
    @IsOptional()
    @IsString()
    addressLine2?: string;

    @ApiProperty({
        description: 'City',
        example: 'Atlanta',
    })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'State/Province',
        example: 'GA',
    })
    @IsString()
    state: string;

    @ApiProperty({
        description: 'Postal/ZIP code',
        example: '30309',
    })
    @IsString()
    postalCode: string;

    @ApiPropertyOptional({
        description: 'Country code',
        example: 'US',
        default: 'US',
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({
        description: 'Whether this is the default address',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Use loading dock entrance on the west side. Ring bell twice.',
    })
    @IsOptional()
    @IsString()
    deliveryInstructions?: string;

    @ApiPropertyOptional({
        description: 'Access codes for delivery',
        example: 'Gate code: 1234, Building code: 5678',
    })
    @IsOptional()
    @IsString()
    accessCodes?: string;

    @ApiPropertyOptional({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 8:00 AM - 5:00 PM',
    })
    @IsOptional()
    @IsString()
    businessHours?: string;
}

export class UpdateAddressDto {
    @ApiPropertyOptional({
        description: 'Address type',
        enum: AddressType,
        example: AddressType.SHIPPING,
    })
    @IsOptional()
    @IsEnum(AddressType)
    type?: AddressType;

    @ApiPropertyOptional({
        description: 'Address nickname/name',
        example: 'Warehouse - East Coast',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Contact person name',
        example: 'Jane Doe',
    })
    @IsOptional()
    @IsString()
    contactName?: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+1-555-987-6543',
    })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiPropertyOptional({
        description: 'Contact email address',
        example: 'warehouse@company.com',
    })
    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @ApiPropertyOptional({
        description: 'Address line 1',
        example: '456 Warehouse Ave',
    })
    @IsOptional()
    @IsString()
    addressLine1?: string;

    @ApiPropertyOptional({
        description: 'Address line 2',
        example: 'Building B',
    })
    @IsOptional()
    @IsString()
    addressLine2?: string;

    @ApiPropertyOptional({
        description: 'City',
        example: 'Charlotte',
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({
        description: 'State/Province',
        example: 'NC',
    })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional({
        description: 'Postal/ZIP code',
        example: '28202',
    })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional({
        description: 'Country code',
        example: 'US',
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({
        description: 'Whether this is the default address',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({
        description: 'Whether address is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Updated: Use main entrance during business hours',
    })
    @IsOptional()
    @IsString()
    deliveryInstructions?: string;

    @ApiPropertyOptional({
        description: 'Access codes for delivery',
        example: 'Updated gate code: 9876',
    })
    @IsOptional()
    @IsString()
    accessCodes?: string;

    @ApiPropertyOptional({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 7:00 AM - 6:00 PM, Saturday 9:00 AM - 2:00 PM',
    })
    @IsOptional()
    @IsString()
    businessHours?: string;
}

export class AddressResponseDto {
    @ApiProperty({
        description: 'Address ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiPropertyOptional({
        description: 'User ID (if personal address)',
        example: 'clh1234567890',
    })
    userId?: string;

    @ApiPropertyOptional({
        description: 'Company ID (if company address)',
        example: 'clh1234567890',
    })
    companyId?: string;

    @ApiPropertyOptional({
        description: 'Company information',
    })
    company?: {
        id: string;
        name: string;
        domain: string;
    };

    @ApiProperty({
        description: 'Address type',
        enum: AddressType,
        example: AddressType.BOTH,
    })
    type: AddressType;

    @ApiProperty({
        description: 'Address nickname/name',
        example: 'Headquarters - Main Office',
    })
    name: string;

    @ApiProperty({
        description: 'Contact person name',
        example: 'John Smith',
    })
    contactName: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+1-555-123-4567',
    })
    contactPhone?: string;

    @ApiPropertyOptional({
        description: 'Contact email address',
        example: 'shipping@company.com',
    })
    contactEmail?: string;

    @ApiProperty({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
    })
    addressLine1: string;

    @ApiPropertyOptional({
        description: 'Address line 2',
        example: 'Suite 400',
    })
    addressLine2?: string;

    @ApiProperty({
        description: 'City',
        example: 'Atlanta',
    })
    city: string;

    @ApiProperty({
        description: 'State/Province',
        example: 'GA',
    })
    state: string;

    @ApiProperty({
        description: 'Postal/ZIP code',
        example: '30309',
    })
    postalCode: string;

    @ApiProperty({
        description: 'Country code',
        example: 'US',
    })
    country: string;

    @ApiProperty({
        description: 'Whether this is the default address',
        example: true,
    })
    isDefault: boolean;

    @ApiProperty({
        description: 'Whether address is active',
        example: true,
    })
    isActive: boolean;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Use loading dock entrance on the west side. Ring bell twice.',
    })
    deliveryInstructions?: string;

    @ApiPropertyOptional({
        description: 'Access codes for delivery',
        example: 'Gate code: 1234, Building code: 5678',
    })
    accessCodes?: string;

    @ApiPropertyOptional({
        description: 'Business hours for deliveries',
        example: 'Monday-Friday 8:00 AM - 5:00 PM',
    })
    businessHours?: string;

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

    @ApiProperty({
        description: 'Formatted address string',
        example: '123 Industrial Blvd, Suite 400, Atlanta, GA 30309, US',
    })
    formattedAddress: string;
}

export class AddressListDto {
    @ApiProperty({
        description: 'List of addresses',
        type: [AddressResponseDto],
    })
    addresses: AddressResponseDto[];

    @ApiProperty({
        description: 'Total number of addresses',
        example: 5,
    })
    total: number;

    @ApiPropertyOptional({
        description: 'Default shipping address',
        type: AddressResponseDto,
    })
    defaultShipping?: AddressResponseDto;

    @ApiPropertyOptional({
        description: 'Default billing address',
        type: AddressResponseDto,
    })
    defaultBilling?: AddressResponseDto;
}

// ==================== ADDRESS VALIDATION DTOs ====================

export class AddressValidationDto {
    @ApiProperty({
        description: 'Whether address is valid',
        example: true,
    })
    isValid: boolean;

    @ApiProperty({
        description: 'Validation errors',
        type: [String],
        example: ['Invalid postal code for state'],
    })
    errors: string[];

    @ApiProperty({
        description: 'Validation warnings',
        type: [String],
        example: ['Address may be incomplete'],
    })
    warnings: string[];

    @ApiPropertyOptional({
        description: 'Suggested corrections',
        example: {
            postalCode: '30309-1234',
            city: 'Atlanta'
        },
    })
    suggestions?: Record<string, string>;

    @ApiPropertyOptional({
        description: 'Standardized address components',
    })
    standardized?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export class SetDefaultAddressDto {
    @ApiProperty({
        description: 'Address type to set as default',
        enum: AddressType,
        example: AddressType.SHIPPING,
    })
    @IsEnum(AddressType)
    type: AddressType;
}
