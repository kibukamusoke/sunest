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
exports.SearchDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const client_1 = require("@prisma/client");
const dto_1 = require("./dto");
let SearchDiscoveryService = class SearchDiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchProducts(searchDto, userId, sessionId) {
        const startTime = Date.now();
        const { q, type = client_1.SearchType.FULL_TEXT, filters, sort, page = 1, limit = 20, includeVariants = false, includeInventory = true, includeCategory = true, includeMerchant = false, warehouseId, quantity = 1, } = searchDto;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const whereClause = this.buildSearchWhereClause(q, type, filters, warehouseId);
        const orderBy = this.buildSearchOrderClause(sort, q);
        const include = this.buildSearchIncludeClause(includeVariants, includeInventory, includeCategory, includeMerchant);
        try {
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
            const searchProducts = await Promise.all(products.map((product) => this.mapToSearchProduct(product, quantity, warehouseId)));
            const executionTime = Date.now() - startTime;
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
            const metadata = {
                executionTime,
                appliedFilters: this.buildAppliedFiltersArray(q, filters),
                suggestedTerms: q
                    ? await this.generateSearchSuggestions(q, 3)
                    : undefined,
                didYouMean: q && total === 0
                    ? await this.generateDidYouMeanSuggestions(q)
                    : undefined,
                totalFound: total,
                searchQuery: q,
                searchType: type,
            };
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            };
            const availableFilters = await this.getAvailableFilters(whereClause, filters);
            return {
                products: searchProducts,
                pagination,
                metadata,
                availableFilters,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Search failed: ${error.message}`);
        }
    }
    async quickSearch(query, limit = 5) {
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
        const whereClause = {
            AND: [
                { status: client_1.ProductStatus.PUBLISHED },
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
                orderBy: [{ searchScore: 'desc' }, { name: 'asc' }],
                take: limit,
            }),
            this.prisma.product.count({ where: whereClause }),
        ]);
        const suggestions = await this.generateSearchSuggestions(searchTerm, 3);
        return {
            products: products.map((p) => ({
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
            })),
            totalMatches,
            hasMore: totalMatches > limit,
            suggestions,
            executionTime: Date.now() - startTime,
        };
    }
    async bulkSkuSearch(bulkSearchDto, warehouseId) {
        const startTime = Date.now();
        const { skus, includeInventory = true, includePricing = true, } = bulkSearchDto;
        if (skus.length === 0) {
            return {
                found: {},
                notFound: [],
                totalSearched: 0,
                totalFound: 0,
                executionTime: Date.now() - startTime,
            };
        }
        const uniqueSkus = [
            ...new Set(skus.map((sku) => sku.trim().toUpperCase())),
        ];
        const products = await this.prisma.product.findMany({
            where: {
                sku: { in: uniqueSkus, mode: 'insensitive' },
                status: client_1.ProductStatus.PUBLISHED,
                isActive: true,
            },
            include: {
                category: true,
                inventoryItems: includeInventory,
            },
        });
        const found = {};
        const foundSkus = new Set();
        await Promise.all(products.map(async (product) => {
            const searchProduct = await this.mapToSearchProduct(product, 1, warehouseId);
            found[product.sku.toUpperCase()] = searchProduct;
            foundSkus.add(product.sku.toUpperCase());
        }));
        const notFound = uniqueSkus.filter((sku) => !foundSkus.has(sku));
        return {
            found,
            notFound,
            totalSearched: uniqueSkus.length,
            totalFound: products.length,
            executionTime: Date.now() - startTime,
        };
    }
    async getSearchSuggestions(suggestionDto) {
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
        const whereClause = {
            AND: [
                { status: client_1.ProductStatus.PUBLISHED },
                { isActive: true },
                categoryId ? { categoryId } : {},
            ],
        };
        const [productSuggestions, categorySuggestions, brandSuggestions, popularSuggestions,] = await Promise.all([
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
            this.prisma.category.findMany({
                where: {
                    isActive: true,
                    name: { contains: term, mode: 'insensitive' },
                },
                select: { name: true },
                orderBy: { name: 'asc' },
                take: Math.ceil(limit / 4),
            }),
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
        const products = productSuggestions.map((p) => p.name);
        const categories = categorySuggestions.map((c) => c.name);
        const brands = brandSuggestions
            .map((b) => b.brand)
            .filter((brand) => brand !== null);
        const popular = popularSuggestions.map((s) => s.searchTerm);
        return {
            products,
            categories,
            brands,
            popular,
            total: products.length + categories.length + brands.length + popular.length,
            searchTerm: term,
        };
    }
    async createSavedSearch(createDto, userId) {
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
    async getSavedSearches(userId) {
        const searches = await this.prisma.savedSearch.findMany({
            where: { userId, isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
        return {
            searches: searches.map((s) => this.mapToSavedSearchResponse(s)),
            total: searches.length,
            activeCount: searches.filter((s) => s.isActive).length,
            alertEnabledCount: searches.filter((s) => s.alertOnNewResults || s.alertOnPriceChange).length,
        };
    }
    async updateSavedSearch(searchId, updateDto, userId) {
        const existingSearch = await this.prisma.savedSearch.findFirst({
            where: { id: searchId, userId },
        });
        if (!existingSearch) {
            throw new common_1.NotFoundException('Saved search not found');
        }
        const updatedSearch = await this.prisma.savedSearch.update({
            where: { id: searchId },
            data: {
                name: updateDto.name,
                searchTerm: updateDto.searchTerm,
                filters: updateDto.filters
                    ? JSON.stringify(updateDto.filters)
                    : undefined,
                alertOnNewResults: updateDto.alertOnNewResults,
                alertOnPriceChange: updateDto.alertOnPriceChange,
                isActive: updateDto.isActive,
            },
        });
        return this.mapToSavedSearchResponse(updatedSearch);
    }
    async deleteSavedSearch(searchId, userId) {
        const existingSearch = await this.prisma.savedSearch.findFirst({
            where: { id: searchId, userId },
        });
        if (!existingSearch) {
            throw new common_1.NotFoundException('Saved search not found');
        }
        await this.prisma.savedSearch.delete({
            where: { id: searchId },
        });
    }
    async executeSavedSearch(executeDto, userId) {
        const savedSearch = await this.prisma.savedSearch.findFirst({
            where: { id: executeDto.searchId, userId, isActive: true },
        });
        if (!savedSearch) {
            throw new common_1.NotFoundException('Saved search not found');
        }
        const filters = savedSearch.filters ? JSON.parse(savedSearch.filters) : {};
        const searchDto = {
            q: savedSearch.searchTerm || undefined,
            filters,
            page: executeDto.page,
            limit: executeDto.limit,
            includeInventory: executeDto.includeAvailability,
            warehouseId: executeDto.warehouseId,
        };
        const result = await this.searchProducts(searchDto, userId);
        await this.prisma.savedSearch.update({
            where: { id: executeDto.searchId },
            data: {
                lastExecuted: new Date(),
                resultCount: result.pagination.total,
            },
        });
        return result;
    }
    async trackSearchAnalytics(analyticsDto, userId) {
        try {
            await this.prisma.searchAnalytics.create({
                data: {
                    searchTerm: analyticsDto.searchTerm,
                    searchType: analyticsDto.searchType,
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
            if (analyticsDto.clickedResult) {
                await this.prisma.product.update({
                    where: { id: analyticsDto.clickedResult },
                    data: {
                        searchCount: { increment: 1 },
                        lastSearched: new Date(),
                    },
                });
            }
        }
        catch (error) {
            console.error('Failed to track search analytics:', error);
        }
    }
    async getSearchAnalytics(queryDto) {
        const { startDate, endDate, period, merchantId, category, limit = 100, } = queryDto;
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.searchAt = {};
            if (startDate)
                dateFilter.searchAt.gte = new Date(startDate);
            if (endDate)
                dateFilter.searchAt.lte = new Date(endDate);
        }
        const whereClause = {
            ...dateFilter,
            ...(merchantId && { merchantId }),
        };
        const volume = await this.getSearchVolume(whereClause, period);
        const topTerms = await this.getPopularSearchTerms(whereClause, limit);
        const zeroResults = await this.getZeroResultSearches(whereClause, limit);
        const categories = await this.getCategoryAnalytics(whereClause, limit);
        const performance = await this.getSearchPerformance(whereClause);
        const summary = await this.calculateSearchSummary(whereClause);
        return {
            volume,
            topTerms,
            zeroResults,
            categories,
            performance,
            summary,
            period: {
                startDate: startDate
                    ? new Date(startDate)
                    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: endDate ? new Date(endDate) : new Date(),
                duration: period || 'DAY',
            },
        };
    }
    buildSearchWhereClause(query, type = client_1.SearchType.FULL_TEXT, filters, warehouseId) {
        const whereConditions = [
            { status: client_1.ProductStatus.PUBLISHED },
            { isActive: true },
        ];
        const whereClause = {
            AND: whereConditions,
        };
        if (query && query.trim()) {
            const searchTerm = query.trim();
            switch (type) {
                case client_1.SearchType.SKU:
                    whereConditions.push({
                        OR: [
                            { sku: { contains: searchTerm, mode: 'insensitive' } },
                            {
                                variants: {
                                    some: { sku: { contains: searchTerm, mode: 'insensitive' } },
                                },
                            },
                        ],
                    });
                    break;
                case client_1.SearchType.CATEGORY:
                    whereConditions.push({
                        category: { name: { contains: searchTerm, mode: 'insensitive' } },
                    });
                    break;
                default:
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
        if (filters) {
            if (filters.priceRange) {
                const priceFilter = {};
                if (filters.priceRange.min !== undefined)
                    priceFilter.gte = filters.priceRange.min;
                if (filters.priceRange.max !== undefined)
                    priceFilter.lte = filters.priceRange.max;
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
    buildSearchOrderClause(sort, query) {
        const orderBy = [];
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
                default:
                    if (query) {
                        orderBy.push({ searchScore: 'desc' });
                    }
                    orderBy.push({ name: 'asc' });
            }
        }
        else {
            if (query) {
                orderBy.push({ searchScore: 'desc' });
            }
            orderBy.push({ name: 'asc' });
        }
        return orderBy;
    }
    buildSearchIncludeClause(includeVariants, includeInventory, includeCategory, includeMerchant) {
        return {
            category: includeCategory,
            merchant: includeMerchant,
            variants: includeVariants,
            inventoryItems: includeInventory,
        };
    }
    async mapToSearchProduct(product, quantity = 1, warehouseId) {
        let availability;
        if (product.inventoryItems && product.inventoryItems.length > 0) {
            const inventoryItem = product.inventoryItems[0];
            if (inventoryItem) {
                availability = {
                    inStock: inventoryItem.quantityAvailable > 0,
                    quantity: inventoryItem.quantityAvailable,
                    leadTimeDays: inventoryItem.leadTimeDays,
                };
            }
        }
        const basePrice = parseFloat(product.basePrice.toString());
        const pricing = {
            basePrice,
            finalPrice: basePrice,
            quantity,
            minimumOrderQuantity: product.minimumOrderQuantity,
        };
        const variants = product.variants?.map((variant) => ({
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
            category: product.category
                ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                }
                : undefined,
            merchant: product.merchant
                ? {
                    id: product.merchant.id,
                    name: product.merchant.name,
                    displayName: product.merchant.displayName,
                }
                : undefined,
            specifications: product.specifications
                ? JSON.parse(product.specifications)
                : {},
            relevanceScore: product.searchScore || 0,
            variants,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
    buildAppliedFiltersArray(query, filters) {
        const appliedFilters = [];
        if (query) {
            appliedFilters.push(`search:${query}`);
        }
        if (filters) {
            if (filters.priceRange) {
                const { min, max } = filters.priceRange;
                if (min !== undefined && max !== undefined) {
                    appliedFilters.push(`price:${min}-${max}`);
                }
                else if (min !== undefined) {
                    appliedFilters.push(`price:${min}+`);
                }
                else if (max !== undefined) {
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
    async generateSearchSuggestions(term, limit) {
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
        return suggestions.map((s) => s.searchTerm);
    }
    async generateDidYouMeanSuggestions(term) {
        const suggestions = await this.prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: term.slice(0, -1), mode: 'insensitive' } },
                    { brand: { contains: term.slice(0, -1), mode: 'insensitive' } },
                ],
                status: client_1.ProductStatus.PUBLISHED,
                isActive: true,
            },
            select: { name: true, brand: true },
            take: 3,
        });
        const terms = new Set();
        suggestions.forEach((s) => {
            if (s.name)
                terms.add(s.name);
            if (s.brand)
                terms.add(s.brand);
        });
        return Array.from(terms);
    }
    async getAvailableFilters(whereClause, currentFilters) {
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
        const prices = products.map((p) => parseFloat(p.basePrice.toString()));
        const priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices),
            step: 10,
            selectedMin: currentFilters?.priceRange?.min,
            selectedMax: currentFilters?.priceRange?.max,
        };
        const brandCounts = new Map();
        products.forEach((p) => {
            if (p.brand) {
                brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
            }
        });
        const brands = Array.from(brandCounts.entries())
            .map(([value, count]) => ({
            value,
            label: value,
            count,
            selected: currentFilters?.brands?.includes(value) || false,
        }))
            .sort((a, b) => b.count - a.count);
        const categoryCounts = new Map();
        products.forEach((p) => {
            if (p.category) {
                const existing = categoryCounts.get(p.category.id) || {
                    name: p.category.name,
                    count: 0,
                };
                categoryCounts.set(p.category.id, {
                    ...existing,
                    count: existing.count + 1,
                });
            }
        });
        const categories = Array.from(categoryCounts.entries())
            .map(([value, { name, count }]) => ({
            value,
            label: name,
            count,
            selected: currentFilters?.categories?.includes(value) || false,
        }))
            .sort((a, b) => b.count - a.count);
        const inStockCount = products.filter((p) => p.inventoryItems.some((i) => i.quantityAvailable > 0)).length;
        const availability = [
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
    async getSearchVolume(whereClause, period) {
        return [];
    }
    async getPopularSearchTerms(whereClause, limit) {
        return [];
    }
    async getZeroResultSearches(whereClause, limit) {
        return [];
    }
    async getCategoryAnalytics(whereClause, limit) {
        return [];
    }
    async getSearchPerformance(whereClause) {
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
    async calculateSearchSummary(whereClause) {
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
    mapToSavedSearchResponse(savedSearch) {
        return {
            id: savedSearch.id,
            userId: savedSearch.userId,
            name: savedSearch.name,
            searchTerm: savedSearch.searchTerm,
            filters: savedSearch.filters ? JSON.parse(savedSearch.filters) : {},
            alerts: {
                onNewResults: savedSearch.alertOnNewResults,
                onPriceChange: savedSearch.alertOnPriceChange,
                frequency: dto_1.AlertFrequency.DAILY,
                priceChangeThreshold: 5,
            },
            statistics: {
                lastExecuted: savedSearch.lastExecuted,
                resultCount: savedSearch.resultCount || 0,
                executionCount: 0,
            },
            description: savedSearch.description,
            isActive: savedSearch.isActive,
            createdAt: savedSearch.createdAt,
            updatedAt: savedSearch.updatedAt,
        };
    }
};
exports.SearchDiscoveryService = SearchDiscoveryService;
exports.SearchDiscoveryService = SearchDiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchDiscoveryService);
//# sourceMappingURL=search-discovery.service.js.map