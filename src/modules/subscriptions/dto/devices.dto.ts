import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class DeviceDto {
    @ApiProperty({ description: 'Device ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Device identifier', required: false })
    @IsOptional()
    @IsString()
    deviceId?: string | null;

    @ApiProperty({ description: 'Device name', required: false })
    @IsOptional()
    @IsString()
    deviceName?: string | null;

    @ApiProperty({ description: 'Platform (ios, android, etc.)', required: false })
    @IsOptional()
    @IsString()
    platform?: string | null;

    @ApiProperty({ description: 'App version', required: false })
    @IsOptional()
    @IsString()
    appVersion?: string | null;

    @ApiProperty({ description: 'Number of servers' })
    @IsNumber()
    serverCount: number;

    @ApiProperty({ description: 'User ID', required: false })
    @IsOptional()
    @IsString()
    userId?: string | null;

    @ApiProperty({ description: 'Whether device is active' })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({ description: 'Last seen timestamp' })
    @IsDate()
    lastSeen: Date;

    @ApiProperty({ description: 'Created at timestamp' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Updated at timestamp' })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ description: 'Whether device has active subscription' })
    @IsBoolean()
    hasActiveSubscription: boolean;

    @ApiProperty({ description: 'Maximum number of servers' })
    @IsNumber()
    maxServers: number;

    @ApiProperty({ description: 'Whether device can view logs' })
    @IsBoolean()
    canViewLogs: boolean;

    @ApiProperty({ description: 'App ID for multi-tenancy', required: false })
    @IsOptional()
    @IsString()
    appId?: string | null;

    @ApiProperty({ description: 'OS version', required: false })
    @IsOptional()
    @IsString()
    osVersion?: string | null;

    @ApiProperty({ description: 'Device manufacturer', required: false })
    @IsOptional()
    @IsString()
    manufacturer?: string | null;

    @ApiProperty({ description: 'Device model', required: false })
    @IsOptional()
    @IsString()
    model?: string | null;

    @ApiProperty({ description: 'SDK version (Android)', required: false })
    @IsOptional()
    @IsString()
    sdkVersion?: string | null;

    @ApiProperty({ description: 'Product name', required: false })
    @IsOptional()
    @IsString()
    product?: string | null;

    @ApiProperty({ description: 'Localized model name', required: false })
    @IsOptional()
    @IsString()
    localizedModel?: string | null;
}

export class DevicesListResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'List of devices', type: [DeviceDto] })
    data: DeviceDto[];

    @ApiProperty({ description: 'Pagination information' })
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class DeviceUpdateResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Updated device information' })
    data: DeviceDto;

    @ApiProperty({ description: 'Response message', required: false })
    message?: string;
} 