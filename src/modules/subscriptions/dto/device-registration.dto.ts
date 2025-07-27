import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class DeviceRegistrationDto {
    @ApiProperty({ description: 'Unique device identifier (optional, backend will generate if not provided)', required: false })
    @IsOptional()
    @IsString()
    deviceId?: string;

    @ApiProperty({ description: 'Device name', required: false })
    @IsOptional()
    @IsString()
    deviceName?: string;

    @ApiProperty({ description: 'Platform (ios, android, etc.)', required: false })
    @IsOptional()
    @IsString()
    platform?: string;

    @ApiProperty({ description: 'App version', required: false })
    @IsOptional()
    @IsString()
    appVersion?: string;

    @ApiProperty({ description: 'App ID for multi-tenancy' })
    @IsString()
    appId: string;

    @ApiProperty({ description: 'OS version', required: false })
    @IsOptional()
    @IsString()
    osVersion?: string;

    @ApiProperty({ description: 'Device manufacturer', required: false })
    @IsOptional()
    @IsString()
    manufacturer?: string;

    @ApiProperty({ description: 'Device model', required: false })
    @IsOptional()
    @IsString()
    model?: string;

    @ApiProperty({ description: 'SDK version (Android)', required: false })
    @IsOptional()
    @IsString()
    sdkVersion?: string;

    @ApiProperty({ description: 'Product name', required: false })
    @IsOptional()
    @IsString()
    product?: string;

    @ApiProperty({ description: 'Localized model name', required: false })
    @IsOptional()
    @IsString()
    localizedModel?: string;
}

export class DeviceRegistrationResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Device information' })
    data: {
        deviceId: string;
        hasActiveSubscription: boolean;
        maxServers: number;
        canViewLogs: boolean;
        isActive: boolean;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
} 