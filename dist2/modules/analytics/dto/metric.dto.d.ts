import { MetricType, TimeGranularity } from '@prisma/client';
export declare class CreateMetricDto {
    name: string;
    type: MetricType;
    description?: string;
    unit?: string;
    formula?: string;
    dataSource?: string;
    refreshRate?: number;
    category?: string;
    tags?: string[];
    isRealTime?: boolean;
}
export declare class UpdateMetricDto {
    name?: string;
    description?: string;
    unit?: string;
    formula?: string;
    dataSource?: string;
    refreshRate?: number;
    category?: string;
    tags?: string[];
    isActive?: boolean;
    isRealTime?: boolean;
}
export declare class MetricResponseDto {
    id: string;
    name: string;
    type: MetricType;
    description?: string;
    unit?: string;
    formula?: string;
    dataSource?: string;
    refreshRate?: number;
    isActive: boolean;
    isRealTime: boolean;
    category?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class MetricListQueryDto {
    page?: number;
    limit?: number;
    type?: MetricType;
    category?: string;
    isActive?: boolean;
    isRealTime?: boolean;
    search?: string;
    tag?: string;
}
export declare class MetricListResponseDto {
    metrics: MetricResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class CreateDataPointDto {
    metricId: string;
    value: number;
    timestamp: Date;
    granularity: TimeGranularity;
    dimensions?: Record<string, any>;
    userId?: string;
    merchantId?: string;
    productId?: string;
    orderId?: string;
}
export declare class DataPointResponseDto {
    id: string;
    metricId: string;
    value: number;
    timestamp: Date;
    granularity: TimeGranularity;
    dimensions?: Record<string, any>;
    userId?: string;
    merchantId?: string;
    productId?: string;
    orderId?: string;
    createdAt: Date;
}
export declare class MetricDataQueryDto {
    startDate: Date;
    endDate: Date;
    granularity?: TimeGranularity;
    filters?: Record<string, any>;
    groupBy?: string[];
}
export declare class MetricDataResponseDto {
    metricId: string;
    metricName: string;
    dataPoints: DataPointResponseDto[];
    query: MetricDataQueryDto;
    totalPoints: number;
}
