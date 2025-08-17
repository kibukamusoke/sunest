import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MetricsService } from './metrics.service';
import { DashboardService } from './dashboard.service';
import { ReportsService } from './reports.service';

@Module({
    controllers: [AnalyticsController],
    providers: [
        PrismaService,
        AnalyticsService,
        MetricsService,
        DashboardService,
        ReportsService,
    ],
    exports: [
        AnalyticsService,
        MetricsService,
        DashboardService,
        ReportsService,
    ],
})
export class AnalyticsModule { }
