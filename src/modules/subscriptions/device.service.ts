import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

export interface DeviceInfo {
    deviceName?: string;
    platform?: string;
    appVersion?: string;
    appId?: string; // Optional for backward compatibility
    osVersion?: string;
    manufacturer?: string;
    model?: string;
    sdkVersion?: string;
    product?: string;
    localizedModel?: string;
}

export interface DeviceWithSubscriptionInfo {
    id: string; // This is now the device ID
    deviceName: string | null;
    platform: string | null;
    appVersion: string | null;
    osVersion: string | null;
    manufacturer: string | null;
    model: string | null;
    sdkVersion: string | null;
    product: string | null;
    localizedModel: string | null;
    serverCount: number;
    userId: string | null;
    isActive: boolean;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
    hasActiveSubscription: boolean;
    maxServers: number;
    canViewLogs: boolean;
}

@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);

    constructor(private prisma: PrismaService) { }

    // Helper method to get default app ID for backward compatibility
    private async getDefaultAppId(): Promise<string> {
        const defaultApp = await this.prisma.app.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
        if (!defaultApp) {
            throw new Error('No active app found. Please create an app first.');
        }
        return defaultApp.id;
    }

    async registerOrUpdateDevice(deviceInfo: DeviceInfo, userId?: string): Promise<DeviceWithSubscriptionInfo> {
        try {
            // Get appId from deviceInfo or use default
            const appId = deviceInfo.appId || await this.getDefaultAppId();

            // Create new device (no need to check for existing since we don't have deviceId)
            const device = await this.prisma.device.create({
                data: {
                    deviceName: deviceInfo.deviceName,
                    platform: deviceInfo.platform,
                    appVersion: deviceInfo.appVersion,
                    osVersion: deviceInfo.osVersion,
                    manufacturer: deviceInfo.manufacturer,
                    model: deviceInfo.model,
                    sdkVersion: deviceInfo.sdkVersion,
                    product: deviceInfo.product,
                    localizedModel: deviceInfo.localizedModel,
                    appId: appId,
                    userId: userId,
                    lastSeen: new Date(),
                },
                include: {
                    subscriptions: {
                        where: {
                            status: {
                                in: ['ACTIVE', 'TRIALING'],
                            },
                            appId: appId, // Filter subscriptions by app
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                    },
                    user: {
                        include: {
                            subscriptions: {
                                where: {
                                    status: {
                                        in: ['ACTIVE', 'TRIALING'],
                                    },
                                    appId: appId, // Filter subscriptions by app
                                    deviceId: null, // Only fallback to user subscriptions without device link
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
                            },
                        },
                    },
                },
            });

            return this.mapToDeviceWithSubscriptionInfo(device);
        } catch (error) {
            this.logger.error(`Failed to register/update device: ${error.message}`);
            throw error;
        }
    }

    async getDeviceByDeviceId(deviceId: string, appId?: string): Promise<DeviceWithSubscriptionInfo | null> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();
            this.logger.log(`🔍 [DEBUG] Getting device by ID: ${deviceId}, targetAppId: ${targetAppId}`);

            const device = await this.prisma.device.findUnique({
                where: {
                    id: deviceId, // Use id as device ID
                },
                include: {
                    user: true, // Simple user include without subscriptions
                },
            });

            if (!device) {
                this.logger.log(`❌ [DEBUG] Device not found: ${deviceId}`);
                return null;
            }

            this.logger.log(`✅ [DEBUG] Device found: ${device.id}`);

            // Fetch device-specific subscriptions separately
            const deviceSubscriptions = await this.prisma.subscription.findMany({
                where: {
                    deviceId: deviceId,
                    status: {
                        in: ['ACTIVE', 'TRIALING'],
                    },
                    appId: targetAppId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            });

            this.logger.log(`🔍 [DEBUG] Found ${deviceSubscriptions.length} active subscriptions for device ${deviceId} in app ${targetAppId}`);

            if (deviceSubscriptions.length > 0) {
                this.logger.log(`✅ [DEBUG] Active subscription found: ${deviceSubscriptions[0].id}, status: ${deviceSubscriptions[0].status}`);
            } else {
                // Let's also check if there are any subscriptions for this device regardless of app
                const allDeviceSubscriptions = await this.prisma.subscription.findMany({
                    where: {
                        deviceId: deviceId,
                        status: {
                            in: ['ACTIVE', 'TRIALING'],
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                });
                this.logger.log(`🔍 [DEBUG] Found ${allDeviceSubscriptions.length} active subscriptions for device ${deviceId} across all apps`);
                allDeviceSubscriptions.forEach(sub => {
                    this.logger.log(`🔍 [DEBUG] Subscription: ${sub.id}, status: ${sub.status}, appId: ${sub.appId}`);
                });
            }

            // Add device subscriptions to the device object for mapping
            const deviceWithSubscriptions = {
                ...device,
                subscriptions: deviceSubscriptions,
            };

            return this.mapToDeviceWithSubscriptionInfo(deviceWithSubscriptions);
        } catch (error) {
            this.logger.error(`Failed to get device by ID: ${error.message}`);
            return null;
        }
    }

    async incrementServerCount(deviceId: string, appId?: string): Promise<DeviceWithSubscriptionInfo> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            const device = await this.prisma.device.update({
                where: {
                    id: deviceId, // Use id as device ID
                },
                data: {
                    serverCount: {
                        increment: 1
                    }
                },
                include: {
                    user: true, // Simple user include without subscriptions
                },
            });

            // Fetch device-specific subscriptions separately
            const deviceSubscriptions = await this.prisma.subscription.findMany({
                where: {
                    deviceId: deviceId,
                    status: {
                        in: ['ACTIVE', 'TRIALING'],
                    },
                    appId: targetAppId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            });

            // Add device subscriptions to the device object for mapping
            const deviceWithSubscriptions = {
                ...device,
                subscriptions: deviceSubscriptions,
            };

            return this.mapToDeviceWithSubscriptionInfo(deviceWithSubscriptions);
        } catch (error) {
            this.logger.error(`Failed to increment server count: ${error.message}`);
            throw error;
        }
    }

    async decrementServerCount(deviceId: string, appId?: string): Promise<DeviceWithSubscriptionInfo> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            const device = await this.prisma.device.update({
                where: {
                    id: deviceId, // Use id as device ID
                },
                data: {
                    serverCount: {
                        decrement: 1
                    }
                },
                include: {
                    user: true, // Simple user include without subscriptions
                },
            });

            // Fetch device-specific subscriptions separately
            const deviceSubscriptions = await this.prisma.subscription.findMany({
                where: {
                    deviceId: deviceId,
                    status: {
                        in: ['ACTIVE', 'TRIALING'],
                    },
                    appId: targetAppId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            });

            // Add device subscriptions to the device object for mapping
            const deviceWithSubscriptions = {
                ...device,
                subscriptions: deviceSubscriptions,
            };

            return this.mapToDeviceWithSubscriptionInfo(deviceWithSubscriptions);
        } catch (error) {
            this.logger.error(`Failed to decrement server count: ${error.message}`);
            throw error;
        }
    }

    async updateLastSeen(deviceId: string, appId?: string): Promise<void> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            await this.prisma.device.update({
                where: {
                    id: deviceId, // Use id as device ID
                },
                data: {
                    lastSeen: new Date(),
                },
            });
        } catch (error) {
            this.logger.error(`Failed to update last seen: ${error.message}`);
            throw error;
        }
    }

    async linkDeviceToUser(deviceId: string, userId: string, appId?: string): Promise<DeviceWithSubscriptionInfo> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            const device = await this.prisma.device.update({
                where: {
                    id: deviceId, // Use id as device ID
                },
                data: {
                    userId: userId,
                },
                include: {
                    user: true, // Simple user include without subscriptions
                },
            });

            // Fetch device-specific subscriptions separately
            const deviceSubscriptions = await this.prisma.subscription.findMany({
                where: {
                    deviceId: deviceId,
                    status: {
                        in: ['ACTIVE', 'TRIALING'],
                    },
                    appId: targetAppId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            });

            // Add device subscriptions to the device object for mapping
            const deviceWithSubscriptions = {
                ...device,
                subscriptions: deviceSubscriptions,
            };

            return this.mapToDeviceWithSubscriptionInfo(deviceWithSubscriptions);
        } catch (error) {
            this.logger.error(`Failed to link device to user: ${error.message}`);
            throw error;
        }
    }

    async getDevicesByUserId(userId: string, appId?: string): Promise<DeviceWithSubscriptionInfo[]> {
        try {
            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            const devices = await this.prisma.device.findMany({
                where: {
                    userId,
                    appId: targetAppId // Filter devices by app
                },
                include: {
                    user: {
                        include: {
                            subscriptions: {
                                where: {
                                    status: {
                                        in: ['ACTIVE', 'TRIALING'],
                                    },
                                    appId: targetAppId, // Filter subscriptions by app
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
                            },
                        },
                    },
                },
            });

            return devices.map((device) => this.mapToDeviceWithSubscriptionInfo(device));
        } catch (error) {
            this.logger.error(`Failed to get devices by user: ${error.message}`);
            throw error;
        }
    }

    async getAllDevices(params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        appId?: string;
    }): Promise<{
        devices: DeviceWithSubscriptionInfo[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }> {
        try {
            const { page, limit, search, status, appId } = params;
            const skip = (page - 1) * limit;

            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            // Build where clause
            const where: any = {
                appId: targetAppId, // Filter devices by app
            };

            if (search) {
                where.OR = [
                    { deviceName: { contains: search, mode: 'insensitive' } },
                    { deviceId: { contains: search, mode: 'insensitive' } },
                    { platform: { contains: search, mode: 'insensitive' } },
                ];
            }

            if (status) {
                if (status === 'active') {
                    where.isActive = true;
                } else if (status === 'inactive') {
                    where.isActive = false;
                }
            }

            const [devices, total] = await Promise.all([
                this.prisma.device.findMany({
                    where,
                    include: {
                        user: {
                            include: {
                                subscriptions: {
                                    where: {
                                        status: {
                                            in: ['ACTIVE', 'TRIALING'],
                                        },
                                        appId: targetAppId, // Filter subscriptions by app
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
                                    },
                                    take: 1,
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take: limit,
                }),
                this.prisma.device.count({ where }),
            ]);

            const pagination = {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            };

            return {
                devices: devices.map((device) => this.mapToDeviceWithSubscriptionInfo(device)),
                pagination,
            };
        } catch (error) {
            this.logger.error(`Failed to get all devices: ${error.message}`);
            throw error;
        }
    }

    private mapToDeviceWithSubscriptionInfo(device: any): DeviceWithSubscriptionInfo {
        // Only check device-specific subscriptions (no user authentication)
        const deviceSubscriptions = device.subscriptions || [];
        const hasActiveSubscription = deviceSubscriptions.length > 0;

        return {
            id: device.id,
            deviceName: device.deviceName,
            platform: device.platform,
            appVersion: device.appVersion,
            osVersion: device.osVersion,
            manufacturer: device.manufacturer,
            model: device.model,
            sdkVersion: device.sdkVersion,
            product: device.product,
            localizedModel: device.localizedModel,
            serverCount: device.serverCount,
            userId: device.userId,
            isActive: device.isActive,
            lastSeen: device.lastSeen,
            createdAt: device.createdAt,
            updatedAt: device.updatedAt,
            hasActiveSubscription,
            maxServers: hasActiveSubscription ? 999 : 1, // Unlimited for premium, 1 for free
            canViewLogs: hasActiveSubscription,
        };
    }
} 