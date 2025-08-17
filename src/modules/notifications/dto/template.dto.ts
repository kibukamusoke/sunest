import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsInt, Min } from 'class-validator';
import { EmailTemplateType, NotificationCategory } from '@prisma/client';

export class CreateTemplateDto {
    @ApiProperty({ description: 'Template name/identifier' })
    @IsString()
    name: string;

    @ApiProperty({ enum: EmailTemplateType, description: 'Template type' })
    @IsEnum(EmailTemplateType)
    type: EmailTemplateType;

    @ApiProperty({ enum: NotificationCategory, description: 'Template category' })
    @IsEnum(NotificationCategory)
    category: NotificationCategory;

    @ApiProperty({ description: 'Email subject template' })
    @IsString()
    subject: string;

    @ApiProperty({ description: 'Plain text body template' })
    @IsString()
    bodyText: string;

    @ApiProperty({ description: 'HTML body template' })
    @IsString()
    bodyHtml: string;

    @ApiPropertyOptional({ description: 'Available template variables' })
    @IsObject()
    @IsOptional()
    variables?: any;

    @ApiPropertyOptional({ description: 'Template description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Template active status' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateTemplateDto {
    @ApiPropertyOptional({ description: 'Template name/identifier' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Email subject template' })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiPropertyOptional({ description: 'Plain text body template' })
    @IsString()
    @IsOptional()
    bodyText?: string;

    @ApiPropertyOptional({ description: 'HTML body template' })
    @IsString()
    @IsOptional()
    bodyHtml?: string;

    @ApiPropertyOptional({ description: 'Available template variables' })
    @IsObject()
    @IsOptional()
    variables?: any;

    @ApiPropertyOptional({ description: 'Template description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Template active status' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class TemplateResponseDto {
    @ApiProperty({ description: 'Template ID' })
    id: string;

    @ApiProperty({ description: 'Template name/identifier' })
    name: string;

    @ApiProperty({ enum: EmailTemplateType, description: 'Template type' })
    type: EmailTemplateType;

    @ApiProperty({ enum: NotificationCategory, description: 'Template category' })
    category: NotificationCategory;

    @ApiProperty({ description: 'Email subject template' })
    subject: string;

    @ApiProperty({ description: 'Plain text body template' })
    bodyText: string;

    @ApiProperty({ description: 'HTML body template' })
    bodyHtml: string;

    @ApiPropertyOptional({ description: 'Available template variables' })
    variables?: any;

    @ApiPropertyOptional({ description: 'Template description' })
    description?: string;

    @ApiProperty({ description: 'Template active status' })
    isActive: boolean;

    @ApiProperty({ description: 'Template version' })
    version: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class TemplateListQueryDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Page size' })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ enum: EmailTemplateType, description: 'Filter by type' })
    @IsEnum(EmailTemplateType)
    @IsOptional()
    type?: EmailTemplateType;

    @ApiPropertyOptional({ enum: NotificationCategory, description: 'Filter by category' })
    @IsEnum(NotificationCategory)
    @IsOptional()
    category?: NotificationCategory;

    @ApiPropertyOptional({ description: 'Filter by active status' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Search by name' })
    @IsString()
    @IsOptional()
    search?: string;
}

export class TemplateListResponseDto {
    @ApiProperty({ type: [TemplateResponseDto], description: 'List of templates' })
    templates: TemplateResponseDto[];

    @ApiProperty({ description: 'Total count' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Page size' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class RenderTemplateDto {
    @ApiProperty({ description: 'Template data/variables' })
    @IsObject()
    data: Record<string, any>;
}

export class RenderedTemplateDto {
    @ApiProperty({ description: 'Rendered subject' })
    subject: string;

    @ApiProperty({ description: 'Rendered plain text body' })
    bodyText: string;

    @ApiProperty({ description: 'Rendered HTML body' })
    bodyHtml: string;
}
