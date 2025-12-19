import { Module } from '@nestjs/common';
import { ProductReviewsController } from './product-reviews.controller';
import { MerchantProductReviewsController } from './merchant-product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';

@Module({
  controllers: [ProductReviewsController, MerchantProductReviewsController],
  providers: [ProductReviewsService],
  exports: [ProductReviewsService],
})
export class ProductReviewsModule {}


