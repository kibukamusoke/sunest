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
var S3StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../config/prisma.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
let S3StorageService = S3StorageService_1 = class S3StorageService {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(S3StorageService_1.name);
        this.bucket = this.configService.get('AWS_S3_BUCKET', '');
        this.region = this.configService.get('AWS_REGION', '');
        this.expiresInSeconds = this.configService.get('AWS_PRESIGNED_URL_EXPIRES', 900);
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
            },
        });
    }
    async createPresignedUploadUrl(filename, mimetype, userId) {
        const key = this.generateFileKey(filename);
        const file = await this.prismaService.file.create({
            data: {
                key,
                filename,
                mimetype,
                bucket: this.bucket,
                userId,
                status: 'PENDING',
            },
        });
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: mimetype,
        });
        const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: this.expiresInSeconds,
        });
        return {
            fileId: file.id,
            key,
            presignedUrl,
            expiresIn: this.expiresInSeconds,
        };
    }
    async createPresignedDownloadUrl(fileId) {
        const file = await this.prismaService.file.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: file.key,
        });
        const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: this.expiresInSeconds,
        });
        return {
            fileId: file.id,
            filename: file.filename,
            presignedUrl,
            expiresIn: this.expiresInSeconds,
        };
    }
    async confirmFileUpload(fileId) {
        const file = await this.prismaService.file.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        try {
            const headCommand = new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: file.key,
            });
            const response = await this.s3Client.send(headCommand);
            const publicUrl = this.generatePublicUrl(file.key);
            await this.prismaService.file.update({
                where: { id: fileId },
                data: {
                    status: 'UPLOADED',
                    size: response.ContentLength,
                    url: publicUrl,
                },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Error confirming file upload: ${error.message}`, error.stack);
            await this.prismaService.file.update({
                where: { id: fileId },
                data: {
                    status: 'FAILED',
                },
            });
            return false;
        }
    }
    async deleteFile(fileId) {
        const file = await this.prismaService.file.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        try {
            const deleteCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: file.key,
            });
            await this.s3Client.send(deleteCommand);
            await this.prismaService.file.delete({
                where: { id: fileId },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`, error.stack);
            return false;
        }
    }
    async getUserFiles(userId) {
        return this.prismaService.file.findMany({
            where: {
                userId,
                status: 'UPLOADED',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getPublicUrl(fileId) {
        const file = await this.prismaService.file.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        if (file.status !== 'UPLOADED') {
            throw new Error(`File with ID ${fileId} is not uploaded yet`);
        }
        return {
            fileId: file.id,
            filename: file.filename,
            url: file.url || this.generatePublicUrl(file.key),
        };
    }
    generatePublicUrl(key) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    generateFileKey(filename) {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(16).toString('hex');
        const extension = filename.split('.').pop();
        return `${timestamp}-${randomString}.${extension}`;
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = S3StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map