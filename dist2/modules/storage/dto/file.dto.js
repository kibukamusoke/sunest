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
exports.FileDto = exports.FileStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
var FileStatus;
(function (FileStatus) {
    FileStatus["PENDING"] = "PENDING";
    FileStatus["UPLOADED"] = "UPLOADED";
    FileStatus["FAILED"] = "FAILED";
})(FileStatus || (exports.FileStatus = FileStatus = {}));
class FileDto {
}
exports.FileDto = FileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], FileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File storage key/path',
        example: 'user-files/document.pdf',
    }),
    __metadata("design:type", String)
], FileDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original filename',
        example: 'document.pdf',
    }),
    __metadata("design:type", String)
], FileDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File MIME type',
        example: 'application/pdf',
    }),
    __metadata("design:type", String)
], FileDto.prototype, "mimetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File size in bytes',
        example: 1048576,
        required: false,
    }),
    __metadata("design:type", Number)
], FileDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Storage bucket name',
        example: 'my-app-files',
    }),
    __metadata("design:type", String)
], FileDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who uploaded the file',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    __metadata("design:type", String)
], FileDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who owns the file',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    __metadata("design:type", String)
], FileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File status',
        enum: FileStatus,
        example: FileStatus.UPLOADED,
    }),
    __metadata("design:type", String)
], FileDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File creation date',
    }),
    __metadata("design:type", Date)
], FileDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File last update date',
    }),
    __metadata("design:type", Date)
], FileDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=file.dto.js.map