import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { DashboardType, ChartType, Prisma } from '@prisma/client';
import {
    CreateDashboardDto,
    UpdateDashboardDto,
    DashboardResponseDto,
    DashboardListQueryDto,
    DashboardListResponseDto,
    CreateWidgetDto,
    UpdateWidgetDto,
    WidgetResponseDto,
    DashboardWithWidgetsDto,
    WidgetDataDto,
} from './dto/dashboard.dto';
import { MetricsService } from './metrics.service';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        private prisma: PrismaService,
        private metricsService: MetricsService,
        private analyticsService: AnalyticsService,
    ) { }

    // =============== DASHBOARD MANAGEMENT ===============

    async createDashboard(userId: string, data: CreateDashboardDto): Promise<DashboardResponseDto> {
        try {
            const dashboard = await this.prisma.dashboard.create({
                data: {
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    layout: data.layout || {},
                    ownerId: userId,
                    isPublic: data.isPublic || false,
                    sharedWith: data.sharedWith || [],
                    allowedRoles: data.allowedRoles || [],
                    refreshRate: data.refreshRate || 300,
                    timezone: data.timezone || 'UTC',
                    dateRange: data.dateRange,
                    autoRefresh: data.autoRefresh || false,
                    tags: data.tags || [],
                    isTemplate: data.isTemplate || false,
                    templateSource: data.templateSource,
                },
            });

            return this.mapDashboardToResponse(dashboard);
        } catch (error) {
            this.logger.error(`Failed to create dashboard: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getDashboards(userId: string, query: DashboardListQueryDto): Promise<DashboardListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.DashboardWhereInput = {
            OR: [
                { ownerId: userId },
                { isPublic: true },
                { sharedWith: { has: userId } },
            ],
        };

        if (query.type) where.type = query.type;
        if (query.isPublic !== undefined) where.isPublic = query.isPublic;
        if (query.isTemplate !== undefined) where.isTemplate = query.isTemplate;
        if (query.ownerId) where.ownerId = query.ownerId;
        if (query.tag) where.tags = { has: query.tag };

        if (query.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }

        const [dashboards, total] = await Promise.all([
            this.prisma.dashboard.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    _count: {
                        select: { widgets: true },
                    },
                },
            }),
            this.prisma.dashboard.count({ where }),
        ]);

        return {
            dashboards: dashboards.map(d => ({
                ...this.mapDashboardToResponse(d),
                widgetCount: d._count.widgets,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getDashboard(dashboardId: string, userId: string): Promise<DashboardWithWidgetsDto | null> {
        const dashboard = await this.prisma.dashboard.findFirst({
            where: {
                id: dashboardId,
                OR: [
                    { ownerId: userId },
                    { isPublic: true },
                    { sharedWith: { has: userId } },
                ],
            },
            include: {
                widgets: {
                    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });

        if (!dashboard) return null;

        return {
            ...this.mapDashboardToResponse(dashboard),
            widgets: dashboard.widgets.map(this.mapWidgetToResponse),
        };
    }

    async updateDashboard(
        dashboardId: string,
        userId: string,
        data: UpdateDashboardDto,
    ): Promise<DashboardResponseDto> {
        // Check permissions
        const dashboard = await this.prisma.dashboard.findFirst({
            where: {
                id: dashboardId,
                OR: [{ ownerId: userId }, { sharedWith: { has: userId } }],
            },
        });

        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }

        if (dashboard.ownerId !== userId) {
            throw new Error('Only dashboard owner can edit');
        }

        const updated = await this.prisma.dashboard.update({
            where: { id: dashboardId },
            data,
        });

        return this.mapDashboardToResponse(updated);
    }

    async deleteDashboard(dashboardId: string, userId: string): Promise<void> {
        const dashboard = await this.prisma.dashboard.findFirst({
            where: { id: dashboardId, ownerId: userId },
        });

        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }

        await this.prisma.dashboard.delete({
            where: { id: dashboardId },
        });
    }

    async duplicateDashboard(dashboardId: string, userId: string, name?: string): Promise<DashboardResponseDto> {
        const originalDashboard = await this.prisma.dashboard.findFirst({
            where: {
                id: dashboardId,
                OR: [
                    { ownerId: userId },
                    { isPublic: true },
                    { sharedWith: { has: userId } },
                ],
            },
            include: { widgets: true },
        });

        if (!originalDashboard) {
            throw new Error('Dashboard not found or access denied');
        }

        const newDashboard = await this.prisma.dashboard.create({
            data: {
                name: name || `${originalDashboard.name} (Copy)`,
                description: originalDashboard.description,
                type: originalDashboard.type,
                layout: originalDashboard.layout as any,
                ownerId: userId,
                isPublic: false,
                sharedWith: [],
                allowedRoles: originalDashboard.allowedRoles,
                refreshRate: originalDashboard.refreshRate,
                timezone: originalDashboard.timezone,
                dateRange: originalDashboard.dateRange as any,
                autoRefresh: originalDashboard.autoRefresh,
                tags: originalDashboard.tags,
                isTemplate: false,
                templateSource: originalDashboard.id,
            },
        });

        // Copy widgets
        for (const widget of originalDashboard.widgets) {
            await this.prisma.dashboardWidget.create({
                data: {
                    dashboardId: newDashboard.id,
                    title: widget.title,
                    type: widget.type,
                    description: widget.description,
                    position: widget.position as any,
                    order: widget.order,
                    metricId: widget.metricId,
                    dataQuery: widget.dataQuery as any,
                    chartConfig: widget.chartConfig as any,
                    filters: widget.filters as any,
                    refreshRate: widget.refreshRate,
                },
            });
        }

        return this.mapDashboardToResponse(newDashboard);
    }

    // =============== WIDGET MANAGEMENT ===============

    async createWidget(data: CreateWidgetDto): Promise<WidgetResponseDto> {
        try {
            const widget = await this.prisma.dashboardWidget.create({
                data: {
                    dashboardId: data.dashboardId,
                    title: data.title,
                    type: data.type,
                    description: data.description,
                    position: data.position,
                    order: data.order || 0,
                    metricId: data.metricId,
                    dataQuery: data.dataQuery,
                    chartConfig: data.chartConfig,
                    filters: data.filters,
                    refreshRate: data.refreshRate || 300,
                },
            });

            return this.mapWidgetToResponse(widget);
        } catch (error) {
            this.logger.error(`Failed to create widget: ${error.message}`, error.stack);
            throw error;
        }
    }

    async updateWidget(widgetId: string, data: UpdateWidgetDto): Promise<WidgetResponseDto> {
        const widget = await this.prisma.dashboardWidget.update({
            where: { id: widgetId },
            data,
        });

        return this.mapWidgetToResponse(widget);
    }

    async deleteWidget(widgetId: string): Promise<void> {
        await this.prisma.dashboardWidget.delete({
            where: { id: widgetId },
        });
    }

    async getWidgetData(widgetId: string): Promise<WidgetDataDto> {
        try {
            const widget = await this.prisma.dashboardWidget.findUnique({
                where: { id: widgetId },
                include: { metric: true },
            });

            if (!widget) {
                throw new Error('Widget not found');
            }

            let data: any;

            if (widget.metricId && widget.metric) {
                // Get metric data
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30); // Default to last 30 days

                const metricData = await this.metricsService.getMetricData(widget.metricId, {
                    startDate,
                    endDate,
                    filters: widget.filters as Record<string, any>,
                });

                data = this.formatDataForChart(metricData, widget.type);
            } else if (widget.dataQuery) {
                // Execute custom query
                data = await this.executeCustomQuery(widget.dataQuery);
            } else {
                data = null;
            }

            return {
                widgetId,
                data,
                timestamp: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to get widget data: ${error.message}`, error.stack);
            return {
                widgetId,
                data: null,
                timestamp: new Date(),
                error: error.message,
            };
        }
    }

    async getDashboardData(dashboardId: string, userId: string): Promise<WidgetDataDto[]> {
        const dashboard = await this.getDashboard(dashboardId, userId);
        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }

        const widgetDataPromises = dashboard.widgets.map(widget =>
            this.getWidgetData(widget.id)
        );

        return Promise.all(widgetDataPromises);
    }

    // =============== DASHBOARD TEMPLATES ===============

    async getTemplates(query: DashboardListQueryDto): Promise<DashboardListResponseDto> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.DashboardWhereInput = {
            isTemplate: true,
            isPublic: true,
        };

        if (query.type) where.type = query.type;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        const [templates, total] = await Promise.all([
            this.prisma.dashboard.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { widgets: true },
                    },
                },
            }),
            this.prisma.dashboard.count({ where }),
        ]);

        return {
            dashboards: templates.map(t => ({
                ...this.mapDashboardToResponse(t),
                widgetCount: t._count.widgets,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async createFromTemplate(templateId: string, userId: string, name: string): Promise<DashboardResponseDto> {
        return this.duplicateDashboard(templateId, userId, name);
    }

    // =============== HELPER METHODS ===============

    private formatDataForChart(metricData: any, chartType: ChartType): any {
        const dataPoints = metricData.dataPoints;

        switch (chartType) {
            case ChartType.LINE:
            case ChartType.AREA:
                return {
                    labels: dataPoints.map(dp => dp.timestamp),
                    datasets: [{
                        data: dataPoints.map(dp => dp.value),
                        label: metricData.metricName,
                    }],
                };

            case ChartType.BAR:
                return {
                    labels: dataPoints.map(dp => dp.timestamp),
                    datasets: [{
                        data: dataPoints.map(dp => dp.value),
                        label: metricData.metricName,
                    }],
                };

            case ChartType.PIE:
            case ChartType.DONUT:
                return {
                    labels: dataPoints.map((dp, index) => `Segment ${index + 1}`),
                    datasets: [{
                        data: dataPoints.map(dp => dp.value),
                    }],
                };

            case ChartType.GAUGE:
                const latestValue = dataPoints[dataPoints.length - 1]?.value || 0;
                return {
                    value: latestValue,
                    max: Math.max(...dataPoints.map(dp => dp.value)) * 1.2,
                };

            case ChartType.TABLE:
                return {
                    columns: ['Timestamp', 'Value'],
                    rows: dataPoints.map(dp => [dp.timestamp, dp.value]),
                };

            default:
                return dataPoints;
        }
    }

    private async executeCustomQuery(query: any): Promise<any> {
        // This would execute custom database queries
        // For now, return mock data
        this.logger.warn('Custom query execution not implemented');
        return { message: 'Custom query execution not implemented' };
    }

    private mapDashboardToResponse(dashboard: any): DashboardResponseDto {
        return {
            id: dashboard.id,
            name: dashboard.name,
            description: dashboard.description,
            type: dashboard.type,
            layout: dashboard.layout,
            ownerId: dashboard.ownerId,
            isPublic: dashboard.isPublic,
            sharedWith: dashboard.sharedWith,
            allowedRoles: dashboard.allowedRoles,
            refreshRate: dashboard.refreshRate,
            timezone: dashboard.timezone,
            dateRange: dashboard.dateRange,
            autoRefresh: dashboard.autoRefresh,
            isTemplate: dashboard.isTemplate,
            templateSource: dashboard.templateSource,
            tags: dashboard.tags,
            createdAt: dashboard.createdAt,
            updatedAt: dashboard.updatedAt,
        };
    }

    private mapWidgetToResponse(widget: any): WidgetResponseDto {
        return {
            id: widget.id,
            dashboardId: widget.dashboardId,
            title: widget.title,
            type: widget.type,
            description: widget.description,
            position: widget.position,
            order: widget.order,
            metricId: widget.metricId,
            dataQuery: widget.dataQuery,
            chartConfig: widget.chartConfig,
            filters: widget.filters,
            refreshRate: widget.refreshRate,
            isVisible: widget.isVisible,
            createdAt: widget.createdAt,
            updatedAt: widget.updatedAt,
        };
    }
}
