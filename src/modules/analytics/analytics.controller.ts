import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { MetricsService } from './metrics.service';
import { DashboardService } from './dashboard.service';
import { ReportsService } from './reports.service';
import {
    // Analytics DTOs
    CreateAnalyticsSessionDto,
    UpdateAnalyticsSessionDto,
    AnalyticsSessionResponseDto,
    CreateAnalyticsEventDto,
    AnalyticsEventResponseDto,
    BusinessMetricQueryDto,
    BusinessMetricResponseDto,
    AnalyticsOverviewDto,
    AnalyticsQueryDto,

    // Metric DTOs
    CreateMetricDto,
    UpdateMetricDto,
    MetricResponseDto,
    MetricListQueryDto,
    MetricListResponseDto,
    CreateDataPointDto,
    DataPointResponseDto,
    MetricDataQueryDto,
    MetricDataResponseDto,

    // Dashboard DTOs
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

    // Report DTOs
    CreateReportDto,
    UpdateReportDto,
    ReportResponseDto,
    ReportListQueryDto,
    ReportListResponseDto,
    CreateScheduleDto,
    UpdateScheduleDto,
    ScheduleResponseDto,
    GenerateReportDto,
    ReportGenerationResponseDto,
} from './dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(
        private analyticsService: AnalyticsService,
        private metricsService: MetricsService,
        private dashboardService: DashboardService,
        private reportsService: ReportsService,
    ) { }

    // =============== ANALYTICS OVERVIEW ===============

    @Get('overview')
    @ApiOperation({ summary: 'Get analytics overview' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Analytics overview retrieved', type: AnalyticsOverviewDto })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getAnalyticsOverview(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ): Promise<AnalyticsOverviewDto> {
        const endDateTime = endDate ? new Date(endDate) : new Date();
        const startDateTime = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Calculate previous period for comparison
        const periodLength = endDateTime.getTime() - startDateTime.getTime();
        const previousEndDate = new Date(startDateTime.getTime() - 1);
        const previousStartDate = new Date(previousEndDate.getTime() - periodLength);

        return this.analyticsService.getAnalyticsOverview(
            startDateTime,
            endDateTime,
            previousStartDate,
            previousEndDate,
        );
    }

    // =============== SESSION TRACKING ===============

    @Post('sessions')
    @ApiOperation({ summary: 'Create analytics session' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Session created', type: AnalyticsSessionResponseDto })
    async createSession(@Body() createSessionDto: CreateAnalyticsSessionDto): Promise<AnalyticsSessionResponseDto> {
        return this.analyticsService.createSession(createSessionDto);
    }

    @Put('sessions/:sessionId')
    @ApiOperation({ summary: 'Update analytics session' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Session updated', type: AnalyticsSessionResponseDto })
    async updateSession(
        @Param('sessionId') sessionId: string,
        @Body() updateSessionDto: UpdateAnalyticsSessionDto,
    ): Promise<AnalyticsSessionResponseDto> {
        return this.analyticsService.updateSession(sessionId, updateSessionDto);
    }

    @Get('sessions/:sessionId')
    @ApiOperation({ summary: 'Get analytics session' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Session retrieved', type: AnalyticsSessionResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getSession(@Param('sessionId') sessionId: string): Promise<AnalyticsSessionResponseDto> {
        const session = await this.analyticsService.getSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        return session;
    }

    @Get('sessions')
    @ApiOperation({ summary: 'Get analytics sessions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Sessions retrieved' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getSessions(@Query() query: AnalyticsQueryDto) {
        return this.analyticsService.getSessions(query);
    }

    // =============== EVENT TRACKING ===============

    @Post('events')
    @ApiOperation({ summary: 'Create analytics event' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event created', type: AnalyticsEventResponseDto })
    async createEvent(@Body() createEventDto: CreateAnalyticsEventDto): Promise<AnalyticsEventResponseDto> {
        return this.analyticsService.createEvent(createEventDto);
    }

    @Get('events/session/:sessionId')
    @ApiOperation({ summary: 'Get events for session' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events retrieved', type: [AnalyticsEventResponseDto] })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getEventsBySession(@Param('sessionId') sessionId: string): Promise<AnalyticsEventResponseDto[]> {
        return this.analyticsService.getEvents(sessionId);
    }

    @Get('events/type/:eventType')
    @ApiOperation({ summary: 'Get events by type' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events retrieved' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getEventsByType(
        @Param('eventType') eventType: string,
        @Query() query: AnalyticsQueryDto,
    ) {
        return this.analyticsService.getEventsByType(eventType, query);
    }

    // =============== BUSINESS METRICS ===============

    @Get('business-metrics')
    @ApiOperation({ summary: 'Get business metrics' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Business metrics retrieved', type: [BusinessMetricResponseDto] })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getBusinessMetrics(@Query() query: BusinessMetricQueryDto): Promise<BusinessMetricResponseDto[]> {
        return this.analyticsService.getBusinessMetrics(query);
    }

    @Post('business-metrics/calculate')
    @ApiOperation({ summary: 'Calculate business metrics' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metrics calculation started' })
    @Roles('SystemAdmin')
    async calculateBusinessMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('granularity') granularity?: string,
    ): Promise<{ message: string }> {
        await this.analyticsService.calculateBusinessMetrics(
            new Date(startDate),
            new Date(endDate),
            granularity as any,
        );
        return { message: 'Business metrics calculation started' };
    }

    // =============== METRICS MANAGEMENT ===============

    @Post('metrics')
    @ApiOperation({ summary: 'Create metric' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Metric created', type: MetricResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createMetric(@Body() createMetricDto: CreateMetricDto): Promise<MetricResponseDto> {
        return this.metricsService.createMetric(createMetricDto);
    }

    @Get('metrics')
    @ApiOperation({ summary: 'Get metrics' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metrics retrieved', type: MetricListResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getMetrics(@Query() query: MetricListQueryDto): Promise<MetricListResponseDto> {
        return this.metricsService.getMetrics(query);
    }

    @Get('metrics/:metricId')
    @ApiOperation({ summary: 'Get metric by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metric retrieved', type: MetricResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getMetric(@Param('metricId') metricId: string): Promise<MetricResponseDto> {
        const metric = await this.metricsService.getMetric(metricId);
        if (!metric) {
            throw new Error('Metric not found');
        }
        return metric;
    }

    @Put('metrics/:metricId')
    @ApiOperation({ summary: 'Update metric' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metric updated', type: MetricResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async updateMetric(
        @Param('metricId') metricId: string,
        @Body() updateMetricDto: UpdateMetricDto,
    ): Promise<MetricResponseDto> {
        return this.metricsService.updateMetric(metricId, updateMetricDto);
    }

    @Delete('metrics/:metricId')
    @ApiOperation({ summary: 'Delete metric' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metric deleted' })
    @Roles('SystemAdmin')
    async deleteMetric(@Param('metricId') metricId: string): Promise<{ message: string }> {
        await this.metricsService.deleteMetric(metricId);
        return { message: 'Metric deleted successfully' };
    }

    @Get('metrics/:metricId/data')
    @ApiOperation({ summary: 'Get metric data' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metric data retrieved', type: MetricDataResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getMetricData(
        @Param('metricId') metricId: string,
        @Query() query: MetricDataQueryDto,
    ): Promise<MetricDataResponseDto> {
        return this.metricsService.getMetricData(metricId, query);
    }

    @Post('metrics/data-points')
    @ApiOperation({ summary: 'Create data point' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Data point created', type: DataPointResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createDataPoint(@Body() createDataPointDto: CreateDataPointDto): Promise<DataPointResponseDto> {
        return this.metricsService.createDataPoint(createDataPointDto);
    }

    @Post('metrics/calculate/:metricId')
    @ApiOperation({ summary: 'Calculate metric' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Metric calculation started' })
    @Roles('SystemAdmin')
    async calculateMetric(
        @Param('metricId') metricId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<{ message: string }> {
        await this.metricsService.calculateMetric(metricId, new Date(startDate), new Date(endDate));
        return { message: 'Metric calculation completed' };
    }

    @Post('metrics/calculate-all')
    @ApiOperation({ summary: 'Calculate all metrics' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All metrics calculation started' })
    @Roles('SystemAdmin')
    async calculateAllMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<{ message: string }> {
        await this.metricsService.calculateAllMetrics(new Date(startDate), new Date(endDate));
        return { message: 'All metrics calculation started' };
    }

    // =============== DASHBOARDS ===============

    @Post('dashboards')
    @ApiOperation({ summary: 'Create dashboard' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Dashboard created', type: DashboardResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createDashboard(
        @Request() req,
        @Body() createDashboardDto: CreateDashboardDto,
    ): Promise<DashboardResponseDto> {
        return this.dashboardService.createDashboard(req.user.id, createDashboardDto);
    }

    @Get('dashboards')
    @ApiOperation({ summary: 'Get dashboards' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dashboards retrieved', type: DashboardListResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getDashboards(
        @Request() req,
        @Query() query: DashboardListQueryDto,
    ): Promise<DashboardListResponseDto> {
        return this.dashboardService.getDashboards(req.user.id, query);
    }

    @Get('dashboards/templates')
    @ApiOperation({ summary: 'Get dashboard templates' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Templates retrieved', type: DashboardListResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getDashboardTemplates(@Query() query: DashboardListQueryDto): Promise<DashboardListResponseDto> {
        return this.dashboardService.getTemplates(query);
    }

    @Get('dashboards/:dashboardId')
    @ApiOperation({ summary: 'Get dashboard by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard retrieved', type: DashboardWithWidgetsDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getDashboard(
        @Request() req,
        @Param('dashboardId') dashboardId: string,
    ): Promise<DashboardWithWidgetsDto> {
        const dashboard = await this.dashboardService.getDashboard(dashboardId, req.user.id);
        if (!dashboard) {
            throw new Error('Dashboard not found or access denied');
        }
        return dashboard;
    }

    @Put('dashboards/:dashboardId')
    @ApiOperation({ summary: 'Update dashboard' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard updated', type: DashboardResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async updateDashboard(
        @Request() req,
        @Param('dashboardId') dashboardId: string,
        @Body() updateDashboardDto: UpdateDashboardDto,
    ): Promise<DashboardResponseDto> {
        return this.dashboardService.updateDashboard(dashboardId, req.user.id, updateDashboardDto);
    }

    @Delete('dashboards/:dashboardId')
    @ApiOperation({ summary: 'Delete dashboard' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard deleted' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async deleteDashboard(
        @Request() req,
        @Param('dashboardId') dashboardId: string,
    ): Promise<{ message: string }> {
        await this.dashboardService.deleteDashboard(dashboardId, req.user.id);
        return { message: 'Dashboard deleted successfully' };
    }

    @Post('dashboards/:dashboardId/duplicate')
    @ApiOperation({ summary: 'Duplicate dashboard' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Dashboard duplicated', type: DashboardResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async duplicateDashboard(
        @Request() req,
        @Param('dashboardId') dashboardId: string,
        @Body('name') name?: string,
    ): Promise<DashboardResponseDto> {
        return this.dashboardService.duplicateDashboard(dashboardId, req.user.id, name);
    }

    @Get('dashboards/:dashboardId/data')
    @ApiOperation({ summary: 'Get dashboard data' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard data retrieved', type: [WidgetDataDto] })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getDashboardData(
        @Request() req,
        @Param('dashboardId') dashboardId: string,
    ): Promise<WidgetDataDto[]> {
        return this.dashboardService.getDashboardData(dashboardId, req.user.id);
    }

    // =============== WIDGETS ===============

    @Post('widgets')
    @ApiOperation({ summary: 'Create widget' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Widget created', type: WidgetResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createWidget(@Body() createWidgetDto: CreateWidgetDto): Promise<WidgetResponseDto> {
        return this.dashboardService.createWidget(createWidgetDto);
    }

    @Put('widgets/:widgetId')
    @ApiOperation({ summary: 'Update widget' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Widget updated', type: WidgetResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async updateWidget(
        @Param('widgetId') widgetId: string,
        @Body() updateWidgetDto: UpdateWidgetDto,
    ): Promise<WidgetResponseDto> {
        return this.dashboardService.updateWidget(widgetId, updateWidgetDto);
    }

    @Delete('widgets/:widgetId')
    @ApiOperation({ summary: 'Delete widget' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Widget deleted' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async deleteWidget(@Param('widgetId') widgetId: string): Promise<{ message: string }> {
        await this.dashboardService.deleteWidget(widgetId);
        return { message: 'Widget deleted successfully' };
    }

    @Get('widgets/:widgetId/data')
    @ApiOperation({ summary: 'Get widget data' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Widget data retrieved', type: WidgetDataDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getWidgetData(@Param('widgetId') widgetId: string): Promise<WidgetDataDto> {
        return this.dashboardService.getWidgetData(widgetId);
    }

    // =============== REPORTS ===============

    @Post('reports')
    @ApiOperation({ summary: 'Create report' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Report created', type: ReportResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createReport(
        @Request() req,
        @Body() createReportDto: CreateReportDto,
    ): Promise<ReportResponseDto> {
        return this.reportsService.createReport(req.user.id, createReportDto);
    }

    @Get('reports')
    @ApiOperation({ summary: 'Get reports' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Reports retrieved', type: ReportListResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getReports(
        @Request() req,
        @Query() query: ReportListQueryDto,
    ): Promise<ReportListResponseDto> {
        return this.reportsService.getReports(req.user.id, query);
    }

    @Get('reports/:reportId')
    @ApiOperation({ summary: 'Get report by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Report retrieved', type: ReportResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async getReport(
        @Request() req,
        @Param('reportId') reportId: string,
    ): Promise<ReportResponseDto> {
        const report = await this.reportsService.getReport(reportId, req.user.id);
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        return report;
    }

    @Put('reports/:reportId')
    @ApiOperation({ summary: 'Update report' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Report updated', type: ReportResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async updateReport(
        @Request() req,
        @Param('reportId') reportId: string,
        @Body() updateReportDto: UpdateReportDto,
    ): Promise<ReportResponseDto> {
        return this.reportsService.updateReport(reportId, req.user.id, updateReportDto);
    }

    @Delete('reports/:reportId')
    @ApiOperation({ summary: 'Delete report' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Report deleted' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async deleteReport(
        @Request() req,
        @Param('reportId') reportId: string,
    ): Promise<{ message: string }> {
        await this.reportsService.deleteReport(reportId, req.user.id);
        return { message: 'Report deleted successfully' };
    }

    @Post('reports/generate')
    @ApiOperation({ summary: 'Generate report' })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Report generation started', type: ReportGenerationResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async generateReport(
        @Request() req,
        @Body() generateReportDto: GenerateReportDto,
    ): Promise<ReportGenerationResponseDto> {
        return this.reportsService.generateReport(req.user.id, generateReportDto);
    }

    @Post('reports/schedules')
    @ApiOperation({ summary: 'Create report schedule' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Schedule created', type: ScheduleResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async createSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<ScheduleResponseDto> {
        return this.reportsService.createSchedule(createScheduleDto);
    }

    @Put('reports/schedules/:scheduleId')
    @ApiOperation({ summary: 'Update report schedule' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Schedule updated', type: ScheduleResponseDto })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async updateSchedule(
        @Param('scheduleId') scheduleId: string,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ): Promise<ScheduleResponseDto> {
        return this.reportsService.updateSchedule(scheduleId, updateScheduleDto);
    }

    @Delete('reports/schedules/:scheduleId')
    @ApiOperation({ summary: 'Delete report schedule' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Schedule deleted' })
    @Roles('SystemAdmin', 'MerchantAdmin')
    async deleteSchedule(@Param('scheduleId') scheduleId: string): Promise<{ message: string }> {
        await this.reportsService.deleteSchedule(scheduleId);
        return { message: 'Schedule deleted successfully' };
    }
}
