import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SystemConfigurationsResponseDto {
  @ApiPropertyOptional({
    description: 'WhatsApp number (E.164 preferred).',
    example: '+60123456789',
  })
  whatsappNumber?: string | null;

  @ApiPropertyOptional({
    description: 'Application name shown in the storefront.',
    example: 'Intelibuy',
  })
  applicationName?: string | null;

  @ApiPropertyOptional({
    description: 'Primary phone number shown in the storefront.',
    example: '+60-123456789',
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    description: 'Primary email address shown in the storefront.',
    example: 'sales@intelibuy.com',
  })
  emailAddress?: string | null;
}

export class UpdateSystemConfigurationsDto {
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  applicationName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;
}


