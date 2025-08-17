import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsUrl, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class MerchantProfileDto {
  @ApiProperty({ description: 'Merchant ID' })
  id: string;

  @ApiProperty({ description: 'Merchant business name' })
  name: string;

  @ApiPropertyOptional({ description: 'Display name' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Business description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  logoUrl?: string;

  @ApiProperty({ description: 'Business type' })
  businessType?: string;

  @ApiPropertyOptional({ description: 'Tax ID' })
  taxId?: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Website' })
  website?: string;

  @ApiProperty({ description: 'Full address' })
  address: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  @ApiPropertyOptional({ description: 'Business settings' })
  settings: {
    minimumOrderValue?: number;
    shippingPolicy?: string;
    returnPolicy?: string;
  };

  // Malaysia E-Invoicing fields
  @ApiPropertyOptional({ description: 'Tax Identification Number for e-invoicing', example: 'TIN123456789' })
  tin?: string;

  @ApiPropertyOptional({ description: 'Type of identification document', enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'], example: 'BRN' })
  idType?: string;

  @ApiPropertyOptional({ description: 'Identification document number', example: '201501012345' })
  idValue?: string;

  @ApiProperty({ description: 'E-invoice submission opt-in status', default: false })
  eInvoiceOptIn: boolean;

  @ApiProperty({ description: 'Account status' })
  status: string;

  @ApiProperty({ description: 'Is account active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Approval date' })
  approvedAt?: Date;

  @ApiPropertyOptional({ description: 'Approved by user ID' })
  approvedBy?: string;

  @ApiPropertyOptional({ description: 'Rejection reason' })
  rejectionReason?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Merchant users count' })
  userCount?: number;

  @ApiPropertyOptional({ description: 'Performance metrics' })
  metrics?: {
    totalOrders?: number;
    totalRevenue?: number;
    averageRating?: number;
    completionRate?: number;
  };
}

export class UpdateMerchantProfileDto {
  @ApiPropertyOptional({ description: 'Display name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Business description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Minimum order value' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minimumOrderValue?: number;

  @ApiPropertyOptional({ description: 'Shipping policy' })
  @IsOptional()
  @IsString()
  shippingPolicy?: string;

  @ApiPropertyOptional({ description: 'Return policy' })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  // Malaysia E-Invoicing fields
  @ApiPropertyOptional({ description: 'Tax Identification Number for e-invoicing', example: 'TIN123456789' })
  @IsOptional()
  @IsString()
  tin?: string;

  @ApiPropertyOptional({ description: 'Type of identification document', enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'], example: 'BRN' })
  @IsOptional()
  @IsEnum(['NRIC', 'BRN', 'PASSPORT', 'ARMY'])
  idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';

  @ApiPropertyOptional({ description: 'Identification document number', example: '201501012345' })
  @IsOptional()
  @IsString()
  idValue?: string;

  @ApiPropertyOptional({ description: 'E-invoice submission opt-in status', default: false })
  @IsOptional()
  @IsBoolean()
  eInvoiceOptIn?: boolean;
}

export class MerchantListDto {
  @ApiProperty({ description: 'List of merchants' })
  merchants: MerchantProfileDto[];

  @ApiProperty({ description: 'Pagination info' })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MerchantUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Display name' })
  displayName: string;

  @ApiProperty({ description: 'Role within merchant' })
  role: string;

  @ApiProperty({ description: 'Permissions within merchant' })
  permissions: {
    canManageProducts: boolean;
    canManageOrders: boolean;
    canManagePricing: boolean;
    canViewAnalytics: boolean;
  };

  @ApiProperty({ description: 'Is user active' })
  isActive: boolean;

  @ApiProperty({ description: 'Join date' })
  joinedAt: Date;
}

export class AddMerchantUserDto {
  @ApiProperty({ description: 'User email to add' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Role within merchant' })
  @IsEnum(['admin', 'manager', 'user'])
  role: string;

  @ApiPropertyOptional({ description: 'Can manage products' })
  @IsOptional()
  @IsBoolean()
  canManageProducts?: boolean;

  @ApiPropertyOptional({ description: 'Can manage orders' })
  @IsOptional()
  @IsBoolean()
  canManageOrders?: boolean;

  @ApiPropertyOptional({ description: 'Can manage pricing' })
  @IsOptional()
  @IsBoolean()
  canManagePricing?: boolean;

  @ApiPropertyOptional({ description: 'Can view analytics' })
  @IsOptional()
  @IsBoolean()
  canViewAnalytics?: boolean;
}

export class UpdateMerchantUserDto {
  @ApiPropertyOptional({ description: 'Role within merchant' })
  @IsOptional()
  @IsEnum(['admin', 'manager', 'user'])
  role?: string;

  @ApiPropertyOptional({ description: 'Can manage products' })
  @IsOptional()
  @IsBoolean()
  canManageProducts?: boolean;

  @ApiPropertyOptional({ description: 'Can manage orders' })
  @IsOptional()
  @IsBoolean()
  canManageOrders?: boolean;

  @ApiPropertyOptional({ description: 'Can manage pricing' })
  @IsOptional()
  @IsBoolean()
  canManagePricing?: boolean;

  @ApiPropertyOptional({ description: 'Can view analytics' })
  @IsOptional()
  @IsBoolean()
  canViewAnalytics?: boolean;

  @ApiPropertyOptional({ description: 'Is user active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
