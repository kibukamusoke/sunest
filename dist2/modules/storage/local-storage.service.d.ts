import { ConfigService } from '@nestjs/config';
import { AbstractStorageService } from './abstract-storage.service';
import { StorageFile, FileResponseDto, StorageConfig } from './interfaces/storage.interface';
export declare class LocalStorageService extends AbstractStorageService {
    private configService;
    private baseUploadPath;
    private baseUrl;
    constructor(configService: ConfigService);
    getUploadMiddleware(options?: StorageConfig): any;
    uploadFile(file: StorageFile, options?: StorageConfig): Promise<FileResponseDto>;
    uploadFiles(files: StorageFile[], options?: StorageConfig): Promise<FileResponseDto[]>;
    getFile(fileKey: string): Promise<StorageFile>;
    getFileUrl(fileKey: string): Promise<string>;
    deleteFile(fileKey: string): Promise<boolean>;
    private generateFileName;
    private getMimeType;
}
