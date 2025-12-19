import { TimeGranularity } from '@prisma/client';
export declare class CreateAnalyticsSessionDto {
    sessionId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    browserType?: string;
    platform?: string;
    country?: string;
    region?: string;
    city?: string;
    startTime: string;
    merchantId?: string;
}
export declare class UpdateAnalyticsSessionDto {
    endTime?: string;
    duration?: number;
    pageViews?: number;
    eventCount?: number;
    orderId?: string;
    revenue?: number;
}
export declare class AnalyticsSessionResponseDto {
    id: string;
    sessionId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    browserType?: string;
    platform?: string;
    country?: string;
    region?: string;
    city?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    pageViews: number;
    eventCount: number;
    merchantId?: string;
    orderId?: string;
    revenue?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateAnalyticsEventDto {
    sessionId: string;
    eventType: string;
    eventName: string;
    category?: string;
    action?: string;
    label?: string;
    value?: number;
    userId?: string;
    merchantId?: string;
    productId?: string;
    orderId?: string;
    pageUrl?: string;
    pageTitle?: string;
    referrer?: string;
    properties?: Record<string, any>;
    timestamp?: string;
}
export declare class AnalyticsEventResponseDto {
    id: string;
    sessionId: string;
    eventType: string;
    eventName: string;
    category?: string;
    action?: string;
    label?: string;
    value?: number;
    userId?: string;
    merchantId?: string;
    productId?: string;
    orderId?: string;
    pageUrl?: string;
    pageTitle?: string;
    referrer?: string;
    properties?: Record<string, any>;
    timestamp: Date;
}
export declare class BusinessMetricQueryDto {
    startDate: string;
    endDate: string;
    granularity?: TimeGranularity;
    category?: string;
    merchantId?: string;
    productId?: string;
    userId?: string;
}
export declare class BusinessMetricResponseDto {
    id: string;
    name: string;
    category: string;
    description?: string;
    date: Date;
    granularity: TimeGranularity;
    totalRevenue?: number;
    totalOrders?: number;
    totalUsers?: number;
    activeUsers?: number;
    newUsers?: number;
    averageOrderValue?: number;
    conversionRate?: number;
    customerLifetimeValue?: number;
    activeMerchants?: number;
    newMerchants?: number;
    merchantRevenue?: number;
    averageOrdersPerMerchant?: number;
    totalProducts?: number;
    activeProducts?: number;
    productViews?: number;
    addToCartRate?: number;
    averageFulfillmentTime?: number;
    shippingCost?: number;
    returnRate?: number;
    customerSatisfaction?: number;
    customMetrics?: Record<string, any>;
    createdAt: Date;
}
export declare class AnalyticsOverviewDto {
    revenue: number;
    revenueGrowth: number;
    orders: number;
    ordersGrowth: number;
    activeUsers: number;
    newUsers: number;
    averageOrderValue: number;
    averageOrderValueGrowth: number;
    conversionRate: number;
    conversionRateGrowth: number;
    activeMerchants: number;
    topProducts: Array<{
        productId: string;
        productName: string;
        revenue: number;
        orders: number;
    }>;
    topMerchants: Array<{
        merchantId: string;
        merchantName: string;
        revenue: number;
        orders: number;
    }>;
    revenueChart: Array<{
        date: string;
        revenue: number;
    }>;
    ordersChart: Array<{
        date: string;
        orders: number;
    }>;
}
export declare class AnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    granularity?: TimeGranularity;
    page?: number;
    limit?: number;
}
