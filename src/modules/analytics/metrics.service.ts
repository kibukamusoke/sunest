import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MetricType, TimeGranularity, Prisma } from '@prisma/client';
import {
    CreateMetricDto,
    UpdateMetricDto,
    MetricResponseDto,
    MetricListQueryDto,
    MetricListResponseDto,
    CreateDataPointDto,
    DataPointResponseDto,
    MetricDataQueryDto,
    MetricDataResponseDto,
} from './dto/metric.dto';

@Injectable()
export class MetricsService {
    private readonly logger = new Logger(MetricsService.name);

    constructor(private prisma: PrismaService) { }

    // =============== METRIC MANAGEMENT ===============

    async createMetric(data: CreateMetricDto): Promise<MetricResponseDto> {
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
        } catch (error) {
            this.logger.error(`Failed to create metric: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getMetrics(query: MetricListQueryDto): Promise<MetricListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.AnalyticsMetricWhereInput = {};

        if (query.type) where.type = query.type;
        if (query.category) where.category = query.category;
        if (query.isActive !== undefined) where.isActive = query.isActive;
        if (query.isRealTime !== undefined) where.isRealTime = query.isRealTime;
        if (query.tag) where.tags = { has: query.tag };

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

    async getMetric(metricId: string): Promise<MetricResponseDto | null> {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });

        return metric ? this.mapMetricToResponse(metric) : null;
    }

    async updateMetric(metricId: string, data: UpdateMetricDto): Promise<MetricResponseDto> {
        const metric = await this.prisma.analyticsMetric.update({
            where: { id: metricId },
            data,
        });

        return this.mapMetricToResponse(metric);
    }

    async deleteMetric(metricId: string): Promise<void> {
        await this.prisma.analyticsMetric.delete({
            where: { id: metricId },
        });
    }

    // =============== DATA POINT MANAGEMENT ===============

    async createDataPoint(data: CreateDataPointDto): Promise<DataPointResponseDto> {
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
        } catch (error) {
            this.logger.error(`Failed to create data point: ${error.message}`, error.stack);
            throw error;
        }
    }

    async createBulkDataPoints(dataPoints: CreateDataPointDto[]): Promise<void> {
        try {
            await this.prisma.metricDataPoint.createMany({
                data: dataPoints.map(dp => ({
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
        } catch (error) {
            this.logger.error(`Failed to create bulk data points: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getMetricData(metricId: string, query: MetricDataQueryDto): Promise<MetricDataResponseDto> {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });

        if (!metric) {
            throw new Error('Metric not found');
        }

        const where: Prisma.MetricDataPointWhereInput = {
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
            // Add dimension filters
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

        // Group by dimensions if requested
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

    // =============== METRIC CALCULATION ===============

    async calculateMetric(metricId: string, startDate: Date, endDate: Date): Promise<void> {
        const metric = await this.prisma.analyticsMetric.findUnique({
            where: { id: metricId },
        });

        if (!metric) {
            throw new Error('Metric not found');
        }

        try {
            let value: number;

            switch (metric.type) {
                case MetricType.SALES_REVENUE:
                    value = await this.calculateSalesRevenue(startDate, endDate);
                    break;
                case MetricType.ORDER_COUNT:
                    value = await this.calculateOrderCount(startDate, endDate);
                    break;
                case MetricType.USER_REGISTRATIONS:
                    value = await this.calculateUserRegistrations(startDate, endDate);
                    break;
                case MetricType.PRODUCT_VIEWS:
                    value = await this.calculateProductViews(startDate, endDate);
                    break;
                case MetricType.SEARCH_QUERIES:
                    value = await this.calculateSearchQueries(startDate, endDate);
                    break;
                case MetricType.CONVERSION_RATE:
                    value = await this.calculateConversionRate(startDate, endDate);
                    break;
                case MetricType.CART_ABANDONMENT:
                    value = await this.calculateCartAbandonmentRate(startDate, endDate);
                    break;
                case MetricType.AVERAGE_ORDER_VALUE:
                    value = await this.calculateAverageOrderValue(startDate, endDate);
                    break;
                case MetricType.CUSTOMER_LIFETIME_VALUE:
                    value = await this.calculateCustomerLifetimeValue(startDate, endDate);
                    break;
                case MetricType.FULFILLMENT_TIME:
                    value = await this.calculateAverageFulfillmentTime(startDate, endDate);
                    break;
                default:
                    this.logger.warn(`Metric type ${metric.type} calculation not implemented`);
                    return;
            }

            // Create data point
            await this.createDataPoint({
                metricId,
                value,
                timestamp: new Date(),
                granularity: TimeGranularity.DAY,
            });

            this.logger.log(`Calculated metric ${metric.name}: ${value}`);
        } catch (error) {
            this.logger.error(`Failed to calculate metric ${metric.name}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async calculateAllMetrics(startDate: Date, endDate: Date): Promise<void> {
        const metrics = await this.prisma.analyticsMetric.findMany({
            where: { isActive: true },
        });

        for (const metric of metrics) {
            try {
                await this.calculateMetric(metric.id, startDate, endDate);
            } catch (error) {
                this.logger.error(`Failed to calculate metric ${metric.name}: ${error.message}`);
            }
        }
    }

    // =============== METRIC CALCULATIONS ===============

    private async calculateSalesRevenue(startDate: Date, endDate: Date): Promise<number> {
        const result = await this.prisma.order.aggregate({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { totalAmount: true },
        });

        return Number(result._sum.totalAmount || 0);
    }

    private async calculateOrderCount(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.order.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            },
        });
    }

    private async calculateUserRegistrations(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.user.count({
            where: {
                createdAt: { gte: startDate, lte: endDate },
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

    private async calculateSearchQueries(startDate: Date, endDate: Date): Promise<number> {
        return this.prisma.analyticsEvent.count({
            where: {
                eventType: 'search',
                timestamp: { gte: startDate, lte: endDate },
            },
        });
    }

    private async calculateConversionRate(startDate: Date, endDate: Date): Promise<number> {
        const [orders, sessions] = await Promise.all([
            this.calculateOrderCount(startDate, endDate),
            this.prisma.analyticsSession.count({
                where: { startTime: { gte: startDate, lte: endDate } },
            }),
        ]);

        return sessions > 0 ? (orders / sessions) * 100 : 0;
    }

    private async calculateCartAbandonmentRate(startDate: Date, endDate: Date): Promise<number> {
        const [addToCartEvents, orders] = await Promise.all([
            this.prisma.analyticsEvent.count({
                where: {
                    eventType: 'add_to_cart',
                    timestamp: { gte: startDate, lte: endDate },
                },
            }),
            this.calculateOrderCount(startDate, endDate),
        ]);

        return addToCartEvents > 0 ? ((addToCartEvents - orders) / addToCartEvents) * 100 : 0;
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

    private async calculateCustomerLifetimeValue(startDate: Date, endDate: Date): Promise<number> {
        // Simplified CLV calculation: average order value * average order frequency
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
        return aov * avgOrderFreq * 12; // Annualized
    }

    private async calculateAverageFulfillmentTime(startDate: Date, endDate: Date): Promise<number> {
        const fulfillments = await this.prisma.fulfillment.findMany({
            where: {
                startedAt: { gte: startDate, lte: endDate },
                completedAt: { not: null },
            },
            select: { startedAt: true, completedAt: true },
        });

        if (fulfillments.length === 0) return 0;

        const totalTime = fulfillments.reduce((sum, f) => {
            if (f.startedAt && f.completedAt) {
                return sum + (f.completedAt.getTime() - f.startedAt.getTime());
            }
            return sum;
        }, 0);

        return totalTime / fulfillments.length / (1000 * 60 * 60); // Convert to hours
    }

    // =============== HELPER METHODS ===============

    private groupDataPoints(dataPoints: any[], groupBy: string[]): any[] {
        const groups = new Map();

        for (const point of dataPoints) {
            const key = groupBy.map(field => point.dimensions?.[field] || 'unknown').join('|');

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

        return Array.from(groups.values()).map(group => ({
            ...group,
            value: group.value / group.count, // Average
        }));
    }

    private mapMetricToResponse(metric: any): MetricResponseDto {
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

    private mapDataPointToResponse(dataPoint: any): DataPointResponseDto {
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
}
