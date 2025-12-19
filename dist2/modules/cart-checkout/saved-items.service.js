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
var SavedItemsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let SavedItemsService = SavedItemsService_1 = class SavedItemsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SavedItemsService_1.name);
    }
    async createSavedItem(createDto, userId) {
        if (!createDto.productId && !createDto.productVariantId) {
            throw new common_1.BadRequestException('Either productId or productVariantId is required');
        }
        if (createDto.productId) {
            const product = await this.prisma.product.findUnique({
                where: { id: createDto.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
        }
        if (createDto.productVariantId) {
            const productVariant = await this.prisma.productVariant.findUnique({
                where: { id: createDto.productVariantId },
            });
            if (!productVariant) {
                throw new common_1.NotFoundException('Product variant not found');
            }
        }
        const existingItem = await this.prisma.savedItem.findFirst({
            where: createDto.productVariantId
                ? {
                    userId,
                    productVariantId: createDto.productVariantId,
                    isActive: true,
                }
                : {
                    userId,
                    productId: createDto.productId,
                    productVariantId: null,
                    isActive: true,
                },
        });
        if (existingItem) {
            const updatedItem = await this.prisma.savedItem.update({
                where: { id: existingItem.id },
                data: {
                    name: createDto.name || existingItem.name,
                    notes: createDto.notes || existingItem.notes,
                    quantity: createDto.quantity || existingItem.quantity,
                    savedPrice: createDto.savedPrice || existingItem.savedPrice,
                    listName: createDto.listName || existingItem.listName,
                    tags: createDto.tags || existingItem.tags,
                },
                include: this.getSavedItemIncludeOptions(),
            });
            return this.mapSavedItemToResponseDto(updatedItem);
        }
        const savedItem = await this.prisma.savedItem.create({
            data: {
                userId,
                productId: createDto.productId,
                productVariantId: createDto.productVariantId,
                name: createDto.name,
                notes: createDto.notes,
                quantity: createDto.quantity || 1,
                savedPrice: createDto.savedPrice,
                listName: createDto.listName,
                tags: createDto.tags || [],
            },
            include: this.getSavedItemIncludeOptions(),
        });
        this.logger.log(`Saved item created: ${savedItem.id} for user ${userId}`);
        return this.mapSavedItemToResponseDto(savedItem);
    }
    async updateSavedItem(itemId, updateDto, userId) {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
        });
        if (!savedItem) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        const updatedItem = await this.prisma.savedItem.update({
            where: { id: itemId },
            data: updateDto,
            include: this.getSavedItemIncludeOptions(),
        });
        return this.mapSavedItemToResponseDto(updatedItem);
    }
    async deleteSavedItem(itemId, userId) {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
        });
        if (!savedItem) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        await this.prisma.savedItem.update({
            where: { id: itemId },
            data: { isActive: false },
        });
        this.logger.log(`Saved item deleted: ${itemId} for user ${userId}`);
    }
    async getSavedItem(itemId, userId) {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
            include: this.getSavedItemIncludeOptions(),
        });
        if (!savedItem) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        return this.mapSavedItemToResponseDto(savedItem);
    }
    async listSavedItems(filterDto, userId) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;
        const whereConditions = [
            { userId },
            { isActive: true },
        ];
        if (filterDto.listName) {
            whereConditions.push({ listName: filterDto.listName });
        }
        if (filterDto.tags && filterDto.tags.length > 0) {
            whereConditions.push({
                tags: {
                    hasSome: filterDto.tags,
                },
            });
        }
        if (filterDto.search) {
            whereConditions.push({
                OR: [
                    { name: { contains: filterDto.search, mode: 'insensitive' } },
                    { notes: { contains: filterDto.search, mode: 'insensitive' } },
                    {
                        product: {
                            name: { contains: filterDto.search, mode: 'insensitive' },
                        },
                    },
                    {
                        product: {
                            sku: { contains: filterDto.search, mode: 'insensitive' },
                        },
                    },
                ],
            });
        }
        if (filterDto.isAvailable !== undefined) {
            if (filterDto.isAvailable) {
                whereConditions.push({
                    product: {
                        status: 'PUBLISHED',
                        isActive: true,
                    },
                });
            }
            else {
                whereConditions.push({
                    OR: [
                        { product: { status: { not: 'PUBLISHED' } } },
                        { product: { isActive: false } },
                    ],
                });
            }
        }
        if (filterDto.hasPriceChange !== undefined) {
            whereConditions.push({
                savedPrice: { not: null },
            });
        }
        const whereClause = {
            AND: whereConditions,
        };
        const [savedItems, total] = await Promise.all([
            this.prisma.savedItem.findMany({
                where: whereClause,
                include: this.getSavedItemIncludeOptions(),
                orderBy: {
                    [filterDto.sortBy || 'createdAt']: filterDto.sortOrder || 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.savedItem.count({ where: whereClause }),
        ]);
        const savedItemDtos = savedItems.map((item) => this.mapSavedItemToResponseDto(item));
        const [availableLists, availableTags] = await Promise.all([
            this.getAvailableLists(userId),
            this.getAvailableTags(userId),
        ]);
        return {
            savedItems: savedItemDtos,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
            availableLists,
            availableTags,
        };
    }
    async addSavedItemToCart(itemId, cartId, addToCartDto, userId) {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
            include: this.getSavedItemIncludeOptions(),
        });
        if (!savedItem) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId,
                isActive: true,
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const currentPrice = savedItem.productVariant?.price
            ? parseFloat(savedItem.productVariant.price.toString())
            : savedItem.product?.basePrice
                ? parseFloat(savedItem.product.basePrice.toString())
                : savedItem.savedPrice
                    ? parseFloat(savedItem.savedPrice.toString())
                    : 0;
        const quantity = addToCartDto.quantity || savedItem.quantity;
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId,
                productId: savedItem.productId,
                productVariantId: savedItem.productVariantId,
                status: 'ACTIVE',
            },
        });
        let cartItem;
        if (existingCartItem) {
            cartItem = await this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    totalPrice: parseFloat(existingCartItem.unitPrice.toString()) *
                        (existingCartItem.quantity + quantity),
                    notes: addToCartDto.notes || existingCartItem.notes,
                },
            });
        }
        else {
            cartItem = await this.prisma.cartItem.create({
                data: {
                    cartId,
                    productId: savedItem.productId,
                    productVariantId: savedItem.productVariantId,
                    quantity,
                    unitPrice: currentPrice,
                    totalPrice: (currentPrice || 0) * quantity,
                    sourceType: 'SAVED_LIST',
                    sourceId: savedItem.id,
                    notes: addToCartDto.notes || savedItem.notes,
                },
            });
        }
        this.logger.log(`Saved item ${itemId} added to cart ${cartId}`);
        return cartItem;
    }
    async bulkAddSavedItemsToCart(cartId, bulkAddDto, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId,
                isActive: true,
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const savedItems = await this.prisma.savedItem.findMany({
            where: {
                id: { in: bulkAddDto.savedItemIds },
                userId,
                isActive: true,
            },
            include: this.getSavedItemIncludeOptions(),
        });
        if (savedItems.length !== bulkAddDto.savedItemIds.length) {
            throw new common_1.BadRequestException('Some saved items were not found');
        }
        const results = [];
        for (let i = 0; i < savedItems.length; i++) {
            const savedItem = savedItems[i];
            const quantity = bulkAddDto.useSavedQuantities
                ? savedItem.quantity
                : bulkAddDto.customQuantities?.[i] || savedItem.quantity;
            try {
                const cartItem = await this.addSavedItemToCart(savedItem.id, cartId, { quantity }, userId);
                results.push(cartItem);
            }
            catch (error) {
                this.logger.warn(`Failed to add saved item ${savedItem.id} to cart: ${error.message}`);
            }
        }
        return results;
    }
    async getAvailableLists(userId) {
        const lists = await this.prisma.savedItem.groupBy({
            by: ['listName'],
            where: {
                userId,
                isActive: true,
                listName: { not: null },
            },
            _count: {
                id: true,
            },
            _sum: {
                savedPrice: true,
            },
        });
        return lists.map((list) => ({
            id: list.listName,
            name: list.listName,
            description: undefined,
            userId,
            tags: [],
            isPublic: false,
            itemCount: list._count.id,
            totalEstimatedValue: parseFloat((list._sum.savedPrice || 0).toString()),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }
    async getAvailableTags(userId) {
        const savedItems = await this.prisma.savedItem.findMany({
            where: {
                userId,
                isActive: true,
            },
            select: {
                tags: true,
            },
        });
        const allTags = savedItems.flatMap((item) => item.tags);
        return [...new Set(allTags)].sort();
    }
    getSavedItemIncludeOptions() {
        return {
            product: {
                include: {
                    inventoryItems: true,
                },
            },
            productVariant: {
                include: {
                    inventoryItems: true,
                    product: true,
                },
            },
        };
    }
    mapSavedItemToResponseDto(savedItem) {
        const resolvedProduct = savedItem.product || savedItem.productVariant?.product;
        const currentPrice = savedItem.productVariant?.price
            ? parseFloat(savedItem.productVariant.price.toString())
            : resolvedProduct?.basePrice
                ? parseFloat(resolvedProduct.basePrice.toString())
                : null;
        const savedPrice = savedItem.savedPrice
            ? parseFloat(savedItem.savedPrice.toString())
            : null;
        const priceChange = currentPrice && savedPrice ? currentPrice - savedPrice : 0;
        const priceChangePercentage = savedPrice && savedPrice > 0 ? (priceChange / savedPrice) * 100 : 0;
        const availability = this.calculateItemAvailability(savedItem);
        return {
            id: savedItem.id,
            userId: savedItem.userId,
            product: resolvedProduct
                ? {
                    id: resolvedProduct.id,
                    name: resolvedProduct.name,
                    sku: resolvedProduct.sku,
                    brand: resolvedProduct.brand,
                    images: resolvedProduct.images,
                    status: resolvedProduct.status,
                    basePrice: parseFloat(resolvedProduct.basePrice.toString()),
                }
                : undefined,
            productVariant: savedItem.productVariant
                ? {
                    id: savedItem.productVariant.id,
                    sku: savedItem.productVariant.sku,
                    name: savedItem.productVariant.name,
                    attributes: savedItem.productVariant.attributes,
                    price: savedItem.productVariant.price
                        ? parseFloat(savedItem.productVariant.price.toString())
                        : undefined,
                }
                : undefined,
            name: savedItem.name,
            notes: savedItem.notes,
            quantity: savedItem.quantity,
            savedPrice: savedPrice || undefined,
            currentPrice: currentPrice || undefined,
            priceChange: parseFloat(priceChange.toFixed(2)),
            priceChangePercentage: parseFloat(priceChangePercentage.toFixed(2)),
            listName: savedItem.listName,
            tags: savedItem.tags,
            isActive: savedItem.isActive,
            isAvailable: availability.isAvailable,
            availabilityMessage: availability.message,
            createdAt: savedItem.createdAt,
            updatedAt: savedItem.updatedAt,
        };
    }
    calculateItemAvailability(savedItem) {
        const resolvedProduct = savedItem.product || savedItem.productVariant?.product;
        if (!resolvedProduct) {
            return { isAvailable: true, message: 'Custom item' };
        }
        if (resolvedProduct.status !== 'PUBLISHED' ||
            !resolvedProduct.isActive) {
            return { isAvailable: false, message: 'Product no longer available' };
        }
        const inventoryItems = savedItem.productVariant?.inventoryItems ||
            resolvedProduct.inventoryItems ||
            [];
        const totalAvailable = inventoryItems.reduce((sum, inv) => sum + inv.quantityOnHand, 0);
        if (totalAvailable >= savedItem.quantity) {
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
};
exports.SavedItemsService = SavedItemsService;
exports.SavedItemsService = SavedItemsService = SavedItemsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedItemsService);
//# sourceMappingURL=saved-items.service.js.map