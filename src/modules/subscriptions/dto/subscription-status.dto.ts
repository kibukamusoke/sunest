import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionStatusDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Subscription status information' })
    data: {
        hasActiveSubscription: boolean;
        maxServers: number;
        canViewLogs: boolean;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
}

export class ServerLimitsDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Server creation limits' })
    data: {
        canCreate: boolean;
        currentCount: number;
        maxServers: number;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
}

export class LogAccessDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Log access information' })
    data: {
        canViewLogs: boolean;
        hasActiveSubscription: boolean;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
}

export class CheckoutSessionDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Checkout session information' })
    data: {
        url: string;
        sessionId: string;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
}

export class CreateCheckoutDto {
    @ApiProperty({ description: 'Stripe Price ID' })
    priceId: string;

    @ApiProperty({ description: 'Device ID' })
    deviceId: string;

    @ApiProperty({ description: 'Customer email' })
    email: string;

    @ApiProperty({ description: 'Customer display name', required: false })
    displayName?: string;

    @ApiProperty({ description: 'Success URL', required: false })
    successUrl?: string;

    @ApiProperty({ description: 'Cancel URL', required: false })
    cancelUrl?: string;

    @ApiProperty({ description: 'App ID', required: false })
    appId?: string;
}

export class PaymentIntentDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Payment intent information' })
    data: {
        clientSecret: string;
        customerId: string;
        subscriptionId: string;
    };

    @ApiProperty({ description: 'Response message' })
    message?: string;
}

export class CreatePaymentIntentDto {
    @ApiProperty({ description: 'Stripe Price ID' })
    priceId: string;

    @ApiProperty({ description: 'Device ID' })
    deviceId: string;

    @ApiProperty({ description: 'Customer email' })
    email: string;

    @ApiProperty({ description: 'Customer display name', required: false })
    displayName?: string;

    @ApiProperty({ description: 'App ID', required: false })
    appId?: string;
} 