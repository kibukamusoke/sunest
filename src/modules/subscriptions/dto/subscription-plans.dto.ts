import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class SubscriptionPlanDto {
    @ApiProperty({ description: 'Plan ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Plan name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Stripe Price ID' })
    @IsString()
    stripePriceId: string;

    @ApiProperty({ description: 'Stripe Product ID', required: false })
    @IsOptional()
    @IsString()
    stripeProductId?: string;

    @ApiProperty({ description: 'Plan description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Plan amount in cents' })
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Currency code' })
    @IsString()
    currency: string;

    @ApiProperty({ description: 'Billing interval' })
    @IsString()
    interval: string;

    @ApiProperty({ description: 'Plan features' })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({ description: 'Whether plan is active' })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({ description: 'Number of subscribers' })
    @IsNumber()
    subscriberCount: number;

    @ApiProperty({ description: 'App ID for multi-tenancy', required: false })
    @IsOptional()
    @IsString()
    appId?: string;
}

export class SubscriptionPlansResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'List of subscription plans', type: [SubscriptionPlanDto] })
    data: SubscriptionPlanDto[];

    @ApiProperty({ description: 'Response message', required: false })
    message?: string;
}

export class SyncStripePlansResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Synced plans', type: [SubscriptionPlanDto] })
    data: SubscriptionPlanDto[];

    @ApiProperty({ description: 'Response message' })
    message: string;
}

export class StripeProductDto {
    @ApiProperty({ description: 'Stripe Product ID' })
    id: string;

    @ApiProperty({ description: 'Product name' })
    name: string;

    @ApiProperty({ description: 'Whether product is active' })
    active: boolean;

    @ApiProperty({ description: 'Product metadata' })
    metadata: Record<string, any>;
}

export class StripePriceDto {
    @ApiProperty({ description: 'Stripe Price ID' })
    id: string;

    @ApiProperty({ description: 'Product ID' })
    product: string;

    @ApiProperty({ description: 'Price amount in cents', required: false })
    @IsOptional()
    @IsNumber()
    amount?: number | null;

    @ApiProperty({ description: 'Currency code' })
    @IsString()
    currency: string;

    @ApiProperty({ description: 'Billing interval', required: false })
    @IsOptional()
    @IsString()
    interval?: string;

    @ApiProperty({ description: 'Whether price is active' })
    @IsBoolean()
    active: boolean;
}

export class StripeConnectionTestResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Stripe connection test data' })
    data: {
        products: StripeProductDto[];
        prices: StripePriceDto[];
    };

    @ApiProperty({ description: 'Response message' })
    message: string;
} 