import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/dto/notification.dto';
import { ProductStatus, Prisma } from '@prisma/client';
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

@Injectable()
export class ProductCatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

  // ==================== CATEGORY MANAGEMENT ====================

  async createCategory(createCategoryDto: CreateCategoryDto, userId: string): Promise<CategoryResponseDto> {
    // Check if category name already exists
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // Check if slug already exists
    const existingSlug = await this.prisma.category.findFirst({
      where: { slug: createCategoryDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Category with this slug already exists');
    }

    // If parentId is provided, verify parent exists
    if (createCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    return this.mapToCategoryResponse(category);
  }

  async getCategoryHierarchy(includeProducts = false, activeOnly = true): Promise<CategoryHierarchyDto> {
    const whereClause: Prisma.CategoryWhereInput = {
      parentId: null, // Get root categories
    };

    if (activeOnly) {
      whereClause.isActive = true;
    }

    const categories = await this.prisma.category.findMany({
      where: whereClause,
      include: {
        children: {
          where: activeOnly ? { isActive: true } : {},
          include: {
            children: {
              where: activeOnly ? { isActive: true } : {},
              include: {
                children: true, // Support up to 4 levels deep
                _count: includeProducts ? { select: { products: true } } : false,
              },
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            },
            _count: includeProducts ? { select: { products: true } } : false,
          },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
        _count: includeProducts ? { select: { products: true } } : false,
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    const totalCount = await this.prisma.category.count();
    const activeCount = await this.prisma.category.count({
      where: { isActive: true },
    });

    return {
      categories: categories.map(category => this.mapToCategoryResponse(category, includeProducts)),
      totalCount,
      activeCount,
    };
  }

  async getCategoryById(categoryId: string, includeProducts = false): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
        _count: includeProducts ? { select: { products: true } } : false,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.mapToCategoryResponse(category, includeProducts);
  }

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto, userId: string): Promise<CategoryResponseDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check slug uniqueness if provided
    if (updateCategoryDto.slug && updateCategoryDto.slug !== existingCategory.slug) {
      const existingSlug = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          id: { not: categoryId },
        },
      });

      if (existingSlug) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Validate parent category if provided
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      // Prevent circular reference
      if (updateCategoryDto.parentId === categoryId) {
        throw new BadRequestException('Category cannot be its own parent');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...updateCategoryDto,
        updatedBy: userId,
      },
    });

    return this.mapToCategoryResponse(updatedCategory);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }

    if (category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  // ==================== PRODUCT MANAGEMENT ====================

  async createProduct(createProductDto: CreateProductDto, merchantId: string, userId: string): Promise<ProductResponseDto> {
    // Check if SKU already exists for this merchant
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        merchantId,
        sku: createProductDto.sku,
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists for this merchant');
    }

    // Check if slug already exists for this merchant
    const existingSlug = await this.prisma.product.findFirst({
      where: {
        merchantId,
        slug: createProductDto.slug,
      },
    });

    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists for this merchant');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        merchantId,
        createdBy: userId,
        updatedBy: userId,
        status: ProductStatus.APPROVED,
      },
      include: {
        category: true,
        merchant: true,
      },
    });

    return this.mapToProductResponse(product);
  }

  async getProducts(searchDto: ProductSearchDto, merchantId?: string): Promise<ProductListDto> {
    const {
      search,
      categoryId,
      merchantId: filterMerchantId,
      status,
      brand,
      minPrice,
      maxPrice,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = searchDto;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 items per page

    const whereClause: Prisma.ProductWhereInput = {};

    // Apply merchant filter (either from auth context or search parameter)
    if (merchantId) {
      whereClause.merchantId = merchantId;
    } else if (filterMerchantId) {
      whereClause.merchantId = filterMerchantId;
    }

    // Apply search filters
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (brand) {
      whereClause.brand = { contains: brand, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      whereClause.basePrice = {};
      if (minPrice) whereClause.basePrice.gte = minPrice;
      if (maxPrice) whereClause.basePrice.lte = maxPrice;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      whereClause.tags = {
        hasSome: tagArray,
      };
    }

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'name' || sortBy === 'basePrice' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc'; // Default fallback
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          merchant: true,
          variants: true,
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    return {
      products: products.map(product => this.mapToProductResponse(product)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId: string, includeVariants = true): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        merchant: true,
        variants: includeVariants,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapToProductResponse(product);
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto, userId: string): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Check slug uniqueness if provided
    if (updateProductDto.slug && updateProductDto.slug !== existingProduct.slug) {
      const existingSlug = await this.prisma.product.findFirst({
        where: {
          merchantId: existingProduct.merchantId,
          slug: updateProductDto.slug,
          id: { not: productId },
        },
      });

      if (existingSlug) {
        throw new ConflictException('Product with this slug already exists for this merchant');
      }
    }

    // Verify category exists if provided
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...updateProductDto,
        updatedBy: userId,
      },
      include: {
        category: true,
        merchant: true,
        variants: true,
      },
    });

    return this.mapToProductResponse(updatedProduct);
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete product (variants will be cascade deleted)
    await this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async submitProductForApproval(productId: string, userId: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.DRAFT) {
      throw new BadRequestException('Only draft products can be submitted for approval');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: ProductStatus.PENDING_REVIEW,
        updatedBy: userId,
      },
      include: {
        category: true,
        merchant: true,
      },
    });

    // Send notification to system admins
    await this.notificationService.sendAll(
      {
        title: 'Product Approval Required',
        body: `Product "${product.name}" (SKU: ${product.sku}) has been submitted for approval.`,
        type: NotificationType.INFO,
      },
      ['admin@hardwareworld.com'],
    );

    return this.mapToProductResponse(updatedProduct);
  }

  async approveProduct(productId: string, userId: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only products pending review can be approved');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: ProductStatus.APPROVED,
        updatedBy: userId,
      },
      include: {
        category: true,
        merchant: true,
      },
    });

    // Send notification to merchant
    if (product.merchant.contactEmail) {
      await this.notificationService.sendAll(
        {
          title: 'Product Approved',
          body: `Your product "${product.name}" (SKU: ${product.sku}) has been approved and can now be published.`,
          type: NotificationType.INFO,
        },
        [product.merchant.contactEmail],
      );
    }

    return this.mapToProductResponse(updatedProduct);
  }

  async rejectProduct(productId: string, reason: string, userId: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.PENDING_REVIEW) {
      throw new BadRequestException('Only products pending review can be rejected');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: ProductStatus.REJECTED,
        updatedBy: userId,
      },
      include: {
        category: true,
        merchant: true,
      },
    });

    // Send notification to merchant
    if (product.merchant.contactEmail) {
      await this.notificationService.sendAll(
        {
          title: 'Product Rejected',
          body: `Your product "${product.name}" (SKU: ${product.sku}) has been rejected. Reason: ${reason}`,
          type: NotificationType.WARNING,
        },
        [product.merchant.contactEmail],
      );
    }

    return this.mapToProductResponse(updatedProduct);
  }

  // ==================== PRODUCT VARIANT MANAGEMENT ====================

  async createProductVariant(productId: string, createVariantDto: CreateProductVariantDto): Promise<ProductVariantResponseDto> {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if SKU already exists
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { sku: createVariantDto.sku },
    });

    if (existingVariant) {
      throw new ConflictException('Product variant with this SKU already exists');
    }

    // If this is set as default, unset other defaults
    if (createVariantDto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: { productId },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        ...createVariantDto,
        productId,
      },
      include: {
        product: true,
      },
    });

    return this.mapToProductVariantResponse(variant);
  }

  async getProductVariants(productId: string): Promise<ProductVariantListDto> {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        product: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    });

    return {
      variants: variants.map(variant => this.mapToProductVariantResponse(variant)),
      totalCount: variants.length,
    };
  }

  async updateProductVariant(variantId: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariantResponseDto> {
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existingVariant) {
      throw new NotFoundException('Product variant not found');
    }

    // If this is set as default, unset other defaults
    if (updateVariantDto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: {
          productId: existingVariant.productId,
          id: { not: variantId },
        },
        data: { isDefault: false },
      });
    }

    const updatedVariant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: updateVariantDto,
      include: {
        product: true,
      },
    });

    return this.mapToProductVariantResponse(updatedVariant);
  }

  async deleteProductVariant(variantId: string): Promise<void> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  // ==================== PRODUCT ATTRIBUTE TEMPLATE MANAGEMENT ====================

  async createAttributeTemplate(createAttributeDto: CreateProductAttributeTemplateDto, userId: string): Promise<ProductAttributeTemplateResponseDto> {
    // Check if attribute name already exists for this category
    const existingAttribute = await this.prisma.productAttributeTemplate.findFirst({
      where: {
        name: createAttributeDto.name,
        categoryId: createAttributeDto.categoryId,
      },
    });

    if (existingAttribute) {
      throw new ConflictException('Attribute with this name already exists for this category');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createAttributeDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const attribute = await this.prisma.productAttributeTemplate.create({
      data: {
        ...createAttributeDto,
        createdBy: userId,
      },
      include: {
        category: true,
      },
    });

    return this.mapToAttributeTemplateResponse(attribute);
  }

  async getAttributeTemplates(filter: AttributeFilterDto): Promise<ProductAttributeTemplateListDto> {
    let allAttributes: any[] = [];

    if (filter.categoryId) {
      // Get attributes for this category and all parent categories (inheritance)
      allAttributes = await this.getAttributeTemplatesWithInheritance(filter.categoryId, filter);
    } else {
      // Get all attributes without category filtering
      const whereClause: Prisma.ProductAttributeTemplateWhereInput = {};

      if (filter.type) {
        whereClause.type = filter.type;
      }

      if (filter.requiredOnly) {
        whereClause.isRequired = true;
      }

      if (filter.filterableOnly) {
        whereClause.isFilterable = true;
      }

      if (filter.variantOnly) {
        whereClause.isVariant = true;
      }

      if (filter.activeOnly !== false) {
        whereClause.isActive = true;
      }

      allAttributes = await this.prisma.productAttributeTemplate.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      });
    }

    // Apply additional filters to the combined results
    let filteredAttributes = allAttributes;

    if (filter.type) {
      filteredAttributes = filteredAttributes.filter(attr => attr.type === filter.type);
    }

    if (filter.requiredOnly) {
      filteredAttributes = filteredAttributes.filter(attr => attr.isRequired);
    }

    if (filter.filterableOnly) {
      filteredAttributes = filteredAttributes.filter(attr => attr.isFilterable);
    }

    if (filter.variantOnly) {
      filteredAttributes = filteredAttributes.filter(attr => attr.isVariant);
    }

    if (filter.activeOnly !== false) {
      filteredAttributes = filteredAttributes.filter(attr => attr.isActive);
    }

    // Remove duplicates (child category attributes override parent ones with same name)
    const uniqueAttributes = this.removeDuplicateAttributes(filteredAttributes);

    // Count stats
    const totalCount = uniqueAttributes.length;
    const activeCount = uniqueAttributes.filter(attr => attr.isActive).length;

    return {
      attributes: uniqueAttributes.map(attr => this.mapToAttributeTemplateResponse(attr)),
      totalCount,
      activeCount,
    };
  }

  /**
   * Get attribute templates for a category including inherited ones from parent categories
   */
  private async getAttributeTemplatesWithInheritance(categoryId: string, filter: AttributeFilterDto): Promise<any[]> {
    // Get the category hierarchy path (from root to current category)
    const categoryPath = await this.getCategoryPath(categoryId);

    // Get all category IDs in the path (from parent to child)
    const categoryIds = categoryPath.map(cat => cat.id);

    // Fetch attributes for all categories in the hierarchy
    const allAttributes = await this.prisma.productAttributeTemplate.findMany({
      where: {
        categoryId: { in: categoryIds },
        ...(filter.activeOnly !== false ? { isActive: true } : {}),
      },
      include: {
        category: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return allAttributes;
  }

  /**
   * Get the category path from root to the specified category
   */
  private async getCategoryPath(categoryId: string): Promise<any[]> {
    const path: any[] = [];
    let currentCategoryId: string | null = categoryId;

    while (currentCategoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: currentCategoryId },
        select: {
          id: true,
          name: true,
          displayName: true,
          parentId: true,
        },
      });

      if (!category) {
        break;
      }

      path.unshift(category); // Add to beginning to maintain root-to-child order
      currentCategoryId = category.parentId;
    }

    return path;
  }

  /**
   * Remove duplicate attributes, keeping child category attributes over parent ones
   */
  private removeDuplicateAttributes(attributes: any[]): any[] {
    const attributeMap = new Map<string, any>();

    // Process attributes from parent to child (later entries override earlier ones)
    for (const attr of attributes) {
      const key = attr.name.toLowerCase();

      // If we already have this attribute, only override if the new one is from a deeper category level
      if (attributeMap.has(key)) {
        const existing = attributeMap.get(key);

        // Simple heuristic: if both have categoryId, prefer the one that's more specific
        // In a real scenario, you might want to track category depth more precisely
        if (attr.categoryId && existing.categoryId) {
          // Keep the new one (assuming it's from a child category)
          attributeMap.set(key, { ...attr, inheritedFrom: existing.categoryId !== attr.categoryId ? existing.category?.displayName || existing.category?.name : undefined });
        }
      } else {
        attributeMap.set(key, attr);
      }
    }

    return Array.from(attributeMap.values());
  }

  async updateAttributeTemplate(attributeId: string, updateAttributeDto: UpdateProductAttributeTemplateDto): Promise<ProductAttributeTemplateResponseDto> {
    const existingAttribute = await this.prisma.productAttributeTemplate.findUnique({
      where: { id: attributeId },
    });

    if (!existingAttribute) {
      throw new NotFoundException('Attribute template not found');
    }

    const updatedAttribute = await this.prisma.productAttributeTemplate.update({
      where: { id: attributeId },
      data: updateAttributeDto,
      include: {
        category: true,
      },
    });

    return this.mapToAttributeTemplateResponse(updatedAttribute);
  }

  async deleteAttributeTemplate(attributeId: string): Promise<void> {
    const attribute = await this.prisma.productAttributeTemplate.findUnique({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute template not found');
    }

    await this.prisma.productAttributeTemplate.delete({
      where: { id: attributeId },
    });
  }

  // ==================== HELPER METHODS ====================

  private mapToCategoryResponse(category: any, includeProductCount = false): CategoryResponseDto {
    const response: CategoryResponseDto = {
      id: category.id,
      name: category.name,
      displayName: category.displayName,
      description: category.description,
      imageUrl: category.imageUrl,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0,
      slug: category.slug,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    if (category.children) {
      response.children = category.children.map((child: any) => this.mapToCategoryResponse(child, includeProductCount));
    }

    if (includeProductCount && category._count) {
      response.productCount = category._count.products;
    }

    return response;
  }

  private mapToProductResponse(product: any): ProductResponseDto {
    const response: ProductResponseDto = {
      id: product.id,
      name: product.name,
      displayName: product.displayName,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      barcode: product.barcode,
      mpn: product.mpn,
      categoryId: product.categoryId,
      merchantId: product.merchantId,
      brand: product.brand,
      model: product.model,
      weight: product.weight ? parseFloat(product.weight.toString()) : undefined,
      dimensions: product.dimensions,
      basePrice: parseFloat(product.basePrice.toString()),
      msrp: product.msrp ? parseFloat(product.msrp.toString()) : undefined,
      costPrice: product.costPrice ? parseFloat(product.costPrice.toString()) : undefined,
      images: product.images || [],
      videos: product.videos || [],
      documents: product.documents || [],
      status: product.status,
      isActive: product.isActive,
      isDigital: product.isDigital,
      trackInventory: product.trackInventory,
      minimumOrderQuantity: product.minimumOrderQuantity || 1,
      orderMultiple: product.orderMultiple || 1,
      slug: product.slug,
      tags: product.tags || [],
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    if (product.category) {
      response.category = {
        id: product.category.id,
        name: product.category.name,
        displayName: product.category.displayName,
      };
    }

    if (product.merchant) {
      response.merchant = {
        id: product.merchant.id,
        name: product.merchant.name,
        businessName: product.merchant.businessName,
      };
    }

    if (product.variants) {
      response.variants = product.variants.map((variant: any) => this.mapToProductVariantResponse(variant));
    }

    return response;
  }

  private mapToProductVariantResponse(variant: any): ProductVariantResponseDto {
    const response: ProductVariantResponseDto = {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      name: variant.name,
      attributes: variant.attributes ? JSON.parse(variant.attributes) : {},
      price: variant.price ? parseFloat(variant.price.toString()) : undefined,
      costPrice: variant.costPrice ? parseFloat(variant.costPrice.toString()) : undefined,
      weight: variant.weight ? parseFloat(variant.weight.toString()) : undefined,
      barcode: variant.barcode,
      mpn: variant.mpn,
      images: variant.images || [],
      minimumOrderQuantity: variant.minimumOrderQuantity || 1,
      orderMultiple: variant.orderMultiple || 1,
      isActive: variant.isActive,
      isDefault: variant.isDefault,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };

    if (variant.product) {
      response.product = {
        id: variant.product.id,
        name: variant.product.name,
        basePrice: parseFloat(variant.product.basePrice.toString()),
      };
    }

    return response;
  }

  private mapToAttributeTemplateResponse(attribute: any): ProductAttributeTemplateResponseDto {
    const response: ProductAttributeTemplateResponseDto = {
      id: attribute.id,
      name: attribute.name,
      displayName: attribute.displayName,
      description: attribute.description,
      type: attribute.type,
      isRequired: attribute.isRequired,
      isFilterable: attribute.isFilterable,
      isVariant: attribute.isVariant,
      options: attribute.options || [],
      validation: attribute.validation ? JSON.parse(attribute.validation) : undefined,
      categoryId: attribute.categoryId,
      sortOrder: attribute.sortOrder || 0,
      unit: attribute.unit,
      isActive: attribute.isActive,
      createdBy: attribute.createdBy,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
    };

    if (attribute.category) {
      response.category = {
        id: attribute.category.id,
        name: attribute.category.name,
        displayName: attribute.category.displayName,
      };
    }

    // Add inheritance information if present
    if (attribute.inheritedFrom) {
      response.inheritedFrom = attribute.inheritedFrom;
    }

    return response;
  }
}
