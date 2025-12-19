import { PrismaService } from '../../config/prisma.service';
import { CreateDashboardDto, UpdateDashboardDto, DashboardResponseDto, DashboardListQueryDto, DashboardListResponseDto, CreateWidgetDto, UpdateWidgetDto, WidgetResponseDto, DashboardWithWidgetsDto, WidgetDataDto } from './dto/dashboard.dto';
import { MetricsService } from './metrics.service';
import { AnalyticsService } from './analytics.service';
export declare class DashboardService {
    private prisma;
    private metricsService;
    private analyticsService;
    private readonly logger;
    constructor(prisma: PrismaService, metricsService: MetricsService, analyticsService: AnalyticsService);
    createDashboard(userId: string, data: CreateDashboardDto): Promise<DashboardResponseDto>;
    getDashboards(userId: string, query: DashboardListQueryDto): Promise<DashboardListResponseDto>;
    getDashboard(dashboardId: string, userId: string): Promise<DashboardWithWidgetsDto | null>;
    updateDashboard(dashboardId: string, userId: string, data: UpdateDashboardDto): Promise<DashboardResponseDto>;
    deleteDashboard(dashboardId: string, userId: string): Promise<void>;
    duplicateDashboard(dashboardId: string, userId: string, name?: string): Promise<DashboardResponseDto>;
    createWidget(data: CreateWidgetDto): Promise<WidgetResponseDto>;
    updateWidget(widgetId: string, data: UpdateWidgetDto): Promise<WidgetResponseDto>;
    deleteWidget(widgetId: string): Promise<void>;
    getWidgetData(widgetId: string): Promise<WidgetDataDto>;
    getDashboardData(dashboardId: string, userId: string): Promise<WidgetDataDto[]>;
    getTemplates(query: DashboardListQueryDto): Promise<DashboardListResponseDto>;
    createFromTemplate(templateId: string, userId: string, name: string): Promise<DashboardResponseDto>;
    private formatDataForChart;
    private executeCustomQuery;
    private mapDashboardToResponse;
    private mapWidgetToResponse;
}
