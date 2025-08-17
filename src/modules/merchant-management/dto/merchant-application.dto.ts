import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsUrl, IsPhoneNumber, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class MerchantApplicationDto {
  @ApiProperty({ description: 'Merchant business name', example: 'TechParts Supplier Inc.' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({ description: 'Display name for the merchant', example: 'TechParts Supplier' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  displayName?: string;

  @ApiPropertyOptional({ description: 'Business description', example: 'Premium electronic components supplier' })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @ApiProperty({ description: 'Type of business', example: 'distributor' })
  @IsEnum(['manufacturer', 'distributor', 'retailer', 'wholesaler'])
  businessType: string;

  @ApiProperty({ description: 'Business contact email', example: 'admin@techparts.com' })
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional({ description: 'Business contact phone', example: '+1-555-0200' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Business website', example: 'https://techparts.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: 'Primary business address line 1', example: '456 Supplier Blvd' })
  @IsString()
  @Length(1, 100)
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2', example: 'Suite 200' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  addressLine2?: string;

  @ApiProperty({ description: 'City', example: 'San Francisco' })
  @IsString()
  @Length(2, 50)
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'CA' })
  @IsString()
  @Length(2, 50)
  state: string;

  @ApiProperty({ description: 'Postal/ZIP code', example: '94105' })
  @IsString()
  @Length(3, 20)
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @Length(2, 50)
  country: string;

  @ApiProperty({ description: 'Tax identification number', example: 'TECH789123456' })
  @IsString()
  @Length(1, 50)
  taxId: string;

  @ApiPropertyOptional({ description: 'Business registration number', example: 'REG123456789' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Minimum order value', example: 100.00 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minimumOrderValue?: number;

  @ApiPropertyOptional({ description: 'Shipping policy summary' })
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  shippingPolicy?: string;

  @ApiPropertyOptional({ description: 'Return policy summary' })
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  returnPolicy?: string;

  // Malaysia E-Invoicing fields
  @ApiPropertyOptional({ description: 'Tax Identification Number for e-invoicing', example: 'TIN123456789' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  tin?: string;

  @ApiPropertyOptional({ description: 'Type of identification document', enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'], example: 'BRN' })
  @IsOptional()
  @IsEnum(['NRIC', 'BRN', 'PASSPORT', 'ARMY'])
  idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';

  @ApiPropertyOptional({ description: 'Identification document number', example: '201501012345' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  idValue?: string;

  @ApiPropertyOptional({ description: 'Opt-in for e-invoice submission', default: false })
  @IsOptional()
  eInvoiceOptIn?: boolean;
}

export class MerchantApplicationResponseDto {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ description: 'Application status' })
  status: string;

  @ApiProperty({ description: 'Application submission date' })
  submittedAt: Date;

  @ApiProperty({ description: 'Next steps message' })
  message: string;

  @ApiProperty({ description: 'Required documents list' })
  requiredDocuments: string[];
}

export class CheckApplicationStatusDto {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ description: 'Business name' })
  businessName: string;

  @ApiProperty({ description: 'Current status' })
  status: string;

  @ApiProperty({ description: 'Status description' })
  statusMessage: string;

  @ApiProperty({ description: 'Submitted date' })
  submittedAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  lastUpdated: Date;

  @ApiPropertyOptional({ description: 'Approval/rejection date' })
  processedAt?: Date;

  @ApiPropertyOptional({ description: 'Estimated completion date' })
  estimatedCompletion?: string;

  @ApiPropertyOptional({ description: 'Admin notes or rejection reason' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Rejection reason' })
  rejectionReason?: string;

  @ApiProperty({ description: 'Next steps for the applicant' })
  nextSteps: string[];

  @ApiProperty({ description: 'Required documents checklist' })
  documents: {
    type: string;
    required: boolean;
    uploaded: boolean;
    uploadedAt?: Date;
  }[];

  @ApiProperty({ description: 'Complete application data for editing' })
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
    taxId?: string;
    registrationNumber?: string;
    tin?: string;
    idType?: string;
    idValue?: string;
    eInvoiceOptIn?: boolean;
  };

  @ApiProperty({ description: 'Whether application can be edited' })
  canEdit: boolean;
}
