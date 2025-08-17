import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { Prisma, CartItemSource, CartItemStatus, AddressType, CheckoutStatus, ApprovalStatus, PaymentMethod } from '@prisma/client';
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
    CheckoutCalculationDto,
    ApprovalRequirementDto,
    CreateSavedItemDto,
    UpdateSavedItemDto,
    SavedItemResponseDto,
    SavedItemsFilterDto,
    SavedItemsListDto,
    AddSavedItemToCartDto,
    BulkAddSavedItemsToCartDto,
} from './dto';

@Injectable()
export class CartCheckoutService {
    private readonly logger = new Logger(CartCheckoutService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
    ) { }

    // ==================== CART MANAGEMENT ====================

    async createCart(createCartDto: CreateCartDto, userId?: string): Promise<CartResponseDto> {
        try {
            const cart = await this.prisma.cart.create({
                data: {
                    userId: userId || null,
                    sessionId: createCartDto.sessionId,
                    companyId: createCartDto.companyId,
                    name: createCartDto.name,
                    isGuest: createCartDto.isGuest || !userId,
                    expiresAt: !userId ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null, // 7 days for guest carts
                },
                include: this.getCartIncludeOptions(),
            });

            return this.mapCartToResponseDto(cart);
        } catch (error) {
            this.logger.error('Failed to create cart:', error);
            throw new BadRequestException('Failed to create cart');
        }
    }

    async getCart(cartId: string, userId?: string): Promise<CartResponseDto> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
            include: this.getCartIncludeOptions(),
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return this.mapCartToResponseDto(cart);
    }

    async getUserCart(userId: string, companyId?: string): Promise<CartResponseDto> {
        let cart = await this.prisma.cart.findFirst({
            where: {
                userId,
                companyId,
                isActive: true,
                isGuest: false,
            },
            include: this.getCartIncludeOptions(),
        });

        if (!cart) {
            // Create a new cart for the user
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    companyId,
                    isGuest: false,
                },
                include: this.getCartIncludeOptions(),
            });
        }

        return this.mapCartToResponseDto(cart);
    }

    async updateCart(cartId: string, updateCartDto: UpdateCartDto, userId?: string): Promise<CartResponseDto> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const updatedCart = await this.prisma.cart.update({
            where: { id: cartId },
            data: {
                name: updateCartDto.name,
                shippingAddressId: updateCartDto.shippingAddressId,
                billingAddressId: updateCartDto.billingAddressId,
            },
            include: this.getCartIncludeOptions(),
        });

        return this.mapCartToResponseDto(updatedCart);
    }

    async clearCart(cartId: string, userId?: string): Promise<void> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        await this.prisma.cartItem.deleteMany({
            where: { cartId },
        });

        this.logger.log(`Cart ${cartId} cleared for user ${userId || 'guest'}`);
    }

    async mergeCart(guestCartId: string, userCartId: string, mergeDto: MergeCartDto): Promise<CartResponseDto> {
        const guestCart = await this.prisma.cart.findUnique({
            where: { id: guestCartId },
            include: { items: true },
        });

        const userCart = await this.prisma.cart.findUnique({
            where: { id: userCartId },
            include: { items: true },
        });

        if (!guestCart || !userCart) {
            throw new NotFoundException('Cart not found');
        }

        const mergeStrategy = mergeDto.mergeStrategy || 'combine_quantities';

        for (const guestItem of guestCart.items) {
            const existingItem = userCart.items.find(
                item => item.productId === guestItem.productId &&
                    item.productVariantId === guestItem.productVariantId
            );

            if (existingItem && mergeStrategy === 'combine_quantities') {
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + guestItem.quantity,
                        totalPrice: parseFloat(existingItem.unitPrice.toString()) * (existingItem.quantity + guestItem.quantity),
                    },
                });
            } else if (!existingItem || mergeStrategy === 'keep_both') {
                await this.prisma.cartItem.create({
                    data: {
                        cartId: userCartId,
                        productId: guestItem.productId,
                        productVariantId: guestItem.productVariantId,
                        customProductName: guestItem.customProductName,
                        customSku: guestItem.customSku,
                        customDescription: guestItem.customDescription,
                        quantity: guestItem.quantity,
                        unitPrice: guestItem.unitPrice,
                        totalPrice: guestItem.totalPrice,
                        originalPrice: guestItem.originalPrice,
                        sourceType: guestItem.sourceType,
                        sourceId: guestItem.sourceId,
                        requiredByDate: guestItem.requiredByDate,
                        notes: guestItem.notes,
                    },
                });
            }
            // 'keep_latest' strategy keeps user cart items unchanged
        }

        // Deactivate guest cart
        await this.prisma.cart.update({
            where: { id: guestCartId },
            data: { isActive: false },
        });

        return this.getUserCart(userCart.userId!, userCart.companyId || undefined);
    }

    // ==================== CART ITEM MANAGEMENT ====================

    async addItemToCart(cartId: string, createItemDto: CreateCartItemDto, userId?: string): Promise<CartItemResponseDto> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Validate product exists if productId provided
        let product: any = null;
        let productVariant: any = null;
        if (createItemDto.productId) {
            product = await this.prisma.product.findUnique({
                where: { id: createItemDto.productId },
                include: { inventoryItems: true },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
        }

        if (createItemDto.productVariantId) {
            productVariant = await this.prisma.productVariant.findUnique({
                where: { id: createItemDto.productVariantId },
            });
            if (!productVariant) {
                throw new NotFoundException('Product variant not found');
            }
        }

        // Calculate pricing
        const unitPrice = createItemDto.unitPrice ||
            (productVariant?.price ? parseFloat(productVariant.price.toString()) : 0) ||
            (product?.basePrice ? parseFloat(product.basePrice.toString()) : 0) ||
            0;

        const totalPrice = unitPrice * createItemDto.quantity;

        // Check if item already exists in cart
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId,
                productId: createItemDto.productId,
                productVariantId: createItemDto.productVariantId,
                status: CartItemStatus.ACTIVE,
            },
        });

        let cartItem;
        if (existingItem) {
            // Update existing item quantity
            cartItem = await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + createItemDto.quantity,
                    totalPrice: parseFloat(existingItem.unitPrice.toString()) * (existingItem.quantity + createItemDto.quantity),
                    notes: createItemDto.notes || existingItem.notes,
                    requiredByDate: createItemDto.requiredByDate ? new Date(createItemDto.requiredByDate) : existingItem.requiredByDate,
                },
                include: this.getCartItemIncludeOptions(),
            });
        } else {
            // Create new cart item
            cartItem = await this.prisma.cartItem.create({
                data: {
                    cartId,
                    productId: createItemDto.productId,
                    productVariantId: createItemDto.productVariantId,
                    customProductName: createItemDto.customProductName,
                    customSku: createItemDto.customSku,
                    customDescription: createItemDto.customDescription,
                    quantity: createItemDto.quantity,
                    unitPrice,
                    totalPrice,
                    sourceType: createItemDto.sourceType || CartItemSource.MANUAL,
                    sourceId: createItemDto.sourceId,
                    requiredByDate: createItemDto.requiredByDate ? new Date(createItemDto.requiredByDate) : null,
                    notes: createItemDto.notes,
                },
                include: this.getCartItemIncludeOptions(),
            });
        }

        this.logger.log(`Item added to cart ${cartId}: ${cartItem.id}`);
        return this.mapCartItemToResponseDto(cartItem);
    }

    async updateCartItem(itemId: string, updateItemDto: UpdateCartItemDto, userId?: string): Promise<CartItemResponseDto> {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                ...this.getCartItemIncludeOptions(),
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (userId && cartItem.cart.userId !== userId) {
            throw new ForbiddenException('Not authorized to update this cart item');
        }

        const updatedData: any = {};

        if (updateItemDto.quantity !== undefined) {
            updatedData.quantity = updateItemDto.quantity;
            updatedData.totalPrice = (updateItemDto.unitPrice || parseFloat(cartItem.unitPrice.toString())) * updateItemDto.quantity;
        }

        if (updateItemDto.unitPrice !== undefined) {
            updatedData.unitPrice = updateItemDto.unitPrice;
            updatedData.totalPrice = updateItemDto.unitPrice * (updateItemDto.quantity || cartItem.quantity);
        }

        if (updateItemDto.requiredByDate !== undefined) {
            updatedData.requiredByDate = updateItemDto.requiredByDate ? new Date(updateItemDto.requiredByDate) : null;
        }

        if (updateItemDto.notes !== undefined) {
            updatedData.notes = updateItemDto.notes;
        }

        if (updateItemDto.status !== undefined) {
            updatedData.status = updateItemDto.status;
        }

        const updatedCartItem = await this.prisma.cartItem.update({
            where: { id: itemId },
            data: updatedData,
            include: this.getCartItemIncludeOptions(),
        });

        return this.mapCartItemToResponseDto(updatedCartItem);
    }

    async removeCartItem(itemId: string, userId?: string): Promise<void> {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (userId && cartItem.cart.userId !== userId) {
            throw new ForbiddenException('Not authorized to remove this cart item');
        }

        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });

        this.logger.log(`Cart item ${itemId} removed from cart ${cartItem.cartId}`);
    }

    async bulkAddToCart(cartId: string, bulkAddDto: BulkAddToCartDto, userId?: string): Promise<CartItemResponseDto[]> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const results: CartItemResponseDto[] = [];

        for (const item of bulkAddDto.items) {
            try {
                const cartItem = await this.addItemToCart(cartId, {
                    ...item,
                    sourceType: bulkAddDto.sourceType || item.sourceType,
                    sourceId: bulkAddDto.sourceId || item.sourceId,
                }, userId);
                results.push(cartItem);
            } catch (error) {
                this.logger.warn(`Failed to add item to cart: ${error.message}`);
                // Continue with other items
            }
        }

        return results;
    }

    // ==================== QUOTE TO CART CONVERSION ====================

    async addQuoteToCart(cartId: string, quoteToCartDto: QuoteToCartDto, userId: string): Promise<CartItemResponseDto[]> {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteToCartDto.quoteId },
            include: {
                items: {
                    include: {
                        product: true,
                        rfqItem: true,
                    },
                },
                rfq: true,
            },
        });

        if (!quote) {
            throw new NotFoundException('Quote not found');
        }

        if (quote.rfq.requesterId !== userId) {
            throw new ForbiddenException('Not authorized to access this quote');
        }

        const itemsToAdd = quoteToCartDto.quoteItemIds
            ? quote.items.filter(item => quoteToCartDto.quoteItemIds!.includes(item.id))
            : quote.items;

        const results: CartItemResponseDto[] = [];

        for (const quoteItem of itemsToAdd) {
            try {
                // Parse quantity pricing (assuming JSON format: [{"qty": 1, "price": 100}, {"qty": 10, "price": 90}])
                const quantityPricing = JSON.parse(quoteItem.quantityPricing);
                const pricing = quantityPricing[0]; // Use first tier for now

                const cartItem = await this.addItemToCart(cartId, {
                    productId: quoteItem.productId || undefined,
                    customProductName: quoteItem.rfqItem.customProductName || undefined,
                    customSku: quoteItem.rfqItem.customSku || undefined,
                    customDescription: quoteItem.description || undefined,
                    quantity: pricing.qty,
                    unitPrice: quoteToCartDto.preserveQuotedPrices ? pricing.price : undefined,
                    sourceType: CartItemSource.QUOTE,
                    sourceId: quote.id,
                    notes: quoteItem.notes || undefined,
                }, userId);

                results.push(cartItem);
            } catch (error) {
                this.logger.warn(`Failed to add quote item ${quoteItem.id} to cart: ${error.message}`);
            }
        }

        return results;
    }

    // ==================== CART VALIDATION ====================

    async validateCart(cartId: string, userId?: string): Promise<CartValidationDto> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                inventoryItems: true,
                            },
                        },
                        productVariant: {
                            include: {
                                inventoryItems: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const validation: CartValidationDto = {
            isValid: true,
            errors: [],
            warnings: [],
            itemValidation: {},
            availability: {},
        };

        // Cart-level validation
        if (cart.items.length === 0) {
            validation.isValid = false;
            validation.errors.push('Cart is empty');
        }

        // Item-level validation
        for (const item of cart.items) {
            const itemValidation = {
                isValid: true,
                errors: [] as string[],
                warnings: [] as string[],
            };

            const availability = {
                available: 0,
                requested: item.quantity,
                leadTime: undefined as number | undefined,
                message: undefined as string | undefined,
            };

            // Check product availability
            if (item.product) {
                const inventoryItems = item.productVariant?.inventoryItems || item.product.inventoryItems;
                const totalAvailable = inventoryItems.reduce((sum, inv) => sum + inv.quantityOnHand, 0);

                availability.available = totalAvailable;

                if (totalAvailable < item.quantity) {
                    itemValidation.isValid = false;
                    itemValidation.errors.push(`Insufficient stock: ${totalAvailable} available, ${item.quantity} requested`);
                    availability.message = `Only ${totalAvailable} available`;
                } else if (totalAvailable < item.quantity * 2) {
                    itemValidation.warnings.push('Low stock levels');
                }

                // Check if product is active
                if (item.product.status !== 'PUBLISHED') {
                    itemValidation.isValid = false;
                    itemValidation.errors.push('Product is no longer available');
                }
            }

            // Check for price changes (simplified)
            if (item.originalPrice && item.unitPrice !== item.originalPrice) {
                itemValidation.warnings.push('Price has changed since added to cart');
            }

            validation.itemValidation[item.id] = itemValidation;
            validation.availability[item.id] = availability;

            if (!itemValidation.isValid) {
                validation.isValid = false;
            }
        }

        return validation;
    }

    // ==================== ADDRESS MANAGEMENT ====================

    async createAddress(createAddressDto: CreateAddressDto, userId: string): Promise<AddressResponseDto> {
        // If setting as default, unset other defaults of the same type
        if (createAddressDto.isDefault) {
            await this.prisma.address.updateMany({
                where: {
                    userId,
                    companyId: createAddressDto.companyId,
                    type: createAddressDto.type,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        const address = await this.prisma.address.create({
            data: {
                userId,
                companyId: createAddressDto.companyId,
                type: createAddressDto.type,
                name: createAddressDto.name,
                contactName: createAddressDto.contactName,
                contactPhone: createAddressDto.contactPhone,
                contactEmail: createAddressDto.contactEmail,
                addressLine1: createAddressDto.addressLine1,
                addressLine2: createAddressDto.addressLine2,
                city: createAddressDto.city,
                state: createAddressDto.state,
                postalCode: createAddressDto.postalCode,
                country: createAddressDto.country || 'US',
                isDefault: createAddressDto.isDefault || false,
                deliveryInstructions: createAddressDto.deliveryInstructions,
                accessCodes: createAddressDto.accessCodes,
                businessHours: createAddressDto.businessHours,
            },
            include: { company: true },
        });

        return this.mapAddressToResponseDto(address);
    }

    async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto, userId: string): Promise<AddressResponseDto> {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
                isActive: true,
            },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        // If setting as default, unset other defaults of the same type
        if (updateAddressDto.isDefault && updateAddressDto.type) {
            await this.prisma.address.updateMany({
                where: {
                    userId,
                    companyId: address.companyId,
                    type: updateAddressDto.type,
                    isDefault: true,
                    id: { not: addressId },
                },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await this.prisma.address.update({
            where: { id: addressId },
            data: updateAddressDto,
            include: { company: true },
        });

        return this.mapAddressToResponseDto(updatedAddress);
    }

    async getAddresses(userId: string, companyId?: string): Promise<AddressListDto> {
        const addresses = await this.prisma.address.findMany({
            where: {
                userId,
                companyId: companyId || null,
                isActive: true,
            },
            include: { company: true },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        const addressDtos = addresses.map(address => this.mapAddressToResponseDto(address));

        return {
            addresses: addressDtos,
            total: addressDtos.length,
            defaultShipping: addressDtos.find(addr =>
                addr.isDefault && (addr.type === AddressType.SHIPPING || addr.type === AddressType.BOTH)
            ),
            defaultBilling: addressDtos.find(addr =>
                addr.isDefault && (addr.type === AddressType.BILLING || addr.type === AddressType.BOTH)
            ),
        };
    }

    async deleteAddress(addressId: string, userId: string): Promise<void> {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
                isActive: true,
            },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        await this.prisma.address.update({
            where: { id: addressId },
            data: { isActive: false },
        });

        this.logger.log(`Address ${addressId} deleted for user ${userId}`);
    }

    async setDefaultAddress(addressId: string, setDefaultDto: SetDefaultAddressDto, userId: string): Promise<AddressResponseDto> {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
                isActive: true,
            },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        // Unset current default of this type
        await this.prisma.address.updateMany({
            where: {
                userId,
                companyId: address.companyId,
                type: setDefaultDto.type,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // Set new default
        const updatedAddress = await this.prisma.address.update({
            where: { id: addressId },
            data: {
                isDefault: true,
                type: setDefaultDto.type,
            },
            include: { company: true },
        });

        return this.mapAddressToResponseDto(updatedAddress);
    }

    // ==================== HELPER METHODS ====================

    private getCartIncludeOptions() {
        return {
            user: true,
            company: true,
            items: {
                where: { status: CartItemStatus.ACTIVE },
                include: this.getCartItemIncludeOptions(),
                orderBy: { createdAt: 'desc' as const },
            },
        };
    }

    private getCartItemIncludeOptions() {
        return {
            product: {
                include: {
                    inventoryItems: true,
                },
            },
            productVariant: {
                include: {
                    inventoryItems: true,
                },
            },
        };
    }

    private mapCartToResponseDto(cart: any): CartResponseDto {
        const summary = this.calculateCartSummary(cart.items);

        return {
            id: cart.id,
            userId: cart.userId,
            sessionId: cart.sessionId,
            company: cart.company ? {
                id: cart.company.id,
                name: cart.company.name,
                domain: cart.company.domain,
            } : undefined,
            name: cart.name,
            isActive: cart.isActive,
            isGuest: cart.isGuest,
            currency: cart.currency,
            shippingAddressId: cart.shippingAddressId,
            billingAddressId: cart.billingAddressId,
            items: cart.items.map((item: any) => this.mapCartItemToResponseDto(item)),
            summary,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            expiresAt: cart.expiresAt,
        };
    }

    private mapCartItemToResponseDto(item: any): CartItemResponseDto {
        const availability = this.calculateItemAvailability(item);

        return {
            id: item.id,
            cartId: item.cartId,
            product: item.product ? {
                id: item.product.id,
                name: item.product.name,
                sku: item.product.sku,
                brand: item.product.brand,
                images: item.product.images,
                status: item.product.status,
            } : undefined,
            productVariant: item.productVariant ? {
                id: item.productVariant.id,
                sku: item.productVariant.sku,
                name: item.productVariant.name,
                attributes: item.productVariant.attributes,
            } : undefined,
            customProductName: item.customProductName,
            customSku: item.customSku,
            customDescription: item.customDescription,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice.toString()),
            totalPrice: parseFloat(item.totalPrice.toString()),
            originalPrice: item.originalPrice ? parseFloat(item.originalPrice.toString()) : undefined,
            sourceType: item.sourceType,
            sourceId: item.sourceId,
            requiredByDate: item.requiredByDate?.toISOString(),
            notes: item.notes,
            isApproved: item.isApproved,
            approvedBy: item.approvedBy,
            approvedAt: item.approvedAt?.toISOString(),
            status: item.status,
            isAvailable: availability.isAvailable,
            availabilityMessage: availability.message,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }

    private mapAddressToResponseDto(address: any): AddressResponseDto {
        return {
            id: address.id,
            userId: address.userId,
            companyId: address.companyId,
            company: address.company ? {
                id: address.company.id,
                name: address.company.name,
                domain: address.company.domain,
            } : undefined,
            type: address.type,
            name: address.name,
            contactName: address.contactName,
            contactPhone: address.contactPhone,
            contactEmail: address.contactEmail,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault,
            isActive: address.isActive,
            deliveryInstructions: address.deliveryInstructions,
            accessCodes: address.accessCodes,
            businessHours: address.businessHours,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
            formattedAddress: this.formatAddress(address),
        };
    }

    private calculateCartSummary(items: any[]) {
        const activeItems = items.filter(item => item.status === CartItemStatus.ACTIVE);

        return {
            itemCount: activeItems.length,
            totalQuantity: activeItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(activeItems.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0).toFixed(2)),
            estimatedTax: 0, // TODO: Implement tax calculation
            estimatedShipping: 0, // TODO: Implement shipping calculation
            estimatedTotal: parseFloat(activeItems.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0).toFixed(2)),
            itemsRequiringApproval: activeItems.filter(item => !item.isApproved && parseFloat(item.totalPrice.toString()) > 1000).length,
            unavailableItems: activeItems.filter(item => !this.calculateItemAvailability(item).isAvailable).length,
        };
    }

    private calculateItemAvailability(item: any) {
        if (!item.product) {
            return { isAvailable: true, message: 'Custom item' };
        }

        const inventoryItems = item.productVariant?.inventoryItems || item.product.inventoryItems || [];
        const totalAvailable = inventoryItems.reduce((sum: number, inv: any) => sum + inv.quantityOnHand, 0);

        if (totalAvailable >= item.quantity) {
            return { isAvailable: true, message: `In stock - ${totalAvailable} available` };
        } else if (totalAvailable > 0) {
            return { isAvailable: false, message: `Low stock - only ${totalAvailable} available` };
        } else {
            return { isAvailable: false, message: 'Out of stock' };
        }
    }

    private formatAddress(address: any): string {
        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            `${address.state} ${address.postalCode}`,
            address.country,
        ].filter(Boolean);

        return parts.join(', ');
    }
}
