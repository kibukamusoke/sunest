import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { Prisma, ProductStatus, SearchType } from '@prisma/client';
import {
    ProductSearchDto,
    BulkSkuSearchDto,
    SearchSuggestionDto,
    ProductSearchResponseDto,
    BulkSkuSearchResponseDto,
    SearchSuggestionResponseDto,
    QuickSearchResponseDto,
    SearchProductDto,
    SearchMetadataDto,
    SearchPaginationDto,
    AvailableFiltersDto,
    FilterOptionDto,
    PriceRangeFilterDto,
    AvailableSpecificationFilterDto,
    CreateSearchAnalyticsDto,
    SearchAnalyticsQueryDto,
    SearchAnalyticsResponseDto,
    SearchVolumeDto,
    PopularSearchTermDto,
    ZeroResultSearchDto,
    CategoryAnalyticsDto,
    SearchPerformanceDto,
    CreateSavedSearchDto,
    UpdateSavedSearchDto,
    SavedSearchResponseDto,
    SavedSearchListDto,
    ExecuteSavedSearchDto,
    AlertFrequency,
} from './dto';

@Injectable()
export class SearchDiscoveryService {
    constructor(private readonly prisma: PrismaService) { }

    // ==================== PRODUCT SEARCH ====================

    async searchProducts(searchDto: ProductSearchDto, userId?: string, sessionId?: string): Promise<ProductSearchResponseDto> {
        const startTime = Date.now();

        const {
            q,
            type = SearchType.FULL_TEXT,
            filters,
            sort,
            page = 1,
            limit = 20,
            includeVariants = false,
            includeInventory = true,
            includeCategory = true,
            includeMerchant = false,
            warehouseId,
            quantity = 1,
        } = searchDto;

        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        // Build where clause
        const whereClause = this.buildSearchWhereClause(q, type, filters, warehouseId);

        // Build order clause
        const orderBy = this.buildSearchOrderClause(sort, q);

        // Build include clause
        const include = this.buildSearchIncludeClause(includeVariants, includeInventory, includeCategory, includeMerchant);

        try {
            // Execute search query
            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where: whereClause,
                    include,
                    orderBy,
                    skip,
                    take,
                }),
                this.prisma.product.count({ where: whereClause }),
            ]);

            // Map products to response format
            const searchProducts = await Promise.all(
                products.map(product => this.mapToSearchProduct(product, quantity, warehouseId))
            );

            const executionTime = Date.now() - startTime;

            // Track search analytics
            if (userId || sessionId) {
                await this.trackSearchAnalytics({
                    searchTerm: q || '',
                    searchType: type,
                    filters: filters ? JSON.stringify(filters) : undefined,
                    resultCount: total,
                    sessionId: sessionId || `anonymous-${Date.now()}`,
                    executionTime,
                }, userId);
            }

            // Build response
            const metadata: SearchMetadataDto = {
                executionTime,
                appliedFilters: this.buildAppliedFiltersArray(q, filters),
                suggestedTerms: q ? await this.generateSearchSuggestions(q, 3) : undefined,
                didYouMean: q && total === 0 ? await this.generateDidYouMeanSuggestions(q) : undefined,
                totalFound: total,
                searchQuery: q,
                searchType: type,
            };

            const pagination: SearchPaginationDto = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            };

            // Get available filters if requested
            const availableFilters = await this.getAvailableFilters(whereClause, filters);

            return {
                products: searchProducts,
                pagination,
                metadata,
                availableFilters,
            };
        } catch (error) {
            throw new BadRequestException(`Search failed: ${error.message}`);
        }
    }

    async quickSearch(query: string, limit: number = 5): Promise<QuickSearchResponseDto> {
        const startTime = Date.now();

        if (!query || query.trim().length < 2) {
            return {
                products: [],
                totalMatches: 0,
                hasMore: false,
                suggestions: [],
                executionTime: Date.now() - startTime,
            };
        }

        const searchTerm = query.trim();

        // Quick search using simple LIKE queries for speed
        const whereClause: Prisma.ProductWhereInput = {
            AND: [
                { status: ProductStatus.PUBLISHED },
                { isActive: true },
                {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { sku: { contains: searchTerm, mode: 'insensitive' } },
                        { brand: { contains: searchTerm, mode: 'insensitive' } },
                        { tags: { has: searchTerm } },
                    ],
                },
            ],
        };

        const [products, totalMatches] = await Promise.all([
            this.prisma.product.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    brand: true,
                    basePrice: true,
                    images: true,
                    status: true,
                },
                orderBy: [
                    { searchScore: 'desc' },
                    { name: 'asc' },
                ],
                take: limit,
            }),
            this.prisma.product.count({ where: whereClause }),
        ]);

        const suggestions = await this.generateSearchSuggestions(searchTerm, 3);

        return {
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                brand: p.brand || undefined,
                images: p.images,
                relevanceScore: 1.0,
                pricing: {
                    basePrice: parseFloat(p.basePrice.toString()),
                    finalPrice: parseFloat(p.basePrice.toString()),
                    quantity: 1,
                },
                status: p.status,
                createdAt: new Date(),
                updatedAt: new Date(),
                specifications: {},
            } as SearchProductDto)),
            totalMatches,
            hasMore: totalMatches > limit,
            suggestions,
            executionTime: Date.now() - startTime,
        };
    }

    async bulkSkuSearch(bulkSearchDto: BulkSkuSearchDto, warehouseId?: string): Promise<BulkSkuSearchResponseDto> {
        const startTime = Date.now();
        const { skus, includeInventory = true, includePricing = true } = bulkSearchDto;

        if (skus.length === 0) {
            return {
                found: {},
                notFound: [],
                totalSearched: 0,
                totalFound: 0,
                executionTime: Date.now() - startTime,
            };
        }

        // Remove duplicates and normalize SKUs
        const uniqueSkus = [...new Set(skus.map(sku => sku.trim().toUpperCase()))];

        const products = await this.prisma.product.findMany({
            where: {
                sku: { in: uniqueSkus, mode: 'insensitive' },
                status: ProductStatus.PUBLISHED,
                isActive: true,
            },
            include: {
                category: true,
                inventoryItems: includeInventory ? {
                    where: warehouseId ? { warehouseId } : undefined,
                    include: {
                        warehouse: true,
                    },
                } : false,
            },
        });

        const found: Record<string, SearchProductDto> = {};
        const foundSkus = new Set<string>();

        await Promise.all(
            products.map(async (product) => {
                const searchProduct = await this.mapToSearchProduct(product, 1, warehouseId);
                found[product.sku.toUpperCase()] = searchProduct;
                foundSkus.add(product.sku.toUpperCase());
            })
        );

        const notFound = uniqueSkus.filter(sku => !foundSkus.has(sku));

        return {
            found,
            notFound,
            totalSearched: uniqueSkus.length,
            totalFound: products.length,
            executionTime: Date.now() - startTime,
        };
    }

    async getSearchSuggestions(suggestionDto: SearchSuggestionDto): Promise<SearchSuggestionResponseDto> {
        const { term, limit = 10, categoryId } = suggestionDto;

        if (term.length < 2) {
            return {
                products: [],
                categories: [],
                brands: [],
                popular: [],
                total: 0,
                searchTerm: term,
            };
        }

        const whereClause: Prisma.ProductWhereInput = {
            AND: [
                { status: ProductStatus.PUBLISHED },
                { isActive: true },
                categoryId ? { categoryId } : {},
            ],
        };

        const [productSuggestions, categorySuggestions, brandSuggestions, popularSuggestions] = await Promise.all([
            // Product name suggestions
            this.prisma.product.findMany({
                where: {
                    ...whereClause,
                    name: { contains: term, mode: 'insensitive' },
                },
                select: { name: true },
                distinct: ['name'],
                orderBy: { searchCount: 'desc' },
                take: Math.ceil(limit / 4),
            }),

            // Category suggestions
            this.prisma.category.findMany({
                where: {
                    isActive: true,
                    name: { contains: term, mode: 'insensitive' },
                },
                select: { name: true },
                orderBy: { name: 'asc' },
                take: Math.ceil(limit / 4),
            }),

            // Brand suggestions
            this.prisma.product.findMany({
                where: {
                    ...whereClause,
                    brand: { contains: term, mode: 'insensitive' },
                },
                select: { brand: true },
                distinct: ['brand'],
                orderBy: { brand: 'asc' },
                take: Math.ceil(limit / 4),
            }),

            // Popular search suggestions from analytics
            this.prisma.searchAnalytics.findMany({
                where: {
                    searchTerm: { contains: term, mode: 'insensitive' },
                    resultCount: { gt: 0 },
                },
                select: { searchTerm: true },
                distinct: ['searchTerm'],
                orderBy: { searchAt: 'desc' },
                take: Math.ceil(limit / 4),
            }),
        ]);

        const products = productSuggestions.map(p => p.name);
        const categories = categorySuggestions.map(c => c.name);
        const brands = brandSuggestions.map(b => b.brand).filter((brand): brand is string => brand !== null);
        const popular = popularSuggestions.map(s => s.searchTerm);

        return {
            products,
            categories,
            brands,
            popular,
            total: products.length + categories.length + brands.length + popular.length,
            searchTerm: term,
        };
    }

    // ==================== SAVED SEARCHES ====================

    async createSavedSearch(createDto: CreateSavedSearchDto, userId: string): Promise<SavedSearchResponseDto> {
        const savedSearch = await this.prisma.savedSearch.create({
            data: {
                userId,
                name: createDto.name,
                searchTerm: createDto.searchTerm,
                filters: JSON.stringify(createDto.filters),
                alertOnNewResults: createDto.alertOnNewResults,
                alertOnPriceChange: createDto.alertOnPriceChange,
            },
        });

        return this.mapToSavedSearchResponse(savedSearch);
    }

    async getSavedSearches(userId: string): Promise<SavedSearchListDto> {
        const searches = await this.prisma.savedSearch.findMany({
            where: { userId, isActive: true },
            orderBy: { updatedAt: 'desc' },
        });

        return {
            searches: searches.map(s => this.mapToSavedSearchResponse(s)),
            total: searches.length,
            activeCount: searches.filter(s => s.isActive).length,
            alertEnabledCount: searches.filter(s => s.alertOnNewResults || s.alertOnPriceChange).length,
        };
    }

    async updateSavedSearch(
        searchId: string,
        updateDto: UpdateSavedSearchDto,
        userId: string
    ): Promise<SavedSearchResponseDto> {
        const existingSearch = await this.prisma.savedSearch.findFirst({
            where: { id: searchId, userId },
        });

        if (!existingSearch) {
            throw new NotFoundException('Saved search not found');
        }

        const updatedSearch = await this.prisma.savedSearch.update({
            where: { id: searchId },
            data: {
                name: updateDto.name,
                searchTerm: updateDto.searchTerm,
                filters: updateDto.filters ? JSON.stringify(updateDto.filters) : undefined,
                alertOnNewResults: updateDto.alertOnNewResults,
                alertOnPriceChange: updateDto.alertOnPriceChange,
                isActive: updateDto.isActive,
            },
        });

        return this.mapToSavedSearchResponse(updatedSearch);
    }

    async deleteSavedSearch(searchId: string, userId: string): Promise<void> {
        const existingSearch = await this.prisma.savedSearch.findFirst({
            where: { id: searchId, userId },
        });

        if (!existingSearch) {
            throw new NotFoundException('Saved search not found');
        }

        await this.prisma.savedSearch.delete({
            where: { id: searchId },
        });
    }

    async executeSavedSearch(executeDto: ExecuteSavedSearchDto, userId: string): Promise<ProductSearchResponseDto> {
        const savedSearch = await this.prisma.savedSearch.findFirst({
            where: { id: executeDto.searchId, userId, isActive: true },
        });

        if (!savedSearch) {
            throw new NotFoundException('Saved search not found');
        }

        // Parse filters from saved search
        const filters = savedSearch.filters ? JSON.parse(savedSearch.filters) : {};

        // Create search DTO from saved search
        const searchDto: ProductSearchDto = {
            q: savedSearch.searchTerm || undefined,
            filters,
            page: executeDto.page,
            limit: executeDto.limit,
            includeInventory: executeDto.includeAvailability,
            warehouseId: executeDto.warehouseId,
        };

        // Execute the search
        const result = await this.searchProducts(searchDto, userId);

        // Update saved search with execution info
        await this.prisma.savedSearch.update({
            where: { id: executeDto.searchId },
            data: {
                lastExecuted: new Date(),
                resultCount: result.pagination.total,
            },
        });

        return result;
    }

    // ==================== SEARCH ANALYTICS ====================

    async trackSearchAnalytics(analyticsDto: CreateSearchAnalyticsDto, userId?: string): Promise<void> {
        try {
            await this.prisma.searchAnalytics.create({
                data: {
                    searchTerm: analyticsDto.searchTerm,
                    searchType: analyticsDto.searchType as SearchType,
                    filters: analyticsDto.filters,
                    resultCount: analyticsDto.resultCount,
                    clickedResult: analyticsDto.clickedResult,
                    userId,
                    sessionId: analyticsDto.sessionId,
                    userAgent: analyticsDto.userAgent,
                    ipAddress: analyticsDto.ipAddress,
                    merchantId: analyticsDto.merchantId,
                    executionTime: analyticsDto.executionTime,
                },
            });

            // Update product search count if there was a clicked result
            if (analyticsDto.clickedResult) {
                await this.prisma.product.update({
                    where: { id: analyticsDto.clickedResult },
                    data: {
                        searchCount: { increment: 1 },
                        lastSearched: new Date(),
                    },
                });
            }
        } catch (error) {
            // Don't fail the main search operation if analytics fails
            console.error('Failed to track search analytics:', error);
        }
    }

    async getSearchAnalytics(queryDto: SearchAnalyticsQueryDto): Promise<SearchAnalyticsResponseDto> {
        const {
            startDate,
            endDate,
            period,
            merchantId,
            category,
            limit = 100,
        } = queryDto;

        const dateFilter: Prisma.SearchAnalyticsWhereInput = {};
        if (startDate || endDate) {
            dateFilter.searchAt = {};
            if (startDate) dateFilter.searchAt.gte = new Date(startDate);
            if (endDate) dateFilter.searchAt.lte = new Date(endDate);
        }

        const whereClause: Prisma.SearchAnalyticsWhereInput = {
            ...dateFilter,
            ...(merchantId && { merchantId }),
        };

        // Get search volume data
        const volume = await this.getSearchVolume(whereClause, period);

        // Get popular search terms
        const topTerms = await this.getPopularSearchTerms(whereClause, limit);

        // Get zero result searches
        const zeroResults = await this.getZeroResultSearches(whereClause, limit);

        // Get category analytics
        const categories = await this.getCategoryAnalytics(whereClause, limit);

        // Get performance metrics
        const performance = await this.getSearchPerformance(whereClause);

        // Calculate summary statistics
        const summary = await this.calculateSearchSummary(whereClause);

        return {
            volume,
            topTerms,
            zeroResults,
            categories,
            performance,
            summary,
            period: {
                startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: endDate ? new Date(endDate) : new Date(),
                duration: period || 'DAY',
            },
        };
    }

    // ==================== HELPER METHODS ====================

    private buildSearchWhereClause(
        query?: string,
        type: SearchType = SearchType.FULL_TEXT,
        filters?: any,
        warehouseId?: string
    ): Prisma.ProductWhereInput {
        const whereConditions: Prisma.ProductWhereInput[] = [
            { status: ProductStatus.PUBLISHED },
            { isActive: true },
        ];

        const whereClause: Prisma.ProductWhereInput = {
            AND: whereConditions,
        };

        // Add search query conditions
        if (query && query.trim()) {
            const searchTerm = query.trim();

            switch (type) {
                case SearchType.SKU:
                    whereConditions.push({
                        OR: [
                            { sku: { contains: searchTerm, mode: 'insensitive' } },
                            { variants: { some: { sku: { contains: searchTerm, mode: 'insensitive' } } } },
                        ],
                    });
                    break;

                case SearchType.CATEGORY:
                    whereConditions.push({
                        category: { name: { contains: searchTerm, mode: 'insensitive' } },
                    });
                    break;

                default: // FULL_TEXT
                    whereConditions.push({
                        OR: [
                            { name: { contains: searchTerm, mode: 'insensitive' } },
                            { description: { contains: searchTerm, mode: 'insensitive' } },
                            { sku: { contains: searchTerm, mode: 'insensitive' } },
                            { brand: { contains: searchTerm, mode: 'insensitive' } },
                            { model: { contains: searchTerm, mode: 'insensitive' } },
                            { tags: { has: searchTerm } },
                        ],
                    });
            }
        }

        // Add filter conditions
        if (filters) {
            if (filters.priceRange) {
                const priceFilter: any = {};
                if (filters.priceRange.min !== undefined) priceFilter.gte = filters.priceRange.min;
                if (filters.priceRange.max !== undefined) priceFilter.lte = filters.priceRange.max;
                if (Object.keys(priceFilter).length > 0) {
                    whereConditions.push({ basePrice: priceFilter });
                }
            }

            if (filters.brands && filters.brands.length > 0) {
                whereConditions.push({ brand: { in: filters.brands } });
            }

            if (filters.categories && filters.categories.length > 0) {
                whereConditions.push({ categoryId: { in: filters.categories } });
            }

            if (filters.merchants && filters.merchants.length > 0) {
                whereConditions.push({ merchantId: { in: filters.merchants } });
            }

            if (filters.statuses && filters.statuses.length > 0) {
                whereConditions.push({ status: { in: filters.statuses } });
            }

            if (filters.inStockOnly) {
                whereConditions.push({
                    inventoryItems: {
                        some: {
                            quantityAvailable: { gt: 0 },
                            ...(warehouseId && { warehouseId }),
                        },
                    },
                });
            }

            if (filters.withImagesOnly) {
                whereConditions.push({
                    NOT: {
                        images: { equals: [] },
                    },
                });
            }
        }

        return whereClause;
    }

    private buildSearchOrderClause(sort?: any, query?: string): Prisma.ProductOrderByWithRelationInput[] {
        const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

        if (sort?.field) {
            switch (sort.field) {
                case 'price':
                    orderBy.push({ basePrice: sort.order || 'asc' });
                    break;
                case 'name':
                    orderBy.push({ name: sort.order || 'asc' });
                    break;
                case 'createdAt':
                    orderBy.push({ createdAt: sort.order || 'desc' });
                    break;
                case 'updatedAt':
                    orderBy.push({ updatedAt: sort.order || 'desc' });
                    break;
                case 'popularity':
                    orderBy.push({ searchCount: sort.order || 'desc' });
                    break;
                default: // relevance
                    if (query) {
                        orderBy.push({ searchScore: 'desc' });
                    }
                    orderBy.push({ name: 'asc' });
            }
        } else {
            // Default sorting
            if (query) {
                orderBy.push({ searchScore: 'desc' });
            }
            orderBy.push({ name: 'asc' });
        }

        return orderBy;
    }

    private buildSearchIncludeClause(
        includeVariants: boolean,
        includeInventory: boolean,
        includeCategory: boolean,
        includeMerchant: boolean
    ): Prisma.ProductInclude {
        return {
            category: includeCategory,
            merchant: includeMerchant,
            variants: includeVariants,
            inventoryItems: includeInventory ? {
                include: {
                    warehouse: true,
                },
            } : false,
        };
    }

    private async mapToSearchProduct(product: any, quantity: number = 1, warehouseId?: string): Promise<SearchProductDto> {
        // Calculate availability
        let availability;
        if (product.inventoryItems && product.inventoryItems.length > 0) {
            const inventoryItem = warehouseId
                ? product.inventoryItems.find((item: any) => item.warehouseId === warehouseId)
                : product.inventoryItems[0];

            if (inventoryItem) {
                availability = {
                    inStock: inventoryItem.quantityAvailable > 0,
                    quantity: inventoryItem.quantityAvailable,
                    warehouse: inventoryItem.warehouse ? {
                        id: inventoryItem.warehouse.id,
                        name: inventoryItem.warehouse.name,
                        code: inventoryItem.warehouse.code,
                    } : undefined,
                    leadTimeDays: inventoryItem.leadTimeDays,
                };
            }
        }

        // Calculate pricing
        const basePrice = parseFloat(product.basePrice.toString());
        const pricing = {
            basePrice,
            finalPrice: basePrice, // TODO: Apply pricing rules
            quantity,
            minimumOrderQuantity: product.minimumOrderQuantity,
        };

        // Map variants if included
        const variants = product.variants?.map((variant: any) => ({
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? parseFloat(variant.price.toString()) : undefined,
        }));

        return {
            id: product.id,
            name: product.name,
            displayName: product.displayName,
            sku: product.sku,
            brand: product.brand,
            model: product.model,
            shortDescription: product.shortDescription,
            images: product.images || [],
            availability,
            pricing,
            category: product.category ? {
                id: product.category.id,
                name: product.category.name,
                slug: product.category.slug,
            } : undefined,
            merchant: product.merchant ? {
                id: product.merchant.id,
                name: product.merchant.name,
                displayName: product.merchant.displayName,
            } : undefined,
            specifications: product.specifications ? JSON.parse(product.specifications) : {},
            relevanceScore: product.searchScore || 0,
            variants,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }

    private buildAppliedFiltersArray(query?: string, filters?: any): string[] {
        const appliedFilters: string[] = [];

        if (query) {
            appliedFilters.push(`search:${query}`);
        }

        if (filters) {
            if (filters.priceRange) {
                const { min, max } = filters.priceRange;
                if (min !== undefined && max !== undefined) {
                    appliedFilters.push(`price:${min}-${max}`);
                } else if (min !== undefined) {
                    appliedFilters.push(`price:${min}+`);
                } else if (max !== undefined) {
                    appliedFilters.push(`price:0-${max}`);
                }
            }

            if (filters.brands && filters.brands.length > 0) {
                appliedFilters.push(`brands:${filters.brands.join(',')}`);
            }

            if (filters.categories && filters.categories.length > 0) {
                appliedFilters.push(`categories:${filters.categories.length}`);
            }

            if (filters.inStockOnly) {
                appliedFilters.push('availability:in-stock');
            }
        }

        return appliedFilters;
    }

    private async generateSearchSuggestions(term: string, limit: number): Promise<string[]> {
        // Simple implementation - in production, consider using more sophisticated algorithms
        const suggestions = await this.prisma.searchAnalytics.findMany({
            where: {
                searchTerm: { contains: term, mode: 'insensitive' },
                resultCount: { gt: 0 },
            },
            select: { searchTerm: true },
            distinct: ['searchTerm'],
            orderBy: { searchAt: 'desc' },
            take: limit,
        });

        return suggestions.map(s => s.searchTerm);
    }

    private async generateDidYouMeanSuggestions(term: string): Promise<string[]> {
        // Simple fuzzy matching - in production, consider using Levenshtein distance
        const suggestions = await this.prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: term.slice(0, -1), mode: 'insensitive' } },
                    { brand: { contains: term.slice(0, -1), mode: 'insensitive' } },
                ],
                status: ProductStatus.PUBLISHED,
                isActive: true,
            },
            select: { name: true, brand: true },
            take: 3,
        });

        const terms = new Set<string>();
        suggestions.forEach(s => {
            if (s.name) terms.add(s.name);
            if (s.brand) terms.add(s.brand);
        });

        return Array.from(terms);
    }

    private async getAvailableFilters(whereClause: Prisma.ProductWhereInput, currentFilters?: any): Promise<AvailableFiltersDto> {
        // Get products matching current search to generate filter options
        const products = await this.prisma.product.findMany({
            where: whereClause,
            select: {
                id: true,
                basePrice: true,
                brand: true,
                categoryId: true,
                merchantId: true,
                category: { select: { id: true, name: true } },
                merchant: { select: { id: true, name: true } },
                inventoryItems: {
                    select: { quantityAvailable: true },
                    take: 1,
                },
            },
        });

        if (products.length === 0) {
            return {};
        }

        // Calculate price range
        const prices = products.map(p => parseFloat(p.basePrice.toString()));
        const priceRange: PriceRangeFilterDto = {
            min: Math.min(...prices),
            max: Math.max(...prices),
            step: 10,
            selectedMin: currentFilters?.priceRange?.min,
            selectedMax: currentFilters?.priceRange?.max,
        };

        // Get brand options
        const brandCounts = new Map<string, number>();
        products.forEach(p => {
            if (p.brand) {
                brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
            }
        });

        const brands: FilterOptionDto[] = Array.from(brandCounts.entries())
            .map(([value, count]) => ({
                value,
                label: value,
                count,
                selected: currentFilters?.brands?.includes(value) || false,
            }))
            .sort((a, b) => b.count - a.count);

        // Get category options
        const categoryCounts = new Map<string, { name: string; count: number }>();
        products.forEach(p => {
            if (p.category) {
                const existing = categoryCounts.get(p.category.id) || { name: p.category.name, count: 0 };
                categoryCounts.set(p.category.id, { ...existing, count: existing.count + 1 });
            }
        });

        const categories: FilterOptionDto[] = Array.from(categoryCounts.entries())
            .map(([value, { name, count }]) => ({
                value,
                label: name,
                count,
                selected: currentFilters?.categories?.includes(value) || false,
            }))
            .sort((a, b) => b.count - a.count);

        // Get availability options
        const inStockCount = products.filter(p =>
            p.inventoryItems.some(i => i.quantityAvailable > 0)
        ).length;

        const availability: FilterOptionDto[] = [
            {
                value: 'in_stock',
                label: 'In Stock',
                count: inStockCount,
                selected: currentFilters?.inStockOnly || false,
            },
            {
                value: 'out_of_stock',
                label: 'Out of Stock',
                count: products.length - inStockCount,
                selected: false,
            },
        ];

        return {
            priceRange,
            brands,
            categories,
            availability,
        };
    }

    // Additional helper methods for analytics...
    private async getSearchVolume(whereClause: any, period: any): Promise<SearchVolumeDto[]> {
        // Implementation for search volume analytics
        return [];
    }

    private async getPopularSearchTerms(whereClause: any, limit: number): Promise<PopularSearchTermDto[]> {
        // Implementation for popular search terms
        return [];
    }

    private async getZeroResultSearches(whereClause: any, limit: number): Promise<ZeroResultSearchDto[]> {
        // Implementation for zero result searches
        return [];
    }

    private async getCategoryAnalytics(whereClause: any, limit: number): Promise<CategoryAnalyticsDto[]> {
        // Implementation for category analytics
        return [];
    }

    private async getSearchPerformance(whereClause: any): Promise<SearchPerformanceDto> {
        // Implementation for search performance metrics
        return {
            avgExecutionTime: 0,
            p95ExecutionTime: 0,
            successRate: 0,
            avgResultsPerSearch: 0,
            clickThroughRate: 0,
            conversionRate: 0,
            trends: [],
        };
    }

    private async calculateSearchSummary(whereClause: any): Promise<any> {
        // Implementation for search summary
        return {
            totalSearches: 0,
            uniqueUsers: 0,
            avgSearchesPerUser: 0,
            avgExecutionTime: 0,
            successRate: 0,
            topCategory: '',
            topSearchTerm: '',
        };
    }

    private mapToSavedSearchResponse(savedSearch: any): SavedSearchResponseDto {
        return {
            id: savedSearch.id,
            userId: savedSearch.userId,
            name: savedSearch.name,
            searchTerm: savedSearch.searchTerm,
            filters: savedSearch.filters ? JSON.parse(savedSearch.filters) : {},
            alerts: {
                onNewResults: savedSearch.alertOnNewResults,
                onPriceChange: savedSearch.alertOnPriceChange,
                frequency: AlertFrequency.DAILY, // TODO: Add to schema
                priceChangeThreshold: 5, // TODO: Add to schema
            },
            statistics: {
                lastExecuted: savedSearch.lastExecuted,
                resultCount: savedSearch.resultCount || 0,
                executionCount: 0, // TODO: Add to schema
            },
            description: savedSearch.description,
            isActive: savedSearch.isActive,
            createdAt: savedSearch.createdAt,
            updatedAt: savedSearch.updatedAt,
        };
    }
}
