import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { PublicCompanyController } from './public-company.controller';
import { CompanyService } from './company.service';
import { PrismaService } from '../../config/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [CompanyController, PublicCompanyController],
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
})
export class CompanyModule {}
