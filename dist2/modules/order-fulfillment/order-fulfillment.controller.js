"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderFulfillmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const order_fulfillment_service_1 = require("./order-fulfillment.service");
const order_dto_1 = require("./dto/order.dto");
const fulfillment_dto_1 = require("./dto/fulfillment.dto");
const shipping_dto_1 = require("./dto/shipping.dto");
const invoice_dto_1 = require("./dto/invoice.dto");
let OrderFulfillmentController = class OrderFulfillmentController {
    constructor(orderFulfillmentService) {
        this.orderFulfillmentService = orderFulfillmentService;
    }
    async createOrder(createOrderDto, req) {
        return this.orderFulfillmentService.createOrder(createOrderDto, req.user.userId);
    }
    async listOrders(filterDto, req) {
        return this.orderFulfillmentService.listOrders(filterDto, req.user.userId, req.user.roles);
    }
    async getOrderById(id, req) {
        return this.orderFulfillmentService.getOrderById(id, req.user.userId, req.user.roles);
    }
    async updateOrder(id, updateOrderDto, req) {
        return this.orderFulfillmentService.updateOrder(id, updateOrderDto, req.user.userId, req.user.roles);
    }
    async uploadPaymentProof(id, dto, req) {
        return this.orderFulfillmentService.uploadPaymentProof(id, req.user.userId, req.user.roles, dto);
    }
    async confirmOrder(id, req) {
        return this.orderFulfillmentService.confirmOrder(id, req.user.userId);
    }
    async cancelOrder(id, reason, req) {
        return this.orderFulfillmentService.cancelOrder(id, reason, req.user.userId);
    }
    async createFulfillment(createFulfillmentDto, req) {
        return this.orderFulfillmentService.createFulfillment(createFulfillmentDto, req.user.userId);
    }
    async assignFulfillment(id, assignDto, req) {
        return this.orderFulfillmentService.assignFulfillment(id, assignDto, req.user.userId);
    }
    async startFulfillment(id, req) {
        return this.orderFulfillmentService.startFulfillment(id, req.user.userId);
    }
    async createShipment(createShipmentDto, req) {
        return this.orderFulfillmentService.createShipment(createShipmentDto, req.user.userId);
    }
    async markShipmentShipped(id, trackingNumber, req) {
        return this.orderFulfillmentService.markShipmentShipped(id, trackingNumber, req.user.userId);
    }
    async updateShipment(id, updateShipmentDto, req) {
        return this.orderFulfillmentService.updateShipment(id, updateShipmentDto, req.user.userId);
    }
    async createInvoice(createInvoiceDto, req) {
        return this.orderFulfillmentService.createInvoice(createInvoiceDto, req.user.userId);
    }
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
                'Order lifecycle events',
            ],
        };
    }
};
exports.OrderFulfillmentController = OrderFulfillmentController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new order',
        description: 'Create a new order from checkout, quote, or manual input',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Order created successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid order data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, swagger_1.ApiOperation)({
        summary: 'List orders',
        description: 'Get a paginated list of orders with filtering options',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Orders retrieved successfully',
        type: order_dto_1.OrderListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.OrderFilterDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get order by ID',
        description: 'Retrieve detailed order information including items, fulfillments, and shipments',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order retrieved successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:id'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update order',
        description: 'Update order details (limited to certain statuses)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order updated successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Order cannot be modified in current status',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/payment-proof'),
    (0, roles_decorator_1.Roles)('system_admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload payment proof (admin)',
        description: 'Attach a payment proof file (uploaded via Storage presigned flow) to an order and optionally update payment status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payment proof attached successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UploadPaymentProofDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.Patch)('orders/:id/confirm'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm order',
        description: 'Confirm a pending order and make it ready for fulfillment',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order confirmed successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order is not in pending status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "confirmOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/cancel'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel order',
        description: 'Cancel an order with a reason',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order cancelled successfully',
        type: order_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Order cannot be cancelled in current status',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)('fulfillments'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create fulfillment',
        description: 'Create a new fulfillment for confirmed orders',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Fulfillment created successfully',
        type: fulfillment_dto_1.FulfillmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Order must be confirmed before fulfillment',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fulfillment_dto_1.CreateFulfillmentDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "createFulfillment", null);
__decorate([
    (0, common_1.Patch)('fulfillments/:id/assign'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign fulfillment',
        description: 'Assign a fulfillment to a warehouse worker',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fulfillment assigned successfully',
        type: fulfillment_dto_1.FulfillmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Fulfillment is not available for assignment',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fulfillment not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fulfillment_dto_1.AssignFulfillmentDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "assignFulfillment", null);
__decorate([
    (0, common_1.Patch)('fulfillments/:id/start'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start fulfillment',
        description: 'Start the picking process for an assigned fulfillment',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fulfillment started successfully',
        type: fulfillment_dto_1.FulfillmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Fulfillment is not ready to start',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fulfillment not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "startFulfillment", null);
__decorate([
    (0, common_1.Post)('shipments'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create shipment',
        description: 'Create a new shipment for order items',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Shipment created successfully',
        type: shipping_dto_1.ShipmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order or fulfillment not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shipping_dto_1.CreateShipmentDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "createShipment", null);
__decorate([
    (0, common_1.Patch)('shipments/:id/ship'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark shipment as shipped',
        description: 'Mark a shipment as shipped with tracking information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shipment marked as shipped successfully',
        type: shipping_dto_1.ShipmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shipment not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('trackingNumber')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "markShipmentShipped", null);
__decorate([
    (0, common_1.Patch)('shipments/:id'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update shipment',
        description: 'Update shipment fields such as status, tracking number, and delivery timestamps',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shipment updated successfully',
        type: shipping_dto_1.ShipmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shipment not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shipping_dto_1.UpdateShipmentDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "updateShipment", null);
__decorate([
    (0, common_1.Post)('invoices'),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create invoice',
        description: 'Generate an invoice for an order',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Invoice created successfully',
        type: invoice_dto_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.CreateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check for Order Management & Fulfillment module',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderFulfillmentController.prototype, "healthCheck", null);
exports.OrderFulfillmentController = OrderFulfillmentController = __decorate([
    (0, swagger_1.ApiTags)('Order Management & Fulfillment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('order-fulfillment'),
    __metadata("design:paramtypes", [order_fulfillment_service_1.OrderFulfillmentService])
], OrderFulfillmentController);
//# sourceMappingURL=order-fulfillment.controller.js.map