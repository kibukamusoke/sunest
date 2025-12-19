"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedNotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enhanced_notification_service_1 = require("./enhanced-notification.service");
const notification_dto_1 = require("./dto/notification.dto");
const template_dto_1 = require("./dto/template.dto");
const preference_dto_1 = require("./dto/preference.dto");
const event_dto_1 = require("./dto/event.dto");
const email_dto_1 = require("./dto/email.dto");
let EnhancedNotificationController = class EnhancedNotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async createNotification(createNotificationDto) {
        return this.notificationService.createNotification(createNotificationDto);
    }
    async getNotifications(query, req) {
        if (!req.user.roles?.includes('SYSTEM_ADMIN')) {
            query.recipientId = req.user.id;
        }
        return this.notificationService.getNotifications(query);
    }
    async updateNotification(id, updateNotificationDto) {
        return this.notificationService.updateNotification(id, updateNotificationDto);
    }
    async createBulkNotifications(bulkNotificationDto) {
        return this.notificationService.createBulkNotifications(bulkNotificationDto);
    }
    async sendNotification(id) {
        return this.notificationService.sendNotification(id);
    }
    async createTemplate(createTemplateDto) {
        return this.notificationService.createTemplate(createTemplateDto);
    }
    async getTemplates(query) {
        return this.notificationService.getTemplates(query);
    }
    async updateTemplate(id, updateTemplateDto) {
        return this.notificationService.updateTemplate(id, updateTemplateDto);
    }
    async renderTemplate(id, renderTemplateDto) {
        return this.notificationService.renderTemplate(id, renderTemplateDto);
    }
    async getUserPreferences(req) {
        return this.notificationService.getUserPreferences(req.user.id);
    }
    async createOrUpdatePreference(createPreferenceDto, req) {
        return this.notificationService.createOrUpdatePreference(req.user.id, createPreferenceDto);
    }
    async updateBulkPreferences(bulkPreferenceDto, req) {
        return this.notificationService.updateBulkPreferences(req.user.id, bulkPreferenceDto);
    }
    async createEvent(createEventDto) {
        return this.notificationService.createEvent(createEventDto);
    }
    async getEvents(query) {
        return this.notificationService.getEvents(query);
    }
    async getEventStats() {
        return this.notificationService.getEventStats();
    }
    async queueEmail(queueEmailDto) {
        return this.notificationService.queueEmail(queueEmailDto);
    }
    async getEmailQueue(query) {
        return this.notificationService.getEmailQueue(query);
    }
    async sendQueuedEmail(id) {
        return this.notificationService.sendQueuedEmail(id);
    }
    async getEmailStats() {
        return this.notificationService.getEmailStats();
    }
    async getMyNotifications(query, req) {
        return this.notificationService.getNotifications({
            ...query,
            recipientId: req.user.id,
        });
    }
    async markNotificationAsRead(id) {
        return this.notificationService.updateNotification(id, {
            markAsRead: true,
        });
    }
    async markAllNotificationsAsRead(req) {
        const notifications = await this.notificationService.getNotifications({
            recipientId: req.user.id,
            status: 'SENT',
        });
        await Promise.all(notifications.notifications.map((notification) => this.notificationService.updateNotification(notification.id, {
            markAsRead: true,
        })));
        return { success: true };
    }
    async getUnreadCount(req) {
        const result = await this.notificationService.getNotifications({
            recipientId: req.user.id,
            status: 'SENT',
            limit: 1,
        });
        return { count: result.total };
    }
};
exports.EnhancedNotificationController = EnhancedNotificationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new notification' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: notification_dto_1.NotificationResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get notifications list' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.NotificationListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "updateNotification", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create bulk notifications' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: [notification_dto_1.NotificationResponseDto] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.BulkNotificationDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "createBulkNotifications", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a notification manually' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a notification template' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: template_dto_1.TemplateResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: template_dto_1.TemplateListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [template_dto_1.TemplateListQueryDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a notification template' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: template_dto_1.TemplateResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:id/render'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Render a template with data' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: template_dto_1.RenderedTemplateDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, template_dto_1.RenderTemplateDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "renderTemplate", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notification preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [preference_dto_1.PreferenceResponseDto] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getUserPreferences", null);
__decorate([
    (0, common_1.Post)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update notification preference' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: preference_dto_1.PreferenceResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preference_dto_1.CreatePreferenceDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "createOrUpdatePreference", null);
__decorate([
    (0, common_1.Put)('preferences/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Update multiple notification preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [preference_dto_1.PreferenceResponseDto] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preference_dto_1.BulkPreferenceUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "updateBulkPreferences", null);
__decorate([
    (0, common_1.Post)('events'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a system event' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: event_dto_1.EventResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system events' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: event_dto_1.EventListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.EventListQueryDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('events/stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: event_dto_1.EventStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getEventStats", null);
__decorate([
    (0, common_1.Post)('emails/queue'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue an email for sending' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: email_dto_1.EmailQueueResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.QueueEmailDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "queueEmail", null);
__decorate([
    (0, common_1.Get)('emails/queue'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get email queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: email_dto_1.EmailQueueListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.EmailQueueListQueryDto]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getEmailQueue", null);
__decorate([
    (0, common_1.Post)('emails/:id/send'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a queued email manually' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "sendQueuedEmail", null);
__decorate([
    (0, common_1.Get)('emails/stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'MERCHANT_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get email statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: email_dto_1.EmailStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getEmailStats", null);
__decorate([
    (0, common_1.Get)('my-notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.NotificationListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Put)('my-notifications/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Put)('my-notifications/mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, common_1.Get)('my-notifications/unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedNotificationController.prototype, "getUnreadCount", null);
exports.EnhancedNotificationController = EnhancedNotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [enhanced_notification_service_1.EnhancedNotificationService])
], EnhancedNotificationController);
//# sourceMappingURL=enhanced-notification.controller.js.map