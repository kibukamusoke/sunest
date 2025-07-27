import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

export interface CustomerWithDetails {
    id: string;
    email: string;
    displayName: string | null;
    phone: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    stripeCustomerId: string | null;
    userId: string;
    appId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        email: string;
        displayName: string | null;
    };
    subscriptions: {
        id: string;
        status: string;
        stripePriceId: string | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        createdAt: Date;
    }[];
}

@Injectable()
export class CustomersService {
    private readonly logger = new Logger(CustomersService.name);

    constructor(private prisma: PrismaService) {}

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

    async getAllCustomers(params: {
        page: number;
        limit: number;
        search?: string;
        appId?: string;
    }): Promise<{
        customers: CustomerWithDetails[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }> {
        try {
            const { page, limit, search, appId } = params;
            const skip = (page - 1) * limit;

            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            // Build where clause
            const where: any = {
                appId: targetAppId,
            };

            // Search by email, name, or phone
            if (search) {
                where.OR = [
                    { email: { contains: search, mode: 'insensitive' } },
                    { displayName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                ];
            }

            // Get total count
            const total = await this.prisma.customer.count({ where });

            // Get customers with pagination
            const customers = await this.prisma.customer.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                        },
                    },
                    subscriptions: {
                        select: {
                            id: true,
                            status: true,
                            stripePriceId: true,
                            currentPeriodStart: true,
                            currentPeriodEnd: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            const pages = Math.ceil(total / limit);

            return {
                customers: customers as CustomerWithDetails[],
                total,
                page,
                limit,
                pages,
            };
        } catch (error) {
            this.logger.error(`Failed to get all customers: ${error.message}`);
            throw error;
        }
    }

    async getCustomerById(id: string): Promise<CustomerWithDetails | null> {
        try {
            const customer = await this.prisma.customer.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                        },
                    },
                    subscriptions: {
                        select: {
                            id: true,
                            status: true,
                            stripePriceId: true,
                            currentPeriodStart: true,
                            currentPeriodEnd: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });

            if (!customer) {
                throw new NotFoundException('Customer not found');
            }

            return customer as CustomerWithDetails;
        } catch (error) {
            this.logger.error(`Failed to get customer by ID: ${error.message}`);
            throw error;
        }
    }

    async getCustomerSubscriptions(id: string) {
        try {
            const customer = await this.prisma.customer.findUnique({
                where: { id },
                include: {
                    subscriptions: {
                        include: {
                            subscriptionPlan: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });

            if (!customer) {
                throw new NotFoundException('Customer not found');
            }

            return {
                customerId: customer.id,
                customerEmail: customer.email,
                subscriptions: customer.subscriptions,
            };
        } catch (error) {
            this.logger.error(`Failed to get customer subscriptions: ${error.message}`);
            throw error;
        }
    }
} 