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
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const s3_storage_service_1 = require("./s3-storage.service");
const presigned_url_dto_1 = require("./dto/presigned-url.dto");
let StorageController = class StorageController {
    constructor(s3StorageService) {
        this.s3StorageService = s3StorageService;
    }
    async createPresignedUrl(createPresignedUrlDto, req) {
        return this.s3StorageService.createPresignedUploadUrl(createPresignedUrlDto.filename, createPresignedUrlDto.mimetype, req.user.userId);
    }
    async confirmUpload(confirmUploadDto) {
        return {
            success: await this.s3StorageService.confirmFileUpload(confirmUploadDto.fileId),
        };
    }
    async getDownloadUrl(params) {
        return this.s3StorageService.getPublicUrl(params.fileId);
    }
    async getPublicUrl(params) {
        return this.s3StorageService.getPublicUrl(params.fileId);
    }
    async getUserFiles(req) {
        return this.s3StorageService.getUserFiles(req.user.userId);
    }
    async deleteFile(params) {
        return {
            success: await this.s3StorageService.deleteFile(params.fileId),
        };
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Post)('presigned-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a presigned URL for uploading a file to S3' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Returns a presigned URL for direct upload to S3',
        type: presigned_url_dto_1.PresignedUrlResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_url_dto_1.CreatePresignedUrlDto, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "createPresignedUrl", null);
__decorate([
    (0, common_1.Post)('confirm-upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm that a file was successfully uploaded to S3',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File upload confirmed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_url_dto_1.ConfirmUploadDto]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "confirmUpload", null);
__decorate([
    (0, common_1.Get)('download/:fileId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a permanent public URL for downloading a file from S3',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a permanent public URL for downloading the file',
    }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_url_dto_1.FileIdParamDto]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Get)('public-url/:fileId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a permanent public URL for a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a permanent public URL for the file',
    }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_url_dto_1.FileIdParamDto]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getPublicUrl", null);
__decorate([
    (0, common_1.Get)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all files for the current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a list of files for the user',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "getUserFiles", null);
__decorate([
    (0, common_1.Delete)(':fileId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted successfully' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_url_dto_1.FileIdParamDto]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "deleteFile", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('storage'),
    (0, common_1.Controller)('storage'),
    __metadata("design:paramtypes", [s3_storage_service_1.S3StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map