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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
const metrics_service_1 = require("./metrics.service");
const analytics_service_1 = require("./analytics.service");
let DashboardService = DashboardService_1 = class DashboardService {
    constructor(prisma, metricsService, analyticsService) {
        this.prisma = prisma;
        this.metricsService = metricsService;
        this.analyticsService = analyticsService;
        this.logger = new common_1.Logger(DashboardService_1.name);
    }
    async createDashboard(userId, data) {
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
        }
        catch (error) {
            this.logger.error(`Failed to create dashboard: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getDashboards(userId, query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            OR: [
                { ownerId: userId },
                { isPublic: true },
                { sharedWith: { has: userId } },
            ],
        };
        if (query.type)
            where.type = query.type;
        if (query.isPublic !== undefined)
            where.isPublic = query.isPublic;
        if (query.isTemplate !== undefined)
            where.isTemplate = query.isTemplate;
        if (query.ownerId)
            where.ownerId = query.ownerId;
        if (query.tag)
            where.tags = { has: query.tag };
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
            dashboards: dashboards.map((d) => ({
                ...this.mapDashboardToResponse(d),
                widgetCount: d._count.widgets,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDashboard(dashboardId, userId) {
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
        if (!dashboard)
            return null;
        return {
            ...this.mapDashboardToResponse(dashboard),
            widgets: dashboard.widgets.map(this.mapWidgetToResponse),
        };
    }
    async updateDashboard(dashboardId, userId, data) {
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
    async deleteDashboard(dashboardId, userId) {
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
    async duplicateDashboard(dashboardId, userId, name) {
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
                layout: originalDashboard.layout,
                ownerId: userId,
                isPublic: false,
                sharedWith: [],
                allowedRoles: originalDashboard.allowedRoles,
                refreshRate: originalDashboard.refreshRate,
                timezone: originalDashboard.timezone,
                dateRange: originalDashboard.dateRange,
                autoRefresh: originalDashboard.autoRefresh,
                tags: originalDashboard.tags,
                isTemplate: false,
                templateSource: originalDashboard.id,
            },
        });
        for (const widget of originalDashboard.widgets) {
            await this.prisma.dashboardWidget.create({
                data: {
                    dashboardId: newDashboard.id,
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
                },
            });
        }
        return this.mapDashboardToResponse(newDashboard);
    }
    async createWidget(data) {
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
        }
        catch (error) {
            this.logger.error(`Failed to create widget: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateWidget(widgetId, data) {
        const widget = await this.prisma.dashboardWidget.update({
            where: { id: widgetId },
            data,
        });
        return this.mapWidgetToResponse(widget);
    }
    async deleteWidget(widgetId) {
        await this.prisma.dashboardWidget.delete({
            where: { id: widgetId },
        });
    }
    async getWidgetData(widgetId) {
        try {
            const widget = await this.prisma.dashboardWidget.findUnique({
                where: { id: widgetId },
                include: { metric: true },
            });
            if (!widget) {
                throw new Error('Widget not found');
            }
            let data;
            if (widget.metricId && widget.metric) {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                const metricData = await this.metricsService.getMetricData(widget.metricId, {
                    startDate,
                    endDate,
                    filters: widget.filters,
                });
                data = this.formatDataForChart(metricData, widget.type);
            }
            else if (widget.dataQuery) {
                data = await this.executeCustomQuery(widget.dataQuery);
            }
            else {
                data = null;
            }
            return {
                widgetId,
                data,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error(`Failed to get widget data: ${error.message}`, error.stack);
            return {
                widgetId,
                data: null,
                timestamp: new Date(),
                error: error.message,
            };
        }
    }
    async getDashboardData(dashboardId, userId) {
        const dashboard = await this.getDashboard(dashboardId, userId);
        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }
        const widgetDataPromises = dashboard.widgets.map((widget) => this.getWidgetData(widget.id));
        return Promise.all(widgetDataPromises);
    }
    async getTemplates(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            isTemplate: true,
            isPublic: true,
        };
        if (query.type)
            where.type = query.type;
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
            dashboards: templates.map((t) => ({
                ...this.mapDashboardToResponse(t),
                widgetCount: t._count.widgets,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async createFromTemplate(templateId, userId, name) {
        return this.duplicateDashboard(templateId, userId, name);
    }
    formatDataForChart(metricData, chartType) {
        const dataPoints = metricData.dataPoints;
        switch (chartType) {
            case client_1.ChartType.LINE:
            case client_1.ChartType.AREA:
                return {
                    labels: dataPoints.map((dp) => dp.timestamp),
                    datasets: [
                        {
                            data: dataPoints.map((dp) => dp.value),
                            label: metricData.metricName,
                        },
                    ],
                };
            case client_1.ChartType.BAR:
                return {
                    labels: dataPoints.map((dp) => dp.timestamp),
                    datasets: [
                        {
                            data: dataPoints.map((dp) => dp.value),
                            label: metricData.metricName,
                        },
                    ],
                };
            case client_1.ChartType.PIE:
            case client_1.ChartType.DONUT:
                return {
                    labels: dataPoints.map((dp, index) => `Segment ${index + 1}`),
                    datasets: [
                        {
                            data: dataPoints.map((dp) => dp.value),
                        },
                    ],
                };
            case client_1.ChartType.GAUGE:
                const latestValue = dataPoints[dataPoints.length - 1]?.value || 0;
                return {
                    value: latestValue,
                    max: Math.max(...dataPoints.map((dp) => dp.value)) * 1.2,
                };
            case client_1.ChartType.TABLE:
                return {
                    columns: ['Timestamp', 'Value'],
                    rows: dataPoints.map((dp) => [dp.timestamp, dp.value]),
                };
            default:
                return dataPoints;
        }
    }
    async executeCustomQuery(query) {
        this.logger.warn('Custom query execution not implemented');
        return { message: 'Custom query execution not implemented' };
    }
    mapDashboardToResponse(dashboard) {
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
    mapWidgetToResponse(widget) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        metrics_service_1.MetricsService,
        analytics_service_1.AnalyticsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map