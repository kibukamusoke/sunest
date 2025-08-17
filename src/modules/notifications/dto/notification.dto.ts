import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsDateString, IsBoolean, IsArray } from 'class-validator';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationCategory,
  EventType
} from '@prisma/client';

// Legacy enum for backward compatibility with existing notification service
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

// Legacy DTOs for backward compatibility
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

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Additional data payload' })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ enum: NotificationChannel, description: 'Notification channel' })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ enum: NotificationCategory, description: 'Notification category' })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiPropertyOptional({ enum: NotificationPriority, description: 'Notification priority' })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiPropertyOptional({ description: 'Recipient user ID' })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @ApiPropertyOptional({ description: 'Recipient email (for external notifications)' })
  @IsString()
  @IsOptional()
  recipientEmail?: string;

  @ApiPropertyOptional({ description: 'Recipient phone (for SMS notifications)' })
  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @ApiPropertyOptional({ description: 'Template ID to use' })
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Associated event ID' })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({ enum: EventType, description: 'Event type' })
  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @ApiPropertyOptional({ description: 'Schedule notification for later' })
  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @ApiPropertyOptional({ description: 'Notification expiration time' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Group ID for related notifications' })
  @IsString()
  @IsOptional()
  groupId?: string;
}

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification ID' })
  id: string;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  message: string;

  @ApiPropertyOptional({ description: 'Additional data payload' })
  data?: any;

  @ApiProperty({ enum: NotificationChannel, description: 'Notification channel' })
  channel: NotificationChannel;

  @ApiProperty({ enum: NotificationCategory, description: 'Notification category' })
  category: NotificationCategory;

  @ApiProperty({ enum: NotificationPriority, description: 'Notification priority' })
  priority: NotificationPriority;

  @ApiProperty({ enum: NotificationStatus, description: 'Notification status' })
  status: NotificationStatus;

  @ApiPropertyOptional({ description: 'When notification was sent' })
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'When notification was delivered' })
  deliveredAt?: Date;

  @ApiPropertyOptional({ description: 'When notification was read' })
  readAt?: Date;

  @ApiPropertyOptional({ description: 'Failure reason if failed' })
  failureReason?: string;

  @ApiProperty({ description: 'Retry count' })
  retryCount: number;

  @ApiPropertyOptional({ description: 'Recipient user ID' })
  recipientId?: string;

  @ApiPropertyOptional({ description: 'Recipient email' })
  recipientEmail?: string;

  @ApiPropertyOptional({ description: 'Recipient phone' })
  recipientPhone?: string;

  @ApiPropertyOptional({ description: 'Template ID' })
  templateId?: string;

  @ApiPropertyOptional({ description: 'Event ID' })
  eventId?: string;

  @ApiPropertyOptional({ enum: EventType, description: 'Event type' })
  eventType?: EventType;

  @ApiPropertyOptional({ description: 'Scheduled time' })
  scheduledFor?: Date;

  @ApiPropertyOptional({ description: 'Expiration time' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: 'Group ID' })
  groupId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}

export class NotificationListQueryDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ enum: NotificationChannel, description: 'Filter by channel' })
  @IsEnum(NotificationChannel)
  @IsOptional()
  channel?: NotificationChannel;

  @ApiPropertyOptional({ enum: NotificationCategory, description: 'Filter by category' })
  @IsEnum(NotificationCategory)
  @IsOptional()
  category?: NotificationCategory;

  @ApiPropertyOptional({ enum: NotificationStatus, description: 'Filter by status' })
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @ApiPropertyOptional({ description: 'Filter by recipient ID' })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @ApiPropertyOptional({ description: 'Filter by group ID' })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Filter from date' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date' })
  @IsDateString()
  @IsOptional()
  toDate?: string;
}

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto], description: 'List of notifications' })
  notifications: NotificationResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Page size' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}

export class UpdateNotificationDto {
  @ApiPropertyOptional({ enum: NotificationStatus, description: 'Update notification status' })
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @ApiPropertyOptional({ description: 'Mark as read' })
  @IsBoolean()
  @IsOptional()
  markAsRead?: boolean;
}

export class BulkNotificationDto {
  @ApiProperty({ type: [String], description: 'Recipient IDs' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  recipientIds: string[];

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Additional data payload' })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ enum: NotificationChannel, description: 'Notification channel' })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ enum: NotificationCategory, description: 'Notification category' })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiPropertyOptional({ enum: NotificationPriority, description: 'Notification priority' })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiPropertyOptional({ description: 'Template ID to use' })
  @IsUUID()
  @IsOptional()
  templateId?: string;
}