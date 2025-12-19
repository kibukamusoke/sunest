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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const notification_service_1 = require("../notifications/notification.service");
const prisma_service_1 = require("../../config/prisma.service");
let JobsService = JobsService_1 = class JobsService {
    constructor(schedulerRegistry, prismaService, notificationService) {
        this.schedulerRegistry = schedulerRegistry;
        this.prismaService = prismaService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(JobsService_1.name);
    }
    async handleStartupTasks() {
        this.logger.log('Executing Hardware World startup tasks...');
        try {
            const expiredTokenCount = await this.cleanupExpiredTokens();
            this.logger.log(`Removed ${expiredTokenCount} expired tokens`);
        }
        catch (error) {
            this.logger.error(`Error during startup tasks: ${error.message}`, error.stack);
            await this.notificationService.sendSystemAlert('Hardware World startup tasks failed', error);
        }
    }
    async cleanupExpiredTokensJob() {
        this.logger.log('Running scheduled cleanup of expired tokens...');
        try {
            const count = await this.cleanupExpiredTokens();
            this.logger.log(`Scheduled cleanup removed ${count} expired tokens`);
        }
        catch (error) {
            this.logger.error(`Error cleaning up expired tokens: ${error.message}`, error.stack);
            await this.notificationService.sendSystemAlert('Token cleanup job failed', error);
        }
    }
    async archiveOldDataJob() {
        this.logger.log('Archiving old data...');
        try {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            const count = await this.archiveData(ninetyDaysAgo);
            this.logger.log(`Archived ${count} old records`);
        }
        catch (error) {
            this.logger.error(`Error archiving old data: ${error.message}`, error.stack);
            await this.notificationService.sendSystemAlert('Data archiving job failed', error);
        }
    }
    async generateWeeklyReportJob() {
        this.logger.log('Generating Hardware World weekly business report...');
        try {
            const report = await this.generateWeeklyBusinessReport();
            const reportMessage = `📊 Hardware World Weekly Report:
        
        New Users: ${report.newUsers}
        New Companies: ${report.newCompanies} 
        New Merchants: ${report.newMerchants}
        Pending Merchant Approvals: ${report.pendingMerchants}
        
        Period: ${report.period}`;
            await this.notificationService.sendSystemAlert('Weekly Business Report Generated', new Error(reportMessage));
            this.logger.log('Hardware World weekly report generated and notification sent');
        }
        catch (error) {
            this.logger.error(`Error generating weekly report: ${error.message}`, error.stack);
            await this.notificationService.sendSystemAlert('Weekly report generation failed', error);
        }
    }
    registerDynamicJob(name, cronExpression, callback) {
        try {
            const job = new cron_1.CronJob(cronExpression, callback);
            this.schedulerRegistry.addCronJob(name, job);
            job.start();
            this.logger.log(`Job ${name} registered with cron pattern: ${cronExpression}`);
        }
        catch (error) {
            this.logger.error(`Error registering dynamic job ${name}: ${error.message}`, error.stack);
        }
    }
    removeDynamicJob(name) {
        try {
            this.schedulerRegistry.deleteCronJob(name);
            this.logger.log(`Job ${name} deleted`);
        }
        catch (error) {
            this.logger.error(`Error removing job ${name}: ${error.message}`);
        }
    }
    listJobs() {
        try {
            const jobs = this.schedulerRegistry.getCronJobs();
            const jobNames = [];
            jobs.forEach((value, key) => {
                const next = value.nextDate().toString();
                jobNames.push(`${key} -> next: ${next}`);
            });
            return jobNames;
        }
        catch (error) {
            this.logger.error(`Error listing jobs: ${error.message}`);
            return [];
        }
    }
    async cleanupExpiredTokens() {
        try {
            const now = new Date();
            const result = await this.prismaService.user.updateMany({
                where: {
                    refreshToken: { not: null },
                },
                data: {
                    refreshToken: null,
                },
            });
            return result.count;
        }
        catch (error) {
            this.logger.error(`Error in cleanupExpiredTokens: ${error.message}`, error.stack);
            throw error;
        }
    }
    async archiveData(olderThan) {
        return 0;
    }
    async generateWeeklyBusinessReport() {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newUsers = await this.prismaService.user.count({
                where: {
                    createdAt: { gte: oneWeekAgo },
                },
            });
            const newCompanies = await this.prismaService.company.count({
                where: {
                    createdAt: { gte: oneWeekAgo },
                },
            });
            const newMerchants = await this.prismaService.merchant.count({
                where: {
                    createdAt: { gte: oneWeekAgo },
                },
            });
            const pendingMerchants = await this.prismaService.merchant.count({
                where: {
                    status: 'PENDING',
                },
            });
            return {
                period: `${oneWeekAgo.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
                newUsers,
                newCompanies,
                newMerchants,
                pendingMerchants,
            };
        }
        catch (error) {
            this.logger.error(`Error generating weekly business report: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.JobsService = JobsService;
__decorate([
    (0, schedule_1.Timeout)(5000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "handleStartupTasks", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "cleanupExpiredTokensJob", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_WEEK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "archiveOldDataJob", null);
__decorate([
    (0, schedule_1.Cron)('0 7 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "generateWeeklyReportJob", null);
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map