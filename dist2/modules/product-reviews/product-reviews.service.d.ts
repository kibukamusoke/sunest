import { PrismaService } from '../../config/prisma.service';
import { CreateOrUpdateProductReviewDto, MerchantProductReviewListDto, MerchantProductReviewResponseDto, MerchantReplyToReviewDto, ProductReviewEligibilityResponseDto, ProductReviewListDto, ProductReviewResponseDto, ProductReviewSummaryDto } from './dto';
export declare class ProductReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toAuthorDisplayName;
    private toReviewDto;
    private toMerchantReviewDto;
    getEligibility(userId: string, productId: string): Promise<ProductReviewEligibilityResponseDto>;
    createOrUpdateReview(userId: string, productId: string, dto: CreateOrUpdateProductReviewDto): Promise<ProductReviewResponseDto>;
    getMyReview(userId: string, productId: string): Promise<ProductReviewResponseDto | null>;
    listProductReviews(productId: string, page?: number, limit?: number): Promise<ProductReviewListDto>;
    getProductReviewSummary(productId: string): Promise<ProductReviewSummaryDto>;
    listMerchantReviews(params: {
        merchantId: string;
        productId?: string;
        search?: string;
        unrepliedOnly?: boolean;
        page?: number;
        limit?: number;
    }): Promise<MerchantProductReviewListDto>;
    merchantReplyToReview(params: {
        merchantId: string;
        merchantUserId: string;
        reviewId: string;
        dto: MerchantReplyToReviewDto;
    }): Promise<MerchantProductReviewResponseDto>;
}
