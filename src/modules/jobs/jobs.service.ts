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
  ) {}

  /**
   * Run on application startup after a delay
   * Useful for initialization tasks that should run once after startup
   */
  @Timeout(5000)
  async handleStartupTasks() {
    this.logger.log('Executing startup tasks...');
    
    try {
      // Example: Check for expired access tokens
      const expiredTokenCount = await this.cleanupExpiredTokens();
      this.logger.log(`Removed ${expiredTokenCount} expired tokens`);
      
      // You could add other startup tasks here
    } catch (error) {
      this.logger.error(`Error during startup tasks: ${error.message}`, error.stack);
      await this.notificationService.sendSystemAlert('Startup tasks failed', error);
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
   * Generate weekly reports every Monday at 7am
   */
  @Cron('0 7 * * 1')
  async generateWeeklyReportJob() {
    this.logger.log('Generating weekly report...');
    
    try {
      // Generate report logic here
      const report = await this.generateWeeklyReport();
      
      // Send notification about the report
      await this.notificationService.sendTelegramNotification({
        message: `📊 <b>Weekly Report Generated</b>\n\nStats: ${report.stats}\nUsers: ${report.newUsers}\nFiles: ${report.newFiles}`,
      });
      
      this.logger.log('Weekly report generated and notification sent');
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
   * Helper method to generate weekly report
   */
  private async generateWeeklyReport() {
    try {
      // Example implementation - replace with actual reporting logic
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Example: Count new users in the last week
      const newUsers = await this.prismaService.user.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      });
      
      // Example: Count new files in the last week
      const newFiles = await this.prismaService.file.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      });
      
      // Additional metrics can be added here
      
      return {
        period: `${oneWeekAgo.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        newUsers,
        newFiles,
        stats: `${newUsers} new users, ${newFiles} new files`
      };
    } catch (error) {
      this.logger.error(`Error generating weekly report: ${error.message}`, error.stack);
      throw error;
    }
  }
}