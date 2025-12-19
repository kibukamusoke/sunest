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
exports.CartCheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../../common/guards/optional-jwt-auth.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const cart_checkout_service_1 = require("./cart-checkout.service");
const checkout_service_1 = require("./checkout.service");
const saved_items_service_1 = require("./saved-items.service");
const dto_1 = require("./dto");
let CartCheckoutController = class CartCheckoutController {
    constructor(cartCheckoutService, checkoutService, savedItemsService) {
        this.cartCheckoutService = cartCheckoutService;
        this.checkoutService = checkoutService;
        this.savedItemsService = savedItemsService;
    }
    async createCart(createCartDto, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        if (!userId && sessionId) {
            createCartDto.sessionId = sessionId;
        }
        return this.cartCheckoutService.createCart(createCartDto, userId);
    }
    async getUserCart(companyId, sessionId, headerSessionId, req) {
        const effectiveSessionId = sessionId || headerSessionId;
        const userId = req?.user?.userId;
        if (!userId && !effectiveSessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.getUserCart(userId, companyId, effectiveSessionId);
    }
    async getCart(cartId, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.getCart(cartId, userId);
    }
    async updateCart(cartId, updateCartDto, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.updateCart(cartId, updateCartDto, userId);
    }
    async clearCart(cartId, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.clearCart(cartId, userId);
    }
    async mergeCart(guestCartId, userCartId, mergeDto) {
        return this.cartCheckoutService.mergeCart(guestCartId, userCartId, mergeDto);
    }
    async mergeGuestCartOnLogin(sessionId, req, companyId) {
        return this.cartCheckoutService.mergeGuestCartOnLogin(sessionId, req.user.userId, companyId);
    }
    async validateCart(cartId, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.validateCart(cartId, userId);
    }
    async addItemToCart(cartId, createItemDto, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.addItemToCart(cartId, createItemDto, userId);
    }
    async updateCartItem(itemId, updateItemDto, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.updateCartItem(itemId, updateItemDto, userId);
    }
    async removeCartItem(itemId, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.removeCartItem(itemId, userId);
    }
    async bulkAddToCart(cartId, bulkAddDto, sessionId, req) {
        const userId = req?.user?.userId;
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either authentication or sessionId is required');
        }
        return this.cartCheckoutService.bulkAddToCart(cartId, bulkAddDto, userId);
    }
    async addQuoteToCart(cartId, quoteToCartDto, req) {
        return this.cartCheckoutService.addQuoteToCart(cartId, quoteToCartDto, req.user.userId);
    }
    async createAddress(createAddressDto, req) {
        return this.cartCheckoutService.createAddress(createAddressDto, req.user.userId);
    }
    async getAddresses(companyId, req) {
        return this.cartCheckoutService.getAddresses(req.user.userId, companyId);
    }
    async updateAddress(addressId, updateAddressDto, req) {
        return this.cartCheckoutService.updateAddress(addressId, updateAddressDto, req.user.userId);
    }
    async deleteAddress(addressId, req) {
        return this.cartCheckoutService.deleteAddress(addressId, req.user.userId);
    }
    async setDefaultAddress(addressId, setDefaultDto, req) {
        return this.cartCheckoutService.setDefaultAddress(addressId, setDefaultDto, req.user.userId);
    }
    async initiateCheckout(initiateDto, req) {
        return this.checkoutService.initiateCheckout(initiateDto, req.user.userId);
    }
    async getCheckout(checkoutId, req) {
        return this.checkoutService.getCheckout(checkoutId, req.user.userId);
    }
    async updateCheckoutShipping(checkoutId, shippingDto, req) {
        return this.checkoutService.updateCheckoutShipping(checkoutId, shippingDto, req.user.userId);
    }
    async updateCheckoutBilling(checkoutId, billingDto, req) {
        return this.checkoutService.updateCheckoutBilling(checkoutId, billingDto, req.user.userId);
    }
    async updateCheckoutPayment(checkoutId, paymentDto, req) {
        return this.checkoutService.updateCheckoutPayment(checkoutId, paymentDto, req.user.userId);
    }
    async updateCheckoutNotes(checkoutId, notesDto, req) {
        return this.checkoutService.updateCheckoutNotes(checkoutId, notesDto, req.user.userId);
    }
    async submitCheckout(checkoutId, submitDto, req) {
        return this.checkoutService.submitCheckout(checkoutId, submitDto, req.user.userId);
    }
    async approveCheckout(checkoutId, approvalDto, req) {
        return this.checkoutService.approveCheckout(checkoutId, approvalDto, req.user.userId);
    }
    async completeCheckout(checkoutId, req) {
        return this.checkoutService.completeCheckout(checkoutId, req.user.userId);
    }
    async listCheckouts(filterDto, req) {
        return this.checkoutService.listCheckouts(filterDto, req.user.userId, req.user.roles);
    }
    async getApprovalRequirement(amount, companyId, req) {
        return this.checkoutService.getApprovalRequirement(req.user.userId, parseFloat(amount), companyId);
    }
    async createSavedItem(createDto, req) {
        return this.savedItemsService.createSavedItem(createDto, req.user.userId);
    }
    async listSavedItems(filterDto, req) {
        return this.savedItemsService.listSavedItems(filterDto, req.user.userId);
    }
    async getSavedItem(itemId, req) {
        return this.savedItemsService.getSavedItem(itemId, req.user.userId);
    }
    async updateSavedItem(itemId, updateDto, req) {
        return this.savedItemsService.updateSavedItem(itemId, updateDto, req.user.userId);
    }
    async deleteSavedItem(itemId, req) {
        return this.savedItemsService.deleteSavedItem(itemId, req.user.userId);
    }
    async addSavedItemToCart(itemId, cartId, addToCartDto, req) {
        return this.savedItemsService.addSavedItemToCart(itemId, cartId, addToCartDto, req.user.userId);
    }
    async bulkAddSavedItemsToCart(cartId, bulkAddDto, req) {
        return this.savedItemsService.bulkAddSavedItemsToCart(cartId, bulkAddDto, req.user.userId);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                cart: 'operational',
                checkout: 'operational',
                savedItems: 'operational',
                database: 'connected',
            },
        };
    }
};
exports.CartCheckoutController = CartCheckoutController;
__decorate([
    (0, common_1.Post)('cart'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Cart created successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCartDto, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "createCart", null);
__decorate([
    (0, common_1.Get)('cart'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user or guest cart' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cart retrieved successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'companyId',
        required: false,
        description: 'Company ID for B2B context',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sessionId',
        required: false,
        description: 'Session ID for guest carts',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Alternative way to provide session ID',
    }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('sessionId')),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getUserCart", null);
__decorate([
    (0, common_1.Get)('cart/:cartId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cart retrieved successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getCart", null);
__decorate([
    (0, common_1.Put)('cart/:cartId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cart updated successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCartDto, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCart", null);
__decorate([
    (0, common_1.Delete)('cart/:cartId/clear'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all items from cart' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Cart cleared successfully' }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('cart/:userCartId/merge/:guestCartId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Merge guest cart with user cart' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Carts merged successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'userCartId', description: 'User Cart ID' }),
    (0, swagger_1.ApiParam)({ name: 'guestCartId', description: 'Guest Cart ID' }),
    __param(0, (0, common_1.Param)('guestCartId')),
    __param(1, (0, common_1.Param)('userCartId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.MergeCartDto]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "mergeCart", null);
__decorate([
    (0, common_1.Post)('cart/merge-guest'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Merge guest cart with user cart on login' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Guest cart merged successfully',
        type: dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'sessionId', description: 'Guest session ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'companyId',
        required: false,
        description: 'Company ID for B2B context',
    }),
    __param(0, (0, common_1.Query)('sessionId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "mergeGuestCartOnLogin", null);
__decorate([
    (0, common_1.Post)('cart/:cartId/validate'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Validate cart items availability and pricing' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cart validation completed',
        type: dto_1.CartValidationDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "validateCart", null);
__decorate([
    (0, common_1.Post)('cart/:cartId/items'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Item added to cart successfully',
        type: dto_1.CartItemResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateCartItemDto, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "addItemToCart", null);
__decorate([
    (0, common_1.Put)('cart/items/:itemId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cart item updated successfully',
        type: dto_1.CartItemResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Cart Item ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCartItemDto, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('cart/items/:itemId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Item removed from cart successfully',
    }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Cart Item ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "removeCartItem", null);
__decorate([
    (0, common_1.Post)('cart/:cartId/items/bulk'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add multiple items to cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Items added to cart successfully',
        type: [dto_1.CartItemResponseDto],
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-session-id',
        required: false,
        description: 'Session ID for guest carts',
    }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.BulkAddToCartDto, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "bulkAddToCart", null);
__decorate([
    (0, common_1.Post)('cart/:cartId/from-quote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Buyer)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add quote items to cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quote items added to cart successfully',
        type: [dto_1.CartItemResponseDto],
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.QuoteToCartDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "addQuoteToCart", null);
__decorate([
    (0, common_1.Post)('addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new address' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Address created successfully',
        type: dto_1.AddressResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAddressDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Get)('addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user addresses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Addresses retrieved successfully',
        type: dto_1.AddressListDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'companyId',
        required: false,
        description: 'Company ID filter',
    }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Put)('addresses/:addressId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update address' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Address updated successfully',
        type: dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    __param(0, (0, common_1.Param)('addressId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAddressDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('addresses/:addressId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete address' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Address deleted successfully' }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('addressId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.Post)('addresses/:addressId/set-default'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Set address as default' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Default address updated successfully',
        type: dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'addressId', description: 'Address ID' }),
    __param(0, (0, common_1.Param)('addressId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SetDefaultAddressDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "setDefaultAddress", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate checkout process' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Checkout initiated successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.InitiateCheckoutDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "initiateCheckout", null);
__decorate([
    (0, common_1.Get)('checkout/:checkoutId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get checkout details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkout retrieved successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getCheckout", null);
__decorate([
    (0, common_1.Put)('checkout/:checkoutId/shipping'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update checkout shipping information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shipping information updated successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCheckoutShippingDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCheckoutShipping", null);
__decorate([
    (0, common_1.Put)('checkout/:checkoutId/billing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update checkout billing information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Billing information updated successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCheckoutBillingDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCheckoutBilling", null);
__decorate([
    (0, common_1.Put)('checkout/:checkoutId/payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update checkout payment method' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payment method updated successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCheckoutPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCheckoutPayment", null);
__decorate([
    (0, common_1.Put)('checkout/:checkoutId/notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update checkout notes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notes updated successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCheckoutNotesDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateCheckoutNotes", null);
__decorate([
    (0, common_1.Post)('checkout/:checkoutId/submit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Submit checkout for processing or approval' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkout submitted successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SubmitCheckoutDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "submitCheckout", null);
__decorate([
    (0, common_1.Post)('checkout/:checkoutId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject checkout' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkout approval decision processed',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveCheckoutDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "approveCheckout", null);
__decorate([
    (0, common_1.Post)('checkout/:checkoutId/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Complete checkout and create order' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkout completed successfully',
        type: dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "completeCheckout", null);
__decorate([
    (0, common_1.Get)('checkouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List checkouts with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkouts retrieved successfully',
        type: dto_1.CheckoutListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CheckoutFilterDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "listCheckouts", null);
__decorate([
    (0, common_1.Get)('checkout/:checkoutId/approval-requirement'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check approval requirement for amount' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Approval requirement checked',
        type: dto_1.ApprovalRequirementDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'checkoutId', description: 'Checkout ID' }),
    (0, swagger_1.ApiQuery)({ name: 'amount', description: 'Amount to check' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false, description: 'Company ID' }),
    __param(0, (0, common_1.Query)('amount')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getApprovalRequirement", null);
__decorate([
    (0, common_1.Post)('saved-items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Save item for later' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Item saved successfully',
        type: dto_1.SavedItemResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSavedItemDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "createSavedItem", null);
__decorate([
    (0, common_1.Get)('saved-items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get saved items with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Saved items retrieved successfully',
        type: dto_1.SavedItemsListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SavedItemsFilterDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "listSavedItems", null);
__decorate([
    (0, common_1.Get)('saved-items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get saved item details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Saved item retrieved successfully',
        type: dto_1.SavedItemResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Saved Item ID' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "getSavedItem", null);
__decorate([
    (0, common_1.Put)('saved-items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update saved item' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Saved item updated successfully',
        type: dto_1.SavedItemResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Saved Item ID' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSavedItemDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "updateSavedItem", null);
__decorate([
    (0, common_1.Delete)('saved-items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete saved item' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Saved item deleted successfully' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Saved Item ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "deleteSavedItem", null);
__decorate([
    (0, common_1.Post)('saved-items/:itemId/add-to-cart/:cartId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add saved item to cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Saved item added to cart successfully',
    }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'Saved Item ID' }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Param)('cartId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.AddSavedItemToCartDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "addSavedItemToCart", null);
__decorate([
    (0, common_1.Post)('saved-items/bulk-add-to-cart/:cartId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add multiple saved items to cart' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Saved items added to cart successfully',
    }),
    (0, swagger_1.ApiParam)({ name: 'cartId', description: 'Cart ID' }),
    __param(0, (0, common_1.Param)('cartId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.BulkAddSavedItemsToCartDto, Object]),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "bulkAddSavedItemsToCart", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check for cart and checkout services' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CartCheckoutController.prototype, "healthCheck", null);
exports.CartCheckoutController = CartCheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Cart & Checkout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cart-checkout'),
    __metadata("design:paramtypes", [cart_checkout_service_1.CartCheckoutService,
        checkout_service_1.CheckoutService,
        saved_items_service_1.SavedItemsService])
], CartCheckoutController);
//# sourceMappingURL=cart-checkout.controller.js.map