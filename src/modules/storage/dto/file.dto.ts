import { ApiProperty } from '@nestjs/swagger';

export enum FileStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  FAILED = 'FAILED'
}

export class FileDto {
  @ApiProperty({
    description: 'File ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'File storage key/path',
    example: 'user-files/document.pdf'
  })
  key: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf'
  })
  filename: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf'
  })
  mimetype: string;
  
  @ApiProperty({
    description: 'File size in bytes',
    example: 1048576,
    required: false
  })
  size?: number;
  
  @ApiProperty({
    description: 'Storage bucket name',
    example: 'my-app-files'
  })
  bucket: string;
  
  @ApiProperty({
    description: 'User ID who uploaded the file',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false
  })
  uploadedBy?: string;
  
  @ApiProperty({
    description: 'User ID who owns the file',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false
  })
  userId?: string;
  
  @ApiProperty({
    description: 'File status',
    enum: FileStatus,
    example: FileStatus.UPLOADED
  })
  status: FileStatus;
  
  @ApiProperty({
    description: 'File creation date'
  })
  createdAt: Date;
  
  @ApiProperty({
    description: 'File last update date'
  })
  updatedAt: Date;
}