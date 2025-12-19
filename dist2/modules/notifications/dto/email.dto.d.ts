import { NotificationStatus } from '@prisma/client';
export interface EmailRecipient {
    email: string;
    name?: string;
}
export interface EmailAttachment {
    filename: string;
    data: string;
    contentType?: string;
}
export declare class EmailDto {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    text: string;
    html?: string;
    attachments?: EmailAttachment[];
}
export declare class EmailTemplateDto {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    templateName: string;
    templateVars: Record<string, any>;
    attachments?: EmailAttachment[];
}
export declare class QueueEmailDto {
    fromEmail: string;
    fromName?: string;
    toEmail: string;
    toName?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    ccEmails?: string[];
    bccEmails?: string[];
    attachments?: EmailAttachment[];
    notificationId?: string;
    scheduledFor?: string;
    expiresAt?: string;
}
export declare class EmailQueueResponseDto {
    id: string;
    fromEmail: string;
    fromName?: string;
    toEmail: string;
    toName?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    ccEmails?: string[];
    bccEmails?: string[];
    attachments?: EmailAttachment[];
    status: NotificationStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    failureReason?: string;
    retryCount: number;
    maxRetries: number;
    notificationId?: string;
    scheduledFor?: Date;
    expiresAt?: Date;
    provider?: string;
    providerId?: string;
    providerData?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EmailQueueListQueryDto {
    page?: number;
    limit?: number;
    status?: NotificationStatus;
    toEmail?: string;
    fromEmail?: string;
    subject?: string;
    fromDate?: string;
    toDate?: string;
}
export declare class EmailQueueListResponseDto {
    emails: EmailQueueResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class EmailStatsDto {
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
}
