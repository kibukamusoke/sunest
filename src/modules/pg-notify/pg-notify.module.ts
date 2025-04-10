import { Module } from '@nestjs/common';
import { PgNotifyService } from './pg-notify.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [PgNotifyService],
  exports: [PgNotifyService],
})
export class PgNotifyModule {}