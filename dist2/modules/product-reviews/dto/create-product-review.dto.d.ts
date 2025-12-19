export declare class CreateOrUpdateProductReviewDto {
    rating: number;
    title?: string;
    body?: string;
    photoFileIds?: string[];
}
export declare class ProductReviewEligibilityResponseDto {
    eligible: boolean;
    reason?: string;
    existingReviewId?: string;
}
