export declare class CreateCategoryDto {
    name: string;
    displayName?: string;
    description?: string;
    parentId?: string;
    slug: string;
    imageUrl?: string;
    sortOrder?: number;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateCategoryDto {
    displayName?: string;
    description?: string;
    parentId?: string;
    slug?: string;
    imageUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class CategoryResponseDto {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive: boolean;
    sortOrder: number;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    children?: CategoryResponseDto[];
    productCount?: number;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CategoryHierarchyDto {
    categories: CategoryResponseDto[];
    totalCount: number;
    activeCount: number;
}
