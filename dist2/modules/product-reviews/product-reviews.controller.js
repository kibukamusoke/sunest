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
exports.ProductReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const product_reviews_service_1 = require("./product-reviews.service");
const dto_1 = require("./dto");
const common_2 = require("@nestjs/common");
let ProductReviewsController = class ProductReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async listReviews(productId, page = 1, limit = 10) {
        return this.reviewsService.listProductReviews(productId, page, limit);
    }
    async getSummary(productId) {
        return this.reviewsService.getProductReviewSummary(productId);
    }
    async getEligibility(productId, req) {
        return this.reviewsService.getEligibility(req.user.userId, productId);
    }
    async getMyReview(productId, req) {
        const review = await this.reviewsService.getMyReview(req.user.userId, productId);
        if (!review)
            throw new common_2.NotFoundException('Review not found');
        return review;
    }
    async createOrUpdate(productId, dto, req) {
        return this.reviewsService.createOrUpdateReview(req.user.userId, productId, dto);
    }
};
exports.ProductReviewsController = ProductReviewsController;
__decorate([
    (0, common_1.Get)(':productId/reviews'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published reviews for a product (Public)' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.ProductReviewListDto }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "listReviews", null);
__decorate([
    (0, common_1.Get)(':productId/reviews/summary'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get review summary for a product (Public)' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.ProductReviewSummaryDto }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':productId/reviews/eligibility'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if the current user can review this product (Delivered purchase required)',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.ProductReviewEligibilityResponseDto }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "getEligibility", null);
__decorate([
    (0, common_1.Get)(':productId/reviews/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current user’s review for this product (if any)' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.ProductReviewResponseDto }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "getMyReview", null);
__decorate([
    (0, common_1.Post)(':productId/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update a review for a product (Delivered purchase required)',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dto_1.ProductReviewResponseDto }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateOrUpdateProductReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "createOrUpdate", null);
exports.ProductReviewsController = ProductReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Product Reviews'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_reviews_service_1.ProductReviewsService])
], ProductReviewsController);
//# sourceMappingURL=product-reviews.controller.js.map