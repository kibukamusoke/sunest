import { Module } from '@nestjs/common';
import { FirebaseNotificationService } from './firebase-notification.service';
import { TelegramNotificationService } from './telegram-notification.service';
import { MailgunService } from './mailgun.service';
import { NotificationService } from './notification.service';
import { EnhancedNotificationService } from './enhanced-notification.service';
import { NotificationIntegrationService } from './notification-integration.service';
import { TemplateSeederService } from './template-seeder.service';
import { EnhancedNotificationController } from './enhanced-notification.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';

import { MailgunModule } from 'nestjs-mailgun';

@Module({
  imports: [
    MailgunModule.forAsyncRoot({
      useFactory: async (configService: ConfigService) => {
        return {
          username: 'api',
          key: configService.get('MAILGUN_API_KEY') || '',
          public_key: configService.get('MAILGUN_PUBLIC_KEY'), // OPTIONAL
          timeout: 30000, // OPTIONAL, in milliseconds
          //url: 'api.mailgun.net', // OPTIONAL, default: 'api.mailgun.net'. Note that if you are using the EU region the host should be set to 'api.eu.mailgun.net'
        };
      },
      inject: [ConfigService],
    }) as any,
  ],
  controllers: [EnhancedNotificationController],
  providers: [
    PrismaService,
    FirebaseNotificationService,
    TelegramNotificationService,
    MailgunService,
    NotificationService,
    EnhancedNotificationService,
    NotificationIntegrationService,
    TemplateSeederService,
  ],
  exports: [
    NotificationService,
    MailgunService,
    EnhancedNotificationService,
    NotificationIntegrationService,
    TemplateSeederService,
  ],
})
export class NotificationsModule { }
