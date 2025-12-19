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
var CartCheckoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartCheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const client_1 = require("@prisma/client");
let CartCheckoutService = CartCheckoutService_1 = class CartCheckoutService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(CartCheckoutService_1.name);
    }
    async createCart(createCartDto, userId) {
        try {
            const cart = await this.prisma.cart.create({
                data: {
                    userId: userId || null,
                    sessionId: createCartDto.sessionId,
                    companyId: createCartDto.companyId,
                    name: createCartDto.name,
                    isGuest: createCartDto.isGuest || !userId,
                    expiresAt: !userId
                        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        : null,
                },
                include: this.getCartIncludeOptions(),
            });
            return this.mapCartToResponseDto(cart);
        }
        catch (error) {
            this.logger.error('Failed to create cart:', error);
            throw new common_1.BadRequestException('Failed to create cart');
        }
    }
    async getCart(cartId, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
            include: this.getCartIncludeOptions(),
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        return this.mapCartToResponseDto(cart);
    }
    async getUserCart(userId, companyId, sessionId) {
        if (userId) {
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
        if (sessionId) {
            let cart = await this.prisma.cart.findFirst({
                where: {
                    sessionId,
                    isActive: true,
                    isGuest: true,
                },
                include: this.getCartIncludeOptions(),
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: {
                        sessionId,
                        isGuest: true,
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                    include: this.getCartIncludeOptions(),
                });
            }
            return this.mapCartToResponseDto(cart);
        }
        throw new common_1.BadRequestException('Either userId or sessionId must be provided');
    }
    async updateCart(cartId, updateCartDto, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
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
    async clearCart(cartId, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        await this.prisma.cartItem.deleteMany({
            where: { cartId },
        });
        this.logger.log(`Cart ${cartId} cleared for user ${userId || 'guest'}`);
    }
    async getGuestCartBySessionId(sessionId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                sessionId,
                isActive: true,
                isGuest: true,
            },
            include: this.getCartIncludeOptions(),
        });
        return cart ? this.mapCartToResponseDto(cart) : null;
    }
    async mergeCart(guestCartId, userCartId, mergeDto) {
        const guestCart = await this.prisma.cart.findUnique({
            where: { id: guestCartId },
            include: { items: true },
        });
        const userCart = await this.prisma.cart.findUnique({
            where: { id: userCartId },
            include: { items: true },
        });
        if (!guestCart || !userCart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const mergeStrategy = mergeDto.mergeStrategy || 'combine_quantities';
        for (const guestItem of guestCart.items) {
            const existingItem = userCart.items.find((item) => item.productId === guestItem.productId &&
                item.productVariantId === guestItem.productVariantId);
            if (existingItem && mergeStrategy === 'combine_quantities') {
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + guestItem.quantity,
                        totalPrice: parseFloat(existingItem.unitPrice.toString()) *
                            (existingItem.quantity + guestItem.quantity),
                    },
                });
            }
            else if (!existingItem || mergeStrategy === 'keep_both') {
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
        }
        await this.prisma.cart.update({
            where: { id: guestCartId },
            data: { isActive: false },
        });
        return this.getUserCart(userCart.userId, userCart.companyId || undefined);
    }
    async mergeGuestCartOnLogin(sessionId, userId, companyId) {
        const guestCart = await this.prisma.cart.findFirst({
            where: {
                sessionId,
                isActive: true,
                isGuest: true,
            },
            include: { items: true },
        });
        let userCart = await this.prisma.cart.findFirst({
            where: {
                userId,
                companyId,
                isActive: true,
                isGuest: false,
            },
            include: { items: true },
        });
        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: {
                    userId,
                    companyId,
                    isGuest: false,
                },
                include: { items: true },
            });
        }
        if (guestCart && guestCart.items.length > 0) {
            this.logger.log(`Merging guest cart ${guestCart.id} with user cart ${userCart.id} for user ${userId}`);
            for (const guestItem of guestCart.items) {
                const existingItem = userCart.items.find((item) => item.productId === guestItem.productId &&
                    item.productVariantId === guestItem.productVariantId);
                if (existingItem) {
                    await this.prisma.cartItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantity: existingItem.quantity + guestItem.quantity,
                            totalPrice: parseFloat(existingItem.unitPrice.toString()) *
                                (existingItem.quantity + guestItem.quantity),
                            notes: guestItem.notes
                                ? existingItem.notes
                                    ? `${existingItem.notes}; ${guestItem.notes}`
                                    : guestItem.notes
                                : existingItem.notes,
                        },
                    });
                }
                else {
                    await this.prisma.cartItem.create({
                        data: {
                            cartId: userCart.id,
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
            }
            await this.prisma.cart.update({
                where: { id: guestCart.id },
                data: { isActive: false },
            });
        }
        return this.getUserCart(userId, companyId);
    }
    async addItemToCart(cartId, createItemDto, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        let product = null;
        let productVariant = null;
        if (createItemDto.productId) {
            product = await this.prisma.product.findUnique({
                where: { id: createItemDto.productId },
                include: { inventoryItems: true },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
        }
        if (createItemDto.productVariantId) {
            productVariant = await this.prisma.productVariant.findUnique({
                where: { id: createItemDto.productVariantId },
            });
            if (!productVariant) {
                throw new common_1.NotFoundException('Product variant not found');
            }
        }
        const unitPrice = createItemDto.unitPrice ||
            (productVariant?.price
                ? parseFloat(productVariant.price.toString())
                : 0) ||
            (product?.basePrice ? parseFloat(product.basePrice.toString()) : 0) ||
            0;
        const totalPrice = unitPrice * createItemDto.quantity;
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId,
                productId: createItemDto.productId,
                productVariantId: createItemDto.productVariantId,
                status: client_1.CartItemStatus.ACTIVE,
            },
        });
        let cartItem;
        if (existingItem) {
            cartItem = await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + createItemDto.quantity,
                    totalPrice: parseFloat(existingItem.unitPrice.toString()) *
                        (existingItem.quantity + createItemDto.quantity),
                    notes: createItemDto.notes || existingItem.notes,
                    requiredByDate: createItemDto.requiredByDate
                        ? new Date(createItemDto.requiredByDate)
                        : existingItem.requiredByDate,
                },
                include: this.getCartItemIncludeOptions(),
            });
        }
        else {
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
                    sourceType: createItemDto.sourceType || client_1.CartItemSource.MANUAL,
                    sourceId: createItemDto.sourceId,
                    requiredByDate: createItemDto.requiredByDate
                        ? new Date(createItemDto.requiredByDate)
                        : null,
                    notes: createItemDto.notes,
                },
                include: this.getCartItemIncludeOptions(),
            });
        }
        this.logger.log(`Item added to cart ${cartId}: ${cartItem.id}`);
        return this.mapCartItemToResponseDto(cartItem);
    }
    async updateCartItem(itemId, updateItemDto, userId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                ...this.getCartItemIncludeOptions(),
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this cart item');
        }
        const updatedData = {};
        if (updateItemDto.quantity !== undefined) {
            updatedData.quantity = updateItemDto.quantity;
            updatedData.totalPrice =
                (updateItemDto.unitPrice || parseFloat(cartItem.unitPrice.toString())) *
                    updateItemDto.quantity;
        }
        if (updateItemDto.unitPrice !== undefined) {
            updatedData.unitPrice = updateItemDto.unitPrice;
            updatedData.totalPrice =
                updateItemDto.unitPrice * (updateItemDto.quantity || cartItem.quantity);
        }
        if (updateItemDto.requiredByDate !== undefined) {
            updatedData.requiredByDate = updateItemDto.requiredByDate
                ? new Date(updateItemDto.requiredByDate)
                : null;
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
    async removeCartItem(itemId, userId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to remove this cart item');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        this.logger.log(`Cart item ${itemId} removed from cart ${cartItem.cartId}`);
    }
    async bulkAddToCart(cartId, bulkAddDto, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                isActive: true,
                ...(userId ? { userId } : {}),
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const results = [];
        for (const item of bulkAddDto.items) {
            try {
                const cartItem = await this.addItemToCart(cartId, {
                    ...item,
                    sourceType: bulkAddDto.sourceType || item.sourceType,
                    sourceId: bulkAddDto.sourceId || item.sourceId,
                }, userId);
                results.push(cartItem);
            }
            catch (error) {
                this.logger.warn(`Failed to add item to cart: ${error.message}`);
            }
        }
        return results;
    }
    async addQuoteToCart(cartId, quoteToCartDto, userId) {
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
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to access this quote');
        }
        const itemsToAdd = quoteToCartDto.quoteItemIds
            ? quote.items.filter((item) => quoteToCartDto.quoteItemIds.includes(item.id))
            : quote.items;
        const results = [];
        for (const quoteItem of itemsToAdd) {
            try {
                const quantityPricing = JSON.parse(quoteItem.quantityPricing);
                const pricing = quantityPricing[0];
                const cartItem = await this.addItemToCart(cartId, {
                    productId: quoteItem.productId || undefined,
                    customProductName: quoteItem.rfqItem.customProductName || undefined,
                    customSku: quoteItem.rfqItem.customSku || undefined,
                    customDescription: quoteItem.description || undefined,
                    quantity: pricing.qty,
                    unitPrice: quoteToCartDto.preserveQuotedPrices
                        ? pricing.price
                        : undefined,
                    sourceType: client_1.CartItemSource.QUOTE,
                    sourceId: quote.id,
                    notes: quoteItem.notes || undefined,
                }, userId);
                results.push(cartItem);
            }
            catch (error) {
                this.logger.warn(`Failed to add quote item ${quoteItem.id} to cart: ${error.message}`);
            }
        }
        return results;
    }
    async validateCart(cartId, userId) {
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
            throw new common_1.NotFoundException('Cart not found');
        }
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            itemValidation: {},
            availability: {},
        };
        if (cart.items.length === 0) {
            validation.isValid = false;
            validation.errors.push('Cart is empty');
        }
        for (const item of cart.items) {
            const itemValidation = {
                isValid: true,
                errors: [],
                warnings: [],
            };
            const availability = {
                available: 0,
                requested: item.quantity,
                leadTime: undefined,
                message: undefined,
            };
            if (item.product) {
                const inventoryItems = item.productVariant?.inventoryItems || item.product.inventoryItems;
                const totalAvailable = inventoryItems.reduce((sum, inv) => sum + inv.quantityOnHand, 0);
                availability.available = totalAvailable;
                if (totalAvailable < item.quantity) {
                    itemValidation.isValid = false;
                    itemValidation.errors.push(`Insufficient stock: ${totalAvailable} available, ${item.quantity} requested`);
                    availability.message = `Only ${totalAvailable} available`;
                }
                else if (totalAvailable < item.quantity * 2) {
                    itemValidation.warnings.push('Low stock levels');
                }
                if (item.product.status !== 'PUBLISHED') {
                    itemValidation.isValid = false;
                    itemValidation.errors.push('Product is no longer available');
                }
            }
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
    async createAddress(createAddressDto, userId) {
        if (createAddressDto.isDefault) {
            await this.prisma.address.updateMany({
                where: {
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
                formattedAddress: createAddressDto.formattedAddress,
            },
            include: { company: true },
        });
        return this.mapAddressToResponseDto(address);
    }
    async updateAddress(addressId, updateAddressDto, userId) {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                isActive: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (updateAddressDto.isDefault && updateAddressDto.type) {
            await this.prisma.address.updateMany({
                where: {
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
    async getAddresses(userId, companyId) {
        const addresses = await this.prisma.address.findMany({
            where: {
                companyId: companyId,
                isActive: true,
            },
            include: { company: true },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        const addressDtos = addresses.map((address) => this.mapAddressToResponseDto(address));
        return {
            addresses: addressDtos,
            total: addressDtos.length,
            defaultShipping: addressDtos.find((addr) => addr.isDefault &&
                (addr.type === client_1.AddressType.SHIPPING ||
                    addr.type === client_1.AddressType.BOTH)),
            defaultBilling: addressDtos.find((addr) => addr.isDefault &&
                (addr.type === client_1.AddressType.BILLING || addr.type === client_1.AddressType.BOTH)),
        };
    }
    async deleteAddress(addressId, userId) {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                isActive: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.address.update({
            where: { id: addressId },
            data: { isActive: false },
        });
        this.logger.log(`Address ${addressId} deleted for user ${userId}`);
    }
    async setDefaultAddress(addressId, setDefaultDto, userId) {
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                isActive: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.address.updateMany({
            where: {
                companyId: address.companyId,
                type: setDefaultDto.type,
                isDefault: true,
            },
            data: { isDefault: false },
        });
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
    getCartIncludeOptions() {
        return {
            user: true,
            company: true,
            items: {
                where: { status: client_1.CartItemStatus.ACTIVE },
                include: this.getCartItemIncludeOptions(),
                orderBy: { createdAt: 'desc' },
            },
        };
    }
    getCartItemIncludeOptions() {
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
    mapCartToResponseDto(cart) {
        const summary = this.calculateCartSummary(cart.items);
        return {
            id: cart.id,
            userId: cart.userId,
            sessionId: cart.sessionId,
            company: cart.company
                ? {
                    id: cart.company.id,
                    name: cart.company.name,
                    domain: cart.company.domain,
                }
                : undefined,
            name: cart.name,
            isActive: cart.isActive,
            isGuest: cart.isGuest,
            currency: cart.currency,
            shippingAddressId: cart.shippingAddressId,
            billingAddressId: cart.billingAddressId,
            items: cart.items.map((item) => this.mapCartItemToResponseDto(item)),
            summary,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            expiresAt: cart.expiresAt,
        };
    }
    mapCartItemToResponseDto(item) {
        const availability = this.calculateItemAvailability(item);
        return {
            id: item.id,
            cartId: item.cartId,
            product: item.product
                ? {
                    id: item.product.id,
                    name: item.product.name,
                    sku: item.product.sku,
                    brand: item.product.brand,
                    images: item.product.images,
                    status: item.product.status,
                }
                : undefined,
            productVariant: item.productVariant
                ? {
                    id: item.productVariant.id,
                    sku: item.productVariant.sku,
                    name: item.productVariant.name,
                    attributes: item.productVariant.attributes,
                }
                : undefined,
            customProductName: item.customProductName,
            customSku: item.customSku,
            customDescription: item.customDescription,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice.toString()),
            totalPrice: parseFloat(item.totalPrice.toString()),
            originalPrice: item.originalPrice
                ? parseFloat(item.originalPrice.toString())
                : undefined,
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
    mapAddressToResponseDto(address) {
        return {
            id: address.id,
            userId: address.userId,
            companyId: address.companyId,
            company: address.company
                ? {
                    id: address.company.id,
                    name: address.company.name,
                    domain: address.company.domain,
                }
                : undefined,
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
            formattedAddress: address.formattedAddress || this.formatAddress(address),
        };
    }
    calculateCartSummary(items) {
        const activeItems = items.filter((item) => item.status === client_1.CartItemStatus.ACTIVE);
        return {
            itemCount: activeItems.length,
            totalQuantity: activeItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(activeItems
                .reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0)
                .toFixed(2)),
            estimatedTax: 0,
            estimatedShipping: 0,
            estimatedTotal: parseFloat(activeItems
                .reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0)
                .toFixed(2)),
            itemsRequiringApproval: activeItems.filter((item) => !item.isApproved && parseFloat(item.totalPrice.toString()) > 1000).length,
            unavailableItems: activeItems.filter((item) => !this.calculateItemAvailability(item).isAvailable).length,
        };
    }
    calculateItemAvailability(item) {
        if (!item.product) {
            return { isAvailable: true, message: 'Custom item' };
        }
        const inventoryItems = item.productVariant?.inventoryItems || item.product.inventoryItems || [];
        const totalAvailable = inventoryItems.reduce((sum, inv) => sum + inv.quantityOnHand, 0);
        if (totalAvailable >= item.quantity) {
            return {
                isAvailable: true,
                message: `In stock - ${totalAvailable} available`,
            };
        }
        else if (totalAvailable > 0) {
            return {
                isAvailable: false,
                message: `Low stock - only ${totalAvailable} available`,
            };
        }
        else {
            return { isAvailable: false, message: 'Out of stock' };
        }
    }
    formatAddress(address) {
        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            `${address.state} ${address.postalCode}`,
            address.country,
        ].filter(Boolean);
        return parts.join(', ');
    }
};
exports.CartCheckoutService = CartCheckoutService;
exports.CartCheckoutService = CartCheckoutService = CartCheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], CartCheckoutService);
//# sourceMappingURL=cart-checkout.service.js.map