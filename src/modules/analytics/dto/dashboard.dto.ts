import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsBoolean, IsInt, IsArray, Min, Max } from 'class-validator';
import { DashboardType, ChartType } from '@prisma/client';

export class CreateDashboardDto {
    @ApiProperty({ description: 'Dashboard name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Dashboard description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: DashboardType, description: 'Dashboard type' })
    @IsEnum(DashboardType)
    type: DashboardType;

    @ApiPropertyOptional({ description: 'Widget layout configuration' })
    @IsObject()
    @IsOptional()
    layout?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Is dashboard public' })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiPropertyOptional({ description: 'User IDs with access', type: [String] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    sharedWith?: string[];

    @ApiPropertyOptional({ description: 'Roles that can access dashboard', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    allowedRoles?: string[];

    @ApiPropertyOptional({ description: 'Refresh rate in seconds' })
    @IsInt()
    @Min(30)
    @IsOptional()
    refreshRate?: number;

    @ApiPropertyOptional({ description: 'Timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ description: 'Default date range' })
    @IsObject()
    @IsOptional()
    dateRange?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Auto refresh enabled' })
    @IsBoolean()
    @IsOptional()
    autoRefresh?: boolean;

    @ApiPropertyOptional({ description: 'Dashboard tags', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ description: 'Is template dashboard' })
    @IsBoolean()
    @IsOptional()
    isTemplate?: boolean;

    @ApiPropertyOptional({ description: 'Source template ID' })
    @IsUUID()
    @IsOptional()
    templateSource?: string;
}

export class UpdateDashboardDto {
    @ApiPropertyOptional({ description: 'Dashboard name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Dashboard description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Widget layout configuration' })
    @IsObject()
    @IsOptional()
    layout?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Is dashboard public' })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiPropertyOptional({ description: 'User IDs with access' })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    sharedWith?: string[];

    @ApiPropertyOptional({ description: 'Roles that can access dashboard' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    allowedRoles?: string[];

    @ApiPropertyOptional({ description: 'Refresh rate in seconds' })
    @IsInt()
    @Min(30)
    @IsOptional()
    refreshRate?: number;

    @ApiPropertyOptional({ description: 'Timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ description: 'Default date range' })
    @IsObject()
    @IsOptional()
    dateRange?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Auto refresh enabled' })
    @IsBoolean()
    @IsOptional()
    autoRefresh?: boolean;

    @ApiPropertyOptional({ description: 'Dashboard tags' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

export class DashboardResponseDto {
    @ApiProperty({ description: 'Dashboard ID' })
    id: string;

    @ApiProperty({ description: 'Dashboard name' })
    name: string;

    @ApiPropertyOptional({ description: 'Dashboard description' })
    description?: string;

    @ApiProperty({ enum: DashboardType, description: 'Dashboard type' })
    type: DashboardType;

    @ApiProperty({ description: 'Widget layout configuration' })
    layout: Record<string, any>;

    @ApiProperty({ description: 'Owner ID' })
    ownerId: string;

    @ApiProperty({ description: 'Is dashboard public' })
    isPublic: boolean;

    @ApiProperty({ description: 'User IDs with access' })
    sharedWith: string[];

    @ApiProperty({ description: 'Roles that can access dashboard' })
    allowedRoles: string[];

    @ApiProperty({ description: 'Refresh rate in seconds' })
    refreshRate: number;

    @ApiPropertyOptional({ description: 'Timezone' })
    timezone?: string;

    @ApiPropertyOptional({ description: 'Default date range' })
    dateRange?: Record<string, any>;

    @ApiProperty({ description: 'Auto refresh enabled' })
    autoRefresh: boolean;

    @ApiProperty({ description: 'Is template dashboard' })
    isTemplate: boolean;

    @ApiPropertyOptional({ description: 'Source template ID' })
    templateSource?: string;

    @ApiProperty({ description: 'Dashboard tags' })
    tags: string[];

    @ApiProperty({ description: 'Widget count' })
    widgetCount?: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class CreateWidgetDto {
    @ApiProperty({ description: 'Dashboard ID' })
    @IsUUID()
    dashboardId: string;

    @ApiProperty({ description: 'Widget title' })
    @IsString()
    title: string;

    @ApiProperty({ enum: ChartType, description: 'Chart type' })
    @IsEnum(ChartType)
    type: ChartType;

    @ApiPropertyOptional({ description: 'Widget description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Widget position and size' })
    @IsObject()
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    @ApiPropertyOptional({ description: 'Widget order' })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ description: 'Metric ID' })
    @IsUUID()
    @IsOptional()
    metricId?: string;

    @ApiPropertyOptional({ description: 'Custom data query configuration' })
    @IsObject()
    @IsOptional()
    dataQuery?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Chart-specific configuration' })
    @IsObject()
    @IsOptional()
    chartConfig?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Widget-specific filters' })
    @IsObject()
    @IsOptional()
    filters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Refresh rate in seconds' })
    @IsInt()
    @Min(30)
    @IsOptional()
    refreshRate?: number;
}

export class UpdateWidgetDto {
    @ApiPropertyOptional({ description: 'Widget title' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ description: 'Widget description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Widget position and size' })
    @IsObject()
    @IsOptional()
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    @ApiPropertyOptional({ description: 'Widget order' })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ description: 'Metric ID' })
    @IsUUID()
    @IsOptional()
    metricId?: string;

    @ApiPropertyOptional({ description: 'Custom data query configuration' })
    @IsObject()
    @IsOptional()
    dataQuery?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Chart-specific configuration' })
    @IsObject()
    @IsOptional()
    chartConfig?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Widget-specific filters' })
    @IsObject()
    @IsOptional()
    filters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Refresh rate in seconds' })
    @IsInt()
    @Min(30)
    @IsOptional()
    refreshRate?: number;

    @ApiPropertyOptional({ description: 'Is widget visible' })
    @IsBoolean()
    @IsOptional()
    isVisible?: boolean;
}

export class WidgetResponseDto {
    @ApiProperty({ description: 'Widget ID' })
    id: string;

    @ApiProperty({ description: 'Dashboard ID' })
    dashboardId: string;

    @ApiProperty({ description: 'Widget title' })
    title: string;

    @ApiProperty({ enum: ChartType, description: 'Chart type' })
    type: ChartType;

    @ApiPropertyOptional({ description: 'Widget description' })
    description?: string;

    @ApiProperty({ description: 'Widget position and size' })
    position: Record<string, any>;

    @ApiProperty({ description: 'Widget order' })
    order: number;

    @ApiPropertyOptional({ description: 'Metric ID' })
    metricId?: string;

    @ApiPropertyOptional({ description: 'Custom data query configuration' })
    dataQuery?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Chart-specific configuration' })
    chartConfig?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Widget-specific filters' })
    filters?: Record<string, any>;

    @ApiProperty({ description: 'Refresh rate in seconds' })
    refreshRate: number;

    @ApiProperty({ description: 'Is widget visible' })
    isVisible: boolean;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class DashboardListQueryDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ description: 'Page size' })
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number;

    @ApiPropertyOptional({ enum: DashboardType, description: 'Filter by dashboard type' })
    @IsEnum(DashboardType)
    @IsOptional()
    type?: DashboardType;

    @ApiPropertyOptional({ description: 'Filter by public status' })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiPropertyOptional({ description: 'Filter by template status' })
    @IsBoolean()
    @IsOptional()
    isTemplate?: boolean;

    @ApiPropertyOptional({ description: 'Search by name' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by tag' })
    @IsString()
    @IsOptional()
    tag?: string;

    @ApiPropertyOptional({ description: 'Filter by owner ID' })
    @IsUUID()
    @IsOptional()
    ownerId?: string;
}

export class DashboardListResponseDto {
    @ApiProperty({ type: [DashboardResponseDto], description: 'List of dashboards' })
    dashboards: DashboardResponseDto[];

    @ApiProperty({ description: 'Total count' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Page size' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class DashboardWithWidgetsDto extends DashboardResponseDto {
    @ApiProperty({ type: [WidgetResponseDto], description: 'Dashboard widgets' })
    widgets: WidgetResponseDto[];
}

export class WidgetDataDto {
    @ApiProperty({ description: 'Widget ID' })
    widgetId: string;

    @ApiProperty({ description: 'Widget data' })
    data: any;

    @ApiProperty({ description: 'Data timestamp' })
    timestamp: Date;

    @ApiPropertyOptional({ description: 'Error message if data fetch failed' })
    error?: string;
}
