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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const client_1 = require("@prisma/client");
let InventoryManagementService = class InventoryManagementService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createInventoryItem(createInventoryItemDto, userId) {
        const existingItem = await this.prisma.inventoryItem.findFirst({
            where: {
                productId: createInventoryItemDto.productId,
                productVariantId: createInventoryItemDto.productVariantId || null,
                batchNumber: createInventoryItemDto.batchNumber || null,
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Inventory item already exists for this product/variant/batch combination');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: createInventoryItemDto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (createInventoryItemDto.productVariantId) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: createInventoryItemDto.productVariantId },
            });
            if (!variant) {
                throw new common_1.NotFoundException('Product variant not found');
            }
        }
        const quantityOnHand = createInventoryItemDto.quantityOnHand || 0;
        const quantityReserved = 0;
        const quantityAvailable = quantityOnHand - quantityReserved;
        const inventoryItem = await this.prisma.inventoryItem.create({
            data: {
                ...createInventoryItemDto,
                quantityOnHand,
                quantityReserved,
                quantityAvailable,
                quantityCommitted: 0,
            },
            include: {
                product: true,
                productVariant: true,
            },
        });
        return this.mapToInventoryItemResponse(inventoryItem);
    }
    async getInventoryItems(searchDto, merchantId, isPublicAccess = false) {
        const { search, productId, lowStockOnly = false, outOfStockOnly = false, activeOnly = true, includeProduct = false, page = 1, limit = 20, } = searchDto;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const whereClause = {};
        if (merchantId) {
            whereClause.product = { merchantId };
        }
        else if (isPublicAccess) {
            whereClause.product = { status: 'PUBLISHED' };
        }
        if (search) {
            whereClause.OR = [
                { product: { name: { contains: search, mode: 'insensitive' } } },
                { product: { sku: { contains: search, mode: 'insensitive' } } },
                { batchNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (productId) {
            whereClause.productId = productId;
        }
        if (lowStockOnly) {
            whereClause.AND = [
                { minimumStock: { not: null } },
                { minimumStock: { gt: 0 } },
            ];
        }
        if (outOfStockOnly) {
            whereClause.quantityAvailable = { lte: 0 };
        }
        if (activeOnly) {
            whereClause.isActive = true;
        }
        const [items, total] = await Promise.all([
            this.prisma.inventoryItem.findMany({
                where: whereClause,
                include: {
                    product: includeProduct,
                    productVariant: true,
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.inventoryItem.count({ where: whereClause }),
        ]);
        return {
            items: items.map((item) => this.mapToInventoryItemResponse(item)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getInventoryItemById(itemId, merchantId) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
            include: {
                product: true,
                productVariant: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        if (merchantId && item.product.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return this.mapToInventoryItemResponse(item);
    }
    async updateInventoryItem(itemId, updateInventoryItemDto, merchantId) {
        const existingItem = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
            include: {
                product: true,
            },
        });
        if (!existingItem) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        if (merchantId && existingItem.product.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const quantityOnHand = updateInventoryItemDto.quantityOnHand ?? existingItem.quantityOnHand;
        const quantityReserved = updateInventoryItemDto.quantityReserved ?? existingItem.quantityReserved;
        const quantityAvailable = quantityOnHand - quantityReserved;
        const updatedItem = await this.prisma.inventoryItem.update({
            where: { id: itemId },
            data: {
                ...updateInventoryItemDto,
                quantityAvailable,
            },
            include: {
                product: true,
                productVariant: true,
            },
        });
        return this.mapToInventoryItemResponse(updatedItem);
    }
    async deleteInventoryItem(itemId, merchantId) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
            include: {
                product: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        if (merchantId && item.product.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        await this.prisma.inventoryItem.delete({
            where: { id: itemId },
        });
    }
    async bulkUpdateInventoryItems(bulkUpdateDto) {
        const errors = [];
        let updated = 0;
        for (const update of bulkUpdateDto.updates) {
            try {
                const item = await this.prisma.inventoryItem.findFirst({
                    where: {
                        product: { sku: update.productSku },
                        batchNumber: update.batchNumber || null,
                    },
                });
                if (!item) {
                    errors.push(`Inventory item not found for SKU: ${update.productSku}`);
                    continue;
                }
                await this.updateInventoryItem(item.id, {
                    quantityOnHand: update.quantityOnHand,
                    averageCost: update.averageCost,
                });
                updated++;
            }
            catch (error) {
                errors.push(`Error updating SKU ${update.productSku}: ${error.message}`);
            }
        }
        return { updated, errors };
    }
    async createStockMovement(createStockMovementDto, userId) {
        const { inventoryItemId, type, quantityChange, reason, unitCost } = createStockMovementDto;
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: inventoryItemId },
            include: {
                product: true,
            },
        });
        if (!inventoryItem) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const quantityBefore = inventoryItem.quantityOnHand;
        const quantityAfter = quantityBefore + quantityChange;
        if (quantityAfter < 0) {
            throw new common_1.BadRequestException('Insufficient stock for this operation');
        }
        const stockMovement = await this.prisma.stockMovement.create({
            data: {
                inventoryItemId,
                type,
                reason,
                quantityBefore,
                quantityChange,
                quantityAfter,
                unitCost,
                totalCost: unitCost ? unitCost * Math.abs(quantityChange) : null,
                performedBy: userId,
            },
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        await this.prisma.inventoryItem.update({
            where: { id: inventoryItemId },
            data: {
                quantityOnHand: quantityAfter,
                quantityAvailable: quantityAfter - inventoryItem.quantityReserved,
                averageCost: unitCost || inventoryItem.averageCost,
                lastPurchaseCost: type === 'RECEIPT' ? unitCost : inventoryItem.lastPurchaseCost,
                lastPurchaseDate: type === 'RECEIPT' ? new Date() : inventoryItem.lastPurchaseDate,
            },
        });
        return this.mapToStockMovementResponse(stockMovement);
    }
    async getStockMovements(searchDto) {
        const { inventoryItemId, type, performedBy, startDate, endDate, page = 1, limit = 20, } = searchDto;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const whereClause = {};
        if (inventoryItemId) {
            whereClause.inventoryItemId = inventoryItemId;
        }
        if (type) {
            whereClause.type = type;
        }
        if (performedBy) {
            whereClause.performedBy = performedBy;
        }
        if (startDate || endDate) {
            whereClause.performedAt = {};
            if (startDate) {
                whereClause.performedAt.gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.performedAt.lte = new Date(endDate);
            }
        }
        const [movements, total] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where: whereClause,
                include: {
                    inventoryItem: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: [{ performedAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.stockMovement.count({ where: whereClause }),
        ]);
        return {
            movements: movements.map((movement) => this.mapToStockMovementResponse(movement)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async adjustStock(adjustmentDto, userId) {
        const { inventoryItemId, newQuantity, reason } = adjustmentDto;
        const currentItem = await this.prisma.inventoryItem.findUnique({
            where: { id: inventoryItemId },
        });
        if (!currentItem) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const quantityChange = newQuantity - currentItem.quantityOnHand;
        const movementType = quantityChange >= 0
            ? client_1.StockMovementType.ADJUSTMENT
            : client_1.StockMovementType.ADJUSTMENT;
        return this.createStockMovement({
            inventoryItemId,
            type: movementType,
            quantityChange,
            reason: reason || 'Stock adjustment',
        }, userId);
    }
    async createPricingRule(createPricingRuleDto) {
        const pricingRule = await this.prisma.inventoryPricingRule.create({
            data: createPricingRuleDto,
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapToPricingRuleResponse(pricingRule);
    }
    async updatePricingRule(ruleId, updatePricingRuleDto) {
        const existingRule = await this.prisma.inventoryPricingRule.findUnique({
            where: { id: ruleId },
        });
        if (!existingRule) {
            throw new common_1.NotFoundException('Pricing rule not found');
        }
        const updatedRule = await this.prisma.inventoryPricingRule.update({
            where: { id: ruleId },
            data: updatePricingRuleDto,
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapToPricingRuleResponse(updatedRule);
    }
    async deletePricingRule(ruleId) {
        const rule = await this.prisma.inventoryPricingRule.findUnique({
            where: { id: ruleId },
        });
        if (!rule) {
            throw new common_1.NotFoundException('Pricing rule not found');
        }
        await this.prisma.inventoryPricingRule.delete({
            where: { id: ruleId },
        });
    }
    async getPricingRules(searchDto) {
        const { inventoryItemId, page = 1, limit = 20 } = searchDto;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const whereClause = {};
        if (inventoryItemId) {
            whereClause.inventoryItemId = inventoryItemId;
        }
        whereClause.isActive = true;
        const [rules, total] = await Promise.all([
            this.prisma.inventoryPricingRule.findMany({
                where: whereClause,
                include: {
                    inventoryItem: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.inventoryPricingRule.count({ where: whereClause }),
        ]);
        return {
            rules: rules.map((rule) => this.mapToPricingRuleResponse(rule)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async calculatePrice(priceCalculationDto) {
        const { inventoryItemId, quantity } = priceCalculationDto;
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: inventoryItemId },
            include: {
                product: true,
                pricingRules: {
                    where: { isActive: true },
                    orderBy: { priority: 'asc' },
                },
            },
        });
        if (!inventoryItem) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        let calculatedPrice = Number(inventoryItem.averageCost) || 0;
        const appliedRules = [];
        for (const rule of inventoryItem.pricingRules) {
            if (rule.minimumQuantity && quantity < rule.minimumQuantity) {
                continue;
            }
            const originalPrice = calculatedPrice;
            switch (rule.adjustmentType) {
                case client_1.PriceAdjustmentType.PERCENTAGE:
                    calculatedPrice =
                        calculatedPrice * (1 + Number(rule.priceAdjustment) / 100);
                    break;
                case client_1.PriceAdjustmentType.FIXED:
                    calculatedPrice = Number(rule.priceAdjustment);
                    break;
                case client_1.PriceAdjustmentType.MARKUP:
                    calculatedPrice =
                        calculatedPrice * (1 + Number(rule.priceAdjustment) / 100);
                    break;
                case client_1.PriceAdjustmentType.DISCOUNT:
                    calculatedPrice =
                        calculatedPrice * (1 - Number(rule.priceAdjustment) / 100);
                    break;
            }
            const priceAdjustment = calculatedPrice - originalPrice;
            const discountAmount = originalPrice > calculatedPrice ? originalPrice - calculatedPrice : 0;
            appliedRules.push({
                id: rule.id,
                name: rule.name,
                adjustmentType: rule.adjustmentType,
                priceAdjustment,
                discountAmount,
            });
        }
        const totalPrice = calculatedPrice * quantity;
        const stockAvailable = inventoryItem.quantityAvailable >= quantity;
        const basePrice = Number(inventoryItem.averageCost) || 0;
        const totalDiscount = (basePrice - calculatedPrice) * quantity;
        const discountPercentage = basePrice > 0 ? ((basePrice - calculatedPrice) / basePrice) * 100 : 0;
        return {
            basePrice,
            finalPrice: calculatedPrice,
            totalPrice,
            totalDiscount: Math.max(0, totalDiscount),
            discountPercentage: Math.max(0, discountPercentage),
            appliedRules,
            quantity,
            stockAvailable,
        };
    }
    mapToInventoryItemResponse(item) {
        const isLowStock = item.minimumStock
            ? item.quantityAvailable <= item.minimumStock
            : false;
        const isOutOfStock = item.quantityAvailable <= 0;
        return {
            id: item.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantityOnHand: item.quantityOnHand,
            quantityReserved: item.quantityReserved,
            quantityAvailable: item.quantityAvailable,
            quantityCommitted: item.quantityCommitted,
            minimumStock: item.minimumStock,
            maximumStock: item.maximumStock,
            reorderQuantity: item.reorderQuantity,
            leadTimeDays: item.leadTimeDays,
            averageCost: item.averageCost,
            lastPurchaseCost: item.lastPurchaseCost,
            lastPurchaseDate: item.lastPurchaseDate,
            batchNumber: item.batchNumber,
            expirationDate: item.expirationDate,
            manufacturingDate: item.manufacturingDate,
            isActive: item.isActive,
            isLowStock,
            isOutOfStock,
            lastCountDate: item.lastCountDate,
            lastCountBy: item.lastCountBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            product: item.product,
            productVariant: item.productVariant,
        };
    }
    mapToStockMovementResponse(movement) {
        return {
            id: movement.id,
            inventoryItemId: movement.inventoryItemId,
            type: movement.type,
            reason: movement.reason,
            reasonCode: movement.reasonCode,
            reference: movement.reference,
            quantityBefore: movement.quantityBefore,
            quantityChange: movement.quantityChange,
            quantityAfter: movement.quantityAfter,
            unitCost: movement.unitCost,
            totalCost: movement.totalCost,
            orderId: movement.orderId,
            transferId: movement.transferId,
            performedBy: movement.performedBy,
            performedAt: movement.performedAt,
            notes: movement.notes,
            inventoryItem: movement.inventoryItem,
        };
    }
    mapToPricingRuleResponse(rule) {
        const now = new Date();
        const isCurrentlyValid = rule.isActive &&
            (!rule.validFrom || new Date(rule.validFrom) <= now) &&
            (!rule.validTo || new Date(rule.validTo) >= now);
        return {
            id: rule.id,
            inventoryItemId: rule.inventoryItemId,
            name: rule.name,
            description: rule.description,
            adjustmentType: rule.adjustmentType,
            priceAdjustment: Number(rule.priceAdjustment) || 0,
            minimumQuantity: rule.minimumQuantity,
            maximumQuantity: rule.maximumQuantity,
            validFrom: rule.validFrom,
            validTo: rule.validTo,
            priority: rule.priority,
            isActive: rule.isActive,
            isCurrentlyValid,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
            inventoryItem: rule.inventoryItem,
        };
    }
};
exports.InventoryManagementService = InventoryManagementService;
exports.InventoryManagementService = InventoryManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], InventoryManagementService);
//# sourceMappingURL=inventory-management.service.js.map