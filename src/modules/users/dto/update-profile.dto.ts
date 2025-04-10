import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ 
    required: false, 
    description: 'User display name',
    example: 'John Doe'
  })
  @IsString()
  @IsOptional()
  displayName?: string;
  
  @ApiProperty({ 
    required: false, 
    description: 'URL to avatar image',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  avatar?: string;
}