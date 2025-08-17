import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/dto/notification.dto';
import { Prisma, WarehouseType, StockMovementType, PriceAdjustmentType } from '@prisma/client';
import {
    CreateWarehouseDto,
    UpdateWarehouseDto,
    WarehouseResponseDto,
    WarehouseListDto,
    WarehouseSearchDto,
    CreateInventoryItemDto,
    UpdateInventoryItemDto,
    InventoryItemResponseDto,
    InventoryItemListDto,
    InventorySearchDto,
    BulkInventoryUpdateDto,
    CreateStockMovementDto,
    StockMovementResponseDto,
    StockMovementListDto,
    StockMovementSearchDto,
    CreateStockTransferDto,
    StockAdjustmentDto,
    CreateInventoryPricingRuleDto,
    UpdateInventoryPricingRuleDto,
    InventoryPricingRuleResponseDto,
    InventoryPricingRuleListDto,
    PricingRuleSearchDto,
    PriceCalculationDto,
    PriceCalculationResponseDto,
} from './dto';

@Injectable()
export class InventoryManagementService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
    ) { }

    // ==================== WAREHOUSE MANAGEMENT ====================

    async createWarehouse(createWarehouseDto: CreateWarehouseDto, userId: string): Promise<WarehouseResponseDto> {
        // Check if warehouse code already exists
        const existingWarehouse = await this.prisma.warehouse.findFirst({
            where: { code: createWarehouseDto.code },
        });

        if (existingWarehouse) {
            throw new ConflictException('Warehouse with this code already exists');
        }

        // If parentId is provided, verify parent exists
        if (createWarehouseDto.parentId) {
            const parentWarehouse = await this.prisma.warehouse.findUnique({
                where: { id: createWarehouseDto.parentId },
            });

            if (!parentWarehouse) {
                throw new NotFoundException('Parent warehouse not found');
            }
        }

        // If merchantId is provided, verify merchant exists
        if (createWarehouseDto.merchantId) {
            const merchant = await this.prisma.merchant.findUnique({
                where: { id: createWarehouseDto.merchantId },
            });

            if (!merchant) {
                throw new NotFoundException('Merchant not found');
            }
        }

        const warehouse = await this.prisma.warehouse.create({
            data: {
                ...createWarehouseDto,
                createdBy: userId,
                updatedBy: userId,
            },
            include: {
                merchant: true,
                children: true,
            },
        });

        return this.mapToWarehouseResponse(warehouse);
    }

    async getWarehouses(searchDto: WarehouseSearchDto, merchantId?: string): Promise<WarehouseListDto> {
        const {
            search,
            type,
            merchantId: filterMerchantId,
            isActive,
            includeStats = false,
            includeChildren = false,
            page = 1,
            limit = 20,
        } = searchDto;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        const whereClause: Prisma.WarehouseWhereInput = {};

        // Apply merchant filter
        if (merchantId) {
            whereClause.merchantId = merchantId;
        } else if (filterMerchantId) {
            whereClause.merchantId = filterMerchantId;
        }

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            whereClause.type = type;
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive;
        }

        const [warehouses, total] = await Promise.all([
            this.prisma.warehouse.findMany({
                where: whereClause,
                include: {
                    merchant: true,
                    children: includeChildren,
                    _count: includeStats ? { select: { inventoryItems: true } } : false,
                },
                orderBy: [{ name: 'asc' }],
                skip,
                take,
            }),
            this.prisma.warehouse.count({ where: whereClause }),
        ]);

        return {
            warehouses: warehouses.map(warehouse => this.mapToWarehouseResponse(warehouse, includeStats)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getWarehouseById(warehouseId: string, includeStats = false): Promise<WarehouseResponseDto> {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
            include: {
                merchant: true,
                children: true,
                _count: includeStats ? { select: { inventoryItems: true } } : false,
            },
        });

        if (!warehouse) {
            throw new NotFoundException('Warehouse not found');
        }

        return this.mapToWarehouseResponse(warehouse, includeStats);
    }

    async updateWarehouse(warehouseId: string, updateWarehouseDto: UpdateWarehouseDto, userId: string): Promise<WarehouseResponseDto> {
        const existingWarehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
        });

        if (!existingWarehouse) {
            throw new NotFoundException('Warehouse not found');
        }

        // Validate parent warehouse if provided
        if (updateWarehouseDto.parentId) {
            const parentWarehouse = await this.prisma.warehouse.findUnique({
                where: { id: updateWarehouseDto.parentId },
            });

            if (!parentWarehouse) {
                throw new NotFoundException('Parent warehouse not found');
            }

            // Prevent circular reference
            if (updateWarehouseDto.parentId === warehouseId) {
                throw new BadRequestException('Warehouse cannot be its own parent');
            }
        }

        const updatedWarehouse = await this.prisma.warehouse.update({
            where: { id: warehouseId },
            data: {
                ...updateWarehouseDto,
                updatedBy: userId,
            },
            include: {
                merchant: true,
                children: true,
            },
        });

        return this.mapToWarehouseResponse(updatedWarehouse);
    }

    async deleteWarehouse(warehouseId: string): Promise<void> {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
            include: {
                inventoryItems: true,
                children: true,
            },
        });

        if (!warehouse) {
            throw new NotFoundException('Warehouse not found');
        }

        if (warehouse.inventoryItems.length > 0) {
            throw new BadRequestException('Cannot delete warehouse with existing inventory items');
        }

        if (warehouse.children.length > 0) {
            throw new BadRequestException('Cannot delete warehouse with child warehouses');
        }

        await this.prisma.warehouse.delete({
            where: { id: warehouseId },
        });
    }

    // ==================== INVENTORY ITEM MANAGEMENT ====================

    async createInventoryItem(createInventoryItemDto: CreateInventoryItemDto, userId: string): Promise<InventoryItemResponseDto> {
        // Check if inventory item already exists for this product/variant/warehouse/batch combination
        const existingItem = await this.prisma.inventoryItem.findFirst({
            where: {
                productId: createInventoryItemDto.productId,
                productVariantId: createInventoryItemDto.productVariantId || null,
                warehouseId: createInventoryItemDto.warehouseId,
                batchNumber: createInventoryItemDto.batchNumber || null,
            },
        });

        if (existingItem) {
            throw new ConflictException('Inventory item already exists for this product/variant/warehouse/batch combination');
        }

        // Verify product exists
        const product = await this.prisma.product.findUnique({
            where: { id: createInventoryItemDto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Verify product variant exists if provided
        if (createInventoryItemDto.productVariantId) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: createInventoryItemDto.productVariantId },
            });

            if (!variant) {
                throw new NotFoundException('Product variant not found');
            }
        }

        // Verify warehouse exists
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: createInventoryItemDto.warehouseId },
        });

        if (!warehouse) {
            throw new NotFoundException('Warehouse not found');
        }

        const quantityOnHand = createInventoryItemDto.quantityOnHand || 0;
        const quantityAvailable = quantityOnHand; // Initially all on-hand stock is available

        const inventoryItem = await this.prisma.inventoryItem.create({
            data: {
                ...createInventoryItemDto,
                quantityOnHand,
                quantityAvailable,
                lastPurchaseDate: createInventoryItemDto.lastPurchaseDate ? new Date(createInventoryItemDto.lastPurchaseDate) : undefined,
                expirationDate: createInventoryItemDto.expirationDate ? new Date(createInventoryItemDto.expirationDate) : undefined,
                manufacturingDate: createInventoryItemDto.manufacturingDate ? new Date(createInventoryItemDto.manufacturingDate) : undefined,
            },
            include: {
                product: true,
                productVariant: true,
                warehouse: true,
            },
        });

        // Create initial stock movement if quantity > 0
        if (quantityOnHand > 0) {
            await this.createStockMovement({
                inventoryItemId: inventoryItem.id,
                type: StockMovementType.RECEIPT,
                quantityChange: quantityOnHand,
                reason: 'Initial inventory setup',
                reasonCode: 'INITIAL_SETUP',
                unitCost: createInventoryItemDto.averageCost,
            }, userId);
        }

        return this.mapToInventoryItemResponse(inventoryItem);
    }

    async getInventoryItems(searchDto: InventorySearchDto, merchantId?: string): Promise<InventoryItemListDto> {
        const {
            search,
            productId,
            warehouseId,
            lowStockOnly = false,
            outOfStockOnly = false,
            activeOnly = true,
            includeProduct = true,
            includeWarehouse = true,
            page = 1,
            limit = 20,
        } = searchDto;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        const whereClause: Prisma.InventoryItemWhereInput = {};

        // Apply merchant filter via warehouse
        if (merchantId) {
            whereClause.warehouse = { merchantId };
        }

        if (search) {
            whereClause.OR = [
                { product: { name: { contains: search, mode: 'insensitive' } } },
                { product: { sku: { contains: search, mode: 'insensitive' } } },
                { productVariant: { sku: { contains: search, mode: 'insensitive' } } },
                { batchNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (productId) {
            whereClause.productId = productId;
        }

        if (warehouseId) {
            whereClause.warehouseId = warehouseId;
        }

        if (lowStockOnly) {
            whereClause.quantityAvailable = { lte: this.prisma.inventoryItem.fields.minimumStock };
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
                    productVariant: includeProduct,
                    warehouse: includeWarehouse,
                },
                orderBy: [{ updatedAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.inventoryItem.count({ where: whereClause }),
        ]);

        // Calculate summary statistics
        const summary = {
            totalItems: total,
            totalValue: items.reduce((sum, item) => sum + (item.quantityOnHand * parseFloat(item.averageCost?.toString() || '0')), 0),
            lowStockItems: items.filter(item => item.quantityAvailable <= (item.minimumStock || 0)).length,
            outOfStockItems: items.filter(item => item.quantityAvailable <= 0).length,
            averageStockLevel: items.length > 0 ? items.reduce((sum, item) => sum + item.quantityOnHand, 0) / items.length : 0,
        };

        return {
            items: items.map(item => this.mapToInventoryItemResponse(item)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            summary,
        };
    }

    async getInventoryItemById(itemId: string): Promise<InventoryItemResponseDto> {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
            include: {
                product: true,
                productVariant: true,
                warehouse: true,
            },
        });

        if (!item) {
            throw new NotFoundException('Inventory item not found');
        }

        return this.mapToInventoryItemResponse(item);
    }

    async updateInventoryItem(itemId: string, updateInventoryItemDto: UpdateInventoryItemDto, userId: string): Promise<InventoryItemResponseDto> {
        const existingItem = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
        });

        if (!existingItem) {
            throw new NotFoundException('Inventory item not found');
        }

        const updatedItem = await this.prisma.inventoryItem.update({
            where: { id: itemId },
            data: {
                ...updateInventoryItemDto,
                quantityAvailable: updateInventoryItemDto.quantityOnHand !== undefined
                    ? Math.max(0, updateInventoryItemDto.quantityOnHand - (updateInventoryItemDto.quantityReserved || existingItem.quantityReserved))
                    : undefined,
                lastPurchaseDate: updateInventoryItemDto.lastPurchaseDate ? new Date(updateInventoryItemDto.lastPurchaseDate) : undefined,
            },
            include: {
                product: true,
                productVariant: true,
                warehouse: true,
            },
        });

        return this.mapToInventoryItemResponse(updatedItem);
    }

    async deleteInventoryItem(itemId: string): Promise<void> {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id: itemId },
            include: {
                stockMovements: true,
            },
        });

        if (!item) {
            throw new NotFoundException('Inventory item not found');
        }

        if (item.quantityOnHand > 0) {
            throw new BadRequestException('Cannot delete inventory item with remaining stock');
        }

        await this.prisma.inventoryItem.delete({
            where: { id: itemId },
        });
    }

    async bulkUpdateInventory(bulkUpdateDto: BulkInventoryUpdateDto, userId: string): Promise<{ success: number; errors: any[] }> {
        const results = { success: 0, errors: [] as any[] };

        for (const update of bulkUpdateDto.updates) {
            try {
                // Find inventory item by product SKU and warehouse code
                const inventoryItem = await this.prisma.inventoryItem.findFirst({
                    where: {
                        product: { sku: update.productSku },
                        warehouse: { code: update.warehouseCode },
                        batchNumber: update.batchNumber || null,
                    },
                });

                if (!inventoryItem) {
                    results.errors.push({
                        productSku: update.productSku,
                        warehouseCode: update.warehouseCode,
                        error: 'Inventory item not found',
                    });
                    continue;
                }

                // Update the inventory item
                const updatedItem = await this.prisma.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: {
                        quantityOnHand: update.quantityOnHand,
                        averageCost: update.averageCost,
                        quantityAvailable: Math.max(0, (update.quantityOnHand || inventoryItem.quantityOnHand) - inventoryItem.quantityReserved),
                    },
                });

                // Create stock movement for quantity changes
                if (update.quantityOnHand !== undefined && update.quantityOnHand !== inventoryItem.quantityOnHand) {
                    await this.createStockMovement({
                        inventoryItemId: inventoryItem.id,
                        type: StockMovementType.ADJUSTMENT,
                        quantityChange: update.quantityOnHand - inventoryItem.quantityOnHand,
                        reason: bulkUpdateDto.reason,
                        reasonCode: bulkUpdateDto.reasonCode,
                        unitCost: update.averageCost,
                    }, userId);
                }

                results.success++;
            } catch (error) {
                results.errors.push({
                    productSku: update.productSku,
                    warehouseCode: update.warehouseCode,
                    error: error.message,
                });
            }
        }

        return results;
    }

    // ==================== STOCK MOVEMENT MANAGEMENT ====================

    async createStockMovement(createMovementDto: CreateStockMovementDto, userId: string): Promise<StockMovementResponseDto> {
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: createMovementDto.inventoryItemId },
        });

        if (!inventoryItem) {
            throw new NotFoundException('Inventory item not found');
        }

        const quantityBefore = inventoryItem.quantityOnHand;
        const quantityAfter = quantityBefore + createMovementDto.quantityChange;

        if (quantityAfter < 0) {
            throw new BadRequestException('Insufficient stock for this movement');
        }

        const totalCost = createMovementDto.unitCost
            ? createMovementDto.unitCost * Math.abs(createMovementDto.quantityChange)
            : undefined;

        // Create the stock movement
        const movement = await this.prisma.stockMovement.create({
            data: {
                ...createMovementDto,
                quantityBefore,
                quantityAfter,
                totalCost,
                performedBy: userId,
            },
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                        warehouse: true,
                    },
                },
                sourceWarehouse: true,
                destinationWarehouse: true,
            },
        });

        // Update the inventory item quantities
        await this.prisma.inventoryItem.update({
            where: { id: createMovementDto.inventoryItemId },
            data: {
                quantityOnHand: quantityAfter,
                quantityAvailable: Math.max(0, quantityAfter - inventoryItem.quantityReserved),
            },
        });

        return this.mapToStockMovementResponse(movement);
    }

    async getStockMovements(searchDto: StockMovementSearchDto): Promise<StockMovementListDto> {
        const {
            inventoryItemId,
            type,
            warehouseId,
            orderId,
            performedBy,
            startDate,
            endDate,
            includeInventoryItem = true,
            includeUser = false,
            page = 1,
            limit = 20,
        } = searchDto;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        const whereClause: Prisma.StockMovementWhereInput = {};

        if (inventoryItemId) {
            whereClause.inventoryItemId = inventoryItemId;
        }

        if (type) {
            whereClause.type = type;
        }

        if (warehouseId) {
            whereClause.OR = [
                { sourceWarehouseId: warehouseId },
                { destinationWarehouseId: warehouseId },
                { inventoryItem: { warehouseId } },
            ];
        }

        if (orderId) {
            whereClause.orderId = orderId;
        }

        if (performedBy) {
            whereClause.performedBy = performedBy;
        }

        if (startDate || endDate) {
            whereClause.performedAt = {};
            if (startDate) whereClause.performedAt.gte = new Date(startDate);
            if (endDate) whereClause.performedAt.lte = new Date(endDate);
        }

        const [movements, total] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where: whereClause,
                include: {
                    inventoryItem: includeInventoryItem ? {
                        include: {
                            product: true,
                            warehouse: true,
                        },
                    } : false,
                    sourceWarehouse: true,
                    destinationWarehouse: true,
                },
                orderBy: [{ performedAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.stockMovement.count({ where: whereClause }),
        ]);

        return {
            movements: movements.map(movement => this.mapToStockMovementResponse(movement)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async createStockTransfer(transferDto: CreateStockTransferDto, userId: string): Promise<string> {
        const transferId = `TRANSFER-${Date.now()}`;

        // Verify warehouses exist
        const [sourceWarehouse, destinationWarehouse] = await Promise.all([
            this.prisma.warehouse.findUnique({ where: { id: transferDto.sourceWarehouseId } }),
            this.prisma.warehouse.findUnique({ where: { id: transferDto.destinationWarehouseId } }),
        ]);

        if (!sourceWarehouse) {
            throw new NotFoundException('Source warehouse not found');
        }

        if (!destinationWarehouse) {
            throw new NotFoundException('Destination warehouse not found');
        }

        for (const item of transferDto.items) {
            const inventoryItem = await this.prisma.inventoryItem.findUnique({
                where: { id: item.inventoryItemId },
            });

            if (!inventoryItem) {
                throw new NotFoundException(`Inventory item ${item.inventoryItemId} not found`);
            }

            if (inventoryItem.quantityAvailable < item.quantity) {
                throw new BadRequestException(`Insufficient stock for item ${item.inventoryItemId}`);
            }

            // Create outbound movement from source
            await this.createStockMovement({
                inventoryItemId: item.inventoryItemId,
                type: StockMovementType.TRANSFER,
                quantityChange: -item.quantity,
                reason: item.reason || 'Stock transfer',
                reasonCode: 'TRANSFER_OUT',
                reference: transferDto.reference,
                sourceWarehouseId: transferDto.sourceWarehouseId,
                destinationWarehouseId: transferDto.destinationWarehouseId,
                transferId,
                notes: transferDto.notes,
            }, userId);

            // Find or create inventory item in destination warehouse
            const destinationItem = await this.prisma.inventoryItem.findFirst({
                where: {
                    productId: inventoryItem.productId,
                    productVariantId: inventoryItem.productVariantId,
                    warehouseId: transferDto.destinationWarehouseId,
                    batchNumber: inventoryItem.batchNumber,
                },
            });

            let destinationInventoryItemId: string;

            if (destinationItem) {
                destinationInventoryItemId = destinationItem.id;
            } else {
                // Create new inventory item in destination warehouse
                const newDestinationItem = await this.prisma.inventoryItem.create({
                    data: {
                        productId: inventoryItem.productId,
                        productVariantId: inventoryItem.productVariantId,
                        warehouseId: transferDto.destinationWarehouseId,
                        batchNumber: inventoryItem.batchNumber,
                        expirationDate: inventoryItem.expirationDate,
                        manufacturingDate: inventoryItem.manufacturingDate,
                        minimumStock: inventoryItem.minimumStock,
                        maximumStock: inventoryItem.maximumStock,
                        reorderQuantity: inventoryItem.reorderQuantity,
                        leadTimeDays: inventoryItem.leadTimeDays,
                        averageCost: inventoryItem.averageCost,
                    },
                });
                destinationInventoryItemId = newDestinationItem.id;
            }

            // Create inbound movement to destination
            await this.createStockMovement({
                inventoryItemId: destinationInventoryItemId,
                type: StockMovementType.TRANSFER,
                quantityChange: item.quantity,
                reason: item.reason || 'Stock transfer',
                reasonCode: 'TRANSFER_IN',
                reference: transferDto.reference,
                sourceWarehouseId: transferDto.sourceWarehouseId,
                destinationWarehouseId: transferDto.destinationWarehouseId,
                transferId,
                notes: transferDto.notes,
            }, userId);
        }

        return transferId;
    }

    async adjustStock(adjustmentDto: StockAdjustmentDto, userId: string): Promise<StockMovementResponseDto> {
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: adjustmentDto.inventoryItemId },
        });

        if (!inventoryItem) {
            throw new NotFoundException('Inventory item not found');
        }

        const quantityChange = adjustmentDto.newQuantity - inventoryItem.quantityOnHand;

        return this.createStockMovement({
            inventoryItemId: adjustmentDto.inventoryItemId,
            type: StockMovementType.ADJUSTMENT,
            quantityChange,
            reason: adjustmentDto.reason,
            reasonCode: adjustmentDto.reasonCode,
            notes: adjustmentDto.notes,
        }, userId);
    }

    // ==================== PRICING RULE MANAGEMENT ====================

    async createPricingRule(createRuleDto: CreateInventoryPricingRuleDto, userId: string): Promise<InventoryPricingRuleResponseDto> {
        // Verify inventory item exists
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: createRuleDto.inventoryItemId },
        });

        if (!inventoryItem) {
            throw new NotFoundException('Inventory item not found');
        }

        const rule = await this.prisma.inventoryPricingRule.create({
            data: {
                ...createRuleDto,
                validFrom: createRuleDto.validFrom ? new Date(createRuleDto.validFrom) : undefined,
                validTo: createRuleDto.validTo ? new Date(createRuleDto.validTo) : undefined,
                createdBy: userId,
                updatedBy: userId,
            },
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                        warehouse: true,
                    },
                },
            },
        });

        return this.mapToPricingRuleResponse(rule);
    }

    async getPricingRules(searchDto: PricingRuleSearchDto): Promise<InventoryPricingRuleListDto> {
        const {
            inventoryItemId,
            productId,
            warehouseId,
            adjustmentType,
            activeOnly = true,
            currentlyValidOnly = false,
            includeInventoryItem = true,
            page = 1,
            limit = 20,
        } = searchDto;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        const whereClause: Prisma.InventoryPricingRuleWhereInput = {};

        if (inventoryItemId) {
            whereClause.inventoryItemId = inventoryItemId;
        }

        if (productId) {
            whereClause.inventoryItem = { productId };
        }

        if (warehouseId) {
            whereClause.inventoryItem = { warehouseId };
        }

        if (adjustmentType) {
            whereClause.adjustmentType = adjustmentType;
        }

        if (activeOnly) {
            whereClause.isActive = true;
        }

        if (currentlyValidOnly) {
            const now = new Date();
            whereClause.AND = [
                { OR: [{ validFrom: null }, { validFrom: { lte: now } }] },
                { OR: [{ validTo: null }, { validTo: { gte: now } }] },
            ];
        }

        const [rules, total] = await Promise.all([
            this.prisma.inventoryPricingRule.findMany({
                where: whereClause,
                include: {
                    inventoryItem: includeInventoryItem ? {
                        include: {
                            product: true,
                            warehouse: true,
                        },
                    } : false,
                },
                orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
                skip,
                take,
            }),
            this.prisma.inventoryPricingRule.count({ where: whereClause }),
        ]);

        return {
            rules: rules.map(rule => this.mapToPricingRuleResponse(rule)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updatePricingRule(ruleId: string, updateRuleDto: UpdateInventoryPricingRuleDto, userId: string): Promise<InventoryPricingRuleResponseDto> {
        const existingRule = await this.prisma.inventoryPricingRule.findUnique({
            where: { id: ruleId },
        });

        if (!existingRule) {
            throw new NotFoundException('Pricing rule not found');
        }

        const updatedRule = await this.prisma.inventoryPricingRule.update({
            where: { id: ruleId },
            data: {
                ...updateRuleDto,
                validFrom: updateRuleDto.validFrom ? new Date(updateRuleDto.validFrom) : undefined,
                validTo: updateRuleDto.validTo ? new Date(updateRuleDto.validTo) : undefined,
                updatedBy: userId,
            },
            include: {
                inventoryItem: {
                    include: {
                        product: true,
                        warehouse: true,
                    },
                },
            },
        });

        return this.mapToPricingRuleResponse(updatedRule);
    }

    async deletePricingRule(ruleId: string): Promise<void> {
        const rule = await this.prisma.inventoryPricingRule.findUnique({
            where: { id: ruleId },
        });

        if (!rule) {
            throw new NotFoundException('Pricing rule not found');
        }

        await this.prisma.inventoryPricingRule.delete({
            where: { id: ruleId },
        });
    }

    async calculatePrice(calculationDto: PriceCalculationDto): Promise<PriceCalculationResponseDto> {
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
            where: { id: calculationDto.inventoryItemId },
            include: {
                product: true,
                pricingRules: {
                    where: {
                        isActive: true,
                        minimumQuantity: { lte: calculationDto.quantity },
                        OR: [
                            { maximumQuantity: null },
                            { maximumQuantity: { gte: calculationDto.quantity } },
                        ],
                    },
                    orderBy: { priority: 'desc' },
                },
            },
        });

        if (!inventoryItem) {
            throw new NotFoundException('Inventory item not found');
        }

        const basePrice = parseFloat(inventoryItem.product.basePrice.toString());
        let finalPrice = basePrice;
        const appliedRules: any[] = [];
        let totalDiscount = 0;

        // Apply pricing rules
        for (const rule of inventoryItem.pricingRules) {
            // Check date validity
            const now = new Date();
            if (rule.validFrom && rule.validFrom > now) continue;
            if (rule.validTo && rule.validTo < now) continue;

            // Check stock level conditions
            if (rule.minimumStockLevel && inventoryItem.quantityOnHand < rule.minimumStockLevel) continue;
            if (rule.maximumStockLevel && inventoryItem.quantityOnHand > rule.maximumStockLevel) continue;

            const adjustmentValue = parseFloat(rule.priceAdjustment.toString());
            let discountAmount = 0;

            switch (rule.adjustmentType) {
                case PriceAdjustmentType.FIXED:
                    finalPrice = adjustmentValue;
                    discountAmount = basePrice - adjustmentValue;
                    break;
                case PriceAdjustmentType.PERCENTAGE:
                    discountAmount = (basePrice * Math.abs(adjustmentValue)) / 100;
                    finalPrice = adjustmentValue < 0 ? basePrice - discountAmount : basePrice + discountAmount;
                    break;
                case PriceAdjustmentType.DISCOUNT:
                    discountAmount = Math.abs(adjustmentValue);
                    finalPrice = basePrice - discountAmount;
                    break;
                case PriceAdjustmentType.MARKUP:
                    const markup = (basePrice * adjustmentValue) / 100;
                    finalPrice = basePrice + markup;
                    discountAmount = -markup; // Negative because it's a markup
                    break;
            }

            totalDiscount += discountAmount;
            appliedRules.push({
                id: rule.id,
                name: rule.name,
                adjustmentType: rule.adjustmentType,
                priceAdjustment: adjustmentValue,
                discountAmount,
            });

            // Only apply the highest priority rule for now
            break;
        }

        const totalPrice = finalPrice * calculationDto.quantity;
        const discountPercentage = basePrice > 0 ? (totalDiscount / basePrice) * 100 : 0;

        return {
            basePrice,
            finalPrice: Math.max(0, finalPrice),
            totalPrice: Math.max(0, totalPrice),
            totalDiscount: totalDiscount * calculationDto.quantity,
            discountPercentage,
            appliedRules,
            quantity: calculationDto.quantity,
            stockAvailable: inventoryItem.quantityAvailable >= calculationDto.quantity,
        };
    }

    // ==================== HELPER METHODS ====================

    private mapToWarehouseResponse(warehouse: any, includeStats = false): WarehouseResponseDto {
        const response: WarehouseResponseDto = {
            id: warehouse.id,
            name: warehouse.name,
            code: warehouse.code,
            description: warehouse.description,
            type: warehouse.type,
            fullAddress: `${warehouse.addressLine1}${warehouse.addressLine2 ? ', ' + warehouse.addressLine2 : ''}, ${warehouse.city}, ${warehouse.state} ${warehouse.postalCode}, ${warehouse.country}`,
            addressLine1: warehouse.addressLine1,
            addressLine2: warehouse.addressLine2,
            city: warehouse.city,
            state: warehouse.state,
            postalCode: warehouse.postalCode,
            country: warehouse.country,
            capacity: warehouse.capacity,
            isActive: warehouse.isActive,
            parentId: warehouse.parentId,
            merchantId: warehouse.merchantId,
            createdBy: warehouse.createdBy,
            updatedBy: warehouse.updatedBy,
            createdAt: warehouse.createdAt,
            updatedAt: warehouse.updatedAt,
        };

        if (warehouse.children) {
            response.children = warehouse.children.map((child: any) => this.mapToWarehouseResponse(child));
        }

        if (includeStats && warehouse._count) {
            response.inventoryStats = {
                totalItems: warehouse._count.inventoryItems,
                totalValue: 0, // This would require a separate calculation
                lowStockItems: 0, // This would require a separate calculation
                outOfStockItems: 0, // This would require a separate calculation
            };
        }

        if (warehouse.merchant) {
            response.merchant = {
                id: warehouse.merchant.id,
                name: warehouse.merchant.name,
                displayName: warehouse.merchant.displayName,
            };
        }

        return response;
    }

    private mapToInventoryItemResponse(item: any): InventoryItemResponseDto {
        const response: InventoryItemResponseDto = {
            id: item.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            warehouseId: item.warehouseId,
            quantityOnHand: item.quantityOnHand,
            quantityReserved: item.quantityReserved,
            quantityAvailable: item.quantityAvailable,
            quantityCommitted: item.quantityCommitted,
            minimumStock: item.minimumStock || 0,
            maximumStock: item.maximumStock,
            reorderQuantity: item.reorderQuantity,
            leadTimeDays: item.leadTimeDays,
            averageCost: item.averageCost ? parseFloat(item.averageCost.toString()) : 0,
            lastPurchaseCost: item.lastPurchaseCost ? parseFloat(item.lastPurchaseCost.toString()) : undefined,
            lastPurchaseDate: item.lastPurchaseDate,
            batchNumber: item.batchNumber,
            expirationDate: item.expirationDate,
            manufacturingDate: item.manufacturingDate,
            isActive: item.isActive,
            isLowStock: item.quantityAvailable <= (item.minimumStock || 0),
            isOutOfStock: item.quantityAvailable <= 0,
            lastCountDate: item.lastCountDate,
            lastCountBy: item.lastCountBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };

        if (item.product) {
            response.product = {
                id: item.product.id,
                name: item.product.name,
                sku: item.product.sku,
                displayName: item.product.displayName,
            };
        }

        if (item.productVariant) {
            response.productVariant = {
                id: item.productVariant.id,
                name: item.productVariant.name,
                sku: item.productVariant.sku,
            };
        }

        if (item.warehouse) {
            response.warehouse = {
                id: item.warehouse.id,
                name: item.warehouse.name,
                code: item.warehouse.code,
            };
        }

        return response;
    }

    private mapToStockMovementResponse(movement: any): StockMovementResponseDto {
        const response: StockMovementResponseDto = {
            id: movement.id,
            inventoryItemId: movement.inventoryItemId,
            type: movement.type,
            reason: movement.reason,
            reasonCode: movement.reasonCode,
            reference: movement.reference,
            quantityBefore: movement.quantityBefore,
            quantityChange: movement.quantityChange,
            quantityAfter: movement.quantityAfter,
            unitCost: movement.unitCost ? parseFloat(movement.unitCost.toString()) : undefined,
            totalCost: movement.totalCost ? parseFloat(movement.totalCost.toString()) : undefined,
            sourceWarehouseId: movement.sourceWarehouseId,
            destinationWarehouseId: movement.destinationWarehouseId,
            orderId: movement.orderId,
            transferId: movement.transferId,
            performedBy: movement.performedBy,
            performedAt: movement.performedAt,
            notes: movement.notes,
        };

        if (movement.inventoryItem) {
            response.inventoryItem = {
                id: movement.inventoryItem.id,
                product: {
                    id: movement.inventoryItem.product.id,
                    name: movement.inventoryItem.product.name,
                    sku: movement.inventoryItem.product.sku,
                },
                warehouse: {
                    id: movement.inventoryItem.warehouse.id,
                    name: movement.inventoryItem.warehouse.name,
                    code: movement.inventoryItem.warehouse.code,
                },
            };
        }

        if (movement.sourceWarehouse) {
            response.sourceWarehouse = {
                id: movement.sourceWarehouse.id,
                name: movement.sourceWarehouse.name,
                code: movement.sourceWarehouse.code,
            };
        }

        if (movement.destinationWarehouse) {
            response.destinationWarehouse = {
                id: movement.destinationWarehouse.id,
                name: movement.destinationWarehouse.name,
                code: movement.destinationWarehouse.code,
            };
        }

        return response;
    }

    private mapToPricingRuleResponse(rule: any): InventoryPricingRuleResponseDto {
        const now = new Date();
        const isCurrentlyValid = (!rule.validFrom || rule.validFrom <= now) && (!rule.validTo || rule.validTo >= now);

        const response: InventoryPricingRuleResponseDto = {
            id: rule.id,
            inventoryItemId: rule.inventoryItemId,
            name: rule.name,
            description: rule.description,
            priority: rule.priority,
            minimumQuantity: rule.minimumQuantity,
            maximumQuantity: rule.maximumQuantity,
            priceAdjustment: parseFloat(rule.priceAdjustment.toString()),
            adjustmentType: rule.adjustmentType,
            minimumStockLevel: rule.minimumStockLevel,
            maximumStockLevel: rule.maximumStockLevel,
            validFrom: rule.validFrom,
            validTo: rule.validTo,
            isActive: rule.isActive,
            isCurrentlyValid,
            createdBy: rule.createdBy,
            updatedBy: rule.updatedBy,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
        };

        if (rule.inventoryItem) {
            response.inventoryItem = {
                id: rule.inventoryItem.id,
                product: {
                    id: rule.inventoryItem.product.id,
                    name: rule.inventoryItem.product.name,
                    sku: rule.inventoryItem.product.sku,
                    basePrice: parseFloat(rule.inventoryItem.product.basePrice.toString()),
                },
                warehouse: {
                    id: rule.inventoryItem.warehouse.id,
                    name: rule.inventoryItem.warehouse.name,
                    code: rule.inventoryItem.warehouse.code,
                },
                quantityOnHand: rule.inventoryItem.quantityOnHand,
                quantityAvailable: rule.inventoryItem.quantityAvailable,
            };
        }

        return response;
    }
}
