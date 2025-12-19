import { EmailTemplateType, NotificationCategory } from '@prisma/client';
export declare class CreateTemplateDto {
    name: string;
    type: EmailTemplateType;
    category: NotificationCategory;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    variables?: any;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateTemplateDto {
    name?: string;
    subject?: string;
    bodyText?: string;
    bodyHtml?: string;
    variables?: any;
    description?: string;
    isActive?: boolean;
}
export declare class TemplateResponseDto {
    id: string;
    name: string;
    type: EmailTemplateType;
    category: NotificationCategory;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    variables?: any;
    description?: string;
    isActive: boolean;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TemplateListQueryDto {
    page?: number;
    limit?: number;
    type?: EmailTemplateType;
    category?: NotificationCategory;
    isActive?: boolean;
    search?: string;
}
export declare class TemplateListResponseDto {
    templates: TemplateResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class RenderTemplateDto {
    data: Record<string, any>;
}
export declare class RenderedTemplateDto {
    subject: string;
    bodyText: string;
    bodyHtml: string;
}
