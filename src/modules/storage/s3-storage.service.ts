import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

@Injectable()
export class S3StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3StorageService.name);
  private readonly expiresInSeconds: number;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET', '');
    this.expiresInSeconds = this.configService.get<number>('AWS_PRESIGNED_URL_EXPIRES', 900); // 15 minutes

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', ''),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
  }

  /**
   * Creates a presigned URL for uploading a file directly to S3
   */
  async createPresignedUploadUrl(
    filename: string, 
    mimetype: string, 
    userId?: string
  ) {
    // Generate a unique key for the file
    const key = this.generateFileKey(filename);
    
    // Create the file record in the database with PENDING status
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

    // Create a command to upload the file
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
    });

    // Generate the presigned URL
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.expiresInSeconds,
    });

    return {
      fileId: file.id,
      key,
      presignedUrl,
      expiresIn: this.expiresInSeconds,
    };
  }

  /**
   * Creates a presigned URL for downloading a file from S3
   */
  async createPresignedDownloadUrl(fileId: string) {
    const file = await this.prismaService.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    // Create a command to get the file
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: file.key,
    });

    // Generate the presigned URL
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.expiresInSeconds,
    });

    return {
      fileId: file.id,
      filename: file.filename,
      presignedUrl,
      expiresIn: this.expiresInSeconds,
    };
  }

  /**
   * Confirms that a file was successfully uploaded to S3
   */
  async confirmFileUpload(fileId: string) {
    const file = await this.prismaService.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    try {
      // Check if the file exists in S3
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: file.key,
      });
      
      const response = await this.s3Client.send(headCommand);
      
      // Update the file status and size in the database
      await this.prismaService.file.update({
        where: { id: fileId },
        data: {
          status: 'UPLOADED',
          size: response.ContentLength,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error confirming file upload: ${error.message}`, error.stack);
      
      // Update the file status to FAILED
      await this.prismaService.file.update({
        where: { id: fileId },
        data: {
          status: 'FAILED',
        },
      });
      
      return false;
    }
  }

  /**
   * Deletes a file from S3 and updates the database record
   */
  async deleteFile(fileId: string) {
    const file = await this.prismaService.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    try {
      // Delete the file from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: file.key,
      });
      
      await this.s3Client.send(deleteCommand);
      
      // Delete the file record from the database
      await this.prismaService.file.delete({
        where: { id: fileId },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Retrieves a list of files for a user
   */
  async getUserFiles(userId: string) {
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

  /**
   * Generates a unique key for the file in S3
   */
  private generateFileKey(filename: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const extension = filename.split('.').pop();
    
    return `${timestamp}-${randomString}.${extension}`;
  }
}