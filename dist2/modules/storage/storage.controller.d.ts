import { S3StorageService } from './s3-storage.service';
import { CreatePresignedUrlDto, ConfirmUploadDto, FileIdParamDto } from './dto/presigned-url.dto';
export declare class StorageController {
    private readonly s3StorageService;
    constructor(s3StorageService: S3StorageService);
    createPresignedUrl(createPresignedUrlDto: CreatePresignedUrlDto, req: any): Promise<{
        fileId: string;
        key: string;
        presignedUrl: string;
        expiresIn: number;
    }>;
    confirmUpload(confirmUploadDto: ConfirmUploadDto): Promise<{
        success: boolean;
    }>;
    getDownloadUrl(params: FileIdParamDto): Promise<{
        fileId: string;
        filename: string;
        url: string;
    }>;
    getPublicUrl(params: FileIdParamDto): Promise<{
        fileId: string;
        filename: string;
        url: string;
    }>;
    getUserFiles(req: any): Promise<{
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
    deleteFile(params: FileIdParamDto): Promise<{
        success: boolean;
    }>;
}
