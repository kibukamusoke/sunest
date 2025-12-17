import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  Length,
  IsPhoneNumber,
} from 'class-validator';

export enum CompanySize {
  STARTUP = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-500',
  ENTERPRISE = '501-1000',
  CORPORATION = '1000+',
}

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

export class RegisterDto {
  // Personal Information
  @ApiProperty({
    description: 'User email address',
    example: 'john@acmetech.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for the account', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  displayName: string;

  @ApiProperty({
    description: 'Job title in the company',
    example: 'Procurement Manager',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  jobTitle: string;

  @ApiProperty({ description: 'Phone number', example: '+1-555-123-4567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // Company Information
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Technologies Inc.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  companyName: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  companyDescription?: string;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://acmetech.com',
  })
  @IsOptional()
  @IsUrl()
  companyWebsite?: string;

  @ApiProperty({
    description: 'Company size',
    enum: CompanySize,
    example: CompanySize.MEDIUM,
  })
  @IsEnum(CompanySize)
  companySize: CompanySize;

  @ApiProperty({
    description: 'Industry sector',
    enum: Industry,
    example: Industry.TECHNOLOGY,
  })
  @IsEnum(Industry)
  industry: Industry;

  @ApiPropertyOptional({ description: 'URL to avatar image' })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  avatar?: string;
}
