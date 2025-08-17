import { Module } from '@nestjs/common';
import { OrderFulfillmentController } from './order-fulfillment.controller';
import { OrderFulfillmentService } from './order-fulfillment.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        NotificationsModule,
        UsersModule
    ],
    controllers: [OrderFulfillmentController],
    providers: [
        OrderFulfillmentService,
        PrismaService
    ],
    exports: [OrderFulfillmentService]
})
export class OrderFulfillmentModule { }
