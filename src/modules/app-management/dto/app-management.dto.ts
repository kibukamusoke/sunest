import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, MinLength, MaxLength, IsUrl, IsObject } from 'class-validator';

export class CreateAppDto {
  @ApiProperty({ 
    description: 'Unique app name (used as identifier)',
    example: 'my-new-app',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ 
    description: 'Human-readable display name',
    example: 'My New App',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  displayName: string;

  @ApiPropertyOptional({ 
    description: 'App description',
    example: 'A comprehensive app for managing containers',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'App domain (optional)',
    example: 'myapp.example.com'
  })
  @IsUrl()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional({ 
    description: 'App-specific settings (JSON object)',
    example: { theme: 'dark', language: 'en' }
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}

export class UpdateAppDto {
  @ApiPropertyOptional({ 
    description: 'Human-readable display name',
    example: 'Updated App Name',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ 
    description: 'App description',
    example: 'Updated app description',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'App domain (optional)',
    example: 'updated.example.com'
  })
  @IsUrl()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the app is active',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'App-specific settings (JSON object)',
    example: { theme: 'light', language: 'es' }
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}

export class AppResponseDto {
  @ApiProperty({ 
    description: 'App ID',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({ 
    description: 'App name',
    example: 'my-app'
  })
  name: string;

  @ApiProperty({ 
    description: 'Display name',
    example: 'My App'
  })
  displayName: string;

  @ApiPropertyOptional({ 
    description: 'App description',
    example: 'A comprehensive app for managing containers'
  })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'App domain',
    example: 'myapp.example.com'
  })
  domain?: string;

  @ApiProperty({ 
    description: 'Whether the app is active',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'App-specific settings',
    example: { theme: 'dark', language: 'en' }
  })
  settings?: Record<string, any>;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}

export class AppStatisticsDto {
  @ApiProperty({ 
    description: 'Total number of users',
    example: 150
  })
  totalUsers: number;

  @ApiProperty({ 
    description: 'Active users in the last 30 days',
    example: 120
  })
  activeUsers: number;

  @ApiProperty({ 
    description: 'Total number of devices',
    example: 75
  })
  totalDevices: number;

  @ApiProperty({ 
    description: 'Active devices in the last 30 days',
    example: 60
  })
  activeDevices: number;

  @ApiProperty({ 
    description: 'Total number of subscriptions',
    example: 25
  })
  totalSubscriptions: number;

  @ApiProperty({ 
    description: 'Active subscriptions',
    example: 20
  })
  activeSubscriptions: number;

  @ApiProperty({ 
    description: 'Monthly recurring revenue',
    example: 2500.00
  })
  monthlyRevenue: number;
} 