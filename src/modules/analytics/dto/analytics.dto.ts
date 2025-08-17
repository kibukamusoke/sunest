import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsBoolean, IsInt, IsArray, IsDateString, Min, Max } from 'class-validator';
import { TimeGranularity } from '@prisma/client';

export class CreateAnalyticsSessionDto {
    @ApiProperty({ description: 'Session ID' })
    @IsString()
    sessionId: string;

    @ApiPropertyOptional({ description: 'User ID' })
    @IsUUID()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ description: 'IP address' })
    @IsString()
    @IsOptional()
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User agent' })
    @IsString()
    @IsOptional()
    userAgent?: string;

    @ApiPropertyOptional({ description: 'Device type' })
    @IsString()
    @IsOptional()
    deviceType?: string;

    @ApiPropertyOptional({ description: 'Browser type' })
    @IsString()
    @IsOptional()
    browserType?: string;

    @ApiPropertyOptional({ description: 'Platform' })
    @IsString()
    @IsOptional()
    platform?: string;

    @ApiPropertyOptional({ description: 'Country' })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({ description: 'Region' })
    @IsString()
    @IsOptional()
    region?: string;

    @ApiPropertyOptional({ description: 'City' })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ description: 'Session start time' })
    @IsDateString()
    startTime: string;

    @ApiPropertyOptional({ description: 'Merchant ID' })
    @IsUUID()
    @IsOptional()
    merchantId?: string;
}

export class UpdateAnalyticsSessionDto {
    @ApiPropertyOptional({ description: 'Session end time' })
    @IsDateString()
    @IsOptional()
    endTime?: string;

    @ApiPropertyOptional({ description: 'Session duration in seconds' })
    @IsInt()
    @Min(0)
    @IsOptional()
    duration?: number;

    @ApiPropertyOptional({ description: 'Page views count' })
    @IsInt()
    @Min(0)
    @IsOptional()
    pageViews?: number;

    @ApiPropertyOptional({ description: 'Events count' })
    @IsInt()
    @Min(0)
    @IsOptional()
    eventCount?: number;

    @ApiPropertyOptional({ description: 'Order ID if purchase made' })
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @ApiPropertyOptional({ description: 'Revenue generated' })
    @IsOptional()
    revenue?: number;
}

export class AnalyticsSessionResponseDto {
    @ApiProperty({ description: 'Session ID' })
    id: string;

    @ApiProperty({ description: 'Unique session identifier' })
    sessionId: string;

    @ApiPropertyOptional({ description: 'User ID' })
    userId?: string;

    @ApiPropertyOptional({ description: 'IP address' })
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User agent' })
    userAgent?: string;

    @ApiPropertyOptional({ description: 'Device type' })
    deviceType?: string;

    @ApiPropertyOptional({ description: 'Browser type' })
    browserType?: string;

    @ApiPropertyOptional({ description: 'Platform' })
    platform?: string;

    @ApiPropertyOptional({ description: 'Country' })
    country?: string;

    @ApiPropertyOptional({ description: 'Region' })
    region?: string;

    @ApiPropertyOptional({ description: 'City' })
    city?: string;

    @ApiProperty({ description: 'Session start time' })
    startTime: Date;

    @ApiPropertyOptional({ description: 'Session end time' })
    endTime?: Date;

    @ApiPropertyOptional({ description: 'Session duration in seconds' })
    duration?: number;

    @ApiProperty({ description: 'Page views count' })
    pageViews: number;

    @ApiProperty({ description: 'Events count' })
    eventCount: number;

    @ApiPropertyOptional({ description: 'Merchant ID' })
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Order ID' })
    orderId?: string;

    @ApiPropertyOptional({ description: 'Revenue generated' })
    revenue?: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class CreateAnalyticsEventDto {
    @ApiProperty({ description: 'Session ID' })
    @IsString()
    sessionId: string;

    @ApiProperty({ description: 'Event type' })
    @IsString()
    eventType: string;

    @ApiProperty({ description: 'Event name' })
    @IsString()
    eventName: string;

    @ApiPropertyOptional({ description: 'Event category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Event action' })
    @IsString()
    @IsOptional()
    action?: string;

    @ApiPropertyOptional({ description: 'Event label' })
    @IsString()
    @IsOptional()
    label?: string;

    @ApiPropertyOptional({ description: 'Event value' })
    @IsOptional()
    value?: number;

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

    @ApiPropertyOptional({ description: 'Page URL' })
    @IsString()
    @IsOptional()
    pageUrl?: string;

    @ApiPropertyOptional({ description: 'Page title' })
    @IsString()
    @IsOptional()
    pageTitle?: string;

    @ApiPropertyOptional({ description: 'Referrer URL' })
    @IsString()
    @IsOptional()
    referrer?: string;

    @ApiPropertyOptional({ description: 'Custom properties' })
    @IsObject()
    @IsOptional()
    properties?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Event timestamp' })
    @IsDateString()
    @IsOptional()
    timestamp?: string;
}

export class AnalyticsEventResponseDto {
    @ApiProperty({ description: 'Event ID' })
    id: string;

    @ApiProperty({ description: 'Session ID' })
    sessionId: string;

    @ApiProperty({ description: 'Event type' })
    eventType: string;

    @ApiProperty({ description: 'Event name' })
    eventName: string;

    @ApiPropertyOptional({ description: 'Event category' })
    category?: string;

    @ApiPropertyOptional({ description: 'Event action' })
    action?: string;

    @ApiPropertyOptional({ description: 'Event label' })
    label?: string;

    @ApiPropertyOptional({ description: 'Event value' })
    value?: number;

    @ApiPropertyOptional({ description: 'User ID' })
    userId?: string;

    @ApiPropertyOptional({ description: 'Merchant ID' })
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Product ID' })
    productId?: string;

    @ApiPropertyOptional({ description: 'Order ID' })
    orderId?: string;

    @ApiPropertyOptional({ description: 'Page URL' })
    pageUrl?: string;

    @ApiPropertyOptional({ description: 'Page title' })
    pageTitle?: string;

    @ApiPropertyOptional({ description: 'Referrer URL' })
    referrer?: string;

    @ApiPropertyOptional({ description: 'Custom properties' })
    properties?: Record<string, any>;

    @ApiProperty({ description: 'Event timestamp' })
    timestamp: Date;
}

export class BusinessMetricQueryDto {
    @ApiProperty({ description: 'Start date' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ description: 'End date' })
    @IsDateString()
    endDate: string;

    @ApiPropertyOptional({ enum: TimeGranularity, description: 'Time granularity' })
    @IsEnum(TimeGranularity)
    @IsOptional()
    granularity?: TimeGranularity;

    @ApiPropertyOptional({ description: 'Metric category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Merchant ID filter' })
    @IsUUID()
    @IsOptional()
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Product ID filter' })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiPropertyOptional({ description: 'User ID filter' })
    @IsUUID()
    @IsOptional()
    userId?: string;
}

export class BusinessMetricResponseDto {
    @ApiProperty({ description: 'Metric ID' })
    id: string;

    @ApiProperty({ description: 'Metric name' })
    name: string;

    @ApiProperty({ description: 'Metric category' })
    category: string;

    @ApiPropertyOptional({ description: 'Metric description' })
    description?: string;

    @ApiProperty({ description: 'Date' })
    date: Date;

    @ApiProperty({ enum: TimeGranularity, description: 'Time granularity' })
    granularity: TimeGranularity;

    @ApiPropertyOptional({ description: 'Total revenue' })
    totalRevenue?: number;

    @ApiPropertyOptional({ description: 'Total orders' })
    totalOrders?: number;

    @ApiPropertyOptional({ description: 'Total users' })
    totalUsers?: number;

    @ApiPropertyOptional({ description: 'Active users' })
    activeUsers?: number;

    @ApiPropertyOptional({ description: 'New users' })
    newUsers?: number;

    @ApiPropertyOptional({ description: 'Average order value' })
    averageOrderValue?: number;

    @ApiPropertyOptional({ description: 'Conversion rate' })
    conversionRate?: number;

    @ApiPropertyOptional({ description: 'Customer lifetime value' })
    customerLifetimeValue?: number;

    @ApiPropertyOptional({ description: 'Active merchants' })
    activeMerchants?: number;

    @ApiPropertyOptional({ description: 'New merchants' })
    newMerchants?: number;

    @ApiPropertyOptional({ description: 'Merchant revenue' })
    merchantRevenue?: number;

    @ApiPropertyOptional({ description: 'Average orders per merchant' })
    averageOrdersPerMerchant?: number;

    @ApiPropertyOptional({ description: 'Total products' })
    totalProducts?: number;

    @ApiPropertyOptional({ description: 'Active products' })
    activeProducts?: number;

    @ApiPropertyOptional({ description: 'Product views' })
    productViews?: number;

    @ApiPropertyOptional({ description: 'Add to cart rate' })
    addToCartRate?: number;

    @ApiPropertyOptional({ description: 'Average fulfillment time (hours)' })
    averageFulfillmentTime?: number;

    @ApiPropertyOptional({ description: 'Shipping cost' })
    shippingCost?: number;

    @ApiPropertyOptional({ description: 'Return rate' })
    returnRate?: number;

    @ApiPropertyOptional({ description: 'Customer satisfaction' })
    customerSatisfaction?: number;

    @ApiPropertyOptional({ description: 'Custom metrics' })
    customMetrics?: Record<string, any>;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;
}

export class AnalyticsOverviewDto {
    @ApiProperty({ description: 'Total revenue' })
    totalRevenue: number;

    @ApiProperty({ description: 'Revenue growth percentage' })
    revenueGrowth: number;

    @ApiProperty({ description: 'Total orders' })
    totalOrders: number;

    @ApiProperty({ description: 'Orders growth percentage' })
    ordersGrowth: number;

    @ApiProperty({ description: 'Total users' })
    totalUsers: number;

    @ApiProperty({ description: 'Users growth percentage' })
    usersGrowth: number;

    @ApiProperty({ description: 'Average order value' })
    averageOrderValue: number;

    @ApiProperty({ description: 'AOV growth percentage' })
    aovGrowth: number;

    @ApiProperty({ description: 'Conversion rate' })
    conversionRate: number;

    @ApiProperty({ description: 'Active merchants' })
    activeMerchants: number;

    @ApiProperty({ description: 'Top products by revenue' })
    topProducts: Array<{
        productId: string;
        productName: string;
        revenue: number;
        orders: number;
    }>;

    @ApiProperty({ description: 'Top merchants by revenue' })
    topMerchants: Array<{
        merchantId: string;
        merchantName: string;
        revenue: number;
        orders: number;
    }>;

    @ApiProperty({ description: 'Revenue by time period' })
    revenueChart: Array<{
        date: string;
        revenue: number;
    }>;

    @ApiProperty({ description: 'Orders by time period' })
    ordersChart: Array<{
        date: string;
        orders: number;
    }>;
}

export class AnalyticsQueryDto {
    @ApiPropertyOptional({ description: 'Start date' })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date' })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({ enum: TimeGranularity, description: 'Time granularity' })
    @IsEnum(TimeGranularity)
    @IsOptional()
    granularity?: TimeGranularity;

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
}
