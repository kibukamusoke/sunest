import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsArray,
    IsUUID,
    IsBoolean,
    IsNotEmpty,
    ArrayMaxSize,
    MaxLength,
} from 'class-validator';

export class CreateRFQCommentDto {
    @ApiProperty({
        description: 'Comment content',
        example: 'Can you provide more details about the technical specifications?',
        maxLength: 2000,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;

    @ApiPropertyOptional({
        description: 'Whether this is an internal comment (not visible to requesters)',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    isInternal?: boolean = false;

    @ApiPropertyOptional({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/comments/clarification.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    attachments?: string[];
}

export class CreateQuoteCommentDto {
    @ApiProperty({
        description: 'Comment content',
        example: 'We can offer additional volume discounts for larger quantities.',
        maxLength: 2000,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;

    @ApiPropertyOptional({
        description: 'Whether this is an internal comment (not visible to customers)',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    isInternal?: boolean = false;

    @ApiPropertyOptional({
        description: 'File attachment URLs',
        example: ['https://storage.example.com/comments/additional-specs.pdf'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    attachments?: string[];
}

export class RFQCommentResponseDto {
    @ApiProperty({
        description: 'Comment ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'RFQ ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    rfqId: string;

    @ApiProperty({
        description: 'Author information',
    })
    author: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiProperty({
        description: 'Comment content',
        example: 'Can you provide more details about the technical specifications?',
    })
    content: string;

    @ApiProperty({
        description: 'Whether this is an internal comment',
        example: false,
    })
    isInternal: boolean;

    @ApiPropertyOptional({
        description: 'File attachments',
        example: ['https://storage.example.com/comments/clarification.pdf'],
    })
    attachments?: string[];

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: string;
}

export class QuoteCommentResponseDto {
    @ApiProperty({
        description: 'Comment ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    id: string;

    @ApiProperty({
        description: 'Quote ID',
        example: '12345678-1234-1234-1234-123456789012',
    })
    quoteId: string;

    @ApiProperty({
        description: 'Author information',
    })
    author: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiProperty({
        description: 'Comment content',
        example: 'We can offer additional volume discounts for larger quantities.',
    })
    content: string;

    @ApiProperty({
        description: 'Whether this is an internal comment',
        example: false,
    })
    isInternal: boolean;

    @ApiPropertyOptional({
        description: 'File attachments',
        example: ['https://storage.example.com/comments/additional-specs.pdf'],
    })
    attachments?: string[];

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: string;
}

export class CommentListDto<T> {
    @ApiProperty({
        description: 'List of comments',
    })
    comments: T[];

    @ApiProperty({
        description: 'Total number of comments',
        example: 5,
    })
    total: number;

    @ApiProperty({
        description: 'Number of public comments',
        example: 3,
    })
    publicCount: number;

    @ApiProperty({
        description: 'Number of internal comments',
        example: 2,
    })
    internalCount: number;
}

export class RFQCommentListDto extends CommentListDto<RFQCommentResponseDto> {
    @ApiProperty({
        description: 'List of RFQ comments',
        type: [RFQCommentResponseDto],
    })
    declare comments: RFQCommentResponseDto[];
}

export class QuoteCommentListDto extends CommentListDto<QuoteCommentResponseDto> {
    @ApiProperty({
        description: 'List of quote comments',
        type: [QuoteCommentResponseDto],
    })
    declare comments: QuoteCommentResponseDto[];
}
