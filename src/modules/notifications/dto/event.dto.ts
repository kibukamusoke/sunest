import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsBoolean, IsInt, Min } from 'class-validator';
import { EventType, NotificationPriority } from '@prisma/client';

export class CreateEventDto {
    @ApiProperty({ enum: EventType, description: 'Event type' })
    @IsEnum(EventType)
    type: EventType;

    @ApiProperty({ description: 'Event title' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Event description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Event-specific data' })
    @IsObject()
    @IsOptional()
    data?: any;

    @ApiPropertyOptional({ description: 'User who triggered the event' })
    @IsUUID()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ description: 'Related merchant ID' })
    @IsUUID()
    @IsOptional()
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Related order ID' })
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @ApiPropertyOptional({ description: 'Related product ID' })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiPropertyOptional({ enum: NotificationPriority, description: 'Event severity' })
    @IsEnum(NotificationPriority)
    @IsOptional()
    severity?: NotificationPriority;

    @ApiPropertyOptional({ description: 'System component that generated the event' })
    @IsString()
    @IsOptional()
    source?: string;

    @ApiPropertyOptional({ description: 'IP address' })
    @IsString()
    @IsOptional()
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User agent' })
    @IsString()
    @IsOptional()
    userAgent?: string;
}

export class EventResponseDto {
    @ApiProperty({ description: 'Event ID' })
    id: string;

    @ApiProperty({ enum: EventType, description: 'Event type' })
    type: EventType;

    @ApiProperty({ description: 'Event title' })
    title: string;

    @ApiPropertyOptional({ description: 'Event description' })
    description?: string;

    @ApiPropertyOptional({ description: 'Event-specific data' })
    data?: any;

    @ApiPropertyOptional({ description: 'User who triggered the event' })
    userId?: string;

    @ApiPropertyOptional({ description: 'Related merchant ID' })
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Related order ID' })
    orderId?: string;

    @ApiPropertyOptional({ description: 'Related product ID' })
    productId?: string;

    @ApiProperty({ enum: NotificationPriority, description: 'Event severity' })
    severity: NotificationPriority;

    @ApiPropertyOptional({ description: 'System component that generated the event' })
    source?: string;

    @ApiPropertyOptional({ description: 'IP address' })
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User agent' })
    userAgent?: string;

    @ApiProperty({ description: 'Event processed status' })
    processed: boolean;

    @ApiPropertyOptional({ description: 'When event was processed' })
    processedAt?: Date;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;
}

export class EventListQueryDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Page size' })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ enum: EventType, description: 'Filter by event type' })
    @IsEnum(EventType)
    @IsOptional()
    type?: EventType;

    @ApiPropertyOptional({ description: 'Filter by user ID' })
    @IsUUID()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ description: 'Filter by merchant ID' })
    @IsUUID()
    @IsOptional()
    merchantId?: string;

    @ApiPropertyOptional({ description: 'Filter by order ID' })
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @ApiPropertyOptional({ description: 'Filter by product ID' })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiPropertyOptional({ enum: NotificationPriority, description: 'Filter by severity' })
    @IsEnum(NotificationPriority)
    @IsOptional()
    severity?: NotificationPriority;

    @ApiPropertyOptional({ description: 'Filter by processed status' })
    @IsBoolean()
    @IsOptional()
    processed?: boolean;

    @ApiPropertyOptional({ description: 'Filter by source' })
    @IsString()
    @IsOptional()
    source?: string;

    @ApiPropertyOptional({ description: 'Filter from date (ISO string)' })
    @IsString()
    @IsOptional()
    fromDate?: string;

    @ApiPropertyOptional({ description: 'Filter to date (ISO string)' })
    @IsString()
    @IsOptional()
    toDate?: string;
}

export class EventListResponseDto {
    @ApiProperty({ type: [EventResponseDto], description: 'List of events' })
    events: EventResponseDto[];

    @ApiProperty({ description: 'Total count' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Page size' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class ProcessEventDto {
    @ApiProperty({ description: 'Event ID to process' })
    @IsUUID()
    eventId: string;
}

export class EventStatsDto {
    @ApiProperty({ description: 'Total events' })
    total: number;

    @ApiProperty({ description: 'Events by type' })
    byType: Record<EventType, number>;

    @ApiProperty({ description: 'Events by severity' })
    bySeverity: Record<NotificationPriority, number>;

    @ApiProperty({ description: 'Processed events' })
    processed: number;

    @ApiProperty({ description: 'Unprocessed events' })
    unprocessed: number;

    @ApiProperty({ description: 'Events in last 24 hours' })
    last24Hours: number;

    @ApiProperty({ description: 'Events in last 7 days' })
    last7Days: number;

    @ApiProperty({ description: 'Events in last 30 days' })
    last30Days: number;
}
