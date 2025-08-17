import { Module } from '@nestjs/common';
import { ProductCatalogController } from './product-catalog.controller';
import { ProductCatalogService } from './product-catalog.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [NotificationsModule],
  controllers: [ProductCatalogController],
  providers: [
    ProductCatalogService,
    PrismaService,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [ProductCatalogService],
})
export class ProductCatalogModule {}
