import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  IsEnum,
  Length,
  IsDecimal,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

// Company Size Enum
export enum CompanySize {
  STARTUP = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-500',
  ENTERPRISE = '501-1000',
  CORPORATION = '1000+',
}

// Industry Enum
export enum Industry {
  TECHNOLOGY = 'technology',
  MANUFACTURING = 'manufacturing',
  HEALTHCARE = 'healthcare',
  FINANCE = 'finance',
  EDUCATION = 'education',
  RETAIL = 'retail',
  CONSTRUCTION = 'construction',
  TELECOMMUNICATIONS = 'telecommunications',
  GOVERNMENT = 'government',
  OTHER = 'other',
}

// Company Role Enum
export enum CompanyRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  VIEWER = 'viewer',
}

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Technologies Inc.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Company display name',
    example: 'Acme Tech',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  displayName?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    enum: Industry,
    example: Industry.TECHNOLOGY,
  })
  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://acmetech.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  // Contact information
  @ApiPropertyOptional({
    description: 'Company contact email address',
    example: 'contact@company.com',
  })
  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @ApiPropertyOptional({
    description: 'Company contact phone number',
    example: '+60123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  companyPhone?: string;

  // Address fields
  @ApiPropertyOptional({
    description: 'Address line 1',
    example: '123 Business District',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2', example: 'Suite 100' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Tech City' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @ApiPropertyOptional({
    description:
      'State/Province code (e.g., "01" for Johor). Use /configurations/states endpoint to get valid state codes.',
    example: '01',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code', example: '12345' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'United States' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  country?: string;

  // Business details
  @ApiPropertyOptional({
    description: 'Tax identification number',
    example: '12-3456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Business registration number',
    example: 'REG123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: 'Sales and Service Tax number',
    example: 'SST-123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  sstNumber?: string;

  @ApiPropertyOptional({
    description: 'Type of ID document',
    example: 'passport',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  idType?: string;

  @ApiPropertyOptional({
    description: 'ID document number/value',
    example: 'A12345678',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  idValue?: string;

  @ApiPropertyOptional({
    description: 'Credit limit for purchases',
    example: '50000.00',
  })
  @IsOptional()
  @IsDecimal()
  creditLimit?: string;

  @ApiPropertyOptional({ description: 'Payment terms', example: 'NET30' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  paymentTerms?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Company display name',
    example: 'Acme Tech',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  displayName?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    enum: Industry,
    example: Industry.TECHNOLOGY,
  })
  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://acmetech.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  // Contact information
  @ApiPropertyOptional({
    description: 'Company contact email address',
    example: 'contact@company.com',
  })
  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @ApiPropertyOptional({
    description: 'Company contact phone number',
    example: '+60123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  companyPhone?: string;

  // Address fields
  @ApiPropertyOptional({
    description: 'Address line 1',
    example: '123 Business District',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2', example: 'Suite 100' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Tech City' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @ApiPropertyOptional({
    description:
      'State/Province code (e.g., "01" for Johor). Use /configurations/states endpoint to get valid state codes.',
    example: '01',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code', example: '12345' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'United States' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  country?: string;

  // Business details
  @ApiPropertyOptional({
    description: 'Tax identification number',
    example: '12-3456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Business registration number',
    example: 'REG123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: 'Sales and Service Tax number',
    example: 'SST-123456789',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  sstNumber?: string;

  @ApiPropertyOptional({
    description: 'Type of ID document',
    example: 'passport',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  idType?: string;

  @ApiPropertyOptional({
    description: 'ID document number/value',
    example: 'A12345678',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  idValue?: string;

  @ApiPropertyOptional({
    description: 'Credit limit for purchases',
    example: '50000.00',
  })
  @IsOptional()
  @IsDecimal()
  creditLimit?: string;

  @ApiPropertyOptional({ description: 'Payment terms', example: 'NET30' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  paymentTerms?: string;

  @ApiPropertyOptional({
    description: 'Whether company is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether company is verified',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ description: 'Verification notes' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  verificationNotes?: string;
}

export class InviteTeamMemberDto {
  @ApiProperty({
    description: 'Email address of user to invite',
    example: 'john@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role in company',
    enum: CompanyRole,
    example: CompanyRole.EMPLOYEE,
  })
  @IsEnum(CompanyRole)
  role: CompanyRole;

  @ApiPropertyOptional({ description: 'Custom invitation message' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  message?: string;
}

export class UpdateTeamMemberDto {
  @ApiProperty({
    description: 'Role in company',
    enum: CompanyRole,
    example: CompanyRole.MANAGER,
  })
  @IsEnum(CompanyRole)
  role: CompanyRole;

  @ApiPropertyOptional({
    description: 'Whether team member is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CompanyResponseDto {
  @ApiProperty({ description: 'Company ID' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiPropertyOptional({ description: 'Company display name' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Industry sector' })
  industry?: string;

  @ApiPropertyOptional({ description: 'Company website URL' })
  website?: string;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  logoUrl?: string;

  // Contact information
  @ApiPropertyOptional({ description: 'Company contact email address' })
  companyEmail?: string;

  @ApiPropertyOptional({ description: 'Company contact phone number' })
  companyPhone?: string;

  // Address fields
  @ApiPropertyOptional({ description: 'Address line 1' })
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({
    description: 'State/Province code (e.g., "01" for Johor)',
  })
  state?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  country?: string;

  // Business details
  @ApiPropertyOptional({ description: 'Tax identification number' })
  taxId?: string;

  @ApiPropertyOptional({ description: 'Business registration number' })
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Sales and Service Tax number' })
  sstNumber?: string;

  @ApiPropertyOptional({ description: 'Type of ID document' })
  idType?: string;

  @ApiPropertyOptional({ description: 'ID document number/value' })
  idValue?: string;

  @ApiPropertyOptional({ description: 'Credit limit for purchases' })
  creditLimit?: string;

  @ApiPropertyOptional({ description: 'Payment terms' })
  paymentTerms?: string;

  @ApiProperty({ description: 'Whether company is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether company is verified' })
  isVerified: boolean;

  @ApiPropertyOptional({ description: 'Verification notes' })
  verificationNotes?: string;

  @ApiProperty({ description: 'Number of team members' })
  teamMemberCount?: number;

  @ApiProperty({ description: 'Company creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Company last updated date' })
  updatedAt: Date;
}

export class TeamMemberDto {
  @ApiProperty({ description: 'Team member ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Full name' })
  name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiPropertyOptional({ description: 'Job title' })
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Department' })
  department?: string;

  @ApiProperty({ description: 'Role in company' })
  role: string;

  @ApiProperty({ description: 'Whether team member is active' })
  isActive: boolean;

  @ApiProperty({ description: 'When user joined company' })
  joinedAt: Date;

  @ApiPropertyOptional({ description: 'Last login date' })
  lastLoginAt?: Date;
}

export class CompanyListDto {
  @ApiProperty({ description: 'List of companies', type: [CompanyResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyResponseDto)
  companies: CompanyResponseDto[];

  @ApiProperty({ description: 'Total number of companies' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of companies per page' })
  limit: number;
}

export class TeamListDto {
  @ApiProperty({ description: 'List of team members', type: [TeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[];

  @ApiProperty({ description: 'Total number of team members' })
  total: number;
}
