import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as crypto from 'crypto';
import * as multer from 'multer';
import { AbstractStorageService } from './abstract-storage.service';
import { StorageFile, FileResponseDto, StorageConfig } from './interfaces/storage.interface';

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

@Injectable()
export class LocalStorageService extends AbstractStorageService {
  private baseUploadPath: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    super();
    this.baseUploadPath = configService.get<string>('UPLOAD_PATH', 'uploads');
    this.baseUrl = configService.get<string>('BASE_URL', 'http://localhost:3000');
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.baseUploadPath)) {
      fs.mkdirSync(this.baseUploadPath, { recursive: true });
    }
  }

  getUploadMiddleware(options?: StorageConfig): any {
    const destination = options?.destination || this.baseUploadPath;
    
    // Ensure directory exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
      }
    });
    
    return multer({ storage });
  }

  async uploadFile(file: StorageFile, options?: StorageConfig): Promise<FileResponseDto> {
    const uploadPath = options?.destination || this.baseUploadPath;
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }
    
    const fileName = this.generateFileName(file.originalname);
    const filePath = path.join(uploadPath, fileName);
    
    await writeFile(filePath, file.buffer);
    
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    
    return {
      filename: fileName,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${this.baseUrl}/${relativePath}`,
    };
  }

  async uploadFiles(files: StorageFile[], options?: StorageConfig): Promise<FileResponseDto[]> {
    return Promise.all(files.map(file => this.uploadFile(file, options)));
  }

  async getFile(fileKey: string): Promise<StorageFile> {
    const filePath = path.join(this.baseUploadPath, fileKey);
    const buffer = await readFile(filePath);
    const stats = fs.statSync(filePath);
    
    return {
      buffer,
      mimetype: this.getMimeType(filePath),
      originalname: fileKey,
      size: stats.size,
    };
  }

  async getFileUrl(fileKey: string): Promise<string> {
    const relativePath = path.join(this.baseUploadPath, fileKey).replace(/\\/g, '/');
    return `${this.baseUrl}/${relativePath}`;
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.baseUploadPath, fileKey);
      await unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private generateFileName(originalname: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(originalname);
    
    return `${timestamp}-${randomString}${ext}`;
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }
}