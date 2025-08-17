import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { S3StorageService } from '../storage/s3-storage.service';
import {
    CreateMerchantDocumentDto,
    MerchantDocumentDto,
    UpdateDocumentStatusDto,
    MerchantDocumentsListDto,
    DocumentStatus
} from './dto/merchant-document.dto';

@Injectable()
export class MerchantDocumentService {
    constructor(
        private prisma: PrismaService,
        private s3StorageService: S3StorageService
    ) { }

    async uploadDocument(
        merchantId: string,
        createDocumentDto: CreateMerchantDocumentDto,
        userId: string
    ): Promise<MerchantDocumentDto> {
        // Verify the merchant exists
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId }
        });

        if (!merchant) {
            throw new NotFoundException('Merchant not found');
        }

        // Verify the file exists and belongs to the user
        const file = await this.prisma.file.findUnique({
            where: { id: createDocumentDto.fileId }
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        // Verify file owner (user must own the file or be admin)
        if (file.userId !== userId) {
            // Check if user is system admin
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { roles: true }
            });

            const isSystemAdmin = user?.roles.some(role => role.name === 'system_admin');
            if (!isSystemAdmin) {
                throw new ForbiddenException('You can only upload your own files');
            }
        }

        // Validate file type (only allow png, jpg, pdf)
        const allowedMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/pdf'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Only PNG, JPG, and PDF files are allowed');
        }

        // Check if document already exists for this file and merchant
        const existingDocument = await this.prisma.merchantDocument.findUnique({
            where: {
                merchantId_fileId: {
                    merchantId,
                    fileId: createDocumentDto.fileId
                }
            }
        });

        if (existingDocument) {
            throw new BadRequestException('Document already exists for this file');
        }

        // Update file status to VERIFIED
        await this.prisma.file.update({
            where: { id: createDocumentDto.fileId },
            data: { status: 'VERIFIED' as any }
        });

        // Create the merchant document
        const document = await this.prisma.merchantDocument.create({
            data: {
                merchantId,
                fileId: createDocumentDto.fileId,
                documentType: createDocumentDto.documentType,
                description: createDocumentDto.description,
                status: DocumentStatus.VERIFIED,
                verifiedAt: new Date(),
                verifiedBy: userId
            },
            include: {
                file: true,
                merchant: true
            }
        });

        return this.mapToDocumentDto(document);
    }

    async getMerchantDocuments(merchantId: string): Promise<MerchantDocumentsListDto> {
        // Verify merchant exists
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId }
        });

        if (!merchant) {
            throw new NotFoundException('Merchant not found');
        }

        const documents = await this.prisma.merchantDocument.findMany({
            where: { merchantId },
            include: {
                file: true,
                merchant: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            documents: documents.map(doc => this.mapToDocumentDto(doc)),
            total: documents.length
        };
    }

    async getDocumentById(documentId: string): Promise<MerchantDocumentDto> {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true
            }
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        return this.mapToDocumentDto(document);
    }

    async updateDocumentStatus(
        documentId: string,
        updateStatusDto: UpdateDocumentStatusDto,
        userId: string
    ): Promise<MerchantDocumentDto> {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true
            }
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        const updatedDocument = await this.prisma.merchantDocument.update({
            where: { id: documentId },
            data: {
                status: updateStatusDto.status,
                notes: updateStatusDto.notes,
                verifiedAt: updateStatusDto.status === DocumentStatus.VERIFIED ? new Date() : null,
                verifiedBy: updateStatusDto.status === DocumentStatus.VERIFIED ? userId : null
            },
            include: {
                file: true,
                merchant: true
            }
        });

        return this.mapToDocumentDto(updatedDocument);
    }

    async deleteDocument(documentId: string, merchantId?: string): Promise<void> {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true
            }
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        // If merchantId is provided, verify the document belongs to that merchant
        if (merchantId && document.merchantId !== merchantId) {
            throw new ForbiddenException('Document does not belong to this merchant');
        }

        // Only allow deletion if merchant status is PENDING or REJECTED
        if (document.merchant.status !== 'PENDING' && document.merchant.status !== 'REJECTED') {
            throw new BadRequestException('Documents cannot be deleted for applications in current status');
        }

        await this.prisma.merchantDocument.delete({
            where: { id: documentId }
        });
    }

    async getDocumentDownloadUrl(documentId: string): Promise<{ url: string; filename: string; expiresIn: number }> {
        const document = await this.prisma.merchantDocument.findUnique({
            where: { id: documentId },
            include: {
                file: true,
                merchant: true
            }
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        // Get presigned download URL from S3
        const downloadUrl = await this.s3StorageService.createPresignedDownloadUrl(document.file.id);

        return {
            url: downloadUrl.presignedUrl,
            filename: document.file.filename,
            expiresIn: downloadUrl.expiresIn
        };
    }

    private mapToDocumentDto(document: any): MerchantDocumentDto {
        return {
            id: document.id,
            merchantId: document.merchantId,
            file: {
                id: document.file.id,
                filename: document.file.filename,
                mimetype: document.file.mimetype,
                size: document.file.size,
                url: document.file.url
            },
            documentType: document.documentType,
            description: document.description,
            status: document.status,
            verifiedAt: document.verifiedAt,
            verifiedBy: document.verifiedBy,
            notes: document.notes,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
    }
}
