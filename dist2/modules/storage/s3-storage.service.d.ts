import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
export declare class S3StorageService {
    private configService;
    private prismaService;
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly logger;
    private readonly expiresInSeconds;
    constructor(configService: ConfigService, prismaService: PrismaService);
    createPresignedUploadUrl(filename: string, mimetype: string, userId?: string): Promise<{
        fileId: string;
        key: string;
        presignedUrl: string;
        expiresIn: number;
    }>;
    createPresignedDownloadUrl(fileId: string): Promise<{
        fileId: string;
        filename: string;
        presignedUrl: string;
        expiresIn: number;
    }>;
    confirmFileUpload(fileId: string): Promise<boolean>;
    deleteFile(fileId: string): Promise<boolean>;
    getUserFiles(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FileStatus;
        userId: string | null;
        key: string;
        url: string | null;
        filename: string;
        mimetype: string;
        size: number | null;
        bucket: string | null;
        uploadedBy: string | null;
    }[]>;
    getPublicUrl(fileId: string): Promise<{
        fileId: string;
        filename: string;
        url: string;
    }>;
    private generatePublicUrl;
    private generateFileKey;
}
