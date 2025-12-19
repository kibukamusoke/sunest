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
exports.MerchantReplyToReviewDto = exports.MerchantProductReviewListDto = exports.MerchantProductReviewResponseDto = exports.MerchantProductMiniDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const product_review_dto_1 = require("./product-review.dto");
class MerchantProductMiniDto {
}
exports.MerchantProductMiniDto = MerchantProductMiniDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantProductMiniDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantProductMiniDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MerchantProductMiniDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary image URL if available' }),
    __metadata("design:type", String)
], MerchantProductMiniDto.prototype, "imageUrl", void 0);
class MerchantProductReviewResponseDto extends product_review_dto_1.ProductReviewResponseDto {
}
exports.MerchantProductReviewResponseDto = MerchantProductReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: MerchantProductMiniDto }),
    __metadata("design:type", MerchantProductMiniDto)
], MerchantProductReviewResponseDto.prototype, "product", void 0);
class MerchantProductReviewListDto {
}
exports.MerchantProductReviewListDto = MerchantProductReviewListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MerchantProductReviewResponseDto] }),
    __metadata("design:type", Array)
], MerchantProductReviewListDto.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MerchantProductReviewListDto.prototype, "pagination", void 0);
class MerchantReplyToReviewDto {
}
exports.MerchantReplyToReviewDto = MerchantReplyToReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant reply text' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MerchantReplyToReviewDto.prototype, "body", void 0);
//# sourceMappingURL=merchant-review.dto.js.map