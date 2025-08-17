import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantDocumentService } from './merchant-document.service';
import { PrismaService } from '../../config/prisma.service';
import { S3StorageService } from '../storage/s3-storage.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        NotificationsModule,
        StorageModule, // For document uploads
    ],
    controllers: [MerchantController],
    providers: [
        MerchantService,
        MerchantDocumentService,
        PrismaService,
        S3StorageService,
    ],
    exports: [MerchantService],
})
export class MerchantManagementModule { }
