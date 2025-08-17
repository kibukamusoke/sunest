import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseBoolPipe,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SystemAdmin, MerchantAdmin, MerchantUser } from '../../common/decorators/roles.decorator';
import { RequireSystemManage, RequireProductManage } from '../../common/decorators/permissions.decorator';
import { ProductCatalogService } from './product-catalog.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategoryHierarchyDto,
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductListDto,
  ProductSearchDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductVariantResponseDto,
  ProductVariantListDto,
  CreateProductAttributeTemplateDto,
  UpdateProductAttributeTemplateDto,
  ProductAttributeTemplateResponseDto,
  ProductAttributeTemplateListDto,
  AttributeFilterDto,
} from './dto';

@ApiTags('Product Catalog')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductCatalogController {
  constructor(private readonly productCatalogService: ProductCatalogService) { }

  // ==================== CATEGORY MANAGEMENT ====================

  @Post('categories')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Create a new product category',
    description: 'Create a new product category. Only system administrators can create categories.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this name or slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Parent category not found',
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: any,
  ): Promise<CategoryResponseDto> {
    return this.productCatalogService.createCategory(createCategoryDto, req.user.userId);
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Get category hierarchy',
    description: 'Retrieve all categories in a hierarchical structure.',
  })
  @ApiQuery({
    name: 'includeProducts',
    required: false,
    type: Boolean,
    description: 'Include product count for each category',
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Only return active categories',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category hierarchy retrieved successfully',
    type: CategoryHierarchyDto,
  })
  async getCategoryHierarchy(
    @Query('includeProducts', new ParseBoolPipe({ optional: true })) includeProducts = false,
    @Query('activeOnly', new ParseBoolPipe({ optional: true })) activeOnly = true,
  ): Promise<CategoryHierarchyDto> {
    return this.productCatalogService.getCategoryHierarchy(includeProducts, activeOnly);
  }

  @Get('categories/:categoryId')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve a specific category by its ID.',
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({
    name: 'includeProducts',
    required: false,
    type: Boolean,
    description: 'Include product count for the category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async getCategoryById(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query('includeProducts', new ParseBoolPipe({ optional: true })) includeProducts = false,
  ): Promise<CategoryResponseDto> {
    return this.productCatalogService.getCategoryById(categoryId, includeProducts);
  }

  @Put('categories/:categoryId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Update a category',
    description: 'Update an existing category. Only system administrators can update categories.',
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this slug already exists',
  })
  async updateCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ): Promise<CategoryResponseDto> {
    return this.productCatalogService.updateCategory(categoryId, updateCategoryDto, req.user.userId);
  }

  @Delete('categories/:categoryId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Delete a category. Only system administrators can delete categories. Cannot delete categories with products or subcategories.',
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with existing products or subcategories',
  })
  async deleteCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string): Promise<void> {
    return this.productCatalogService.deleteCategory(categoryId);
  }

  // ==================== PRODUCT MANAGEMENT ====================

  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product. Only merchant administrators can create products.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product with this SKU or slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    // Get merchant ID from user context
    const merchantId = req.user.merchants?.[0]?.id;
    if (!merchantId) {
      throw new Error('User is not associated with any merchant');
    }

    return this.productCatalogService.createProduct(createProductDto, merchantId, req.user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get products with filtering and search',
    description: 'Retrieve products with various filtering options.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: ProductListDto,
  })
  async getProducts(
    @Query(new ValidationPipe({ transform: true })) searchDto: ProductSearchDto,
    @Request() req: any,
  ): Promise<ProductListDto> {
    // If user is a merchant, filter by their merchant ID
    const merchantId = req.user.roles?.includes('system_admin') ? undefined : req.user.merchants?.[0]?.id;

    return this.productCatalogService.getProducts(searchDto, merchantId);
  }

  // ==================== PRODUCT ATTRIBUTE TEMPLATE MANAGEMENT ====================

  @Get('attributes')
  @ApiOperation({
    summary: 'Get product attribute templates',
    description: 'Retrieve attribute templates with optional filtering.',
  })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Category ID to filter attributes', type: String })
  @ApiQuery({ name: 'type', required: false, description: 'Attribute type filter', enum: ['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'DATE', 'URL', 'EMAIL'] })
  @ApiQuery({ name: 'requiredOnly', required: false, description: 'Filter by required attributes only', type: Boolean })
  @ApiQuery({ name: 'filterableOnly', required: false, description: 'Filter by filterable attributes only', type: Boolean })
  @ApiQuery({ name: 'variantOnly', required: false, description: 'Filter by variant attributes only', type: Boolean })
  @ApiQuery({ name: 'activeOnly', required: false, description: 'Filter by active attributes only', type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attribute templates retrieved successfully',
    type: ProductAttributeTemplateListDto,
  })
  async getAttributeTemplates(
    @Query('categoryId', new ParseUUIDPipe({ optional: true })) categoryId?: string,
    @Query('type') type?: string,
    @Query('requiredOnly', new ParseBoolPipe({ optional: true })) requiredOnly?: boolean,
    @Query('filterableOnly', new ParseBoolPipe({ optional: true })) filterableOnly?: boolean,
    @Query('variantOnly', new ParseBoolPipe({ optional: true })) variantOnly?: boolean,
    @Query('activeOnly', new ParseBoolPipe({ optional: true })) activeOnly?: boolean,
  ): Promise<ProductAttributeTemplateListDto> {
    const filter: AttributeFilterDto = {
      categoryId,
      type: type as any,
      requiredOnly,
      filterableOnly,
      variantOnly,
      activeOnly,
    };
    return this.productCatalogService.getAttributeTemplates(filter);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({
    name: 'includeVariants',
    required: false,
    type: Boolean,
    description: 'Include product variants',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductById(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('includeVariants', new ParseBoolPipe({ optional: true })) includeVariants = true,
  ): Promise<ProductResponseDto> {
    return this.productCatalogService.getProductById(productId, includeVariants);
  }

  @Put(':productId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update an existing product. Only merchant administrators can update products.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product with this slug already exists',
  })
  async updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    return this.productCatalogService.updateProduct(productId, updateProductDto, req.user.userId);
  }

  @Delete(':productId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product. Only merchant administrators can delete products.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async deleteProduct(@Param('productId', ParseUUIDPipe) productId: string): Promise<void> {
    return this.productCatalogService.deleteProduct(productId);
  }

  @Post(':productId/submit-for-approval')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Submit product for approval',
    description: 'Submit a draft product for admin approval.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product submitted for approval successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Only draft products can be submitted for approval',
  })
  async submitProductForApproval(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    return this.productCatalogService.submitProductForApproval(productId, req.user.userId);
  }

  @Post(':productId/approve')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Approve a product',
    description: 'Approve a product that is pending review. Only system administrators can approve products.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product approved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Only products pending review can be approved',
  })
  async approveProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    return this.productCatalogService.approveProduct(productId, req.user.userId);
  }

  @Post(':productId/reject')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Reject a product',
    description: 'Reject a product that is pending review. Only system administrators can reject products.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiBody({
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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product rejected successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Only products pending review can be rejected',
  })
  async rejectProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: { reason: string },
    @Request() req: any,
  ): Promise<ProductResponseDto> {
    return this.productCatalogService.rejectProduct(productId, body.reason, req.user.userId);
  }

  // ==================== PRODUCT VARIANT MANAGEMENT ====================

  @Post(':productId/variants')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Create a product variant',
    description: 'Create a new variant for an existing product.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiBody({ type: CreateProductVariantDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product variant created successfully',
    type: ProductVariantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product variant with this SKU already exists',
  })
  async createProductVariant(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    return this.productCatalogService.createProductVariant(productId, createVariantDto);
  }

  @Get(':productId/variants')
  @ApiOperation({
    summary: 'Get product variants',
    description: 'Retrieve all variants for a specific product.',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product variants retrieved successfully',
    type: ProductVariantListDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductVariants(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductVariantListDto> {
    return this.productCatalogService.getProductVariants(productId);
  }

  @Put('variants/:variantId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Update a product variant',
    description: 'Update an existing product variant.',
  })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product variant updated successfully',
    type: ProductVariantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product variant not found',
  })
  async updateProductVariant(
    @Param('variantId', ParseUUIDPipe) variantId: string,
    @Body() updateVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    return this.productCatalogService.updateProductVariant(variantId, updateVariantDto);
  }

  @Delete('variants/:variantId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireProductManage()
  @ApiOperation({
    summary: 'Delete a product variant',
    description: 'Delete a product variant.',
  })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product variant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product variant not found',
  })
  async deleteProductVariant(@Param('variantId', ParseUUIDPipe) variantId: string): Promise<void> {
    return this.productCatalogService.deleteProductVariant(variantId);
  }

  @Post('categories/:categoryId/attributes')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Create a product attribute template',
    description: 'Create a new attribute template for a category. Only system administrators can create attribute templates.',
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiBody({ type: CreateProductAttributeTemplateDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attribute template created successfully',
    type: ProductAttributeTemplateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Attribute with this name already exists for this category',
  })
  async createAttributeTemplate(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() createAttributeDto: CreateProductAttributeTemplateDto,
    @Request() req: any,
  ): Promise<ProductAttributeTemplateResponseDto> {
    // Override categoryId from URL param
    createAttributeDto.categoryId = categoryId;
    return this.productCatalogService.createAttributeTemplate(createAttributeDto, req.user.userId);
  }



  @Put('attributes/:attributeId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Update a product attribute template',
    description: 'Update an existing attribute template. Only system administrators can update attribute templates.',
  })
  @ApiParam({ name: 'attributeId', description: 'Attribute template ID' })
  @ApiBody({ type: UpdateProductAttributeTemplateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attribute template updated successfully',
    type: ProductAttributeTemplateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attribute template not found',
  })
  async updateAttributeTemplate(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() updateAttributeDto: UpdateProductAttributeTemplateDto,
  ): Promise<ProductAttributeTemplateResponseDto> {
    return this.productCatalogService.updateAttributeTemplate(attributeId, updateAttributeDto);
  }

  @Delete('attributes/:attributeId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @SystemAdmin()
  @RequireSystemManage()
  @ApiOperation({
    summary: 'Delete a product attribute template',
    description: 'Delete an attribute template. Only system administrators can delete attribute templates.',
  })
  @ApiParam({ name: 'attributeId', description: 'Attribute template ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Attribute template deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attribute template not found',
  })
  async deleteAttributeTemplate(@Param('attributeId', ParseUUIDPipe) attributeId: string): Promise<void> {
    return this.productCatalogService.deleteAttributeTemplate(attributeId);
  }
}
