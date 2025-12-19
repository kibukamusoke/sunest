import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { OrderStatus, ProductReviewStatus } from '@prisma/client';
import {
  CreateOrUpdateProductReviewDto,
  MerchantProductReviewListDto,
  MerchantProductReviewResponseDto,
  MerchantReplyToReviewDto,
  ProductReviewEligibilityResponseDto,
  ProductReviewListDto,
  ProductReviewResponseDto,
  ProductReviewSummaryDto,
} from './dto';

@Injectable()
export class ProductReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private toAuthorDisplayName(user: {
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }): string | undefined {
    if (user.displayName) return user.displayName;
    const full =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined;
    if (full) return full;
    if (user.email) return user.email.split('@')[0];
    return undefined;
  }

  private toReviewDto(review: any): ProductReviewResponseDto {
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

  private toMerchantReviewDto(review: any): MerchantProductReviewResponseDto {
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

  async getEligibility(
    userId: string,
    productId: string,
  ): Promise<ProductReviewEligibilityResponseDto> {
    const existing = await this.prisma.productReview.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true },
    });

    const deliveredOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DELIVERED,
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

  async createOrUpdateReview(
    userId: string,
    productId: string,
    dto: CreateOrUpdateProductReviewDto,
  ): Promise<ProductReviewResponseDto> {
    // Ensure product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Proof of purchase: delivered order containing this product
    const deliveredOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DELIVERED,
        items: { some: { productId } },
      },
      select: { id: true },
    });
    if (!deliveredOrder) {
      throw new ForbiddenException(
        'You can only review products from orders that have been delivered.',
      );
    }

    // Resolve file IDs -> public URLs (only allow user-owned uploaded files)
    let photoUrls: string[] | undefined;
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
        throw new BadRequestException(
          'One or more photo files are invalid, not uploaded, or not owned by you.',
        );
      }

      const urls = files.map((f) => f.url).filter(Boolean) as string[];
      if (urls.length !== files.length) {
        throw new BadRequestException(
          'One or more photo files are missing a public URL. Please re-upload and confirm upload.',
        );
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
        status: ProductReviewStatus.PUBLISHED,
      },
      update: {
        orderId: deliveredOrder.id,
        rating: dto.rating,
        title: dto.title?.trim() || null,
        body: dto.body?.trim() || null,
        photos: photoUrls ?? [],
        status: ProductReviewStatus.PUBLISHED,
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

  async getMyReview(
    userId: string,
    productId: string,
  ): Promise<ProductReviewResponseDto | null> {
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

  async listProductReviews(
    productId: string,
    page = 1,
    limit = 10,
  ): Promise<ProductReviewListDto> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const where = {
      productId,
      status: ProductReviewStatus.PUBLISHED,
    } as const;

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

  async getProductReviewSummary(productId: string): Promise<ProductReviewSummaryDto> {
    const where = {
      productId,
      status: ProductReviewStatus.PUBLISHED,
    } as const;

    type RatingGroupRow = { rating: number; _count: { _all: number } };

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

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const g of grouped as unknown as RatingGroupRow[]) {
      ratingCounts[g.rating] = g._count?._all ?? 0;
    }

    return {
      averageRating: Number(agg._avg.rating || 0),
      totalReviews: agg._count._all,
      ratingCounts,
    };
  }

  async listMerchantReviews(params: {
    merchantId: string;
    productId?: string;
    search?: string;
    unrepliedOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<MerchantProductReviewListDto> {
    const safePage = Math.max(1, params.page || 1);
    const safeLimit = Math.min(50, Math.max(1, params.limit || 10));
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      status: ProductReviewStatus.PUBLISHED,
      product: {
        merchantId: params.merchantId,
      },
    };
    if (params.productId) where.productId = params.productId;
    if (params.unrepliedOnly) where.merchantReply = null;

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

  async merchantReplyToReview(params: {
    merchantId: string;
    merchantUserId: string;
    reviewId: string;
    dto: MerchantReplyToReviewDto;
  }): Promise<MerchantProductReviewResponseDto> {
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

    if (!existing) throw new NotFoundException('Review not found');

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
}


