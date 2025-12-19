import { ProductReviewResponseDto } from './product-review.dto';
export declare class MerchantProductMiniDto {
    id: string;
    name: string;
    sku?: string;
    imageUrl?: string;
}
export declare class MerchantProductReviewResponseDto extends ProductReviewResponseDto {
    product: MerchantProductMiniDto;
}
export declare class MerchantProductReviewListDto {
    reviews: MerchantProductReviewResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class MerchantReplyToReviewDto {
    body: string;
}
