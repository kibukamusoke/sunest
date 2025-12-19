import { ProductReviewsService } from './product-reviews.service';
import { MerchantProductReviewListDto, MerchantProductReviewResponseDto, MerchantReplyToReviewDto } from './dto';
export declare class MerchantProductReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ProductReviewsService);
    private getMerchantId;
    listMerchantReviews(req: any, productId?: string, search?: string, unrepliedOnly?: string, page?: number, limit?: number): Promise<MerchantProductReviewListDto>;
    replyToReview(req: any, reviewId: string, dto: MerchantReplyToReviewDto): Promise<MerchantProductReviewResponseDto>;
}
