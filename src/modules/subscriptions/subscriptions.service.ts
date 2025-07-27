import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { StripeService } from './stripe.service';
import { DeviceService } from './device.service';
import { Subscription, SubscriptionStatus } from '@prisma/client';
import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
    @ApiProperty({ description: 'Device ID' })
    deviceId: string;

    @ApiProperty({ description: 'Customer email' })
    email: string;

    @ApiProperty({ description: 'Stripe price ID' })
    priceId: string;

    @ApiProperty({ description: 'Success URL after payment' })
    successUrl: string;

    @ApiProperty({ description: 'Cancel URL if payment is cancelled' })
    cancelUrl: string;

    @ApiProperty({ description: 'Display name for the customer', required: false })
    displayName?: string;

    @ApiProperty({ description: 'Phone number', required: false })
    phone?: string;

    @ApiProperty({ description: 'Address line 1', required: false })
    addressLine1?: string;

    @ApiProperty({ description: 'Address line 2', required: false })
    addressLine2?: string;

    @ApiProperty({ description: 'City', required: false })
    city?: string;

    @ApiProperty({ description: 'State/Province', required: false })
    state?: string;

    @ApiProperty({ description: 'Postal/Zip code', required: false })
    postalCode?: string;

    @ApiProperty({ description: 'Country', required: false })
    country?: string;

    @ApiProperty({ description: 'App ID', required: false })
    appId?: string; // Optional for backward compatibility
}

export interface SubscriptionWithDetails {
    id: string;
    userId: string;
    customerId: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    status: string;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    canceledAt: Date | null;
    trialStart: Date | null;
    trialEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        email: string;
        displayName: string | null;
    };
    customer?: {
        id: string;
        email: string;
        displayName: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
        stripeCustomerId: string | null;
    };
}

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(
        private prisma: PrismaService,
        private stripeService: StripeService,
        private deviceService: DeviceService,
    ) { }

    // Helper method to get default app ID for backward compatibility
    private async getDefaultAppId(): Promise<string> {
        const defaultApp = await this.prisma.app.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
        if (!defaultApp) {
            throw new Error('No active app found. Please create an app first.');
        }
        return defaultApp.id;
    }

    async getSubscriptionByDeviceId(deviceId: string): Promise<any | null> {
        // include customer
        return this.prisma.subscription.findFirst({
            where: { deviceId },
            include: {
                customer: true,
            },
        });
    }

    async createPaymentIntent(data: CreateSubscriptionDto): Promise<{ clientSecret: string; customerId: string; subscriptionId: string }> {
        try {
            // Get appId from data or use default
            const appId = data.appId || await this.getDefaultAppId();

            // First, check if user already exists or create new user
            let user = await this.prisma.user.findUnique({
                where: {
                    email_appId: {
                        email: data.email,
                        appId: appId
                    }
                },
            });

            if (!user) {
                // Create new user
                user = await this.prisma.user.create({
                    data: {
                        email: data.email,
                        displayName: data.displayName,
                        emailVerified: true, // Auto-verify for subscription users
                        appId: appId,
                        roles: {
                            connect: [{ name: 'user' }],
                        },
                    },
                });
            }

            // Create or get customer record
            let customer = await this.prisma.customer.findUnique({
                where: {
                    email_appId: {
                        email: data.email,
                        appId: appId
                    }
                },
            });

            if (!customer) {
                // Create new customer record
                customer = await this.prisma.customer.create({
                    data: {
                        email: data.email,
                        displayName: data.displayName,
                        phone: data.phone,
                        addressLine1: data.addressLine1,
                        addressLine2: data.addressLine2,
                        city: data.city,
                        state: data.state,
                        postalCode: data.postalCode,
                        country: data.country,
                        userId: user.id,
                        appId: appId,
                    },
                });
            } else {
                // Update existing customer with new address information
                customer = await this.prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        displayName: data.displayName || customer.displayName,
                        phone: data.phone || customer.phone,
                        addressLine1: data.addressLine1 || customer.addressLine1,
                        addressLine2: data.addressLine2 || customer.addressLine2,
                        city: data.city || customer.city,
                        state: data.state || customer.state,
                        postalCode: data.postalCode || customer.postalCode,
                        country: data.country || customer.country,
                    },
                });
            }

            // Create or get Stripe customer
            let stripeCustomer: Stripe.Customer;
            if (customer.stripeCustomerId) {
                // Get existing customer
                stripeCustomer = await this.stripeService.stripe.customers.retrieve(
                    customer.stripeCustomerId,
                ) as Stripe.Customer;
            } else {
                // Create new Stripe customer
                stripeCustomer = await this.stripeService.createCustomer(
                    customer.email,
                    customer.displayName || undefined,
                    customer.phone || undefined,
                    customer.addressLine1 || undefined,
                    customer.addressLine2 || undefined,
                    customer.city || undefined,
                    customer.state || undefined,
                    customer.postalCode || undefined,
                    customer.country || undefined,
                );

                // Update customer record with Stripe customer ID
                customer = await this.prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        stripeCustomerId: stripeCustomer.id,
                    },
                });
            }

            // Create payment intent/setup intent for mobile payment sheet
            const paymentIntent = await this.stripeService.createPaymentIntent({
                customerId: stripeCustomer.id,
                priceId: data.priceId,
                metadata: {
                    userId: user.id,
                    customerId: customer.id,
                    deviceId: data.deviceId,
                    appId: appId,
                },
            });

            // Link device to user
            await this.deviceService.linkDeviceToUser(data.deviceId, user.id, appId);

            return {
                clientSecret: paymentIntent.clientSecret,
                customerId: paymentIntent.customerId,
                subscriptionId: paymentIntent.subscriptionId,
            };
        } catch (error) {
            this.logger.error(`Failed to create payment intent: ${error.message}`);
            throw error;
        }
    }

    async createCheckoutSession(data: CreateSubscriptionDto): Promise<{ checkoutUrl: string }> {
        try {
            // Get appId from data or use default
            const appId = data.appId || await this.getDefaultAppId();

            // First, check if user already exists or create new user
            let user = await this.prisma.user.findUnique({
                where: {
                    email_appId: {
                        email: data.email,
                        appId: appId
                    }
                },
            });

            if (!user) {
                // Create new user
                user = await this.prisma.user.create({
                    data: {
                        email: data.email,
                        displayName: data.displayName,
                        emailVerified: true, // Auto-verify for subscription users
                        appId: appId,
                        roles: {
                            connect: [{ name: 'user' }],
                        },
                    },
                });
            }

            // Create or get customer record
            let customer = await this.prisma.customer.findUnique({
                where: {
                    email_appId: {
                        email: data.email,
                        appId: appId
                    }
                },
            });

            if (!customer) {
                // Create new customer record
                customer = await this.prisma.customer.create({
                    data: {
                        email: data.email,
                        displayName: data.displayName,
                        phone: data.phone,
                        addressLine1: data.addressLine1,
                        addressLine2: data.addressLine2,
                        city: data.city,
                        state: data.state,
                        postalCode: data.postalCode,
                        country: data.country,
                        userId: user.id,
                        appId: appId,
                    },
                });
            } else {
                // Update existing customer with new address information
                customer = await this.prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        displayName: data.displayName || customer.displayName,
                        phone: data.phone || customer.phone,
                        addressLine1: data.addressLine1 || customer.addressLine1,
                        addressLine2: data.addressLine2 || customer.addressLine2,
                        city: data.city || customer.city,
                        state: data.state || customer.state,
                        postalCode: data.postalCode || customer.postalCode,
                        country: data.country || customer.country,
                    },
                });
            }

            // Create or get Stripe customer
            let stripeCustomer: Stripe.Customer;
            if (customer.stripeCustomerId) {
                // Get existing customer
                stripeCustomer = await this.stripeService.stripe.customers.retrieve(
                    customer.stripeCustomerId,
                ) as Stripe.Customer;
            } else {
                // Create new Stripe customer
                stripeCustomer = await this.stripeService.createCustomer(
                    customer.email,
                    customer.displayName || undefined,
                    customer.phone || undefined,
                    customer.addressLine1 || undefined,
                    customer.addressLine2 || undefined,
                    customer.city || undefined,
                    customer.state || undefined,
                    customer.postalCode || undefined,
                    customer.country || undefined,
                );

                // Update customer record with Stripe customer ID
                customer = await this.prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        stripeCustomerId: stripeCustomer.id,
                    },
                });
            }

            // Create checkout session
            const checkoutSession = await this.stripeService.createCheckoutSession({
                customerId: stripeCustomer.id,
                priceId: data.priceId,
                successUrl: data.successUrl,
                cancelUrl: data.cancelUrl,
                metadata: {
                    userId: user.id,
                    customerId: customer.id,
                    deviceId: data.deviceId,
                    appId: appId,
                },
            });

            // Link device to user
            await this.deviceService.linkDeviceToUser(data.deviceId, user.id, appId);

            return { checkoutUrl: checkoutSession.url! };
        } catch (error) {
            this.logger.error(`Failed to create checkout session: ${error.message}`);
            throw error;
        }
    }

    async createPortalSession(userId: string, returnUrl: string): Promise<{ portalUrl: string }> {
        try {
            const subscription = await this.prisma.subscription.findFirst({
                where: {
                    userId,
                    stripeCustomerId: { not: null },
                },
                orderBy: { createdAt: 'desc' },
            });

            if (!subscription?.stripeCustomerId) {
                throw new NotFoundException('No active subscription found');
            }

            const portalSession = await this.stripeService.createPortalSession(
                subscription.stripeCustomerId,
                returnUrl,
            );

            return { portalUrl: portalSession.url };
        } catch (error) {
            this.logger.error(`Failed to create portal session: ${error.message}`);
            throw error;
        }
    }

    async handleStripeWebhook(event: Stripe.Event): Promise<void> {
        try {
            // CHANGE 1: Add comprehensive logging to track all webhook events
            // This helps debug which events are being received and processed
            this.logger.log(`🔔 WEBHOOK RECEIVED: ${event.type} - Event ID: ${event.id}`);
            this.logger.log(`🔔 Event created: ${new Date(event.created * 1000).toISOString()}`);

            // Log the webhook event
            await this.logWebhookEvent(event);

            // Check if this event was already processed
            const existingEvent = await this.prisma.subscriptionEvent.findUnique({
                where: { stripeEventId: event.id },
            });

            if (existingEvent && existingEvent.processed) {
                this.logger.log(`Webhook event ${event.id} was already processed. Skipping.`);
                return;
            }

            switch (event.type) {
                // CHANGE 2: Add setup_intent.succeeded handler - THIS IS CRITICAL
                // This is the missing piece that processes payment method attachment
                // and triggers subscription activation after setup intent completion
                case 'setup_intent.succeeded':
                    this.logger.log(`🎯 Processing setup_intent.succeeded: ${event.id}`);
                    await this.handleSetupIntentSucceeded(event.data.object as Stripe.SetupIntent);
                    break;

                case 'checkout.session.completed':
                    // CHANGE 3: Add detailed logging for each event type
                    // This helps track the flow and identify where issues occur
                    this.logger.log(`🎯 Processing checkout.session.completed: ${event.id}`);
                    await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                    break;
                case 'customer.subscription.created':
                    this.logger.log(`🎯 Processing customer.subscription.created: ${event.id}`);
                    await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                    break;
                case 'customer.subscription.updated':
                    this.logger.log(`🎯 Processing customer.subscription.updated: ${event.id}`);
                    await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                    break;
                case 'customer.subscription.deleted':
                    this.logger.log(`🎯 Processing customer.subscription.deleted: ${event.id}`);
                    await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                    break;
                case 'invoice.created':
                    this.logger.log(`🎯 Processing invoice.created: ${event.id}`);
                    // Handle invoice creation - usually just log it
                    this.logger.log(`Invoice created: ${(event.data.object as Stripe.Invoice).id}`);
                    break;
                case 'invoice.finalized':
                    this.logger.log(`🎯 Processing invoice.finalized: ${event.id}`);
                    await this.handleInvoiceFinalized(event.data.object as Stripe.Invoice);
                    break;
                case 'invoice.payment_failed':
                    this.logger.log(`🎯 Processing invoice.payment_failed: ${event.id}`);
                    await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
                    break;
                case 'invoice.payment_succeeded':
                    this.logger.log(`🎯 Processing invoice.payment_succeeded: ${event.id}`);
                    await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
                    break;
                case 'payment_intent.succeeded':
                    this.logger.log(`🎯 Processing payment_intent.succeeded: ${event.id}`);
                    await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                    break;
                default:
                    // CHANGE 4: Enhanced logging for unhandled events
                    // This helps identify new event types that might need handling
                    this.logger.log(`⚠️ Unhandled webhook event type: ${event.type} - Event ID: ${event.id}`);
            }

            // Mark event as processed
            await this.markEventAsProcessed(event.id);

            // CHANGE 5: Add success confirmation logging
            // This confirms each webhook was processed successfully
            this.logger.log(`✅ Successfully processed webhook event: ${event.type} - ${event.id}`);

        } catch (error) {
            // CHANGE 6: Enhanced error logging with stack traces
            // This helps debug webhook processing failures
            this.logger.error(`❌ Failed to handle webhook ${event.type} - ${event.id}: ${error.message}`);
            this.logger.error(`❌ Error stack: ${error.stack}`);
            await this.markEventAsProcessed(event.id, error.message);
            throw error;
        }
    }

    private async logWebhookEvent(event: Stripe.Event): Promise<void> {
        await this.prisma.subscriptionEvent.upsert({
            where: { stripeEventId: event.id },
            update: {
                eventType: event.type,
                eventData: event.data.object as any,
                // Don't update processed status - keep existing value
            },
            create: {
                stripeEventId: event.id,
                eventType: event.type,
                eventData: event.data.object as any,
                processed: false,
            },
        });
    }

    private async markEventAsProcessed(eventId: string, error?: string): Promise<void> {
        await this.prisma.subscriptionEvent.update({
            where: { stripeEventId: eventId },
            data: {
                processed: true,
                processingError: error || null,
            },
        });
    }

    private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
        const userId = session.metadata?.userId;
        const deviceId = session.metadata?.deviceId;
        const appId = session.metadata?.appId;

        if (!userId) {
            throw new BadRequestException('User ID not found in checkout session metadata');
        }

        // The actual subscription will be handled by the subscription.created webhook
        this.logger.log(`Checkout session completed for user: ${userId}`);
    }

    private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
        const customer = await this.stripeService.stripe.customers.retrieve(
            subscription.customer as string,
        ) as Stripe.Customer;

        // Get appId from subscription metadata, or use default
        const metadata = subscription.metadata || {};
        const appId = metadata.appId || await this.getDefaultAppId();
        const customerId = metadata.customerId;

        const user = await this.prisma.user.findUnique({
            where: {
                email_appId: {
                    email: customer.email!,
                    appId: appId
                }
            },
        });

        if (!user) {
            throw new NotFoundException('User not found for subscription');
        }

        // Find the customer record
        let customerRecord: any = null;
        if (customerId) {
            customerRecord = await this.prisma.customer.findUnique({
                where: { id: customerId },
            });
        }

        if (!customerRecord) {
            // Fallback: find customer by email and appId
            customerRecord = await this.prisma.customer.findUnique({
                where: {
                    email_appId: {
                        email: customer.email!,
                        appId: appId
                    }
                },
            });
        }

        await this.prisma.subscription.create({
            data: {
                userId: user.id,
                deviceId: metadata.deviceId || null, // Link subscription to specific device
                customerId: customerRecord?.id || null,
                appId: appId,
                stripeCustomerId: customer.id,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                status: this.stripeService.getSubscriptionStatus(subscription),
                currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            },
        });

        this.logger.log(`Subscription created for user: ${user.id}, customer: ${customerRecord?.id || 'none'}`);
    }

    private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
        await this.prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: this.stripeService.getSubscriptionStatus(subscription),
                currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
                trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            },
        });

        this.logger.log(`Subscription updated: ${subscription.id}`);
    }

    private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        await this.prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: 'CANCELED',
                canceledAt: new Date(),
            },
        });

        this.logger.log(`Subscription deleted: ${subscription.id}`);
    }

    private async handleInvoiceFinalized(invoice: Stripe.Invoice): Promise<void> {
        try {
            this.logger.log(`Invoice finalized: ${invoice.id}, status: ${invoice.status}, amount: ${invoice.amount_due}`);

            // Check if this invoice is linked to a subscription
            if ((invoice as any).subscription) {
                const subscriptionId = (invoice as any).subscription as string;
                this.logger.log(`Invoice ${invoice.id} linked to subscription: ${subscriptionId}`);

                // Log some key invoice details for debugging
                this.logger.log(`Invoice ${invoice.id} details: status=${invoice.status}, amount_due=${invoice.amount_due}, payment_intent=${(invoice as any).payment_intent || 'none'}`);
            }
        } catch (error) {
            this.logger.error(`Failed to handle invoice finalized: ${error.message}`);
        }
    }

    private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        if ((invoice as any).subscription) {
            await this.prisma.subscription.update({
                where: { stripeSubscriptionId: (invoice as any).subscription as string },
                data: {
                    status: SubscriptionStatus.PAST_DUE,
                },
            });
        }

        this.logger.log(`Payment failed for invoice: ${invoice.id}`);
    }

    private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
        this.logger.log(`💰 Invoice payment succeeded: ${invoice.id}`);

        if ((invoice as any).subscription) {
            const subscriptionId = (invoice as any).subscription as string;
            this.logger.log(`Invoice details: subscription=${subscriptionId}, customer=${invoice.customer}`);

            const subscription = await this.stripeService.getSubscription(subscriptionId);

            // Update subscription status in database
            await this.prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: {
                    status: this.stripeService.getSubscriptionStatus(subscription),
                },
            });

            this.logger.log(`✅ Updated subscription ${subscriptionId} status to ${this.stripeService.getSubscriptionStatus(subscription)}`);
        }

        this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
    }

    private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        try {
            this.logger.log(`💳 Payment intent succeeded: ${paymentIntent.id}`);

            // Check if this payment intent is linked to an invoice
            if ((paymentIntent as any).invoice) {
                this.logger.log(`Payment intent linked to invoice: ${(paymentIntent as any).invoice}`);
                // The invoice.payment_succeeded event will handle the subscription activation
                return;
            }

            // Fallback: Check for subscription metadata (for backward compatibility)
            const subscriptionId = paymentIntent.metadata?.subscription_id;
            const invoiceId = paymentIntent.metadata?.invoice_id;

            if (subscriptionId && invoiceId) {
                this.logger.log(`Payment intent succeeded for subscription: ${subscriptionId}, invoice: ${invoiceId}, amount: ${paymentIntent.amount}`);

                // The payment has already been processed by Stripe
                // We just need to check and update the subscription status
                const subscription = await this.stripeService.getSubscription(subscriptionId);

                this.logger.log(`Subscription ${subscriptionId} status after payment: ${subscription.status}`);

                // Update our database with the latest subscription status
                await this.prisma.subscription.update({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: {
                        status: this.stripeService.getSubscriptionStatus(subscription),
                    },
                });

                this.logger.log(`Updated subscription ${subscriptionId} in database with status: ${this.stripeService.getSubscriptionStatus(subscription)}`);
            } else {
                this.logger.log(`Payment intent ${paymentIntent.id} succeeded but no invoice or subscription metadata found`);
            }
        } catch (error) {
            this.logger.error(`Failed to handle payment intent succeeded: ${error.message}`);
        }
    }

    // CHANGE 7: Add the missing handleSetupIntentSucceeded method
    // This is the core method that processes setup intent completion
    // and triggers subscription activation
    private async handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent): Promise<void> {
        try {
            this.logger.log(`🔧 Setup intent succeeded: ${setupIntent.id}`);
            this.logger.log(`Setup intent details: customer=${setupIntent.customer}, payment_method=${setupIntent.payment_method}`);

            const metadata = setupIntent.metadata || {};
            const subscriptionId = metadata.subscription_id;
            const invoiceId = metadata.invoice_id;

            this.logger.log(`Metadata: subscription=${subscriptionId}, invoice=${invoiceId}`);

            if (!subscriptionId) {
                this.logger.log(`Setup intent ${setupIntent.id} has no subscription metadata, skipping`);
                return;
            }

            this.logger.log(`📋 Processing setup intent for subscription: ${subscriptionId}`);

            // Step 1: Attach the payment method to the customer as default
            // This is crucial - without this, the subscription can't charge the customer
            if (setupIntent.payment_method && setupIntent.customer) {
                try {
                    this.logger.log(`📎 Attaching payment method ${setupIntent.payment_method} to customer ${setupIntent.customer}`);

                    await this.stripeService.stripe.paymentMethods.attach(
                        setupIntent.payment_method as string,
                        { customer: setupIntent.customer as string }
                    );

                    // Step 2: Set as default payment method
                    // This ensures future charges use this payment method
                    this.logger.log(`🔧 Setting as default payment method...`);
                    await this.stripeService.stripe.customers.update(
                        setupIntent.customer as string,
                        {
                            invoice_settings: {
                                default_payment_method: setupIntent.payment_method as string,
                            },
                        }
                    );

                    this.logger.log(`✅ Payment method attached and set as default`);

                } catch (attachError) {
                    this.logger.error(`❌ Failed to attach payment method: ${attachError.message}`);
                    // Continue anyway - payment method might already be attached
                }
            }

            // Step 3: Update subscription with payment method
            // This links the payment method to the subscription
            try {
                this.logger.log(`🔄 Updating subscription ${subscriptionId} with payment method...`);

                const updatedSubscription = await this.stripeService.stripe.subscriptions.update(subscriptionId, {
                    default_payment_method: setupIntent.payment_method as string,
                });

                this.logger.log(`✅ Updated subscription, new status: ${updatedSubscription.status}`);

                // Step 4: If still incomplete, try to pay the invoice manually
                // This triggers the actual payment and subscription activation
                if (updatedSubscription.status === 'incomplete' && invoiceId) {
                    this.logger.log(`💳 Subscription still incomplete, attempting to pay invoice ${invoiceId}...`);

                    try {
                        const invoice = await this.stripeService.stripe.invoices.retrieve(invoiceId);
                        this.logger.log(`Invoice ${invoiceId} status: ${invoice.status}, amount_due: ${invoice.amount_due}`);

                        if (invoice.status === 'open' && invoice.amount_due > 0) {
                            const paidInvoice = await this.stripeService.stripe.invoices.pay(invoiceId);
                            this.logger.log(`✅ Successfully paid invoice ${invoiceId}, new status: ${paidInvoice.status}`);
                        } else {
                            this.logger.log(`Invoice ${invoiceId} doesn't need payment: status=${invoice.status}, amount_due=${invoice.amount_due}`);
                        }

                    } catch (payError) {
                        this.logger.error(`❌ Failed to pay invoice ${invoiceId}: ${payError.message}`);
                    }
                }

            } catch (updateError) {
                this.logger.error(`❌ Failed to update subscription: ${updateError.message}`);
            }

            // Step 5: Final subscription status check and database update
            // This ensures our database reflects the current Stripe state
            try {
                const finalSubscription = await this.stripeService.getSubscription(subscriptionId);
                this.logger.log(`🏁 Final subscription status: ${finalSubscription.status}`);

                // Update our database with the final status AND link to device if not already linked
                await this.prisma.subscription.update({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: {
                        status: this.stripeService.getSubscriptionStatus(finalSubscription),
                        deviceId: metadata.deviceId || undefined, // Link to device if deviceId exists
                    },
                });

                this.logger.log(`✅ Updated subscription ${subscriptionId} in database with status: ${this.stripeService.getSubscriptionStatus(finalSubscription)}`);

                // Step 6: CRITICAL - Ensure device is properly linked to user with active subscription
                // This is the missing piece that connects the device to the subscription
                const deviceIdFromMetadata = metadata.deviceId;
                const userId = metadata.userId;
                const appId = metadata.appId || await this.getDefaultAppId();

                if (deviceIdFromMetadata && userId && finalSubscription.status === 'active') {
                    this.logger.log(`🔗 Ensuring device ${deviceIdFromMetadata} is linked to user ${userId} with active subscription`);

                    try {
                        // Make sure the device is linked to the user who now has an active subscription
                        await this.deviceService.linkDeviceToUser(deviceIdFromMetadata, userId, appId);
                        this.logger.log(`✅ Device ${deviceIdFromMetadata} successfully linked to user ${userId}`);

                        // Verify the device can now detect the subscription
                        const deviceWithSubscription = await this.deviceService.getDeviceByDeviceId(deviceIdFromMetadata, appId);
                        this.logger.log(`🔍 Device subscription check: hasActiveSubscription=${deviceWithSubscription?.hasActiveSubscription}, maxServers=${deviceWithSubscription?.maxServers}`);

                        if (deviceWithSubscription?.hasActiveSubscription) {
                            this.logger.log(`🎉 SUCCESS: Device ${deviceIdFromMetadata} can now detect active subscription!`);
                        } else {
                            this.logger.error(`❌ WARNING: Device ${deviceIdFromMetadata} still cannot detect active subscription after linking`);
                        }

                    } catch (linkError) {
                        this.logger.error(`❌ Failed to link device to user: ${linkError.message}`);
                    }
                }

            } catch (finalError) {
                this.logger.error(`❌ Failed final subscription check: ${finalError.message}`);
            }

        } catch (error) {
            this.logger.error(`❌ Failed to handle setup intent succeeded: ${error.message}`);
        }
    }

    async getSubscriptionByUserId(userId: string): Promise<SubscriptionWithDetails | null> {
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return subscription as SubscriptionWithDetails | null;
    }

    async getAvailablePrices(): Promise<Stripe.Price[]> {
        return await this.stripeService.getPrices();
    }

    async syncStripePlans(appId?: string): Promise<any[]> {
        try {
            this.logger.log('Starting to sync subscription plans from Stripe...');

            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();
            this.logger.log(`Using app ID: ${targetAppId}`);

            // Get all active products from Stripe
            this.logger.log('Fetching products from Stripe...');
            const products = await this.stripeService.stripe.products.list({
                active: true,
                expand: ['data.default_price'],
            });

            console.log(JSON.stringify(products.data, null, 2));

            // Get all prices for subscription products
            this.logger.log('Fetching prices from Stripe...');
            const prices = await this.stripeService.stripe.prices.list({
                active: true,
                type: 'recurring',
                expand: ['data.product'],
            });

            this.logger.log(`Found ${products.data.length} products and ${prices.data.length} prices from Stripe`);

            // Log some details about what we found
            if (products.data.length > 0) {
                this.logger.log('products found:');
                products.data.slice(0, 3).forEach(p => {
                    this.logger.log(`- Product: ${p.name} (${p.id}) - Active: ${p.active}`);
                });
            }

            if (prices.data.length > 0) {
                this.logger.log('Sample prices found:');
                prices.data.slice(0, 3).forEach(p => {
                    this.logger.log(`- Price: ${p.id} - Amount: ${p.unit_amount} ${p.currency} - Active: ${p.active}`);
                });
            }

            const savedPlans: any[] = [];

            for (const price of prices.data) {
                const product = price.product as Stripe.Product;

                // Skip if product is not active
                if (!product.active) {
                    this.logger.log(`Skipping inactive product: ${product.name}`);
                    continue;
                }

                // Extract features from product metadata
                const features = product.marketing_features ?
                    product.marketing_features.map((f: any) => f.name.trim()) :
                    [];

                // Extract trial period from product metadata
                const trialPeriodDays = product.metadata?.trial_period_days ?
                    parseInt(product.metadata.trial_period_days) : 7;

                // Extract appId from product metadata
                const productAppId = product.metadata?.appId || targetAppId;

                const planData = {
                    stripeProductId: product.id,
                    stripePriceId: price.id,
                    name: product.name,
                    description: product.description || null,
                    priceAmount: price.unit_amount || 0,
                    currency: price.currency.toUpperCase(),
                    intervalType: price.recurring?.interval || 'month',
                    intervalCount: price.recurring?.interval_count || 1,
                    trialPeriodDays: trialPeriodDays,
                    isActive: price.active && product.active,
                    features: features,
                    metadata: {
                        stripeProductMetadata: product.metadata || {},
                        stripePriceMetadata: price.metadata || {},
                    },
                    appId: productAppId,
                };

                this.logger.log(`Saving plan: ${product.name} with data:`, JSON.stringify(planData, null, 2));

                // Upsert the plan (update if exists, create if not)
                const savedPlan = await this.prisma.subscriptionPlan.upsert({
                    where: { stripePriceId: price.id },
                    update: planData,
                    create: planData,
                });

                // Transform to expected format
                const transformedPlan = {
                    id: savedPlan.id,
                    name: savedPlan.name,
                    stripePriceId: savedPlan.stripePriceId,
                    stripeProductId: savedPlan.stripeProductId,
                    amount: savedPlan.priceAmount,
                    currency: savedPlan.currency,
                    interval: savedPlan.intervalType,
                    features: Array.isArray(savedPlan.features) ? savedPlan.features : [],
                    isActive: savedPlan.isActive,
                    subscriberCount: 0, // Will be calculated later
                };

                savedPlans.push(transformedPlan);
                this.logger.log(`Synced plan: ${product.name} (${product.id}) - Price: ${price.id}`);
            }

            // Deactivate plans that no longer exist in Stripe
            const stripePriceIds = prices.data.map(p => p.id);
            if (stripePriceIds.length > 0) {
                const deactivatedResult = await this.prisma.subscriptionPlan.updateMany({
                    where: {
                        stripePriceId: { notIn: stripePriceIds },
                        appId: targetAppId,
                    },
                    data: {
                        isActive: false,
                    },
                });
                this.logger.log(`Deactivated ${deactivatedResult.count} plans that no longer exist in Stripe`);
            }

            this.logger.log(`Successfully synced ${savedPlans.length} plans from Stripe to database`);
            return savedPlans;

        } catch (error) {
            this.logger.error(`Failed to sync Stripe plans: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getLocalSubscriptionPlans(appId?: string): Promise<any[]> {
        try {
            const targetAppId = appId || await this.getDefaultAppId();
            this.logger.log(`Getting plans for appId: ${targetAppId}`);

            // Fetch all active plans
            const plans = await this.prisma.subscriptionPlan.findMany({
                where: { isActive: true },
                include: {
                    _count: {
                        select: {
                            subscriptions: {
                                where: {
                                    status: {
                                        in: ['ACTIVE', 'TRIALING'],
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { priceAmount: 'asc' },
            });

            this.logger.log(`Total active plans in database: ${plans.length}`);
            plans.forEach(plan => {
                this.logger.log(`Plan: ${plan.name}, appId: ${plan.appId}, metadata: ${JSON.stringify(plan.metadata)}`);
            });

            // Filter in JavaScript
            const filteredPlans = plans.filter(plan => {
                // Top-level appId
                if (plan.appId === targetAppId) return true;
                // Global plan
                if (plan.appId === null) return true;
                // Metadata appId
                const metadata = plan.metadata as any;
                const metaAppId = metadata?.stripeProductMetadata?.appId;
                if (metaAppId === targetAppId) return true;
                return false;
            });

            this.logger.log(`Filtered to ${filteredPlans.length} plans for appId: ${targetAppId}`);
            filteredPlans.forEach(plan => {
                this.logger.log(`Filtered Plan: ${plan.name}, appId: ${plan.appId}, metadata: ${JSON.stringify(plan.metadata)}`);
            });

            return filteredPlans.map(plan => ({
                id: plan.id,
                name: plan.name,
                stripePriceId: plan.stripePriceId,
                stripeProductId: plan.stripeProductId,
                amount: plan.priceAmount,
                currency: plan.currency,
                interval: plan.intervalType,
                features: Array.isArray(plan.features) ? plan.features : [],
                isActive: plan.isActive,
                subscriberCount: plan._count.subscriptions,
            }));

        } catch (error) {
            this.logger.error(`Failed to get local subscription plans: ${error.message}`);
            throw error;
        }
    }

    async debugGetAllPlans(): Promise<any[]> {
        try {
            const plans = await this.prisma.subscriptionPlan.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    appId: true,
                    metadata: true,
                    stripePriceId: true,
                    stripeProductId: true,
                    priceAmount: true,
                    currency: true,
                    intervalType: true,
                    isActive: true,
                },
            });

            return plans;
        } catch (error) {
            this.logger.error(`Failed to get debug plans: ${error.message}`);
            throw error;
        }
    }

    async cancelSubscription(userId: string): Promise<void> {
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (!subscription?.stripeSubscriptionId) {
            throw new NotFoundException('No active subscription found');
        }

        await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
    }

    async getAllSubscriptions(params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        appId?: string;
    }): Promise<{
        subscriptions: SubscriptionWithDetails[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }> {
        try {
            const { page, limit, search, status, appId } = params;
            const skip = (page - 1) * limit;

            // Get appId or use default
            const targetAppId = appId || await this.getDefaultAppId();

            // Build where clause
            const where: any = {
                appId: targetAppId,
            };

            // Filter by status if provided
            if (status && status !== 'all') {
                where.status = status.toUpperCase();
            }

            // Search by customer ID, subscription ID, or user email
            if (search) {
                where.OR = [
                    { stripeCustomerId: { contains: search, mode: 'insensitive' } },
                    { stripeSubscriptionId: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                ];
            }

            // Get total count
            const total = await this.prisma.subscription.count({ where });

            // Get subscriptions with pagination
            const subscriptions = await this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            const pages = Math.ceil(total / limit);

            return {
                subscriptions: subscriptions as SubscriptionWithDetails[],
                total,
                page,
                limit,
                pages,
            };
        } catch (error) {
            this.logger.error(`Failed to get all subscriptions: ${error.message}`);
            throw error;
        }
    }
} 