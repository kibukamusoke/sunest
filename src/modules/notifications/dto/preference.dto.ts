import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { NotificationCategory, NotificationChannel } from '@prisma/client';

export class CreatePreferenceDto {
    @ApiProperty({ enum: NotificationCategory, description: 'Notification category' })
    @IsEnum(NotificationCategory)
    category: NotificationCategory;

    @ApiProperty({ enum: NotificationChannel, isArray: true, description: 'Preferred channels' })
    @IsArray()
    @IsEnum(NotificationChannel, { each: true })
    channels: NotificationChannel[];

    @ApiPropertyOptional({ description: 'Enable email notifications' })
    @IsBoolean()
    @IsOptional()
    emailEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable SMS notifications' })
    @IsBoolean()
    @IsOptional()
    smsEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable push notifications' })
    @IsBoolean()
    @IsOptional()
    pushEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable in-app notifications' })
    @IsBoolean()
    @IsOptional()
    inAppEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Quiet hours start time (HH:mm format)' })
    @IsString()
    @IsOptional()
    quietHoursStart?: string;

    @ApiPropertyOptional({ description: 'Quiet hours end time (HH:mm format)' })
    @IsString()
    @IsOptional()
    quietHoursEnd?: string;

    @ApiPropertyOptional({ description: 'User timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ description: 'Receive email digest instead of individual emails' })
    @IsBoolean()
    @IsOptional()
    emailDigest?: boolean;

    @ApiPropertyOptional({ description: 'Digest frequency (daily, weekly)' })
    @IsString()
    @IsOptional()
    digestFrequency?: string;
}

export class UpdatePreferenceDto {
    @ApiPropertyOptional({ enum: NotificationChannel, isArray: true, description: 'Preferred channels' })
    @IsArray()
    @IsEnum(NotificationChannel, { each: true })
    @IsOptional()
    channels?: NotificationChannel[];

    @ApiPropertyOptional({ description: 'Enable email notifications' })
    @IsBoolean()
    @IsOptional()
    emailEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable SMS notifications' })
    @IsBoolean()
    @IsOptional()
    smsEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable push notifications' })
    @IsBoolean()
    @IsOptional()
    pushEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Enable in-app notifications' })
    @IsBoolean()
    @IsOptional()
    inAppEnabled?: boolean;

    @ApiPropertyOptional({ description: 'Quiet hours start time (HH:mm format)' })
    @IsString()
    @IsOptional()
    quietHoursStart?: string;

    @ApiPropertyOptional({ description: 'Quiet hours end time (HH:mm format)' })
    @IsString()
    @IsOptional()
    quietHoursEnd?: string;

    @ApiPropertyOptional({ description: 'User timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ description: 'Receive email digest instead of individual emails' })
    @IsBoolean()
    @IsOptional()
    emailDigest?: boolean;

    @ApiPropertyOptional({ description: 'Digest frequency (daily, weekly)' })
    @IsString()
    @IsOptional()
    digestFrequency?: string;
}

export class PreferenceResponseDto {
    @ApiProperty({ description: 'Preference ID' })
    id: string;

    @ApiProperty({ description: 'User ID' })
    userId: string;

    @ApiProperty({ enum: NotificationCategory, description: 'Notification category' })
    category: NotificationCategory;

    @ApiProperty({ enum: NotificationChannel, isArray: true, description: 'Preferred channels' })
    channels: NotificationChannel[];

    @ApiProperty({ description: 'Email notifications enabled' })
    emailEnabled: boolean;

    @ApiProperty({ description: 'SMS notifications enabled' })
    smsEnabled: boolean;

    @ApiProperty({ description: 'Push notifications enabled' })
    pushEnabled: boolean;

    @ApiProperty({ description: 'In-app notifications enabled' })
    inAppEnabled: boolean;

    @ApiPropertyOptional({ description: 'Quiet hours start time' })
    quietHoursStart?: string;

    @ApiPropertyOptional({ description: 'Quiet hours end time' })
    quietHoursEnd?: string;

    @ApiPropertyOptional({ description: 'User timezone' })
    timezone?: string;

    @ApiProperty({ description: 'Email digest enabled' })
    emailDigest: boolean;

    @ApiPropertyOptional({ description: 'Digest frequency' })
    digestFrequency?: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class BulkPreferenceUpdateDto {
    @ApiProperty({ type: [UpdatePreferenceDto], description: 'Array of preference updates by category' })
    preferences: Array<{
        category: NotificationCategory;
        settings: UpdatePreferenceDto;
    }>;
}
