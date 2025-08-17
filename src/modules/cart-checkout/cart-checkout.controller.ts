import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Buyer, MerchantUser, MerchantAdmin, SystemAdmin } from '../../common/decorators/roles.decorator';
import { CartCheckoutService } from './cart-checkout.service';
import { CheckoutService } from './checkout.service';
import { SavedItemsService } from './saved-items.service';
import {
    CreateCartDto,
    UpdateCartDto,
    CartResponseDto,
    CreateCartItemDto,
    UpdateCartItemDto,
    BulkAddToCartDto,
    CartItemResponseDto,
    MergeCartDto,
    QuoteToCartDto,
    CartValidationDto,
    CreateAddressDto,
    UpdateAddressDto,
    AddressResponseDto,
    AddressListDto,
    SetDefaultAddressDto,
    InitiateCheckoutDto,
    UpdateCheckoutShippingDto,
    UpdateCheckoutBillingDto,
    UpdateCheckoutPaymentDto,
    UpdateCheckoutNotesDto,
    SubmitCheckoutDto,
    ApproveCheckoutDto,
    CheckoutResponseDto,
    CheckoutFilterDto,
    CheckoutListDto,
    ApprovalRequirementDto,
    CreateSavedItemDto,
    UpdateSavedItemDto,
    SavedItemResponseDto,
    SavedItemsFilterDto,
    SavedItemsListDto,
    AddSavedItemToCartDto,
    BulkAddSavedItemsToCartDto,
} from './dto';

@ApiTags('Cart & Checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart-checkout')
export class CartCheckoutController {
    constructor(
        private readonly cartCheckoutService: CartCheckoutService,
        private readonly checkoutService: CheckoutService,
        private readonly savedItemsService: SavedItemsService,
    ) { }

    // ==================== CART MANAGEMENT ====================

    @Post('cart')
    @ApiOperation({ summary: 'Create a new cart' })
    @ApiResponse({ status: 201, description: 'Cart created successfully', type: CartResponseDto })
    async createCart(@Body() createCartDto: CreateCartDto, @Request() req): Promise<CartResponseDto> {
        return this.cartCheckoutService.createCart(createCartDto, req.user.userId);
    }

    @Get('cart')
    @ApiOperation({ summary: 'Get current user cart' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartResponseDto })
    @ApiQuery({ name: 'companyId', required: false, description: 'Company ID for B2B context' })
    async getUserCart(@Query('companyId') companyId: string, @Request() req): Promise<CartResponseDto> {
        return this.cartCheckoutService.getUserCart(req.user.userId, companyId);
    }

    @Get('cart/:cartId')
    @ApiOperation({ summary: 'Get cart by ID' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartResponseDto })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async getCart(@Param('cartId') cartId: string, @Request() req): Promise<CartResponseDto> {
        return this.cartCheckoutService.getCart(cartId, req.user.userId);
    }

    @Put('cart/:cartId')
    @ApiOperation({ summary: 'Update cart details' })
    @ApiResponse({ status: 200, description: 'Cart updated successfully', type: CartResponseDto })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async updateCart(
        @Param('cartId') cartId: string,
        @Body() updateCartDto: UpdateCartDto,
        @Request() req,
    ): Promise<CartResponseDto> {
        return this.cartCheckoutService.updateCart(cartId, updateCartDto, req.user.userId);
    }

    @Delete('cart/:cartId/clear')
    @ApiOperation({ summary: 'Clear all items from cart' })
    @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async clearCart(@Param('cartId') cartId: string, @Request() req): Promise<void> {
        return this.cartCheckoutService.clearCart(cartId, req.user.userId);
    }

    @Post('cart/:userCartId/merge/:guestCartId')
    @ApiOperation({ summary: 'Merge guest cart with user cart' })
    @ApiResponse({ status: 200, description: 'Carts merged successfully', type: CartResponseDto })
    @ApiParam({ name: 'userCartId', description: 'User Cart ID' })
    @ApiParam({ name: 'guestCartId', description: 'Guest Cart ID' })
    async mergeCart(
        @Param('guestCartId') guestCartId: string,
        @Param('userCartId') userCartId: string,
        @Body() mergeDto: MergeCartDto,
    ): Promise<CartResponseDto> {
        return this.cartCheckoutService.mergeCart(guestCartId, userCartId, mergeDto);
    }

    @Post('cart/:cartId/validate')
    @ApiOperation({ summary: 'Validate cart items availability and pricing' })
    @ApiResponse({ status: 200, description: 'Cart validation completed', type: CartValidationDto })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async validateCart(@Param('cartId') cartId: string, @Request() req): Promise<CartValidationDto> {
        return this.cartCheckoutService.validateCart(cartId, req.user.userId);
    }

    // ==================== CART ITEM MANAGEMENT ====================

    @Post('cart/:cartId/items')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart successfully', type: CartItemResponseDto })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async addItemToCart(
        @Param('cartId') cartId: string,
        @Body() createItemDto: CreateCartItemDto,
        @Request() req,
    ): Promise<CartItemResponseDto> {
        return this.cartCheckoutService.addItemToCart(cartId, createItemDto, req.user.userId);
    }

    @Put('cart/items/:itemId')
    @ApiOperation({ summary: 'Update cart item' })
    @ApiResponse({ status: 200, description: 'Cart item updated successfully', type: CartItemResponseDto })
    @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
    async updateCartItem(
        @Param('itemId') itemId: string,
        @Body() updateItemDto: UpdateCartItemDto,
        @Request() req,
    ): Promise<CartItemResponseDto> {
        return this.cartCheckoutService.updateCartItem(itemId, updateItemDto, req.user.userId);
    }

    @Delete('cart/items/:itemId')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 204, description: 'Item removed from cart successfully' })
    @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeCartItem(@Param('itemId') itemId: string, @Request() req): Promise<void> {
        return this.cartCheckoutService.removeCartItem(itemId, req.user.userId);
    }

    @Post('cart/:cartId/items/bulk')
    @ApiOperation({ summary: 'Add multiple items to cart' })
    @ApiResponse({ status: 201, description: 'Items added to cart successfully', type: [CartItemResponseDto] })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async bulkAddToCart(
        @Param('cartId') cartId: string,
        @Body() bulkAddDto: BulkAddToCartDto,
        @Request() req,
    ): Promise<CartItemResponseDto[]> {
        return this.cartCheckoutService.bulkAddToCart(cartId, bulkAddDto, req.user.userId);
    }

    @Post('cart/:cartId/from-quote')
    @Buyer()
    @ApiOperation({ summary: 'Add quote items to cart' })
    @ApiResponse({ status: 201, description: 'Quote items added to cart successfully', type: [CartItemResponseDto] })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async addQuoteToCart(
        @Param('cartId') cartId: string,
        @Body() quoteToCartDto: QuoteToCartDto,
        @Request() req,
    ): Promise<CartItemResponseDto[]> {
        return this.cartCheckoutService.addQuoteToCart(cartId, quoteToCartDto, req.user.userId);
    }

    // ==================== ADDRESS MANAGEMENT ====================

    @Post('addresses')
    @ApiOperation({ summary: 'Create a new address' })
    @ApiResponse({ status: 201, description: 'Address created successfully', type: AddressResponseDto })
    async createAddress(@Body() createAddressDto: CreateAddressDto, @Request() req): Promise<AddressResponseDto> {
        return this.cartCheckoutService.createAddress(createAddressDto, req.user.userId);
    }

    @Get('addresses')
    @ApiOperation({ summary: 'Get user addresses' })
    @ApiResponse({ status: 200, description: 'Addresses retrieved successfully', type: AddressListDto })
    @ApiQuery({ name: 'companyId', required: false, description: 'Company ID filter' })
    async getAddresses(@Query('companyId') companyId: string, @Request() req): Promise<AddressListDto> {
        return this.cartCheckoutService.getAddresses(req.user.userId, companyId);
    }

    @Put('addresses/:addressId')
    @ApiOperation({ summary: 'Update address' })
    @ApiResponse({ status: 200, description: 'Address updated successfully', type: AddressResponseDto })
    @ApiParam({ name: 'addressId', description: 'Address ID' })
    async updateAddress(
        @Param('addressId') addressId: string,
        @Body() updateAddressDto: UpdateAddressDto,
        @Request() req,
    ): Promise<AddressResponseDto> {
        return this.cartCheckoutService.updateAddress(addressId, updateAddressDto, req.user.userId);
    }

    @Delete('addresses/:addressId')
    @ApiOperation({ summary: 'Delete address' })
    @ApiResponse({ status: 204, description: 'Address deleted successfully' })
    @ApiParam({ name: 'addressId', description: 'Address ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAddress(@Param('addressId') addressId: string, @Request() req): Promise<void> {
        return this.cartCheckoutService.deleteAddress(addressId, req.user.userId);
    }

    @Post('addresses/:addressId/set-default')
    @ApiOperation({ summary: 'Set address as default' })
    @ApiResponse({ status: 200, description: 'Default address updated successfully', type: AddressResponseDto })
    @ApiParam({ name: 'addressId', description: 'Address ID' })
    async setDefaultAddress(
        @Param('addressId') addressId: string,
        @Body() setDefaultDto: SetDefaultAddressDto,
        @Request() req,
    ): Promise<AddressResponseDto> {
        return this.cartCheckoutService.setDefaultAddress(addressId, setDefaultDto, req.user.userId);
    }

    // ==================== CHECKOUT PROCESS ====================

    @Post('checkout')
    @ApiOperation({ summary: 'Initiate checkout process' })
    @ApiResponse({ status: 201, description: 'Checkout initiated successfully', type: CheckoutResponseDto })
    async initiateCheckout(@Body() initiateDto: InitiateCheckoutDto, @Request() req): Promise<CheckoutResponseDto> {
        return this.checkoutService.initiateCheckout(initiateDto, req.user.userId);
    }

    @Get('checkout/:checkoutId')
    @ApiOperation({ summary: 'Get checkout details' })
    @ApiResponse({ status: 200, description: 'Checkout retrieved successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async getCheckout(@Param('checkoutId') checkoutId: string, @Request() req): Promise<CheckoutResponseDto> {
        return this.checkoutService.getCheckout(checkoutId, req.user.userId);
    }

    @Put('checkout/:checkoutId/shipping')
    @ApiOperation({ summary: 'Update checkout shipping information' })
    @ApiResponse({ status: 200, description: 'Shipping information updated successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async updateCheckoutShipping(
        @Param('checkoutId') checkoutId: string,
        @Body() shippingDto: UpdateCheckoutShippingDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.updateCheckoutShipping(checkoutId, shippingDto, req.user.userId);
    }

    @Put('checkout/:checkoutId/billing')
    @ApiOperation({ summary: 'Update checkout billing information' })
    @ApiResponse({ status: 200, description: 'Billing information updated successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async updateCheckoutBilling(
        @Param('checkoutId') checkoutId: string,
        @Body() billingDto: UpdateCheckoutBillingDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.updateCheckoutBilling(checkoutId, billingDto, req.user.userId);
    }

    @Put('checkout/:checkoutId/payment')
    @ApiOperation({ summary: 'Update checkout payment method' })
    @ApiResponse({ status: 200, description: 'Payment method updated successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async updateCheckoutPayment(
        @Param('checkoutId') checkoutId: string,
        @Body() paymentDto: UpdateCheckoutPaymentDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.updateCheckoutPayment(checkoutId, paymentDto, req.user.userId);
    }

    @Put('checkout/:checkoutId/notes')
    @ApiOperation({ summary: 'Update checkout notes' })
    @ApiResponse({ status: 200, description: 'Notes updated successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async updateCheckoutNotes(
        @Param('checkoutId') checkoutId: string,
        @Body() notesDto: UpdateCheckoutNotesDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.updateCheckoutNotes(checkoutId, notesDto, req.user.userId);
    }

    @Post('checkout/:checkoutId/submit')
    @ApiOperation({ summary: 'Submit checkout for processing or approval' })
    @ApiResponse({ status: 200, description: 'Checkout submitted successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async submitCheckout(
        @Param('checkoutId') checkoutId: string,
        @Body() submitDto: SubmitCheckoutDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.submitCheckout(checkoutId, submitDto, req.user.userId);
    }

    @Post('checkout/:checkoutId/approve')
    @ApiOperation({ summary: 'Approve or reject checkout' })
    @ApiResponse({ status: 200, description: 'Checkout approval decision processed', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async approveCheckout(
        @Param('checkoutId') checkoutId: string,
        @Body() approvalDto: ApproveCheckoutDto,
        @Request() req,
    ): Promise<CheckoutResponseDto> {
        return this.checkoutService.approveCheckout(checkoutId, approvalDto, req.user.userId);
    }

    @Post('checkout/:checkoutId/complete')
    @ApiOperation({ summary: 'Complete checkout and create order' })
    @ApiResponse({ status: 200, description: 'Checkout completed successfully', type: CheckoutResponseDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    async completeCheckout(@Param('checkoutId') checkoutId: string, @Request() req): Promise<CheckoutResponseDto> {
        return this.checkoutService.completeCheckout(checkoutId, req.user.userId);
    }

    @Get('checkouts')
    @ApiOperation({ summary: 'List checkouts with filters' })
    @ApiResponse({ status: 200, description: 'Checkouts retrieved successfully', type: CheckoutListDto })
    async listCheckouts(@Query() filterDto: CheckoutFilterDto, @Request() req): Promise<CheckoutListDto> {
        return this.checkoutService.listCheckouts(filterDto, req.user.userId, req.user.roles);
    }

    @Get('checkout/:checkoutId/approval-requirement')
    @ApiOperation({ summary: 'Check approval requirement for amount' })
    @ApiResponse({ status: 200, description: 'Approval requirement checked', type: ApprovalRequirementDto })
    @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
    @ApiQuery({ name: 'amount', description: 'Amount to check' })
    @ApiQuery({ name: 'companyId', required: false, description: 'Company ID' })
    async getApprovalRequirement(
        @Query('amount') amount: string,
        @Query('companyId') companyId: string,
        @Request() req,
    ): Promise<ApprovalRequirementDto> {
        return this.checkoutService.getApprovalRequirement(req.user.userId, parseFloat(amount), companyId);
    }

    // ==================== SAVED ITEMS MANAGEMENT ====================

    @Post('saved-items')
    @ApiOperation({ summary: 'Save item for later' })
    @ApiResponse({ status: 201, description: 'Item saved successfully', type: SavedItemResponseDto })
    async createSavedItem(@Body() createDto: CreateSavedItemDto, @Request() req): Promise<SavedItemResponseDto> {
        return this.savedItemsService.createSavedItem(createDto, req.user.userId);
    }

    @Get('saved-items')
    @ApiOperation({ summary: 'Get saved items with filters' })
    @ApiResponse({ status: 200, description: 'Saved items retrieved successfully', type: SavedItemsListDto })
    async listSavedItems(@Query() filterDto: SavedItemsFilterDto, @Request() req): Promise<SavedItemsListDto> {
        return this.savedItemsService.listSavedItems(filterDto, req.user.userId);
    }

    @Get('saved-items/:itemId')
    @ApiOperation({ summary: 'Get saved item details' })
    @ApiResponse({ status: 200, description: 'Saved item retrieved successfully', type: SavedItemResponseDto })
    @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
    async getSavedItem(@Param('itemId') itemId: string, @Request() req): Promise<SavedItemResponseDto> {
        return this.savedItemsService.getSavedItem(itemId, req.user.userId);
    }

    @Put('saved-items/:itemId')
    @ApiOperation({ summary: 'Update saved item' })
    @ApiResponse({ status: 200, description: 'Saved item updated successfully', type: SavedItemResponseDto })
    @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
    async updateSavedItem(
        @Param('itemId') itemId: string,
        @Body() updateDto: UpdateSavedItemDto,
        @Request() req,
    ): Promise<SavedItemResponseDto> {
        return this.savedItemsService.updateSavedItem(itemId, updateDto, req.user.userId);
    }

    @Delete('saved-items/:itemId')
    @ApiOperation({ summary: 'Delete saved item' })
    @ApiResponse({ status: 204, description: 'Saved item deleted successfully' })
    @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteSavedItem(@Param('itemId') itemId: string, @Request() req): Promise<void> {
        return this.savedItemsService.deleteSavedItem(itemId, req.user.userId);
    }

    @Post('saved-items/:itemId/add-to-cart/:cartId')
    @ApiOperation({ summary: 'Add saved item to cart' })
    @ApiResponse({ status: 201, description: 'Saved item added to cart successfully' })
    @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async addSavedItemToCart(
        @Param('itemId') itemId: string,
        @Param('cartId') cartId: string,
        @Body() addToCartDto: AddSavedItemToCartDto,
        @Request() req,
    ): Promise<any> {
        return this.savedItemsService.addSavedItemToCart(itemId, cartId, addToCartDto, req.user.userId);
    }

    @Post('saved-items/bulk-add-to-cart/:cartId')
    @ApiOperation({ summary: 'Add multiple saved items to cart' })
    @ApiResponse({ status: 201, description: 'Saved items added to cart successfully' })
    @ApiParam({ name: 'cartId', description: 'Cart ID' })
    async bulkAddSavedItemsToCart(
        @Param('cartId') cartId: string,
        @Body() bulkAddDto: BulkAddSavedItemsToCartDto,
        @Request() req,
    ): Promise<any[]> {
        return this.savedItemsService.bulkAddSavedItemsToCart(cartId, bulkAddDto, req.user.userId);
    }

    // ==================== HEALTH CHECK ====================

    @Get('health')
    @ApiOperation({ summary: 'Health check for cart and checkout services' })
    @ApiResponse({ status: 200, description: 'Service health status' })
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
}
