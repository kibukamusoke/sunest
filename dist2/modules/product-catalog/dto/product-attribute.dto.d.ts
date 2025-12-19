import { AttributeType } from '@prisma/client';
export declare class CreateProductAttributeTemplateDto {
    name: string;
    displayName?: string;
    description?: string;
    type: AttributeType;
    isRequired?: boolean;
    isFilterable?: boolean;
    isVariant?: boolean;
    options?: string[];
    validation?: string;
    categoryId: string;
    sortOrder?: number;
    unit?: string;
}
export declare class UpdateProductAttributeTemplateDto {
    displayName?: string;
    description?: string;
    type?: AttributeType;
    isRequired?: boolean;
    isFilterable?: boolean;
    isVariant?: boolean;
    options?: string[];
    validation?: string;
    sortOrder?: number;
    unit?: string;
    isActive?: boolean;
}
export declare class ProductAttributeTemplateResponseDto {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    type: AttributeType;
    isRequired: boolean;
    isFilterable: boolean;
    isVariant: boolean;
    options: string[];
    validation?: object;
    categoryId?: string;
    sortOrder: number;
    unit?: string;
    isActive: boolean;
    category?: {
        id: string;
        name: string;
        displayName?: string;
    };
    inheritedFrom?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductAttributeTemplateListDto {
    attributes: ProductAttributeTemplateResponseDto[];
    totalCount: number;
    activeCount: number;
}
export declare class BulkCreateAttributeTemplatesDto {
    attributes: CreateProductAttributeTemplateDto[];
}
export declare class AttributeValueDto {
    attributeId: string;
    value: string;
}
export declare class ProductAttributeValueDto {
    productId: string;
    attributes: AttributeValueDto[];
}
export declare class AttributeFilterDto {
    categoryId?: string;
    type?: AttributeType;
    requiredOnly?: boolean;
    filterableOnly?: boolean;
    variantOnly?: boolean;
    activeOnly?: boolean;
}
