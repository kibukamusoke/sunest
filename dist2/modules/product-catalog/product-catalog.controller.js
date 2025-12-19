"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCatalogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const product_catalog_service_1 = require("./product-catalog.service");
const dto_1 = require("./dto");
let ProductCatalogController = class ProductCatalogController {
    constructor(productCatalogService) {
        this.productCatalogService = productCatalogService;
    }
    async createCategory(createCategoryDto, req) {
        return this.productCatalogService.createCategory(createCategoryDto, req.user.userId);
    }
    async getCategoryHierarchy(includeProducts = false, activeOnly = true) {
        return this.productCatalogService.getCategoryHierarchy(includeProducts, activeOnly);
    }
    async getCategoryById(categoryId, includeProducts = false) {
        return this.productCatalogService.getCategoryById(categoryId, includeProducts);
    }
    async updateCategory(categoryId, updateCategoryDto, req) {
        return this.productCatalogService.updateCategory(categoryId, updateCategoryDto, req.user.userId);
    }
    async deleteCategory(categoryId) {
        return this.productCatalogService.deleteCategory(categoryId);
    }
    async createProduct(createProductDto, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.createProduct(createProductDto, merchantId, req.user.userId);
    }
    async getProducts(searchDto) {
        return this.productCatalogService.getProducts(searchDto, undefined);
    }
    async getMerchantProducts(searchDto, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.getProducts(searchDto, merchantId);
    }
    async getAttributeTemplates(categoryId, type, requiredOnly, filterableOnly, variantOnly, activeOnly) {
        const filter = {
            categoryId,
            type: type,
            requiredOnly,
            filterableOnly,
            variantOnly,
            activeOnly,
        };
        return this.productCatalogService.getAttributeTemplates(filter);
    }
    async getAdminProductById(productId, includeVariants = true) {
        return this.productCatalogService.getProductById(productId, includeVariants, false);
    }
    async getProductById(productId, includeVariants = true) {
        return this.productCatalogService.getProductById(productId, includeVariants, true);
    }
    async getMerchantProductById(productId, includeVariants = true, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.getProductById(productId, includeVariants, false, merchantId);
    }
    async updateProduct(productId, updateProductDto, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.updateProduct(productId, updateProductDto, req.user.userId, merchantId);
    }
    async deleteProduct(productId, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.deleteProduct(productId, merchantId);
    }
    async submitProductForApproval(productId, req) {
        return this.productCatalogService.submitProductForApproval(productId, req.user.userId);
    }
    async approveProduct(productId, req) {
        return this.productCatalogService.approveProduct(productId, req.user.userId);
    }
    async rejectProduct(productId, body, req) {
        return this.productCatalogService.rejectProduct(productId, body.reason, req.user.userId);
    }
    async createProductVariant(productId, createVariantDto, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.productCatalogService.createProductVariant(productId, createVariantDto, merchantId);
    }
    async getProductVariants(productId) {
        return this.productCatalogService.getProductVariants(productId);
    }
    async updateProductVariant(variantId, updateVariantDto) {
        return this.productCatalogService.updateProductVariant(variantId, updateVariantDto);
    }
    async deleteProductVariant(variantId) {
        return this.productCatalogService.deleteProductVariant(variantId);
    }
    async createAttributeTemplate(categoryId, createAttributeDto, req) {
        createAttributeDto.categoryId = categoryId;
        return this.productCatalogService.createAttributeTemplate(createAttributeDto, req.user.userId);
    }
    async updateAttributeTemplate(attributeId, updateAttributeDto) {
        return this.productCatalogService.updateAttributeTemplate(attributeId, updateAttributeDto);
    }
    async deleteAttributeTemplate(attributeId) {
        return this.productCatalogService.deleteAttributeTemplate(attributeId);
    }
};
exports.ProductCatalogController = ProductCatalogController;
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new product category',
        description: 'Create a new product category. Only system administrators can create categories.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateCategoryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Category created successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Category with this name or slug already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Parent category not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category hierarchy',
        description: 'Retrieve all categories in a hierarchical structure.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeProducts',
        required: false,
        type: Boolean,
        description: 'Include product count for each category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'activeOnly',
        required: false,
        type: Boolean,
        description: 'Only return active categories',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Category hierarchy retrieved successfully',
        type: dto_1.CategoryHierarchyDto,
    }),
    __param(0, (0, common_1.Query)('includeProducts', new common_1.ParseBoolPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('activeOnly', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getCategoryHierarchy", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by ID',
        description: 'Retrieve a specific category by its ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeProducts',
        required: false,
        type: Boolean,
        description: 'Include product count for the category',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Category retrieved successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeProducts', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Put)('categories/:categoryId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a category',
        description: 'Update an existing category. Only system administrators can update categories.',
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateCategoryDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Category updated successfully',
        type: dto_1.CategoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Category with this slug already exists',
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:categoryId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a category',
        description: 'Delete a category. Only system administrators can delete categories. Cannot delete categories with products or subcategories.',
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Category deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Cannot delete category with existing products or subcategories',
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new product',
        description: 'Create a new product. Only merchant administrators can create products.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateProductDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Product created successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Product with this SKU or slug already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get products with filtering and search (Public)',
        description: 'Retrieve products with various filtering options. Public endpoint - only shows published products.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Products retrieved successfully',
        type: dto_1.ProductListDto,
    }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProductSearchDto]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('my-products'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant products',
        description: 'Retrieve products for the authenticated merchant only.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Merchant products retrieved successfully',
        type: dto_1.ProductListDto,
    }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProductSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getMerchantProducts", null);
__decorate([
    (0, common_1.Get)('attributes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product attribute templates',
        description: 'Retrieve attribute templates with optional filtering.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        description: 'Category ID to filter attributes',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Attribute type filter',
        enum: [
            'TEXT',
            'NUMBER',
            'BOOLEAN',
            'SELECT',
            'MULTI_SELECT',
            'DATE',
            'URL',
            'EMAIL',
        ],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'requiredOnly',
        required: false,
        description: 'Filter by required attributes only',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filterableOnly',
        required: false,
        description: 'Filter by filterable attributes only',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'variantOnly',
        required: false,
        description: 'Filter by variant attributes only',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'activeOnly',
        required: false,
        description: 'Filter by active attributes only',
        type: Boolean,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Attribute templates retrieved successfully',
        type: dto_1.ProductAttributeTemplateListDto,
    }),
    __param(0, (0, common_1.Query)('categoryId', new common_1.ParseUUIDPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('requiredOnly', new common_1.ParseBoolPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('filterableOnly', new common_1.ParseBoolPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('variantOnly', new common_1.ParseBoolPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('activeOnly', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Boolean, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getAttributeTemplates", null);
__decorate([
    (0, common_1.Get)('admin/:productId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by ID (Admin)',
        description: 'Retrieve a specific product by its ID. System admin endpoint - returns products in any status except DELETED.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeVariants',
        required: false,
        type: Boolean,
        description: 'Include product variants',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product retrieved successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeVariants', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getAdminProductById", null);
__decorate([
    (0, common_1.Get)(':productId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by ID (Public)',
        description: 'Retrieve a specific product by its ID. Public endpoint - only shows published products.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeVariants',
        required: false,
        type: Boolean,
        description: 'Include product variants',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product retrieved successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeVariants', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('my-products/:productId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant product by ID',
        description: 'Retrieve a specific product by its ID for the authenticated merchant only.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeVariants',
        required: false,
        type: Boolean,
        description: 'Include product variants',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product retrieved successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeVariants', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getMerchantProductById", null);
__decorate([
    (0, common_1.Put)(':productId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product',
        description: 'Update an existing product. Only merchant administrators can update products.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateProductDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product updated successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Product with this slug already exists',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a product',
        description: 'Delete a product. Only merchant administrators can delete products.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Product deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)(':productId/submit-for-approval'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit product for approval',
        description: 'Submit a draft product for admin approval.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product submitted for approval successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Only draft products can be submitted for approval',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "submitProductForApproval", null);
__decorate([
    (0, common_1.Post)(':productId/approve'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve a product',
        description: 'Approve a product that is pending review. Only system administrators can approve products.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product approved successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Only products pending review can be approved',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "approveProduct", null);
__decorate([
    (0, common_1.Post)(':productId/reject'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject a product',
        description: 'Reject a product that is pending review. Only system administrators can reject products.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                reason: {
                    type: 'string',
                    description: 'Reason for rejection',
                    example: 'Product description is incomplete',
                },
            },
            required: ['reason'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product rejected successfully',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Only products pending review can be rejected',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "rejectProduct", null);
__decorate([
    (0, common_1.Post)(':productId/variants'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a product variant',
        description: 'Create a new variant for an existing product.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateProductVariantDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Product variant created successfully',
        type: dto_1.ProductVariantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Product variant with this SKU already exists',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateProductVariantDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "createProductVariant", null);
__decorate([
    (0, common_1.Get)(':productId/variants'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product variants',
        description: 'Retrieve all variants for a specific product.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product variants retrieved successfully',
        type: dto_1.ProductVariantListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "getProductVariants", null);
__decorate([
    (0, common_1.Put)('variants/:variantId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product variant',
        description: 'Update an existing product variant.',
    }),
    (0, swagger_1.ApiParam)({ name: 'variantId', description: 'Variant ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateProductVariantDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product variant updated successfully',
        type: dto_1.ProductVariantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product variant not found',
    }),
    __param(0, (0, common_1.Param)('variantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductVariantDto]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "updateProductVariant", null);
__decorate([
    (0, common_1.Delete)('variants/:variantId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireProductManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a product variant',
        description: 'Delete a product variant.',
    }),
    (0, swagger_1.ApiParam)({ name: 'variantId', description: 'Variant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Product variant deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product variant not found',
    }),
    __param(0, (0, common_1.Param)('variantId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "deleteProductVariant", null);
__decorate([
    (0, common_1.Post)('categories/:categoryId/attributes'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a product attribute template',
        description: 'Create a new attribute template for a category. Only system administrators can create attribute templates.',
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateProductAttributeTemplateDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Attribute template created successfully',
        type: dto_1.ProductAttributeTemplateResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Attribute with this name already exists for this category',
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateProductAttributeTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "createAttributeTemplate", null);
__decorate([
    (0, common_1.Put)('attributes/:attributeId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product attribute template',
        description: 'Update an existing attribute template. Only system administrators can update attribute templates.',
    }),
    (0, swagger_1.ApiParam)({ name: 'attributeId', description: 'Attribute template ID' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateProductAttributeTemplateDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Attribute template updated successfully',
        type: dto_1.ProductAttributeTemplateResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Attribute template not found',
    }),
    __param(0, (0, common_1.Param)('attributeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductAttributeTemplateDto]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "updateAttributeTemplate", null);
__decorate([
    (0, common_1.Delete)('attributes/:attributeId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a product attribute template',
        description: 'Delete an attribute template. Only system administrators can delete attribute templates.',
    }),
    (0, swagger_1.ApiParam)({ name: 'attributeId', description: 'Attribute template ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Attribute template deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Attribute template not found',
    }),
    __param(0, (0, common_1.Param)('attributeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductCatalogController.prototype, "deleteAttributeTemplate", null);
exports.ProductCatalogController = ProductCatalogController = __decorate([
    (0, swagger_1.ApiTags)('Product Catalog'),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_catalog_service_1.ProductCatalogService])
], ProductCatalogController);
//# sourceMappingURL=product-catalog.controller.js.map