import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import {
    Prisma,
    OrderStatus,
    FulfillmentStatus,
    PaymentStatus,
    ShipmentStatus,
    InvoiceStatus,
    OrderEventType,
    FulfillmentPriority,
    FulfillmentItemStatus
} from '@prisma/client';
import { NotificationType } from '../notifications/dto/notification.dto';
import {
    CreateOrderDto,
    UpdateOrderDto,
    OrderFilterDto,
    OrderResponseDto,
    OrderListResponseDto,
    OrderAnalyticsResponseDto
} from './dto/order.dto';
import {
    CreateFulfillmentDto,
    UpdateFulfillmentDto,
    AssignFulfillmentDto,
    FulfillmentFilterDto,
    FulfillmentResponseDto,
    FulfillmentListResponseDto
} from './dto/fulfillment.dto';
import {
    CreateShipmentDto,
    UpdateShipmentDto,
    ShipmentFilterDto,
    ShipmentResponseDto,
    ShipmentListResponseDto
} from './dto/shipping.dto';
import {
    CreateInvoiceDto,
    UpdateInvoiceDto,
    InvoiceFilterDto,
    InvoiceResponseDto,
    InvoiceListResponseDto
} from './dto/invoice.dto';

@Injectable()
export class OrderFulfillmentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
    ) { }

    // ==================== ORDER MANAGEMENT ====================

    async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<OrderResponseDto> {
        const {
            checkoutId,
            quoteId,
            shippingAddressId,
            billingAddressId,
            items,
            customerNotes,
            requestedDeliveryDate,
            paymentMethod,
            creditTerms,
            ...orderData
        } = createOrderDto;

        // Generate unique order number
        const orderNumber = await this.generateOrderNumber();

        // Calculate totals from items
        const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const parsedTaxAmount = 0; // Will be calculated later or provided
        const parsedShippingAmount = 0; // Will be calculated later or provided
        const parsedDiscountAmount = 0; // Will be calculated later or provided
        const totalAmount = subtotal + parsedTaxAmount + parsedShippingAmount - parsedDiscountAmount;

        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                purchaseOrderNumber: orderData.purchaseOrderNumber,
                userId,
                companyId: orderData.companyId,
                checkoutId,
                quoteId,
                shippingAddressId,
                billingAddressId,
                subtotal,
                taxAmount: parsedTaxAmount,
                shippingAmount: parsedShippingAmount,
                discountAmount: parsedDiscountAmount,
                totalAmount,
                currency: 'USD',
                status: OrderStatus.PENDING,
                fulfillmentStatus: FulfillmentStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                requestedDeliveryDate,
                customerNotes,
                paymentMethod,
                creditTerms,
                items: {
                    create: await Promise.all(items.map(async (item) => {
                        // Create product snapshot if productId or productVariantId is provided
                        let productSnapshot: any = null;
                        let variantSnapshot: any = null;
                        let snapshotData: any = {};

                        if (item.productId) {
                            const product = await this.prisma.product.findUnique({
                                where: { id: item.productId },
                                include: {
                                    category: true,
                                    merchant: true
                                }
                            });

                            if (product) {
                                productSnapshot = {
                                    id: product.id,
                                    name: product.name,
                                    sku: product.sku,
                                    brand: product.brand,
                                    description: product.description,
                                    specifications: (product as any).specifications || null,
                                    images: product.images,
                                    category: product.category,
                                    merchant: product.merchant,
                                    status: product.status,
                                    createdAt: product.createdAt,
                                    updatedAt: product.updatedAt
                                };

                                snapshotData = {
                                    productSnapshot,
                                    snapshotCreatedAt: new Date(),
                                    productName: product.name,
                                    productSku: product.sku,
                                    productBrand: product.brand,
                                    productCategory: product.category?.name,
                                    productImages: product.images || []
                                };
                            }
                        }

                        if (item.productVariantId) {
                            const variant = await this.prisma.productVariant.findUnique({
                                where: { id: item.productVariantId },
                                include: {
                                    product: {
                                        include: {
                                            category: true,
                                            merchant: true
                                        }
                                    }
                                }
                            });

                            if (variant) {
                                variantSnapshot = {
                                    id: variant.id,
                                    sku: variant.sku,
                                    attributes: variant.attributes,
                                    price: variant.price,
                                    compareAtPrice: (variant as any).compareAtPrice || null,
                                    costPrice: (variant as any).costPrice || null,
                                    images: variant.images,
                                    weight: (variant as any).weight || null,
                                    dimensions: (variant as any).dimensions || null,
                                    status: (variant as any).status || 'ACTIVE',
                                    createdAt: variant.createdAt,
                                    updatedAt: variant.updatedAt
                                };

                                // If we have variant, also capture product info if not already captured
                                if (!productSnapshot && variant.product) {
                                    productSnapshot = {
                                        id: variant.product.id,
                                        name: variant.product.name,
                                        sku: variant.product.sku,
                                        brand: variant.product.brand,
                                        description: variant.product.description,
                                        specifications: (variant.product as any).specifications || null,
                                        images: variant.product.images,
                                        category: variant.product.category,
                                        merchant: variant.product.merchant,
                                        status: variant.product.status,
                                        createdAt: variant.product.createdAt,
                                        updatedAt: variant.product.updatedAt
                                    };
                                }

                                snapshotData = {
                                    ...snapshotData,
                                    variantSnapshot,
                                    snapshotCreatedAt: new Date(),
                                    productName: variant.product?.name || (snapshotData as any).productName || item.customProductName || 'Unknown Product',
                                    productSku: variant.sku || (snapshotData as any).productSku || item.customSku || 'Unknown SKU',
                                    productBrand: variant.product?.brand || (snapshotData as any).productBrand,
                                    productCategory: variant.product?.category?.name || (snapshotData as any).productCategory,
                                    productImages: variant.images || variant.product?.images || (snapshotData as any).productImages || [],
                                    variantName: `${variant.product?.name} - ${JSON.stringify(variant.attributes)}`,
                                    variantSku: variant.sku,
                                    variantAttributes: variant.attributes
                                };
                            }
                        }

                        // For custom products (quote-derived items), use provided data
                        if (!item.productId && !item.productVariantId && item.customProductName) {
                            snapshotData = {
                                snapshotCreatedAt: new Date(),
                                productName: item.customProductName,
                                productSku: item.customSku || 'CUSTOM',
                                productBrand: null,
                                productCategory: 'Custom/Quote',
                                productImages: []
                            };
                        }

                        return {
                            productId: item.productId,
                            productVariantId: item.productVariantId,
                            customProductName: item.customProductName,
                            customSku: item.customSku,
                            customDescription: item.customDescription,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.unitPrice * item.quantity,
                            requestedDeliveryDate: item.requestedDeliveryDate,
                            itemNotes: item.itemNotes,
                            ...snapshotData
                        };
                    }))
                },
                orderEvents: {
                    create: {
                        eventType: OrderEventType.ORDER_CREATED,
                        description: 'Order created',
                        userId,
                        metadata: { source: checkoutId ? 'checkout' : quoteId ? 'quote' : 'manual' }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
                    }
                },
                shippingAddress: true,
                billingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true
                            }
                        }
                    }
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        // Send notification
        await this.notificationService.sendEmail({
            to: [{ email: order.user.email }],
            subject: `Order Confirmation - ${order.orderNumber}`,
            text: `Order ${order.orderNumber} has been created successfully. Total: ${order.totalAmount} ${order.currency}`,
            html: `<h2>Order Confirmation</h2><p>Your order ${order.orderNumber} has been created successfully.</p><p>Total: ${order.totalAmount} ${order.currency}</p>`
        });

        return this.mapOrderToResponse(order);
    }

    async getOrderById(id: string, userId: string): Promise<OrderResponseDto> {
        const order = await this.prisma.order.findFirst({
            where: {
                id,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
                    }
                },
                shippingAddress: true,
                billingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true
                            }
                        }
                    }
                },
                fulfillments: {
                    include: {
                        warehouse: {
                            select: {
                                id: true,
                                name: true,
                                code: true
                            }
                        },
                        items: true
                    }
                },
                shipments: {
                    include: {
                        carrier: {
                            select: {
                                id: true,
                                name: true,
                                code: true
                            }
                        },
                        items: true
                    }
                },
                invoices: true,
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.mapOrderToResponse(order);
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto, userId: string): Promise<OrderResponseDto> {
        const existingOrder = await this.prisma.order.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!existingOrder) {
            throw new NotFoundException('Order not found');
        }

        // Check if order can be modified
        if (existingOrder.status === OrderStatus.SHIPPED ||
            existingOrder.status === OrderStatus.DELIVERED ||
            existingOrder.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Cannot modify order in current status');
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                ...updateOrderDto,
                updatedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: OrderEventType.ORDER_MODIFIED,
                        description: 'Order updated',
                        userId,
                        metadata: { changes: Object.keys(updateOrderDto) }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
                    }
                },
                shippingAddress: true,
                billingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true
                            }
                        }
                    }
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        return this.mapOrderToResponse(updatedOrder);
    }

    async confirmOrder(id: string, userId: string): Promise<OrderResponseDto> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Order is not in pending status');
        }

        const confirmedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.CONFIRMED,
                confirmedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: OrderEventType.ORDER_CONFIRMED,
                        description: 'Order confirmed and ready for fulfillment',
                        userId
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
                    }
                },
                shippingAddress: true,
                billingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true
                            }
                        }
                    }
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        // Send confirmation notification
        await this.notificationService.sendEmail({
            to: [{ email: order.user.email }],
            subject: `Order Confirmed - ${order.orderNumber}`,
            text: `Order ${order.orderNumber} has been confirmed and is ready for fulfillment.`,
            html: `<h2>Order Confirmed</h2><p>Your order ${order.orderNumber} has been confirmed and is ready for fulfillment.</p>`
        });

        return this.mapOrderToResponse(confirmedOrder);
    }

    async cancelOrder(id: string, reason: string, userId: string): Promise<OrderResponseDto> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
            throw new BadRequestException('Cannot cancel order in current status');
        }

        const cancelledOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.CANCELLED,
                orderEvents: {
                    create: {
                        eventType: OrderEventType.ORDER_CANCELLED,
                        description: `Order cancelled: ${reason}`,
                        userId,
                        metadata: { reason }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
                    }
                },
                shippingAddress: true,
                billingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true
                            }
                        }
                    }
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        return this.mapOrderToResponse(cancelledOrder);
    }

    async listOrders(filterDto: OrderFilterDto, userId: string): Promise<OrderListResponseDto> {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;

        const whereClause: Prisma.OrderWhereInput = {
            userId
        };

        // Apply filters
        if (filterDto.status) {
            whereClause.status = filterDto.status;
        }

        if (filterDto.fulfillmentStatus) {
            whereClause.fulfillmentStatus = filterDto.fulfillmentStatus;
        }

        if (filterDto.paymentStatus) {
            whereClause.paymentStatus = filterDto.paymentStatus;
        }

        if (filterDto.companyId) {
            whereClause.companyId = filterDto.companyId;
        }

        if (filterDto.orderNumber) {
            whereClause.orderNumber = {
                contains: filterDto.orderNumber,
                mode: 'insensitive'
            };
        }

        if (filterDto.createdAfter) {
            whereClause.createdAt = {
                ...(whereClause.createdAt as object || {}),
                gte: new Date(filterDto.createdAfter)
            };
        }

        if (filterDto.createdBefore) {
            whereClause.createdAt = {
                ...(whereClause.createdAt as object || {}),
                lte: new Date(filterDto.createdBefore)
            };
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true
                        }
                    },
                    items: {
                        select: {
                            id: true,
                            quantity: true,
                            unitPrice: true,
                            totalPrice: true
                        }
                    }
                },
                orderBy: {
                    [filterDto.sortBy || 'createdAt']: filterDto.sortOrder || 'desc'
                },
                skip,
                take: limit
            }),
            this.prisma.order.count({ where: whereClause })
        ]);

        const mappedOrders = orders.map(order => this.mapOrderToResponse(order));

        return {
            orders: mappedOrders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    // ==================== FULFILLMENT MANAGEMENT ====================

    async createFulfillment(createFulfillmentDto: CreateFulfillmentDto, userId: string): Promise<FulfillmentResponseDto> {
        const { orderId, warehouseId, items, ...fulfillmentData } = createFulfillmentDto;

        // Verify order exists and is confirmable
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.CONFIRMED) {
            throw new BadRequestException('Order must be confirmed before fulfillment');
        }

        // Generate fulfillment number
        const fulfillmentNumber = await this.generateFulfillmentNumber();

        const fulfillment = await this.prisma.fulfillment.create({
            data: {
                fulfillmentNumber,
                orderId,
                warehouseId,
                status: FulfillmentStatus.PENDING,
                priority: fulfillmentData.priority || FulfillmentPriority.NORMAL,
                scheduledAt: fulfillmentData.scheduledAt,
                pickingNotes: fulfillmentData.pickingNotes,
                packingNotes: fulfillmentData.packingNotes,
                items: {
                    create: items.map(item => ({
                        orderItemId: item.orderItemId,
                        quantityAllocated: item.quantityAllocated,
                        inventoryItemId: item.inventoryItemId,
                        status: FulfillmentItemStatus.ALLOCATED
                    }))
                }
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true
                            }
                        }
                    }
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true
                                    }
                                }
                            }
                        },
                        inventoryItem: {
                            select: {
                                id: true,
                                quantityOnHand: true
                            }
                        }
                    }
                }
            }
        });

        // Update order fulfillment status
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                fulfillmentStatus: FulfillmentStatus.ALLOCATED,
                orderEvents: {
                    create: {
                        eventType: OrderEventType.INVENTORY_ALLOCATED,
                        description: `Fulfillment created: ${fulfillmentNumber}`,
                        userId,
                        metadata: { fulfillmentId: fulfillment.id, warehouseId }
                    }
                }
            }
        });

        return this.mapFulfillmentToResponse(fulfillment);
    }

    async assignFulfillment(id: string, assignDto: AssignFulfillmentDto, userId: string): Promise<FulfillmentResponseDto> {
        const fulfillment = await this.prisma.fulfillment.findUnique({
            where: { id },
            include: { order: true }
        });

        if (!fulfillment) {
            throw new NotFoundException('Fulfillment not found');
        }

        if (fulfillment.status !== FulfillmentStatus.PENDING) {
            throw new BadRequestException('Fulfillment is not available for assignment');
        }

        const updatedFulfillment = await this.prisma.fulfillment.update({
            where: { id },
            data: {
                assignedTo: assignDto.assignedTo,
                status: FulfillmentStatus.ALLOCATED,
                scheduledAt: new Date()
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true
                            }
                        }
                    }
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                assignedUser: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return this.mapFulfillmentToResponse(updatedFulfillment);
    }

    async startFulfillment(id: string, userId: string): Promise<FulfillmentResponseDto> {
        const fulfillment = await this.prisma.fulfillment.findUnique({
            where: { id },
            include: { order: true }
        });

        if (!fulfillment) {
            throw new NotFoundException('Fulfillment not found');
        }

        if (fulfillment.status !== FulfillmentStatus.ALLOCATED) {
            throw new BadRequestException('Fulfillment is not ready to start');
        }

        const updatedFulfillment = await this.prisma.fulfillment.update({
            where: { id },
            data: {
                status: FulfillmentStatus.PICKING,
                startedAt: new Date()
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true
                            }
                        }
                    }
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Update order status
        await this.prisma.order.update({
            where: { id: fulfillment.orderId },
            data: {
                status: OrderStatus.PROCESSING,
                fulfillmentStatus: FulfillmentStatus.PICKING,
                orderEvents: {
                    create: {
                        eventType: OrderEventType.FULFILLMENT_STARTED,
                        description: `Fulfillment started: ${fulfillment.fulfillmentNumber}`,
                        userId,
                        metadata: { fulfillmentId: id }
                    }
                }
            }
        });

        return this.mapFulfillmentToResponse(updatedFulfillment);
    }

    // ==================== SHIPPING MANAGEMENT ====================

    async createShipment(createShipmentDto: CreateShipmentDto, userId: string): Promise<ShipmentResponseDto> {
        const { orderId, fulfillmentId, items, ...shipmentData } = createShipmentDto;

        // Verify order and fulfillment
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { fulfillments: true }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const fulfillment = fulfillmentId ?
            await this.prisma.fulfillment.findUnique({ where: { id: fulfillmentId } }) :
            null;

        if (fulfillmentId && !fulfillment) {
            throw new NotFoundException('Fulfillment not found');
        }

        // Generate shipment number
        const shipmentNumber = await this.generateShipmentNumber();

        const shipment = await this.prisma.shipment.create({
            data: {
                shipmentNumber,
                orderId,
                fulfillmentId,
                carrierId: shipmentData.carrierId,
                shippingMethod: shipmentData.shippingMethod,
                shippingCost: shipmentData.shippingCost,
                fromWarehouseId: shipmentData.fromWarehouseId,
                toAddress: shipmentData.toAddress,
                status: ShipmentStatus.PREPARING,
                estimatedDelivery: shipmentData.estimatedDelivery,
                weight: shipmentData.weight,
                dimensions: shipmentData.dimensions,
                packageCount: shipmentData.packageCount || 1,
                trackingEvents: [],
                items: {
                    create: items.map(item => ({
                        orderItemId: item.orderItemId,
                        quantityShipped: item.quantityShipped
                    }))
                }
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true
                            }
                        }
                    }
                },
                carrier: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                fromWarehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return this.mapShipmentToResponse(shipment);
    }

    async markShipmentShipped(id: string, trackingNumber: string, userId: string): Promise<ShipmentResponseDto> {
        const shipment = await this.prisma.shipment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        const updatedShipment = await this.prisma.shipment.update({
            where: { id },
            data: {
                status: ShipmentStatus.SHIPPED,
                trackingNumber,
                shippedAt: new Date(),
                trackingEvents: [
                    {
                        status: 'SHIPPED',
                        description: 'Package shipped',
                        timestamp: new Date().toISOString(),
                        location: 'Warehouse'
                    }
                ]
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true
                            }
                        }
                    }
                },
                carrier: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                fromWarehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Update order status
        await this.prisma.order.update({
            where: { id: shipment.orderId },
            data: {
                status: OrderStatus.SHIPPED,
                shippedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: OrderEventType.SHIPMENT_SHIPPED,
                        description: `Shipment shipped: ${shipment.shipmentNumber}`,
                        userId,
                        metadata: { shipmentId: id, trackingNumber }
                    }
                }
            }
        });

        // Send shipping notification
        await this.notificationService.sendEmail({
            to: [{ email: shipment.order.user.email }],
            subject: `Order Shipped - ${shipment.order.orderNumber}`,
            text: `Your order ${shipment.order.orderNumber} has been shipped. Tracking: ${trackingNumber}`,
            html: `<h2>Order Shipped</h2><p>Your order ${shipment.order.orderNumber} has been shipped.</p><p>Tracking: ${trackingNumber}</p>`
        });

        return this.mapShipmentToResponse(updatedShipment);
    }

    // ==================== INVOICE MANAGEMENT ====================

    async createInvoice(createInvoiceDto: CreateInvoiceDto, userId: string): Promise<InvoiceResponseDto> {
        const { orderId, ...invoiceData } = createInvoiceDto;

        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                company: true
            }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Generate invoice number
        const invoiceNumber = await this.generateInvoiceNumber();

        const invoice = await this.prisma.invoice.create({
            data: {
                invoiceNumber,
                orderId,
                userId: order.userId,
                companyId: order.companyId,
                subtotal: order.subtotal,
                taxAmount: order.taxAmount,
                totalAmount: order.totalAmount,
                currency: order.currency,
                status: InvoiceStatus.DRAFT,
                issuedAt: invoiceData.issuedAt,
                dueAt: invoiceData.dueAt,
                paymentMethod: invoiceData.paymentMethod
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        purchaseOrderNumber: true,
                        totalAmount: true,
                        createdAt: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        taxId: true,
                        addressLine1: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true
                    }
                }
            }
        });

        return this.mapInvoiceToResponse(invoice);
    }

    // ==================== HELPER METHODS ====================

    private async generateOrderNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');

        const lastOrder = await this.prisma.order.findFirst({
            where: {
                orderNumber: {
                    startsWith: `HW-${year}${month}-`
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }

        return `HW-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }

    private async generateFulfillmentNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');

        const lastFulfillment = await this.prisma.fulfillment.findFirst({
            where: {
                fulfillmentNumber: {
                    startsWith: `FUL-${year}${month}-`
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let sequence = 1;
        if (lastFulfillment) {
            const lastSequence = parseInt(lastFulfillment.fulfillmentNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }

        return `FUL-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }

    private async generateShipmentNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');

        const lastShipment = await this.prisma.shipment.findFirst({
            where: {
                shipmentNumber: {
                    startsWith: `SHP-${year}${month}-`
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let sequence = 1;
        if (lastShipment) {
            const lastSequence = parseInt(lastShipment.shipmentNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }

        return `SHP-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }

    private async generateInvoiceNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');

        const lastInvoice = await this.prisma.invoice.findFirst({
            where: {
                invoiceNumber: {
                    startsWith: `INV-${year}${month}-`
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let sequence = 1;
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }

        return `INV-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }

    private mapOrderToResponse(order: any): OrderResponseDto {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            purchaseOrderNumber: order.purchaseOrderNumber,
            user: order.user,
            company: order.company,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            items: order.items?.map((item: any) => ({
                id: item.id,
                product: item.product,
                productVariant: item.productVariant,
                customProductName: item.customProductName,
                customSku: item.customSku,
                customDescription: item.customDescription,
                quantity: item.quantity,
                unitPrice: parseFloat(item.unitPrice.toString()),
                totalPrice: parseFloat(item.totalPrice.toString()),
                quantityFulfilled: item.quantityFulfilled,
                quantityShipped: item.quantityShipped,
                quantityDelivered: item.quantityDelivered,
                quantityCancelled: item.quantityCancelled,
                requestedDeliveryDate: item.requestedDeliveryDate,
                estimatedDeliveryDate: item.estimatedDeliveryDate,
                itemNotes: item.itemNotes,
                // Product snapshot data
                productSnapshot: item.productSnapshot,
                variantSnapshot: item.variantSnapshot,
                snapshotCreatedAt: item.snapshotCreatedAt,
                productName: item.productName,
                productSku: item.productSku,
                productBrand: item.productBrand,
                productCategory: item.productCategory,
                productImages: item.productImages,
                variantName: item.variantName,
                variantSku: item.variantSku,
                variantAttributes: item.variantAttributes,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })) || [],
            subtotal: parseFloat(order.subtotal.toString()),
            taxAmount: parseFloat(order.taxAmount.toString()),
            shippingAmount: parseFloat(order.shippingAmount.toString()),
            discountAmount: parseFloat(order.discountAmount.toString()),
            totalAmount: parseFloat(order.totalAmount.toString()),
            currency: order.currency,
            status: order.status,
            fulfillmentStatus: order.fulfillmentStatus,
            paymentStatus: order.paymentStatus,
            requestedDeliveryDate: order.requestedDeliveryDate,
            estimatedDeliveryDate: order.estimatedDeliveryDate,
            actualDeliveryDate: order.actualDeliveryDate,
            customerNotes: order.customerNotes,
            internalNotes: order.internalNotes,
            specialInstructions: order.specialInstructions,
            rushOrder: order.rushOrder,
            paymentMethod: order.paymentMethod,
            paymentReference: order.paymentReference,
            creditTerms: order.creditTerms,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            confirmedAt: order.confirmedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt
        };
    }

    private mapFulfillmentToResponse(fulfillment: any): FulfillmentResponseDto {
        return {
            id: fulfillment.id,
            fulfillmentNumber: fulfillment.fulfillmentNumber,
            order: fulfillment.order,
            warehouse: fulfillment.warehouse,
            status: fulfillment.status,
            priority: fulfillment.priority,
            assignedUser: fulfillment.assignedUser,
            items: fulfillment.items?.map((item: any) => ({
                id: item.id,
                orderItem: item.orderItem,
                inventoryItem: item.inventoryItem,
                quantityAllocated: item.quantityAllocated,
                quantityPicked: item.quantityPicked,
                quantityPacked: item.quantityPacked,
                status: item.status,
                pickingNotes: item.pickingNotes,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })) || [],
            pickingNotes: fulfillment.pickingNotes,
            packingNotes: fulfillment.packingNotes,
            scheduledAt: fulfillment.scheduledAt,
            startedAt: fulfillment.startedAt,
            completedAt: fulfillment.completedAt,
            createdAt: fulfillment.createdAt,
            updatedAt: fulfillment.updatedAt
        };
    }

    private mapShipmentToResponse(shipment: any): ShipmentResponseDto {
        return {
            id: shipment.id,
            shipmentNumber: shipment.shipmentNumber,
            trackingNumber: shipment.trackingNumber,
            order: shipment.order,
            fulfillment: shipment.fulfillment,
            carrier: shipment.carrier,
            fromWarehouse: shipment.fromWarehouse,
            shippingMethod: shipment.shippingMethod,
            shippingCost: parseFloat(shipment.shippingCost.toString()),
            toAddress: shipment.toAddress,
            status: shipment.status,
            weight: shipment.weight ? parseFloat(shipment.weight.toString()) : undefined,
            dimensions: shipment.dimensions,
            packageCount: shipment.packageCount,
            trackingEvents: shipment.trackingEvents || [],
            deliverySignature: shipment.deliverySignature,
            deliveryPhoto: shipment.deliveryPhoto,
            items: shipment.items?.map((item: any) => ({
                id: item.id,
                orderItem: item.orderItem,
                quantityShipped: item.quantityShipped,
                createdAt: item.createdAt
            })) || [],
            shippedAt: shipment.shippedAt,
            estimatedDelivery: shipment.estimatedDelivery,
            actualDelivery: shipment.actualDelivery,
            createdAt: shipment.createdAt,
            updatedAt: shipment.updatedAt
        };
    }

    private mapInvoiceToResponse(invoice: any): InvoiceResponseDto {
        const now = new Date();
        const dueDate = invoice.dueAt ? new Date(invoice.dueAt) : null;
        const isOverdue = dueDate && now > dueDate && invoice.status !== InvoiceStatus.PAID;
        const daysOverdue = isOverdue ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

        return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            order: invoice.order,
            user: invoice.user,
            company: invoice.company,
            subtotal: parseFloat(invoice.subtotal.toString()),
            taxAmount: parseFloat(invoice.taxAmount.toString()),
            totalAmount: parseFloat(invoice.totalAmount.toString()),
            currency: invoice.currency,
            status: invoice.status,
            issuedAt: invoice.issuedAt,
            dueAt: invoice.dueAt,
            paidAt: invoice.paidAt,
            paymentMethod: invoice.paymentMethod,
            paymentReference: invoice.paymentReference,
            pdfUrl: invoice.pdfUrl,
            isOverdue: Boolean(isOverdue),
            daysOverdue,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        };
    }
}
