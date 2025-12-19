"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantProductReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const product_reviews_service_1 = require("./product-reviews.service");
const dto_1 = require("./dto");
let MerchantProductReviewsController = class MerchantProductReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    getMerchantId(req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId)
            throw new common_1.ForbiddenException('User is not associated with any merchant');
        return merchantId;
    }
    async listMerchantReviews(req, productId, search, unrepliedOnly, page = 1, limit = 10) {
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
    async replyToReview(req, reviewId, dto) {
        const merchantId = this.getMerchantId(req);
        return this.reviewsService.merchantReplyToReview({
            merchantId,
            merchantUserId: req.user.userId,
            reviewId,
            dto,
        });
    }
};
exports.MerchantProductReviewsController = MerchantProductReviewsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List customer reviews for the merchant’s products' }),
    (0, swagger_1.ApiQuery)({ name: 'productId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'unrepliedOnly',
        required: false,
        type: Boolean,
        description: 'If true, only return reviews without a merchant reply',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.MerchantProductReviewListDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('unrepliedOnly')),
    __param(4, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantProductReviewsController.prototype, "listMerchantReviews", null);
__decorate([
    (0, common_1.Post)(':reviewId/reply'),
    (0, swagger_1.ApiOperation)({ summary: 'Reply to a customer review (merchant only)' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dto_1.MerchantProductReviewResponseDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reviewId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.MerchantReplyToReviewDto]),
    __metadata("design:returntype", Promise)
], MerchantProductReviewsController.prototype, "replyToReview", null);
exports.MerchantProductReviewsController = MerchantProductReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Merchant Reviews'),
    (0, common_1.Controller)('merchants/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_reviews_service_1.ProductReviewsService])
], MerchantProductReviewsController);
//# sourceMappingURL=merchant-product-reviews.controller.js.map