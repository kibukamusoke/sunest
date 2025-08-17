import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    Param,
    UseGuards,
    Request,
    HttpStatus,
    ParseIntPipe,
    DefaultValuePipe,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { SearchDiscoveryService } from './search-discovery.service';
import {
    ProductSearchDto,
    BulkSkuSearchDto,
    SearchSuggestionDto,
    ProductSearchResponseDto,
    BulkSkuSearchResponseDto,
    SearchSuggestionResponseDto,
    QuickSearchResponseDto,
    CreateSavedSearchDto,
    UpdateSavedSearchDto,
    SavedSearchResponseDto,
    SavedSearchListDto,
    ExecuteSavedSearchDto,
    SearchAnalyticsQueryDto,
    SearchAnalyticsResponseDto,
    AnalyticsPeriod,
} from './dto';

@ApiTags('Search & Discovery')
@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class SearchDiscoveryController {
    constructor(private readonly searchService: SearchDiscoveryService) { }

    // ==================== PRODUCT SEARCH ====================

    @Post('products')
    @ApiOperation({
        summary: 'Search products with advanced filtering',
        description: 'Comprehensive product search with full-text search, filtering, sorting, and pagination capabilities',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product search results with pagination and metadata',
        type: ProductSearchResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid search parameters',
    })
    @ApiBody({ type: ProductSearchDto })
    @UsePipes(new ValidationPipe({ transform: true }))
    async searchProducts(
        @Body() searchDto: ProductSearchDto,
        @Request() req: any,
    ): Promise<ProductSearchResponseDto> {
        const userId = req.user?.userId;
        const sessionId = req.sessionID || `session-${Date.now()}`;

        return this.searchService.searchProducts(searchDto, userId, sessionId);
    }

    @Get('quick')
    @ApiOperation({
        summary: 'Quick product search',
        description: 'Fast search for instant results and auto-complete functionality',
    })
    @ApiQuery({
        name: 'q',
        description: 'Search query term',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Maximum number of results',
        required: false,
        type: Number,
        example: 5,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quick search results',
        type: QuickSearchResponseDto,
    })
    async quickSearch(
        @Query('q') query: string,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    ): Promise<QuickSearchResponseDto> {
        return this.searchService.quickSearch(query, limit);
    }

    @Post('bulk-sku')
    @ApiOperation({
        summary: 'Bulk SKU search',
        description: 'Search multiple products by SKU for procurement and inventory management',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bulk SKU search results',
        type: BulkSkuSearchResponseDto,
    })
    @ApiBody({ type: BulkSkuSearchDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @UsePipes(new ValidationPipe({ transform: true }))
    async bulkSkuSearch(
        @Body() bulkSearchDto: BulkSkuSearchDto,
        @Query('warehouseId') warehouseId?: string,
    ): Promise<BulkSkuSearchResponseDto> {
        return this.searchService.bulkSkuSearch(bulkSearchDto, warehouseId);
    }

    @Post('suggestions')
    @ApiOperation({
        summary: 'Get search suggestions',
        description: 'Get intelligent search suggestions for auto-complete and search assistance',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Search suggestions',
        type: SearchSuggestionResponseDto,
    })
    @ApiBody({ type: SearchSuggestionDto })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getSearchSuggestions(
        @Body() suggestionDto: SearchSuggestionDto,
    ): Promise<SearchSuggestionResponseDto> {
        return this.searchService.getSearchSuggestions(suggestionDto);
    }

    // ==================== SAVED SEARCHES ====================

    @Get('saved')
    @ApiOperation({
        summary: 'Get user saved searches',
        description: 'Retrieve all saved searches for the authenticated user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of saved searches',
        type: SavedSearchListDto,
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    async getSavedSearches(@Request() req: any): Promise<SavedSearchListDto> {
        const userId = req.user.userId;
        return this.searchService.getSavedSearches(userId);
    }

    @Post('saved')
    @ApiOperation({
        summary: 'Create saved search',
        description: 'Save a search configuration for future use and alerts',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Saved search created successfully',
        type: SavedSearchResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid saved search data',
    })
    @ApiBody({ type: CreateSavedSearchDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createSavedSearch(
        @Body() createDto: CreateSavedSearchDto,
        @Request() req: any,
    ): Promise<SavedSearchResponseDto> {
        const userId = req.user.userId;
        return this.searchService.createSavedSearch(createDto, userId);
    }

    @Put('saved/:searchId')
    @ApiOperation({
        summary: 'Update saved search',
        description: 'Update an existing saved search configuration',
    })
    @ApiParam({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Saved search updated successfully',
        type: SavedSearchResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    })
    @ApiBody({ type: UpdateSavedSearchDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateSavedSearch(
        @Param('searchId') searchId: string,
        @Body() updateDto: UpdateSavedSearchDto,
        @Request() req: any,
    ): Promise<SavedSearchResponseDto> {
        const userId = req.user.userId;
        return this.searchService.updateSavedSearch(searchId, updateDto, userId);
    }

    @Delete('saved/:searchId')
    @ApiOperation({
        summary: 'Delete saved search',
        description: 'Remove a saved search from the user account',
    })
    @ApiParam({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Saved search deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    async deleteSavedSearch(
        @Param('searchId') searchId: string,
        @Request() req: any,
    ): Promise<void> {
        const userId = req.user.userId;
        return this.searchService.deleteSavedSearch(searchId, userId);
    }

    @Post('saved/:searchId/execute')
    @ApiOperation({
        summary: 'Execute saved search',
        description: 'Run a saved search and get updated results',
    })
    @ApiParam({
        name: 'searchId',
        description: 'Saved search ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Saved search execution results',
        type: ProductSearchResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Saved search not found',
    })
    @ApiBody({ type: ExecuteSavedSearchDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @UsePipes(new ValidationPipe({ transform: true }))
    async executeSavedSearch(
        @Param('searchId') searchId: string,
        @Body() executeDto: ExecuteSavedSearchDto,
        @Request() req: any,
    ): Promise<ProductSearchResponseDto> {
        const userId = req.user.userId;
        executeDto.searchId = searchId; // Ensure consistency
        return this.searchService.executeSavedSearch(executeDto, userId);
    }

    // ==================== SEARCH ANALYTICS ====================

    @Get('analytics')
    @ApiOperation({
        summary: 'Get search analytics',
        description: 'Retrieve comprehensive search analytics and insights for business intelligence',
    })
    @ApiQuery({
        name: 'startDate',
        description: 'Start date for analytics period (ISO string)',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'endDate',
        description: 'End date for analytics period (ISO string)',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'period',
        description: 'Analytics period granularity',
        required: false,
        enum: AnalyticsPeriod,
    })
    @ApiQuery({
        name: 'merchantId',
        description: 'Filter analytics by merchant',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'category',
        description: 'Filter analytics by category',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Limit for top results',
        required: false,
        type: Number,
        example: 100,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Search analytics data',
        type: SearchAnalyticsResponseDto,
    })
    @Roles('system_admin', 'merchant_admin')
    @Permissions('system:manage', 'merchant:manage')
    async getSearchAnalytics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('period') period?: AnalyticsPeriod,
        @Query('merchantId') merchantId?: string,
        @Query('category') category?: string,
        @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    ): Promise<SearchAnalyticsResponseDto> {
        const queryDto: SearchAnalyticsQueryDto = {
            startDate,
            endDate,
            period,
            merchantId,
            category,
            limit,
        };

        return this.searchService.getSearchAnalytics(queryDto);
    }

    @Post('analytics/track-click')
    @ApiOperation({
        summary: 'Track product click',
        description: 'Record when a user clicks on a search result for analytics',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Click tracked successfully',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    async trackProductClick(
        @Body() trackingData: { productId: string; searchTerm?: string; sessionId?: string },
        @Request() req: any,
    ): Promise<void> {
        const userId = req.user?.userId;
        const sessionId = trackingData.sessionId || req.sessionID || `session-${Date.now()}`;

        await this.searchService.trackSearchAnalytics(
            {
                searchTerm: trackingData.searchTerm || '',
                searchType: 'FULL_TEXT' as any,
                resultCount: 1,
                clickedResult: trackingData.productId,
                sessionId,
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            },
            userId,
        );
    }

    // ==================== HEALTH & STATUS ====================

    @Get('health')
    @ApiOperation({
        summary: 'Search service health check',
        description: 'Check the health and performance of the search service',
    })
    @ApiResponse({
        status: HttpStatus.OK,
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
    })
    async getSearchHealth(): Promise<any> {
        const uptime = process.uptime();

        // In a real implementation, you would check actual service health
        return {
            status: 'healthy',
            timestamp: new Date(),
            uptime,
            searchIndex: {
                totalProducts: 0, // TODO: Get from database
                indexedProducts: 0, // TODO: Get from database
                lastUpdated: new Date(),
            },
            performance: {
                avgSearchTime: 150, // TODO: Calculate from analytics
                searchesPerMinute: 25, // TODO: Calculate from analytics
                cacheHitRate: 0.82, // TODO: Calculate from cache metrics
            },
        };
    }

    @Get('popular-terms')
    @ApiOperation({
        summary: 'Get popular search terms',
        description: 'Retrieve the most popular search terms for the past period',
    })
    @ApiQuery({
        name: 'limit',
        description: 'Number of popular terms to return',
        required: false,
        type: Number,
        example: 20,
    })
    @ApiQuery({
        name: 'period',
        description: 'Time period for popular terms',
        required: false,
        enum: AnalyticsPeriod,
        example: AnalyticsPeriod.WEEK,
    })
    @ApiResponse({
        status: HttpStatus.OK,
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
                            trend: { type: 'string', enum: ['up', 'down', 'stable'], example: 'up' },
                            avgResults: { type: 'number', example: 450 },
                        },
                    },
                },
                period: { type: 'string', example: 'WEEK' },
                totalSearches: { type: 'number', example: 15000 },
            },
        },
    })
    @Roles('system_admin', 'merchant_admin')
    async getPopularSearchTerms(
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('period', new DefaultValuePipe(AnalyticsPeriod.WEEK)) period: AnalyticsPeriod,
    ): Promise<any> {
        // TODO: Implement with actual analytics data
        return {
            terms: [],
            period,
            totalSearches: 0,
        };
    }
}
