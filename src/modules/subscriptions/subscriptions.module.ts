import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { StripeService } from './stripe.service';
import { DeviceService } from './device.service';
import { SubscriptionLimitService } from './subscription-limit.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
    imports: [ConfigModule],
    controllers: [SubscriptionsController, StripeWebhookController, CustomersController],
    providers: [
        SubscriptionsService,
        StripeService,
        DeviceService,
        SubscriptionLimitService,
        CustomersService,
    ],
    exports: [
        SubscriptionsService,
        StripeService,
        DeviceService,
        SubscriptionLimitService,
        CustomersService,
    ],
})
export class SubscriptionsModule { } 