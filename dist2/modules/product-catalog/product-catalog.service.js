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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const notification_dto_1 = require("../notifications/dto/notification.dto");
const client_1 = require("@prisma/client");
let ProductCatalogService = class ProductCatalogService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createCategory(createCategoryDto, userId) {
        const existingCategory = await this.prisma.category.findFirst({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        const existingSlug = await this.prisma.category.findFirst({
            where: { slug: createCategoryDto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Category with this slug already exists');
        }
        if (createCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: createCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
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
    async getCategoryHierarchy(includeProducts = false, activeOnly = true) {
        const whereClause = {
            parentId: null,
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
                                children: true,
                                _count: includeProducts
                                    ? { select: { products: true } }
                                    : false,
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
            categories: categories.map((category) => this.mapToCategoryResponse(category, includeProducts)),
            totalCount,
            activeCount,
        };
    }
    async getCategoryById(categoryId, includeProducts = false) {
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
            throw new common_1.NotFoundException('Category not found');
        }
        return this.mapToCategoryResponse(category, includeProducts);
    }
    async updateCategory(categoryId, updateCategoryDto, userId) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!existingCategory) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (updateCategoryDto.slug &&
            updateCategoryDto.slug !== existingCategory.slug) {
            const existingSlug = await this.prisma.category.findFirst({
                where: {
                    slug: updateCategoryDto.slug,
                    id: { not: categoryId },
                },
            });
            if (existingSlug) {
                throw new common_1.ConflictException('Category with this slug already exists');
            }
        }
        if (updateCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: updateCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            if (updateCategoryDto.parentId === categoryId) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
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
    async deleteCategory(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.products.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing products');
        }
        if (category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with subcategories');
        }
        await this.prisma.category.delete({
            where: { id: categoryId },
        });
    }
    async createProduct(createProductDto, merchantId, userId) {
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                merchantId,
                sku: createProductDto.sku,
                status: { not: client_1.ProductStatus.DELETED },
            },
        });
        if (existingProduct) {
            throw new common_1.ConflictException('Product with this SKU already exists for this merchant');
        }
        const existingSlug = await this.prisma.product.findFirst({
            where: {
                merchantId,
                slug: createProductDto.slug,
                status: { not: client_1.ProductStatus.DELETED },
            },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Product with this slug already exists for this merchant');
        }
        const category = await this.prisma.category.findUnique({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                merchantId,
                createdBy: userId,
                updatedBy: userId,
                status: client_1.ProductStatus.APPROVED,
            },
            include: {
                category: true,
                merchant: true,
            },
        });
        return this.mapToProductResponse(product);
    }
    async getProducts(searchDto, merchantId) {
        const { search, categoryId, merchantId: filterMerchantId, status, brand, minPrice, maxPrice, tags, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = searchDto;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const whereClause = {
            status: { not: client_1.ProductStatus.DELETED },
        };
        if (merchantId) {
            whereClause.merchantId = merchantId;
        }
        else if (filterMerchantId) {
            whereClause.merchantId = filterMerchantId;
        }
        else {
            whereClause.status = client_1.ProductStatus.PUBLISHED;
        }
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
            if (status === client_1.ProductStatus.DELETED) {
                whereClause.status = client_1.ProductStatus.DELETED;
            }
            else {
                whereClause.status = status;
            }
        }
        if (brand) {
            whereClause.brand = { contains: brand, mode: 'insensitive' };
        }
        if (minPrice || maxPrice) {
            whereClause.basePrice = {};
            if (minPrice)
                whereClause.basePrice.gte = minPrice;
            if (maxPrice)
                whereClause.basePrice.lte = maxPrice;
        }
        if (tags) {
            const tagArray = tags.split(',').map((tag) => tag.trim());
            whereClause.tags = {
                hasSome: tagArray,
            };
        }
        const orderBy = {};
        if (sortBy === 'name' ||
            sortBy === 'basePrice' ||
            sortBy === 'createdAt' ||
            sortBy === 'updatedAt') {
            orderBy[sortBy] = sortOrder;
        }
        else {
            orderBy.createdAt = 'desc';
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
            products: products.map((product) => this.mapToProductResponse(product)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getProductById(productId, includeVariants = true, isPublicAccess = false, merchantId) {
        const whereClause = {
            id: productId,
            status: { not: client_1.ProductStatus.DELETED },
        };
        if (isPublicAccess) {
            whereClause.status = client_1.ProductStatus.PUBLISHED;
        }
        if (merchantId) {
            whereClause.merchantId = merchantId;
        }
        const product = await this.prisma.product.findFirst({
            where: whereClause,
            include: {
                category: true,
                merchant: true,
                variants: includeVariants,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.mapToProductResponse(product);
    }
    async updateProduct(productId, updateProductDto, userId, merchantId) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (merchantId && existingProduct.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.slug &&
            updateProductDto.slug !== existingProduct.slug) {
            const existingSlug = await this.prisma.product.findFirst({
                where: {
                    merchantId: existingProduct.merchantId,
                    slug: updateProductDto.slug,
                    id: { not: productId },
                    status: { not: client_1.ProductStatus.DELETED },
                },
            });
            if (existingSlug) {
                throw new common_1.ConflictException('Product with this slug already exists for this merchant');
            }
        }
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
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
    async deleteProduct(productId, merchantId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (merchantId && product.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status === client_1.ProductStatus.DELETED) {
            throw new common_1.BadRequestException('Product is already deleted');
        }
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.DELETED,
                isActive: false,
                updatedAt: new Date(),
            },
        });
    }
    async submitProductForApproval(productId, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== client_1.ProductStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft products can be submitted for approval');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.PENDING_REVIEW,
                updatedBy: userId,
            },
            include: {
                category: true,
                merchant: true,
            },
        });
        await this.notificationService.sendAll({
            title: 'Product Approval Required',
            body: `Product "${product.name}" (SKU: ${product.sku}) has been submitted for approval.`,
            type: notification_dto_1.NotificationType.INFO,
        }, ['admin@hardwareworld.com']);
        return this.mapToProductResponse(updatedProduct);
    }
    async approveProduct(productId, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== client_1.ProductStatus.PENDING_REVIEW) {
            throw new common_1.BadRequestException('Only products pending review can be approved');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.APPROVED,
                updatedBy: userId,
            },
            include: {
                category: true,
                merchant: true,
            },
        });
        if (product.merchant.contactEmail) {
            await this.notificationService.sendAll({
                title: 'Product Approved',
                body: `Your product "${product.name}" (SKU: ${product.sku}) has been approved and can now be published.`,
                type: notification_dto_1.NotificationType.INFO,
            }, [product.merchant.contactEmail]);
        }
        return this.mapToProductResponse(updatedProduct);
    }
    async rejectProduct(productId, reason, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== client_1.ProductStatus.PENDING_REVIEW) {
            throw new common_1.BadRequestException('Only products pending review can be rejected');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.REJECTED,
                updatedBy: userId,
            },
            include: {
                category: true,
                merchant: true,
            },
        });
        if (product.merchant.contactEmail) {
            await this.notificationService.sendAll({
                title: 'Product Rejected',
                body: `Your product "${product.name}" (SKU: ${product.sku}) has been rejected. Reason: ${reason}`,
                type: notification_dto_1.NotificationType.WARNING,
            }, [product.merchant.contactEmail]);
        }
        return this.mapToProductResponse(updatedProduct);
    }
    async createProductVariant(productId, createVariantDto, merchantId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (merchantId && product.merchantId !== merchantId) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingVariant = await this.prisma.productVariant.findUnique({
            where: { sku: createVariantDto.sku },
        });
        if (existingVariant) {
            throw new common_1.ConflictException('Product variant with this SKU already exists');
        }
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
    async getProductVariants(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const variants = await this.prisma.productVariant.findMany({
            where: { productId },
            include: {
                product: true,
            },
            orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        });
        return {
            variants: variants.map((variant) => this.mapToProductVariantResponse(variant)),
            totalCount: variants.length,
        };
    }
    async updateProductVariant(variantId, updateVariantDto) {
        const existingVariant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!existingVariant) {
            throw new common_1.NotFoundException('Product variant not found');
        }
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
    async deleteProductVariant(variantId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException('Product variant not found');
        }
        await this.prisma.productVariant.delete({
            where: { id: variantId },
        });
    }
    async createAttributeTemplate(createAttributeDto, userId) {
        const existingAttribute = await this.prisma.productAttributeTemplate.findFirst({
            where: {
                name: createAttributeDto.name,
                categoryId: createAttributeDto.categoryId,
            },
        });
        if (existingAttribute) {
            throw new common_1.ConflictException('Attribute with this name already exists for this category');
        }
        const category = await this.prisma.category.findUnique({
            where: { id: createAttributeDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
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
    async getAttributeTemplates(filter) {
        let allAttributes = [];
        if (filter.categoryId) {
            allAttributes = await this.getAttributeTemplatesWithInheritance(filter.categoryId, filter);
        }
        else {
            const whereClause = {};
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
                orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            });
        }
        let filteredAttributes = allAttributes;
        if (filter.type) {
            filteredAttributes = filteredAttributes.filter((attr) => attr.type === filter.type);
        }
        if (filter.requiredOnly) {
            filteredAttributes = filteredAttributes.filter((attr) => attr.isRequired);
        }
        if (filter.filterableOnly) {
            filteredAttributes = filteredAttributes.filter((attr) => attr.isFilterable);
        }
        if (filter.variantOnly) {
            filteredAttributes = filteredAttributes.filter((attr) => attr.isVariant);
        }
        if (filter.activeOnly !== false) {
            filteredAttributes = filteredAttributes.filter((attr) => attr.isActive);
        }
        const uniqueAttributes = this.removeDuplicateAttributes(filteredAttributes);
        const totalCount = uniqueAttributes.length;
        const activeCount = uniqueAttributes.filter((attr) => attr.isActive).length;
        return {
            attributes: uniqueAttributes.map((attr) => this.mapToAttributeTemplateResponse(attr)),
            totalCount,
            activeCount,
        };
    }
    async getAttributeTemplatesWithInheritance(categoryId, filter) {
        const categoryPath = await this.getCategoryPath(categoryId);
        const categoryIds = categoryPath.map((cat) => cat.id);
        const allAttributes = await this.prisma.productAttributeTemplate.findMany({
            where: {
                categoryId: { in: categoryIds },
                ...(filter.activeOnly !== false ? { isActive: true } : {}),
            },
            include: {
                category: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
        return allAttributes;
    }
    async getCategoryPath(categoryId) {
        const path = [];
        let currentCategoryId = categoryId;
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
            path.unshift(category);
            currentCategoryId = category.parentId;
        }
        return path;
    }
    removeDuplicateAttributes(attributes) {
        const attributeMap = new Map();
        for (const attr of attributes) {
            const key = attr.name.toLowerCase();
            if (attributeMap.has(key)) {
                const existing = attributeMap.get(key);
                if (attr.categoryId && existing.categoryId) {
                    attributeMap.set(key, {
                        ...attr,
                        inheritedFrom: existing.categoryId !== attr.categoryId
                            ? existing.category?.displayName || existing.category?.name
                            : undefined,
                    });
                }
            }
            else {
                attributeMap.set(key, attr);
            }
        }
        return Array.from(attributeMap.values());
    }
    async updateAttributeTemplate(attributeId, updateAttributeDto) {
        const existingAttribute = await this.prisma.productAttributeTemplate.findUnique({
            where: { id: attributeId },
        });
        if (!existingAttribute) {
            throw new common_1.NotFoundException('Attribute template not found');
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
    async deleteAttributeTemplate(attributeId) {
        const attribute = await this.prisma.productAttributeTemplate.findUnique({
            where: { id: attributeId },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute template not found');
        }
        await this.prisma.productAttributeTemplate.delete({
            where: { id: attributeId },
        });
    }
    mapToCategoryResponse(category, includeProductCount = false) {
        const response = {
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
            response.children = category.children.map((child) => this.mapToCategoryResponse(child, includeProductCount));
        }
        if (includeProductCount && category._count) {
            response.productCount = category._count.products;
        }
        return response;
    }
    mapToProductResponse(product) {
        const response = {
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
            weight: product.weight
                ? parseFloat(product.weight.toString())
                : undefined,
            dimensions: product.dimensions,
            basePrice: parseFloat(product.basePrice.toString()),
            msrp: product.msrp ? parseFloat(product.msrp.toString()) : undefined,
            costPrice: product.costPrice
                ? parseFloat(product.costPrice.toString())
                : undefined,
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
            response.variants = product.variants.map((variant) => this.mapToProductVariantResponse(variant));
        }
        return response;
    }
    mapToProductVariantResponse(variant) {
        const response = {
            id: variant.id,
            productId: variant.productId,
            sku: variant.sku,
            name: variant.name,
            attributes: variant.attributes ? JSON.parse(variant.attributes) : {},
            price: variant.price ? parseFloat(variant.price.toString()) : undefined,
            costPrice: variant.costPrice
                ? parseFloat(variant.costPrice.toString())
                : undefined,
            weight: variant.weight
                ? parseFloat(variant.weight.toString())
                : undefined,
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
    mapToAttributeTemplateResponse(attribute) {
        const response = {
            id: attribute.id,
            name: attribute.name,
            displayName: attribute.displayName,
            description: attribute.description,
            type: attribute.type,
            isRequired: attribute.isRequired,
            isFilterable: attribute.isFilterable,
            isVariant: attribute.isVariant,
            options: attribute.options || [],
            validation: attribute.validation
                ? JSON.parse(attribute.validation)
                : undefined,
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
        if (attribute.inheritedFrom) {
            response.inheritedFrom = attribute.inheritedFrom;
        }
        return response;
    }
};
exports.ProductCatalogService = ProductCatalogService;
exports.ProductCatalogService = ProductCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ProductCatalogService);
//# sourceMappingURL=product-catalog.service.js.map