import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsBoolean, IsInt, IsDecimal, IsArray, Min, Max } from 'class-validator';
import { MetricType, TimeGranularity } from '@prisma/client';

export class CreateMetricDto {
    @ApiProperty({ description: 'Metric name' })
    @IsString()
    name: string;

    @ApiProperty({ enum: MetricType, description: 'Metric type' })
    @IsEnum(MetricType)
    type: MetricType;

    @ApiPropertyOptional({ description: 'Metric description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Metric unit (e.g., USD, count, percentage)' })
    @IsString()
    @IsOptional()
    unit?: string;

    @ApiPropertyOptional({ description: 'Calculation formula' })
    @IsString()
    @IsOptional()
    formula?: string;

    @ApiPropertyOptional({ description: 'Data source table/view' })
    @IsString()
    @IsOptional()
    dataSource?: string;

    @ApiPropertyOptional({ description: 'Refresh rate in minutes' })
    @IsInt()
    @Min(1)
    @IsOptional()
    refreshRate?: number;

    @ApiPropertyOptional({ description: 'Metric category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Metric tags', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ description: 'Is real-time metric' })
    @IsBoolean()
    @IsOptional()
    isRealTime?: boolean;
}

export class UpdateMetricDto {
    @ApiPropertyOptional({ description: 'Metric name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Metric description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Metric unit' })
    @IsString()
    @IsOptional()
    unit?: string;

    @ApiPropertyOptional({ description: 'Calculation formula' })
    @IsString()
    @IsOptional()
    formula?: string;

    @ApiPropertyOptional({ description: 'Data source' })
    @IsString()
    @IsOptional()
    dataSource?: string;

    @ApiPropertyOptional({ description: 'Refresh rate in minutes' })
    @IsInt()
    @Min(1)
    @IsOptional()
    refreshRate?: number;

    @ApiPropertyOptional({ description: 'Metric category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Metric tags' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ description: 'Is active' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Is real-time metric' })
    @IsBoolean()
    @IsOptional()
    isRealTime?: boolean;
}

export class MetricResponseDto {
    @ApiProperty({ description: 'Metric ID' })
    id: string;

    @ApiProperty({ description: 'Metric name' })
    name: string;

    @ApiProperty({ enum: MetricType, description: 'Metric type' })
    type: MetricType;

    @ApiPropertyOptional({ description: 'Metric description' })
    description?: string;

    @ApiPropertyOptional({ description: 'Metric unit' })
    unit?: string;

    @ApiPropertyOptional({ description: 'Calculation formula' })
    formula?: string;

    @ApiPropertyOptional({ description: 'Data source' })
    dataSource?: string;

    @ApiPropertyOptional({ description: 'Refresh rate in minutes' })
    refreshRate?: number;

    @ApiProperty({ description: 'Is active' })
    isActive: boolean;

    @ApiProperty({ description: 'Is real-time metric' })
    isRealTime: boolean;

    @ApiPropertyOptional({ description: 'Metric category' })
    category?: string;

    @ApiProperty({ description: 'Metric tags' })
    tags: string[];

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class MetricListQueryDto {
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

    @ApiPropertyOptional({ enum: MetricType, description: 'Filter by metric type' })
    @IsEnum(MetricType)
    @IsOptional()
    type?: MetricType;

    @ApiPropertyOptional({ description: 'Filter by category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Filter by active status' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Filter by real-time status' })
    @IsBoolean()
    @IsOptional()
    isRealTime?: boolean;

    @ApiPropertyOptional({ description: 'Search by name' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by tag' })
    @IsString()
    @IsOptional()
    tag?: string;
}

export class MetricListResponseDto {
    @ApiProperty({ type: [MetricResponseDto], description: 'List of metrics' })
    metrics: MetricResponseDto[];

    @ApiProperty({ description: 'Total count' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Page size' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class CreateDataPointDto {
    @ApiProperty({ description: 'Metric ID' })
    @IsUUID()
    metricId: string;

    @ApiProperty({ description: 'Data point value' })
    @IsDecimal()
    value: number;

    @ApiProperty({ description: 'Timestamp' })
    timestamp: Date;

    @ApiProperty({ enum: TimeGranularity, description: 'Time granularity' })
    @IsEnum(TimeGranularity)
    granularity: TimeGranularity;

    @ApiPropertyOptional({ description: 'Dimensions for filtering/grouping' })
    @IsObject()
    @IsOptional()
    dimensions?: Record<string, any>;

    @ApiPropertyOptional({ description: 'User ID' })
    @IsUUID()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ description: 'Merchant ID' })
    @IsUUID()
    @IsOptional()
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Product ID' })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiPropertyOptional({ description: 'Order ID' })
    @IsUUID()
    @IsOptional()
    orderId?: string;
}

export class DataPointResponseDto {
    @ApiProperty({ description: 'Data point ID' })
    id: string;

    @ApiProperty({ description: 'Metric ID' })
    metricId: string;

    @ApiProperty({ description: 'Data point value' })
    value: number;

    @ApiProperty({ description: 'Timestamp' })
    timestamp: Date;

    @ApiProperty({ enum: TimeGranularity, description: 'Time granularity' })
    granularity: TimeGranularity;

    @ApiPropertyOptional({ description: 'Dimensions' })
    dimensions?: Record<string, any>;

    @ApiPropertyOptional({ description: 'User ID' })
    userId?: string;

    @ApiPropertyOptional({ description: 'Merchant ID' })
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Product ID' })
    productId?: string;

    @ApiPropertyOptional({ description: 'Order ID' })
    orderId?: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;
}

export class MetricDataQueryDto {
    @ApiProperty({ description: 'Start date' })
    startDate: Date;

    @ApiProperty({ description: 'End date' })
    endDate: Date;

    @ApiPropertyOptional({ enum: TimeGranularity, description: 'Data granularity' })
    @IsEnum(TimeGranularity)
    @IsOptional()
    granularity?: TimeGranularity;

    @ApiPropertyOptional({ description: 'Filter dimensions' })
    @IsObject()
    @IsOptional()
    filters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Group by dimensions', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    groupBy?: string[];
}

export class MetricDataResponseDto {
    @ApiProperty({ description: 'Metric ID' })
    metricId: string;

    @ApiProperty({ description: 'Metric name' })
    metricName: string;

    @ApiProperty({ description: 'Data points', type: [DataPointResponseDto] })
    dataPoints: DataPointResponseDto[];

    @ApiProperty({ description: 'Query parameters' })
    query: MetricDataQueryDto;

    @ApiProperty({ description: 'Total data points' })
    totalPoints: number;
}
