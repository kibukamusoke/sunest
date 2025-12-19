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
exports.MerchantDocumentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const s3_storage_service_1 = require("../storage/s3-storage.service");
const merchant_document_dto_1 = require("./dto/merchant-document.dto");
let MerchantDocumentService = class MerchantDocumentService {
    constructor(prisma, s3StorageService) {
        this.prisma = prisma;
        this.s3StorageService = s3StorageService;
    }
    async uploadDocument(merchantId, createDocumentDto, userId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const file = await this.prisma.file.findUnique({
            where: { id: createDocumentDto.fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        console.log('file.userId', file.userId);
        console.log('userId', userId);
        const allowedMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/pdf',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only PNG, JPG, and PDF files are allowed');
        }
        const existingDocument = await this.prisma.merchantDocument.findUnique({
            where: {
                merchantId_fileId: {
                    merchantId,
                    fileId: createDocumentDto.fileId,
                },
            },
        });
        if (existingDocument) {
            throw new common_1.BadRequestException('Document already exists for this file');
        }
        await this.prisma.file.update({
            where: { id: createDocumentDto.fileId },
            data: { status: 'VERIFIED' },
        });
        const document = await this.prisma.merchantDocument.create({
            data: {
                merchantId,
                fileId: createDocumentDto.fileId,
                documentType: createDocumentDto.documentType,
                description: createDocumentDto.description,
                status: merchant_document_dto_1.DocumentStatus.VERIFIED,
                verifiedAt: new Date(),
                verifiedBy: userId,
            },
            include: {
                file: true,
                merchant: true,
            },
        });
        return this.mapToDocumentDto(document);
    }
    async getMerchantDocuments(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const documents = await this.prisma.merchantDocument.findMany({
            where: { merchantId },
            include: {
                file: true,
                merchant: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            documents: documents.map((doc) => this.mapToDocumentDto(doc)),
            total: documents.length,
        };
    }
    async getDocumentById(documentId) {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return this.mapToDocumentDto(document);
    }
    async updateDocumentStatus(documentId, updateStatusDto, userId) {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const updatedDocument = await this.prisma.merchantDocument.update({
            where: { id: documentId },
            data: {
                status: updateStatusDto.status,
                notes: updateStatusDto.notes,
                verifiedAt: updateStatusDto.status === merchant_document_dto_1.DocumentStatus.VERIFIED
                    ? new Date()
                    : null,
                verifiedBy: updateStatusDto.status === merchant_document_dto_1.DocumentStatus.VERIFIED ? userId : null,
            },
            include: {
                file: true,
                merchant: true,
            },
        });
        return this.mapToDocumentDto(updatedDocument);
    }
    async deleteDocument(documentId, merchantId) {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (merchantId && document.merchantId !== merchantId) {
            throw new common_1.ForbiddenException('Document does not belong to this merchant');
        }
        if (document.merchant.status !== 'PENDING' &&
            document.merchant.status !== 'REJECTED') {
            throw new common_1.BadRequestException('Documents cannot be deleted for applications in current status');
        }
        await this.prisma.merchantDocument.delete({
            where: { id: documentId },
        });
    }
    async getDocumentDownloadUrl(documentId) {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const downloadUrl = await this.s3StorageService.createPresignedDownloadUrl(document.file.id);
        return {
            url: downloadUrl.presignedUrl,
            filename: document.file.filename,
            expiresIn: downloadUrl.expiresIn,
        };
    }
    mapToDocumentDto(document) {
        return {
            id: document.id,
            merchantId: document.merchantId,
            file: {
                id: document.file.id,
                filename: document.file.filename,
                mimetype: document.file.mimetype,
                size: document.file.size,
                url: document.file.url,
            },
            documentType: document.documentType,
            description: document.description,
            status: document.status,
            verifiedAt: document.verifiedAt,
            verifiedBy: document.verifiedBy,
            notes: document.notes,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }
};
exports.MerchantDocumentService = MerchantDocumentService;
exports.MerchantDocumentService = MerchantDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_storage_service_1.S3StorageService])
], MerchantDocumentService);
//# sourceMappingURL=merchant-document.service.js.map