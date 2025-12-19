import { NotificationCategory, NotificationChannel } from '@prisma/client';
export declare class CreatePreferenceDto {
    category: NotificationCategory;
    channels: NotificationChannel[];
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    emailDigest?: boolean;
    digestFrequency?: string;
}
export declare class UpdatePreferenceDto {
    channels?: NotificationChannel[];
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    emailDigest?: boolean;
    digestFrequency?: string;
}
export declare class PreferenceResponseDto {
    id: string;
    userId: string;
    category: NotificationCategory;
    channels: NotificationChannel[];
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    emailDigest: boolean;
    digestFrequency?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BulkPreferenceUpdateDto {
    preferences: Array<{
        category: NotificationCategory;
        settings: UpdatePreferenceDto;
    }>;
}
