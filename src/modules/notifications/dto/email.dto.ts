import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsObject, IsUUID, IsDateString } from 'class-validator';
import { NotificationStatus } from '@prisma/client';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  data: string; // base64 encoded data
  contentType?: string;
}

export class EmailDto {
  @ApiProperty({ type: [Object], description: 'Email recipients' })
  @IsArray()
  to: EmailRecipient[];

  @ApiPropertyOptional({ type: [Object], description: 'CC recipients' })
  @IsArray()
  @IsOptional()
  cc?: EmailRecipient[];

  @ApiPropertyOptional({ type: [Object], description: 'BCC recipients' })
  @IsArray()
  @IsOptional()
  bcc?: EmailRecipient[];

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Plain text email body' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'HTML email body' })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiPropertyOptional({ type: [Object], description: 'Email attachments' })
  @IsArray()
  @IsOptional()
  attachments?: EmailAttachment[];
}

export class EmailTemplateDto {
  @ApiProperty({ type: [Object], description: 'Email recipients' })
  @IsArray()
  to: EmailRecipient[];

  @ApiPropertyOptional({ type: [Object], description: 'CC recipients' })
  @IsArray()
  @IsOptional()
  cc?: EmailRecipient[];

  @ApiPropertyOptional({ type: [Object], description: 'BCC recipients' })
  @IsArray()
  @IsOptional()
  bcc?: EmailRecipient[];

  @ApiProperty({ description: 'Template name/identifier' })
  @IsString()
  templateName: string;

  @ApiProperty({ description: 'Template variables' })
  @IsObject()
  templateVars: Record<string, any>;

  @ApiPropertyOptional({ type: [Object], description: 'Email attachments' })
  @IsArray()
  @IsOptional()
  attachments?: EmailAttachment[];
}

export class QueueEmailDto {
  @ApiProperty({ description: 'From email address' })
  @IsString()
  fromEmail: string;

  @ApiPropertyOptional({ description: 'From name' })
  @IsString()
  @IsOptional()
  fromName?: string;

  @ApiProperty({ description: 'To email address' })
  @IsString()
  toEmail: string;

  @ApiPropertyOptional({ description: 'To name' })
  @IsString()
  @IsOptional()
  toName?: string;

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Plain text body' })
  @IsString()
  bodyText: string;

  @ApiPropertyOptional({ description: 'HTML body' })
  @IsString()
  @IsOptional()
  bodyHtml?: string;

  @ApiPropertyOptional({ type: [String], description: 'CC email addresses' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ccEmails?: string[];

  @ApiPropertyOptional({ type: [String], description: 'BCC email addresses' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bccEmails?: string[];

  @ApiPropertyOptional({ type: [Object], description: 'Email attachments' })
  @IsArray()
  @IsOptional()
  attachments?: EmailAttachment[];

  @ApiPropertyOptional({ description: 'Related notification ID' })
  @IsUUID()
  @IsOptional()
  notificationId?: string;

  @ApiPropertyOptional({ description: 'Schedule email for later' })
  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @ApiPropertyOptional({ description: 'Email expiration time' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class EmailQueueResponseDto {
  @ApiProperty({ description: 'Email queue ID' })
  id: string;

  @ApiProperty({ description: 'From email address' })
  fromEmail: string;

  @ApiPropertyOptional({ description: 'From name' })
  fromName?: string;

  @ApiProperty({ description: 'To email address' })
  toEmail: string;

  @ApiPropertyOptional({ description: 'To name' })
  toName?: string;

  @ApiProperty({ description: 'Email subject' })
  subject: string;

  @ApiProperty({ description: 'Plain text body' })
  bodyText: string;

  @ApiPropertyOptional({ description: 'HTML body' })
  bodyHtml?: string;

  @ApiPropertyOptional({ type: [String], description: 'CC email addresses' })
  ccEmails?: string[];

  @ApiPropertyOptional({ type: [String], description: 'BCC email addresses' })
  bccEmails?: string[];

  @ApiPropertyOptional({ type: [Object], description: 'Email attachments' })
  attachments?: EmailAttachment[];

  @ApiProperty({ enum: NotificationStatus, description: 'Email status' })
  status: NotificationStatus;

  @ApiPropertyOptional({ description: 'When email was sent' })
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'When email was delivered' })
  deliveredAt?: Date;

  @ApiPropertyOptional({ description: 'When email was opened' })
  openedAt?: Date;

  @ApiPropertyOptional({ description: 'When email was clicked' })
  clickedAt?: Date;

  @ApiPropertyOptional({ description: 'When email bounced' })
  bouncedAt?: Date;

  @ApiPropertyOptional({ description: 'Failure reason if failed' })
  failureReason?: string;

  @ApiProperty({ description: 'Retry count' })
  retryCount: number;

  @ApiProperty({ description: 'Maximum retries' })
  maxRetries: number;

  @ApiPropertyOptional({ description: 'Related notification ID' })
  notificationId?: string;

  @ApiPropertyOptional({ description: 'Scheduled time' })
  scheduledFor?: Date;

  @ApiPropertyOptional({ description: 'Expiration time' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: 'Email provider' })
  provider?: string;

  @ApiPropertyOptional({ description: 'Provider message ID' })
  providerId?: string;

  @ApiPropertyOptional({ description: 'Provider-specific data' })
  providerData?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}

export class EmailQueueListQueryDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ enum: NotificationStatus, description: 'Filter by status' })
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @ApiPropertyOptional({ description: 'Filter by to email' })
  @IsString()
  @IsOptional()
  toEmail?: string;

  @ApiPropertyOptional({ description: 'Filter by from email' })
  @IsString()
  @IsOptional()
  fromEmail?: string;

  @ApiPropertyOptional({ description: 'Filter by subject (contains)' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'Filter from date' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date' })
  @IsDateString()
  @IsOptional()
  toDate?: string;
}

export class EmailQueueListResponseDto {
  @ApiProperty({ type: [EmailQueueResponseDto], description: 'List of queued emails' })
  emails: EmailQueueResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Page size' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}

export class EmailStatsDto {
  @ApiProperty({ description: 'Total emails sent' })
  totalSent: number;

  @ApiProperty({ description: 'Emails delivered' })
  delivered: number;

  @ApiProperty({ description: 'Emails opened' })
  opened: number;

  @ApiProperty({ description: 'Emails clicked' })
  clicked: number;

  @ApiProperty({ description: 'Emails bounced' })
  bounced: number;

  @ApiProperty({ description: 'Emails failed' })
  failed: number;

  @ApiProperty({ description: 'Delivery rate (%)' })
  deliveryRate: number;

  @ApiProperty({ description: 'Open rate (%)' })
  openRate: number;

  @ApiProperty({ description: 'Click rate (%)' })
  clickRate: number;

  @ApiProperty({ description: 'Bounce rate (%)' })
  bounceRate: number;
}