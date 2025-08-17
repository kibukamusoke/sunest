import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { Prisma, CheckoutStatus, ApprovalStatus, PaymentMethod } from '@prisma/client';
import { NotificationType } from '../notifications/dto/notification.dto';
import {
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
    AddressResponseDto,
} from './dto';

@Injectable()
export class CheckoutService {
    private readonly logger = new Logger(CheckoutService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
    ) { }

    // ==================== CHECKOUT PROCESS ====================

    async initiateCheckout(initiateDto: InitiateCheckoutDto, userId: string): Promise<CheckoutResponseDto> {
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
            throw new NotFoundException('Cart not found');
        }

        if (cart.items.length === 0) {
            throw new BadRequestException('Cannot checkout empty cart');
        }

        // Get default addresses
        const defaultShipping = await this.prisma.address.findFirst({
            where: {
                userId,
                companyId: initiateDto.companyId || cart.companyId,
                type: { in: ['SHIPPING', 'BOTH'] },
                isDefault: true,
                isActive: true,
            },
        });

        const defaultBilling = await this.prisma.address.findFirst({
            where: {
                userId,
                companyId: initiateDto.companyId || cart.companyId,
                type: { in: ['BILLING', 'BOTH'] },
                isDefault: true,
                isActive: true,
            },
        });

        if (!defaultShipping || !defaultBilling) {
            throw new BadRequestException('Default shipping and billing addresses are required');
        }

        // Calculate initial pricing
        const calculation = this.calculateCheckoutPricing(cart.items, defaultShipping, defaultBilling);

        // Determine if approval is required
        const approvalRequirement = await this.checkApprovalRequirement(userId, calculation.totalAmount, initiateDto.companyId);

        const checkout = await this.prisma.checkout.create({
            data: {
                cartId: cart.id,
                userId,
                companyId: initiateDto.companyId || cart.companyId,
                shippingAddressId: defaultShipping.id,
                billingAddressId: defaultBilling.id,
                paymentMethod: PaymentMethod.CORPORATE_ACCOUNT, // Default
                subtotal: calculation.subtotal,
                taxAmount: calculation.taxAmount,
                shippingAmount: calculation.shippingAmount,
                discountAmount: calculation.discountAmount,
                totalAmount: calculation.totalAmount,
                currency: calculation.currency,
                requiresApproval: approvalRequirement.required,
                approvalStatus: approvalRequirement.required ? ApprovalStatus.NONE : ApprovalStatus.NONE,
            },
            include: this.getCheckoutIncludeOptions(),
        });

        this.logger.log(`Checkout initiated: ${checkout.id} for cart ${cart.id}`);
        return this.mapCheckoutToResponseDto(checkout, calculation);
    }

    async getCheckout(checkoutId: string, userId: string): Promise<CheckoutResponseDto> {
        const checkout = await this.prisma.checkout.findFirst({
            where: {
                id: checkoutId,
                userId,
            },
            include: this.getCheckoutIncludeOptions(),
        });

        if (!checkout) {
            throw new NotFoundException('Checkout not found');
        }

        const calculation = this.calculateCheckoutPricing(
            checkout.cart.items,
            checkout.shippingAddress,
            checkout.billingAddress,
        );

        return this.mapCheckoutToResponseDto(checkout, calculation);
    }

    async updateCheckoutShipping(
        checkoutId: string,
        shippingDto: UpdateCheckoutShippingDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);

        // Verify address belongs to user
        const address = await this.prisma.address.findFirst({
            where: {
                id: shippingDto.shippingAddressId,
                userId,
                type: { in: ['SHIPPING', 'BOTH'] },
                isActive: true,
            },
        });

        if (!address) {
            throw new NotFoundException('Shipping address not found');
        }

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                shippingAddressId: shippingDto.shippingAddressId,
                preferredDeliveryDate: shippingDto.preferredDeliveryDate ? new Date(shippingDto.preferredDeliveryDate) : null,
                deliveryInstructions: shippingDto.deliveryInstructions,
                shippingMethod: shippingDto.shippingMethod,
            },
            include: this.getCheckoutIncludeOptions(),
        });

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        // Recalculate totals with new shipping
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

    async updateCheckoutBilling(
        checkoutId: string,
        billingDto: UpdateCheckoutBillingDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);

        // Verify address belongs to user
        const address = await this.prisma.address.findFirst({
            where: {
                id: billingDto.billingAddressId,
                userId,
                type: { in: ['BILLING', 'BOTH'] },
                isActive: true,
            },
        });

        if (!address) {
            throw new NotFoundException('Billing address not found');
        }

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                billingAddressId: billingDto.billingAddressId,
            },
            include: this.getCheckoutIncludeOptions(),
        });

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async updateCheckoutPayment(
        checkoutId: string,
        paymentDto: UpdateCheckoutPaymentDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
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

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async updateCheckoutNotes(
        checkoutId: string,
        notesDto: UpdateCheckoutNotesDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                customerNotes: notesDto.customerNotes,
                internalNotes: notesDto.internalNotes,
            },
            include: this.getCheckoutIncludeOptions(),
        });

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async submitCheckout(
        checkoutId: string,
        submitDto: SubmitCheckoutDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);

        if (checkout.status !== CheckoutStatus.PENDING) {
            throw new BadRequestException('Checkout is not in pending status');
        }

        const updateData: any = {
            customerNotes: submitDto.customerNotes || checkout.customerNotes,
        };

        // Check if approval is required
        if (checkout.requiresApproval && !submitDto.bypassApproval) {
            updateData.status = CheckoutStatus.PENDING_APPROVAL;
            updateData.approvalStatus = ApprovalStatus.PENDING;
            updateData.approvalRequestedAt = new Date();
            updateData.approvalRequestedBy = userId;

            // Send approval notification
            await this.sendApprovalNotification(checkout);
        } else {
            updateData.status = CheckoutStatus.APPROVED;
            updateData.approvalStatus = ApprovalStatus.APPROVED;
            updateData.approvedAt = new Date();
            updateData.approvedBy = userId;
        }

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: updateData,
            include: this.getCheckoutIncludeOptions(),
        });

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        this.logger.log(`Checkout submitted: ${checkoutId}, status: ${updatedCheckout.status}`);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async approveCheckout(
        checkoutId: string,
        approvalDto: ApproveCheckoutDto,
        userId: string,
    ): Promise<CheckoutResponseDto> {
        const checkout = await this.prisma.checkout.findUnique({
            where: { id: checkoutId },
            include: this.getCheckoutIncludeOptions(),
        });

        if (!checkout) {
            throw new NotFoundException('Checkout not found');
        }

        if (checkout.approvalStatus !== ApprovalStatus.PENDING) {
            throw new BadRequestException('Checkout is not pending approval');
        }

        // Check if user has approval authority
        const hasApprovalAuthority = await this.checkApprovalAuthority(userId, parseFloat(checkout.totalAmount.toString()), checkout.companyId || undefined);
        if (!hasApprovalAuthority) {
            throw new ForbiddenException('Insufficient approval authority');
        }

        const updateData: any = {
            approvedAt: new Date(),
            approvedBy: userId,
        };

        if (approvalDto.approved) {
            updateData.status = CheckoutStatus.APPROVED;
            updateData.approvalStatus = ApprovalStatus.APPROVED;
        } else {
            updateData.status = CheckoutStatus.REJECTED;
            updateData.approvalStatus = ApprovalStatus.REJECTED;
            updateData.rejectedAt = new Date();
            updateData.rejectedBy = userId;
            updateData.rejectionReason = approvalDto.rejectionReason;
        }

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: updateData,
            include: this.getCheckoutIncludeOptions(),
        });

        // Send notification to requester
        await this.sendApprovalDecisionNotification(updatedCheckout, approvalDto.approved);

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        this.logger.log(`Checkout ${approvalDto.approved ? 'approved' : 'rejected'}: ${checkoutId} by ${userId}`);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async completeCheckout(checkoutId: string, userId: string): Promise<CheckoutResponseDto> {
        const checkout = await this.validateCheckoutAccess(checkoutId, userId);

        if (checkout.status !== CheckoutStatus.APPROVED) {
            throw new BadRequestException('Checkout must be approved before completion');
        }

        // TODO: Process payment
        // TODO: Create order
        // TODO: Update inventory

        const updatedCheckout = await this.prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                status: CheckoutStatus.COMPLETED,
                completedAt: new Date(),
                // orderId: createdOrderId, // TODO: Set when order creation is implemented
            },
            include: this.getCheckoutIncludeOptions(),
        });

        // Deactivate cart
        await this.prisma.cart.update({
            where: { id: checkout.cartId },
            data: { isActive: false },
        });

        const calculation = this.calculateCheckoutPricing(
            updatedCheckout.cart.items,
            updatedCheckout.shippingAddress,
            updatedCheckout.billingAddress,
        );

        this.logger.log(`Checkout completed: ${checkoutId}`);
        return this.mapCheckoutToResponseDto(updatedCheckout, calculation);
    }

    async listCheckouts(filterDto: CheckoutFilterDto, userId: string, userRoles: string[]): Promise<CheckoutListDto> {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;

        const whereConditions: Prisma.CheckoutWhereInput[] = [];

        // Role-based filtering
        if (!userRoles.includes('SystemAdmin')) {
            if (userRoles.includes('MerchantAdmin') || userRoles.includes('MerchantUser')) {
                // Merchants can see checkouts for their products (TODO: implement when orders are connected)
                whereConditions.push({ userId });
            } else {
                // Buyers can only see their own checkouts
                whereConditions.push({ userId });
            }
        }

        // Apply filters
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
            whereConditions.push({ createdAt: { gte: new Date(filterDto.createdFrom) } });
        }

        if (filterDto.createdTo) {
            whereConditions.push({ createdAt: { lte: new Date(filterDto.createdTo) } });
        }

        const whereClause: Prisma.CheckoutWhereInput = {
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

        const checkoutDtos = checkouts.map(checkout => {
            const calculation = this.calculateCheckoutPricing(
                checkout.cart.items,
                checkout.shippingAddress,
                checkout.billingAddress,
            );
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

    // ==================== APPROVAL WORKFLOW ====================

    async getApprovalRequirement(userId: string, totalAmount: number, companyId?: string): Promise<ApprovalRequirementDto> {
        return this.checkApprovalRequirement(userId, totalAmount, companyId);
    }

    private async checkApprovalRequirement(userId: string, totalAmount: number, companyId?: string): Promise<ApprovalRequirementDto> {
        // Get user approval limit (simplified - in reality this would be more complex)
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                companies: {
                    where: companyId ? { companyId } : undefined,
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Default approval limits based on role (simplified)
        const userApprovalLimit = this.getUserApprovalLimit(user);
        const required = totalAmount > userApprovalLimit;

        const eligibleApprovers = await this.getEligibleApprovers(totalAmount, companyId);

        return {
            required,
            reason: required ? `Order total exceeds user approval limit of $${userApprovalLimit}` : 'No approval required',
            userApprovalLimit,
            orderTotal: totalAmount,
            requiredLevel: required ? 'manager' : 'self',
            eligibleApprovers,
        };
    }

    private async checkApprovalAuthority(userId: string, amount: number, companyId?: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return false;
        }

        const userApprovalLimit = this.getUserApprovalLimit(user);
        return amount <= userApprovalLimit;
    }

    private getUserApprovalLimit(user: any): number {
        // Simplified approval limits based on role
        if (user.roles.includes('SystemAdmin')) return 1000000;
        if (user.roles.includes('MerchantAdmin')) return 50000;
        if (user.roles.includes('MerchantUser')) return 10000;
        if (user.roles.includes('Buyer')) return 1000;
        return 500; // Default
    }

    private async getEligibleApprovers(amount: number, companyId?: string) {
        // Simplified - get users with sufficient approval limits
        const users = await this.prisma.user.findMany({
            where: {
                companies: companyId ? {
                    some: { companyId }
                } : undefined,
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
            .filter(user => this.getUserApprovalLimit(user) >= amount)
            .map(user => ({
                userId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                approvalLimit: this.getUserApprovalLimit(user),
            }));
    }

    // ==================== CALCULATION METHODS ====================

    private calculateCheckoutPricing(items: any[], shippingAddress: any, billingAddress: any): CheckoutCalculationDto {
        const subtotal = items.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0);

        // Simplified tax calculation (8.5% for example)
        const taxRate = 0.085;
        const taxAmount = subtotal * taxRate;

        // Simplified shipping calculation
        const shippingAmount = subtotal > 500 ? 0 : 49.99;

        // Simplified discount calculation
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
            appliedDiscounts: discountAmount > 0 ? [{
                type: 'volume_discount',
                description: 'Volume discount (>$2000)',
                amount: parseFloat(discountAmount.toFixed(2)),
                percentage: 5.0,
            }] : [],
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

    // ==================== NOTIFICATION METHODS ====================

    private async sendApprovalNotification(checkout: any): Promise<void> {
        try {
            const eligibleApprovers = await this.getEligibleApprovers(
                parseFloat(checkout.totalAmount.toString()),
                checkout.companyId,
            );

            // Send email notifications to eligible approvers
            const approverEmails = eligibleApprovers.map(approver => approver.email);
            if (approverEmails.length > 0) {
                await this.notificationService.sendEmail({
                    to: approverEmails.map(email => ({ email })),
                    subject: 'Checkout Approval Required',
                    text: `A checkout worth $${checkout.totalAmount} requires your approval`,
                    html: `<h2>Checkout Approval Required</h2><p>A checkout worth $${checkout.totalAmount} requires your approval</p>`,
                });
            }
        } catch (error) {
            this.logger.error('Failed to send approval notification:', error);
        }
    }

    private async sendApprovalDecisionNotification(checkout: any, approved: boolean): Promise<void> {
        try {
            // Send email notification to requester
            if (checkout.user?.email) {
                await this.notificationService.sendEmail({
                    to: [{ email: checkout.user.email }],
                    subject: `Checkout ${approved ? 'Approved' : 'Rejected'}`,
                    text: `Your checkout worth $${checkout.totalAmount} has been ${approved ? 'approved' : 'rejected'}`,
                    html: `<h2>Checkout ${approved ? 'Approved' : 'Rejected'}</h2><p>Your checkout worth $${checkout.totalAmount} has been ${approved ? 'approved' : 'rejected'}</p>`,
                });
            }
        } catch (error) {
            this.logger.error('Failed to send approval decision notification:', error);
        }
    }

    // ==================== HELPER METHODS ====================

    private async validateCheckoutAccess(checkoutId: string, userId: string) {
        const checkout = await this.prisma.checkout.findFirst({
            where: {
                id: checkoutId,
                userId,
            },
        });

        if (!checkout) {
            throw new NotFoundException('Checkout not found');
        }

        if (checkout.status === CheckoutStatus.COMPLETED || checkout.status === CheckoutStatus.CANCELLED) {
            throw new BadRequestException('Cannot modify completed or cancelled checkout');
        }

        return checkout;
    }

    private getCheckoutIncludeOptions() {
        return {
            user: true,
            company: true,
            cart: {
                include: {
                    items: {
                        where: { status: 'ACTIVE' as any },
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

    private mapCheckoutToResponseDto(checkout: any, calculation: CheckoutCalculationDto): CheckoutResponseDto {
        return {
            id: checkout.id,
            cartId: checkout.cartId,
            userId: checkout.userId,
            company: checkout.company ? {
                id: checkout.company.id,
                name: checkout.company.name,
                domain: checkout.company.domain,
            } : undefined,
            shippingAddress: checkout.shippingAddress ? this.mapAddressToResponseDto(checkout.shippingAddress) : undefined,
            billingAddress: checkout.billingAddress ? this.mapAddressToResponseDto(checkout.billingAddress) : undefined,
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
