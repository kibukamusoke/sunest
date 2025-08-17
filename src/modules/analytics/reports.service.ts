import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ReportType, ReportFormat, ReportStatus, Prisma } from '@prisma/client';
import {
    CreateReportDto,
    UpdateReportDto,
    ReportResponseDto,
    ReportListQueryDto,
    ReportListResponseDto,
    CreateScheduleDto,
    UpdateScheduleDto,
    ScheduleResponseDto,
    GenerateReportDto,
    ReportGenerationResponseDto,
} from './dto/report.dto';
import { AnalyticsService } from './analytics.service';
import { MetricsService } from './metrics.service';
import * as cron from 'node-cron';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);
    private scheduledJobs = new Map<string, any>();

    constructor(
        private prisma: PrismaService,
        private analyticsService: AnalyticsService,
        private metricsService: MetricsService,
    ) {
        this.initializeScheduledReports();
    }

    // =============== REPORT MANAGEMENT ===============

    async createReport(userId: string, data: CreateReportDto): Promise<ReportResponseDto> {
        try {
            const report = await this.prisma.report.create({
                data: {
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    format: data.format || ReportFormat.PDF,
                    parameters: data.parameters,
                    template: data.template,
                    createdBy: userId,
                    recipients: data.recipients || [],
                },
            });

            // Add metrics if provided
            if (data.metricIds && data.metricIds.length > 0) {
                await this.prisma.reportMetric.createMany({
                    data: data.metricIds.map((metricId, index) => ({
                        reportId: report.id,
                        metricId,
                        order: index,
                    })),
                });
            }

            return this.mapReportToResponse(report);
        } catch (error) {
            this.logger.error(`Failed to create report: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getReports(userId: string, query: ReportListQueryDto): Promise<ReportListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.ReportWhereInput = {
            createdBy: userId,
        };

        if (query.type) where.type = query.type;
        if (query.status) where.status = query.status;
        if (query.isScheduled !== undefined) where.isScheduled = query.isScheduled;
        if (query.createdBy) where.createdBy = query.createdBy;

        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.report.count({ where }),
        ]);

        return {
            reports: reports.map(this.mapReportToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getReport(reportId: string, userId: string): Promise<ReportResponseDto | null> {
        const report = await this.prisma.report.findFirst({
            where: {
                id: reportId,
                createdBy: userId,
            },
            include: {
                metrics: {
                    include: { metric: true },
                    orderBy: { order: 'asc' },
                },
            },
        });

        return report ? this.mapReportToResponse(report) : null;
    }

    async updateReport(reportId: string, userId: string, data: UpdateReportDto): Promise<ReportResponseDto> {
        const report = await this.prisma.report.findFirst({
            where: { id: reportId, createdBy: userId },
        });

        if (!report) {
            throw new Error('Report not found or access denied');
        }

        const updated = await this.prisma.report.update({
            where: { id: reportId },
            data,
        });

        return this.mapReportToResponse(updated);
    }

    async deleteReport(reportId: string, userId: string): Promise<void> {
        const report = await this.prisma.report.findFirst({
            where: { id: reportId, createdBy: userId },
        });

        if (!report) {
            throw new Error('Report not found or access denied');
        }

        // Cancel any scheduled jobs
        if (this.scheduledJobs.has(reportId)) {
            this.scheduledJobs.get(reportId).destroy();
            this.scheduledJobs.delete(reportId);
        }

        await this.prisma.report.delete({
            where: { id: reportId },
        });
    }

    // =============== REPORT GENERATION ===============

    async generateReport(userId: string, data: GenerateReportDto): Promise<ReportGenerationResponseDto> {
        const report = await this.prisma.report.findFirst({
            where: { id: data.reportId, createdBy: userId },
        });

        if (!report) {
            throw new Error('Report not found or access denied');
        }

        // Update report status
        await this.prisma.report.update({
            where: { id: data.reportId },
            data: {
                status: ReportStatus.PROCESSING,
                startedAt: new Date(),
                parameters: (data.parameters || report.parameters) as any,
            },
        });

        // Generate job ID
        const jobId = `report-${data.reportId}-${Date.now()}`;

        // Start generation process (async)
        this.processReportGeneration(data.reportId, data.parameters, data.additionalRecipients)
            .catch(error => {
                this.logger.error(`Report generation failed: ${error.message}`, error.stack);
            });

        const estimatedCompletion = new Date();
        estimatedCompletion.setMinutes(estimatedCompletion.getMinutes() + 5); // Estimate 5 minutes

        return {
            jobId,
            reportId: data.reportId,
            estimatedCompletion,
            statusUrl: `/api/analytics/reports/${data.reportId}/status`,
        };
    }

    private async processReportGeneration(
        reportId: string,
        overrideParameters?: any,
        additionalRecipients?: string[]
    ): Promise<void> {
        try {
            const report = await this.prisma.report.findUnique({
                where: { id: reportId },
                include: { metrics: { include: { metric: true } } },
            });

            if (!report) throw new Error('Report not found');

            const parameters = overrideParameters || report.parameters || {};
            const startDate = parameters.startDate ? new Date(parameters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = parameters.endDate ? new Date(parameters.endDate) : new Date();

            let reportData: any;

            switch (report.type) {
                case ReportType.SALES_REPORT:
                    reportData = await this.generateSalesReport(startDate, endDate, parameters);
                    break;
                case ReportType.INVENTORY_REPORT:
                    reportData = await this.generateInventoryReport(startDate, endDate, parameters);
                    break;
                case ReportType.CUSTOMER_REPORT:
                    reportData = await this.generateCustomerReport(startDate, endDate, parameters);
                    break;
                case ReportType.MERCHANT_REPORT:
                    reportData = await this.generateMerchantReport(startDate, endDate, parameters);
                    break;
                case ReportType.PRODUCT_PERFORMANCE:
                    reportData = await this.generateProductPerformanceReport(startDate, endDate, parameters);
                    break;
                case ReportType.FINANCIAL_REPORT:
                    reportData = await this.generateFinancialReport(startDate, endDate, parameters);
                    break;
                case ReportType.OPERATIONAL_REPORT:
                    reportData = await this.generateOperationalReport(startDate, endDate, parameters);
                    break;
                case ReportType.EXECUTIVE_SUMMARY:
                    reportData = await this.generateExecutiveSummary(startDate, endDate, parameters);
                    break;
                default:
                    throw new Error(`Report type ${report.type} not implemented`);
            }

            // Generate file based on format
            const { fileName, filePath, fileSize } = await this.generateReportFile(
                report,
                reportData,
                report.format
            );

            // Update report with completion details
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: ReportStatus.COMPLETED,
                    completedAt: new Date(),
                    fileName,
                    filePath,
                    fileSize,
                    downloadUrl: `/api/analytics/reports/${reportId}/download`,
                },
            });

            // Send to recipients
            const allRecipients = [
                ...report.recipients,
                ...(additionalRecipients || []),
            ];

            if (allRecipients.length > 0) {
                await this.sendReportToRecipients(report, filePath, allRecipients);
            }

            this.logger.log(`Report ${reportId} generated successfully`);
        } catch (error) {
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: ReportStatus.FAILED,
                    completedAt: new Date(),
                    errorMessage: error.message,
                },
            });

            this.logger.error(`Report generation failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    // =============== REPORT SCHEDULING ===============

    async createSchedule(data: CreateScheduleDto): Promise<ScheduleResponseDto> {
        try {
            const schedule = await this.prisma.reportSchedule.create({
                data: {
                    reportId: data.reportId,
                    name: data.name,
                    cronExpression: data.cronExpression,
                    timezone: data.timezone || 'UTC',
                    recipients: data.recipients,
                    subject: data.subject,
                    message: data.message,
                    nextRun: this.calculateNextRun(data.cronExpression),
                },
            });

            // Update report as scheduled
            await this.prisma.report.update({
                where: { id: data.reportId },
                data: {
                    isScheduled: true,
                    cronExpression: data.cronExpression,
                    timezone: data.timezone,
                },
            });

            // Start cron job
            this.startScheduledReport(schedule);

            return this.mapScheduleToResponse(schedule);
        } catch (error) {
            this.logger.error(`Failed to create schedule: ${error.message}`, error.stack);
            throw error;
        }
    }

    async updateSchedule(scheduleId: string, data: UpdateScheduleDto): Promise<ScheduleResponseDto> {
        const schedule = await this.prisma.reportSchedule.update({
            where: { id: scheduleId },
            data: {
                ...data,
                nextRun: data.cronExpression ? this.calculateNextRun(data.cronExpression) : undefined,
            },
        });

        // Restart cron job if active
        if (schedule.isActive) {
            this.stopScheduledReport(scheduleId);
            this.startScheduledReport(schedule);
        }

        return this.mapScheduleToResponse(schedule);
    }

    async deleteSchedule(scheduleId: string): Promise<void> {
        const schedule = await this.prisma.reportSchedule.findUnique({
            where: { id: scheduleId },
        });

        if (schedule) {
            this.stopScheduledReport(scheduleId);
            await this.prisma.reportSchedule.delete({
                where: { id: scheduleId },
            });

            // Update report as not scheduled if no other schedules
            const otherSchedules = await this.prisma.reportSchedule.count({
                where: { reportId: schedule.reportId },
            });

            if (otherSchedules === 0) {
                await this.prisma.report.update({
                    where: { id: schedule.reportId },
                    data: { isScheduled: false },
                });
            }
        }
    }

    private async initializeScheduledReports(): Promise<void> {
        const schedules = await this.prisma.reportSchedule.findMany({
            where: { isActive: true },
        });

        for (const schedule of schedules) {
            this.startScheduledReport(schedule);
        }

        this.logger.log(`Initialized ${schedules.length} scheduled reports`);
    }

    private startScheduledReport(schedule: any): void {
        if (this.scheduledJobs.has(schedule.id)) {
            this.scheduledJobs.get(schedule.id).destroy();
        }

        const task = cron.schedule(
            schedule.cronExpression,
            async () => {
                try {
                    await this.executeScheduledReport(schedule);
                } catch (error) {
                    this.logger.error(`Scheduled report execution failed: ${error.message}`, error.stack);
                }
            },
            {
                scheduled: true,
                timezone: schedule.timezone,
            }
        );

        this.scheduledJobs.set(schedule.id, task);
        this.logger.log(`Started scheduled report: ${schedule.name}`);
    }

    private stopScheduledReport(scheduleId: string): void {
        if (this.scheduledJobs.has(scheduleId)) {
            this.scheduledJobs.get(scheduleId).destroy();
            this.scheduledJobs.delete(scheduleId);
        }
    }

    private async executeScheduledReport(schedule: any): Promise<void> {
        try {
            // Update run tracking
            await this.prisma.reportSchedule.update({
                where: { id: schedule.id },
                data: {
                    lastRun: new Date(),
                    nextRun: this.calculateNextRun(schedule.cronExpression),
                    runCount: { increment: 1 },
                },
            });

            // Generate report
            await this.processReportGeneration(schedule.reportId, null, schedule.recipients);

            this.logger.log(`Executed scheduled report: ${schedule.name}`);
        } catch (error) {
            await this.prisma.reportSchedule.update({
                where: { id: schedule.id },
                data: { failureCount: { increment: 1 } },
            });

            throw error;
        }
    }

    // =============== REPORT GENERATORS ===============

    private async generateSalesReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        const overview = await this.analyticsService.getAnalyticsOverview(
            startDate,
            endDate,
            new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime())),
            startDate
        );

        return {
            title: 'Sales Report',
            period: { startDate, endDate },
            summary: {
                totalRevenue: overview.totalRevenue,
                totalOrders: overview.totalOrders,
                averageOrderValue: overview.averageOrderValue,
                conversionRate: overview.conversionRate,
            },
            growth: {
                revenueGrowth: overview.revenueGrowth,
                ordersGrowth: overview.ordersGrowth,
                aovGrowth: overview.aovGrowth,
            },
            topProducts: overview.topProducts,
            topMerchants: overview.topMerchants,
            charts: {
                revenue: overview.revenueChart,
                orders: overview.ordersChart,
            },
        };
    }

    private async generateInventoryReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        // Mock implementation - would integrate with inventory data
        return {
            title: 'Inventory Report',
            period: { startDate, endDate },
            summary: {
                totalProducts: 0,
                lowStockItems: 0,
                outOfStockItems: 0,
                inventoryValue: 0,
            },
            topSellingProducts: [],
            slowMovingProducts: [],
            stockLevels: [],
        };
    }

    private async generateCustomerReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        return {
            title: 'Customer Report',
            period: { startDate, endDate },
            summary: {
                totalCustomers: 0,
                newCustomers: 0,
                returningCustomers: 0,
                customerLifetimeValue: 0,
            },
            segments: [],
            behavior: [],
        };
    }

    private async generateMerchantReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        return {
            title: 'Merchant Report',
            period: { startDate, endDate },
            summary: {
                totalMerchants: 0,
                activeMerchants: 0,
                newMerchants: 0,
                totalCommission: 0,
            },
            performance: [],
            payouts: [],
        };
    }

    private async generateProductPerformanceReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        return {
            title: 'Product Performance Report',
            period: { startDate, endDate },
            summary: {
                totalProducts: 0,
                bestPerformers: [],
                underPerformers: [],
            },
            metrics: [],
        };
    }

    private async generateFinancialReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        return {
            title: 'Financial Report',
            period: { startDate, endDate },
            revenue: {},
            expenses: {},
            profitLoss: {},
            cashFlow: {},
        };
    }

    private async generateOperationalReport(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        return {
            title: 'Operational Report',
            period: { startDate, endDate },
            fulfillment: {},
            shipping: {},
            returns: {},
            efficiency: {},
        };
    }

    private async generateExecutiveSummary(startDate: Date, endDate: Date, parameters: any): Promise<any> {
        const overview = await this.analyticsService.getAnalyticsOverview(
            startDate,
            endDate,
            new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime())),
            startDate
        );

        return {
            title: 'Executive Summary',
            period: { startDate, endDate },
            keyMetrics: {
                revenue: overview.totalRevenue,
                orders: overview.totalOrders,
                customers: overview.totalUsers,
                merchants: overview.activeMerchants,
            },
            growth: {
                revenue: overview.revenueGrowth,
                orders: overview.ordersGrowth,
                customers: overview.usersGrowth,
            },
            highlights: [],
            recommendations: [],
        };
    }

    // =============== HELPER METHODS ===============

    private async generateReportFile(report: any, data: any, format: ReportFormat): Promise<{
        fileName: string;
        filePath: string;
        fileSize: number;
    }> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${report.name}-${timestamp}.${format.toLowerCase()}`;
        const filePath = `/tmp/reports/${fileName}`; // This would be a proper file storage path

        // Mock file generation - in reality, you'd use libraries like PDFKit, xlsx, etc.
        const content = JSON.stringify(data, null, 2);
        const fileSize = Buffer.byteLength(content, 'utf8');

        // Here you would actually write the file to storage
        // await fs.writeFile(filePath, content);

        return { fileName, filePath, fileSize };
    }

    private async sendReportToRecipients(report: any, filePath: string, recipients: string[]): Promise<void> {
        // Mock email sending - integrate with your email service
        this.logger.log(`Would send report ${report.name} to ${recipients.join(', ')}`);
    }

    private calculateNextRun(cronExpression: string): Date {
        // This is a simplified calculation - use a proper cron parser library
        const nextRun = new Date();
        nextRun.setHours(nextRun.getHours() + 1); // Mock: next hour
        return nextRun;
    }

    private mapReportToResponse(report: any): ReportResponseDto {
        return {
            id: report.id,
            name: report.name,
            description: report.description,
            type: report.type,
            format: report.format,
            status: report.status,
            parameters: report.parameters,
            template: report.template,
            isScheduled: report.isScheduled,
            cronExpression: report.cronExpression,
            timezone: report.timezone,
            createdBy: report.createdBy,
            recipients: report.recipients,
            fileName: report.fileName,
            fileSize: report.fileSize,
            filePath: report.filePath,
            downloadUrl: report.downloadUrl,
            startedAt: report.startedAt,
            completedAt: report.completedAt,
            errorMessage: report.errorMessage,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        };
    }

    private mapScheduleToResponse(schedule: any): ScheduleResponseDto {
        return {
            id: schedule.id,
            reportId: schedule.reportId,
            name: schedule.name,
            cronExpression: schedule.cronExpression,
            timezone: schedule.timezone,
            isActive: schedule.isActive,
            recipients: schedule.recipients,
            subject: schedule.subject,
            message: schedule.message,
            lastRun: schedule.lastRun,
            nextRun: schedule.nextRun,
            runCount: schedule.runCount,
            failureCount: schedule.failureCount,
            createdAt: schedule.createdAt,
            updatedAt: schedule.updatedAt,
        };
    }
}
