import {
    Controller,
    Post,
    Body,
    Headers,
    HttpStatus,
    HttpException,
    Logger,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { StripeService } from './stripe.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class StripeWebhookController {
    private readonly logger = new Logger(StripeWebhookController.name);

    constructor(
        private subscriptionsService: SubscriptionsService,
        private stripeService: StripeService,
    ) { }

    @Post('stripe')
    @ApiExcludeEndpoint() // Hide from OpenAPI docs for security
    @ApiOperation({ summary: 'Handle Stripe webhook events' })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
    async handleStripeWebhook(
        @Req() req: any,
        @Headers('stripe-signature') signature: string,
    ) {
        try {
            if (!signature) {
                throw new HttpException(
                    'Missing Stripe signature',
                    HttpStatus.BAD_REQUEST,
                );
            }

            this.logger.log('Received Stripe webhook');

            // Verify the webhook signature
            // When using express.raw(), the body is available as req.body (Buffer)
            const rawBody = req.rawBody || req.body;
            if (!rawBody) {
                throw new HttpException(
                    'Missing request body',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const event = await this.stripeService.constructEvent(rawBody, signature);

            this.logger.log(`Processing webhook event: ${event.type} (${event.id})`);

            // Process the webhook event
            await this.subscriptionsService.handleStripeWebhook(event);

            this.logger.log(`Successfully processed webhook event: ${event.id}`);

            return {
                success: true,
                message: 'Webhook processed successfully',
                eventId: event.id,
                eventType: event.type,
            };
        } catch (error) {
            this.logger.error(`Failed to process webhook: ${error.message}`, error.stack);

            // Return 400 for signature verification errors
            if (error.message.includes('signature') || error.message.includes('webhook')) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Invalid webhook signature',
                        error: error.message,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Return 500 for other processing errors
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to process webhook',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 