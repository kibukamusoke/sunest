import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly logger = new Logger(StripeService.name);
    private readonly _stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is required');
        }

        this._stripe = new Stripe(secretKey, {
            apiVersion: '2025-06-30.basil',
        });
    }

    get stripe(): Stripe {
        return this._stripe;
    }

    async createCustomer(
        email: string,
        name?: string,
        phone?: string,
        addressLine1?: string,
        addressLine2?: string,
        city?: string,
        state?: string,
        postalCode?: string,
        country?: string
    ): Promise<Stripe.Customer> {
        try {
            const customerData: Stripe.CustomerCreateParams = {
                email,
                name,
            };

            // Add phone if provided
            if (phone) {
                customerData.phone = phone;
            }

            // Add address if provided
            if (addressLine1 || city || state || postalCode || country) {
                customerData.address = {
                    line1: addressLine1,
                    line2: addressLine2,
                    city,
                    state,
                    postal_code: postalCode,
                    country,
                };
            }

            const customer = await this._stripe.customers.create(customerData);

            this.logger.log(`Created Stripe customer: ${customer.id} for email: ${email}`);
            return customer;
        } catch (error) {
            this.logger.error(`Failed to create Stripe customer: ${error.message}`);
            throw error;
        }
    }

    async createCheckoutSession(params: {
        customerId: string;
        priceId: string;
        successUrl: string;
        cancelUrl: string;
        metadata?: Record<string, string>;
    }): Promise<Stripe.Checkout.Session> {
        try {
            const session = await this._stripe.checkout.sessions.create({
                customer: params.customerId,
                line_items: [
                    {
                        price: params.priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: params.successUrl,
                cancel_url: params.cancelUrl,
                metadata: params.metadata || {},
            });

            this.logger.log(`Created checkout session: ${session.id}`);
            return session;
        } catch (error) {
            this.logger.error(`Failed to create checkout session: ${error.message}`);
            throw error;
        }
    }

    async createPaymentIntent(params: {
        customerId: string;
        priceId: string;
        metadata?: Record<string, string>;
    }): Promise<{ clientSecret: string; customerId: string; subscriptionId: string }> {
        try {
            this.logger.log(`Creating setup intent for customer: ${params.customerId}, price: ${params.priceId}`);

            // Create subscription in incomplete state (no payment attempt yet)
            const subscription = await this._stripe.subscriptions.create({
                customer: params.customerId,
                items: [{ price: params.priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                },
                expand: ['latest_invoice'],
                metadata: params.metadata || {},
            });

            this.logger.log(`Created subscription: ${subscription.id}, status: ${subscription.status}`);

            const invoice = subscription.latest_invoice as any;
            this.logger.log(`Invoice: ${invoice.id}, status: ${invoice.status}, amount_due: ${invoice.amount_due}`);

            // Create setup intent to collect payment method and complete subscription
            const setupIntent = await this._stripe.setupIntents.create({
                customer: params.customerId,
                payment_method_types: ['card'],
                usage: 'off_session',
                metadata: {
                    ...params.metadata,
                    subscription_id: subscription.id,
                    invoice_id: invoice.id,
                    flow_type: 'subscription_setup',
                },
            });

            this.logger.log(`✅ Created setup intent: ${setupIntent.id} for subscription: ${subscription.id}`);

            return {
                clientSecret: setupIntent.client_secret!,
                customerId: params.customerId,
                subscriptionId: subscription.id,
            };

        } catch (error) {
            this.logger.error(`Failed to create setup intent: ${error.message}`);
            throw error;
        }
    }

    async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
        try {
            const session = await this._stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: returnUrl,
            });

            this.logger.log(`Created portal session: ${session.id}`);
            return session;
        } catch (error) {
            this.logger.error(`Failed to create portal session: ${error.message}`);
            throw error;
        }
    }

    async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        try {
            return await this._stripe.subscriptions.retrieve(subscriptionId);
        } catch (error) {
            this.logger.error(`Failed to retrieve subscription: ${error.message}`);
            throw error;
        }
    }

    async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        try {
            const subscription = await this._stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });

            this.logger.log(`Cancelled subscription: ${subscriptionId}`);
            return subscription;
        } catch (error) {
            this.logger.error(`Failed to cancel subscription: ${error.message}`);
            throw error;
        }
    }

    async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
        try {
            const subscriptions = await this._stripe.subscriptions.list({
                customer: customerId,
            });

            return subscriptions.data;
        } catch (error) {
            this.logger.error(`Failed to retrieve customer subscriptions: ${error.message}`);
            throw error;
        }
    }

    async constructEvent(body: Buffer, signature: string): Promise<Stripe.Event> {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is required');
        }

        try {
            return this._stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (error) {
            this.logger.error(`Failed to construct webhook event: ${error.message}`);
            throw error;
        }
    }

    async getPrices(): Promise<Stripe.Price[]> {
        try {
            const prices = await this._stripe.prices.list({
                active: true,
                type: 'recurring', // Only get subscription prices
                expand: ['data.product'],
            });

            return prices.data;
        } catch (error) {
            this.logger.error(`Failed to retrieve prices: ${error.message}`);
            throw error;
        }
    }

    async getPrice(priceId: string): Promise<Stripe.Price> {
        try {
            return await this._stripe.prices.retrieve(priceId, {
                expand: ['product'],
            });
        } catch (error) {
            this.logger.error(`Failed to retrieve price: ${error.message}`);
            throw error;
        }
    }

    // Helper method to check if subscription is active
    isSubscriptionActive(subscription: Stripe.Subscription): boolean {
        return subscription.status === 'active' || subscription.status === 'trialing';
    }

    // Helper method to finalize an invoice if needed
    async finalizeInvoiceIfNeeded(invoiceId: string): Promise<Stripe.Invoice> {
        try {
            const invoice = await this._stripe.invoices.retrieve(invoiceId);

            if (invoice.status === 'draft') {
                this.logger.log(`Finalizing draft invoice: ${invoiceId}`);
                return await this._stripe.invoices.finalizeInvoice(invoiceId);
            }

            this.logger.log(`Invoice ${invoiceId} already finalized with status: ${invoice.status}`);
            return invoice;
        } catch (error) {
            this.logger.error(`Failed to finalize invoice ${invoiceId}: ${error.message}`);
            throw error;
        }
    }

    // Helper method to get subscription status
    getSubscriptionStatus(subscription: Stripe.Subscription): SubscriptionStatus {
        switch (subscription.status) {
            case 'active':
                return SubscriptionStatus.ACTIVE;
            case 'trialing':
                return SubscriptionStatus.TRIALING;
            case 'past_due':
                return SubscriptionStatus.PAST_DUE;
            case 'canceled':
                return SubscriptionStatus.CANCELED;
            case 'unpaid':
                return SubscriptionStatus.UNPAID;
            case 'incomplete':
                return SubscriptionStatus.INCOMPLETE; // Subscription awaiting payment
            case 'incomplete_expired':
                return SubscriptionStatus.INACTIVE; // Payment attempt expired
            default:
                return SubscriptionStatus.INACTIVE;
        }
    }
} 