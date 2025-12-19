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
exports.SearchDiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const search_discovery_service_1 = require("./search-discovery.service");
const dto_1 = require("./dto");
let SearchDiscoveryController = class SearchDiscoveryController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchProducts(searchDto, req) {
        const userId = req.user?.userId;
        const sessionId = req.sessionID || `session-${Date.now()}`;
        return this.searchService.searchProducts(searchDto, userId, sessionId);
    }
    async quickSearch(query, limit) {
        return this.searchService.quickSearch(query, limit);
    }
    async bulkSkuSearch(bulkSearchDto, warehouseId) {
        return this.searchService.bulkSkuSearch(bulkSearchDto, warehouseId);
    }
    async getSearchSuggestions(suggestionDto) {
        return this.searchService.getSearchSuggestions(suggestionDto);
    }
    async getSavedSearches(req) {
        const userId = req.user.userId;
        return this.searchService.getSavedSearches(userId);
    }
    async createSavedSearch(createDto, req) {
        const userId = req.user.userId;
        return this.searchService.createSavedSearch(createDto, userId);
    }
    async updateSavedSearch(searchId, updateDto, req) {
        const userId = req.user.userId;
        return this.searchService.updateSavedSearch(searchId, updateDto, userId);
    }
    async deleteSavedSearch(searchId, req) {
        const userId = req.user.userId;
        return this.searchService.deleteSavedSearch(searchId, userId);
    }
    async executeSavedSearch(searchId, executeDto, req) {
        const userId = req.user.userId;
        executeDto.searchId = searchId;
        return this.searchService.executeSavedSearch(executeDto, userId);
    }
    async getSearchAnalytics(startDate, endDate, period, merchantId, category, limit) {
        const queryDto = {
            startDate,
            endDate,
            period,
            merchantId,
            category,
            limit,
        };
        return this.searchService.getSearchAnalytics(queryDto);
    }
    async trackProductClick(trackingData, req) {
        const userId = req.user?.userId;
        const sessionId = trackingData.sessionId || req.sessionID || `session-${Date.now()}`;
        await this.searchService.trackSearchAnalytics({
            searchTerm: trackingData.searchTerm || '',
            searchType: 'FULL_TEXT',
            resultCount: 1,
            clickedResult: trackingData.productId,
            sessionId,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        }, userId);
    }
    async getSearchHealth() {
        const uptime = process.uptime();
        return {
            status: 'healthy',
            timestamp: new Date(),
            uptime,
            searchIndex: {
                totalProducts: 0,
                indexedProducts: 0,
                lastUpdated: new Date(),
            },
            performance: {
                avgSearchTime: 150,
                searchesPerMinute: 25,
                cacheHitRate: 0.82,
            },
        };
    }
    async getPopularSearchTerms(limit, period) {
        return {
            terms: [],
            period,
            totalSearches: 0,
        };
    }
};
exports.SearchDiscoveryController = SearchDiscoveryController;
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search products with advanced filtering',
        description: 'Comprehensive product search with full-text search, filtering, sorting, and pagination capabilities',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product search results with pagination and metadata',
        type: dto_1.ProductSearchResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid search parameters',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.ProductSearchDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProductSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('quick'),
    (0, swagger_1.ApiOperation)({
        summary: 'Quick product search',
        description: 'Fast search for instant results and auto-complete functionality',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        description: 'Search query term',
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Maximum number of results',
        required: false,
        type: Number,
        example: 5,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quick search results',
        type: dto_1.QuickSearchResponseDto,
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "quickSearch", null);
__decorate([
    (0, common_1.Post)('bulk-sku'),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk SKU search',
        description: 'Search multiple products by SKU for procurement and inventory management',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bulk SKU search results',
        type: dto_1.BulkSkuSearchResponseDto,
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.BulkSkuSearchDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkSkuSearchDto, String]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "bulkSkuSearch", null);
__decorate([
    (0, common_1.Post)('suggestions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search suggestions',
        description: 'Get intelligent search suggestions for auto-complete and search assistance',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Search suggestions',
        type: dto_1.SearchSuggestionResponseDto,
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.SearchSuggestionDto }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchSuggestionDto]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "getSearchSuggestions", null);
__decorate([
    (0, common_1.Get)('saved'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user saved searches',
        description: 'Retrieve all saved searches for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of saved searches',
        type: dto_1.SavedSearchListDto,
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "getSavedSearches", null);
__decorate([
    (0, common_1.Post)('saved'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create saved search',
        description: 'Save a search configuration for future use and alerts',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Saved search created successfully',
        type: dto_1.SavedSearchResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid saved search data',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateSavedSearchDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSavedSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "createSavedSearch", null);
__decorate([
    (0, common_1.Put)('saved/:searchId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update saved search',
        description: 'Update an existing saved search configuration',
    }),
    (0, swagger_1.ApiParam)({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Saved search updated successfully',
        type: dto_1.SavedSearchResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateSavedSearchDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('searchId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSavedSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "updateSavedSearch", null);
__decorate([
    (0, common_1.Delete)('saved/:searchId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete saved search',
        description: 'Remove a saved search from the user account',
    }),
    (0, swagger_1.ApiParam)({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Saved search deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('searchId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "deleteSavedSearch", null);
__decorate([
    (0, common_1.Post)('saved/:searchId/execute'),
    (0, swagger_1.ApiOperation)({
        summary: 'Execute saved search',
        description: 'Run a saved search and get updated results',
    }),
    (0, swagger_1.ApiParam)({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Saved search execution results',
        type: dto_1.ProductSearchResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.ExecuteSavedSearchDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('searchId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteSavedSearchDto, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "executeSavedSearch", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search analytics',
        description: 'Retrieve comprehensive search analytics and insights for business intelligence',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        description: 'Start date for analytics period (ISO string)',
        required: false,
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        description: 'End date for analytics period (ISO string)',
        required: false,
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        description: 'Analytics period granularity',
        required: false,
        enum: dto_1.AnalyticsPeriod,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'merchantId',
        description: 'Filter analytics by merchant',
        required: false,
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        description: 'Filter analytics by category',
        required: false,
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Limit for top results',
        required: false,
        type: Number,
        example: 100,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Search analytics data',
        type: dto_1.SearchAnalyticsResponseDto,
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin'),
    (0, permissions_decorator_1.Permissions)('system:manage', 'merchant:manage'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('period')),
    __param(3, (0, common_1.Query)('merchantId')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "getSearchAnalytics", null);
__decorate([
    (0, common_1.Post)('analytics/track-click'),
    (0, swagger_1.ApiOperation)({
        summary: 'Track product click',
        description: 'Record when a user clicks on a search result for analytics',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Click tracked successfully',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "trackProductClick", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search service health check',
        description: 'Check the health and performance of the search service',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Search service health status',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', format: 'date-time' },
                uptime: { type: 'number', example: 86400 },
                searchIndex: {
                    type: 'object',
                    properties: {
                        totalProducts: { type: 'number', example: 50000 },
                        indexedProducts: { type: 'number', example: 49998 },
                        lastUpdated: { type: 'string', format: 'date-time' },
                    },
                },
                performance: {
                    type: 'object',
                    properties: {
                        avgSearchTime: { type: 'number', example: 120 },
                        searchesPerMinute: { type: 'number', example: 45 },
                        cacheHitRate: { type: 'number', example: 0.85 },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "getSearchHealth", null);
__decorate([
    (0, common_1.Get)('popular-terms'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get popular search terms',
        description: 'Retrieve the most popular search terms for the past period',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Number of popular terms to return',
        required: false,
        type: Number,
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        description: 'Time period for popular terms',
        required: false,
        enum: dto_1.AnalyticsPeriod,
        example: dto_1.AnalyticsPeriod.WEEK,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Popular search terms',
        schema: {
            type: 'object',
            properties: {
                terms: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            term: { type: 'string', example: 'gaming laptop' },
                            count: { type: 'number', example: 1250 },
                            trend: {
                                type: 'string',
                                enum: ['up', 'down', 'stable'],
                                example: 'up',
                            },
                            avgResults: { type: 'number', example: 450 },
                        },
                    },
                },
                period: { type: 'string', example: 'WEEK' },
                totalSearches: { type: 'number', example: 15000 },
            },
        },
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin'),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('period', new common_1.DefaultValuePipe(dto_1.AnalyticsPeriod.WEEK))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SearchDiscoveryController.prototype, "getPopularSearchTerms", null);
exports.SearchDiscoveryController = SearchDiscoveryController = __decorate([
    (0, swagger_1.ApiTags)('Search & Discovery'),
    (0, common_1.Controller)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [search_discovery_service_1.SearchDiscoveryService])
], SearchDiscoveryController);
//# sourceMappingURL=search-discovery.controller.js.map