"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
const analytics_service_1 = require("./analytics.service");
const metrics_service_1 = require("./metrics.service");
const cron = require("node-cron");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor(prisma, analyticsService, metricsService) {
        this.prisma = prisma;
        this.analyticsService = analyticsService;
        this.metricsService = metricsService;
        this.logger = new common_1.Logger(ReportsService_1.name);
        this.scheduledJobs = new Map();
        this.initializeScheduledReports();
    }
    async createReport(userId, data) {
        try {
            const report = await this.prisma.report.create({
                data: {
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    format: data.format || client_1.ReportFormat.PDF,
                    parameters: data.parameters,
                    template: data.template,
                    createdBy: userId,
                    recipients: data.recipients || [],
                },
            });
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
        }
        catch (error) {
            this.logger.error(`Failed to create report: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getReports(userId, query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            createdBy: userId,
        };
        if (query.type)
            where.type = query.type;
        if (query.status)
            where.status = query.status;
        if (query.isScheduled !== undefined)
            where.isScheduled = query.isScheduled;
        if (query.createdBy)
            where.createdBy = query.createdBy;
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
    async getReport(reportId, userId) {
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
    async updateReport(reportId, userId, data) {
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
    async deleteReport(reportId, userId) {
        const report = await this.prisma.report.findFirst({
            where: { id: reportId, createdBy: userId },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        if (this.scheduledJobs.has(reportId)) {
            this.scheduledJobs.get(reportId).destroy();
            this.scheduledJobs.delete(reportId);
        }
        await this.prisma.report.delete({
            where: { id: reportId },
        });
    }
    async generateReport(userId, data) {
        const report = await this.prisma.report.findFirst({
            where: { id: data.reportId, createdBy: userId },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        await this.prisma.report.update({
            where: { id: data.reportId },
            data: {
                status: client_1.ReportStatus.PROCESSING,
                startedAt: new Date(),
                parameters: (data.parameters || report.parameters),
            },
        });
        const jobId = `report-${data.reportId}-${Date.now()}`;
        this.processReportGeneration(data.reportId, data.parameters, data.additionalRecipients).catch((error) => {
            this.logger.error(`Report generation failed: ${error.message}`, error.stack);
        });
        const estimatedCompletion = new Date();
        estimatedCompletion.setMinutes(estimatedCompletion.getMinutes() + 5);
        return {
            jobId,
            reportId: data.reportId,
            estimatedCompletion,
            statusUrl: `/api/analytics/reports/${data.reportId}/status`,
        };
    }
    async processReportGeneration(reportId, overrideParameters, additionalRecipients) {
        try {
            const report = await this.prisma.report.findUnique({
                where: { id: reportId },
                include: { metrics: { include: { metric: true } } },
            });
            if (!report)
                throw new Error('Report not found');
            const parameters = overrideParameters || report.parameters || {};
            const startDate = parameters.startDate
                ? new Date(parameters.startDate)
                : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = parameters.endDate
                ? new Date(parameters.endDate)
                : new Date();
            let reportData;
            switch (report.type) {
                case client_1.ReportType.SALES_REPORT:
                    reportData = await this.generateSalesReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.INVENTORY_REPORT:
                    reportData = await this.generateInventoryReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.CUSTOMER_REPORT:
                    reportData = await this.generateCustomerReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.MERCHANT_REPORT:
                    reportData = await this.generateMerchantReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.PRODUCT_PERFORMANCE:
                    reportData = await this.generateProductPerformanceReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.FINANCIAL_REPORT:
                    reportData = await this.generateFinancialReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.OPERATIONAL_REPORT:
                    reportData = await this.generateOperationalReport(startDate, endDate, parameters);
                    break;
                case client_1.ReportType.EXECUTIVE_SUMMARY:
                    reportData = await this.generateExecutiveSummary(startDate, endDate, parameters);
                    break;
                default:
                    throw new Error(`Report type ${report.type} not implemented`);
            }
            const { fileName, filePath, fileSize } = await this.generateReportFile(report, reportData, report.format);
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: client_1.ReportStatus.COMPLETED,
                    completedAt: new Date(),
                    fileName,
                    filePath,
                    fileSize,
                    downloadUrl: `/api/analytics/reports/${reportId}/download`,
                },
            });
            const allRecipients = [
                ...report.recipients,
                ...(additionalRecipients || []),
            ];
            if (allRecipients.length > 0) {
                await this.sendReportToRecipients(report, filePath, allRecipients);
            }
            this.logger.log(`Report ${reportId} generated successfully`);
        }
        catch (error) {
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: client_1.ReportStatus.FAILED,
                    completedAt: new Date(),
                    errorMessage: error.message,
                },
            });
            this.logger.error(`Report generation failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async createSchedule(data) {
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
            await this.prisma.report.update({
                where: { id: data.reportId },
                data: {
                    isScheduled: true,
                    cronExpression: data.cronExpression,
                    timezone: data.timezone,
                },
            });
            this.startScheduledReport(schedule);
            return this.mapScheduleToResponse(schedule);
        }
        catch (error) {
            this.logger.error(`Failed to create schedule: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateSchedule(scheduleId, data) {
        const schedule = await this.prisma.reportSchedule.update({
            where: { id: scheduleId },
            data: {
                ...data,
                nextRun: data.cronExpression
                    ? this.calculateNextRun(data.cronExpression)
                    : undefined,
            },
        });
        if (schedule.isActive) {
            this.stopScheduledReport(scheduleId);
            this.startScheduledReport(schedule);
        }
        return this.mapScheduleToResponse(schedule);
    }
    async deleteSchedule(scheduleId) {
        const schedule = await this.prisma.reportSchedule.findUnique({
            where: { id: scheduleId },
        });
        if (schedule) {
            this.stopScheduledReport(scheduleId);
            await this.prisma.reportSchedule.delete({
                where: { id: scheduleId },
            });
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
    async initializeScheduledReports() {
        const schedules = await this.prisma.reportSchedule.findMany({
            where: { isActive: true },
        });
        for (const schedule of schedules) {
            this.startScheduledReport(schedule);
        }
        this.logger.log(`Initialized ${schedules.length} scheduled reports`);
    }
    startScheduledReport(schedule) {
        if (this.scheduledJobs.has(schedule.id)) {
            this.scheduledJobs.get(schedule.id).destroy();
        }
        const task = cron.schedule(schedule.cronExpression, async () => {
            try {
                await this.executeScheduledReport(schedule);
            }
            catch (error) {
                this.logger.error(`Scheduled report execution failed: ${error.message}`, error.stack);
            }
        }, {
            scheduled: true,
            timezone: schedule.timezone,
        });
        this.scheduledJobs.set(schedule.id, task);
        this.logger.log(`Started scheduled report: ${schedule.name}`);
    }
    stopScheduledReport(scheduleId) {
        if (this.scheduledJobs.has(scheduleId)) {
            this.scheduledJobs.get(scheduleId).destroy();
            this.scheduledJobs.delete(scheduleId);
        }
    }
    async executeScheduledReport(schedule) {
        try {
            await this.prisma.reportSchedule.update({
                where: { id: schedule.id },
                data: {
                    lastRun: new Date(),
                    nextRun: this.calculateNextRun(schedule.cronExpression),
                    runCount: { increment: 1 },
                },
            });
            await this.processReportGeneration(schedule.reportId, null, schedule.recipients);
            this.logger.log(`Executed scheduled report: ${schedule.name}`);
        }
        catch (error) {
            await this.prisma.reportSchedule.update({
                where: { id: schedule.id },
                data: { failureCount: { increment: 1 } },
            });
            throw error;
        }
    }
    async generateSalesReport(startDate, endDate, parameters) {
        const overview = await this.analyticsService.getAnalyticsOverview(startDate, endDate, new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime())), startDate);
        return {
            title: 'Sales Report',
            period: { startDate, endDate },
            summary: {
                totalRevenue: overview.revenue,
                totalOrders: overview.orders,
                averageOrderValue: overview.averageOrderValue,
                conversionRate: overview.conversionRate,
            },
            growth: {
                revenueGrowth: overview.revenueGrowth,
                ordersGrowth: overview.ordersGrowth,
                aovGrowth: overview.averageOrderValueGrowth,
            },
            topProducts: overview.topProducts,
            topMerchants: overview.topMerchants,
            charts: {
                revenue: overview.revenueChart,
                orders: overview.ordersChart,
            },
        };
    }
    async generateInventoryReport(startDate, endDate, parameters) {
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
    async generateCustomerReport(startDate, endDate, parameters) {
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
    async generateMerchantReport(startDate, endDate, parameters) {
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
    async generateProductPerformanceReport(startDate, endDate, parameters) {
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
    async generateFinancialReport(startDate, endDate, parameters) {
        return {
            title: 'Financial Report',
            period: { startDate, endDate },
            revenue: {},
            expenses: {},
            profitLoss: {},
            cashFlow: {},
        };
    }
    async generateOperationalReport(startDate, endDate, parameters) {
        return {
            title: 'Operational Report',
            period: { startDate, endDate },
            fulfillment: {},
            shipping: {},
            returns: {},
            efficiency: {},
        };
    }
    async generateExecutiveSummary(startDate, endDate, parameters) {
        const overview = await this.analyticsService.getAnalyticsOverview(startDate, endDate, new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime())), startDate);
        return {
            title: 'Executive Summary',
            period: { startDate, endDate },
            keyMetrics: {
                revenue: overview.revenue,
                orders: overview.orders,
                customers: overview.activeUsers,
                merchants: overview.activeMerchants,
            },
            growth: {
                revenue: overview.revenueGrowth,
                orders: overview.ordersGrowth,
                customers: overview.revenueGrowth,
            },
            highlights: [],
            recommendations: [],
        };
    }
    async generateReportFile(report, data, format) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${report.name}-${timestamp}.${format.toLowerCase()}`;
        const filePath = `/tmp/reports/${fileName}`;
        const content = JSON.stringify(data, null, 2);
        const fileSize = Buffer.byteLength(content, 'utf8');
        return { fileName, filePath, fileSize };
    }
    async sendReportToRecipients(report, filePath, recipients) {
        this.logger.log(`Would send report ${report.name} to ${recipients.join(', ')}`);
    }
    calculateNextRun(cronExpression) {
        const nextRun = new Date();
        nextRun.setHours(nextRun.getHours() + 1);
        return nextRun;
    }
    mapReportToResponse(report) {
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
    mapScheduleToResponse(schedule) {
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analytics_service_1.AnalyticsService,
        metrics_service_1.MetricsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map