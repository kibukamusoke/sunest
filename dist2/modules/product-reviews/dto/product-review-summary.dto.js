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
exports.ProductReviewSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProductReviewSummaryDto {
}
exports.ProductReviewSummaryDto = ProductReviewSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average rating across published reviews' }),
    __metadata("design:type", Number)
], ProductReviewSummaryDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of published reviews' }),
    __metadata("design:type", Number)
], ProductReviewSummaryDto.prototype, "totalReviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count of reviews by star rating (1..5)',
        example: { 1: 2, 2: 0, 3: 5, 4: 10, 5: 30 },
    }),
    __metadata("design:type", Object)
], ProductReviewSummaryDto.prototype, "ratingCounts", void 0);
//# sourceMappingURL=product-review-summary.dto.js.map