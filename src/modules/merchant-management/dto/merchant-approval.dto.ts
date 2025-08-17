import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, Length } from 'class-validator';

export class MerchantApprovalDto {
    @ApiProperty({
        description: 'Approval notes from admin',
        example: 'All documents verified and business credentials confirmed.',
        minLength: 10,
        maxLength: 1000
    })
    @IsString()
    @Length(10, 1000)
    approvalNotes: string;

    @ApiPropertyOptional({
        description: 'Whether this is a conditional approval with restrictions',
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean()
    conditionalApproval?: boolean;

    @ApiPropertyOptional({
        description: 'List of restrictions or conditions for approval',
        example: ['Limited to electronics category', 'Maximum 100 products initially'],
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    restrictions?: string[];

    @ApiPropertyOptional({
        description: 'Approval effective date (defaults to now)',
        example: '2024-01-15T10:30:00Z'
    })
    @IsOptional()
    approvalDate?: Date;
}

export class MerchantRejectionDto {
    @ApiProperty({
        description: 'Primary reason for rejection',
        example: 'incomplete_documentation',
        enum: [
            'incomplete_documentation',
            'invalid_business_license',
            'failed_verification',
            'duplicate_application',
            'business_type_not_supported',
            'geographic_restrictions',
            'other'
        ]
    })
    @IsEnum([
        'incomplete_documentation',
        'invalid_business_license',
        'failed_verification',
        'duplicate_application',
        'business_type_not_supported',
        'geographic_restrictions',
        'other'
    ])
    reason: string;

    @ApiProperty({
        description: 'Detailed explanation for rejection',
        example: 'Business license document is expired. Please submit a current license.',
        minLength: 20,
        maxLength: 1000
    })
    @IsString()
    @Length(20, 1000)
    rejectionNotes: string;

    @ApiPropertyOptional({
        description: 'Whether merchant can reapply after addressing issues',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    canReapply?: boolean;

    @ApiPropertyOptional({
        description: 'Specific documents or information needed for reapplication',
        example: ['Current business license', 'Updated tax registration'],
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requiredForReapplication?: string[];
}

export class MerchantStatusUpdateDto {
    @ApiProperty({
        description: 'New status for the merchant',
        example: 'SUSPENDED',
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE']
    })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE'])
    status: string;

    @ApiProperty({
        description: 'Reason for status change',
        example: 'Temporary suspension due to policy violations',
        minLength: 10,
        maxLength: 500
    })
    @IsString()
    @Length(10, 500)
    reason: string;

    @ApiPropertyOptional({
        description: 'Additional notes about the status change',
        example: 'Merchant will be contacted via email with details',
        maxLength: 1000
    })
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    notes?: string;

    @ApiPropertyOptional({
        description: 'Effective date of status change (defaults to now)',
        example: '2024-01-15T10:30:00Z'
    })
    @IsOptional()
    effectiveDate?: Date;
}

export class MerchantDocumentDto {
    @ApiProperty({
        description: 'Document type',
        example: 'business_license',
        enum: [
            'business_license',
            'tax_certificate',
            'insurance_certificate',
            'bank_verification',
            'signatory_authorization',
            'compliance_certificate',
            'other'
        ]
    })
    @IsEnum([
        'business_license',
        'tax_certificate',
        'insurance_certificate',
        'bank_verification',
        'signatory_authorization',
        'compliance_certificate',
        'other'
    ])
    documentType: string;

    @ApiProperty({
        description: 'Document description',
        example: 'Official business license certificate',
        minLength: 1,
        maxLength: 200
    })
    @IsString()
    @Length(1, 200)
    description: string;

    @ApiPropertyOptional({
        description: 'Document expiry date (if applicable)',
        example: '2025-12-31T23:59:59Z'
    })
    @IsOptional()
    expiryDate?: Date;

    @ApiPropertyOptional({
        description: 'Document issuing authority',
        example: 'California Department of Consumer Affairs',
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    issuingAuthority?: string;
}

export class MerchantDocumentResponseDto {
    @ApiProperty({ description: 'Document ID' })
    id: string;

    @ApiProperty({ description: 'Document type' })
    documentType: string;

    @ApiProperty({ description: 'Document description' })
    description: string;

    @ApiProperty({ description: 'Upload date' })
    uploadedAt: Date;

    @ApiProperty({ description: 'File URL' })
    fileUrl: string;

    @ApiPropertyOptional({ description: 'Document expiry date' })
    expiryDate?: Date;

    @ApiPropertyOptional({ description: 'Issuing authority' })
    issuingAuthority?: string;

    @ApiProperty({
        description: 'Verification status',
        enum: ['pending', 'verified', 'rejected', 'expired']
    })
    verificationStatus: string;

    @ApiPropertyOptional({ description: 'Verification notes' })
    verificationNotes?: string;

    @ApiPropertyOptional({ description: 'Verified by admin ID' })
    verifiedBy?: string;

    @ApiPropertyOptional({ description: 'Verification date' })
    verifiedAt?: Date;
}

export class MerchantAuditLogDto {
    @ApiProperty({ description: 'Audit log entry ID' })
    id: string;

    @ApiProperty({ description: 'Merchant ID' })
    merchantId: string;

    @ApiProperty({
        description: 'Action performed',
        example: 'status_change',
        enum: [
            'application_submitted',
            'document_uploaded',
            'status_change',
            'profile_updated',
            'user_added',
            'user_removed',
            'document_verified',
            'note_added'
        ]
    })
    action: string;

    @ApiProperty({
        description: 'Details of the action',
        example: 'Status changed from PENDING to APPROVED'
    })
    details: string;

    @ApiProperty({ description: 'User who performed the action' })
    performedBy: string;

    @ApiProperty({ description: 'User details' })
    performedByUser: {
        id: string;
        email: string;
        displayName: string;
    };

    @ApiPropertyOptional({ description: 'Previous value (for updates)' })
    previousValue?: string;

    @ApiPropertyOptional({ description: 'New value (for updates)' })
    newValue?: string;

    @ApiProperty({ description: 'Timestamp of action' })
    timestamp: Date;

    @ApiPropertyOptional({ description: 'Additional metadata' })
    metadata?: Record<string, any>;
}

export class MerchantAuditLogResponseDto {
    @ApiProperty({ description: 'List of audit log entries', type: [MerchantAuditLogDto] })
    logs: MerchantAuditLogDto[];

    @ApiProperty({ description: 'Pagination information' })
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
