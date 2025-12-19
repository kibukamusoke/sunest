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
exports.QuoteCommentListDto = exports.RFQCommentListDto = exports.CommentListDto = exports.QuoteCommentResponseDto = exports.RFQCommentResponseDto = exports.CreateQuoteCommentDto = exports.CreateRFQCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRFQCommentDto {
    constructor() {
        this.isInternal = false;
    }
}
exports.CreateRFQCommentDto = CreateRFQCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment content',
        example: 'Can you provide more details about the technical specifications?',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateRFQCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is an internal comment (not visible to requesters)',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRFQCommentDto.prototype, "isInternal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/comments/clarification.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRFQCommentDto.prototype, "attachments", void 0);
class CreateQuoteCommentDto {
    constructor() {
        this.isInternal = false;
    }
}
exports.CreateQuoteCommentDto = CreateQuoteCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment content',
        example: 'We can offer additional volume discounts for larger quantities.',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateQuoteCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is an internal comment (not visible to customers)',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateQuoteCommentDto.prototype, "isInternal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/comments/additional-specs.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateQuoteCommentDto.prototype, "attachments", void 0);
class RFQCommentResponseDto {
}
exports.RFQCommentResponseDto = RFQCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQCommentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], RFQCommentResponseDto.prototype, "rfqId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Author information',
    }),
    __metadata("design:type", Object)
], RFQCommentResponseDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment content',
        example: 'Can you provide more details about the technical specifications?',
    }),
    __metadata("design:type", String)
], RFQCommentResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is an internal comment',
        example: false,
    }),
    __metadata("design:type", Boolean)
], RFQCommentResponseDto.prototype, "isInternal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachments',
        example: ['https://storage.example.com/comments/clarification.pdf'],
    }),
    __metadata("design:type", Array)
], RFQCommentResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQCommentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], RFQCommentResponseDto.prototype, "updatedAt", void 0);
class QuoteCommentResponseDto {
}
exports.QuoteCommentResponseDto = QuoteCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteCommentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    }),
    __metadata("design:type", String)
], QuoteCommentResponseDto.prototype, "quoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Author information',
    }),
    __metadata("design:type", Object)
], QuoteCommentResponseDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment content',
        example: 'We can offer additional volume discounts for larger quantities.',
    }),
    __metadata("design:type", String)
], QuoteCommentResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is an internal comment',
        example: false,
    }),
    __metadata("design:type", Boolean)
], QuoteCommentResponseDto.prototype, "isInternal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachments',
        example: ['https://storage.example.com/comments/additional-specs.pdf'],
    }),
    __metadata("design:type", Array)
], QuoteCommentResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteCommentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], QuoteCommentResponseDto.prototype, "updatedAt", void 0);
class CommentListDto {
}
exports.CommentListDto = CommentListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of comments',
    }),
    __metadata("design:type", Array)
], CommentListDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of comments',
        example: 5,
    }),
    __metadata("design:type", Number)
], CommentListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of public comments',
        example: 3,
    }),
    __metadata("design:type", Number)
], CommentListDto.prototype, "publicCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of internal comments',
        example: 2,
    }),
    __metadata("design:type", Number)
], CommentListDto.prototype, "internalCount", void 0);
class RFQCommentListDto extends CommentListDto {
}
exports.RFQCommentListDto = RFQCommentListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of RFQ comments',
        type: [RFQCommentResponseDto],
    }),
    __metadata("design:type", Array)
], RFQCommentListDto.prototype, "comments", void 0);
class QuoteCommentListDto extends CommentListDto {
}
exports.QuoteCommentListDto = QuoteCommentListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of quote comments',
        type: [QuoteCommentResponseDto],
    }),
    __metadata("design:type", Array)
], QuoteCommentListDto.prototype, "comments", void 0);
//# sourceMappingURL=comment.dto.js.map