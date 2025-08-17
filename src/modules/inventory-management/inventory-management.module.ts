import { Module } from '@nestjs/common';
import { InventoryManagementController } from './inventory-management.controller';
import { InventoryManagementService } from './inventory-management.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [NotificationsModule, UsersModule],
    controllers: [InventoryManagementController],
    providers: [InventoryManagementService, PrismaService],
    exports: [InventoryManagementService],
})
export class InventoryManagementModule { }
