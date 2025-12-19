import { PrismaService } from '../../config/prisma.service';
import { S3StorageService } from '../storage/s3-storage.service';
import { CreateMerchantDocumentDto, MerchantDocumentDto, UpdateDocumentStatusDto, MerchantDocumentsListDto } from './dto/merchant-document.dto';
export declare class MerchantDocumentService {
    private prisma;
    private s3StorageService;
    constructor(prisma: PrismaService, s3StorageService: S3StorageService);
    uploadDocument(merchantId: string, createDocumentDto: CreateMerchantDocumentDto, userId: string): Promise<MerchantDocumentDto>;
    getMerchantDocuments(merchantId: string): Promise<MerchantDocumentsListDto>;
    getDocumentById(documentId: string): Promise<MerchantDocumentDto>;
    updateDocumentStatus(documentId: string, updateStatusDto: UpdateDocumentStatusDto, userId: string): Promise<MerchantDocumentDto>;
    deleteDocument(documentId: string, merchantId?: string): Promise<void>;
    getDocumentDownloadUrl(documentId: string): Promise<{
        url: string;
        filename: string;
        expiresIn: number;
    }>;
    private mapToDocumentDto;
}
