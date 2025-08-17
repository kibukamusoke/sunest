import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NotificationService } from '../notifications/notification.service';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

  /**
   * Run on application startup after a delay
   * Useful for initialization tasks for Hardware World
   */
  @Timeout(5000)
  async handleStartupTasks() {
    this.logger.log('Executing Hardware World startup tasks...');

    try {
      // Clean up expired access tokens
      const expiredTokenCount = await this.cleanupExpiredTokens();
      this.logger.log(`Removed ${expiredTokenCount} expired tokens`);

      // TODO: Add Hardware World specific startup tasks
      // - Check merchant approval status updates
      // - Initialize inventory sync jobs
      // - Validate product catalog integrity

    } catch (error) {
      this.logger.error(`Error during startup tasks: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Hardware World startup tasks failed', error);
    }
  }

  /**
   * Clean up expired tokens every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokensJob() {
    this.logger.log('Running scheduled cleanup of expired tokens...');

    try {
      const count = await this.cleanupExpiredTokens();
      this.logger.log(`Scheduled cleanup removed ${count} expired tokens`);
    } catch (error) {
      this.logger.error(`Error cleaning up expired tokens: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Token cleanup job failed', error);
    }
  }

  /**
   * Archive old data every week
   */
  @Cron(CronExpression.EVERY_WEEK)
  async archiveOldDataJob() {
    this.logger.log('Archiving old data...');

    try {
      // Archive data older than 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Example: Archive old logs to a different table or storage
      // This is an example implementation - modify according to your needs
      const count = await this.archiveData(ninetyDaysAgo);

      this.logger.log(`Archived ${count} old records`);
    } catch (error) {
      this.logger.error(`Error archiving old data: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Data archiving job failed', error);
    }
  }

  /**
   * Generate Hardware World business reports every Monday at 7am
   */
  @Cron('0 7 * * 1')
  async generateWeeklyReportJob() {
    this.logger.log('Generating Hardware World weekly business report...');

    try {
      // Generate Hardware World specific business report
      const report = await this.generateWeeklyBusinessReport();

      // Send notification about the report to system admins
      const reportMessage = `📊 Hardware World Weekly Report:
        
        New Users: ${report.newUsers}
        New Companies: ${report.newCompanies} 
        New Merchants: ${report.newMerchants}
        Pending Merchant Approvals: ${report.pendingMerchants}
        
        Period: ${report.period}`;

      await this.notificationService.sendSystemAlert(
        'Weekly Business Report Generated',
        new Error(reportMessage)
      );

      this.logger.log('Hardware World weekly report generated and notification sent');
    } catch (error) {
      this.logger.error(`Error generating weekly report: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Weekly report generation failed', error);
    }
  }

  /**
   * Register a dynamic job that can be added at runtime
   */
  registerDynamicJob(name: string, cronExpression: string, callback: () => void): void {
    try {
      const job = new CronJob(cronExpression, callback);

      this.schedulerRegistry.addCronJob(name, job);
      job.start();

      this.logger.log(`Job ${name} registered with cron pattern: ${cronExpression}`);
    } catch (error) {
      this.logger.error(`Error registering dynamic job ${name}: ${error.message}`, error.stack);
    }
  }

  /**
   * Remove a dynamic job
   */
  removeDynamicJob(name: string): void {
    try {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Job ${name} deleted`);
    } catch (error) {
      this.logger.error(`Error removing job ${name}: ${error.message}`);
    }
  }

  /**
   * List all registered jobs
   */
  listJobs(): string[] {
    try {
      const jobs = this.schedulerRegistry.getCronJobs();
      const jobNames: string[] = [];

      jobs.forEach((value, key) => {
        const next = value.nextDate().toString();
        jobNames.push(`${key} -> next: ${next}`);
      });

      return jobNames;
    } catch (error) {
      this.logger.error(`Error listing jobs: ${error.message}`);
      return [];
    }
  }

  /**
   * Helper method to clean up expired tokens
   */
  private async cleanupExpiredTokens(): Promise<number> {
    try {
      // This is an example implementation
      // In a real application, you would query your database and remove expired tokens
      const now = new Date();

      // Example: Remove user records where refreshToken is expired
      // This assumes you have a refreshTokenExpiry field in your User model
      const result = await this.prismaService.user.updateMany({
        where: {
          refreshToken: { not: null },
          // This is an example field - you would need to adapt to your schema
          // refreshTokenExpiry: { lt: now },
        },
        data: {
          refreshToken: null,
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error(`Error in cleanupExpiredTokens: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Helper method to archive old data
   */
  private async archiveData(olderThan: Date): Promise<number> {
    // This is a placeholder function
    // In a real application, you would implement logic to move old data
    // to archive tables or storage
    return 0;
  }

  /**
   * Helper method to generate Hardware World weekly business report
   */
  private async generateWeeklyBusinessReport() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Count new users in the last week
      const newUsers = await this.prismaService.user.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      });

      // Count new companies in the last week
      const newCompanies = await this.prismaService.company.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      });

      // Count new merchants in the last week
      const newMerchants = await this.prismaService.merchant.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      });

      // Count pending merchant approvals
      const pendingMerchants = await this.prismaService.merchant.count({
        where: {
          status: 'PENDING'
        }
      });

      return {
        period: `${oneWeekAgo.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        newUsers,
        newCompanies,
        newMerchants,
        pendingMerchants,
      };
    } catch (error) {
      this.logger.error(`Error generating weekly business report: ${error.message}`, error.stack);
      throw error;
    }
  }
}