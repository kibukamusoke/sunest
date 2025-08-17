import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EnhancedNotificationService } from './enhanced-notification.service';
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
    EventStatsDto,
} from './dto/event.dto';
import {
    QueueEmailDto,
    EmailQueueResponseDto,
    EmailQueueListQueryDto,
    EmailQueueListResponseDto,
    EmailStatsDto,
} from './dto/email.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class EnhancedNotificationController {
    constructor(
        private readonly notificationService: EnhancedNotificationService,
    ) { }

    // =============== NOTIFICATION ENDPOINTS ===============

    @Post()
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Create a new notification' })
    @ApiResponse({ status: 201, type: NotificationResponseDto })
    async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.createNotification(createNotificationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get notifications list' })
    @ApiResponse({ status: 200, type: NotificationListResponseDto })
    async getNotifications(
        @Query() query: NotificationListQueryDto,
        @Req() req: any,
    ) {
        // If not admin, filter by user's notifications
        if (!req.user.roles?.includes('SYSTEM_ADMIN')) {
            query.recipientId = req.user.id;
        }
        return this.notificationService.getNotifications(query);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a notification' })
    @ApiResponse({ status: 200, type: NotificationResponseDto })
    async updateNotification(
        @Param('id') id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        return this.notificationService.updateNotification(id, updateNotificationDto);
    }

    @Post('bulk')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Create bulk notifications' })
    @ApiResponse({ status: 201, type: [NotificationResponseDto] })
    async createBulkNotifications(@Body() bulkNotificationDto: BulkNotificationDto) {
        return this.notificationService.createBulkNotifications(bulkNotificationDto);
    }

    @Post(':id/send')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Send a notification manually' })
    @ApiResponse({ status: 200, type: Boolean })
    async sendNotification(@Param('id') id: string) {
        return this.notificationService.sendNotification(id);
    }

    // =============== TEMPLATE ENDPOINTS ===============

    @Post('templates')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN')
    @ApiOperation({ summary: 'Create a notification template' })
    @ApiResponse({ status: 201, type: TemplateResponseDto })
    async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
        return this.notificationService.createTemplate(createTemplateDto);
    }

    @Get('templates')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Get notification templates' })
    @ApiResponse({ status: 200, type: TemplateListResponseDto })
    async getTemplates(@Query() query: TemplateListQueryDto) {
        return this.notificationService.getTemplates(query);
    }

    @Put('templates/:id')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN')
    @ApiOperation({ summary: 'Update a notification template' })
    @ApiResponse({ status: 200, type: TemplateResponseDto })
    async updateTemplate(
        @Param('id') id: string,
        @Body() updateTemplateDto: UpdateTemplateDto,
    ) {
        return this.notificationService.updateTemplate(id, updateTemplateDto);
    }

    @Post('templates/:id/render')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Render a template with data' })
    @ApiResponse({ status: 200, type: RenderedTemplateDto })
    async renderTemplate(
        @Param('id') id: string,
        @Body() renderTemplateDto: RenderTemplateDto,
    ) {
        return this.notificationService.renderTemplate(id, renderTemplateDto);
    }

    // =============== PREFERENCE ENDPOINTS ===============

    @Get('preferences')
    @ApiOperation({ summary: 'Get user notification preferences' })
    @ApiResponse({ status: 200, type: [PreferenceResponseDto] })
    async getUserPreferences(@Req() req: any) {
        return this.notificationService.getUserPreferences(req.user.id);
    }

    @Post('preferences')
    @ApiOperation({ summary: 'Create or update notification preference' })
    @ApiResponse({ status: 201, type: PreferenceResponseDto })
    async createOrUpdatePreference(
        @Body() createPreferenceDto: CreatePreferenceDto,
        @Req() req: any,
    ) {
        return this.notificationService.createOrUpdatePreference(req.user.id, createPreferenceDto);
    }

    @Put('preferences/bulk')
    @ApiOperation({ summary: 'Update multiple notification preferences' })
    @ApiResponse({ status: 200, type: [PreferenceResponseDto] })
    async updateBulkPreferences(
        @Body() bulkPreferenceDto: BulkPreferenceUpdateDto,
        @Req() req: any,
    ) {
        return this.notificationService.updateBulkPreferences(req.user.id, bulkPreferenceDto);
    }

    // =============== EVENT ENDPOINTS ===============

    @Post('events')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Create a system event' })
    @ApiResponse({ status: 201, type: EventResponseDto })
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return this.notificationService.createEvent(createEventDto);
    }

    @Get('events')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Get system events' })
    @ApiResponse({ status: 200, type: EventListResponseDto })
    async getEvents(@Query() query: EventListQueryDto) {
        return this.notificationService.getEvents(query);
    }

    @Get('events/stats')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Get event statistics' })
    @ApiResponse({ status: 200, type: EventStatsDto })
    async getEventStats() {
        return this.notificationService.getEventStats();
    }

    // =============== EMAIL QUEUE ENDPOINTS ===============

    @Post('emails/queue')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Queue an email for sending' })
    @ApiResponse({ status: 201, type: EmailQueueResponseDto })
    async queueEmail(@Body() queueEmailDto: QueueEmailDto) {
        return this.notificationService.queueEmail(queueEmailDto);
    }

    @Get('emails/queue')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Get email queue' })
    @ApiResponse({ status: 200, type: EmailQueueListResponseDto })
    async getEmailQueue(@Query() query: EmailQueueListQueryDto) {
        return this.notificationService.getEmailQueue(query);
    }

    @Post('emails/:id/send')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Send a queued email manually' })
    @ApiResponse({ status: 200, type: Boolean })
    async sendQueuedEmail(@Param('id') id: string) {
        return this.notificationService.sendQueuedEmail(id);
    }

    @Get('emails/stats')
    @UseGuards(RolesGuard)
    @Roles('SYSTEM_ADMIN', 'MERCHANT_ADMIN')
    @ApiOperation({ summary: 'Get email statistics' })
    @ApiResponse({ status: 200, type: EmailStatsDto })
    async getEmailStats() {
        return this.notificationService.getEmailStats();
    }

    // =============== USER-SPECIFIC ENDPOINTS ===============

    @Get('my-notifications')
    @ApiOperation({ summary: 'Get current user notifications' })
    @ApiResponse({ status: 200, type: NotificationListResponseDto })
    async getMyNotifications(
        @Query() query: NotificationListQueryDto,
        @Req() req: any,
    ) {
        return this.notificationService.getNotifications({
            ...query,
            recipientId: req.user.id,
        });
    }

    @Put('my-notifications/:id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, type: NotificationResponseDto })
    async markNotificationAsRead(@Param('id') id: string) {
        return this.notificationService.updateNotification(id, { markAsRead: true });
    }

    @Put('my-notifications/mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200 })
    async markAllNotificationsAsRead(@Req() req: any) {
        const notifications = await this.notificationService.getNotifications({
            recipientId: req.user.id,
            status: 'SENT' as any,
        });

        await Promise.all(
            notifications.notifications.map(notification =>
                this.notificationService.updateNotification(notification.id, { markAsRead: true })
            )
        );

        return { success: true };
    }

    @Get('my-notifications/unread-count')
    @ApiOperation({ summary: 'Get unread notification count' })
    @ApiResponse({ status: 200 })
    async getUnreadCount(@Req() req: any) {
        const result = await this.notificationService.getNotifications({
            recipientId: req.user.id,
            status: 'SENT' as any,
            limit: 1,
        });

        return { count: result.total };
    }
}
