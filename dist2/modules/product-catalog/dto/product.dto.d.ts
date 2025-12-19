import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    displayName?: string;
    description?: string;
    shortDescription?: string;
    sku: string;
    barcode?: string;
    mpn?: string;
    categoryId: string;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    basePrice: number;
    msrp?: number;
    costPrice?: number;
    images?: string[];
    videos?: string[];
    documents?: string[];
    isDigital?: boolean;
    trackInventory?: boolean;
    minimumOrderQuantity?: number;
    orderMultiple?: number;
    slug: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateProductDto {
    name?: string;
    displayName?: string;
    description?: string;
    shortDescription?: string;
    barcode?: string;
    mpn?: string;
    categoryId?: string;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    basePrice?: number;
    msrp?: number;
    costPrice?: number;
    images?: string[];
    videos?: string[];
    documents?: string[];
    status?: ProductStatus;
    isActive?: boolean;
    isDigital?: boolean;
    trackInventory?: boolean;
    minimumOrderQuantity?: number;
    orderMultiple?: number;
    slug?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
}
export declare class ProductResponseDto {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    shortDescription?: string;
    sku: string;
    barcode?: string;
    mpn?: string;
    categoryId: string;
    merchantId: string;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    basePrice: number;
    msrp?: number;
    costPrice?: number;
    images: string[];
    videos: string[];
    documents: string[];
    status: ProductStatus;
    isActive: boolean;
    isDigital: boolean;
    trackInventory: boolean;
    minimumOrderQuantity: number;
    orderMultiple: number;
    slug: string;
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
    category?: {
        id: string;
        name: string;
        displayName?: string;
    };
    merchant?: {
        id: string;
        name: string;
        businessName?: string;
    };
    variants?: any[];
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductListDto {
    products: ProductResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class ProductSearchDto {
    search?: string;
    categoryId?: string;
    merchantId?: string;
    status?: ProductStatus;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
