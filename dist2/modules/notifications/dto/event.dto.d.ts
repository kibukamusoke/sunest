import { EventType, NotificationPriority } from '@prisma/client';
export declare class CreateEventDto {
    type: EventType;
    title: string;
    description?: string;
    data?: any;
    userId?: string;
    merchantId?: string;
    orderId?: string;
    productId?: string;
    severity?: NotificationPriority;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class EventResponseDto {
    id: string;
    type: EventType;
    title: string;
    description?: string;
    data?: any;
    userId?: string;
    merchantId?: string;
    orderId?: string;
    productId?: string;
    severity: NotificationPriority;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
    processed: boolean;
    processedAt?: Date;
    createdAt: Date;
}
export declare class EventListQueryDto {
    page?: number;
    limit?: number;
    type?: EventType;
    userId?: string;
    merchantId?: string;
    orderId?: string;
    productId?: string;
    severity?: NotificationPriority;
    processed?: boolean;
    source?: string;
    fromDate?: string;
    toDate?: string;
}
export declare class EventListResponseDto {
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class ProcessEventDto {
    eventId: string;
}
export declare class EventStatsDto {
    total: number;
    byType: Record<EventType, number>;
    bySeverity: Record<NotificationPriority, number>;
    processed: number;
    unprocessed: number;
    last24Hours: number;
    last7Days: number;
    last30Days: number;
}
