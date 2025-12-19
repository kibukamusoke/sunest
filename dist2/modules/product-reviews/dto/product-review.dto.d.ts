export declare class ProductReviewAuthorDto {
    id: string;
    displayName?: string;
    avatarUrl?: string;
}
export declare class ProductReviewResponseDto {
    id: string;
    productId: string;
    rating: number;
    title?: string;
    body?: string;
    photos: string[];
    author: ProductReviewAuthorDto;
    merchantReply?: string;
    merchantRepliedAt?: Date;
    merchantReplyUpdatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductReviewListDto {
    reviews: ProductReviewResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
