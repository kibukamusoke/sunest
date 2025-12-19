import { AnalyticsService } from './analytics.service';
import { MetricsService } from './metrics.service';
import { DashboardService } from './dashboard.service';
import { ReportsService } from './reports.service';
import { CreateAnalyticsSessionDto, UpdateAnalyticsSessionDto, AnalyticsSessionResponseDto, CreateAnalyticsEventDto, AnalyticsEventResponseDto, BusinessMetricQueryDto, BusinessMetricResponseDto, AnalyticsOverviewDto, AnalyticsQueryDto, CreateMetricDto, UpdateMetricDto, MetricResponseDto, MetricListQueryDto, MetricListResponseDto, CreateDataPointDto, DataPointResponseDto, MetricDataQueryDto, MetricDataResponseDto, CreateDashboardDto, UpdateDashboardDto, DashboardResponseDto, DashboardListQueryDto, DashboardListResponseDto, CreateWidgetDto, UpdateWidgetDto, WidgetResponseDto, DashboardWithWidgetsDto, WidgetDataDto, CreateReportDto, UpdateReportDto, ReportResponseDto, ReportListQueryDto, ReportListResponseDto, CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto, GenerateReportDto, ReportGenerationResponseDto } from './dto';
export declare class AnalyticsController {
    private analyticsService;
    private metricsService;
    private dashboardService;
    private reportsService;
    constructor(analyticsService: AnalyticsService, metricsService: MetricsService, dashboardService: DashboardService, reportsService: ReportsService);
    getAnalyticsOverview(startDate?: string, endDate?: string): Promise<AnalyticsOverviewDto>;
    createSession(createSessionDto: CreateAnalyticsSessionDto): Promise<AnalyticsSessionResponseDto>;
    updateSession(sessionId: string, updateSessionDto: UpdateAnalyticsSessionDto): Promise<AnalyticsSessionResponseDto>;
    getSessions(query: AnalyticsQueryDto): Promise<{
        sessions: AnalyticsSessionResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSession(sessionId: string): Promise<AnalyticsSessionResponseDto>;
    createEvent(createEventDto: CreateAnalyticsEventDto): Promise<AnalyticsEventResponseDto>;
    getEventsBySession(sessionId: string): Promise<AnalyticsEventResponseDto[]>;
    getEventsByType(eventType: string, query: AnalyticsQueryDto): Promise<{
        events: AnalyticsEventResponseDto[];
        total: number;
    }>;
    getBusinessMetrics(query: BusinessMetricQueryDto): Promise<BusinessMetricResponseDto[]>;
    calculateBusinessMetrics(startDate: string, endDate: string, granularity?: string): Promise<{
        message: string;
    }>;
    createMetric(createMetricDto: CreateMetricDto): Promise<MetricResponseDto>;
    getMetrics(query: MetricListQueryDto): Promise<MetricListResponseDto>;
    getMetric(metricId: string): Promise<MetricResponseDto>;
    updateMetric(metricId: string, updateMetricDto: UpdateMetricDto): Promise<MetricResponseDto>;
    deleteMetric(metricId: string): Promise<{
        message: string;
    }>;
    getMetricData(metricId: string, query: MetricDataQueryDto): Promise<MetricDataResponseDto>;
    createDataPoint(createDataPointDto: CreateDataPointDto): Promise<DataPointResponseDto>;
    calculateMetric(metricId: string, startDate: string, endDate: string): Promise<{
        message: string;
    }>;
    calculateAllMetrics(startDate: string, endDate: string): Promise<{
        message: string;
    }>;
    createDashboard(req: any, createDashboardDto: CreateDashboardDto): Promise<DashboardResponseDto>;
    getDashboards(req: any, query: DashboardListQueryDto): Promise<DashboardListResponseDto>;
    getDashboardTemplates(query: DashboardListQueryDto): Promise<DashboardListResponseDto>;
    getDashboard(req: any, dashboardId: string): Promise<DashboardWithWidgetsDto>;
    updateDashboard(req: any, dashboardId: string, updateDashboardDto: UpdateDashboardDto): Promise<DashboardResponseDto>;
    deleteDashboard(req: any, dashboardId: string): Promise<{
        message: string;
    }>;
    duplicateDashboard(req: any, dashboardId: string, name?: string): Promise<DashboardResponseDto>;
    getDashboardData(req: any, dashboardId: string): Promise<WidgetDataDto[]>;
    createWidget(createWidgetDto: CreateWidgetDto): Promise<WidgetResponseDto>;
    updateWidget(widgetId: string, updateWidgetDto: UpdateWidgetDto): Promise<WidgetResponseDto>;
    deleteWidget(widgetId: string): Promise<{
        message: string;
    }>;
    getWidgetData(widgetId: string): Promise<WidgetDataDto>;
    createReport(req: any, createReportDto: CreateReportDto): Promise<ReportResponseDto>;
    getReports(req: any, query: ReportListQueryDto): Promise<ReportListResponseDto>;
    getReport(req: any, reportId: string): Promise<ReportResponseDto>;
    updateReport(req: any, reportId: string, updateReportDto: UpdateReportDto): Promise<ReportResponseDto>;
    deleteReport(req: any, reportId: string): Promise<{
        message: string;
    }>;
    generateReport(req: any, generateReportDto: GenerateReportDto): Promise<ReportGenerationResponseDto>;
    createSchedule(createScheduleDto: CreateScheduleDto): Promise<ScheduleResponseDto>;
    updateSchedule(scheduleId: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleResponseDto>;
    deleteSchedule(scheduleId: string): Promise<{
        message: string;
    }>;
}
