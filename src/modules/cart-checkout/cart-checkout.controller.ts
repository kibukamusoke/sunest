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
  Headers,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import {
  Buyer,
  MerchantUser,
  MerchantAdmin,
  SystemAdmin,
} from '../../common/decorators/roles.decorator';
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
@Controller('cart-checkout')
export class CartCheckoutController {
  constructor(
    private readonly cartCheckoutService: CartCheckoutService,
    private readonly checkoutService: CheckoutService,
    private readonly savedItemsService: SavedItemsService,
  ) {}

  // ==================== CART MANAGEMENT ====================

  @Post('cart')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
    type: CartResponseDto,
  })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async createCart(
    @Body() createCartDto: CreateCartDto,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartResponseDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    // For guest carts, add sessionId to the DTO
    if (!userId && sessionId) {
      createCartDto.sessionId = sessionId;
    }

    return this.cartCheckoutService.createCart(createCartDto, userId);
  }

  @Get('cart')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get current user or guest cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Company ID for B2B context',
  })
  @ApiQuery({
    name: 'sessionId',
    required: false,
    description: 'Session ID for guest carts',
  })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Alternative way to provide session ID',
  })
  async getUserCart(
    @Query('companyId') companyId?: string,
    @Query('sessionId') sessionId?: string,
    @Headers('x-session-id') headerSessionId?: string,
    @Request() req?: any,
  ): Promise<CartResponseDto> {
    const effectiveSessionId = sessionId || headerSessionId;
    const userId = req?.user?.userId;

    if (!userId && !effectiveSessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.getUserCart(
      userId,
      companyId,
      effectiveSessionId,
    );
  }

  @Get('cart/:cartId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async getCart(
    @Param('cartId') cartId: string,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartResponseDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.getCart(cartId, userId);
  }

  @Put('cart/:cartId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Update cart details' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: CartResponseDto,
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async updateCart(
    @Param('cartId') cartId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartResponseDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.updateCart(cartId, updateCartDto, userId);
  }

  @Delete('cart/:cartId/clear')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(
    @Param('cartId') cartId: string,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<void> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.clearCart(cartId, userId);
  }

  @Post('cart/:userCartId/merge/:guestCartId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  @ApiResponse({
    status: 200,
    description: 'Carts merged successfully',
    type: CartResponseDto,
  })
  @ApiParam({ name: 'userCartId', description: 'User Cart ID' })
  @ApiParam({ name: 'guestCartId', description: 'Guest Cart ID' })
  async mergeCart(
    @Param('guestCartId') guestCartId: string,
    @Param('userCartId') userCartId: string,
    @Body() mergeDto: MergeCartDto,
  ): Promise<CartResponseDto> {
    return this.cartCheckoutService.mergeCart(
      guestCartId,
      userCartId,
      mergeDto,
    );
  }

  @Post('cart/merge-guest')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Merge guest cart with user cart on login' })
  @ApiResponse({
    status: 200,
    description: 'Guest cart merged successfully',
    type: CartResponseDto,
  })
  @ApiQuery({ name: 'sessionId', description: 'Guest session ID' })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Company ID for B2B context',
  })
  async mergeGuestCartOnLogin(
    @Query('sessionId') sessionId: string,
    @Request() req,
    @Query('companyId') companyId?: string,
  ): Promise<CartResponseDto> {
    return this.cartCheckoutService.mergeGuestCartOnLogin(
      sessionId,
      req.user.userId,
      companyId,
    );
  }

  @Post('cart/:cartId/validate')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Validate cart items availability and pricing' })
  @ApiResponse({
    status: 200,
    description: 'Cart validation completed',
    type: CartValidationDto,
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async validateCart(
    @Param('cartId') cartId: string,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartValidationDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.validateCart(cartId, userId);
  }

  // ==================== CART ITEM MANAGEMENT ====================

  @Post('cart/:cartId/items')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartItemResponseDto,
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body() createItemDto: CreateCartItemDto,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartItemResponseDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.addItemToCart(
      cartId,
      createItemDto,
      userId,
    );
  }

  @Put('cart/items/:itemId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartItemResponseDto,
  })
  @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateCartItemDto,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartItemResponseDto> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.updateCartItem(
      itemId,
      updateItemDto,
      userId,
    );
  }

  @Delete('cart/items/:itemId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 204,
    description: 'Item removed from cart successfully',
  })
  @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCartItem(
    @Param('itemId') itemId: string,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<void> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.removeCartItem(itemId, userId);
  }

  @Post('cart/:cartId/items/bulk')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Add multiple items to cart' })
  @ApiResponse({
    status: 201,
    description: 'Items added to cart successfully',
    type: [CartItemResponseDto],
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest carts',
  })
  async bulkAddToCart(
    @Param('cartId') cartId: string,
    @Body() bulkAddDto: BulkAddToCartDto,
    @Headers('x-session-id') sessionId?: string,
    @Request() req?: any,
  ): Promise<CartItemResponseDto[]> {
    const userId = req?.user?.userId;

    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Either authentication or sessionId is required',
      );
    }

    return this.cartCheckoutService.bulkAddToCart(cartId, bulkAddDto, userId);
  }

  @Post('cart/:cartId/from-quote')
  @UseGuards(JwtAuthGuard)
  @Buyer()
  @ApiOperation({ summary: 'Add quote items to cart' })
  @ApiResponse({
    status: 201,
    description: 'Quote items added to cart successfully',
    type: [CartItemResponseDto],
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  async addQuoteToCart(
    @Param('cartId') cartId: string,
    @Body() quoteToCartDto: QuoteToCartDto,
    @Request() req,
  ): Promise<CartItemResponseDto[]> {
    return this.cartCheckoutService.addQuoteToCart(
      cartId,
      quoteToCartDto,
      req.user.userId,
    );
  }

  // ==================== ADDRESS MANAGEMENT ====================

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    type: AddressResponseDto,
  })
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req,
  ): Promise<AddressResponseDto> {
    return this.cartCheckoutService.createAddress(
      createAddressDto,
      req.user.userId,
    );
  }

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user addresses' })
  @ApiResponse({
    status: 200,
    description: 'Addresses retrieved successfully',
    type: AddressListDto,
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Company ID filter',
  })
  async getAddresses(
    @Query('companyId') companyId: string,
    @Request() req,
  ): Promise<AddressListDto> {
    return this.cartCheckoutService.getAddresses(req.user.userId, companyId);
  }

  @Put('addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
    type: AddressResponseDto,
  })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ): Promise<AddressResponseDto> {
    return this.cartCheckoutService.updateAddress(
      addressId,
      updateAddressDto,
      req.user.userId,
    );
  }

  @Delete('addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({ status: 204, description: 'Address deleted successfully' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAddress(
    @Param('addressId') addressId: string,
    @Request() req,
  ): Promise<void> {
    return this.cartCheckoutService.deleteAddress(addressId, req.user.userId);
  }

  @Post('addresses/:addressId/set-default')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set address as default' })
  @ApiResponse({
    status: 200,
    description: 'Default address updated successfully',
    type: AddressResponseDto,
  })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  async setDefaultAddress(
    @Param('addressId') addressId: string,
    @Body() setDefaultDto: SetDefaultAddressDto,
    @Request() req,
  ): Promise<AddressResponseDto> {
    return this.cartCheckoutService.setDefaultAddress(
      addressId,
      setDefaultDto,
      req.user.userId,
    );
  }

  // ==================== CHECKOUT PROCESS ====================

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate checkout process' })
  @ApiResponse({
    status: 201,
    description: 'Checkout initiated successfully',
    type: CheckoutResponseDto,
  })
  async initiateCheckout(
    @Body() initiateDto: InitiateCheckoutDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.initiateCheckout(initiateDto, req.user.userId);
  }

  @Get('checkout/:checkoutId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get checkout details' })
  @ApiResponse({
    status: 200,
    description: 'Checkout retrieved successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async getCheckout(
    @Param('checkoutId') checkoutId: string,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.getCheckout(checkoutId, req.user.userId);
  }

  @Put('checkout/:checkoutId/shipping')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update checkout shipping information' })
  @ApiResponse({
    status: 200,
    description: 'Shipping information updated successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async updateCheckoutShipping(
    @Param('checkoutId') checkoutId: string,
    @Body() shippingDto: UpdateCheckoutShippingDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.updateCheckoutShipping(
      checkoutId,
      shippingDto,
      req.user.userId,
    );
  }

  @Put('checkout/:checkoutId/billing')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update checkout billing information' })
  @ApiResponse({
    status: 200,
    description: 'Billing information updated successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async updateCheckoutBilling(
    @Param('checkoutId') checkoutId: string,
    @Body() billingDto: UpdateCheckoutBillingDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.updateCheckoutBilling(
      checkoutId,
      billingDto,
      req.user.userId,
    );
  }

  @Put('checkout/:checkoutId/payment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update checkout payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async updateCheckoutPayment(
    @Param('checkoutId') checkoutId: string,
    @Body() paymentDto: UpdateCheckoutPaymentDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.updateCheckoutPayment(
      checkoutId,
      paymentDto,
      req.user.userId,
    );
  }

  @Put('checkout/:checkoutId/notes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update checkout notes' })
  @ApiResponse({
    status: 200,
    description: 'Notes updated successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async updateCheckoutNotes(
    @Param('checkoutId') checkoutId: string,
    @Body() notesDto: UpdateCheckoutNotesDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.updateCheckoutNotes(
      checkoutId,
      notesDto,
      req.user.userId,
    );
  }

  @Post('checkout/:checkoutId/submit')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit checkout for processing or approval' })
  @ApiResponse({
    status: 200,
    description: 'Checkout submitted successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async submitCheckout(
    @Param('checkoutId') checkoutId: string,
    @Body() submitDto: SubmitCheckoutDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.submitCheckout(
      checkoutId,
      submitDto,
      req.user.userId,
    );
  }

  @Post('checkout/:checkoutId/approve')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Approve or reject checkout' })
  @ApiResponse({
    status: 200,
    description: 'Checkout approval decision processed',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async approveCheckout(
    @Param('checkoutId') checkoutId: string,
    @Body() approvalDto: ApproveCheckoutDto,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.approveCheckout(
      checkoutId,
      approvalDto,
      req.user.userId,
    );
  }

  @Post('checkout/:checkoutId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete checkout and create order' })
  @ApiResponse({
    status: 200,
    description: 'Checkout completed successfully',
    type: CheckoutResponseDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  async completeCheckout(
    @Param('checkoutId') checkoutId: string,
    @Request() req,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.completeCheckout(checkoutId, req.user.userId);
  }

  @Get('checkouts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List checkouts with filters' })
  @ApiResponse({
    status: 200,
    description: 'Checkouts retrieved successfully',
    type: CheckoutListDto,
  })
  async listCheckouts(
    @Query() filterDto: CheckoutFilterDto,
    @Request() req,
  ): Promise<CheckoutListDto> {
    return this.checkoutService.listCheckouts(
      filterDto,
      req.user.userId,
      req.user.roles,
    );
  }

  @Get('checkout/:checkoutId/approval-requirement')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check approval requirement for amount' })
  @ApiResponse({
    status: 200,
    description: 'Approval requirement checked',
    type: ApprovalRequirementDto,
  })
  @ApiParam({ name: 'checkoutId', description: 'Checkout ID' })
  @ApiQuery({ name: 'amount', description: 'Amount to check' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Company ID' })
  async getApprovalRequirement(
    @Query('amount') amount: string,
    @Query('companyId') companyId: string,
    @Request() req,
  ): Promise<ApprovalRequirementDto> {
    return this.checkoutService.getApprovalRequirement(
      req.user.userId,
      parseFloat(amount),
      companyId,
    );
  }

  // ==================== SAVED ITEMS MANAGEMENT ====================

  @Post('saved-items')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Save item for later' })
  @ApiResponse({
    status: 201,
    description: 'Item saved successfully',
    type: SavedItemResponseDto,
  })
  async createSavedItem(
    @Body() createDto: CreateSavedItemDto,
    @Request() req,
  ): Promise<SavedItemResponseDto> {
    return this.savedItemsService.createSavedItem(createDto, req.user.userId);
  }

  @Get('saved-items')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get saved items with filters' })
  @ApiResponse({
    status: 200,
    description: 'Saved items retrieved successfully',
    type: SavedItemsListDto,
  })
  async listSavedItems(
    @Query() filterDto: SavedItemsFilterDto,
    @Request() req,
  ): Promise<SavedItemsListDto> {
    return this.savedItemsService.listSavedItems(filterDto, req.user.userId);
  }

  @Get('saved-items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get saved item details' })
  @ApiResponse({
    status: 200,
    description: 'Saved item retrieved successfully',
    type: SavedItemResponseDto,
  })
  @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
  async getSavedItem(
    @Param('itemId') itemId: string,
    @Request() req,
  ): Promise<SavedItemResponseDto> {
    return this.savedItemsService.getSavedItem(itemId, req.user.userId);
  }

  @Put('saved-items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update saved item' })
  @ApiResponse({
    status: 200,
    description: 'Saved item updated successfully',
    type: SavedItemResponseDto,
  })
  @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
  async updateSavedItem(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateSavedItemDto,
    @Request() req,
  ): Promise<SavedItemResponseDto> {
    return this.savedItemsService.updateSavedItem(
      itemId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete('saved-items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete saved item' })
  @ApiResponse({ status: 204, description: 'Saved item deleted successfully' })
  @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSavedItem(
    @Param('itemId') itemId: string,
    @Request() req,
  ): Promise<void> {
    return this.savedItemsService.deleteSavedItem(itemId, req.user.userId);
  }

  @Post('saved-items/:itemId/add-to-cart/:cartId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add saved item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Saved item added to cart successfully',
  })
  @ApiParam({ name: 'itemId', description: 'Saved Item ID' })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  async addSavedItemToCart(
    @Param('itemId') itemId: string,
    @Param('cartId') cartId: string,
    @Body() addToCartDto: AddSavedItemToCartDto,
    @Request() req,
  ): Promise<any> {
    return this.savedItemsService.addSavedItemToCart(
      itemId,
      cartId,
      addToCartDto,
      req.user.userId,
    );
  }

  @Post('saved-items/bulk-add-to-cart/:cartId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add multiple saved items to cart' })
  @ApiResponse({
    status: 201,
    description: 'Saved items added to cart successfully',
  })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  async bulkAddSavedItemsToCart(
    @Param('cartId') cartId: string,
    @Body() bulkAddDto: BulkAddSavedItemsToCartDto,
    @Request() req,
  ): Promise<any[]> {
    return this.savedItemsService.bulkAddSavedItemsToCart(
      cartId,
      bulkAddDto,
      req.user.userId,
    );
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
