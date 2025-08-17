import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { Prisma } from '@prisma/client';
import {
    CreateSavedItemDto,
    UpdateSavedItemDto,
    SavedItemResponseDto,
    SavedItemsFilterDto,
    SavedItemsListDto,
    AddSavedItemToCartDto,
    BulkAddSavedItemsToCartDto,
} from './dto';

@Injectable()
export class SavedItemsService {
    private readonly logger = new Logger(SavedItemsService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ==================== SAVED ITEMS MANAGEMENT ====================

    async createSavedItem(createDto: CreateSavedItemDto, userId: string): Promise<SavedItemResponseDto> {
        // Validate product exists if productId provided
        if (createDto.productId) {
            const product = await this.prisma.product.findUnique({
                where: { id: createDto.productId },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
        }

        if (createDto.productVariantId) {
            const productVariant = await this.prisma.productVariant.findUnique({
                where: { id: createDto.productVariantId },
            });
            if (!productVariant) {
                throw new NotFoundException('Product variant not found');
            }
        }

        // Check if item already exists in saved items
        const existingItem = await this.prisma.savedItem.findFirst({
            where: {
                userId,
                productId: createDto.productId,
                productVariantId: createDto.productVariantId,
                isActive: true,
            },
        });

        if (existingItem) {
            // Update existing saved item
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

    async updateSavedItem(itemId: string, updateDto: UpdateSavedItemDto, userId: string): Promise<SavedItemResponseDto> {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
        });

        if (!savedItem) {
            throw new NotFoundException('Saved item not found');
        }

        const updatedItem = await this.prisma.savedItem.update({
            where: { id: itemId },
            data: updateDto,
            include: this.getSavedItemIncludeOptions(),
        });

        return this.mapSavedItemToResponseDto(updatedItem);
    }

    async deleteSavedItem(itemId: string, userId: string): Promise<void> {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
        });

        if (!savedItem) {
            throw new NotFoundException('Saved item not found');
        }

        await this.prisma.savedItem.update({
            where: { id: itemId },
            data: { isActive: false },
        });

        this.logger.log(`Saved item deleted: ${itemId} for user ${userId}`);
    }

    async getSavedItem(itemId: string, userId: string): Promise<SavedItemResponseDto> {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
            include: this.getSavedItemIncludeOptions(),
        });

        if (!savedItem) {
            throw new NotFoundException('Saved item not found');
        }

        return this.mapSavedItemToResponseDto(savedItem);
    }

    async listSavedItems(filterDto: SavedItemsFilterDto, userId: string): Promise<SavedItemsListDto> {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;

        const whereConditions: Prisma.SavedItemWhereInput[] = [
            { userId },
            { isActive: true },
        ];

        // Apply filters
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
                    { product: { name: { contains: filterDto.search, mode: 'insensitive' } } },
                    { product: { sku: { contains: filterDto.search, mode: 'insensitive' } } },
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
            } else {
                whereConditions.push({
                    OR: [
                        { product: { status: { not: 'PUBLISHED' } } },
                        { product: { isActive: false } },
                    ],
                });
            }
        }

        if (filterDto.hasPriceChange !== undefined) {
            // This is simplified - in reality we'd need to track price history
            whereConditions.push({
                savedPrice: { not: null },
            });
        }

        const whereClause: Prisma.SavedItemWhereInput = {
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

        const savedItemDtos = savedItems.map(item => this.mapSavedItemToResponseDto(item));

        // Get available lists and tags for the user
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

    // ==================== SAVED ITEMS TO CART ====================

    async addSavedItemToCart(
        itemId: string,
        cartId: string,
        addToCartDto: AddSavedItemToCartDto,
        userId: string,
    ): Promise<any> {
        const savedItem = await this.prisma.savedItem.findFirst({
            where: {
                id: itemId,
                userId,
                isActive: true,
            },
            include: this.getSavedItemIncludeOptions(),
        });

        if (!savedItem) {
            throw new NotFoundException('Saved item not found');
        }

        // Verify cart belongs to user
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId,
                isActive: true,
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Get current price
        const currentPrice = savedItem.productVariant?.price ? parseFloat(savedItem.productVariant.price.toString()) :
            savedItem.product?.basePrice ? parseFloat(savedItem.product.basePrice.toString()) :
                savedItem.savedPrice ? parseFloat(savedItem.savedPrice.toString()) :
                    0;

        const quantity = addToCartDto.quantity || savedItem.quantity;

        // Check if item already exists in cart
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
            // Update existing cart item
            cartItem = await this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    totalPrice: parseFloat(existingCartItem.unitPrice.toString()) * (existingCartItem.quantity + quantity),
                    notes: addToCartDto.notes || existingCartItem.notes,
                },
            });
        } else {
            // Create new cart item
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

    async bulkAddSavedItemsToCart(
        cartId: string,
        bulkAddDto: BulkAddSavedItemsToCartDto,
        userId: string,
    ): Promise<any[]> {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: cartId,
                userId,
                isActive: true,
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
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
            throw new BadRequestException('Some saved items were not found');
        }

        const results: any[] = [];

        for (let i = 0; i < savedItems.length; i++) {
            const savedItem = savedItems[i];
            const quantity = bulkAddDto.useSavedQuantities
                ? savedItem.quantity
                : (bulkAddDto.customQuantities?.[i] || savedItem.quantity);

            try {
                const cartItem = await this.addSavedItemToCart(
                    savedItem.id,
                    cartId,
                    { quantity },
                    userId,
                );
                results.push(cartItem);
            } catch (error) {
                this.logger.warn(`Failed to add saved item ${savedItem.id} to cart: ${error.message}`);
            }
        }

        return results;
    }

    // ==================== LIST MANAGEMENT ====================

    private async getAvailableLists(userId: string) {
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

        return lists.map(list => ({
            id: list.listName!, // Using listName as ID for simplicity
            name: list.listName!,
            description: undefined,
            userId,
            tags: [],
            isPublic: false,
            itemCount: list._count.id,
            totalEstimatedValue: parseFloat((list._sum.savedPrice || 0).toString()),
            createdAt: new Date(), // Simplified
            updatedAt: new Date(), // Simplified
        }));
    }

    private async getAvailableTags(userId: string): Promise<string[]> {
        const savedItems = await this.prisma.savedItem.findMany({
            where: {
                userId,
                isActive: true,
            },
            select: {
                tags: true,
            },
        });

        const allTags = savedItems.flatMap(item => item.tags);
        return [...new Set(allTags)].sort();
    }

    // ==================== HELPER METHODS ====================

    private getSavedItemIncludeOptions() {
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

    private mapSavedItemToResponseDto(savedItem: any): SavedItemResponseDto {
        const currentPrice = savedItem.productVariant?.price ? parseFloat(savedItem.productVariant.price.toString()) :
            savedItem.product?.basePrice ? parseFloat(savedItem.product.basePrice.toString()) :
                null;

        const savedPrice = savedItem.savedPrice ? parseFloat(savedItem.savedPrice.toString()) : null;
        const priceChange = currentPrice && savedPrice ? currentPrice - savedPrice : 0;
        const priceChangePercentage = savedPrice && savedPrice > 0 ? (priceChange / savedPrice) * 100 : 0;

        const availability = this.calculateItemAvailability(savedItem);

        return {
            id: savedItem.id,
            userId: savedItem.userId,
            product: savedItem.product ? {
                id: savedItem.product.id,
                name: savedItem.product.name,
                sku: savedItem.product.sku,
                brand: savedItem.product.brand,
                images: savedItem.product.images,
                status: savedItem.product.status,
                basePrice: parseFloat(savedItem.product.basePrice.toString()),
            } : undefined,
            productVariant: savedItem.productVariant ? {
                id: savedItem.productVariant.id,
                sku: savedItem.productVariant.sku,
                name: savedItem.productVariant.name,
                attributes: savedItem.productVariant.attributes,
                price: savedItem.productVariant.price ? parseFloat(savedItem.productVariant.price.toString()) : undefined,
            } : undefined,
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

    private calculateItemAvailability(savedItem: any) {
        if (!savedItem.product) {
            return { isAvailable: true, message: 'Custom item' };
        }

        if (savedItem.product.status !== 'PUBLISHED' || !savedItem.product.isActive) {
            return { isAvailable: false, message: 'Product no longer available' };
        }

        const inventoryItems = savedItem.productVariant?.inventoryItems || savedItem.product.inventoryItems || [];
        const totalAvailable = inventoryItems.reduce((sum: number, inv: any) => sum + inv.quantityOnHand, 0);

        if (totalAvailable >= savedItem.quantity) {
            return { isAvailable: true, message: `In stock - ${totalAvailable} available` };
        } else if (totalAvailable > 0) {
            return { isAvailable: false, message: `Low stock - only ${totalAvailable} available` };
        } else {
            return { isAvailable: false, message: 'Out of stock' };
        }
    }
}
