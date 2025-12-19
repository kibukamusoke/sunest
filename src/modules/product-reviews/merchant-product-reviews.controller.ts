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
  ForbiddenException,
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
import { ProductReviewsService } from './product-reviews.service';
import {
  MerchantProductReviewListDto,
  MerchantProductReviewResponseDto,
  MerchantReplyToReviewDto,
} from './dto';

@ApiTags('Merchant Reviews')
@Controller('merchants/reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MerchantProductReviewsController {
  constructor(private readonly reviewsService: ProductReviewsService) {}

  private getMerchantId(req: any): string {
    const merchantId = req.user?.merchants?.[0]?.id;
    if (!merchantId) throw new ForbiddenException('User is not associated with any merchant');
    return merchantId;
  }

  @Get()
  @ApiOperation({ summary: 'List customer reviews for the merchant’s products' })
  @ApiQuery({ name: 'productId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'unrepliedOnly',
    required: false,
    type: Boolean,
    description: 'If true, only return reviews without a merchant reply',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: MerchantProductReviewListDto })
  async listMerchantReviews(
    @Request() req: any,
    @Query('productId') productId?: string,
    @Query('search') search?: string,
    @Query('unrepliedOnly') unrepliedOnly?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ): Promise<MerchantProductReviewListDto> {
    const merchantId = this.getMerchantId(req);
    return this.reviewsService.listMerchantReviews({
      merchantId,
      productId,
      search,
      unrepliedOnly: unrepliedOnly === 'true',
      page,
      limit,
    });
  }

  @Post(':reviewId/reply')
  @ApiOperation({ summary: 'Reply to a customer review (merchant only)' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  @ApiResponse({ status: 201, type: MerchantProductReviewResponseDto })
  async replyToReview(
    @Request() req: any,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: MerchantReplyToReviewDto,
  ): Promise<MerchantProductReviewResponseDto> {
    const merchantId = this.getMerchantId(req);
    return this.reviewsService.merchantReplyToReview({
      merchantId,
      merchantUserId: req.user.userId,
      reviewId,
      dto,
    });
  }
}


