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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async createSession(data) {
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
        }
        catch (error) {
            this.logger.error(`Failed to create analytics session: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateSession(sessionId, data) {
        try {
            const updateData = {};
            if (data.endTime)
                updateData.endTime = new Date(data.endTime);
            if (data.duration !== undefined)
                updateData.duration = data.duration;
            if (data.pageViews !== undefined)
                updateData.pageViews = data.pageViews;
            if (data.eventCount !== undefined)
                updateData.eventCount = data.eventCount;
            if (data.orderId)
                updateData.orderId = data.orderId;
            if (data.revenue !== undefined)
                updateData.revenue = data.revenue;
            const session = await this.prisma.analyticsSession.update({
                where: { sessionId },
                data: updateData,
            });
            return this.mapSessionToResponse(session);
        }
        catch (error) {
            this.logger.error(`Failed to update analytics session: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getSession(sessionId) {
        const session = await this.prisma.analyticsSession.findUnique({
            where: { sessionId },
        });
        return session ? this.mapSessionToResponse(session) : null;
    }
    async getSessions(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
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
    async createEvent(data) {
        try {
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
            await this.prisma.analyticsSession.update({
                where: { sessionId: data.sessionId },
                data: { eventCount: { increment: 1 } },
            });
            return this.mapEventToResponse(event);
        }
        catch (error) {
            this.logger.error(`Failed to create analytics event: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getEvents(sessionId) {
        const events = await this.prisma.analyticsEvent.findMany({
            where: { sessionId },
            orderBy: { timestamp: 'asc' },
        });
        return events.map(this.mapEventToResponse);
    }
    async getEventsByType(eventType, query) {
        const where = { eventType };
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
    async getBusinessMetrics(query) {
        const where = {};
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
    async calculateBusinessMetrics(startDate, endDate, granularity = client_1.TimeGranularity.DAY) {
        try {
            this.logger.log(`Calculating business metrics for ${startDate} to ${endDate}`);
            const dates = this.generateDateRange(startDate, endDate, granularity);
            for (const date of dates) {
                await this.calculateMetricsForDate(date, granularity);
            }
            this.logger.log('Business metrics calculation completed');
        }
        catch (error) {
            this.logger.error(`Failed to calculate business metrics: ${error.message}`, error.stack);
            throw error;
        }
    }
    async calculateMetricsForDate(date, granularity) {
        const { startDate, endDate } = this.getDateRange(date, granularity);
        const [totalRevenue, totalOrders, totalUsers, activeUsers, newUsers, activeMerchants, newMerchants, totalProducts, activeProducts, productViews,] = await Promise.all([
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
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const conversionRate = totalUsers > 0 ? totalOrders / totalUsers : 0;
        const addToCartRate = productViews > 0
            ? (await this.calculateAddToCartEvents(startDate, endDate)) /
                productViews
            : 0;
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
    async getAnalyticsOverview(startDate, endDate, previousStartDate, previousEndDate) {
        try {
            const [currentRevenue, currentOrders, currentUsers, currentAOV, currentConversion, activeMerchants, topProducts, topMerchants, revenueChart, ordersChart,] = await Promise.all([
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
            const [previousRevenue, previousOrders, previousUsers, previousAOV] = await Promise.all([
                this.calculateTotalRevenue(previousStartDate, previousEndDate),
                this.calculateTotalOrders(previousStartDate, previousEndDate),
                this.calculateTotalUsers(previousStartDate, previousEndDate),
                this.calculateAverageOrderValue(previousStartDate, previousEndDate),
            ]);
            const revenueGrowth = this.calculateGrowthPercentage(currentRevenue, previousRevenue);
            const ordersGrowth = this.calculateGrowthPercentage(currentOrders, previousOrders);
            const usersGrowth = this.calculateGrowthPercentage(currentUsers, previousUsers);
            const aovGrowth = this.calculateGrowthPercentage(currentAOV, previousAOV);
            return {
                revenue: currentRevenue,
                revenueGrowth,
                orders: currentOrders,
                ordersGrowth,
                activeUsers: currentUsers,
                newUsers: currentUsers,
                averageOrderValue: currentAOV,
                averageOrderValueGrowth: aovGrowth,
                conversionRate: currentConversion,
                conversionRateGrowth: 0,
                activeMerchants,
                topProducts,
                topMerchants,
                revenueChart,
                ordersChart,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get analytics overview: ${error.message}`, error.stack);
            throw error;
        }
    }
    async calculateTotalRevenue(startDate, endDate) {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { totalAmount: true },
        });
        return Number(result._sum.totalAmount || 0);
    }
    async calculateTotalOrders(startDate, endDate) {
        return this.prisma.order.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
        });
    }
    async calculateTotalUsers(startDate, endDate) {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateActiveUsers(startDate, endDate) {
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
    async calculateNewUsers(startDate, endDate) {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateActiveMerchants(startDate, endDate) {
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
        const merchantIds = new Set(uniqueMerchants
            .map((item) => item.product?.merchantId)
            .filter((id) => id != null));
        return merchantIds.size;
    }
    async calculateNewMerchants(startDate, endDate) {
        return this.prisma.merchant.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: 'APPROVED',
            },
        });
    }
    async calculateTotalProducts(startDate, endDate) {
        return this.prisma.product.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateActiveProducts(startDate, endDate) {
        return this.prisma.product.count({
            where: {
                status: 'APPROVED',
                createdAt: { lte: endDate },
            },
        });
    }
    async calculateProductViews(startDate, endDate) {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'product_view',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateAddToCartEvents(startDate, endDate) {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'add_to_cart',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateAverageOrderValue(startDate, endDate) {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _avg: { totalAmount: true },
        });
        return Number(result._avg.totalAmount || 0);
    }
    async calculateConversionRate(startDate, endDate) {
        const [orders, sessions] = await Promise.all([
            this.calculateTotalOrders(startDate, endDate),
            this.prisma.analyticsSession.count({
                where: { startTime: { gte: startDate, lte: endDate } },
            }),
        ]);
        return sessions > 0 ? orders / sessions : 0;
    }
    async getTopProductsByRevenue(startDate, endDate, limit) {
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
        return result.map((item) => ({
            productId: item.productId || 'unknown',
            productName: item.productName || 'Unknown Product',
            revenue: Number(item._sum.totalPrice || 0),
            orders: item._count.orderId,
        }));
    }
    async getTopMerchantsByRevenue(startDate, endDate, limit) {
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
        const productIds = result
            .map((item) => item.productId)
            .filter((id) => id != null);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: {
                id: true,
                merchantId: true,
                merchant: { select: { name: true } },
            },
        });
        const productMerchantMap = new Map(products.map((p) => [
            p.id,
            { merchantId: p.merchantId, merchantName: p.merchant.name },
        ]));
        const merchantRevenue = new Map();
        for (const item of result) {
            if (!item.productId)
                continue;
            const merchantInfo = productMerchantMap.get(item.productId);
            if (!merchantInfo || !merchantInfo.merchantId)
                continue;
            const existing = merchantRevenue.get(merchantInfo.merchantId) || {
                revenue: 0,
                orders: 0,
                name: merchantInfo.merchantName,
            };
            existing.revenue += Number(item._sum.totalPrice || 0);
            existing.orders += item._count.orderId;
            merchantRevenue.set(merchantInfo.merchantId, existing);
        }
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
    async getRevenueChart(startDate, endDate) {
        const metrics = await this.prisma.businessMetric.findMany({
            where: {
                name: 'core_metrics',
                date: { gte: startDate, lte: endDate },
                granularity: 'DAY',
            },
            select: { date: true, totalRevenue: true },
            orderBy: { date: 'asc' },
        });
        return metrics.map((metric) => ({
            date: metric.date.toISOString().split('T')[0],
            revenue: Number(metric.totalRevenue || 0),
        }));
    }
    async getOrdersChart(startDate, endDate) {
        const metrics = await this.prisma.businessMetric.findMany({
            where: {
                name: 'core_metrics',
                date: { gte: startDate, lte: endDate },
                granularity: 'DAY',
            },
            select: { date: true, totalOrders: true },
            orderBy: { date: 'asc' },
        });
        return metrics.map((metric) => ({
            date: metric.date.toISOString().split('T')[0],
            orders: metric.totalOrders || 0,
        }));
    }
    calculateGrowthPercentage(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
    generateDateRange(startDate, endDate, granularity) {
        const dates = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            dates.push(new Date(current));
            switch (granularity) {
                case client_1.TimeGranularity.HOUR:
                    current.setHours(current.getHours() + 1);
                    break;
                case client_1.TimeGranularity.DAY:
                    current.setDate(current.getDate() + 1);
                    break;
                case client_1.TimeGranularity.WEEK:
                    current.setDate(current.getDate() + 7);
                    break;
                case client_1.TimeGranularity.MONTH:
                    current.setMonth(current.getMonth() + 1);
                    break;
                case client_1.TimeGranularity.QUARTER:
                    current.setMonth(current.getMonth() + 3);
                    break;
                case client_1.TimeGranularity.YEAR:
                    current.setFullYear(current.getFullYear() + 1);
                    break;
            }
        }
        return dates;
    }
    getDateRange(date, granularity) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        switch (granularity) {
            case client_1.TimeGranularity.HOUR:
                startDate.setMinutes(0, 0, 0);
                endDate.setMinutes(59, 59, 999);
                break;
            case client_1.TimeGranularity.DAY:
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case client_1.TimeGranularity.WEEK:
                const dayOfWeek = startDate.getDay();
                startDate.setDate(startDate.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case client_1.TimeGranularity.MONTH:
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(endDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case client_1.TimeGranularity.QUARTER:
                const quarter = Math.floor(startDate.getMonth() / 3);
                startDate.setMonth(quarter * 3, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(quarter * 3 + 3, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case client_1.TimeGranularity.YEAR:
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(11, 31);
                endDate.setHours(23, 59, 59, 999);
                break;
        }
        return { startDate, endDate };
    }
    mapSessionToResponse(session) {
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
    mapEventToResponse(event) {
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
    mapBusinessMetricToResponse(metric) {
        return {
            id: metric.id,
            name: metric.name,
            category: metric.category,
            description: metric.description,
            date: metric.date,
            granularity: metric.granularity,
            totalRevenue: metric.totalRevenue
                ? Number(metric.totalRevenue)
                : undefined,
            totalOrders: metric.totalOrders,
            totalUsers: metric.totalUsers,
            activeUsers: metric.activeUsers,
            newUsers: metric.newUsers,
            averageOrderValue: metric.averageOrderValue
                ? Number(metric.averageOrderValue)
                : undefined,
            conversionRate: metric.conversionRate
                ? Number(metric.conversionRate)
                : undefined,
            customerLifetimeValue: metric.customerLifetimeValue
                ? Number(metric.customerLifetimeValue)
                : undefined,
            activeMerchants: metric.activeMerchants,
            newMerchants: metric.newMerchants,
            merchantRevenue: metric.merchantRevenue
                ? Number(metric.merchantRevenue)
                : undefined,
            averageOrdersPerMerchant: metric.averageOrdersPerMerchant
                ? Number(metric.averageOrdersPerMerchant)
                : undefined,
            totalProducts: metric.totalProducts,
            activeProducts: metric.activeProducts,
            productViews: metric.productViews,
            addToCartRate: metric.addToCartRate
                ? Number(metric.addToCartRate)
                : undefined,
            averageFulfillmentTime: metric.averageFulfillmentTime
                ? Number(metric.averageFulfillmentTime)
                : undefined,
            shippingCost: metric.shippingCost
                ? Number(metric.shippingCost)
                : undefined,
            returnRate: metric.returnRate ? Number(metric.returnRate) : undefined,
            customerSatisfaction: metric.customerSatisfaction
                ? Number(metric.customerSatisfaction)
                : undefined,
            customMetrics: metric.customMetrics,
            createdAt: metric.createdAt,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map