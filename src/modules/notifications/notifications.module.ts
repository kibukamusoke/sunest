import { Module } from '@nestjs/common';
import { FirebaseNotificationService } from './firebase-notification.service';
import { TelegramNotificationService } from './telegram-notification.service';
import { MailgunService } from './mailgun.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    FirebaseNotificationService,
    TelegramNotificationService,
    MailgunService,
    NotificationService,
  ],
  exports: [NotificationService, MailgunService],
})
export class NotificationsModule {}