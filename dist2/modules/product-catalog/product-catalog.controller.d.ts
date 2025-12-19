import { ProductCatalogService } from './product-catalog.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto, CategoryHierarchyDto, CreateProductDto, UpdateProductDto, ProductResponseDto, ProductListDto, ProductSearchDto, CreateProductVariantDto, UpdateProductVariantDto, ProductVariantResponseDto, ProductVariantListDto, CreateProductAttributeTemplateDto, UpdateProductAttributeTemplateDto, ProductAttributeTemplateResponseDto, ProductAttributeTemplateListDto } from './dto';
export declare class ProductCatalogController {
    private readonly productCatalogService;
    constructor(productCatalogService: ProductCatalogService);
    createCategory(createCategoryDto: CreateCategoryDto, req: any): Promise<CategoryResponseDto>;
    getCategoryHierarchy(includeProducts?: boolean, activeOnly?: boolean): Promise<CategoryHierarchyDto>;
    getCategoryById(categoryId: string, includeProducts?: boolean): Promise<CategoryResponseDto>;
    updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto, req: any): Promise<CategoryResponseDto>;
    deleteCategory(categoryId: string): Promise<void>;
    createProduct(createProductDto: CreateProductDto, req: any): Promise<ProductResponseDto>;
    getProducts(searchDto: ProductSearchDto): Promise<ProductListDto>;
    getMerchantProducts(searchDto: ProductSearchDto, req: any): Promise<ProductListDto>;
    getAttributeTemplates(categoryId?: string, type?: string, requiredOnly?: boolean, filterableOnly?: boolean, variantOnly?: boolean, activeOnly?: boolean): Promise<ProductAttributeTemplateListDto>;
    getAdminProductById(productId: string, includeVariants?: boolean): Promise<ProductResponseDto>;
    getProductById(productId: string, includeVariants?: boolean): Promise<ProductResponseDto>;
    getMerchantProductById(productId: string, includeVariants: boolean | undefined, req: any): Promise<ProductResponseDto>;
    updateProduct(productId: string, updateProductDto: UpdateProductDto, req: any): Promise<ProductResponseDto>;
    deleteProduct(productId: string, req: any): Promise<void>;
    submitProductForApproval(productId: string, req: any): Promise<ProductResponseDto>;
    approveProduct(productId: string, req: any): Promise<ProductResponseDto>;
    rejectProduct(productId: string, body: {
        reason: string;
    }, req: any): Promise<ProductResponseDto>;
    createProductVariant(productId: string, createVariantDto: CreateProductVariantDto, req: any): Promise<ProductVariantResponseDto>;
    getProductVariants(productId: string): Promise<ProductVariantListDto>;
    updateProductVariant(variantId: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariantResponseDto>;
    deleteProductVariant(variantId: string): Promise<void>;
    createAttributeTemplate(categoryId: string, createAttributeDto: CreateProductAttributeTemplateDto, req: any): Promise<ProductAttributeTemplateResponseDto>;
    updateAttributeTemplate(attributeId: string, updateAttributeDto: UpdateProductAttributeTemplateDto): Promise<ProductAttributeTemplateResponseDto>;
    deleteAttributeTemplate(attributeId: string): Promise<void>;
}
