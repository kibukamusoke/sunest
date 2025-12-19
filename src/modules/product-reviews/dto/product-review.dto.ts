import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductReviewAuthorDto {
  @ApiProperty({ description: 'User ID of the review author' })
  id: string;

  @ApiPropertyOptional({ description: 'Display name (best-effort)' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Avatar/profile picture URL (best-effort)' })
  avatarUrl?: string;
}

export class ProductReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  body?: string;

  @ApiProperty({ type: [String], description: 'Public URLs of review photos' })
  photos: string[];

  @ApiProperty({ type: ProductReviewAuthorDto })
  author: ProductReviewAuthorDto;

  @ApiPropertyOptional({
    description: 'Optional merchant reply text (visible to customers)',
  })
  merchantReply?: string;

  @ApiPropertyOptional({ description: 'When the merchant replied' })
  merchantRepliedAt?: Date;

  @ApiPropertyOptional({ description: 'When the merchant last updated their reply' })
  merchantReplyUpdatedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductReviewListDto {
  @ApiProperty({ type: [ProductReviewResponseDto] })
  reviews: ProductReviewResponseDto[];

  @ApiProperty()
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


