import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MailgunService } from './mailgun.service';
import { NotificationService } from './notification.service';
import {
    NotificationChannel,
    NotificationStatus,
    NotificationCategory,
    EventType,
    EmailTemplateType,
    NotificationPriority,
    Prisma,
} from '@prisma/client';
import {
    CreateNotificationDto,
    NotificationResponseDto,
    NotificationListQueryDto,
    NotificationListResponseDto,
    UpdateNotificationDto,
    BulkNotificationDto,
} from './dto/notification.dto';
import {
    CreateTemplateDto,
    UpdateTemplateDto,
    TemplateResponseDto,
    TemplateListQueryDto,
    TemplateListResponseDto,
    RenderTemplateDto,
    RenderedTemplateDto,
} from './dto/template.dto';
import {
    CreatePreferenceDto,
    UpdatePreferenceDto,
    PreferenceResponseDto,
    BulkPreferenceUpdateDto,
} from './dto/preference.dto';
import {
    CreateEventDto,
    EventResponseDto,
    EventListQueryDto,
    EventListResponseDto,
    ProcessEventDto,
    EventStatsDto,
} from './dto/event.dto';
import {
    EmailDto,
    EmailTemplateDto,
    QueueEmailDto,
    EmailQueueResponseDto,
    EmailQueueListQueryDto,
    EmailQueueListResponseDto,
    EmailStatsDto,
} from './dto/email.dto';

@Injectable()
export class EnhancedNotificationService {
    private readonly logger = new Logger(EnhancedNotificationService.name);

    constructor(
        private prisma: PrismaService,
        private mailgunService: MailgunService,
        private notificationService: NotificationService,
    ) { }

    // =============== NOTIFICATION MANAGEMENT ===============

    async createNotification(data: CreateNotificationDto): Promise<NotificationResponseDto> {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    title: data.title,
                    message: data.message,
                    data: data.data,
                    channel: data.channel,
                    category: data.category,
                    priority: data.priority || NotificationPriority.NORMAL,
                    recipientId: data.recipientId,
                    recipientEmail: data.recipientEmail,
                    recipientPhone: data.recipientPhone,
                    templateId: data.templateId,
                    eventId: data.eventId,
                    eventType: data.eventType,
                    scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
                    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                    groupId: data.groupId,
                },
            });

            // If not scheduled for later, send immediately
            if (!data.scheduledFor) {
                await this.sendNotification(notification.id);
            }

            return this.mapNotificationToResponse(notification);
        } catch (error) {
            this.logger.error(`Failed to create notification: ${error.message}`, error.stack);
            throw error;
        }
    }

    async sendNotification(notificationId: string): Promise<boolean> {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id: notificationId },
                include: {
                    recipient: true,
                    template: true,
                },
            });

            if (!notification) {
                throw new Error('Notification not found');
            }

            if (notification.status !== NotificationStatus.PENDING) {
                this.logger.warn(`Notification ${notificationId} is not in pending status`);
                return false;
            }

            // Check user preferences
            const userPreferences = notification.recipientId
                ? await this.getUserPreferences(notification.recipientId, notification.category)
                : null;

            if (userPreferences && !this.isChannelAllowed(notification.channel, userPreferences)) {
                await this.prisma.notification.update({
                    where: { id: notificationId },
                    data: { status: NotificationStatus.CANCELLED, failureReason: 'User preference disabled' },
                });
                return false;
            }

            let success = false;

            switch (notification.channel) {
                case NotificationChannel.EMAIL:
                    success = await this.sendEmailNotification(notification);
                    break;
                case NotificationChannel.IN_APP:
                    success = await this.sendInAppNotification(notification);
                    break;
                case NotificationChannel.SMS:
                    success = await this.sendSMSNotification(notification);
                    break;
                case NotificationChannel.PUSH:
                    success = await this.sendPushNotification(notification);
                    break;
                case NotificationChannel.WEBHOOK:
                    success = await this.sendWebhookNotification(notification);
                    break;
                default:
                    this.logger.warn(`Unsupported notification channel: ${notification.channel}`);
                    success = false;
            }

            // Update notification status
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: {
                    status: success ? NotificationStatus.SENT : NotificationStatus.FAILED,
                    sentAt: success ? new Date() : null,
                    failureReason: success ? null : 'Failed to send notification',
                    retryCount: notification.retryCount + 1,
                },
            });

            return success;
        } catch (error) {
            this.logger.error(`Failed to send notification ${notificationId}: ${error.message}`, error.stack);

            // Update with failure
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: {
                    status: NotificationStatus.FAILED,
                    failureReason: error.message,
                    retryCount: { increment: 1 },
                },
            });

            return false;
        }
    }

    async getNotifications(query: NotificationListQueryDto): Promise<NotificationListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.NotificationWhereInput = {};

        if (query.channel) where.channel = query.channel;
        if (query.category) where.category = query.category;
        if (query.status) where.status = query.status;
        if (query.recipientId) where.recipientId = query.recipientId;
        if (query.groupId) where.groupId = query.groupId;

        if (query.fromDate || query.toDate) {
            where.createdAt = {};
            if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
            if (query.toDate) where.createdAt.lte = new Date(query.toDate);
        }

        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    recipient: {
                        select: { id: true, email: true, displayName: true },
                    },
                    template: {
                        select: { id: true, name: true, type: true },
                    },
                },
            }),
            this.prisma.notification.count({ where }),
        ]);

        return {
            notifications: notifications.map(this.mapNotificationToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateNotification(notificationId: string, data: UpdateNotificationDto): Promise<NotificationResponseDto> {
        const updateData: Prisma.NotificationUpdateInput = {};

        if (data.status) updateData.status = data.status;
        if (data.markAsRead) {
            updateData.readAt = new Date();
            updateData.status = NotificationStatus.READ;
        }

        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: updateData,
        });

        return this.mapNotificationToResponse(notification);
    }

    async createBulkNotifications(data: BulkNotificationDto): Promise<NotificationResponseDto[]> {
        const notifications = await Promise.all(
            data.recipientIds.map(recipientId =>
                this.createNotification({
                    ...data,
                    recipientId,
                })
            )
        );

        return notifications;
    }

    // =============== TEMPLATE MANAGEMENT ===============

    async createTemplate(data: CreateTemplateDto): Promise<TemplateResponseDto> {
        const template = await this.prisma.notificationTemplate.create({
            data: {
                name: data.name,
                type: data.type,
                category: data.category,
                subject: data.subject,
                bodyText: data.bodyText,
                bodyHtml: data.bodyHtml,
                variables: data.variables,
                description: data.description,
                isActive: data.isActive ?? true,
            },
        });

        return this.mapTemplateToResponse(template);
    }

    async getTemplates(query: TemplateListQueryDto): Promise<TemplateListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.NotificationTemplateWhereInput = {};

        if (query.type) where.type = query.type;
        if (query.category) where.category = query.category;
        if (query.isActive !== undefined) where.isActive = query.isActive;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        const [templates, total] = await Promise.all([
            this.prisma.notificationTemplate.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notificationTemplate.count({ where }),
        ]);

        return {
            templates: templates.map(this.mapTemplateToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateTemplate(templateId: string, data: UpdateTemplateDto): Promise<TemplateResponseDto> {
        const template = await this.prisma.notificationTemplate.update({
            where: { id: templateId },
            data: {
                ...data,
                version: { increment: 1 },
            },
        });

        return this.mapTemplateToResponse(template);
    }

    async renderTemplate(templateId: string, data: RenderTemplateDto): Promise<RenderedTemplateDto> {
        const template = await this.prisma.notificationTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            throw new Error('Template not found');
        }

        return {
            subject: this.renderString(template.subject, data.data),
            bodyText: this.renderString(template.bodyText, data.data),
            bodyHtml: this.renderString(template.bodyHtml, data.data),
        };
    }

    // =============== PREFERENCE MANAGEMENT ===============

    async createOrUpdatePreference(userId: string, data: CreatePreferenceDto): Promise<PreferenceResponseDto> {
        const preference = await this.prisma.notificationPreference.upsert({
            where: {
                userId_category: {
                    userId,
                    category: data.category,
                },
            },
            create: {
                userId,
                category: data.category,
                channels: data.channels,
                emailEnabled: data.emailEnabled ?? true,
                smsEnabled: data.smsEnabled ?? false,
                pushEnabled: data.pushEnabled ?? true,
                inAppEnabled: data.inAppEnabled ?? true,
                quietHoursStart: data.quietHoursStart,
                quietHoursEnd: data.quietHoursEnd,
                timezone: data.timezone,
                emailDigest: data.emailDigest ?? false,
                digestFrequency: data.digestFrequency,
            },
            update: {
                channels: data.channels,
                emailEnabled: data.emailEnabled,
                smsEnabled: data.smsEnabled,
                pushEnabled: data.pushEnabled,
                inAppEnabled: data.inAppEnabled,
                quietHoursStart: data.quietHoursStart,
                quietHoursEnd: data.quietHoursEnd,
                timezone: data.timezone,
                emailDigest: data.emailDigest,
                digestFrequency: data.digestFrequency,
            },
        });

        return this.mapPreferenceToResponse(preference);
    }

    async getUserPreferences(userId: string, category?: NotificationCategory) {
        const where: Prisma.NotificationPreferenceWhereInput = { userId };
        if (category) where.category = category;

        return this.prisma.notificationPreference.findMany({
            where,
        });
    }

    async updateBulkPreferences(userId: string, data: BulkPreferenceUpdateDto): Promise<PreferenceResponseDto[]> {
        const preferences = await Promise.all(
            data.preferences.map(({ category, settings }) =>
                this.createOrUpdatePreference(userId, {
                    category,
                    channels: [], // Will be updated by settings
                    ...settings,
                })
            )
        );

        return preferences;
    }

    // =============== EVENT MANAGEMENT ===============

    async createEvent(data: CreateEventDto): Promise<EventResponseDto> {
        const event = await this.prisma.systemEvent.create({
            data: {
                type: data.type,
                title: data.title,
                description: data.description,
                data: data.data,
                userId: data.userId,
                merchantId: data.merchantId,
                orderId: data.orderId,
                productId: data.productId,
                severity: data.severity || NotificationPriority.NORMAL,
                source: data.source,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            },
        });

        // Process event rules
        await this.processEventRules(event);

        return this.mapEventToResponse(event);
    }

    async getEvents(query: EventListQueryDto): Promise<EventListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.SystemEventWhereInput = {};

        if (query.type) where.type = query.type;
        if (query.userId) where.userId = query.userId;
        if (query.merchantId) where.merchantId = query.merchantId;
        if (query.orderId) where.orderId = query.orderId;
        if (query.productId) where.productId = query.productId;
        if (query.severity) where.severity = query.severity;
        if (query.processed !== undefined) where.processed = query.processed;
        if (query.source) where.source = query.source;

        if (query.fromDate || query.toDate) {
            where.createdAt = {};
            if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
            if (query.toDate) where.createdAt.lte = new Date(query.toDate);
        }

        const [events, total] = await Promise.all([
            this.prisma.systemEvent.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.systemEvent.count({ where }),
        ]);

        return {
            events: events.map(this.mapEventToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getEventStats(): Promise<EventStatsDto> {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            total,
            byType,
            bySeverity,
            processed,
            unprocessed,
            count24h,
            count7d,
            count30d,
        ] = await Promise.all([
            this.prisma.systemEvent.count(),
            this.prisma.systemEvent.groupBy({
                by: ['type'],
                _count: { type: true },
            }),
            this.prisma.systemEvent.groupBy({
                by: ['severity'],
                _count: { severity: true },
            }),
            this.prisma.systemEvent.count({ where: { processed: true } }),
            this.prisma.systemEvent.count({ where: { processed: false } }),
            this.prisma.systemEvent.count({ where: { createdAt: { gte: last24Hours } } }),
            this.prisma.systemEvent.count({ where: { createdAt: { gte: last7Days } } }),
            this.prisma.systemEvent.count({ where: { createdAt: { gte: last30Days } } }),
        ]);

        return {
            total,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {} as Record<EventType, number>),
            bySeverity: bySeverity.reduce((acc, item) => {
                acc[item.severity] = item._count.severity;
                return acc;
            }, {} as Record<NotificationPriority, number>),
            processed,
            unprocessed,
            last24Hours: count24h,
            last7Days: count7d,
            last30Days: count30d,
        };
    }

    // =============== EMAIL MANAGEMENT ===============

    async queueEmail(data: QueueEmailDto): Promise<EmailQueueResponseDto> {
        const email = await this.prisma.emailQueue.create({
            data: {
                fromEmail: data.fromEmail,
                fromName: data.fromName,
                toEmail: data.toEmail,
                toName: data.toName,
                subject: data.subject,
                bodyText: data.bodyText,
                bodyHtml: data.bodyHtml,
                ccEmails: data.ccEmails || [],
                bccEmails: data.bccEmails || [],
                attachments: (data.attachments || []) as any,
                notificationId: data.notificationId,
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });

        // Send immediately if not scheduled
        if (!data.scheduledFor) {
            await this.sendQueuedEmail(email.id);
        }

        return this.mapEmailQueueToResponse(email);
    }

    async sendQueuedEmail(emailId: string): Promise<boolean> {
        const email = await this.prisma.emailQueue.findUnique({
            where: { id: emailId },
        });

        if (!email || email.status !== NotificationStatus.PENDING) {
            return false;
        }

        try {
            const success = await this.mailgunService.sendEmail({
                to: [{ email: email.toEmail, name: email.toName || undefined }],
                cc: email.ccEmails.map(email => ({ email })),
                bcc: email.bccEmails.map(email => ({ email })),
                subject: email.subject,
                text: email.bodyText,
                html: email.bodyHtml || undefined,
                attachments: email.attachments as any[],
            });

            await this.prisma.emailQueue.update({
                where: { id: emailId },
                data: {
                    status: success ? NotificationStatus.SENT : NotificationStatus.FAILED,
                    sentAt: success ? new Date() : null,
                    failureReason: success ? null : 'Failed to send email',
                    retryCount: { increment: 1 },
                },
            });

            return success;
        } catch (error) {
            await this.prisma.emailQueue.update({
                where: { id: emailId },
                data: {
                    status: NotificationStatus.FAILED,
                    failureReason: error.message,
                    retryCount: { increment: 1 },
                },
            });

            return false;
        }
    }

    async getEmailQueue(query: EmailQueueListQueryDto): Promise<EmailQueueListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.EmailQueueWhereInput = {};

        if (query.status) where.status = query.status;
        if (query.toEmail) where.toEmail = { contains: query.toEmail, mode: 'insensitive' };
        if (query.fromEmail) where.fromEmail = { contains: query.fromEmail, mode: 'insensitive' };
        if (query.subject) where.subject = { contains: query.subject, mode: 'insensitive' };

        if (query.fromDate || query.toDate) {
            where.createdAt = {};
            if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
            if (query.toDate) where.createdAt.lte = new Date(query.toDate);
        }

        const [emails, total] = await Promise.all([
            this.prisma.emailQueue.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.emailQueue.count({ where }),
        ]);

        return {
            emails: emails.map(this.mapEmailQueueToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getEmailStats(): Promise<EmailStatsDto> {
        const [
            totalSent,
            delivered,
            opened,
            clicked,
            bounced,
            failed,
        ] = await Promise.all([
            this.prisma.emailQueue.count({ where: { status: NotificationStatus.SENT } }),
            this.prisma.emailQueue.count({ where: { deliveredAt: { not: null } } }),
            this.prisma.emailQueue.count({ where: { openedAt: { not: null } } }),
            this.prisma.emailQueue.count({ where: { clickedAt: { not: null } } }),
            this.prisma.emailQueue.count({ where: { bouncedAt: { not: null } } }),
            this.prisma.emailQueue.count({ where: { status: NotificationStatus.FAILED } }),
        ]);

        const total = totalSent + failed;

        return {
            totalSent,
            delivered,
            opened,
            clicked,
            bounced,
            failed,
            deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
            openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
            clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
            bounceRate: total > 0 ? (bounced / total) * 100 : 0,
        };
    }

    // =============== PRIVATE HELPER METHODS ===============

    private async sendEmailNotification(notification: any): Promise<boolean> {
        let emailData: EmailDto;

        if (notification.template) {
            const rendered = await this.renderTemplate(notification.template.id, {
                data: notification.data || {},
            });

            emailData = {
                to: [{
                    email: notification.recipientEmail || notification.recipient?.email,
                    name: notification.recipient?.displayName
                }],
                subject: rendered.subject,
                text: rendered.bodyText,
                html: rendered.bodyHtml,
            };
        } else {
            emailData = {
                to: [{
                    email: notification.recipientEmail || notification.recipient?.email,
                    name: notification.recipient?.displayName
                }],
                subject: notification.title,
                text: notification.message,
                html: `<h2>${notification.title}</h2><p>${notification.message}</p>`,
            };
        }

        return this.mailgunService.sendEmail(emailData);
    }

    private async sendInAppNotification(notification: any): Promise<boolean> {
        // In-app notifications are stored in the database and shown in the UI
        // This is essentially already handled by creating the notification record
        return true;
    }

    private async sendSMSNotification(notification: any): Promise<boolean> {
        // SMS implementation would go here
        // For now, log and return false
        this.logger.warn('SMS notifications not implemented yet');
        return false;
    }

    private async sendPushNotification(notification: any): Promise<boolean> {
        // Use existing Firebase notification service
        try {
            return await this.notificationService.sendFirebaseNotification({
                title: notification.title,
                body: notification.message,
                data: notification.data,
            });
        } catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`);
            return false;
        }
    }

    private async sendWebhookNotification(notification: any): Promise<boolean> {
        // Webhook implementation would go here
        this.logger.warn('Webhook notifications not implemented yet');
        return false;
    }

    private isChannelAllowed(channel: NotificationChannel, preferences: any[]): boolean {
        const categoryPreference = preferences.find(p => p.category === channel);
        if (!categoryPreference) return true; // Default to allowed if no preference set

        switch (channel) {
            case NotificationChannel.EMAIL:
                return categoryPreference.emailEnabled;
            case NotificationChannel.SMS:
                return categoryPreference.smsEnabled;
            case NotificationChannel.PUSH:
                return categoryPreference.pushEnabled;
            case NotificationChannel.IN_APP:
                return categoryPreference.inAppEnabled;
            default:
                return true;
        }
    }

    private async processEventRules(event: any): Promise<void> {
        // Get notification rules for this event type
        const rules = await this.prisma.notificationRule.findMany({
            where: {
                eventType: event.type,
                isActive: true,
            },
            include: {
                template: true,
            },
        });

        for (const rule of rules) {
            // Check conditions
            if (rule.conditions && !this.evaluateConditions(rule.conditions as any, event)) {
                continue;
            }

            // Check cooldown
            if (rule.cooldownTime && await this.isInCooldown(rule.id, rule.cooldownTime)) {
                continue;
            }

            // Send notifications to targets
            await this.sendRuleNotifications(rule, event);
        }
    }

    private evaluateConditions(conditions: any, event: any): boolean {
        // Simple condition evaluation - can be enhanced
        if (conditions.severity && conditions.severity !== event.severity) {
            return false;
        }
        if (conditions.source && conditions.source !== event.source) {
            return false;
        }
        return true;
    }

    private async isInCooldown(ruleId: string, cooldownMinutes: number): Promise<boolean> {
        const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);
        const recentNotification = await this.prisma.notification.findFirst({
            where: {
                createdAt: { gte: cooldownTime },
                data: { path: ['ruleId'], equals: ruleId },
            },
        });
        return !!recentNotification;
    }

    private async sendRuleNotifications(rule: any, event: any): Promise<void> {
        const notifications: CreateNotificationDto[] = [];

        // Target specific users
        for (const userId of rule.targetUserIds) {
            for (const channel of rule.channels) {
                notifications.push({
                    title: rule.template?.subject || `${event.type}: ${event.title}`,
                    message: rule.template?.bodyText || event.description || event.title,
                    channel,
                    category: rule.template?.category || NotificationCategory.SYSTEM,
                    priority: rule.priority,
                    recipientId: userId,
                    templateId: rule.templateId,
                    eventId: event.id,
                    eventType: event.type,
                    data: { ...event.data, ruleId: rule.id },
                });
            }
        }

        // Target external emails
        for (const email of rule.targetEmails) {
            notifications.push({
                title: rule.template?.subject || `${event.type}: ${event.title}`,
                message: rule.template?.bodyText || event.description || event.title,
                channel: NotificationChannel.EMAIL,
                category: rule.template?.category || NotificationCategory.SYSTEM,
                priority: rule.priority,
                recipientEmail: email,
                templateId: rule.templateId,
                eventId: event.id,
                eventType: event.type,
                data: { ...event.data, ruleId: rule.id },
            });
        }

        // Create all notifications
        await Promise.all(notifications.map(n => this.createNotification(n)));
    }

    private renderString(template: string, data: Record<string, any>): string {
        // Simple template rendering - replace {{variable}} with data values
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match;
        });
    }

    private mapNotificationToResponse(notification: any): NotificationResponseDto {
        return {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            channel: notification.channel,
            category: notification.category,
            priority: notification.priority,
            status: notification.status,
            sentAt: notification.sentAt,
            deliveredAt: notification.deliveredAt,
            readAt: notification.readAt,
            failureReason: notification.failureReason,
            retryCount: notification.retryCount,
            recipientId: notification.recipientId,
            recipientEmail: notification.recipientEmail,
            recipientPhone: notification.recipientPhone,
            templateId: notification.templateId,
            eventId: notification.eventId,
            eventType: notification.eventType,
            scheduledFor: notification.scheduledFor,
            expiresAt: notification.expiresAt,
            groupId: notification.groupId,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }

    private mapTemplateToResponse(template: any): TemplateResponseDto {
        return {
            id: template.id,
            name: template.name,
            type: template.type,
            category: template.category,
            subject: template.subject,
            bodyText: template.bodyText,
            bodyHtml: template.bodyHtml,
            variables: template.variables,
            description: template.description,
            isActive: template.isActive,
            version: template.version,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt,
        };
    }

    private mapPreferenceToResponse(preference: any): PreferenceResponseDto {
        return {
            id: preference.id,
            userId: preference.userId,
            category: preference.category,
            channels: preference.channels,
            emailEnabled: preference.emailEnabled,
            smsEnabled: preference.smsEnabled,
            pushEnabled: preference.pushEnabled,
            inAppEnabled: preference.inAppEnabled,
            quietHoursStart: preference.quietHoursStart,
            quietHoursEnd: preference.quietHoursEnd,
            timezone: preference.timezone,
            emailDigest: preference.emailDigest,
            digestFrequency: preference.digestFrequency,
            createdAt: preference.createdAt,
            updatedAt: preference.updatedAt,
        };
    }

    private mapEventToResponse(event: any): EventResponseDto {
        return {
            id: event.id,
            type: event.type,
            title: event.title,
            description: event.description,
            data: event.data,
            userId: event.userId,
            merchantId: event.merchantId,
            orderId: event.orderId,
            productId: event.productId,
            severity: event.severity,
            source: event.source,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            processed: event.processed,
            processedAt: event.processedAt,
            createdAt: event.createdAt,
        };
    }

    private mapEmailQueueToResponse(email: any): EmailQueueResponseDto {
        return {
            id: email.id,
            fromEmail: email.fromEmail,
            fromName: email.fromName,
            toEmail: email.toEmail,
            toName: email.toName,
            subject: email.subject,
            bodyText: email.bodyText,
            bodyHtml: email.bodyHtml,
            ccEmails: email.ccEmails,
            bccEmails: email.bccEmails,
            attachments: email.attachments,
            status: email.status,
            sentAt: email.sentAt,
            deliveredAt: email.deliveredAt,
            openedAt: email.openedAt,
            clickedAt: email.clickedAt,
            bouncedAt: email.bouncedAt,
            failureReason: email.failureReason,
            retryCount: email.retryCount,
            maxRetries: email.maxRetries,
            notificationId: email.notificationId,
            scheduledFor: email.scheduledFor,
            expiresAt: email.expiresAt,
            provider: email.provider,
            providerId: email.providerId,
            providerData: email.providerData,
            createdAt: email.createdAt,
            updatedAt: email.updatedAt,
        };
    }
}
