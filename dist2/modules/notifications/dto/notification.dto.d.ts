import { NotificationChannel, NotificationPriority, NotificationStatus, NotificationCategory, EventType } from '@prisma/client';
export declare enum NotificationType {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS"
}
export interface NotificationDto {
    title: string;
    body: string;
    type?: NotificationType;
    data?: any;
}
export interface FirebaseNotificationDto {
    title: string;
    body: string;
    tokens?: string[];
    topic?: string;
    type?: NotificationType;
    data?: any;
}
export interface TelegramNotificationDto {
    message: string;
    chatId?: string;
}
export interface PhotoNotificationDto {
    photo: string;
    photoUrl: string;
    caption?: string;
    chatId?: string;
}
export interface DocumentNotificationDto {
    document: string;
    documentUrl: string;
    caption?: string;
    chatId?: string;
}
export declare class CreateNotificationDto {
    title: string;
    message: string;
    data?: any;
    channel: NotificationChannel;
    category: NotificationCategory;
    priority?: NotificationPriority;
    recipientId?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    templateId?: string;
    eventId?: string;
    eventType?: EventType;
    scheduledFor?: string;
    expiresAt?: string;
    groupId?: string;
}
export declare class NotificationResponseDto {
    id: string;
    title: string;
    message: string;
    data?: any;
    channel: NotificationChannel;
    category: NotificationCategory;
    priority: NotificationPriority;
    status: NotificationStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failureReason?: string;
    retryCount: number;
    recipientId?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    templateId?: string;
    eventId?: string;
    eventType?: EventType;
    scheduledFor?: Date;
    expiresAt?: Date;
    groupId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class NotificationListQueryDto {
    page?: number;
    limit?: number;
    channel?: NotificationChannel;
    category?: NotificationCategory;
    status?: NotificationStatus;
    recipientId?: string;
    groupId?: string;
    fromDate?: string;
    toDate?: string;
}
export declare class NotificationListResponseDto {
    notifications: NotificationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class UpdateNotificationDto {
    status?: NotificationStatus;
    markAsRead?: boolean;
}
export declare class BulkNotificationDto {
    recipientIds: string[];
    title: string;
    message: string;
    data?: any;
    channel: NotificationChannel;
    category: NotificationCategory;
    priority?: NotificationPriority;
    templateId?: string;
}
