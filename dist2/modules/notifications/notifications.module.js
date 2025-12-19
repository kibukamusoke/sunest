"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_notification_service_1 = require("./firebase-notification.service");
const telegram_notification_service_1 = require("./telegram-notification.service");
const mailgun_service_1 = require("./mailgun.service");
const notification_service_1 = require("./notification.service");
const enhanced_notification_service_1 = require("./enhanced-notification.service");
const notification_integration_service_1 = require("./notification-integration.service");
const template_seeder_service_1 = require("./template-seeder.service");
const enhanced_notification_controller_1 = require("./enhanced-notification.controller");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../config/prisma.service");
const nestjs_mailgun_1 = require("nestjs-mailgun");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_mailgun_1.MailgunModule.forAsyncRoot({
                useFactory: async (configService) => {
                    return {
                        username: 'api',
                        key: configService.get('MAILGUN_API_KEY') || '',
                        public_key: configService.get('MAILGUN_PUBLIC_KEY'),
                        timeout: 30000,
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [enhanced_notification_controller_1.EnhancedNotificationController],
        providers: [
            prisma_service_1.PrismaService,
            firebase_notification_service_1.FirebaseNotificationService,
            telegram_notification_service_1.TelegramNotificationService,
            mailgun_service_1.MailgunService,
            notification_service_1.NotificationService,
            enhanced_notification_service_1.EnhancedNotificationService,
            notification_integration_service_1.NotificationIntegrationService,
            template_seeder_service_1.TemplateSeederService,
        ],
        exports: [
            notification_service_1.NotificationService,
            mailgun_service_1.MailgunService,
            enhanced_notification_service_1.EnhancedNotificationService,
            notification_integration_service_1.NotificationIntegrationService,
            template_seeder_service_1.TemplateSeederService,
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map