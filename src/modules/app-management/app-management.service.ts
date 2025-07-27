import { Injectable, ForbiddenException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateAppDto, UpdateAppDto, AppResponseDto, AppStatisticsDto } from './dto/app-management.dto';

@Injectable()
export class AppManagementService {
    private readonly logger = new Logger(AppManagementService.name);

    constructor(private readonly prisma: PrismaService) { }

    // Check if user has admin permissions
    private async checkAdminPermissions(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user has admin role or admin permission
        const hasAdminRole = user.roles.some(role => role.name === 'admin');
        const hasAdminPermission = user.roles.some(role =>
            role.permissions.some(permission => permission.name === 'admin')
        );

        if (!hasAdminRole && !hasAdminPermission) {
            throw new ForbiddenException('Admin permissions required');
        }
    }

    async createApp(createAppDto: CreateAppDto, userId: string): Promise<AppResponseDto> {
        await this.checkAdminPermissions(userId);

        // Check if app with same name already exists
        const existingApp = await this.prisma.app.findUnique({
            where: { name: createAppDto.name }
        });

        if (existingApp) {
            throw new BadRequestException(`App with name '${createAppDto.name}' already exists`);
        }

        try {
            const app = await this.prisma.app.create({
                data: {
                    name: createAppDto.name,
                    displayName: createAppDto.displayName,
                    description: createAppDto.description,
                    domain: createAppDto.domain,
                    settings: createAppDto.settings || undefined,
                    isActive: true
                }
            });

            this.logger.log(`App created: ${app.name} (${app.id}) by user ${userId}`);

            return this.mapToResponseDto(app);
        } catch (error) {
            this.logger.error(`Failed to create app: ${error.message}`);
            throw error;
        }
    }

    async getApps(
        params: { page: number; limit: number; search?: string },
        userId: string
    ): Promise<{ apps: AppResponseDto[]; pagination: any }> {
        await this.checkAdminPermissions(userId);

        const { page, limit, search } = params;
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { displayName: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {};

        const [apps, total] = await Promise.all([
            this.prisma.app.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            this.prisma.app.count({ where })
        ]);

        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        };

        return {
            apps: apps.map(app => this.mapToResponseDto(app)),
            pagination
        };
    }

    async getApp(id: string, userId: string): Promise<AppResponseDto> {
        await this.checkAdminPermissions(userId);

        const app = await this.prisma.app.findUnique({
            where: { id }
        });

        if (!app) {
            throw new NotFoundException(`App with ID '${id}' not found`);
        }

        return this.mapToResponseDto(app);
    }

    async updateApp(id: string, updateAppDto: UpdateAppDto, userId: string): Promise<AppResponseDto> {
        await this.checkAdminPermissions(userId);

        const existingApp = await this.prisma.app.findUnique({
            where: { id }
        });

        if (!existingApp) {
            throw new NotFoundException(`App with ID '${id}' not found`);
        }

        try {
            const updatedApp = await this.prisma.app.update({
                where: { id },
                data: {
                    displayName: updateAppDto.displayName,
                    description: updateAppDto.description,
                    domain: updateAppDto.domain,
                    isActive: updateAppDto.isActive,
                    settings: updateAppDto.settings !== undefined ? updateAppDto.settings : undefined
                }
            });

            this.logger.log(`App updated: ${updatedApp.name} (${updatedApp.id}) by user ${userId}`);

            return this.mapToResponseDto(updatedApp);
        } catch (error) {
            this.logger.error(`Failed to update app: ${error.message}`);
            throw error;
        }
    }

    async deleteApp(id: string, userId: string): Promise<void> {
        await this.checkAdminPermissions(userId);

        const existingApp = await this.prisma.app.findUnique({
            where: { id },
            include: {
                users: { select: { id: true } },
                devices: { select: { id: true } },
                subscriptions: { select: { id: true } }
            }
        });

        if (!existingApp) {
            throw new NotFoundException(`App with ID '${id}' not found`);
        }

        // Check if app has associated data
        if (existingApp.users.length > 0 || existingApp.devices.length > 0 || existingApp.subscriptions.length > 0) {
            throw new BadRequestException(
                `Cannot delete app '${existingApp.name}' because it has associated users, devices, or subscriptions. ` +
                `Please migrate or remove associated data first.`
            );
        }

        try {
            await this.prisma.app.delete({
                where: { id }
            });

            this.logger.log(`App deleted: ${existingApp.name} (${existingApp.id}) by user ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to delete app: ${error.message}`);
            throw error;
        }
    }

    async getAppStatistics(id: string, userId: string): Promise<AppStatisticsDto> {
        await this.checkAdminPermissions(userId);

        const app = await this.prisma.app.findUnique({
            where: { id }
        });

        if (!app) {
            throw new NotFoundException(`App with ID '${id}' not found`);
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            totalUsers,
            activeUsers,
            totalDevices,
            activeDevices,
            totalSubscriptions,
            activeSubscriptions,
            subscriptionRevenue
        ] = await Promise.all([
            // Total users
            this.prisma.user.count({
                where: { appId: id }
            }),
            // Active users (last 30 days)
            this.prisma.user.count({
                where: {
                    appId: id,
                    updatedAt: { gte: thirtyDaysAgo }
                }
            }),
            // Total devices
            this.prisma.device.count({
                where: { appId: id }
            }),
            // Active devices (last 30 days)
            this.prisma.device.count({
                where: {
                    appId: id,
                    lastSeen: { gte: thirtyDaysAgo }
                }
            }),
            // Total subscriptions
            this.prisma.subscription.count({
                where: { appId: id }
            }),
            // Active subscriptions
            this.prisma.subscription.count({
                where: {
                    appId: id,
                    status: { in: ['ACTIVE', 'TRIALING'] }
                }
            }),
            // Monthly revenue calculation (simplified - would need Stripe integration for real data)
            this.prisma.subscription.findMany({
                where: {
                    appId: id,
                    status: { in: ['ACTIVE', 'TRIALING'] }
                },
                select: {
                    stripePriceId: true
                }
            })
        ]);

        // Calculate monthly revenue (simplified calculation)
        // In a real application, you'd fetch price data from Stripe
        const monthlyRevenue = activeSubscriptions * 10; // Placeholder calculation

        return {
            totalUsers,
            activeUsers,
            totalDevices,
            activeDevices,
            totalSubscriptions,
            activeSubscriptions,
            monthlyRevenue
        };
    }

    private mapToResponseDto(app: any): AppResponseDto {
        return {
            id: app.id,
            name: app.name,
            displayName: app.displayName,
            description: app.description,
            domain: app.domain,
            isActive: app.isActive,
            settings: app.settings,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
        };
    }
} 