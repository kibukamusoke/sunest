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
exports.RFQManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let RFQManagementService = class RFQManagementService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createRFQ(createRFQDto, userId) {
        const rfqNumber = await this.generateRFQNumber();
        const requirementsJson = createRFQDto.requirements
            ? JSON.stringify(createRFQDto.requirements)
            : null;
        const rfq = await this.prisma.rFQ.create({
            data: {
                rfqNumber,
                title: createRFQDto.title,
                description: createRFQDto.description,
                requesterId: userId,
                companyId: createRFQDto.companyId,
                urgencyLevel: createRFQDto.urgencyLevel,
                expectedDelivery: createRFQDto.expectedDelivery
                    ? new Date(createRFQDto.expectedDelivery)
                    : null,
                deliveryLocation: createRFQDto.deliveryLocation,
                deadline: createRFQDto.deadline
                    ? new Date(createRFQDto.deadline)
                    : null,
                requirements: requirementsJson,
                attachments: createRFQDto.attachments || [],
                status: client_1.RFQStatus.DRAFT,
                items: {
                    create: createRFQDto.items.map((item) => ({
                        productId: item.productId,
                        customProductName: item.customProductName,
                        customSku: item.customSku,
                        category: item.category,
                        brand: item.brand,
                        model: item.model,
                        specifications: JSON.stringify(item.specifications),
                        technicalDrawing: item.technicalDrawing,
                        quantities: item.quantities,
                        targetPrice: item.targetPrice,
                        budgetRange: item.budgetRange,
                        deliveryDate: item.deliveryDate
                            ? new Date(item.deliveryDate)
                            : null,
                        qualityStandards: item.qualityStandards,
                        notes: item.notes,
                        priority: item.priority || 1,
                    })),
                },
            },
            include: this.getRFQInclude(),
        });
        return this.mapToRFQResponse(rfq);
    }
    async getRFQById(rfqId, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
            include: this.getRFQInclude(),
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        await this.checkRFQAccess(rfq, userId);
        return this.mapToRFQResponse(rfq);
    }
    async updateRFQ(rfqId, updateRFQDto, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
            include: { requester: true },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        if (rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Only the requester can update this RFQ');
        }
        if (rfq.status !== client_1.RFQStatus.DRAFT) {
            throw new common_1.BadRequestException('Can only update RFQs in DRAFT status');
        }
        const requirementsJson = updateRFQDto.requirements
            ? JSON.stringify(updateRFQDto.requirements)
            : undefined;
        const updatedRFQ = await this.prisma.rFQ.update({
            where: { id: rfqId },
            data: {
                title: updateRFQDto.title,
                description: updateRFQDto.description,
                urgencyLevel: updateRFQDto.urgencyLevel,
                expectedDelivery: updateRFQDto.expectedDelivery
                    ? new Date(updateRFQDto.expectedDelivery)
                    : undefined,
                deliveryLocation: updateRFQDto.deliveryLocation,
                deadline: updateRFQDto.deadline
                    ? new Date(updateRFQDto.deadline)
                    : undefined,
                requirements: requirementsJson,
                attachments: updateRFQDto.attachments,
            },
            include: this.getRFQInclude(),
        });
        return this.mapToRFQResponse(updatedRFQ);
    }
    async deleteRFQ(rfqId, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
            include: { requester: true },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        if (rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Only the requester can delete this RFQ');
        }
        if (rfq.status !== client_1.RFQStatus.DRAFT) {
            throw new common_1.BadRequestException('Can only delete RFQs in DRAFT status');
        }
        await this.prisma.rFQ.update({
            where: { id: rfqId },
            data: { isActive: false },
        });
    }
    async submitRFQ(rfqId, submitDto, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
            include: {
                requester: true,
                items: true,
            },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        if (rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Only the requester can submit this RFQ');
        }
        if (rfq.status !== client_1.RFQStatus.DRAFT) {
            throw new common_1.BadRequestException('Can only submit RFQs in DRAFT status');
        }
        if (rfq.items.length === 0) {
            throw new common_1.BadRequestException('RFQ must have at least one item');
        }
        const submittedRFQ = await this.prisma.rFQ.update({
            where: { id: rfqId },
            data: {
                status: client_1.RFQStatus.SUBMITTED,
                submittedAt: new Date(),
                deadline: submitDto.deadline
                    ? new Date(submitDto.deadline)
                    : rfq.deadline,
            },
            include: this.getRFQInclude(),
        });
        await this.notifyMerchantsOfNewRFQ(submittedRFQ);
        return this.mapToRFQResponse(submittedRFQ);
    }
    async listRFQs(filterDto, userId, userRoles) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 10;
        const skip = (page - 1) * limit;
        const take = limit;
        const whereClause = await this.buildRFQWhereClause(filterDto, userId, userRoles);
        const [rfqs, total] = await Promise.all([
            this.prisma.rFQ.findMany({
                where: whereClause,
                include: this.getRFQInclude(),
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.rFQ.count({ where: whereClause }),
        ]);
        const mappedRFQs = rfqs.map((rfq) => this.mapToRFQResponse(rfq));
        return {
            rfqs: mappedRFQs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        };
    }
    async createQuote(createQuoteDto, merchantId, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: createQuoteDto.rfqId },
            include: { items: true },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        if (rfq.status !== client_1.RFQStatus.SUBMITTED &&
            rfq.status !== client_1.RFQStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('RFQ is not available for quoting');
        }
        if (rfq.deadline && new Date() > rfq.deadline) {
            throw new common_1.BadRequestException('RFQ deadline has passed');
        }
        const existingQuote = await this.prisma.quote.findFirst({
            where: {
                rfqId: createQuoteDto.rfqId,
                merchantId,
                isActive: true,
            },
        });
        if (existingQuote) {
            throw new common_1.BadRequestException('A quote for this RFQ already exists. Use update or create a revision.');
        }
        const quoteNumber = await this.generateQuoteNumber();
        const { subtotal, totalAmount } = this.calculateQuoteTotals(createQuoteDto.items, createQuoteDto.discountAmount, createQuoteDto.taxAmount, createQuoteDto.shippingAmount);
        const quote = await this.prisma.quote.create({
            data: {
                quoteNumber,
                rfqId: createQuoteDto.rfqId,
                merchantId,
                totalAmount,
                currency: createQuoteDto.currency || 'USD',
                validUntil: new Date(createQuoteDto.validUntil),
                paymentTerms: createQuoteDto.paymentTerms,
                deliveryTerms: createQuoteDto.deliveryTerms,
                warrantyTerms: createQuoteDto.warrantyTerms,
                leadTime: createQuoteDto.leadTime,
                status: client_1.QuoteStatus.DRAFT,
                subtotal,
                discountAmount: createQuoteDto.discountAmount,
                taxAmount: createQuoteDto.taxAmount,
                shippingAmount: createQuoteDto.shippingAmount,
                notes: createQuoteDto.notes,
                customerNotes: createQuoteDto.customerNotes,
                attachments: createQuoteDto.attachments || [],
                items: {
                    create: createQuoteDto.items.map((item) => ({
                        rfqItemId: item.rfqItemId,
                        productId: item.productId,
                        quantityPricing: JSON.stringify(item.quantityPricing),
                        description: item.description,
                        specifications: item.specifications
                            ? JSON.stringify(item.specifications)
                            : null,
                        leadTime: item.leadTime,
                        suggestedAlternatives: item.suggestedAlternatives
                            ? JSON.stringify(item.suggestedAlternatives)
                            : null,
                        notes: item.notes,
                    })),
                },
            },
            include: this.getQuoteInclude(),
        });
        return this.mapToQuoteResponse(quote);
    }
    async submitQuote(quoteId, merchantId, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                merchant: true,
                rfq: { include: { requester: true } },
                items: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.merchantId !== merchantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (quote.status !== client_1.QuoteStatus.DRAFT) {
            throw new common_1.BadRequestException('Can only submit quotes in DRAFT status');
        }
        if (quote.items.length === 0) {
            throw new common_1.BadRequestException('Quote must have at least one item');
        }
        const submittedQuote = await this.prisma.quote.update({
            where: { id: quoteId },
            data: {
                status: client_1.QuoteStatus.SUBMITTED,
                submittedAt: new Date(),
                respondedAt: new Date(),
            },
            include: this.getQuoteInclude(),
        });
        await this.updateRFQStatusOnQuoteSubmission(quote.rfqId);
        await this.notifyRequesterOfNewQuote(submittedQuote);
        return this.mapToQuoteResponse(submittedQuote);
    }
    async acceptQuote(quoteId, acceptDto, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                rfq: { include: { requester: true } },
                merchant: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Only the RFQ requester can accept this quote');
        }
        if (quote.status !== client_1.QuoteStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Can only accept submitted quotes');
        }
        if (new Date() > quote.validUntil) {
            throw new common_1.BadRequestException('Quote has expired');
        }
        const acceptedQuote = await this.prisma.quote.update({
            where: { id: quoteId },
            data: {
                status: client_1.QuoteStatus.ACCEPTED,
                customerNotes: acceptDto.acceptanceNotes
                    ? `${quote.customerNotes || ''}\n\nAcceptance Notes: ${acceptDto.acceptanceNotes}`.trim()
                    : quote.customerNotes,
            },
            include: this.getQuoteInclude(),
        });
        await this.prisma.rFQ.update({
            where: { id: quote.rfqId },
            data: { status: client_1.RFQStatus.QUOTE_SELECTED },
        });
        await this.notifyMerchantOfQuoteAcceptance(acceptedQuote);
        return this.mapToQuoteResponse(acceptedQuote);
    }
    async rejectQuote(quoteId, rejectDto, userId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                rfq: { include: { requester: true } },
                merchant: true,
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.rfq.requesterId !== userId) {
            throw new common_1.ForbiddenException('Only the RFQ requester can reject this quote');
        }
        if (quote.status !== client_1.QuoteStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Can only reject submitted quotes');
        }
        const rejectedQuote = await this.prisma.quote.update({
            where: { id: quoteId },
            data: {
                status: client_1.QuoteStatus.REJECTED,
                customerNotes: `${quote.customerNotes || ''}\n\nRejection Reason: ${rejectDto.rejectionReason}${rejectDto.feedback ? `\nFeedback: ${rejectDto.feedback}` : ''}`.trim(),
            },
            include: this.getQuoteInclude(),
        });
        await this.notifyMerchantOfQuoteRejection(rejectedQuote, rejectDto.rejectionReason);
        return this.mapToQuoteResponse(rejectedQuote);
    }
    async listQuotes(filterDto, userId, userRoles) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 10;
        const skip = (page - 1) * limit;
        const take = limit;
        if (filterDto.rfqId) {
            const rfq = await this.prisma.rFQ.findUnique({
                where: { id: filterDto.rfqId },
            });
            if (!rfq) {
                throw new common_1.NotFoundException('RFQ not found');
            }
            await this.checkRFQAccess(rfq, userId);
        }
        const whereClause = await this.buildQuoteWhereClause(filterDto, userId, userRoles);
        const [quotes, total] = await Promise.all([
            this.prisma.quote.findMany({
                where: whereClause,
                include: this.getQuoteInclude(),
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.quote.count({ where: whereClause }),
        ]);
        const mappedQuotes = quotes.map((quote) => this.mapToQuoteResponse(quote));
        return {
            quotes: mappedQuotes,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        };
    }
    async addRFQComment(rfqId, commentDto, userId) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
            include: { requester: true },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        await this.checkRFQAccess(rfq, userId);
        const comment = await this.prisma.rFQComment.create({
            data: {
                rfqId,
                authorId: userId,
                content: commentDto.content,
                isInternal: commentDto.isInternal || false,
                attachments: commentDto.attachments || [],
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return this.mapToRFQCommentResponse(comment);
    }
    async getRFQComments(rfqId, userId, includeInternal = false) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: rfqId },
        });
        if (!rfq) {
            throw new common_1.NotFoundException('RFQ not found');
        }
        await this.checkRFQAccess(rfq, userId);
        const whereClause = {
            rfqId,
            ...(includeInternal ? {} : { isInternal: false }),
        };
        const [comments, total, publicCount] = await Promise.all([
            this.prisma.rFQComment.findMany({
                where: whereClause,
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.rFQComment.count({ where: whereClause }),
            this.prisma.rFQComment.count({ where: { rfqId, isInternal: false } }),
        ]);
        return {
            comments: comments.map((comment) => this.mapToRFQCommentResponse(comment)),
            total,
            publicCount,
            internalCount: total - publicCount,
        };
    }
    async generateRFQNumber() {
        const year = new Date().getFullYear();
        const count = await this.prisma.rFQ.count({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
            },
        });
        return `RFQ-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    async generateQuoteNumber() {
        const year = new Date().getFullYear();
        const count = await this.prisma.quote.count({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
            },
        });
        return `QUO-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    getRFQInclude() {
        return {
            requester: {
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
                            brand: true,
                            model: true,
                        },
                    },
                },
            },
            quotes: {
                select: {
                    id: true,
                    status: true,
                },
            },
        };
    }
    getQuoteInclude() {
        return {
            rfq: {
                select: {
                    id: true,
                    rfqNumber: true,
                    title: true,
                    status: true,
                },
            },
            merchant: {
                select: {
                    id: true,
                    name: true,
                    displayName: true,
                    businessType: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            sku: true,
                            brand: true,
                            model: true,
                        },
                    },
                },
            },
        };
    }
    mapToRFQResponse(rfq) {
        return {
            id: rfq.id,
            rfqNumber: rfq.rfqNumber,
            title: rfq.title,
            description: rfq.description,
            requester: rfq.requester,
            company: rfq.company,
            urgencyLevel: rfq.urgencyLevel,
            expectedDelivery: rfq.expectedDelivery?.toISOString(),
            deliveryLocation: rfq.deliveryLocation,
            status: rfq.status,
            submittedAt: rfq.submittedAt?.toISOString(),
            deadline: rfq.deadline?.toISOString(),
            requirements: rfq.requirements ? JSON.parse(rfq.requirements) : undefined,
            attachments: rfq.attachments,
            items: rfq.items.map((item) => ({
                id: item.id,
                rfqId: item.rfqId,
                productId: item.productId,
                product: item.product,
                customProductName: item.customProductName,
                customSku: item.customSku,
                category: item.category,
                brand: item.brand,
                model: item.model,
                specifications: JSON.parse(item.specifications),
                technicalDrawing: item.technicalDrawing,
                quantities: item.quantities,
                targetPrice: item.targetPrice?.toString(),
                budgetRange: item.budgetRange,
                deliveryDate: item.deliveryDate?.toISOString(),
                qualityStandards: item.qualityStandards,
                notes: item.notes,
                priority: item.priority,
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
            })),
            quoteCount: rfq.quotes?.length || 0,
            isActive: rfq.isActive,
            createdAt: rfq.createdAt.toISOString(),
            updatedAt: rfq.updatedAt.toISOString(),
        };
    }
    mapToQuoteResponse(quote) {
        return {
            id: quote.id,
            quoteNumber: quote.quoteNumber,
            rfqId: quote.rfqId,
            rfq: quote.rfq,
            merchant: quote.merchant,
            totalAmount: quote.totalAmount.toString(),
            currency: quote.currency,
            validUntil: quote.validUntil.toISOString(),
            paymentTerms: quote.paymentTerms,
            deliveryTerms: quote.deliveryTerms,
            warrantyTerms: quote.warrantyTerms,
            leadTime: quote.leadTime,
            status: quote.status,
            submittedAt: quote.submittedAt?.toISOString(),
            respondedAt: quote.respondedAt?.toISOString(),
            subtotal: quote.subtotal.toString(),
            discountAmount: quote.discountAmount?.toString(),
            taxAmount: quote.taxAmount?.toString(),
            shippingAmount: quote.shippingAmount?.toString(),
            customerNotes: quote.customerNotes,
            attachments: quote.attachments,
            version: quote.version,
            parentQuoteId: quote.parentQuoteId,
            items: quote.items.map((item) => ({
                id: item.id,
                quoteId: item.quoteId,
                rfqItemId: item.rfqItemId,
                productId: item.productId,
                product: item.product,
                quantityPricing: JSON.parse(item.quantityPricing),
                description: item.description,
                specifications: item.specifications
                    ? JSON.parse(item.specifications)
                    : undefined,
                leadTime: item.leadTime,
                suggestedAlternatives: item.suggestedAlternatives
                    ? JSON.parse(item.suggestedAlternatives)
                    : undefined,
                notes: item.notes,
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
            })),
            isActive: quote.isActive,
            createdAt: quote.createdAt.toISOString(),
            updatedAt: quote.updatedAt.toISOString(),
        };
    }
    mapToRFQCommentResponse(comment) {
        return {
            id: comment.id,
            rfqId: comment.rfqId,
            author: comment.author,
            content: comment.content,
            isInternal: comment.isInternal,
            attachments: comment.attachments,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        };
    }
    calculateQuoteTotals(items, discountAmount, taxAmount, shippingAmount) {
        const subtotal = new library_1.Decimal(0);
        const discount = discountAmount || new library_1.Decimal(0);
        const tax = taxAmount || new library_1.Decimal(0);
        const shipping = shippingAmount || new library_1.Decimal(0);
        const totalAmount = subtotal.minus(discount).plus(tax).plus(shipping);
        return { subtotal, totalAmount };
    }
    async checkRFQAccess(rfq, userId) {
        if (rfq.requesterId !== userId) {
        }
    }
    async buildRFQWhereClause(filterDto, userId, userRoles) {
        const whereClause = {
            isActive: true,
        };
        if (userRoles.includes('buyer')) {
            whereClause.requesterId = userId;
        }
        if (filterDto.status) {
            whereClause.status = filterDto.status;
        }
        if (filterDto.urgencyLevel) {
            whereClause.urgencyLevel = filterDto.urgencyLevel;
        }
        if (filterDto.companyId) {
            whereClause.companyId = filterDto.companyId;
        }
        if (filterDto.search) {
            whereClause.OR = [
                { title: { contains: filterDto.search, mode: 'insensitive' } },
                { description: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }
        return whereClause;
    }
    async buildQuoteWhereClause(filterDto, userId, userRoles) {
        const whereClause = {
            isActive: true,
        };
        if (userRoles.includes('buyer')) {
            whereClause.rfq = {
                requesterId: userId,
            };
        }
        else if (userRoles.includes('merchant_admin') ||
            userRoles.includes('merchant_user')) {
            const userMerchants = await this.prisma.userMerchant.findMany({
                where: {
                    userId,
                    isActive: true,
                },
                select: {
                    merchantId: true,
                },
            });
            if (userMerchants.length > 0) {
                const merchantIds = userMerchants.map((um) => um.merchantId);
                whereClause.merchantId = { in: merchantIds };
            }
            else {
                whereClause.merchantId = '00000000-0000-0000-0000-000000000000';
            }
        }
        if (filterDto.rfqId) {
            whereClause.rfqId = filterDto.rfqId;
        }
        if (filterDto.status) {
            whereClause.status = filterDto.status;
        }
        if (filterDto.merchantId) {
            whereClause.merchantId = filterDto.merchantId;
        }
        if (filterDto.submittedFrom || filterDto.submittedTo) {
            whereClause.submittedAt = {};
            if (filterDto.submittedFrom) {
                whereClause.submittedAt.gte = new Date(filterDto.submittedFrom);
            }
            if (filterDto.submittedTo) {
                whereClause.submittedAt.lte = new Date(filterDto.submittedTo);
            }
        }
        if (filterDto.validFrom || filterDto.validTo) {
            whereClause.validUntil = {};
            if (filterDto.validFrom) {
                whereClause.validUntil.gte = new Date(filterDto.validFrom);
            }
            if (filterDto.validTo) {
                whereClause.validUntil.lte = new Date(filterDto.validTo);
            }
        }
        if (filterDto.minAmount || filterDto.maxAmount) {
            whereClause.totalAmount = {};
            if (filterDto.minAmount) {
                whereClause.totalAmount.gte = new library_1.Decimal(filterDto.minAmount);
            }
            if (filterDto.maxAmount) {
                whereClause.totalAmount.lte = new library_1.Decimal(filterDto.maxAmount);
            }
        }
        return whereClause;
    }
    async updateRFQStatusOnQuoteSubmission(rfqId) {
        const quoteCount = await this.prisma.quote.count({
            where: { rfqId, isActive: true },
        });
        if (quoteCount === 1) {
            await this.prisma.rFQ.update({
                where: { id: rfqId },
                data: { status: client_1.RFQStatus.QUOTES_RECEIVED },
            });
        }
    }
    async notifyMerchantsOfNewRFQ(rfq) {
        console.log(`New RFQ ${rfq.rfqNumber} available for quotes`);
    }
    async notifyRequesterOfNewQuote(quote) {
        console.log(`New quote ${quote.quoteNumber} received for RFQ ${quote.rfq.rfqNumber}`);
    }
    async notifyMerchantOfQuoteAcceptance(quote) {
        console.log(`Quote ${quote.quoteNumber} has been accepted`);
    }
    async notifyMerchantOfQuoteRejection(quote, reason) {
        console.log(`Quote ${quote.quoteNumber} has been rejected: ${reason}`);
    }
};
exports.RFQManagementService = RFQManagementService;
exports.RFQManagementService = RFQManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], RFQManagementService);
//# sourceMappingURL=rfq-management.service.js.map