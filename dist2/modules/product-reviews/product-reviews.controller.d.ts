import { ProductReviewsService } from './product-reviews.service';
import { CreateOrUpdateProductReviewDto, ProductReviewEligibilityResponseDto, ProductReviewListDto, ProductReviewResponseDto, ProductReviewSummaryDto } from './dto';
export declare class ProductReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ProductReviewsService);
    listReviews(productId: string, page?: number, limit?: number): Promise<ProductReviewListDto>;
    getSummary(productId: string): Promise<ProductReviewSummaryDto>;
    getEligibility(productId: string, req: any): Promise<ProductReviewEligibilityResponseDto>;
    getMyReview(productId: string, req: any): Promise<ProductReviewResponseDto>;
    createOrUpdate(productId: string, dto: CreateOrUpdateProductReviewDto, req: any): Promise<ProductReviewResponseDto>;
}
