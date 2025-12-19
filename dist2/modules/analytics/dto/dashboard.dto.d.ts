import { DashboardType, ChartType } from '@prisma/client';
export declare class CreateDashboardDto {
    name: string;
    description?: string;
    type: DashboardType;
    layout?: Record<string, any>;
    isPublic?: boolean;
    sharedWith?: string[];
    allowedRoles?: string[];
    refreshRate?: number;
    timezone?: string;
    dateRange?: Record<string, any>;
    autoRefresh?: boolean;
    tags?: string[];
    isTemplate?: boolean;
    templateSource?: string;
}
export declare class UpdateDashboardDto {
    name?: string;
    description?: string;
    layout?: Record<string, any>;
    isPublic?: boolean;
    sharedWith?: string[];
    allowedRoles?: string[];
    refreshRate?: number;
    timezone?: string;
    dateRange?: Record<string, any>;
    autoRefresh?: boolean;
    tags?: string[];
}
export declare class DashboardResponseDto {
    id: string;
    name: string;
    description?: string;
    type: DashboardType;
    layout: Record<string, any>;
    ownerId: string;
    isPublic: boolean;
    sharedWith: string[];
    allowedRoles: string[];
    refreshRate: number;
    timezone?: string;
    dateRange?: Record<string, any>;
    autoRefresh: boolean;
    isTemplate: boolean;
    templateSource?: string;
    tags: string[];
    widgetCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateWidgetDto {
    dashboardId: string;
    title: string;
    type: ChartType;
    description?: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    order?: number;
    metricId?: string;
    dataQuery?: Record<string, any>;
    chartConfig?: Record<string, any>;
    filters?: Record<string, any>;
    refreshRate?: number;
}
export declare class UpdateWidgetDto {
    title?: string;
    description?: string;
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    order?: number;
    metricId?: string;
    dataQuery?: Record<string, any>;
    chartConfig?: Record<string, any>;
    filters?: Record<string, any>;
    refreshRate?: number;
    isVisible?: boolean;
}
export declare class WidgetResponseDto {
    id: string;
    dashboardId: string;
    title: string;
    type: ChartType;
    description?: string;
    position: Record<string, any>;
    order: number;
    metricId?: string;
    dataQuery?: Record<string, any>;
    chartConfig?: Record<string, any>;
    filters?: Record<string, any>;
    refreshRate: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DashboardListQueryDto {
    page?: number;
    limit?: number;
    type?: DashboardType;
    isPublic?: boolean;
    isTemplate?: boolean;
    search?: string;
    tag?: string;
    ownerId?: string;
}
export declare class DashboardListResponseDto {
    dashboards: DashboardResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class DashboardWithWidgetsDto extends DashboardResponseDto {
    widgets: WidgetResponseDto[];
}
export declare class WidgetDataDto {
    widgetId: string;
    data: any;
    timestamp: Date;
    error?: string;
}
