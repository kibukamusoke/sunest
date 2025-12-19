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
var CheckoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const order_fulfillment_service_1 = require("../order-fulfillment/order-fulfillment.service");
const client_1 = require("@prisma/client");
let CheckoutService = CheckoutService_1 = class CheckoutService {
    constructor(prisma, notificationService, orderFulfillmentService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.orderFulfillmentService = orderFulfillmentService;
        this.logger = new common_1.Logger(CheckoutService_1.name);
    }
    async initiateCheckout(initiateDto, userId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                id: initiateDto.cartId,
                userId,
                isActive: true,
            },
            include: {
                items: {
                    where: { status: 'ACTIVE' },
                    include: {
                        product: true,
                        productVariant: true,
                    },
                },
                company: true,
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        if (cart.items.length === 0) {
            throw new common_1.BadRequestException('Cannot checkout empty cart');
        }
        const defaultShipping = await this.prisma.address.findFirst({
            where: {
                companyId: initiateDto.companyId || cart.companyId,
                type: { in: ['SHIPPING', 'BOTH'] },
                isDefault: true,
                isActive: true,
            },
        });
        const defaultBilling = await this.prisma.address.findFirst({
            where: {
                companyId: initiateDto.companyId || cart.companyId,
                type: { in: ['BILLING', 'BOTH'] },
                isDefault: true,
                isActive: true,
            },
        });
        const calculation = this.calculateCheckoutPricing(cart.items, defaultShipping, defaultBilling);
        const approvalRequirement = await this.checkApprovalRequirement(userId, calculation.totalAmount, initiateDto.companyId);
        const checkout = await this.prisma.checkout.create({
            data: {
                cartId: cart.id,
                userId,
                companyId: initiateDto.companyId || cart.companyId,
                shippingAddressId: defaultShipping?.id,
                billingAddressId: defaultBilling?.id,
                paymentMethod: client_1.PaymentMethod.CORPORATE_ACCOUNT,
                subtotal: calculation.subtotal,
                taxAmount: calculation.taxAmount,
                shippingAmount: calculation.shippingAmount,
                discountAmount: calculation.discountAmount,
                totalAmount: calculation.totalAmount,
                currency: calculation.currency,
                requiresApproval: approvalRequirement.required,
                approvalStatus: approvalRequirement.required
                    ? client_1.ApprovalStatus.NONE
                    : client_1.ApprovalStatus.NONE,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        this.logger.log(`Checkout initiated: ${checkout.id} for cart ${cart.id}`);
        return this.mapCheckoutToResponseDto(checkout, calculation);
    }
    async getCheckout(checkoutId, userId) {
        const checkout = await this.prisma.checkout.findFirst({
            where: {
                id: checkoutId,
                userId,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        const calculation = this.calculateCheckoutPricing(checkout.cart.items, checkout.shippingAddress, checkout.billingAddress);
        return this.mapCheckoutToResponseDto(checkout, calculation);
    }
    async updateCheckoutShipping(checkoutId, shippingDto, userId) {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);
        const address = await this.prisma.address.findFirst({
            where: {
                id: shippingDto.shippingAddressId,
                companyId: checkout.companyId,
                type: { in: ['SHIPPING', 'BOTH'] },
                isActive: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Shipping address not found');
        }
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                shippingAddressId: shippingDto.shippingAddressId,
                preferredDeliveryDate: shippingDto.preferredDeliveryDate
                    ? new Date(shippingDto.preferredDeliveryDate)
                    : null,
                deliveryInstructions: shippingDto.deliveryInstructions,
                shippingMethod: shippingDto.shippingMethod,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                subtotal: calculation.subtotal,
                taxAmount: calculation.taxAmount,
                shippingAmount: calculation.shippingAmount,
                discountAmount: calculation.discountAmount,
                totalAmount: calculation.totalAmount,
            },
        });
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }
    async updateCheckoutBilling(checkoutId, billingDto, userId) {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);
        const address = await this.prisma.address.findFirst({
            where: {
                id: billingDto.billingAddressId,
                companyId: checkout.companyId,
                type: { in: ['BILLING', 'BOTH'] },
                isActive: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Billing address not found');
        }
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                billingAddressId: billingDto.billingAddressId,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }
    async updateCheckoutPayment(checkoutId, paymentDto, userId) {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                paymentMethod: paymentDto.paymentMethod,
                paymentDetails: paymentDto.paymentDetails,
                purchaseOrderNumber: paymentDto.purchaseOrderNumber,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }
    async updateCheckoutNotes(checkoutId, notesDto, userId) {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                customerNotes: notesDto.customerNotes,
                internalNotes: notesDto.internalNotes,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }
    async submitCheckout(checkoutId, submitDto, userId) {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);
        if (checkout.status !== client_1.CheckoutStatus.PENDING) {
            throw new common_1.BadRequestException('Checkout is not in pending status');
        }
        if (!checkout.shippingAddressId || !checkout.billingAddressId) {
            throw new common_1.BadRequestException('Shipping and billing addresses are required to complete checkout');
        }
        if (!checkout.paymentMethod) {
            throw new common_1.BadRequestException('Payment method is required to complete checkout');
        }
        const requiresApproval = checkout.requiresApproval && !submitDto.bypassApproval;
        const statusUpdate = {
            customerNotes: submitDto.customerNotes || checkout.customerNotes,
        };
        if (requiresApproval) {
            statusUpdate.status = client_1.CheckoutStatus.PENDING_APPROVAL;
            statusUpdate.approvalStatus = client_1.ApprovalStatus.PENDING;
            statusUpdate.approvalRequestedAt = new Date();
            statusUpdate.approvalRequestedBy = userId;
        }
        else {
            statusUpdate.status = client_1.CheckoutStatus.APPROVED;
            statusUpdate.approvalStatus = client_1.ApprovalStatus.APPROVED;
            statusUpdate.approvedAt = new Date();
            statusUpdate.approvedBy = userId;
        }
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: statusUpdate,
            include: this.getCheckoutIncludeOptions(),
        });
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        if (requiresApproval) {
            const checkoutWithTotals = await this.updateCheckoutTotals(checkoutId, calculation);
            await this.sendApprovalNotification(checkoutWithTotals);
            this.logger.log(`Checkout submitted for approval: ${checkoutId}`);
            return this.mapCheckoutToResponseDto(checkoutWithTotals, calculation);
        }
        const completedCheckout = await this.completeApprovedCheckout(updatedCheckout, calculation);
        this.logger.log(`Checkout submitted and auto-completed: ${checkoutId}`);
        return completedCheckout;
    }
    async approveCheckout(checkoutId, approvalDto, userId) {
        const checkout = await this.prisma.checkout.findUnique({
            where: { id: checkoutId },
            include: this.getCheckoutIncludeOptions(),
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        if (checkout.approvalStatus !== client_1.ApprovalStatus.PENDING) {
            throw new common_1.BadRequestException('Checkout is not pending approval');
        }
        const hasApprovalAuthority = await this.checkApprovalAuthority(userId, parseFloat(checkout.totalAmount.toString()), checkout.companyId || undefined);
        if (!hasApprovalAuthority) {
            throw new common_1.ForbiddenException('Insufficient approval authority');
        }
        const updateData = {
            approvedAt: new Date(),
            approvedBy: userId,
        };
        if (approvalDto.approved) {
            updateData.status = client_1.CheckoutStatus.APPROVED;
            updateData.approvalStatus = client_1.ApprovalStatus.APPROVED;
        }
        else {
            updateData.status = client_1.CheckoutStatus.REJECTED;
            updateData.approvalStatus = client_1.ApprovalStatus.REJECTED;
            updateData.rejectedAt = new Date();
            updateData.rejectedBy = userId;
            updateData.rejectionReason = approvalDto.rejectionReason;
        }
        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: updateData,
            include: this.getCheckoutIncludeOptions(),
        });
        await this.sendApprovalDecisionNotification(updatedCheckout, approvalDto.approved);
        const calculation = this.calculateCheckoutPricing(updatedCheckout.cart.items, updatedCheckout.shippingAddress, updatedCheckout.billingAddress);
        if (approvalDto.approved) {
            const completedCheckout = await this.completeApprovedCheckout(updatedCheckout, calculation);
            this.logger.log(`Checkout approved and completed: ${checkoutId} by ${userId}`);
            return completedCheckout;
        }
        const checkoutWithTotals = await this.updateCheckoutTotals(checkoutId, calculation);
        this.logger.log(`Checkout rejected: ${checkoutId} by ${userId}`);
        return this.mapCheckoutToResponseDto(checkoutWithTotals, calculation);
    }
    async completeCheckout(checkoutId, userId) {
        const checkoutRecord = await this.prisma.checkout.findFirst({
            where: {
                id: checkoutId,
                userId,
            },
            include: this.getCheckoutIncludeOptions(),
        });
        if (!checkoutRecord) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        if (checkoutRecord.status !== client_1.CheckoutStatus.APPROVED) {
            throw new common_1.BadRequestException('Checkout must be approved before completion');
        }
        const calculation = this.calculateCheckoutPricing(checkoutRecord.cart.items, checkoutRecord.shippingAddress, checkoutRecord.billingAddress);
        const completedCheckout = await this.completeApprovedCheckout(checkoutRecord, calculation);
        this.logger.log(`Checkout completed manually: ${checkoutId}`);
        return completedCheckout;
    }
    async listCheckouts(filterDto, userId, userRoles) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;
        const whereConditions = [];
        if (!userRoles.includes('SystemAdmin')) {
            if (userRoles.includes('MerchantAdmin') ||
                userRoles.includes('MerchantUser')) {
                whereConditions.push({ userId });
            }
            else {
                whereConditions.push({ userId });
            }
        }
        if (filterDto.status) {
            whereConditions.push({ status: filterDto.status });
        }
        if (filterDto.approvalStatus) {
            whereConditions.push({ approvalStatus: filterDto.approvalStatus });
        }
        if (filterDto.companyId) {
            whereConditions.push({ companyId: filterDto.companyId });
        }
        if (filterDto.userId && userRoles.includes('SystemAdmin')) {
            whereConditions.push({ userId: filterDto.userId });
        }
        if (filterDto.minAmount) {
            whereConditions.push({ totalAmount: { gte: filterDto.minAmount } });
        }
        if (filterDto.maxAmount) {
            whereConditions.push({ totalAmount: { lte: filterDto.maxAmount } });
        }
        if (filterDto.createdFrom) {
            whereConditions.push({
                createdAt: { gte: new Date(filterDto.createdFrom) },
            });
        }
        if (filterDto.createdTo) {
            whereConditions.push({
                createdAt: { lte: new Date(filterDto.createdTo) },
            });
        }
        const whereClause = {
            AND: whereConditions,
        };
        const [checkouts, total] = await Promise.all([
            this.prisma.checkout.findMany({
                where: whereClause,
                include: this.getCheckoutIncludeOptions(),
                orderBy: {
                    [filterDto.sortBy || 'createdAt']: filterDto.sortOrder || 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.checkout.count({ where: whereClause }),
        ]);
        const checkoutDtos = checkouts.map((checkout) => {
            const calculation = this.calculateCheckoutPricing(checkout.cart.items, checkout.shippingAddress, checkout.billingAddress);
            return this.mapCheckoutToResponseDto(checkout, calculation);
        });
        return {
            checkouts: checkoutDtos,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        };
    }
    async getApprovalRequirement(userId, totalAmount, companyId) {
        return this.checkApprovalRequirement(userId, totalAmount, companyId);
    }
    async checkApprovalRequirement(userId, totalAmount, companyId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: true,
                companies: {
                    where: companyId ? { companyId } : undefined,
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userApprovalLimit = this.getUserApprovalLimit(user);
        const required = totalAmount > userApprovalLimit;
        const eligibleApprovers = await this.getEligibleApprovers(totalAmount, companyId);
        return {
            required,
            reason: required
                ? `Order total exceeds user approval limit of $${userApprovalLimit}`
                : 'No approval required',
            userApprovalLimit,
            orderTotal: totalAmount,
            requiredLevel: required ? 'manager' : 'self',
            eligibleApprovers,
        };
    }
    async checkApprovalAuthority(userId, amount, companyId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: true,
            },
        });
        if (!user) {
            return false;
        }
        const userApprovalLimit = this.getUserApprovalLimit(user);
        return amount <= userApprovalLimit;
    }
    getUserApprovalLimit(user) {
        if (!user.roles || user.roles.length === 0) {
            return 500;
        }
        const roleNames = user.roles.map((r) => r.name);
        if (roleNames.includes('SystemAdmin'))
            return 1000000;
        if (roleNames.includes('MerchantAdmin'))
            return 50000;
        if (roleNames.includes('MerchantUser'))
            return 10000;
        if (roleNames.includes('Buyer'))
            return 1000;
        return 500;
    }
    async getEligibleApprovers(amount, companyId) {
        const users = await this.prisma.user.findMany({
            where: {
                companies: companyId
                    ? {
                        some: { companyId },
                    }
                    : undefined,
                isActive: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true,
            },
        });
        return users
            .filter((user) => this.getUserApprovalLimit(user) >= amount)
            .map((user) => ({
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            approvalLimit: this.getUserApprovalLimit(user),
        }));
    }
    calculateCheckoutPricing(items, shippingAddress, billingAddress) {
        const subtotal = items.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0);
        const taxRate = 0.085;
        const taxAmount = subtotal * taxRate;
        const shippingAmount = subtotal > 500 ? 0 : 49.99;
        const discountAmount = subtotal > 2000 ? subtotal * 0.05 : 0;
        const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            shippingAmount: parseFloat(shippingAmount.toFixed(2)),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            currency: 'USD',
            taxBreakdown: {
                state: {
                    rate: taxRate,
                    amount: parseFloat(taxAmount.toFixed(2)),
                },
            },
            appliedDiscounts: discountAmount > 0
                ? [
                    {
                        type: 'volume_discount',
                        description: 'Volume discount (>$2000)',
                        amount: parseFloat(discountAmount.toFixed(2)),
                        percentage: 5.0,
                    },
                ]
                : [],
            shippingOptions: [
                {
                    method: 'Standard Ground',
                    cost: shippingAmount,
                    estimatedDays: 5,
                },
                {
                    method: 'Express',
                    cost: shippingAmount + 80,
                    estimatedDays: 2,
                },
            ],
        };
    }
    async sendApprovalNotification(checkout) {
        try {
            const eligibleApprovers = await this.getEligibleApprovers(parseFloat(checkout.totalAmount.toString()), checkout.companyId);
            const approverEmails = eligibleApprovers.map((approver) => approver.email);
            if (approverEmails.length > 0) {
                await this.notificationService.sendEmail({
                    to: approverEmails.map((email) => ({ email })),
                    subject: 'Checkout Approval Required',
                    text: `A checkout worth $${checkout.totalAmount} requires your approval`,
                    html: `<h2>Checkout Approval Required</h2><p>A checkout worth $${checkout.totalAmount} requires your approval</p>`,
                });
            }
        }
        catch (error) {
            this.logger.error('Failed to send approval notification:', error);
        }
    }
    async sendApprovalDecisionNotification(checkout, approved) {
        try {
            if (checkout.user?.email) {
                await this.notificationService.sendEmail({
                    to: [{ email: checkout.user.email }],
                    subject: `Checkout ${approved ? 'Approved' : 'Rejected'}`,
                    text: `Your checkout worth $${checkout.totalAmount} has been ${approved ? 'approved' : 'rejected'}`,
                    html: `<h2>Checkout ${approved ? 'Approved' : 'Rejected'}</h2><p>Your checkout worth $${checkout.totalAmount} has been ${approved ? 'approved' : 'rejected'}</p>`,
                });
            }
        }
        catch (error) {
            this.logger.error('Failed to send approval decision notification:', error);
        }
    }
    async updateCheckoutTotals(checkoutId, calculation) {
        return this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                subtotal: calculation.subtotal,
                taxAmount: calculation.taxAmount,
                shippingAmount: calculation.shippingAmount,
                discountAmount: calculation.discountAmount,
                totalAmount: calculation.totalAmount,
            },
            include: this.getCheckoutIncludeOptions(),
        });
    }
    buildOrderDtoFromCheckout(checkout) {
        if (!checkout.shippingAddressId || !checkout.billingAddressId) {
            throw new common_1.BadRequestException('Shipping and billing addresses are required to create an order');
        }
        if (!checkout.cart?.items || checkout.cart.items.length === 0) {
            throw new common_1.BadRequestException('Cannot create an order from an empty cart');
        }
        const orderItems = checkout.cart.items.map((item) => ({
            productId: item.productId || undefined,
            productVariantId: item.productVariantId || undefined,
            customProductName: item.customProductName || undefined,
            customSku: item.customSku || undefined,
            customDescription: item.customDescription || undefined,
            quantity: item.quantity,
            unitPrice: item.unitPrice != null ? parseFloat(item.unitPrice.toString()) : 0,
            requestedDeliveryDate: item.requiredByDate
                ? new Date(item.requiredByDate).toISOString()
                : undefined,
            itemNotes: item.notes || undefined,
        }));
        return {
            checkoutId: checkout.id,
            purchaseOrderNumber: checkout.purchaseOrderNumber || undefined,
            companyId: checkout.companyId || undefined,
            shippingAddressId: checkout.shippingAddressId,
            billingAddressId: checkout.billingAddressId,
            paymentMethod: checkout.paymentMethod,
            requestedDeliveryDate: checkout.preferredDeliveryDate
                ? new Date(checkout.preferredDeliveryDate).toISOString()
                : undefined,
            customerNotes: checkout.customerNotes || undefined,
            specialInstructions: checkout.deliveryInstructions || undefined,
            items: orderItems,
        };
    }
    async completeApprovedCheckout(checkout, calculation) {
        const checkoutWithTotals = await this.updateCheckoutTotals(checkout.id, calculation);
        let order;
        try {
            const orderDto = this.buildOrderDtoFromCheckout(checkoutWithTotals);
            order = await this.orderFulfillmentService.createOrder(orderDto, checkoutWithTotals.userId);
        }
        catch (error) {
            this.logger.error(`Failed to create order for checkout ${checkout.id}:`, error);
            throw new common_1.BadRequestException('Failed to create order from checkout');
        }
        const completedCheckout = await this.prisma.checkout.update({
            where: { id: checkout.id },
            data: {
                status: client_1.CheckoutStatus.COMPLETED,
                orderId: order.id,
                completedAt: new Date(),
            },
            include: this.getCheckoutIncludeOptions(),
        });
        await this.prisma.cart.update({
            where: { id: checkoutWithTotals.cartId },
            data: { isActive: false },
        });
        return this.mapCheckoutToResponseDto(completedCheckout, calculation);
    }
    async validateCheckoutAccess(checkoutId, userId) {
        const checkout = await this.prisma.checkout.findFirst({
            where: {
                id: checkoutId,
                userId,
            },
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        if (checkout.status === client_1.CheckoutStatus.COMPLETED ||
            checkout.status === client_1.CheckoutStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot modify completed or cancelled checkout');
        }
        return checkout;
    }
    getCheckoutIncludeOptions() {
        return {
            user: true,
            company: true,
            cart: {
                include: {
                    items: {
                        where: { status: 'ACTIVE' },
                        include: {
                            product: true,
                            productVariant: true,
                        },
                    },
                },
            },
            shippingAddress: true,
            billingAddress: true,
        };
    }
    mapCheckoutToResponseDto(checkout, calculation) {
        return {
            id: checkout.id,
            cartId: checkout.cartId,
            userId: checkout.userId,
            company: checkout.company
                ? {
                    id: checkout.company.id,
                    name: checkout.company.name,
                    domain: checkout.company.domain,
                }
                : undefined,
            shippingAddress: checkout.shippingAddress
                ? this.mapAddressToResponseDto(checkout.shippingAddress)
                : undefined,
            billingAddress: checkout.billingAddress
                ? this.mapAddressToResponseDto(checkout.billingAddress)
                : undefined,
            paymentMethod: checkout.paymentMethod,
            purchaseOrderNumber: checkout.purchaseOrderNumber,
            calculation,
            status: checkout.status,
            requiresApproval: checkout.requiresApproval,
            approvalStatus: checkout.approvalStatus,
            approvalRequestedAt: checkout.approvalRequestedAt,
            approvalRequestedBy: checkout.approvalRequestedBy,
            approvedAt: checkout.approvedAt,
            approvedBy: checkout.approvedBy,
            rejectedAt: checkout.rejectedAt,
            rejectedBy: checkout.rejectedBy,
            rejectionReason: checkout.rejectionReason,
            preferredDeliveryDate: checkout.preferredDeliveryDate,
            deliveryInstructions: checkout.deliveryInstructions,
            shippingMethod: checkout.shippingMethod,
            customerNotes: checkout.customerNotes,
            internalNotes: checkout.internalNotes,
            orderId: checkout.orderId,
            paymentIntentId: checkout.paymentIntentId,
            createdAt: checkout.createdAt,
            updatedAt: checkout.updatedAt,
            completedAt: checkout.completedAt,
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
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = CheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        order_fulfillment_service_1.OrderFulfillmentService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map