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
exports.OrderFulfillmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const client_1 = require("@prisma/client");
let OrderFulfillmentService = class OrderFulfillmentService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    getCustomerRecipientEmails(order) {
        const raw = [
            order?.user?.email,
            order?.shippingAddress?.contactEmail,
            order?.billingAddress?.contactEmail,
        ];
        return Array.from(new Set(raw
            .filter(Boolean)
            .map((e) => String(e).trim())
            .filter((e) => e.length > 0)));
    }
    async sendOrderStatusUpdateEmail(params) {
        const { order, previous, extra } = params;
        const changes = [];
        if (previous?.status && order?.status && previous.status !== order.status) {
            changes.push({
                label: 'Order status',
                from: String(previous.status),
                to: String(order.status),
            });
        }
        if (previous?.fulfillmentStatus &&
            order?.fulfillmentStatus &&
            previous.fulfillmentStatus !== order.fulfillmentStatus) {
            changes.push({
                label: 'Fulfillment status',
                from: String(previous.fulfillmentStatus),
                to: String(order.fulfillmentStatus),
            });
        }
        if (previous?.paymentStatus &&
            order?.paymentStatus &&
            previous.paymentStatus !== order.paymentStatus) {
            changes.push({
                label: 'Payment status',
                from: String(previous.paymentStatus),
                to: String(order.paymentStatus),
            });
        }
        if (changes.length === 0)
            return;
        const recipientEmails = this.getCustomerRecipientEmails(order);
        if (recipientEmails.length === 0)
            return;
        const titleSuffix = order?.status
            ? ` (${String(order.status).replace(/_/g, ' ')})`
            : '';
        const subject = `Order Update - ${order.orderNumber}${titleSuffix}`;
        const trackingLine = extra?.trackingNumber
            ? `<p><strong>Tracking:</strong> ${extra.trackingNumber}</p>`
            : '';
        const changesHtml = changes
            .map((c) => `<li><strong>${c.label}:</strong> ${c.from.replace(/_/g, ' ')} → ${c.to.replace(/_/g, ' ')}</li>`)
            .join('');
        const html = `
            <h2>Order Update</h2>
            <p>Your order <strong>${order.orderNumber}</strong> has been updated.</p>
            ${trackingLine}
            <ul>${changesHtml}</ul>
        `;
        const text = `Your order ${order.orderNumber} has been updated.\n` +
            changes.map((c) => `- ${c.label}: ${c.from} -> ${c.to}`).join('\n') +
            (extra?.trackingNumber ? `\nTracking: ${extra.trackingNumber}` : '');
        const sent = await this.notificationService.sendEmail({
            to: recipientEmails.map((email) => ({ email })),
            subject,
            text,
            html,
        });
        if (!sent) {
            await this.prisma.orderEvent.create({
                data: {
                    orderId: order.id,
                    eventType: client_1.OrderEventType.ORDER_MODIFIED,
                    description: 'Order updated, but customer status email failed to send',
                    userId: order.user?.id || undefined,
                    metadata: {
                        emailRecipients: recipientEmails,
                        changes,
                        trackingNumber: extra?.trackingNumber,
                    },
                },
            });
        }
    }
    async createOrder(createOrderDto, userId) {
        const { checkoutId, quoteId, shippingAddressId, billingAddressId, items, customerNotes, requestedDeliveryDate, paymentMethod, creditTerms, ...orderData } = createOrderDto;
        const orderNumber = await this.generateOrderNumber();
        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const parsedTaxAmount = 0;
        const parsedShippingAmount = 0;
        const parsedDiscountAmount = 0;
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
                status: client_1.OrderStatus.PENDING,
                fulfillmentStatus: client_1.FulfillmentStatus.PENDING,
                paymentStatus: client_1.PaymentStatus.PENDING,
                requestedDeliveryDate,
                customerNotes,
                paymentMethod,
                creditTerms,
                items: {
                    create: await Promise.all(items.map(async (item) => {
                        let productSnapshot = null;
                        let variantSnapshot = null;
                        let snapshotData = {};
                        if (item.productId) {
                            const product = await this.prisma.product.findUnique({
                                where: { id: item.productId },
                                include: {
                                    category: true,
                                    merchant: true,
                                },
                            });
                            if (product) {
                                productSnapshot = {
                                    id: product.id,
                                    name: product.name,
                                    sku: product.sku,
                                    brand: product.brand,
                                    description: product.description,
                                    specifications: product.specifications || null,
                                    images: product.images,
                                    category: product.category,
                                    merchant: product.merchant,
                                    status: product.status,
                                    createdAt: product.createdAt,
                                    updatedAt: product.updatedAt,
                                };
                                snapshotData = {
                                    productSnapshot,
                                    snapshotCreatedAt: new Date(),
                                    productName: product.name,
                                    productSku: product.sku,
                                    productBrand: product.brand,
                                    productCategory: product.category?.name,
                                    productImages: product.images || [],
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
                                            merchant: true,
                                        },
                                    },
                                },
                            });
                            if (variant) {
                                variantSnapshot = {
                                    id: variant.id,
                                    sku: variant.sku,
                                    attributes: variant.attributes,
                                    price: variant.price,
                                    compareAtPrice: variant.compareAtPrice || null,
                                    costPrice: variant.costPrice || null,
                                    images: variant.images,
                                    weight: variant.weight || null,
                                    dimensions: variant.dimensions || null,
                                    status: variant.status || 'ACTIVE',
                                    createdAt: variant.createdAt,
                                    updatedAt: variant.updatedAt,
                                };
                                if (!productSnapshot && variant.product) {
                                    productSnapshot = {
                                        id: variant.product.id,
                                        name: variant.product.name,
                                        sku: variant.product.sku,
                                        brand: variant.product.brand,
                                        description: variant.product.description,
                                        specifications: variant.product.specifications || null,
                                        images: variant.product.images,
                                        category: variant.product.category,
                                        merchant: variant.product.merchant,
                                        status: variant.product.status,
                                        createdAt: variant.product.createdAt,
                                        updatedAt: variant.product.updatedAt,
                                    };
                                }
                                snapshotData = {
                                    ...snapshotData,
                                    variantSnapshot,
                                    snapshotCreatedAt: new Date(),
                                    productName: variant.product?.name ||
                                        snapshotData.productName ||
                                        item.customProductName ||
                                        'Unknown Product',
                                    productSku: variant.sku ||
                                        snapshotData.productSku ||
                                        item.customSku ||
                                        'Unknown SKU',
                                    productBrand: variant.product?.brand || snapshotData.productBrand,
                                    productCategory: variant.product?.category?.name ||
                                        snapshotData.productCategory,
                                    productImages: variant.images ||
                                        variant.product?.images ||
                                        snapshotData.productImages ||
                                        [],
                                    variantName: `${variant.product?.name} - ${JSON.stringify(variant.attributes)}`,
                                    variantSku: variant.sku,
                                    variantAttributes: variant.attributes,
                                };
                            }
                        }
                        if (!item.productId &&
                            !item.productVariantId &&
                            item.customProductName) {
                            snapshotData = {
                                snapshotCreatedAt: new Date(),
                                productName: item.customProductName,
                                productSku: item.customSku || 'CUSTOM',
                                productBrand: null,
                                productCategory: 'Custom/Quote',
                                productImages: [],
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
                            ...snapshotData,
                        };
                    })),
                },
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.ORDER_CREATED,
                        description: 'Order created',
                        userId,
                        metadata: {
                            source: checkoutId ? 'checkout' : quoteId ? 'quote' : 'manual',
                        },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        companyEmail: true,
                        companyPhone: true,
                        addressLine1: true,
                        addressLine2: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true,
                    },
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
                                images: true,
                                merchantId: true,
                                merchant: {
                                    select: {
                                        id: true,
                                        name: true,
                                        displayName: true,
                                        businessType: true,
                                        contactEmail: true,
                                        contactPhone: true,
                                        website: true,
                                        addressLine1: true,
                                        addressLine2: true,
                                        city: true,
                                        state: true,
                                        postalCode: true,
                                        country: true,
                                        status: true,
                                        isActive: true,
                                    },
                                },
                            },
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true,
                            },
                        },
                    },
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        await this.notificationService.sendEmail({
            to: [{ email: order.user.email }],
            subject: `Order Confirmation - ${order.orderNumber}`,
            text: `Order ${order.orderNumber} has been created successfully. Total: ${order.totalAmount} ${order.currency}`,
            html: `<h2>Order Confirmation</h2><p>Your order ${order.orderNumber} has been created successfully.</p><p>Total: ${order.totalAmount} ${order.currency}</p>`,
        });
        return this.mapOrderToResponse(order);
    }
    async getOrderById(id, userId, userRoles) {
        const isMerchant = userRoles?.some((role) => ['merchant_admin', 'merchant_user'].includes(role));
        const isSystemAdmin = userRoles?.some((role) => role === 'system_admin');
        let whereClause;
        if (isSystemAdmin) {
            whereClause = { id };
        }
        else if (isMerchant) {
            const userMerchant = await this.prisma.userMerchant.findFirst({
                where: { userId },
            });
            if (!userMerchant) {
                throw new common_1.NotFoundException('Order not found');
            }
            whereClause = {
                id,
                items: {
                    some: {
                        product: {
                            merchantId: userMerchant.merchantId,
                        },
                    },
                },
            };
        }
        else {
            whereClause = { id, userId };
        }
        const order = await this.prisma.order.findFirst({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        companyEmail: true,
                        companyPhone: true,
                        addressLine1: true,
                        addressLine2: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true,
                    },
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
                                images: true,
                                merchantId: true,
                                merchant: {
                                    select: {
                                        id: true,
                                        name: true,
                                        displayName: true,
                                        businessType: true,
                                        contactEmail: true,
                                        contactPhone: true,
                                        website: true,
                                        addressLine1: true,
                                        addressLine2: true,
                                        city: true,
                                        state: true,
                                        postalCode: true,
                                        country: true,
                                        status: true,
                                        isActive: true,
                                    },
                                },
                            },
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true,
                            },
                        },
                    },
                },
                fulfillments: {
                    include: {
                        items: true,
                    },
                },
                shipments: {
                    include: {
                        carrier: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        items: true,
                    },
                },
                invoices: true,
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.mapOrderToResponse(order);
    }
    async updateOrder(id, updateOrderDto, userId, userRoles) {
        const isMerchant = userRoles?.some((role) => ['merchant_admin', 'merchant_user'].includes(role));
        const isSystemAdmin = userRoles?.some((role) => role === 'system_admin');
        let whereClause;
        if (isSystemAdmin) {
            whereClause = { id };
        }
        else if (isMerchant) {
            const userMerchant = await this.prisma.userMerchant.findFirst({
                where: { userId },
            });
            if (!userMerchant) {
                throw new common_1.NotFoundException('Order not found');
            }
            whereClause = {
                id,
                items: {
                    some: {
                        product: {
                            merchantId: userMerchant.merchantId,
                        },
                    },
                },
            };
        }
        else {
            whereClause = { id, userId };
        }
        const existingOrder = await this.prisma.order.findFirst({
            where: whereClause,
        });
        if (!existingOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (existingOrder.status === client_1.OrderStatus.SHIPPED ||
            existingOrder.status === client_1.OrderStatus.DELIVERED ||
            existingOrder.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot modify order in current status');
        }
        const nextTaxAmount = updateOrderDto.taxAmount !== undefined
            ? updateOrderDto.taxAmount
            : parseFloat(existingOrder.taxAmount.toString());
        const nextShippingAmount = updateOrderDto.shippingAmount !== undefined
            ? updateOrderDto.shippingAmount
            : parseFloat(existingOrder.shippingAmount.toString());
        const nextDiscountAmount = updateOrderDto.discountAmount !== undefined
            ? updateOrderDto.discountAmount
            : parseFloat(existingOrder.discountAmount.toString());
        const subtotal = parseFloat(existingOrder.subtotal.toString());
        const nextTotalAmount = subtotal + nextTaxAmount + nextShippingAmount - nextDiscountAmount;
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                ...updateOrderDto,
                taxAmount: updateOrderDto.taxAmount !== undefined
                    ? updateOrderDto.taxAmount
                    : undefined,
                shippingAmount: updateOrderDto.shippingAmount !== undefined
                    ? updateOrderDto.shippingAmount
                    : undefined,
                discountAmount: updateOrderDto.discountAmount !== undefined
                    ? updateOrderDto.discountAmount
                    : undefined,
                totalAmount: nextTotalAmount,
                updatedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.ORDER_MODIFIED,
                        description: 'Order updated',
                        userId,
                        metadata: { changes: Object.keys(updateOrderDto) },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                    },
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
                                images: true,
                            },
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true,
                            },
                        },
                    },
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        await this.sendOrderStatusUpdateEmail({
            order: updatedOrder,
            previous: {
                status: existingOrder.status,
                fulfillmentStatus: existingOrder.fulfillmentStatus,
                paymentStatus: existingOrder.paymentStatus,
            },
        });
        return this.mapOrderToResponse(updatedOrder);
    }
    async uploadPaymentProof(orderId, userId, userRoles, dto) {
        const isSystemAdmin = userRoles?.some((r) => r === 'system_admin');
        if (!isSystemAdmin) {
            throw new common_1.ForbiddenException('Only system admins can upload payment proof');
        }
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const file = await this.prisma.file.findUnique({
            where: { id: dto.fileId },
        });
        if (!file) {
            throw new common_1.BadRequestException('Payment proof file not found');
        }
        if (file.status !== 'UPLOADED') {
            throw new common_1.BadRequestException('Payment proof file is not uploaded yet');
        }
        if (dto.paymentStatus) {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: dto.paymentStatus },
            });
        }
        await this.prisma.orderEvent.create({
            data: {
                orderId,
                userId,
                eventType: dto.paymentStatus === 'CANCELLED'
                    ? client_1.OrderEventType.PAYMENT_FAILED
                    : client_1.OrderEventType.PAYMENT_RECEIVED,
                description: dto.paymentStatus
                    ? `Payment proof uploaded (status set to ${dto.paymentStatus})`
                    : 'Payment proof uploaded',
                metadata: {
                    paymentProof: {
                        fileId: file.id,
                        key: file.key,
                        url: file.url,
                        filename: file.filename,
                    },
                    notes: dto.notes,
                    paymentStatus: dto.paymentStatus,
                },
            },
        });
        return this.getOrderById(orderId, userId, userRoles);
    }
    async confirmOrder(id, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Order is not in pending status');
        }
        const confirmedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CONFIRMED,
                confirmedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.ORDER_CONFIRMED,
                        description: 'Order confirmed and ready for fulfillment',
                        userId,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                    },
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
                                images: true,
                            },
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true,
                            },
                        },
                    },
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        const existingInvoice = await this.prisma.invoice.findFirst({
            where: { orderId: id },
            select: { id: true },
        });
        if (!existingInvoice) {
            const invoiceNumber = await this.generateInvoiceNumber();
            await this.prisma.invoice.create({
                data: {
                    invoiceNumber,
                    orderId: id,
                    userId: order.userId,
                    companyId: order.companyId || null,
                    subtotal: order.subtotal,
                    taxAmount: order.taxAmount,
                    totalAmount: order.totalAmount,
                    currency: order.currency || 'USD',
                    issuedAt: new Date(),
                    dueAt: null,
                    paymentMethod: order.paymentMethod || null,
                    paymentReference: order.paymentReference || null,
                },
            });
        }
        await this.sendOrderStatusUpdateEmail({
            order: confirmedOrder,
            previous: {
                status: order.status,
                fulfillmentStatus: order.fulfillmentStatus,
                paymentStatus: order.paymentStatus,
            },
        });
        return this.mapOrderToResponse(confirmedOrder);
    }
    async cancelOrder(id, reason, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status === client_1.OrderStatus.SHIPPED ||
            order.status === client_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Cannot cancel order in current status');
        }
        const cancelledOrder = await this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CANCELLED,
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.ORDER_CANCELLED,
                        description: `Order cancelled: ${reason}`,
                        userId,
                        metadata: { reason },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                    },
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
                                images: true,
                            },
                        },
                        productVariant: {
                            select: {
                                id: true,
                                sku: true,
                                attributes: true,
                            },
                        },
                    },
                },
                orderEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        await this.sendOrderStatusUpdateEmail({
            order: cancelledOrder,
            previous: {
                status: order.status,
                fulfillmentStatus: order.fulfillmentStatus,
                paymentStatus: order.paymentStatus,
            },
        });
        return this.mapOrderToResponse(cancelledOrder);
    }
    async listOrders(filterDto, userId, userRoles) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;
        let whereClause = {};
        const isMerchant = userRoles?.some((role) => ['merchant_admin', 'merchant_user'].includes(role));
        const isSystemAdmin = userRoles?.some((role) => role === 'system_admin');
        if (isMerchant) {
            const userMerchant = await this.prisma.userMerchant.findFirst({
                where: { userId },
                include: { merchant: true },
            });
            if (userMerchant) {
                whereClause = {
                    items: {
                        some: {
                            product: {
                                merchantId: userMerchant.merchantId,
                            },
                        },
                    },
                };
            }
            else {
                whereClause = { id: 'non-existent' };
            }
        }
        else {
            whereClause = isSystemAdmin ? {} : { userId };
        }
        if (filterDto.status) {
            whereClause.status = filterDto.status;
        }
        if (filterDto.fulfillmentStatus) {
            whereClause.fulfillmentStatus = filterDto.fulfillmentStatus;
        }
        if (filterDto.paymentStatus) {
            whereClause.paymentStatus = filterDto.paymentStatus;
        }
        if (isSystemAdmin && filterDto.userId) {
            whereClause.userId = filterDto.userId;
        }
        if (filterDto.companyId) {
            whereClause.companyId = filterDto.companyId;
        }
        if (filterDto.orderNumber) {
            whereClause.orderNumber = {
                contains: filterDto.orderNumber,
                mode: 'insensitive',
            };
        }
        if (filterDto.purchaseOrderNumber) {
            whereClause.purchaseOrderNumber = {
                contains: filterDto.purchaseOrderNumber,
                mode: 'insensitive',
            };
        }
        if (filterDto.createdAfter) {
            whereClause.createdAt = {
                ...(whereClause.createdAt || {}),
                gte: new Date(filterDto.createdAfter),
            };
        }
        if (filterDto.createdBefore) {
            whereClause.createdAt = {
                ...(whereClause.createdAt || {}),
                lte: new Date(filterDto.createdBefore),
            };
        }
        if (filterDto.rushOrder !== undefined) {
            whereClause.rushOrder = filterDto.rushOrder;
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
                            lastName: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true,
                                    images: true,
                                },
                            },
                            productVariant: {
                                select: {
                                    id: true,
                                    sku: true,
                                    attributes: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    [filterDto.sortBy || 'createdAt']: filterDto.sortOrder || 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: whereClause }),
        ]);
        const mappedOrders = orders.map((order) => this.mapOrderToResponse(order));
        return {
            orders: mappedOrders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async createFulfillment(createFulfillmentDto, userId) {
        const { orderId, items, ...fulfillmentData } = createFulfillmentDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== client_1.OrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Order must be confirmed before fulfillment');
        }
        const fulfillmentNumber = await this.generateFulfillmentNumber();
        const fulfillment = await this.prisma.fulfillment.create({
            data: {
                fulfillmentNumber,
                orderId,
                status: client_1.FulfillmentStatus.PENDING,
                priority: fulfillmentData.priority || client_1.FulfillmentPriority.NORMAL,
                scheduledAt: fulfillmentData.scheduledAt,
                pickingNotes: fulfillmentData.pickingNotes,
                packingNotes: fulfillmentData.packingNotes,
                items: {
                    create: items.map((item) => ({
                        orderItemId: item.orderItemId,
                        quantityAllocated: item.quantityAllocated,
                        inventoryItemId: item.inventoryItemId,
                        status: client_1.FulfillmentItemStatus.ALLOCATED,
                    })),
                },
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
                                displayName: true,
                            },
                        },
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                        inventoryItem: {
                            select: {
                                id: true,
                                quantityOnHand: true,
                            },
                        },
                    },
                },
            },
        });
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                fulfillmentStatus: client_1.FulfillmentStatus.ALLOCATED,
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.INVENTORY_ALLOCATED,
                        description: `Fulfillment created: ${fulfillmentNumber}`,
                        userId,
                        metadata: { fulfillmentId: fulfillment.id },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
            },
        });
        await this.sendOrderStatusUpdateEmail({
            order: updatedOrder,
            previous: {
                status: order.status,
                fulfillmentStatus: order.fulfillmentStatus,
                paymentStatus: order.paymentStatus,
            },
        });
        return this.mapFulfillmentToResponse(fulfillment);
    }
    async assignFulfillment(id, assignDto, userId) {
        const fulfillment = await this.prisma.fulfillment.findUnique({
            where: { id },
            include: { order: true },
        });
        if (!fulfillment) {
            throw new common_1.NotFoundException('Fulfillment not found');
        }
        if (fulfillment.status !== client_1.FulfillmentStatus.PENDING) {
            throw new common_1.BadRequestException('Fulfillment is not available for assignment');
        }
        const updatedFulfillment = await this.prisma.fulfillment.update({
            where: { id },
            data: {
                assignedTo: assignDto.assignedTo,
                status: client_1.FulfillmentStatus.ALLOCATED,
                scheduledAt: new Date(),
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
                                displayName: true,
                            },
                        },
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return this.mapFulfillmentToResponse(updatedFulfillment);
    }
    async startFulfillment(id, userId) {
        const fulfillment = await this.prisma.fulfillment.findUnique({
            where: { id },
            include: { order: true },
        });
        if (!fulfillment) {
            throw new common_1.NotFoundException('Fulfillment not found');
        }
        if (fulfillment.status !== client_1.FulfillmentStatus.ALLOCATED) {
            throw new common_1.BadRequestException('Fulfillment is not ready to start');
        }
        const updatedFulfillment = await this.prisma.fulfillment.update({
            where: { id },
            data: {
                status: client_1.FulfillmentStatus.PICKING,
                startedAt: new Date(),
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
                                displayName: true,
                            },
                        },
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const updatedOrder = await this.prisma.order.update({
            where: { id: fulfillment.orderId },
            data: {
                status: client_1.OrderStatus.PROCESSING,
                fulfillmentStatus: client_1.FulfillmentStatus.PICKING,
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.FULFILLMENT_STARTED,
                        description: `Fulfillment started: ${fulfillment.fulfillmentNumber}`,
                        userId,
                        metadata: { fulfillmentId: id },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
            },
        });
        await this.sendOrderStatusUpdateEmail({
            order: updatedOrder,
            previous: {
                status: fulfillment.order?.status,
                fulfillmentStatus: fulfillment.order?.fulfillmentStatus,
                paymentStatus: fulfillment.order?.paymentStatus,
            },
        });
        return this.mapFulfillmentToResponse(updatedFulfillment);
    }
    async createShipment(createShipmentDto, userId) {
        const { orderId, fulfillmentId, items, ...shipmentData } = createShipmentDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { fulfillments: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const fulfillment = fulfillmentId
            ? await this.prisma.fulfillment.findUnique({
                where: { id: fulfillmentId },
            })
            : null;
        if (fulfillmentId && !fulfillment) {
            throw new common_1.NotFoundException('Fulfillment not found');
        }
        const shipmentNumber = await this.generateShipmentNumber();
        const parsedEstimatedDelivery = shipmentData.estimatedDelivery
            ? new Date(shipmentData.estimatedDelivery)
            : undefined;
        const shipment = await this.prisma.shipment.create({
            data: {
                shipmentNumber,
                orderId,
                fulfillmentId,
                carrierId: null,
                shippingMethod: shipmentData.courierCompanyName,
                shippingCost: shipmentData.shippingCost,
                toAddress: shipmentData.toAddress,
                courierCompanyName: shipmentData.courierCompanyName,
                trackingUrl: shipmentData.trackingUrl,
                notes: shipmentData.notes,
                status: client_1.ShipmentStatus.PREPARING,
                estimatedDelivery: parsedEstimatedDelivery,
                weight: shipmentData.weight,
                dimensions: shipmentData.dimensions,
                packageCount: shipmentData.packageCount || 1,
                trackingEvents: [],
                items: {
                    create: items.map((item) => ({
                        orderItemId: item.orderItemId,
                        quantityShipped: item.quantityShipped,
                    })),
                },
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
                                displayName: true,
                            },
                        },
                    },
                },
                carrier: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return this.mapShipmentToResponse(shipment);
    }
    async markShipmentShipped(id, trackingNumber, userId) {
        const shipment = await this.prisma.shipment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        if (shipment.status === client_1.ShipmentStatus.DELIVERED || shipment.actualDelivery) {
            throw new common_1.BadRequestException('Delivered shipments can no longer be updated');
        }
        const updatedShipment = await this.prisma.shipment.update({
            where: { id },
            data: {
                status: client_1.ShipmentStatus.SHIPPED,
                trackingNumber,
                shippedAt: new Date(),
                trackingEvents: [
                    {
                        status: 'SHIPPED',
                        description: 'Package shipped',
                        timestamp: new Date().toISOString(),
                        location: 'Warehouse',
                    },
                ],
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
                                displayName: true,
                            },
                        },
                    },
                },
                carrier: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const updatedOrder = await this.prisma.order.update({
            where: { id: shipment.orderId },
            data: {
                status: client_1.OrderStatus.SHIPPED,
                shippedAt: new Date(),
                orderEvents: {
                    create: {
                        eventType: client_1.OrderEventType.SHIPMENT_SHIPPED,
                        description: `Shipment shipped: ${shipment.shipmentNumber}`,
                        userId,
                        metadata: { shipmentId: id, trackingNumber },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
            },
        });
        await this.sendOrderStatusUpdateEmail({
            order: { ...updatedOrder, orderNumber: shipment.order.orderNumber },
            previous: {
                status: shipment.order?.status,
                fulfillmentStatus: shipment.order?.fulfillmentStatus,
                paymentStatus: shipment.order?.paymentStatus,
            },
            extra: { trackingNumber },
        });
        return this.mapShipmentToResponse(updatedShipment);
    }
    async updateShipment(id, updateShipmentDto, userId) {
        const shipment = await this.prisma.shipment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: true,
                        shippingAddress: true,
                        billingAddress: true,
                    },
                },
                carrier: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        sku: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found');
        }
        if (shipment.status === client_1.ShipmentStatus.DELIVERED || shipment.actualDelivery) {
            throw new common_1.BadRequestException('Delivered shipments can no longer be updated');
        }
        const now = new Date();
        const nextStatus = updateShipmentDto.status;
        const previous = {
            status: shipment.order?.status,
            fulfillmentStatus: shipment.order?.fulfillmentStatus,
            paymentStatus: shipment.order?.paymentStatus,
        };
        const trackingEvents = Array.isArray(shipment.trackingEvents)
            ? [...shipment.trackingEvents]
            : [];
        if (nextStatus) {
            trackingEvents.push({
                status: nextStatus,
                description: `Shipment status updated to ${String(nextStatus).replace(/_/g, ' ')}`,
                timestamp: now.toISOString(),
                location: 'Merchant',
            });
        }
        const parsedEstimatedDelivery = updateShipmentDto.estimatedDelivery
            ? new Date(updateShipmentDto.estimatedDelivery)
            : undefined;
        const parsedActualDelivery = updateShipmentDto.actualDelivery
            ? new Date(updateShipmentDto.actualDelivery)
            : undefined;
        const shouldSetShippedAt = !!nextStatus &&
            (nextStatus === client_1.ShipmentStatus.SHIPPED ||
                nextStatus === client_1.ShipmentStatus.IN_TRANSIT ||
                nextStatus === client_1.ShipmentStatus.OUT_FOR_DELIVERY) &&
            !shipment.shippedAt;
        const shouldSetActualDelivery = nextStatus === client_1.ShipmentStatus.DELIVERED &&
            !shipment.actualDelivery &&
            !parsedActualDelivery;
        const [updatedShipment, updatedOrder] = await this.prisma.$transaction(async (tx) => {
            const updatedShipment = await tx.shipment.update({
                where: { id },
                data: {
                    status: updateShipmentDto.status,
                    trackingNumber: updateShipmentDto.trackingNumber,
                    carrierId: updateShipmentDto.carrierId,
                    shippingMethod: updateShipmentDto.shippingMethod,
                    shippingCost: updateShipmentDto.shippingCost,
                    estimatedDelivery: parsedEstimatedDelivery,
                    actualDelivery: parsedActualDelivery ??
                        (shouldSetActualDelivery ? now : undefined),
                    weight: updateShipmentDto.weight,
                    dimensions: updateShipmentDto.dimensions,
                    deliverySignature: updateShipmentDto.deliverySignature,
                    deliveryPhoto: updateShipmentDto.deliveryPhoto,
                    shippedAt: shouldSetShippedAt ? now : undefined,
                    trackingEvents,
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
                                    displayName: true,
                                },
                            },
                        },
                    },
                    carrier: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    },
                    items: {
                        include: {
                            orderItem: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            name: true,
                                            sku: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let updatedOrder = null;
            if (nextStatus) {
                if (nextStatus === client_1.ShipmentStatus.SHIPPED ||
                    nextStatus === client_1.ShipmentStatus.IN_TRANSIT ||
                    nextStatus === client_1.ShipmentStatus.OUT_FOR_DELIVERY) {
                    updatedOrder = await tx.order.update({
                        where: { id: shipment.orderId },
                        data: {
                            status: client_1.OrderStatus.SHIPPED,
                            shippedAt: shipment.order.shippedAt || now,
                            orderEvents: {
                                create: {
                                    eventType: client_1.OrderEventType.SHIPMENT_SHIPPED,
                                    description: `Shipment status updated: ${shipment.shipmentNumber} → ${String(nextStatus)}`,
                                    userId,
                                    metadata: {
                                        shipmentId: id,
                                        status: nextStatus,
                                        trackingNumber: updateShipmentDto.trackingNumber,
                                    },
                                },
                            },
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    displayName: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            shippingAddress: true,
                            billingAddress: true,
                        },
                    });
                }
                else if (nextStatus === client_1.ShipmentStatus.DELIVERED) {
                    updatedOrder = await tx.order.update({
                        where: { id: shipment.orderId },
                        data: {
                            status: client_1.OrderStatus.DELIVERED,
                            deliveredAt: shipment.order.deliveredAt || now,
                            orderEvents: {
                                create: {
                                    eventType: client_1.OrderEventType.SHIPMENT_DELIVERED,
                                    description: `Shipment delivered: ${shipment.shipmentNumber}`,
                                    userId,
                                    metadata: { shipmentId: id, status: nextStatus },
                                },
                            },
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    displayName: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            shippingAddress: true,
                            billingAddress: true,
                        },
                    });
                }
            }
            return [updatedShipment, updatedOrder];
        });
        if (updatedOrder) {
            await this.sendOrderStatusUpdateEmail({
                order: updatedOrder,
                previous,
                extra: {
                    trackingNumber: updateShipmentDto.trackingNumber,
                },
            });
        }
        return this.mapShipmentToResponse(updatedShipment);
    }
    async createInvoice(createInvoiceDto, userId) {
        const { orderId, ...invoiceData } = createInvoiceDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                company: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
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
                status: client_1.InvoiceStatus.DRAFT,
                issuedAt: invoiceData.issuedAt,
                dueAt: invoiceData.dueAt,
                paymentMethod: invoiceData.paymentMethod,
            },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        purchaseOrderNumber: true,
                        totalAmount: true,
                        createdAt: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
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
                        country: true,
                    },
                },
            },
        });
        return this.mapInvoiceToResponse(invoice);
    }
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastOrder = await this.prisma.order.findFirst({
            where: {
                orderNumber: {
                    startsWith: `HW-${year}${month}-`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `HW-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }
    async generateFulfillmentNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastFulfillment = await this.prisma.fulfillment.findFirst({
            where: {
                fulfillmentNumber: {
                    startsWith: `FUL-${year}${month}-`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastFulfillment) {
            const lastSequence = parseInt(lastFulfillment.fulfillmentNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `FUL-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }
    async generateShipmentNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastShipment = await this.prisma.shipment.findFirst({
            where: {
                shipmentNumber: {
                    startsWith: `SHP-${year}${month}-`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastShipment) {
            const lastSequence = parseInt(lastShipment.shipmentNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `SHP-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }
    async generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastInvoice = await this.prisma.invoice.findFirst({
            where: {
                invoiceNumber: {
                    startsWith: `INV-${year}${month}-`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0');
            sequence = lastSequence + 1;
        }
        return `INV-${year}${month}-${String(sequence).padStart(6, '0')}`;
    }
    mapOrderToResponse(order) {
        const paymentProofs = (order.orderEvents || [])
            .map((e) => {
            const proof = e?.metadata?.paymentProof;
            const fileId = proof?.fileId;
            if (!fileId)
                return null;
            return {
                fileId,
                url: proof?.url,
                filename: proof?.filename,
                uploadedAt: e?.createdAt,
                uploadedBy: e?.user
                    ? {
                        id: e.user.id,
                        displayName: e.user.displayName,
                        firstName: e.user.firstName,
                        lastName: e.user.lastName,
                        email: e.user.email,
                    }
                    : undefined,
            };
        })
            .filter(Boolean) || [];
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            purchaseOrderNumber: order.purchaseOrderNumber,
            user: order.user,
            company: order.company,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            items: order.items?.map((item) => ({
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
                updatedAt: item.updatedAt,
            })) || [],
            shipments: order.shipments?.map((s) => ({
                id: s.id,
                shipmentNumber: s.shipmentNumber,
                trackingNumber: s.trackingNumber,
                courierCompanyName: s.courierCompanyName,
                trackingUrl: s.trackingUrl,
                notes: s.notes,
                order: s.order,
                fulfillment: s.fulfillment,
                carrier: s.carrier,
                shippingMethod: s.shippingMethod,
                shippingCost: parseFloat(s.shippingCost.toString()),
                toAddress: s.toAddress,
                status: s.status,
                shippedAt: s.shippedAt,
                estimatedDelivery: s.estimatedDelivery,
                actualDelivery: s.actualDelivery,
                weight: s.weight ? parseFloat(s.weight.toString()) : undefined,
                dimensions: s.dimensions,
                packageCount: s.packageCount,
                trackingEvents: s.trackingEvents || [],
                deliverySignature: s.deliverySignature,
                deliveryPhoto: s.deliveryPhoto,
                items: s.items || [],
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
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
            paymentProofs,
            creditTerms: order.creditTerms,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            confirmedAt: order.confirmedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt,
        };
    }
    mapFulfillmentToResponse(fulfillment) {
        return {
            id: fulfillment.id,
            fulfillmentNumber: fulfillment.fulfillmentNumber,
            order: fulfillment.order,
            status: fulfillment.status,
            priority: fulfillment.priority,
            assignedUser: fulfillment.assignedUser,
            items: fulfillment.items?.map((item) => ({
                id: item.id,
                orderItem: item.orderItem,
                inventoryItem: item.inventoryItem,
                quantityAllocated: item.quantityAllocated,
                quantityPicked: item.quantityPicked,
                quantityPacked: item.quantityPacked,
                status: item.status,
                pickingNotes: item.pickingNotes,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })) || [],
            pickingNotes: fulfillment.pickingNotes,
            packingNotes: fulfillment.packingNotes,
            scheduledAt: fulfillment.scheduledAt,
            startedAt: fulfillment.startedAt,
            completedAt: fulfillment.completedAt,
            createdAt: fulfillment.createdAt,
            updatedAt: fulfillment.updatedAt,
        };
    }
    mapShipmentToResponse(shipment) {
        return {
            id: shipment.id,
            shipmentNumber: shipment.shipmentNumber,
            trackingNumber: shipment.trackingNumber,
            order: shipment.order,
            fulfillment: shipment.fulfillment,
            carrier: shipment.carrier,
            shippingMethod: shipment.shippingMethod,
            shippingCost: parseFloat(shipment.shippingCost.toString()),
            toAddress: shipment.toAddress,
            status: shipment.status,
            weight: shipment.weight
                ? parseFloat(shipment.weight.toString())
                : undefined,
            dimensions: shipment.dimensions,
            packageCount: shipment.packageCount,
            trackingEvents: shipment.trackingEvents || [],
            deliverySignature: shipment.deliverySignature,
            deliveryPhoto: shipment.deliveryPhoto,
            items: shipment.items?.map((item) => ({
                id: item.id,
                orderItem: item.orderItem,
                quantityShipped: item.quantityShipped,
                createdAt: item.createdAt,
            })) || [],
            shippedAt: shipment.shippedAt,
            estimatedDelivery: shipment.estimatedDelivery,
            actualDelivery: shipment.actualDelivery,
            createdAt: shipment.createdAt,
            updatedAt: shipment.updatedAt,
        };
    }
    mapInvoiceToResponse(invoice) {
        const now = new Date();
        const dueDate = invoice.dueAt ? new Date(invoice.dueAt) : null;
        const isOverdue = dueDate && now > dueDate && invoice.status !== client_1.InvoiceStatus.PAID;
        const daysOverdue = isOverdue
            ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
            : undefined;
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
            updatedAt: invoice.updatedAt,
        };
    }
};
exports.OrderFulfillmentService = OrderFulfillmentService;
exports.OrderFulfillmentService = OrderFulfillmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], OrderFulfillmentService);
//# sourceMappingURL=order-fulfillment.service.js.map