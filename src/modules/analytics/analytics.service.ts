import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import {
    MetricType,
    TimeGranularity,
    DashboardType,
    ChartType,
    Prisma
} from '@prisma/client';
import {
    CreateAnalyticsSessionDto,
    UpdateAnalyticsSessionDto,
    AnalyticsSessionResponseDto,
    CreateAnalyticsEventDto,
    AnalyticsEventResponseDto,
    BusinessMetricQueryDto,
    BusinessMetricResponseDto,
    AnalyticsOverviewDto,
    AnalyticsQueryDto,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(private prisma: PrismaService) { }

    // =============== SESSION TRACKING ===============

    async createSession(data: CreateAnalyticsSessionDto): Promise<AnalyticsSessionResponseDto> {
        try {
            const session = await this.prisma.analyticsSession.create({
                data: {
                    sessionId: data.sessionId,
                    userId: data.userId,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    deviceType: data.deviceType,
                    browserType: data.browserType,
                    platform: data.platform,
                    country: data.country,
                    region: data.region,
                    city: data.city,
                    startTime: new Date(data.startTime),
                    merchantId: data.merchantId,
                },
            });

            return this.mapSessionToResponse(session);
        } catch (error) {
            this.logger.error(`Failed to create analytics session: ${error.message}`, error.stack);
            throw error;
        }
    }

    async updateSession(sessionId: string, data: UpdateAnalyticsSessionDto): Promise<AnalyticsSessionResponseDto> {
        try {
            const updateData: Prisma.AnalyticsSessionUpdateInput = {};

            if (data.endTime) updateData.endTime = new Date(data.endTime);
            if (data.duration !== undefined) updateData.duration = data.duration;
            if (data.pageViews !== undefined) updateData.pageViews = data.pageViews;
            if (data.eventCount !== undefined) updateData.eventCount = data.eventCount;
            if (data.orderId) updateData.orderId = data.orderId;
            if (data.revenue !== undefined) updateData.revenue = data.revenue;

            const session = await this.prisma.analyticsSession.update({
                where: { sessionId },
                data: updateData,
            });

            return this.mapSessionToResponse(session);
        } catch (error) {
            this.logger.error(`Failed to update analytics session: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getSession(sessionId: string): Promise<AnalyticsSessionResponseDto | null> {
        const session = await this.prisma.analyticsSession.findUnique({
            where: { sessionId },
        });

        return session ? this.mapSessionToResponse(session) : null;
    }

    async getSessions(query: AnalyticsQueryDto): Promise<{
        sessions: AnalyticsSessionResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.AnalyticsSessionWhereInput = {};

        if (query.startDate && query.endDate) {
            where.startTime = {
                gte: new Date(query.startDate),
                lte: new Date(query.endDate),
            };
        }

        const [sessions, total] = await Promise.all([
            this.prisma.analyticsSession.findMany({
                where,
                skip,
                take: limit,
                orderBy: { startTime: 'desc' },
            }),
            this.prisma.analyticsSession.count({ where }),
        ]);

        return {
            sessions: sessions.map(this.mapSessionToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // =============== EVENT TRACKING ===============

    async createEvent(data: CreateAnalyticsEventDto): Promise<AnalyticsEventResponseDto> {
        try {
            // Ensure session exists
            const session = await this.prisma.analyticsSession.findUnique({
                where: { sessionId: data.sessionId },
            });

            if (!session) {
                throw new Error(`Session ${data.sessionId} not found`);
            }

            const event = await this.prisma.analyticsEvent.create({
                data: {
                    sessionId: data.sessionId,
                    eventType: data.eventType,
                    eventName: data.eventName,
                    category: data.category,
                    action: data.action,
                    label: data.label,
                    value: data.value,
                    userId: data.userId,
                    merchantId: data.merchantId,
                    productId: data.productId,
                    orderId: data.orderId,
                    pageUrl: data.pageUrl,
                    pageTitle: data.pageTitle,
                    referrer: data.referrer,
                    properties: data.properties,
                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                },
            });

            // Update session event count
            await this.prisma.analyticsSession.update({
                where: { sessionId: data.sessionId },
                data: { eventCount: { increment: 1 } },
            });

            return this.mapEventToResponse(event);
        } catch (error) {
            this.logger.error(`Failed to create analytics event: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getEvents(sessionId: string): Promise<AnalyticsEventResponseDto[]> {
        const events = await this.prisma.analyticsEvent.findMany({
            where: { sessionId },
            orderBy: { timestamp: 'asc' },
        });

        return events.map(this.mapEventToResponse);
    }

    async getEventsByType(eventType: string, query: AnalyticsQueryDto): Promise<{
        events: AnalyticsEventResponseDto[];
        total: number;
    }> {
        const where: Prisma.AnalyticsEventWhereInput = { eventType };

        if (query.startDate && query.endDate) {
            where.timestamp = {
                gte: new Date(query.startDate),
                lte: new Date(query.endDate),
            };
        }

        const [events, total] = await Promise.all([
            this.prisma.analyticsEvent.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: query.limit || 100,
            }),
            this.prisma.analyticsEvent.count({ where }),
        ]);

        return {
            events: events.map(this.mapEventToResponse),
            total,
        };
    }

    // =============== BUSINESS METRICS ===============

    async getBusinessMetrics(query: BusinessMetricQueryDto): Promise<BusinessMetricResponseDto[]> {
        const where: Prisma.BusinessMetricWhereInput = {};

        where.date = {
            gte: new Date(query.startDate),
            lte: new Date(query.endDate),
        };

        if (query.granularity) {
            where.granularity = query.granularity;
        }

        if (query.category) {
            where.category = query.category;
        }

        const metrics = await this.prisma.businessMetric.findMany({
            where,
            orderBy: { date: 'asc' },
        });

        return metrics.map(this.mapBusinessMetricToResponse);
    }

    async calculateBusinessMetrics(
        startDate: Date,
        endDate: Date,
        granularity: TimeGranularity = TimeGranularity.DAY
    ): Promise<void> {
        try {
            this.logger.log(`Calculating business metrics for ${startDate} to ${endDate}`);

            // Generate date range based on granularity
            const dates = this.generateDateRange(startDate, endDate, granularity);

            for (const date of dates) {
                await this.calculateMetricsForDate(date, granularity);
            }

            this.logger.log('Business metrics calculation completed');
        } catch (error) {
            this.logger.error(`Failed to calculate business metrics: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async calculateMetricsForDate(date: Date, granularity: TimeGranularity): Promise<void> {
        const { startDate, endDate } = this.getDateRange(date, granularity);

        // Calculate core metrics
        const [
            totalRevenue,
            totalOrders,
            totalUsers,
            activeUsers,
            newUsers,
            activeMerchants,
            newMerchants,
            totalProducts,
            activeProducts,
            productViews,
        ] = await Promise.all([
            this.calculateTotalRevenue(startDate, endDate),
            this.calculateTotalOrders(startDate, endDate),
            this.calculateTotalUsers(startDate, endDate),
            this.calculateActiveUsers(startDate, endDate),
            this.calculateNewUsers(startDate, endDate),
            this.calculateActiveMerchants(startDate, endDate),
            this.calculateNewMerchants(startDate, endDate),
            this.calculateTotalProducts(startDate, endDate),
            this.calculateActiveProducts(startDate, endDate),
            this.calculateProductViews(startDate, endDate),
        ]);

        // Calculate derived metrics
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const conversionRate = totalUsers > 0 ? totalOrders / totalUsers : 0;
        const addToCartRate = productViews > 0 ? await this.calculateAddToCartEvents(startDate, endDate) / productViews : 0;

        // Save metrics
        await this.prisma.businessMetric.upsert({
            where: {
                name_date_granularity: {
                    name: 'core_metrics',
                    date,
                    granularity,
                },
            },
            create: {
                name: 'core_metrics',
                category: 'business',
                date,
                granularity,
                totalRevenue,
                totalOrders,
                totalUsers,
                activeUsers,
                newUsers,
                averageOrderValue,
                conversionRate,
                activeMerchants,
                newMerchants,
                totalProducts,
                activeProducts,
                productViews,
                addToCartRate,
            },
            update: {
                totalRevenue,
                totalOrders,
                totalUsers,
                activeUsers,
                newUsers,
                averageOrderValue,
                conversionRate,
                activeMerchants,
                newMerchants,
                totalProducts,
                activeProducts,
                productViews,
                addToCartRate,
            },
        });
    }

    // =============== ANALYTICS OVERVIEW ===============

    async getAnalyticsOverview(
        startDate: Date,
        endDate: Date,
        previousStartDate: Date,
        previousEndDate: Date
    ): Promise<AnalyticsOverviewDto> {
        try {
            // Current period metrics
            const [
                currentRevenue,
                currentOrders,
                currentUsers,
                currentAOV,
                currentConversion,
                activeMerchants,
                topProducts,
                topMerchants,
                revenueChart,
                ordersChart,
            ] = await Promise.all([
                this.calculateTotalRevenue(startDate, endDate),
                this.calculateTotalOrders(startDate, endDate),
                this.calculateTotalUsers(startDate, endDate),
                this.calculateAverageOrderValue(startDate, endDate),
                this.calculateConversionRate(startDate, endDate),
                this.calculateActiveMerchants(startDate, endDate),
                this.getTopProductsByRevenue(startDate, endDate, 5),
                this.getTopMerchantsByRevenue(startDate, endDate, 5),
                this.getRevenueChart(startDate, endDate),
                this.getOrdersChart(startDate, endDate),
            ]);

            // Previous period metrics for growth calculation
            const [
                previousRevenue,
                previousOrders,
                previousUsers,
                previousAOV,
            ] = await Promise.all([
                this.calculateTotalRevenue(previousStartDate, previousEndDate),
                this.calculateTotalOrders(previousStartDate, previousEndDate),
                this.calculateTotalUsers(previousStartDate, previousEndDate),
                this.calculateAverageOrderValue(previousStartDate, previousEndDate),
            ]);

            // Calculate growth percentages
            const revenueGrowth = this.calculateGrowthPercentage(currentRevenue, previousRevenue);
            const ordersGrowth = this.calculateGrowthPercentage(currentOrders, previousOrders);
            const usersGrowth = this.calculateGrowthPercentage(currentUsers, previousUsers);
            const aovGrowth = this.calculateGrowthPercentage(currentAOV, previousAOV);

            return {
                totalRevenue: currentRevenue,
                revenueGrowth,
                totalOrders: currentOrders,
                ordersGrowth,
                totalUsers: currentUsers,
                usersGrowth,
                averageOrderValue: currentAOV,
                aovGrowth,
                conversionRate: currentConversion,
                activeMerchants,
                topProducts,
                topMerchants,
                revenueChart,
                ordersChart,
            };
        } catch (error) {
            this.logger.error(`Failed to get analytics overview: ${error.message}`, error.stack);
            throw error;
        }
    }

    // =============== HELPER METHODS ===============

    private async calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { totalAmount: true },
        });

        return Number(result._sum.totalAmount || 0);
    }

    private async calculateTotalOrders(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.order.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
        });
    }

    private async calculateTotalUsers(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateActiveUsers(startDate: Date, endDate: Date): Promise<number> {
        const uniqueUsers = await this.prisma.analyticsSession.findMany({
            where: {
                startTime: { gte: startDate, lte: endDate },
                userId: { not: null },
            },
            select: { userId: true },
            distinct: ['userId'],
        });

        return uniqueUsers.length;
    }

    private async calculateNewUsers(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateActiveMerchants(startDate: Date, endDate: Date): Promise<number> {
        const uniqueMerchants = await this.prisma.orderItem.findMany({
            where: {
                order: {
                    createdAt: { gte: startDate, lte: endDate },
                },
                productId: { not: null },
            },
            include: { product: { select: { merchantId: true } } },
            distinct: ['productId'],
        });

        // Extract unique merchant IDs
        const merchantIds = new Set(
            uniqueMerchants
                .map(item => item.product?.merchantId)
                .filter(id => id != null)
        );

        return merchantIds.size;
    }

    private async calculateNewMerchants(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.merchant.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: 'APPROVED',
            },
        });
    }

    private async calculateTotalProducts(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.product.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateActiveProducts(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.product.count({
            where: {
                status: 'APPROVED',
                createdAt: { lte: endDate },
            },
        });
    }

    private async calculateProductViews(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'product_view',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateAddToCartEvents(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'add_to_cart',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateAverageOrderValue(startDate: Date, endDate: Date): Promise<number> {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _avg: { totalAmount: true },
        });

        return Number(result._avg.totalAmount || 0);
    }

    private async calculateConversionRate(startDate: Date, endDate: Date): Promise<number> {
        const [orders, sessions] = await Promise.all([
            this.calculateTotalOrders(startDate, endDate),
            this.prisma.analyticsSession.count({
                where: { startTime: { gte: startDate, lte: endDate } },
            }),
        ]);

        return sessions > 0 ? orders / sessions : 0;
    }

    private async getTopProductsByRevenue(startDate: Date, endDate: Date, limit: number) {
        const result = await this.prisma.orderItem.groupBy({
            by: ['productId', 'productName'],
            where: {
                order: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
            },
            _sum: { totalPrice: true },
            _count: { orderId: true },
            orderBy: { _sum: { totalPrice: 'desc' } },
            take: limit,
        });

        return result.map(item => ({
            productId: item.productId || 'unknown',
            productName: item.productName || 'Unknown Product',
            revenue: Number(item._sum.totalPrice || 0),
            orders: item._count.orderId,
        }));
    }

    private async getTopMerchantsByRevenue(startDate: Date, endDate: Date, limit: number) {
        // Get revenue by merchant through order items
        const result = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            where: {
                order: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
            },
            _sum: { totalPrice: true },
            _count: { orderId: true },
        });

        // Get product-merchant mapping
        const productIds = result.map(item => item.productId).filter(id => id != null) as string[];
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, merchantId: true, merchant: { select: { name: true } } },
        });

        const productMerchantMap = new Map(
            products.map(p => [p.id, { merchantId: p.merchantId, merchantName: p.merchant.name }])
        );

        // Aggregate by merchant
        const merchantRevenue = new Map<string, { revenue: number; orders: number; name: string }>();

        for (const item of result) {
            if (!item.productId) continue;

            const merchantInfo = productMerchantMap.get(item.productId);
            if (!merchantInfo || !merchantInfo.merchantId) continue;

            const existing = merchantRevenue.get(merchantInfo.merchantId) || {
                revenue: 0,
                orders: 0,
                name: merchantInfo.merchantName,
            };

            existing.revenue += Number(item._sum.totalPrice || 0);
            existing.orders += item._count.orderId;
            merchantRevenue.set(merchantInfo.merchantId, existing);
        }

        // Sort by revenue and take top N
        return Array.from(merchantRevenue.entries())
            .map(([merchantId, data]) => ({
                merchantId,
                merchantName: data.name,
                revenue: data.revenue,
                orders: data.orders,
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
    }

    private async getRevenueChart(startDate: Date, endDate: Date) {
        const metrics = await this.prisma.businessMetric.findMany({
            where: {
                name: 'core_metrics',
                date: { gte: startDate, lte: endDate },
                granularity: 'DAY',
            },
            select: { date: true, totalRevenue: true },
            orderBy: { date: 'asc' },
        });

        return metrics.map(metric => ({
            date: metric.date.toISOString().split('T')[0],
            revenue: Number(metric.totalRevenue || 0),
        }));
    }

    private async getOrdersChart(startDate: Date, endDate: Date) {
        const metrics = await this.prisma.businessMetric.findMany({
            where: {
                name: 'core_metrics',
                date: { gte: startDate, lte: endDate },
                granularity: 'DAY',
            },
            select: { date: true, totalOrders: true },
            orderBy: { date: 'asc' },
        });

        return metrics.map(metric => ({
            date: metric.date.toISOString().split('T')[0],
            orders: metric.totalOrders || 0,
        }));
    }

    private calculateGrowthPercentage(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }

    private generateDateRange(startDate: Date, endDate: Date, granularity: TimeGranularity): Date[] {
        const dates: Date[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            dates.push(new Date(current));

            switch (granularity) {
                case TimeGranularity.HOUR:
                    current.setHours(current.getHours() + 1);
                    break;
                case TimeGranularity.DAY:
                    current.setDate(current.getDate() + 1);
                    break;
                case TimeGranularity.WEEK:
                    current.setDate(current.getDate() + 7);
                    break;
                case TimeGranularity.MONTH:
                    current.setMonth(current.getMonth() + 1);
                    break;
                case TimeGranularity.QUARTER:
                    current.setMonth(current.getMonth() + 3);
                    break;
                case TimeGranularity.YEAR:
                    current.setFullYear(current.getFullYear() + 1);
                    break;
            }
        }

        return dates;
    }

    private getDateRange(date: Date, granularity: TimeGranularity): { startDate: Date; endDate: Date } {
        const startDate = new Date(date);
        const endDate = new Date(date);

        switch (granularity) {
            case TimeGranularity.HOUR:
                startDate.setMinutes(0, 0, 0);
                endDate.setMinutes(59, 59, 999);
                break;
            case TimeGranularity.DAY:
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case TimeGranularity.WEEK:
                const dayOfWeek = startDate.getDay();
                startDate.setDate(startDate.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case TimeGranularity.MONTH:
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(endDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case TimeGranularity.QUARTER:
                const quarter = Math.floor(startDate.getMonth() / 3);
                startDate.setMonth(quarter * 3, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(quarter * 3 + 3, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case TimeGranularity.YEAR:
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(11, 31);
                endDate.setHours(23, 59, 59, 999);
                break;
        }

        return { startDate, endDate };
    }

    private mapSessionToResponse(session: any): AnalyticsSessionResponseDto {
        return {
            id: session.id,
            sessionId: session.sessionId,
            userId: session.userId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            deviceType: session.deviceType,
            browserType: session.browserType,
            platform: session.platform,
            country: session.country,
            region: session.region,
            city: session.city,
            startTime: session.startTime,
            endTime: session.endTime,
            duration: session.duration,
            pageViews: session.pageViews,
            eventCount: session.eventCount,
            merchantId: session.merchantId,
            orderId: session.orderId,
            revenue: session.revenue ? Number(session.revenue) : undefined,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    }

    private mapEventToResponse(event: any): AnalyticsEventResponseDto {
        return {
            id: event.id,
            sessionId: event.sessionId,
            eventType: event.eventType,
            eventName: event.eventName,
            category: event.category,
            action: event.action,
            label: event.label,
            value: event.value ? Number(event.value) : undefined,
            userId: event.userId,
            merchantId: event.merchantId,
            productId: event.productId,
            orderId: event.orderId,
            pageUrl: event.pageUrl,
            pageTitle: event.pageTitle,
            referrer: event.referrer,
            properties: event.properties,
            timestamp: event.timestamp,
        };
    }

    private mapBusinessMetricToResponse(metric: any): BusinessMetricResponseDto {
        return {
            id: metric.id,
            name: metric.name,
            category: metric.category,
            description: metric.description,
            date: metric.date,
            granularity: metric.granularity,
            totalRevenue: metric.totalRevenue ? Number(metric.totalRevenue) : undefined,
            totalOrders: metric.totalOrders,
            totalUsers: metric.totalUsers,
            activeUsers: metric.activeUsers,
            newUsers: metric.newUsers,
            averageOrderValue: metric.averageOrderValue ? Number(metric.averageOrderValue) : undefined,
            conversionRate: metric.conversionRate ? Number(metric.conversionRate) : undefined,
            customerLifetimeValue: metric.customerLifetimeValue ? Number(metric.customerLifetimeValue) : undefined,
            activeMerchants: metric.activeMerchants,
            newMerchants: metric.newMerchants,
            merchantRevenue: metric.merchantRevenue ? Number(metric.merchantRevenue) : undefined,
            averageOrdersPerMerchant: metric.averageOrdersPerMerchant ? Number(metric.averageOrdersPerMerchant) : undefined,
            totalProducts: metric.totalProducts,
            activeProducts: metric.activeProducts,
            productViews: metric.productViews,
            addToCartRate: metric.addToCartRate ? Number(metric.addToCartRate) : undefined,
            averageFulfillmentTime: metric.averageFulfillmentTime ? Number(metric.averageFulfillmentTime) : undefined,
            shippingCost: metric.shippingCost ? Number(metric.shippingCost) : undefined,
            returnRate: metric.returnRate ? Number(metric.returnRate) : undefined,
            customerSatisfaction: metric.customerSatisfaction ? Number(metric.customerSatisfaction) : undefined,
            customMetrics: metric.customMetrics,
            createdAt: metric.createdAt,
        };
    }
}
