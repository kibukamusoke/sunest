import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from '../notifications/notification.service';
import { PrismaService } from '../../config/prisma.service';
export declare class JobsService {
    private readonly schedulerRegistry;
    private readonly prismaService;
    private readonly notificationService;
    private readonly logger;
    constructor(schedulerRegistry: SchedulerRegistry, prismaService: PrismaService, notificationService: NotificationService);
    handleStartupTasks(): Promise<void>;
    cleanupExpiredTokensJob(): Promise<void>;
    archiveOldDataJob(): Promise<void>;
    generateWeeklyReportJob(): Promise<void>;
    registerDynamicJob(name: string, cronExpression: string, callback: () => void): void;
    removeDynamicJob(name: string): void;
    listJobs(): string[];
    private cleanupExpiredTokens;
    private archiveData;
    private generateWeeklyBusinessReport;
}
