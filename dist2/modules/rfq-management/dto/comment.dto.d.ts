export declare class CreateRFQCommentDto {
    content: string;
    isInternal?: boolean;
    attachments?: string[];
}
export declare class CreateQuoteCommentDto {
    content: string;
    isInternal?: boolean;
    attachments?: string[];
}
export declare class RFQCommentResponseDto {
    id: string;
    rfqId: string;
    author: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
    content: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class QuoteCommentResponseDto {
    id: string;
    quoteId: string;
    author: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
    content: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class CommentListDto<T> {
    comments: T[];
    total: number;
    publicCount: number;
    internalCount: number;
}
export declare class RFQCommentListDto extends CommentListDto<RFQCommentResponseDto> {
    comments: RFQCommentResponseDto[];
}
export declare class QuoteCommentListDto extends CommentListDto<QuoteCommentResponseDto> {
    comments: QuoteCommentResponseDto[];
}
