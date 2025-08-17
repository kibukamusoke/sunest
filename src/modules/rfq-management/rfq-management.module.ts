import { Module } from '@nestjs/common';
import { RFQManagementController } from './rfq-management.controller';
import { RFQManagementService } from './rfq-management.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        NotificationsModule,
        UsersModule,
    ],
    controllers: [RFQManagementController],
    providers: [
        RFQManagementService,
        PrismaService,
    ],
    exports: [RFQManagementService],
})
export class RFQManagementModule { }
