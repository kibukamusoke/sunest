import { Request } from 'express';

export interface FileInfo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer?: Buffer;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  url?: string;
}

export interface StorageFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface FileResponseDto {
  filename: string;
  mimetype: string;
  url: string;
  size: number;
  originalname: string;
  key?: string;
}

export interface StorageConfig {
  destination?: string;
}

export interface IStorageService {
  uploadFile(file: StorageFile, options?: any): Promise<FileResponseDto>;
  uploadFiles(files: StorageFile[], options?: any): Promise<FileResponseDto[]>;
  getUploadMiddleware(options?: StorageConfig): any;
  getFile(fileKey: string): Promise<StorageFile>;
  getFileUrl(fileKey: string): Promise<string>;
  deleteFile(fileKey: string): Promise<boolean>;
}