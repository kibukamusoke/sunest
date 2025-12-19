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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewListDto = exports.ProductReviewResponseDto = exports.ProductReviewAuthorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProductReviewAuthorDto {
}
exports.ProductReviewAuthorDto = ProductReviewAuthorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the review author' }),
    __metadata("design:type", String)
], ProductReviewAuthorDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display name (best-effort)' }),
    __metadata("design:type", String)
], ProductReviewAuthorDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avatar/profile picture URL (best-effort)' }),
    __metadata("design:type", String)
], ProductReviewAuthorDto.prototype, "avatarUrl", void 0);
class ProductReviewResponseDto {
}
exports.ProductReviewResponseDto = ProductReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductReviewResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductReviewResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 5 }),
    __metadata("design:type", Number)
], ProductReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductReviewResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductReviewResponseDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Public URLs of review photos' }),
    __metadata("design:type", Array)
], ProductReviewResponseDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProductReviewAuthorDto }),
    __metadata("design:type", ProductReviewAuthorDto)
], ProductReviewResponseDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional merchant reply text (visible to customers)',
    }),
    __metadata("design:type", String)
], ProductReviewResponseDto.prototype, "merchantReply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the merchant replied' }),
    __metadata("design:type", Date)
], ProductReviewResponseDto.prototype, "merchantRepliedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the merchant last updated their reply' }),
    __metadata("design:type", Date)
], ProductReviewResponseDto.prototype, "merchantReplyUpdatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductReviewResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductReviewResponseDto.prototype, "updatedAt", void 0);
class ProductReviewListDto {
}
exports.ProductReviewListDto = ProductReviewListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductReviewResponseDto] }),
    __metadata("design:type", Array)
], ProductReviewListDto.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ProductReviewListDto.prototype, "pagination", void 0);
//# sourceMappingURL=product-review.dto.js.map