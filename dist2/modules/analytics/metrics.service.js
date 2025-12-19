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
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
let MetricsService = MetricsService_1 = class MetricsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MetricsService_1.name);
    }
    async createMetric(data) {
        try {
            const metric = await this.prisma.analyticsMetric.create({
                data: {
                    name: data.name,
                    type: data.type,
                    description: data.description,
                    unit: data.unit,
                    formula: data.formula,
                    dataSource: data.dataSource,
                    refreshRate: data.refreshRate,
                    category: data.category,
                    tags: data.tags || [],
                    isRealTime: data.isRealTime || false,
                },
            });
            return this.mapMetricToResponse(metric);
        }
        catch (error) {
            this.logger.error(`Failed to create metric: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getMetrics(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.type)
            where.type = query.type;
        if (query.category)
            where.category = query.category;
        if (query.isActive !== undefined)
            where.isActive = query.isActive;
        if (query.isRealTime !== undefined)
            where.isRealTime = query.isRealTime;
        if (query.tag)
            where.tags = { has: query.tag };
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [metrics, total] = await Promise.all([
            this.prisma.analyticsMetric.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.analyticsMetric.count({ where }),
        ]);
        return {
            metrics: metrics.map(this.mapMetricToResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getMetric(metricId) {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });
        return metric ? this.mapMetricToResponse(metric) : null;
    }
    async updateMetric(metricId, data) {
        const metric = await this.prisma.analyticsMetric.update({
            where: { id: metricId },
            data,
        });
        return this.mapMetricToResponse(metric);
    }
    async deleteMetric(metricId) {
        await this.prisma.analyticsMetric.delete({
            where: { id: metricId },
        });
    }
    async createDataPoint(data) {
        try {
            const dataPoint = await this.prisma.metricDataPoint.create({
                data: {
                    metricId: data.metricId,
                    value: data.value,
                    timestamp: data.timestamp,
                    granularity: data.granularity,
                    dimensions: data.dimensions,
                    userId: data.userId,
                    merchantId: data.merchantId,
                    productId: data.productId,
                    orderId: data.orderId,
                },
            });
            return this.mapDataPointToResponse(dataPoint);
        }
        catch (error) {
            this.logger.error(`Failed to create data point: ${error.message}`, error.stack);
            throw error;
        }
    }
    async createBulkDataPoints(dataPoints) {
        try {
            await this.prisma.metricDataPoint.createMany({
                data: dataPoints.map((dp) => ({
                    metricId: dp.metricId,
                    value: dp.value,
                    timestamp: dp.timestamp,
                    granularity: dp.granularity,
                    dimensions: dp.dimensions,
                    userId: dp.userId,
                    merchantId: dp.merchantId,
                    productId: dp.productId,
                    orderId: dp.orderId,
                })),
            });
            this.logger.log(`Created ${dataPoints.length} data points`);
        }
        catch (error) {
            this.logger.error(`Failed to create bulk data points: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getMetricData(metricId, query) {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });
        if (!metric) {
            throw new Error('Metric not found');
        }
        const where = {
            metricId,
            timestamp: {
                gte: new Date(query.startDate),
                lte: new Date(query.endDate),
            },
        };
        if (query.granularity) {
            where.granularity = query.granularity;
        }
        if (query.filters) {
            where.dimensions = {
                path: Object.keys(query.filters),
                equals: Object.values(query.filters),
            };
        }
        const dataPoints = await this.prisma.metricDataPoint.findMany({
            where,
            orderBy: { timestamp: 'asc' },
        });
        let processedDataPoints = dataPoints;
        if (query.groupBy && query.groupBy.length > 0) {
            processedDataPoints = this.groupDataPoints(dataPoints, query.groupBy);
        }
        return {
            metricId,
            metricName: metric.name,
            dataPoints: processedDataPoints.map(this.mapDataPointToResponse),
            query,
            totalPoints: dataPoints.length,
        };
    }
    async calculateMetric(metricId, startDate, endDate) {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });
        if (!metric) {
            throw new Error('Metric not found');
        }
        try {
            let value;
            switch (metric.type) {
                case client_1.MetricType.SALES_REVENUE:
                    value = await this.calculateSalesRevenue(startDate, endDate);
                    break;
                case client_1.MetricType.ORDER_COUNT:
                    value = await this.calculateOrderCount(startDate, endDate);
                    break;
                case client_1.MetricType.USER_REGISTRATIONS:
                    value = await this.calculateUserRegistrations(startDate, endDate);
                    break;
                case client_1.MetricType.PRODUCT_VIEWS:
                    value = await this.calculateProductViews(startDate, endDate);
                    break;
                case client_1.MetricType.SEARCH_QUERIES:
                    value = await this.calculateSearchQueries(startDate, endDate);
                    break;
                case client_1.MetricType.CONVERSION_RATE:
                    value = await this.calculateConversionRate(startDate, endDate);
                    break;
                case client_1.MetricType.CART_ABANDONMENT:
                    value = await this.calculateCartAbandonmentRate(startDate, endDate);
                    break;
                case client_1.MetricType.AVERAGE_ORDER_VALUE:
                    value = await this.calculateAverageOrderValue(startDate, endDate);
                    break;
                case client_1.MetricType.CUSTOMER_LIFETIME_VALUE:
                    value = await this.calculateCustomerLifetimeValue(startDate, endDate);
                    break;
                case client_1.MetricType.FULFILLMENT_TIME:
                    value = await this.calculateAverageFulfillmentTime(startDate, endDate);
                    break;
                default:
                    this.logger.warn(`Metric type ${metric.type} calculation not implemented`);
                    return;
            }
            await this.createDataPoint({
                metricId,
                value,
                timestamp: new Date(),
                granularity: client_1.TimeGranularity.DAY,
            });
            this.logger.log(`Calculated metric ${metric.name}: ${value}`);
        }
        catch (error) {
            this.logger.error(`Failed to calculate metric ${metric.name}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async calculateAllMetrics(startDate, endDate) {
        const metrics = await this.prisma.analyticsMetric.findMany({
            where: { isActive: true },
        });
        for (const metric of metrics) {
            try {
                await this.calculateMetric(metric.id, startDate, endDate);
            }
            catch (error) {
                this.logger.error(`Failed to calculate metric ${metric.name}: ${error.message}`);
            }
        }
    }
    async calculateSalesRevenue(startDate, endDate) {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { totalAmount: true },
        });
        return Number(result._sum.totalAmount || 0);
    }
    async calculateOrderCount(startDate, endDate) {
        return this.prisma.order.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
        });
    }
    async calculateUserRegistrations(startDate, endDate) {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
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
    async calculateSearchQueries(startDate, endDate) {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'search',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }
    async calculateConversionRate(startDate, endDate) {
        const [orders, sessions] = await Promise.all([
            this.calculateOrderCount(startDate, endDate),
            this.prisma.analyticsSession.count({
                where: { startTime: { gte: startDate, lte: endDate } },
            }),
        ]);
        return sessions > 0 ? (orders / sessions) * 100 : 0;
    }
    async calculateCartAbandonmentRate(startDate, endDate) {
        const [addToCartEvents, orders] = await Promise.all([
            this.prisma.analyticsEvent.count({
                where: {
                    eventType: 'add_to_cart',
                    timestamp: { gte: startDate, lte: endDate },
                },
            }),
            this.calculateOrderCount(startDate, endDate),
        ]);
        return addToCartEvents > 0
            ? ((addToCartEvents - orders) / addToCartEvents) * 100
            : 0;
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
    async calculateCustomerLifetimeValue(startDate, endDate) {
        const aov = await this.calculateAverageOrderValue(startDate, endDate);
        const totalOrders = await this.calculateOrderCount(startDate, endDate);
        const uniqueCustomers = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            },
            select: { userId: true },
            distinct: ['userId'],
        });
        const avgOrderFreq = uniqueCustomers.length > 0 ? totalOrders / uniqueCustomers.length : 0;
        return aov * avgOrderFreq * 12;
    }
    async calculateAverageFulfillmentTime(startDate, endDate) {
        const fulfillments = await this.prisma.fulfillment.findMany({
            where: {
                startedAt: { gte: startDate, lte: endDate },
                completedAt: { not: null },
            },
            select: { startedAt: true, completedAt: true },
        });
        if (fulfillments.length === 0)
            return 0;
        const totalTime = fulfillments.reduce((sum, f) => {
            if (f.startedAt && f.completedAt) {
                return sum + (f.completedAt.getTime() - f.startedAt.getTime());
            }
            return sum;
        }, 0);
        return totalTime / fulfillments.length / (1000 * 60 * 60);
    }
    groupDataPoints(dataPoints, groupBy) {
        const groups = new Map();
        for (const point of dataPoints) {
            const key = groupBy
                .map((field) => point.dimensions?.[field] || 'unknown')
                .join('|');
            if (!groups.has(key)) {
                groups.set(key, {
                    ...point,
                    value: 0,
                    count: 0,
                });
            }
            const group = groups.get(key);
            group.value += Number(point.value);
            group.count += 1;
        }
        return Array.from(groups.values()).map((group) => ({
            ...group,
            value: group.value / group.count,
        }));
    }
    mapMetricToResponse(metric) {
        return {
            id: metric.id,
            name: metric.name,
            type: metric.type,
            description: metric.description,
            unit: metric.unit,
            formula: metric.formula,
            dataSource: metric.dataSource,
            refreshRate: metric.refreshRate,
            isActive: metric.isActive,
            isRealTime: metric.isRealTime,
            category: metric.category,
            tags: metric.tags,
            createdAt: metric.createdAt,
            updatedAt: metric.updatedAt,
        };
    }
    mapDataPointToResponse(dataPoint) {
        return {
            id: dataPoint.id,
            metricId: dataPoint.metricId,
            value: Number(dataPoint.value),
            timestamp: dataPoint.timestamp,
            granularity: dataPoint.granularity,
            dimensions: dataPoint.dimensions,
            userId: dataPoint.userId,
            merchantId: dataPoint.merchantId,
            productId: dataPoint.productId,
            orderId: dataPoint.orderId,
            createdAt: dataPoint.createdAt,
        };
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map