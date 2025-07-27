import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class SubscriptionDto {
    @ApiProperty({ description: 'Subscription ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Device ID', required: false })
    @IsOptional()
    @IsString()
    deviceId?: string;

    @ApiProperty({ description: 'Stripe Customer ID', required: false })
    @IsOptional()
    @IsString()
    customerId?: string | null;

    @ApiProperty({ description: 'Stripe Subscription ID', required: false })
    @IsOptional()
    @IsString()
    subscriptionId?: string;

    @ApiProperty({ description: 'Stripe Price ID', required: false })
    @IsOptional()
    @IsString()
    priceId?: string;

    @ApiProperty({ description: 'Subscription status', required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Current period start', required: false })
    @IsOptional()
    currentPeriodStart?: Date | null;

    @ApiProperty({ description: 'Current period end', required: false })
    @IsOptional()
    currentPeriodEnd?: Date | null;

    @ApiProperty({ description: 'Whether subscription is active', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'App ID for multi-tenancy', required: false })
    @IsOptional()
    @IsString()
    appId?: string;

    @ApiProperty({ description: 'Created at timestamp', required: false })
    @IsOptional()
    createdAt?: Date | null;

    @ApiProperty({ description: 'Updated at timestamp', required: false })
    @IsOptional()
    updatedAt?: Date | null;
}

export class PaginationDto {
    @ApiProperty({ description: 'Current page number' })
    @IsNumber()
    page: number;

    @ApiProperty({ description: 'Items per page' })
    @IsNumber()
    limit: number;

    @ApiProperty({ description: 'Total number of items' })
    @IsNumber()
    total: number;

    @ApiProperty({ description: 'Total number of pages' })
    @IsNumber()
    pages: number;

    @ApiProperty({ description: 'Whether there is a next page' })
    @IsBoolean()
    hasNext: boolean;

    @ApiProperty({ description: 'Whether there is a previous page' })
    @IsBoolean()
    hasPrev: boolean;
}

export class SubscriptionsListResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'List of subscriptions', type: [SubscriptionDto] })
    subscriptions: SubscriptionDto[];

    @ApiProperty({ description: 'Total number of subscriptions' })
    total: number;

    @ApiProperty({ description: 'Current page number' })
    page: number;

    @ApiProperty({ description: 'Items per page' })
    limit: number;

    @ApiProperty({ description: 'Total number of pages' })
    pages: number;
} 