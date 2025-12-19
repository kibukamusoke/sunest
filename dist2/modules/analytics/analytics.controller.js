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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const analytics_service_1 = require("./analytics.service");
const metrics_service_1 = require("./metrics.service");
const dashboard_service_1 = require("./dashboard.service");
const reports_service_1 = require("./reports.service");
const dto_1 = require("./dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService, metricsService, dashboardService, reportsService) {
        this.analyticsService = analyticsService;
        this.metricsService = metricsService;
        this.dashboardService = dashboardService;
        this.reportsService = reportsService;
    }
    async getAnalyticsOverview(startDate, endDate) {
        const endDateTime = endDate ? new Date(endDate) : new Date();
        const startDateTime = startDate
            ? new Date(startDate)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const periodLength = endDateTime.getTime() - startDateTime.getTime();
        const previousEndDate = new Date(startDateTime.getTime() - 1);
        const previousStartDate = new Date(previousEndDate.getTime() - periodLength);
        return this.analyticsService.getAnalyticsOverview(startDateTime, endDateTime, previousStartDate, previousEndDate);
    }
    async createSession(createSessionDto) {
        return this.analyticsService.createSession(createSessionDto);
    }
    async updateSession(sessionId, updateSessionDto) {
        return this.analyticsService.updateSession(sessionId, updateSessionDto);
    }
    async getSessions(query) {
        return this.analyticsService.getSessions(query);
    }
    async getSession(sessionId) {
        const session = await this.analyticsService.getSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        return session;
    }
    async createEvent(createEventDto) {
        return this.analyticsService.createEvent(createEventDto);
    }
    async getEventsBySession(sessionId) {
        return this.analyticsService.getEvents(sessionId);
    }
    async getEventsByType(eventType, query) {
        return this.analyticsService.getEventsByType(eventType, query);
    }
    async getBusinessMetrics(query) {
        return this.analyticsService.getBusinessMetrics(query);
    }
    async calculateBusinessMetrics(startDate, endDate, granularity) {
        await this.analyticsService.calculateBusinessMetrics(new Date(startDate), new Date(endDate), granularity);
        return { message: 'Business metrics calculation started' };
    }
    async createMetric(createMetricDto) {
        return this.metricsService.createMetric(createMetricDto);
    }
    async getMetrics(query) {
        return this.metricsService.getMetrics(query);
    }
    async getMetric(metricId) {
        const metric = await this.metricsService.getMetric(metricId);
        if (!metric) {
            throw new Error('Metric not found');
        }
        return metric;
    }
    async updateMetric(metricId, updateMetricDto) {
        return this.metricsService.updateMetric(metricId, updateMetricDto);
    }
    async deleteMetric(metricId) {
        await this.metricsService.deleteMetric(metricId);
        return { message: 'Metric deleted successfully' };
    }
    async getMetricData(metricId, query) {
        return this.metricsService.getMetricData(metricId, query);
    }
    async createDataPoint(createDataPointDto) {
        return this.metricsService.createDataPoint(createDataPointDto);
    }
    async calculateMetric(metricId, startDate, endDate) {
        await this.metricsService.calculateMetric(metricId, new Date(startDate), new Date(endDate));
        return { message: 'Metric calculation completed' };
    }
    async calculateAllMetrics(startDate, endDate) {
        await this.metricsService.calculateAllMetrics(new Date(startDate), new Date(endDate));
        return { message: 'All metrics calculation started' };
    }
    async createDashboard(req, createDashboardDto) {
        return this.dashboardService.createDashboard(req.user.id, createDashboardDto);
    }
    async getDashboards(req, query) {
        return this.dashboardService.getDashboards(req.user.id, query);
    }
    async getDashboardTemplates(query) {
        return this.dashboardService.getTemplates(query);
    }
    async getDashboard(req, dashboardId) {
        const dashboard = await this.dashboardService.getDashboard(dashboardId, req.user.id);
        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }
        return dashboard;
    }
    async updateDashboard(req, dashboardId, updateDashboardDto) {
        return this.dashboardService.updateDashboard(dashboardId, req.user.id, updateDashboardDto);
    }
    async deleteDashboard(req, dashboardId) {
        await this.dashboardService.deleteDashboard(dashboardId, req.user.id);
        return { message: 'Dashboard deleted successfully' };
    }
    async duplicateDashboard(req, dashboardId, name) {
        return this.dashboardService.duplicateDashboard(dashboardId, req.user.id, name);
    }
    async getDashboardData(req, dashboardId) {
        return this.dashboardService.getDashboardData(dashboardId, req.user.id);
    }
    async createWidget(createWidgetDto) {
        return this.dashboardService.createWidget(createWidgetDto);
    }
    async updateWidget(widgetId, updateWidgetDto) {
        return this.dashboardService.updateWidget(widgetId, updateWidgetDto);
    }
    async deleteWidget(widgetId) {
        await this.dashboardService.deleteWidget(widgetId);
        return { message: 'Widget deleted successfully' };
    }
    async getWidgetData(widgetId) {
        return this.dashboardService.getWidgetData(widgetId);
    }
    async createReport(req, createReportDto) {
        return this.reportsService.createReport(req.user.id, createReportDto);
    }
    async getReports(req, query) {
        return this.reportsService.getReports(req.user.id, query);
    }
    async getReport(req, reportId) {
        const report = await this.reportsService.getReport(reportId, req.user.id);
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        return report;
    }
    async updateReport(req, reportId, updateReportDto) {
        return this.reportsService.updateReport(reportId, req.user.id, updateReportDto);
    }
    async deleteReport(req, reportId) {
        await this.reportsService.deleteReport(reportId, req.user.id);
        return { message: 'Report deleted successfully' };
    }
    async generateReport(req, generateReportDto) {
        return this.reportsService.generateReport(req.user.id, generateReportDto);
    }
    async createSchedule(createScheduleDto) {
        return this.reportsService.createSchedule(createScheduleDto);
    }
    async updateSchedule(scheduleId, updateScheduleDto) {
        return this.reportsService.updateSchedule(scheduleId, updateScheduleDto);
    }
    async deleteSchedule(scheduleId) {
        await this.reportsService.deleteSchedule(scheduleId);
        return { message: 'Schedule deleted successfully' };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics overview' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Analytics overview retrieved',
        type: dto_1.AnalyticsOverviewDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date (ISO string)',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsOverview", null);
__decorate([
    (0, common_1.Post)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create analytics session' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Session created',
        type: dto_1.AnalyticsSessionResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAnalyticsSessionDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createSession", null);
__decorate([
    (0, common_1.Put)('sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update analytics session' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Session updated',
        type: dto_1.AnalyticsSessionResponseDto,
    }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAnalyticsSessionDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics sessions' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Sessions retrieved' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics session' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Session retrieved',
        type: dto_1.AnalyticsSessionResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Create analytics event' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Event created',
        type: dto_1.AnalyticsEventResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAnalyticsEventDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events/session/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events for session' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Events retrieved',
        type: [dto_1.AnalyticsEventResponseDto],
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEventsBySession", null);
__decorate([
    (0, common_1.Get)('events/type/:eventType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events by type' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Events retrieved' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('eventType')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEventsByType", null);
__decorate([
    (0, common_1.Get)('business-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business metrics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Business metrics retrieved',
        type: [dto_1.BusinessMetricResponseDto],
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin', 'MerchantUser'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BusinessMetricQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBusinessMetrics", null);
__decorate([
    (0, common_1.Post)('business-metrics/calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate business metrics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metrics calculation started',
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('granularity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "calculateBusinessMetrics", null);
__decorate([
    (0, common_1.Post)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Create metric' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Metric created',
        type: dto_1.MetricResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMetricDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createMetric", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metrics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metrics retrieved',
        type: dto_1.MetricListResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin', 'MerchantUser'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MetricListQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/:metricId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metric by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metric retrieved',
        type: dto_1.MetricResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin', 'MerchantUser'),
    __param(0, (0, common_1.Param)('metricId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMetric", null);
__decorate([
    (0, common_1.Put)('metrics/:metricId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update metric' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metric updated',
        type: dto_1.MetricResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('metricId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMetricDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateMetric", null);
__decorate([
    (0, common_1.Delete)('metrics/:metricId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete metric' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Metric deleted' }),
    (0, roles_decorator_1.Roles)('SystemAdmin'),
    __param(0, (0, common_1.Param)('metricId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "deleteMetric", null);
__decorate([
    (0, common_1.Get)('metrics/:metricId/data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metric data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metric data retrieved',
        type: dto_1.MetricDataResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('metricId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.MetricDataQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMetricData", null);
__decorate([
    (0, common_1.Post)('metrics/data-points'),
    (0, swagger_1.ApiOperation)({ summary: 'Create data point' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Data point created',
        type: dto_1.DataPointResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDataPointDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createDataPoint", null);
__decorate([
    (0, common_1.Post)('metrics/calculate/:metricId'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate metric' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Metric calculation started',
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin'),
    __param(0, (0, common_1.Param)('metricId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "calculateMetric", null);
__decorate([
    (0, common_1.Post)('metrics/calculate-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate all metrics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All metrics calculation started',
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "calculateAllMetrics", null);
__decorate([
    (0, common_1.Post)('dashboards'),
    (0, swagger_1.ApiOperation)({ summary: 'Create dashboard' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Dashboard created',
        type: dto_1.DashboardResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateDashboardDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createDashboard", null);
__decorate([
    (0, common_1.Get)('dashboards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboards' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboards retrieved',
        type: dto_1.DashboardListResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.DashboardListQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboards", null);
__decorate([
    (0, common_1.Get)('dashboards/templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard templates' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Templates retrieved',
        type: dto_1.DashboardListResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DashboardListQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardTemplates", null);
__decorate([
    (0, common_1.Get)('dashboards/:dashboardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard retrieved',
        type: dto_1.DashboardWithWidgetsDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('dashboardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Put)('dashboards/:dashboardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dashboard' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard updated',
        type: dto_1.DashboardResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('dashboardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateDashboardDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateDashboard", null);
__decorate([
    (0, common_1.Delete)('dashboards/:dashboardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete dashboard' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Dashboard deleted' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('dashboardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "deleteDashboard", null);
__decorate([
    (0, common_1.Post)('dashboards/:dashboardId/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate dashboard' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Dashboard duplicated',
        type: dto_1.DashboardResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('dashboardId')),
    __param(2, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "duplicateDashboard", null);
__decorate([
    (0, common_1.Get)('dashboards/:dashboardId/data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard data retrieved',
        type: [dto_1.WidgetDataDto],
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('dashboardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Post)('widgets'),
    (0, swagger_1.ApiOperation)({ summary: 'Create widget' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Widget created',
        type: dto_1.WidgetResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateWidgetDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createWidget", null);
__decorate([
    (0, common_1.Put)('widgets/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update widget' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Widget updated',
        type: dto_1.WidgetResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateWidgetDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateWidget", null);
__decorate([
    (0, common_1.Delete)('widgets/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete widget' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Widget deleted' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "deleteWidget", null);
__decorate([
    (0, common_1.Get)('widgets/:widgetId/data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget data' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Widget data retrieved',
        type: dto_1.WidgetDataDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getWidgetData", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Create report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Report created',
        type: dto_1.ReportResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reports' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reports retrieved',
        type: dto_1.ReportListResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ReportListQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('reports/:reportId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Report retrieved',
        type: dto_1.ReportResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Put)('reports/:reportId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Report updated',
        type: dto_1.ReportResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reportId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateReportDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Delete)('reports/:reportId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete report' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Report deleted' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate report' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Report generation started',
        type: dto_1.ReportGenerationResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.GenerateReportDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Post)('reports/schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create report schedule' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Schedule created',
        type: dto_1.ScheduleResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Put)('reports/schedules/:scheduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update report schedule' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Schedule updated',
        type: dto_1.ScheduleResponseDto,
    }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('reports/schedules/:scheduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete report schedule' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Schedule deleted' }),
    (0, roles_decorator_1.Roles)('SystemAdmin', 'MerchantAdmin'),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "deleteSchedule", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        metrics_service_1.MetricsService,
        dashboard_service_1.DashboardService,
        reports_service_1.ReportsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map