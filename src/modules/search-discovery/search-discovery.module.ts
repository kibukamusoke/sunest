import { Module } from '@nestjs/common';
import { SearchDiscoveryController } from './search-discovery.controller';
import { SearchDiscoveryService } from './search-discovery.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        NotificationsModule,
        UsersModule,
    ],
    controllers: [SearchDiscoveryController],
    providers: [
        SearchDiscoveryService,
        PrismaService,
    ],
    exports: [SearchDiscoveryService],
})
export class SearchDiscoveryModule { }
