import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpException,
    HttpStatus,
    Req,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StripeService } from './stripe.service';
import { DeviceService } from './device.service';
import { SubscriptionLimitService } from './subscription-limit.service';
import { SubscriptionsService } from './subscriptions.service';
import {
    DeviceRegistrationDto,
    DeviceRegistrationResponseDto,
    SubscriptionStatusDto,
    ServerLimitsDto,
    LogAccessDto,
    CheckoutSessionDto,
    CreateCheckoutDto,
    PaymentIntentDto,
    CreatePaymentIntentDto,
    SubscriptionPlansResponseDto,
    SyncStripePlansResponseDto,
    StripeConnectionTestResponseDto,
    SubscriptionsListResponseDto,
    DevicesListResponseDto,
    DeviceUpdateResponseDto,
    PortalSessionResponseDto,
    CreatePortalSessionDto,
    FeatureAccessResponseDto
} from './dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly deviceService: DeviceService,
        private readonly subscriptionLimitService: SubscriptionLimitService,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    @Get('prices')
    @ApiOperation({ summary: 'Get available subscription prices from local database' })
    @ApiQuery({ name: 'appId', required: false, type: String, description: 'App ID to filter plans by' })
    @ApiResponse({
        status: 200,
        description: 'Returns available subscription prices',
        type: SubscriptionPlansResponseDto
    })
    async getPrices(@Query('appId') appId?: string): Promise<SubscriptionPlansResponseDto> {
        try {
            const plans = await this.subscriptionsService.getLocalSubscriptionPlans(appId);
            return {
                success: true,
                data: plans,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to retrieve subscription prices',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('debug-plans')
    @ApiOperation({ summary: 'Debug endpoint to see all plans in database' })
    @ApiResponse({
        status: 200,
        description: 'Returns all plans for debugging',
        type: SubscriptionPlansResponseDto
    })
    async debugPlans(): Promise<SubscriptionPlansResponseDto> {
        try {
            const plans = await this.subscriptionsService.debugGetAllPlans();
            return {
                success: true,
                data: plans,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to retrieve plans for debugging',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all subscriptions with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
    @ApiQuery({ name: 'appId', required: false, type: String, description: 'App ID to filter subscriptions by' })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of subscriptions',
        type: SubscriptionsListResponseDto
    })
    async getAllSubscriptions(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('appId') appId?: string,
        @Req() req?: any
    ): Promise<SubscriptionsListResponseDto> {
        try {
            const subscriptions = await this.subscriptionsService.getAllSubscriptions({
                page: Number(page),
                limit: Number(limit),
                search,
                status,
                appId
            });
            return {
                success: true,
                subscriptions: subscriptions.subscriptions,
                total: subscriptions.total,
                page: subscriptions.page,
                limit: subscriptions.limit,
                pages: subscriptions.pages,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to get subscriptions',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('sync-stripe-plans')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sync subscription plans and prices from Stripe to local database' })
    @ApiResponse({
        status: 200,
        description: 'Returns synced plans saved to database',
        type: SyncStripePlansResponseDto
    })
    async syncStripePlans(): Promise<SyncStripePlansResponseDto> {
        try {
            const plans = await this.subscriptionsService.syncStripePlans();

            return {
                success: true,
                data: plans,
                message: `Successfully synced ${plans.length} plans from Stripe to database`,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to sync Stripe plans',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('test-stripe-connection')
    @ApiOperation({ summary: 'Test Stripe connection and list products/prices' })
    @ApiResponse({
        status: 200,
        description: 'Returns Stripe connection test results',
        type: StripeConnectionTestResponseDto
    })
    async testStripeConnection(): Promise<StripeConnectionTestResponseDto> {
        try {
            const products = await this.stripeService.stripe.products.list({
                active: true,
                limit: 5,
            });

            const prices = await this.stripeService.stripe.prices.list({
                active: true,
                type: 'recurring',
                limit: 5,
            });

            return {
                success: true,
                data: {
                    products: products.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        active: p.active,
                        metadata: p.metadata
                    })),
                    prices: prices.data.map(p => ({
                        id: p.id,
                        product: typeof p.product === 'string' ? p.product : p.product?.id,
                        amount: p.unit_amount,
                        currency: p.currency,
                        interval: p.recurring?.interval,
                        active: p.active
                    }))
                },
                message: `Found ${products.data.length} products and ${prices.data.length} prices in Stripe`,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to connect to Stripe',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('checkout')
    @ApiOperation({ summary: 'Create a Stripe checkout session' })
    @ApiBody({ type: CreateCheckoutDto })
    @ApiResponse({
        status: 200,
        description: 'Returns checkout session URL',
        type: CheckoutSessionDto
    })
    async createCheckoutSession(@Body() body: CreateCheckoutDto): Promise<CheckoutSessionDto> {
        try {
            // Use the subscriptions service method that handles customer creation
            const result = await this.subscriptionsService.createCheckoutSession({
                deviceId: body.deviceId,
                email: body.email,
                priceId: body.priceId,
                successUrl: body.successUrl || 'doctopus://success',
                cancelUrl: body.cancelUrl || 'doctopus://cancel',
                displayName: body.displayName,
                appId: body.appId, // Will use default app if not provided
            });

            return {
                success: true,
                data: {
                    url: result.checkoutUrl,
                    sessionId: result.checkoutUrl.split('/').pop() || '', // Extract session ID from URL if needed
                },
                message: 'Checkout session created successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to create checkout session',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('payment-intent')
    @ApiOperation({ summary: 'Create a Stripe payment intent for mobile payment sheet' })
    @ApiBody({ type: CreatePaymentIntentDto })
    @ApiResponse({
        status: 200,
        description: 'Returns payment intent client secret',
        type: PaymentIntentDto
    })
    async createPaymentIntent(@Body() body: CreatePaymentIntentDto): Promise<PaymentIntentDto> {
        try {
            const result = await this.subscriptionsService.createPaymentIntent({
                deviceId: body.deviceId,
                email: body.email,
                priceId: body.priceId,
                successUrl: '', // Not needed for payment intent flow
                cancelUrl: '', // Not needed for payment intent flow
                displayName: body.displayName,
                appId: body.appId,
            });

            return {
                success: true,
                data: {
                    clientSecret: result.clientSecret,
                    customerId: result.customerId,
                    subscriptionId: result.subscriptionId,
                },
                message: 'Payment intent created successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to create payment intent',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('portal')
    //@UseGuards(JwtAuthGuard)
    //@ApiBearerAuth()
    @ApiOperation({ summary: 'Create a Stripe customer portal session' })
    @ApiBody({ type: CreatePortalSessionDto })
    @ApiResponse({
        status: 200,
        description: 'Returns customer portal session URL',
        type: PortalSessionResponseDto
    })
    async createPortalSession(@Body() body: CreatePortalSessionDto, @Req() req): Promise<PortalSessionResponseDto> {
        try {

            // get email from device 
            const device = await this.deviceService.getDeviceByDeviceId(body.deviceId);
            const subscription = await this.subscriptionsService.getSubscriptionByDeviceId(body.deviceId);
            const portalSession = await this.stripeService.createPortalSession(
                subscription?.customer?.stripeCustomerId,
                body.returnUrl || 'http://localhost:3000/dashboard'
            );
            return {
                success: true,
                data: { url: portalSession.url },
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to create portal session',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('status/:deviceId')
    @ApiOperation({ summary: 'Get subscription status for a device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiQuery({ name: 'appId', required: false, type: String, description: 'App ID to filter subscriptions by' })
    @ApiResponse({
        status: 200,
        description: 'Returns subscription status',
        type: SubscriptionStatusDto
    })
    async getSubscriptionStatus(
        @Param('deviceId') deviceId: string,
        @Query('appId') appId?: string
    ): Promise<SubscriptionStatusDto> {
        try {
            const device = await this.deviceService.getDeviceByDeviceId(deviceId, appId);

            return {
                success: true,
                data: {
                    hasActiveSubscription: device?.hasActiveSubscription || false,
                    maxServers: device?.maxServers || 1,
                    canViewLogs: device?.canViewLogs || false,
                },
                message: 'Subscription status retrieved successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to get subscription status',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('limits/:deviceId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get subscription limits for a device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiResponse({ status: 200, description: 'Returns subscription limits' })
    async getSubscriptionLimits(@Param('deviceId') deviceId: string) {
        try {
            const limits = await this.subscriptionLimitService.checkSubscriptionLimits(deviceId);
            return {
                success: true,
                data: limits,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to get subscription limits',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    @Post('device/register')
    @ApiOperation({ summary: 'Register or update a device' })
    @ApiBody({ type: DeviceRegistrationDto })
    @ApiResponse({
        status: 200,
        description: 'Device registered successfully',
        type: DeviceRegistrationResponseDto
    })
    async registerDevice(@Body() deviceInfo: DeviceRegistrationDto): Promise<DeviceRegistrationResponseDto> {
        try {
            const device = await this.deviceService.registerOrUpdateDevice(deviceInfo);

            return {
                success: true,
                data: {
                    deviceId: device.id, // Use database id as device ID
                    hasActiveSubscription: device.hasActiveSubscription,
                    maxServers: device.maxServers,
                    canViewLogs: device.canViewLogs,
                    isActive: device.isActive,
                },
                message: 'Device registered successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to register device',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ADD DEVICE MANAGEMENT ENDPOINTS FOR ADMIN

    @Get('devices')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all devices (admin only)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
    @ApiQuery({ name: 'appId', required: false, type: String, description: 'App ID to filter devices by' })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of devices',
        type: DevicesListResponseDto
    })
    async getAllDevices(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('appId') appId?: string,
        @Req() req?: any
    ): Promise<DevicesListResponseDto> {
        try {
            // For now, we'll get all devices without admin check
            // In production, you'd want to check admin permissions here
            const devices = await this.deviceService.getAllDevices({
                page: Number(page),
                limit: Number(limit),
                search,
                status,
                appId
            });
            return {
                success: true,
                data: devices.devices,
                pagination: devices.pagination,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to get devices',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('device/:deviceId/server-created')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Record server creation for a device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiResponse({
        status: 200,
        description: 'Server creation recorded',
        type: DeviceUpdateResponseDto
    })
    async recordServerCreated(@Param('deviceId') deviceId: string): Promise<DeviceUpdateResponseDto> {
        try {
            const device = await this.deviceService.incrementServerCount(deviceId);
            return {
                success: true,
                data: device,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to record server creation',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('device/:deviceId/server-deleted')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Record server deletion for a device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiResponse({ status: 200, description: 'Server deletion recorded' })
    async recordServerDeleted(@Param('deviceId') deviceId: string) {
        try {
            const device = await this.deviceService.decrementServerCount(deviceId);
            return {
                success: true,
                data: device,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to record server deletion',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('device/:deviceId/can-create-server')
    @ApiOperation({ summary: 'Check if device can create more servers' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns whether device can create more servers',
        type: ServerLimitsDto
    })
    async canCreateServer(@Param('deviceId') deviceId: string): Promise<ServerLimitsDto> {
        try {
            const limits = await this.subscriptionLimitService.checkSubscriptionLimits(deviceId);

            return {
                success: true,
                data: {
                    canCreate: limits.canCreateAdditionalServers,
                    currentCount: limits.currentServerCount,
                    maxServers: limits.maxServers,
                },
                message: 'Server limits checked successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to check server creation limits',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('device/:deviceId/can-view-logs')
    @ApiOperation({ summary: 'Check if device can view logs' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns whether device can view logs',
        type: LogAccessDto
    })
    async canViewLogs(@Param('deviceId') deviceId: string): Promise<LogAccessDto> {
        try {
            const limits = await this.subscriptionLimitService.checkSubscriptionLimits(deviceId);

            return {
                success: true,
                data: {
                    canViewLogs: limits.canViewLogs,
                    hasActiveSubscription: limits.hasActiveSubscription,
                },
                message: 'Log access checked successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to check log access',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('device/:deviceId/check-feature/:feature')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if device has access to a specific feature' })
    @ApiParam({ name: 'deviceId', description: 'Device ID' })
    @ApiParam({ name: 'feature', description: 'Feature name' })
    @ApiResponse({ status: 200, description: 'Returns feature access status' })
    async checkFeatureAccess(@Param('deviceId') deviceId: string, @Param('feature') feature: string) {
        try {
            const limits = await this.subscriptionLimitService.checkSubscriptionLimits(deviceId);

            let hasAccess = false;
            switch (feature) {
                case 'logs':
                    hasAccess = limits.canViewLogs;
                    break;
                case 'unlimited-servers':
                    hasAccess = limits.maxServers > 1;
                    break;
                case 'premium-support':
                    hasAccess = limits.hasActiveSubscription;
                    break;
                default:
                    hasAccess = false;
            }

            return {
                success: true,
                data: {
                    feature,
                    hasAccess,
                    hasActiveSubscription: limits.hasActiveSubscription,
                },
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to check feature access',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 