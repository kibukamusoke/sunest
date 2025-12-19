import { EnhancedNotificationService } from './enhanced-notification.service';
import { CreateNotificationDto, NotificationResponseDto, NotificationListQueryDto, NotificationListResponseDto, UpdateNotificationDto, BulkNotificationDto } from './dto/notification.dto';
import { CreateTemplateDto, UpdateTemplateDto, TemplateResponseDto, TemplateListQueryDto, TemplateListResponseDto, RenderTemplateDto, RenderedTemplateDto } from './dto/template.dto';
import { CreatePreferenceDto, PreferenceResponseDto, BulkPreferenceUpdateDto } from './dto/preference.dto';
import { CreateEventDto, EventResponseDto, EventListQueryDto, EventListResponseDto, EventStatsDto } from './dto/event.dto';
import { QueueEmailDto, EmailQueueResponseDto, EmailQueueListQueryDto, EmailQueueListResponseDto, EmailStatsDto } from './dto/email.dto';
export declare class EnhancedNotificationController {
    private readonly notificationService;
    constructor(notificationService: EnhancedNotificationService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    getNotifications(query: NotificationListQueryDto, req: any): Promise<NotificationListResponseDto>;
    updateNotification(id: string, updateNotificationDto: UpdateNotificationDto): Promise<NotificationResponseDto>;
    createBulkNotifications(bulkNotificationDto: BulkNotificationDto): Promise<NotificationResponseDto[]>;
    sendNotification(id: string): Promise<boolean>;
    createTemplate(createTemplateDto: CreateTemplateDto): Promise<TemplateResponseDto>;
    getTemplates(query: TemplateListQueryDto): Promise<TemplateListResponseDto>;
    updateTemplate(id: string, updateTemplateDto: UpdateTemplateDto): Promise<TemplateResponseDto>;
    renderTemplate(id: string, renderTemplateDto: RenderTemplateDto): Promise<RenderedTemplateDto>;
    getUserPreferences(req: any): Promise<{
        category: import(".prisma/client").$Enums.NotificationCategory;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channels: import(".prisma/client").$Enums.NotificationChannel[];
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        inAppEnabled: boolean;
        quietHoursStart: string | null;
        quietHoursEnd: string | null;
        timezone: string | null;
        emailDigest: boolean;
        digestFrequency: string | null;
    }[]>;
    createOrUpdatePreference(createPreferenceDto: CreatePreferenceDto, req: any): Promise<PreferenceResponseDto>;
    updateBulkPreferences(bulkPreferenceDto: BulkPreferenceUpdateDto, req: any): Promise<PreferenceResponseDto[]>;
    createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto>;
    getEvents(query: EventListQueryDto): Promise<EventListResponseDto>;
    getEventStats(): Promise<EventStatsDto>;
    queueEmail(queueEmailDto: QueueEmailDto): Promise<EmailQueueResponseDto>;
    getEmailQueue(query: EmailQueueListQueryDto): Promise<EmailQueueListResponseDto>;
    sendQueuedEmail(id: string): Promise<boolean>;
    getEmailStats(): Promise<EmailStatsDto>;
    getMyNotifications(query: NotificationListQueryDto, req: any): Promise<NotificationListResponseDto>;
    markNotificationAsRead(id: string): Promise<NotificationResponseDto>;
    markAllNotificationsAsRead(req: any): Promise<{
        success: boolean;
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
}
