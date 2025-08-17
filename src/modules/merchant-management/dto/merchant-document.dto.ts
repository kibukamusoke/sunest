import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';

export enum DocumentType {
    SSM = 'SSM',                                // Suruhanjaya Syarikat Malaysia
    BUSINESS_LICENSE = 'BUSINESS_LICENSE',      // General business license
    TAX_CERTIFICATE = 'TAX_CERTIFICATE',       // Tax registration certificate
    BANK_STATEMENT = 'BANK_STATEMENT',         // Bank account verification
    INSURANCE_CERTIFICATE = 'INSURANCE_CERTIFICATE', // Business insurance
    MEMORANDUM_ARTICLES = 'MEMORANDUM_ARTICLES', // Memorandum and Articles of Association
    FORM_24 = 'FORM_24',                       // Company information form
    FORM_44 = 'FORM_44',                       // Annual return form
    OTHER = 'OTHER',                           // Other supporting documents
}

export enum DocumentStatus {
    PENDING = 'PENDING',           // Waiting for review
    VERIFIED = 'VERIFIED',         // Document approved
    REJECTED = 'REJECTED',         // Document rejected
    EXPIRED = 'EXPIRED',           // Document has expired
    RESUBMISSION = 'RESUBMISSION', // Requires resubmission
}

export class CreateMerchantDocumentDto {
    @ApiProperty({
        description: 'ID of the uploaded file',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsUUID()
    fileId: string;

    @ApiProperty({
        description: 'Type of document being uploaded',
        enum: DocumentType,
        example: DocumentType.SSM
    })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiPropertyOptional({
        description: 'Optional description of the document',
        example: 'Company registration certificate from SSM'
    })
    @IsOptional()
    @IsString()
    description?: string;
}

export class MerchantDocumentDto {
    @ApiProperty({
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    id: string;

    @ApiProperty({
        description: 'Merchant ID this document belongs to',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    merchantId: string;

    @ApiProperty({
        description: 'File information',
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            filename: 'ssm-certificate.pdf',
            mimetype: 'application/pdf',
            size: 1024000,
            url: 'https://storage.example.com/files/ssm-certificate.pdf'
        }
    })
    file: {
        id: string;
        filename: string;
        mimetype: string;
        size?: number;
        url?: string;
    };

    @ApiProperty({
        description: 'Type of document',
        enum: DocumentType
    })
    documentType: DocumentType;

    @ApiPropertyOptional({
        description: 'Document description'
    })
    description?: string;

    @ApiProperty({
        description: 'Document verification status',
        enum: DocumentStatus
    })
    status: DocumentStatus;

    @ApiPropertyOptional({
        description: 'When the document was verified'
    })
    verifiedAt?: Date;

    @ApiPropertyOptional({
        description: 'User ID who verified the document'
    })
    verifiedBy?: string;

    @ApiPropertyOptional({
        description: 'Admin notes about the document'
    })
    notes?: string;

    @ApiProperty({
        description: 'When the document was uploaded'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'When the document was last updated'
    })
    updatedAt: Date;
}

export class UpdateDocumentStatusDto {
    @ApiProperty({
        description: 'New status for the document',
        enum: DocumentStatus
    })
    @IsEnum(DocumentStatus)
    status: DocumentStatus;

    @ApiPropertyOptional({
        description: 'Admin notes about the status change'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class MerchantDocumentsListDto {
    @ApiProperty({
        description: 'List of merchant documents',
        type: [MerchantDocumentDto]
    })
    documents: MerchantDocumentDto[];

    @ApiProperty({
        description: 'Total number of documents',
        example: 5
    })
    total: number;
}
