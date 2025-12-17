import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  Length,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
    description: 'User display name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    required: false,
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    required: false,
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Phone number',
    example: '+1-555-123-4567',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    description: 'Job title',
    example: 'Procurement Manager',
  })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiProperty({
    required: false,
    description: 'Department',
    example: 'Operations',
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({
    required: false,
    description: 'URL to avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: false })
  avatar?: string;

  // Malaysia E-Invoicing fields
  @ApiProperty({
    required: false,
    description: 'Type of identification document',
    enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'],
    example: 'NRIC',
  })
  @IsOptional()
  @IsEnum(['NRIC', 'BRN', 'PASSPORT', 'ARMY'])
  idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';

  @ApiProperty({
    required: false,
    description: 'Identification document number',
    example: '800101141234',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  idValue?: string;
}
