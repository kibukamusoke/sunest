export declare class CreateProductVariantDto {
    sku: string;
    name: string;
    attributes: string;
    price?: number;
    costPrice?: number;
    weight?: number;
    barcode?: string;
    mpn?: string;
    images?: string[];
    minimumOrderQuantity?: number;
    orderMultiple?: number;
    isDefault?: boolean;
}
export declare class UpdateProductVariantDto {
    name?: string;
    attributes?: string;
    price?: number;
    costPrice?: number;
    weight?: number;
    barcode?: string;
    mpn?: string;
    images?: string[];
    minimumOrderQuantity?: number;
    orderMultiple?: number;
    isActive?: boolean;
    isDefault?: boolean;
}
export declare class ProductVariantResponseDto {
    id: string;
    productId: string;
    sku: string;
    name: string;
    attributes: object;
    price?: number;
    costPrice?: number;
    weight?: number;
    barcode?: string;
    mpn?: string;
    images: string[];
    minimumOrderQuantity: number;
    orderMultiple: number;
    isActive: boolean;
    isDefault: boolean;
    product?: {
        id: string;
        name: string;
        basePrice: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductVariantListDto {
    variants: ProductVariantResponseDto[];
    totalCount: number;
}
export declare class BulkCreateVariantsDto {
    variants: CreateProductVariantDto[];
}
export declare class BulkUpdateVariantsDto {
    variants: Array<{
        id: string;
        data: UpdateProductVariantDto;
    }>;
}
export declare class VariantAttributeDto {
    name: string;
    displayName: string;
    values: string[];
    required: boolean;
}
export declare class GenerateVariantsDto {
    attributes: VariantAttributeDto[];
    baseSkuPattern?: string;
    setFirstAsDefault?: boolean;
}
