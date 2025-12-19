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
exports.ProductReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
let ProductReviewsService = class ProductReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toAuthorDisplayName(user) {
        if (user.displayName)
            return user.displayName;
        const full = `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined;
        if (full)
            return full;
        if (user.email)
            return user.email.split('@')[0];
        return undefined;
    }
    toReviewDto(review) {
        const user = review.user;
        return {
            id: review.id,
            productId: review.productId,
            rating: review.rating,
            title: review.title ?? undefined,
            body: review.body ?? undefined,
            photos: review.photos || [],
            author: {
                id: user.id,
                displayName: this.toAuthorDisplayName(user),
                avatarUrl: user.profilePictureUrl || user.avatar || undefined,
            },
            merchantReply: review.merchantReply ?? undefined,
            merchantRepliedAt: review.merchantRepliedAt ?? undefined,
            merchantReplyUpdatedAt: review.merchantReplyUpdatedAt ?? undefined,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        };
    }
    toMerchantReviewDto(review) {
        return {
            ...this.toReviewDto(review),
            product: {
                id: review.product.id,
                name: review.product.displayName || review.product.name,
                sku: review.product.sku ?? undefined,
                imageUrl: review.product.images?.[0] ?? undefined,
            },
        };
    }
    async getEligibility(userId, productId) {
        const existing = await this.prisma.productReview.findUnique({
            where: { userId_productId: { userId, productId } },
            select: { id: true },
        });
        const deliveredOrder = await this.prisma.order.findFirst({
            where: {
                userId,
                status: client_1.OrderStatus.DELIVERED,
                items: { some: { productId } },
            },
            select: { id: true },
        });
        if (!deliveredOrder) {
            return {
                eligible: false,
                reason: 'You can only review products from orders that have been delivered.',
                existingReviewId: existing?.id,
            };
        }
        return { eligible: true, existingReviewId: existing?.id };
    }
    async createOrUpdateReview(userId, productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const deliveredOrder = await this.prisma.order.findFirst({
            where: {
                userId,
                status: client_1.OrderStatus.DELIVERED,
                items: { some: { productId } },
            },
            select: { id: true },
        });
        if (!deliveredOrder) {
            throw new common_1.ForbiddenException('You can only review products from orders that have been delivered.');
        }
        let photoUrls;
        if (dto.photoFileIds?.length) {
            const files = await this.prisma.file.findMany({
                where: {
                    id: { in: dto.photoFileIds },
                    userId,
                    status: 'UPLOADED',
                },
                select: { id: true, url: true },
            });
            if (files.length !== dto.photoFileIds.length) {
                throw new common_1.BadRequestException('One or more photo files are invalid, not uploaded, or not owned by you.');
            }
            const urls = files.map((f) => f.url).filter(Boolean);
            if (urls.length !== files.length) {
                throw new common_1.BadRequestException('One or more photo files are missing a public URL. Please re-upload and confirm upload.');
            }
            photoUrls = urls;
        }
        const review = await this.prisma.productReview.upsert({
            where: { userId_productId: { userId, productId } },
            create: {
                productId,
                userId,
                orderId: deliveredOrder.id,
                rating: dto.rating,
                title: dto.title?.trim() || null,
                body: dto.body?.trim() || null,
                photos: photoUrls ?? [],
                status: client_1.ProductReviewStatus.PUBLISHED,
            },
            update: {
                orderId: deliveredOrder.id,
                rating: dto.rating,
                title: dto.title?.trim() || null,
                body: dto.body?.trim() || null,
                photos: photoUrls ?? [],
                status: client_1.ProductReviewStatus.PUBLISHED,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        profilePictureUrl: true,
                    },
                },
            },
        });
        return this.toReviewDto(review);
    }
    async getMyReview(userId, productId) {
        const review = await this.prisma.productReview.findUnique({
            where: { userId_productId: { userId, productId } },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        profilePictureUrl: true,
                    },
                },
            },
        });
        return review ? this.toReviewDto(review) : null;
    }
    async listProductReviews(productId, page = 1, limit = 10) {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(50, Math.max(1, limit));
        const skip = (safePage - 1) * safeLimit;
        const where = {
            productId,
            status: client_1.ProductReviewStatus.PUBLISHED,
        };
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.productReview.count({ where }),
            this.prisma.productReview.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: safeLimit,
                include: {
                    user: {
                        select: {
                            id: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            avatar: true,
                            profilePictureUrl: true,
                        },
                    },
                },
            }),
        ]);
        const totalPages = Math.max(1, Math.ceil(total / safeLimit));
        return {
            reviews: rows.map((r) => this.toReviewDto(r)),
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages,
            },
        };
    }
    async getProductReviewSummary(productId) {
        const where = {
            productId,
            status: client_1.ProductReviewStatus.PUBLISHED,
        };
        const [agg, grouped] = await this.prisma.$transaction([
            this.prisma.productReview.aggregate({
                where,
                _avg: { rating: true },
                _count: { _all: true },
            }),
            this.prisma.productReview.groupBy({
                by: ['rating'],
                where,
                orderBy: { rating: 'asc' },
                _count: { _all: true },
            }),
        ]);
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const g of grouped) {
            ratingCounts[g.rating] = g._count?._all ?? 0;
        }
        return {
            averageRating: Number(agg._avg.rating || 0),
            totalReviews: agg._count._all,
            ratingCounts,
        };
    }
    async listMerchantReviews(params) {
        const safePage = Math.max(1, params.page || 1);
        const safeLimit = Math.min(50, Math.max(1, params.limit || 10));
        const skip = (safePage - 1) * safeLimit;
        const where = {
            status: client_1.ProductReviewStatus.PUBLISHED,
            product: {
                merchantId: params.merchantId,
            },
        };
        if (params.productId)
            where.productId = params.productId;
        if (params.unrepliedOnly)
            where.merchantReply = null;
        const q = params.search?.trim();
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { body: { contains: q, mode: 'insensitive' } },
                { user: { displayName: { contains: q, mode: 'insensitive' } } },
                { user: { firstName: { contains: q, mode: 'insensitive' } } },
                { user: { lastName: { contains: q, mode: 'insensitive' } } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                { product: { name: { contains: q, mode: 'insensitive' } } },
                { product: { displayName: { contains: q, mode: 'insensitive' } } },
                { product: { sku: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.productReview.count({ where }),
            this.prisma.productReview.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: safeLimit,
                include: {
                    user: {
                        select: {
                            id: true,
                            displayName: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            avatar: true,
                            profilePictureUrl: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            sku: true,
                            images: true,
                            merchantId: true,
                        },
                    },
                },
            }),
        ]);
        const totalPages = Math.max(1, Math.ceil(total / safeLimit));
        return {
            reviews: rows.map((r) => this.toMerchantReviewDto(r)),
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages,
            },
        };
    }
    async merchantReplyToReview(params) {
        const existing = await this.prisma.productReview.findFirst({
            where: {
                id: params.reviewId,
                product: { merchantId: params.merchantId },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        profilePictureUrl: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        sku: true,
                        images: true,
                        merchantId: true,
                    },
                },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Review not found');
        const body = params.dto.body.trim();
        const now = new Date();
        const isFirstReply = !existing.merchantRepliedAt;
        const updated = await this.prisma.productReview.update({
            where: { id: params.reviewId },
            data: {
                merchantReply: body,
                merchantReplyById: params.merchantUserId,
                merchantRepliedAt: isFirstReply ? now : existing.merchantRepliedAt,
                merchantReplyUpdatedAt: now,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        profilePictureUrl: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        sku: true,
                        images: true,
                        merchantId: true,
                    },
                },
            },
        });
        return this.toMerchantReviewDto(updated);
    }
};
exports.ProductReviewsService = ProductReviewsService;
exports.ProductReviewsService = ProductReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductReviewsService);
//# sourceMappingURL=product-reviews.service.js.map