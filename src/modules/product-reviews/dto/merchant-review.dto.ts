import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProductReviewResponseDto } from './product-review.dto';

export class MerchantProductMiniDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Primary image URL if available' })
  imageUrl?: string;
}

export class MerchantProductReviewResponseDto extends ProductReviewResponseDto {
  @ApiProperty({ type: MerchantProductMiniDto })
  product: MerchantProductMiniDto;
}

export class MerchantProductReviewListDto {
  @ApiProperty({ type: [MerchantProductReviewResponseDto] })
  reviews: MerchantProductReviewResponseDto[];

  @ApiProperty()
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MerchantReplyToReviewDto {
  @ApiProperty({ description: 'Merchant reply text' })
  @IsNotEmpty()
  @IsString()
  body: string;
}


