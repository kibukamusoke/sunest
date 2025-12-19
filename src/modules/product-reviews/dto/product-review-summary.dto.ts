import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewSummaryDto {
  @ApiProperty({ description: 'Average rating across published reviews' })
  averageRating: number;

  @ApiProperty({ description: 'Total number of published reviews' })
  totalReviews: number;

  @ApiProperty({
    description: 'Count of reviews by star rating (1..5)',
    example: { 1: 2, 2: 0, 3: 5, 4: 10, 5: 30 },
  })
  ratingCounts: Record<number, number>;
}


