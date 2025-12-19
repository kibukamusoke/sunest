import { IStorageService, StorageFile, FileResponseDto, StorageConfig } from './interfaces/storage.interface';
export declare abstract class AbstractStorageService implements IStorageService {
    abstract uploadFile(file: StorageFile, options?: any): Promise<FileResponseDto>;
    abstract uploadFiles(files: StorageFile[], options?: any): Promise<FileResponseDto[]>;
    abstract getUploadMiddleware(options?: StorageConfig): any;
    abstract getFile(fileKey: string): Promise<StorageFile>;
    abstract getFileUrl(fileKey: string): Promise<string>;
    abstract deleteFile(fileKey: string): Promise<boolean>;
}
