import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { ProductReviewsService } from './product-reviews.service';
import {
  CreateOrUpdateProductReviewDto,
  ProductReviewEligibilityResponseDto,
  ProductReviewListDto,
  ProductReviewResponseDto,
  ProductReviewSummaryDto,
} from './dto';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Product Reviews')
@Controller('products')
export class ProductReviewsController {
  constructor(private readonly reviewsService: ProductReviewsService) {}

  @Get(':productId/reviews')
  @Public()
  @ApiOperation({ summary: 'List published reviews for a product (Public)' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: ProductReviewListDto })
  async listReviews(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ): Promise<ProductReviewListDto> {
    return this.reviewsService.listProductReviews(productId, page, limit);
  }

  @Get(':productId/reviews/summary')
  @Public()
  @ApiOperation({ summary: 'Get review summary for a product (Public)' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, type: ProductReviewSummaryDto })
  async getSummary(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductReviewSummaryDto> {
    return this.reviewsService.getProductReviewSummary(productId);
  }

  @Get(':productId/reviews/eligibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check if the current user can review this product (Delivered purchase required)',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, type: ProductReviewEligibilityResponseDto })
  async getEligibility(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() req: any,
  ): Promise<ProductReviewEligibilityResponseDto> {
    return this.reviewsService.getEligibility(req.user.userId, productId);
  }

  @Get(':productId/reviews/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user’s review for this product (if any)' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, type: ProductReviewResponseDto })
  async getMyReview(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() req: any,
  ): Promise<ProductReviewResponseDto> {
    const review = await this.reviewsService.getMyReview(req.user.userId, productId);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  @Post(':productId/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Create or update a review for a product (Delivered purchase required)',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 201, type: ProductReviewResponseDto })
  async createOrUpdate(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateOrUpdateProductReviewDto,
    @Request() req: any,
  ): Promise<ProductReviewResponseDto> {
    return this.reviewsService.createOrUpdateReview(req.user.userId, productId, dto);
  }
}


