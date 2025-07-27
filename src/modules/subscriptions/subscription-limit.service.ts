import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { DeviceService, DeviceWithSubscriptionInfo } from './device.service';

export interface SubscriptionLimits {
  maxServers: number;
  canViewLogs: boolean;
  canCreateAdditionalServers: boolean;
  hasActiveSubscription: boolean;
  currentServerCount: number;
}

@Injectable()
export class SubscriptionLimitService {
  private readonly logger = new Logger(SubscriptionLimitService.name);

  constructor(private deviceService: DeviceService) {}

  async checkSubscriptionLimits(deviceId: string): Promise<SubscriptionLimits> {
    try {
      const device = await this.deviceService.getDeviceByDeviceId(deviceId);
      
      if (!device) {
        throw new ForbiddenException('Device not found');
      }

      return {
        maxServers: device.maxServers,
        canViewLogs: device.canViewLogs,
        canCreateAdditionalServers: device.serverCount < device.maxServers,
        hasActiveSubscription: device.hasActiveSubscription,
        currentServerCount: device.serverCount,
      };
    } catch (error) {
      this.logger.error(`Failed to check subscription limits: ${error.message}`);
      throw error;
    }
  }

  async canCreateServer(deviceId: string): Promise<boolean> {
    try {
      const limits = await this.checkSubscriptionLimits(deviceId);
      return limits.canCreateAdditionalServers;
    } catch (error) {
      this.logger.error(`Failed to check if can create server: ${error.message}`);
      return false;
    }
  }

  async canViewLogs(deviceId: string): Promise<boolean> {
    try {
      const limits = await this.checkSubscriptionLimits(deviceId);
      return limits.canViewLogs;
    } catch (error) {
      this.logger.error(`Failed to check if can view logs: ${error.message}`);
      return false;
    }
  }

  async enforceServerCreationLimit(deviceId: string): Promise<void> {
    const canCreate = await this.canCreateServer(deviceId);
    
    if (!canCreate) {
      const limits = await this.checkSubscriptionLimits(deviceId);
      
      if (!limits.hasActiveSubscription) {
        throw new ForbiddenException(
          `Server creation limit reached. Free users can create up to ${limits.maxServers} server(s). Upgrade to premium to create unlimited servers.`
        );
      } else {
        throw new ForbiddenException(
          `Maximum server limit reached (${limits.maxServers})`
        );
      }
    }
  }

  async enforceLogViewingLimit(deviceId: string): Promise<void> {
    const canView = await this.canViewLogs(deviceId);
    
    if (!canView) {
      throw new ForbiddenException(
        'Log viewing is a premium feature. Please upgrade your subscription to view container logs.'
      );
    }
  }

  async trackServerCreation(deviceId: string): Promise<DeviceWithSubscriptionInfo> {
    try {
      await this.enforceServerCreationLimit(deviceId);
      return await this.deviceService.incrementServerCount(deviceId);
    } catch (error) {
      this.logger.error(`Failed to track server creation: ${error.message}`);
      throw error;
    }
  }

  async trackServerDeletion(deviceId: string): Promise<DeviceWithSubscriptionInfo> {
    try {
      return await this.deviceService.decrementServerCount(deviceId);
    } catch (error) {
      this.logger.error(`Failed to track server deletion: ${error.message}`);
      throw error;
    }
  }

  async getSubscriptionStatus(deviceId: string): Promise<{
    hasActiveSubscription: boolean;
    limits: SubscriptionLimits;
    requiresUpgrade: boolean;
    upgradeMessage: string;
  }> {
    try {
      const limits = await this.checkSubscriptionLimits(deviceId);
      
      let requiresUpgrade = false;
      let upgradeMessage = '';
      
      if (!limits.hasActiveSubscription) {
        if (limits.currentServerCount >= limits.maxServers) {
          requiresUpgrade = true;
          upgradeMessage = 'Upgrade to premium to create unlimited servers and view container logs.';
        } else {
          upgradeMessage = 'Upgrade to premium to unlock unlimited servers and log viewing.';
        }
      }
      
      return {
        hasActiveSubscription: limits.hasActiveSubscription,
        limits,
        requiresUpgrade,
        upgradeMessage,
      };
    } catch (error) {
      this.logger.error(`Failed to get subscription status: ${error.message}`);
      throw error;
    }
  }

  async checkFeatureAccess(deviceId: string, feature: 'server_creation' | 'log_viewing'): Promise<{
    allowed: boolean;
    message?: string;
  }> {
    try {
      const limits = await this.checkSubscriptionLimits(deviceId);
      
      switch (feature) {
        case 'server_creation':
          if (limits.canCreateAdditionalServers) {
            return { allowed: true };
          } else {
            return {
              allowed: false,
              message: limits.hasActiveSubscription
                ? `Maximum server limit reached (${limits.maxServers})`
                : `Server creation limit reached. Free users can create up to ${limits.maxServers} server(s). Upgrade to premium to create unlimited servers.`,
            };
          }
        
        case 'log_viewing':
          if (limits.canViewLogs) {
            return { allowed: true };
          } else {
            return {
              allowed: false,
              message: 'Log viewing is a premium feature. Please upgrade your subscription to view container logs.',
            };
          }
        
        default:
          return { allowed: false, message: 'Unknown feature' };
      }
    } catch (error) {
      this.logger.error(`Failed to check feature access: ${error.message}`);
      return { allowed: false, message: 'Error checking feature access' };
    }
  }

  // Helper method to get user-friendly limit descriptions
  getSubscriptionLimitDescription(limits: SubscriptionLimits): string {
    if (limits.hasActiveSubscription) {
      return 'Premium subscription: Unlimited servers and full feature access';
    } else {
      return `Free plan: ${limits.currentServerCount}/${limits.maxServers} servers used. Log viewing restricted.`;
    }
  }
} 