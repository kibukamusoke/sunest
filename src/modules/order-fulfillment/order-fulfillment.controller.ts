import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrderFulfillmentService } from './order-fulfillment.service';
import {
    CreateOrderDto,
    UpdateOrderDto,
    OrderFilterDto,
    OrderResponseDto,
    OrderListResponseDto,
    OrderAnalyticsResponseDto
} from './dto/order.dto';
import {
    CreateFulfillmentDto,
    UpdateFulfillmentDto,
    AssignFulfillmentDto,
    FulfillmentFilterDto,
    FulfillmentResponseDto,
    FulfillmentListResponseDto
} from './dto/fulfillment.dto';
import {
    CreateShipmentDto,
    UpdateShipmentDto,
    ShipmentFilterDto,
    ShipmentResponseDto,
    ShipmentListResponseDto
} from './dto/shipping.dto';
import {
    CreateInvoiceDto,
    UpdateInvoiceDto,
    InvoiceFilterDto,
    InvoiceResponseDto,
    InvoiceListResponseDto
} from './dto/invoice.dto';

@ApiTags('Order Management & Fulfillment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-fulfillment')
export class OrderFulfillmentController {
    constructor(private readonly orderFulfillmentService: OrderFulfillmentService) { }

    // ==================== ORDER MANAGEMENT ====================

    @Post('orders')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser', 'Buyer')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new order',
        description: 'Create a new order from checkout, quote, or manual input'
    })
    @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid order data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createOrder(
        @Body() createOrderDto: CreateOrderDto,
        @Request() req: any
    ): Promise<OrderResponseDto> {
        return this.orderFulfillmentService.createOrder(createOrderDto, req.user.userId);
    }

    @Get('orders')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser', 'Buyer')
    @ApiOperation({
        summary: 'List orders',
        description: 'Get a paginated list of orders with filtering options'
    })
    @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: OrderListResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async listOrders(
        @Query() filterDto: OrderFilterDto,
        @Request() req: any
    ): Promise<OrderListResponseDto> {
        return this.orderFulfillmentService.listOrders(filterDto, req.user.userId);
    }

    @Get('orders/:id')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser', 'Buyer')
    @ApiOperation({
        summary: 'Get order by ID',
        description: 'Retrieve detailed order information including items, fulfillments, and shipments'
    })
    @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: OrderResponseDto })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getOrderById(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<OrderResponseDto> {
        return this.orderFulfillmentService.getOrderById(id, req.user.userId);
    }

    @Put('orders/:id')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Update order',
        description: 'Update order details (limited to certain statuses)'
    })
    @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Order cannot be modified in current status' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateOrder(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Request() req: any
    ): Promise<OrderResponseDto> {
        return this.orderFulfillmentService.updateOrder(id, updateOrderDto, req.user.userId);
    }

    @Patch('orders/:id/confirm')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Confirm order',
        description: 'Confirm a pending order and make it ready for fulfillment'
    })
    @ApiResponse({ status: 200, description: 'Order confirmed successfully', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Order is not in pending status' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async confirmOrder(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<OrderResponseDto> {
        return this.orderFulfillmentService.confirmOrder(id, req.user.userId);
    }

    @Patch('orders/:id/cancel')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Cancel order',
        description: 'Cancel an order with a reason'
    })
    @ApiResponse({ status: 200, description: 'Order cancelled successfully', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Order cannot be cancelled in current status' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async cancelOrder(
        @Param('id') id: string,
        @Body('reason') reason: string,
        @Request() req: any
    ): Promise<OrderResponseDto> {
        return this.orderFulfillmentService.cancelOrder(id, reason, req.user.userId);
    }

    // ==================== FULFILLMENT MANAGEMENT ====================

    @Post('fulfillments')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create fulfillment',
        description: 'Create a new fulfillment for confirmed orders'
    })
    @ApiResponse({ status: 201, description: 'Fulfillment created successfully', type: FulfillmentResponseDto })
    @ApiResponse({ status: 400, description: 'Order must be confirmed before fulfillment' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createFulfillment(
        @Body() createFulfillmentDto: CreateFulfillmentDto,
        @Request() req: any
    ): Promise<FulfillmentResponseDto> {
        return this.orderFulfillmentService.createFulfillment(createFulfillmentDto, req.user.userId);
    }

    @Patch('fulfillments/:id/assign')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Assign fulfillment',
        description: 'Assign a fulfillment to a warehouse worker'
    })
    @ApiResponse({ status: 200, description: 'Fulfillment assigned successfully', type: FulfillmentResponseDto })
    @ApiResponse({ status: 400, description: 'Fulfillment is not available for assignment' })
    @ApiResponse({ status: 404, description: 'Fulfillment not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async assignFulfillment(
        @Param('id') id: string,
        @Body() assignDto: AssignFulfillmentDto,
        @Request() req: any
    ): Promise<FulfillmentResponseDto> {
        return this.orderFulfillmentService.assignFulfillment(id, assignDto, req.user.userId);
    }

    @Patch('fulfillments/:id/start')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Start fulfillment',
        description: 'Start the picking process for an assigned fulfillment'
    })
    @ApiResponse({ status: 200, description: 'Fulfillment started successfully', type: FulfillmentResponseDto })
    @ApiResponse({ status: 400, description: 'Fulfillment is not ready to start' })
    @ApiResponse({ status: 404, description: 'Fulfillment not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async startFulfillment(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<FulfillmentResponseDto> {
        return this.orderFulfillmentService.startFulfillment(id, req.user.userId);
    }

    // ==================== SHIPPING MANAGEMENT ====================

    @Post('shipments')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create shipment',
        description: 'Create a new shipment for order items'
    })
    @ApiResponse({ status: 201, description: 'Shipment created successfully', type: ShipmentResponseDto })
    @ApiResponse({ status: 404, description: 'Order or fulfillment not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createShipment(
        @Body() createShipmentDto: CreateShipmentDto,
        @Request() req: any
    ): Promise<ShipmentResponseDto> {
        return this.orderFulfillmentService.createShipment(createShipmentDto, req.user.userId);
    }

    @Patch('shipments/:id/ship')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @ApiOperation({
        summary: 'Mark shipment as shipped',
        description: 'Mark a shipment as shipped with tracking information'
    })
    @ApiResponse({ status: 200, description: 'Shipment marked as shipped successfully', type: ShipmentResponseDto })
    @ApiResponse({ status: 404, description: 'Shipment not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async markShipmentShipped(
        @Param('id') id: string,
        @Body('trackingNumber') trackingNumber: string,
        @Request() req: any
    ): Promise<ShipmentResponseDto> {
        return this.orderFulfillmentService.markShipmentShipped(id, trackingNumber, req.user.userId);
    }

    // ==================== INVOICE MANAGEMENT ====================

    @Post('invoices')
    @Roles('SystemAdmin', 'MerchantAdmin', 'MerchantUser')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create invoice',
        description: 'Generate an invoice for an order'
    })
    @ApiResponse({ status: 201, description: 'Invoice created successfully', type: InvoiceResponseDto })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createInvoice(
        @Body() createInvoiceDto: CreateInvoiceDto,
        @Request() req: any
    ): Promise<InvoiceResponseDto> {
        return this.orderFulfillmentService.createInvoice(createInvoiceDto, req.user.userId);
    }

    // ==================== HEALTH CHECK ====================

    @Get('health')
    @ApiOperation({ summary: 'Health check for Order Management & Fulfillment module' })
    @ApiResponse({ status: 200, description: 'Module is healthy' })
    async healthCheck() {
        return {
            status: 'healthy',
            module: 'Order Management & Fulfillment',
            timestamp: new Date().toISOString(),
            features: [
                'Order creation and management',
                'Fulfillment tracking',
                'Shipping management',
                'Invoice generation',
                'Real-time status updates',
                'Order lifecycle events'
            ]
        };
    }
}
