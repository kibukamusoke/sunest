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
    HttpStatus,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RFQManagementService } from './rfq-management.service';
import {
    CreateRFQDto,
    UpdateRFQDto,
    RFQResponseDto,
    RFQListDto,
    RFQFilterDto,
    SubmitRFQDto,
    CreateQuoteDto,
    UpdateQuoteDto,
    QuoteResponseDto,
    QuoteListDto,
    QuoteFilterDto,
    AcceptQuoteDto,
    RejectQuoteDto,
    CounterOfferDto,
    QuoteRevisionDto,
    CreateRFQCommentDto,
    CreateQuoteCommentDto,
    RFQCommentListDto,
    QuoteCommentListDto,
    RFQCommentResponseDto,
    QuoteCommentResponseDto,
} from './dto';

@ApiTags('RFQ & Quote Management')
@Controller('rfq')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class RFQManagementController {
    constructor(private readonly rfqService: RFQManagementService) { }

    // ==================== RFQ MANAGEMENT ====================

    @Post()
    @ApiOperation({
        summary: 'Create new RFQ',
        description: 'Create a new Request for Quote with multiple items and specifications',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'RFQ created successfully',
        type: RFQResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid RFQ data',
    })
    @ApiBody({ type: CreateRFQDto })
    @Roles('system_admin', 'buyer')
    @Permissions('rfq:create')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createRFQ(
        @Body() createRFQDto: CreateRFQDto,
        @Request() req: any,
    ): Promise<RFQResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.createRFQ(createRFQDto, userId);
    }

    @Get()
    @ApiOperation({
        summary: 'List RFQs',
        description: 'Get a list of RFQs with filtering and pagination',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'RFQ list retrieved successfully',
        type: RFQListDto,
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('rfq:read')
    async listRFQs(
        @Query() filterDto: RFQFilterDto,
        @Request() req: any,
    ): Promise<RFQListDto> {
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];
        return this.rfqService.listRFQs(filterDto, userId, userRoles);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get RFQ by ID',
        description: 'Retrieve detailed information about a specific RFQ',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'RFQ details retrieved successfully',
        type: RFQResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('rfq:read')
    async getRFQById(
        @Param('id') rfqId: string,
        @Request() req: any,
    ): Promise<RFQResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.getRFQById(rfqId, userId);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update RFQ',
        description: 'Update an existing RFQ (only available for draft RFQs)',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'RFQ updated successfully',
        type: RFQResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied or RFQ cannot be updated',
    })
    @ApiBody({ type: UpdateRFQDto })
    @Roles('system_admin', 'buyer')
    @Permissions('rfq:update')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateRFQ(
        @Param('id') rfqId: string,
        @Body() updateRFQDto: UpdateRFQDto,
        @Request() req: any,
    ): Promise<RFQResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.updateRFQ(rfqId, updateRFQDto, userId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete RFQ',
        description: 'Delete an RFQ (only available for draft RFQs)',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'RFQ deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied or RFQ cannot be deleted',
    })
    @Roles('system_admin', 'buyer')
    @Permissions('rfq:delete')
    async deleteRFQ(
        @Param('id') rfqId: string,
        @Request() req: any,
    ): Promise<void> {
        const userId = req.user.userId;
        return this.rfqService.deleteRFQ(rfqId, userId);
    }

    @Post(':id/submit')
    @ApiOperation({
        summary: 'Submit RFQ',
        description: 'Submit an RFQ for merchant quotes',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'RFQ submitted successfully',
        type: RFQResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'RFQ cannot be submitted',
    })
    @ApiBody({ type: SubmitRFQDto })
    @Roles('system_admin', 'buyer')
    @Permissions('rfq:submit')
    @UsePipes(new ValidationPipe({ transform: true }))
    async submitRFQ(
        @Param('id') rfqId: string,
        @Body() submitDto: SubmitRFQDto,
        @Request() req: any,
    ): Promise<RFQResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.submitRFQ(rfqId, submitDto, userId);
    }

    // ==================== QUOTE MANAGEMENT ====================

    @Get(':rfqId/quotes')
    @ApiOperation({
        summary: 'Get quotes for RFQ',
        description: 'Retrieve all quotes submitted for a specific RFQ',
    })
    @ApiParam({
        name: 'rfqId',
        description: 'RFQ ID',
        type: String,
    })
    @ApiQuery({
        name: 'status',
        description: 'Filter by quote status',
        required: false,
        enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'ACCEPTED', 'COUNTER_OFFERED', 'WITHDRAWN'],
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quotes retrieved successfully',
        type: QuoteListDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('quote:read')
    async getQuotesForRFQ(
        @Param('rfqId') rfqId: string,
        @Query() filterDto: QuoteFilterDto,
        @Request() req: any,
    ): Promise<QuoteListDto> {
        filterDto.rfqId = rfqId;
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];
        // TODO: Implement quote listing service method
        throw new Error('Method not implemented');
    }

    @Post(':rfqId/quotes')
    @ApiOperation({
        summary: 'Create quote for RFQ',
        description: 'Submit a quote in response to an RFQ',
    })
    @ApiParam({
        name: 'rfqId',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Quote created successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid quote data or RFQ not available for quoting',
    })
    @ApiBody({ type: CreateQuoteDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user')
    @Permissions('quote:create')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createQuote(
        @Param('rfqId') rfqId: string,
        @Body() createQuoteDto: CreateQuoteDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        createQuoteDto.rfqId = rfqId;
        const userId = req.user.userId;
        const merchantId = req.user.merchants?.[0]?.id; // Get first merchant for user

        if (!merchantId) {
            throw new Error('User must be associated with a merchant to create quotes');
        }

        return this.rfqService.createQuote(createQuoteDto, merchantId, userId);
    }

    @Get('quotes/:quoteId')
    @ApiOperation({
        summary: 'Get quote by ID',
        description: 'Retrieve detailed information about a specific quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote details retrieved successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('quote:read')
    async getQuoteById(
        @Param('quoteId') quoteId: string,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        // TODO: Implement get quote by ID service method
        throw new Error('Method not implemented');
    }

    @Put('quotes/:quoteId')
    @ApiOperation({
        summary: 'Update quote',
        description: 'Update an existing quote (only available for draft quotes)',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote updated successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Access denied or quote cannot be updated',
    })
    @ApiBody({ type: UpdateQuoteDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user')
    @Permissions('quote:update')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateQuote(
        @Param('quoteId') quoteId: string,
        @Body() updateQuoteDto: UpdateQuoteDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        // TODO: Implement update quote service method
        throw new Error('Method not implemented');
    }

    @Post('quotes/:quoteId/submit')
    @ApiOperation({
        summary: 'Submit quote',
        description: 'Submit a quote to the RFQ requester',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote submitted successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be submitted',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user')
    @Permissions('quote:submit')
    async submitQuote(
        @Param('quoteId') quoteId: string,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        const userId = req.user.userId;
        const merchantId = req.user.merchants?.[0]?.id;

        if (!merchantId) {
            throw new Error('User must be associated with a merchant to submit quotes');
        }

        return this.rfqService.submitQuote(quoteId, merchantId, userId);
    }

    @Post('quotes/:quoteId/accept')
    @ApiOperation({
        summary: 'Accept quote',
        description: 'Accept a submitted quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote accepted successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be accepted',
    })
    @ApiBody({ type: AcceptQuoteDto })
    @Roles('system_admin', 'buyer')
    @Permissions('quote:accept')
    @UsePipes(new ValidationPipe({ transform: true }))
    async acceptQuote(
        @Param('quoteId') quoteId: string,
        @Body() acceptDto: AcceptQuoteDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.acceptQuote(quoteId, acceptDto, userId);
    }

    @Post('quotes/:quoteId/reject')
    @ApiOperation({
        summary: 'Reject quote',
        description: 'Reject a submitted quote with reason',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote rejected successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be rejected',
    })
    @ApiBody({ type: RejectQuoteDto })
    @Roles('system_admin', 'buyer')
    @Permissions('quote:reject')
    @UsePipes(new ValidationPipe({ transform: true }))
    async rejectQuote(
        @Param('quoteId') quoteId: string,
        @Body() rejectDto: RejectQuoteDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.rejectQuote(quoteId, rejectDto, userId);
    }

    @Post('quotes/:quoteId/counter-offer')
    @ApiOperation({
        summary: 'Submit counter offer',
        description: 'Submit a counter offer for a quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Counter offer submitted successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Counter offer cannot be submitted',
    })
    @ApiBody({ type: CounterOfferDto })
    @Roles('system_admin', 'buyer')
    @Permissions('quote:counter')
    @UsePipes(new ValidationPipe({ transform: true }))
    async submitCounterOffer(
        @Param('quoteId') quoteId: string,
        @Body() counterOfferDto: CounterOfferDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        // TODO: Implement counter offer service method
        throw new Error('Method not implemented');
    }

    @Post('quotes/:quoteId/revise')
    @ApiOperation({
        summary: 'Create quote revision',
        description: 'Create a revised version of an existing quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Quote revision created successfully',
        type: QuoteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiBody({ type: QuoteRevisionDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user')
    @Permissions('quote:revise')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createQuoteRevision(
        @Param('quoteId') quoteId: string,
        @Body() revisionDto: QuoteRevisionDto,
        @Request() req: any,
    ): Promise<QuoteResponseDto> {
        // TODO: Implement quote revision service method
        throw new Error('Method not implemented');
    }

    // ==================== COMMENT MANAGEMENT ====================

    @Get(':id/comments')
    @ApiOperation({
        summary: 'Get RFQ comments',
        description: 'Retrieve all comments for a specific RFQ',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiQuery({
        name: 'includeInternal',
        description: 'Include internal comments (admin/merchant only)',
        required: false,
        type: Boolean,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'RFQ comments retrieved successfully',
        type: RFQCommentListDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('rfq:read')
    async getRFQComments(
        @Param('id') rfqId: string,
        @Query('includeInternal') includeInternal: boolean = false,
        @Request() req: any,
    ): Promise<RFQCommentListDto> {
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];

        // Only admin/merchant can see internal comments
        const canSeeInternal = userRoles.includes('system_admin') ||
            userRoles.includes('merchant_admin') ||
            userRoles.includes('merchant_user');

        return this.rfqService.getRFQComments(rfqId, userId, includeInternal && canSeeInternal);
    }

    @Post(':id/comments')
    @ApiOperation({
        summary: 'Add RFQ comment',
        description: 'Add a comment to an RFQ',
    })
    @ApiParam({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Comment added successfully',
        type: RFQCommentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    })
    @ApiBody({ type: CreateRFQCommentDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('rfq:comment')
    @UsePipes(new ValidationPipe({ transform: true }))
    async addRFQComment(
        @Param('id') rfqId: string,
        @Body() commentDto: CreateRFQCommentDto,
        @Request() req: any,
    ): Promise<RFQCommentResponseDto> {
        const userId = req.user.userId;
        return this.rfqService.addRFQComment(rfqId, commentDto, userId);
    }

    @Get('quotes/:quoteId/comments')
    @ApiOperation({
        summary: 'Get quote comments',
        description: 'Retrieve all comments for a specific quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiQuery({
        name: 'includeInternal',
        description: 'Include internal comments (admin/merchant only)',
        required: false,
        type: Boolean,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quote comments retrieved successfully',
        type: QuoteCommentListDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('quote:read')
    async getQuoteComments(
        @Param('quoteId') quoteId: string,
        @Query('includeInternal') includeInternal: boolean = false,
        @Request() req: any,
    ): Promise<QuoteCommentListDto> {
        // TODO: Implement get quote comments service method
        throw new Error('Method not implemented');
    }

    @Post('quotes/:quoteId/comments')
    @ApiOperation({
        summary: 'Add quote comment',
        description: 'Add a comment to a quote',
    })
    @ApiParam({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Comment added successfully',
        type: QuoteCommentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    })
    @ApiBody({ type: CreateQuoteCommentDto })
    @Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer')
    @Permissions('quote:comment')
    @UsePipes(new ValidationPipe({ transform: true }))
    async addQuoteComment(
        @Param('quoteId') quoteId: string,
        @Body() commentDto: CreateQuoteCommentDto,
        @Request() req: any,
    ): Promise<QuoteCommentResponseDto> {
        // TODO: Implement add quote comment service method
        throw new Error('Method not implemented');
    }

    // ==================== ANALYTICS & REPORTING ====================

    @Get('analytics/overview')
    @ApiOperation({
        summary: 'Get RFQ analytics overview',
        description: 'Get overview analytics for RFQs and quotes',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Analytics overview retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalRFQs: { type: 'number', example: 150 },
                activeRFQs: { type: 'number', example: 25 },
                totalQuotes: { type: 'number', example: 380 },
                averageQuotesPerRFQ: { type: 'number', example: 2.5 },
                acceptanceRate: { type: 'number', example: 0.65 },
                averageResponseTime: { type: 'number', example: 24 },
                topMerchants: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            merchantId: { type: 'string' },
                            merchantName: { type: 'string' },
                            quotesSubmitted: { type: 'number' },
                            acceptanceRate: { type: 'number' },
                        },
                    },
                },
            },
        },
    })
    @Roles('system_admin', 'merchant_admin')
    @Permissions('analytics:read')
    async getAnalyticsOverview(@Request() req: any): Promise<any> {
        // TODO: Implement analytics service methods
        return {
            totalRFQs: 0,
            activeRFQs: 0,
            totalQuotes: 0,
            averageQuotesPerRFQ: 0,
            acceptanceRate: 0,
            averageResponseTime: 0,
            topMerchants: [],
        };
    }

    @Get('health')
    @ApiOperation({
        summary: 'RFQ service health check',
        description: 'Check the health and status of the RFQ management service',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Service health status',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', format: 'date-time' },
                activeRFQs: { type: 'number', example: 25 },
                pendingQuotes: { type: 'number', example: 15 },
                systemLoad: {
                    type: 'object',
                    properties: {
                        rfqProcessing: { type: 'number', example: 0.15 },
                        quoteGeneration: { type: 'number', example: 0.22 },
                    },
                },
            },
        },
    })
    async getRFQServiceHealth(): Promise<any> {
        return {
            status: 'healthy',
            timestamp: new Date(),
            activeRFQs: 0, // TODO: Get from database
            pendingQuotes: 0, // TODO: Get from database
            systemLoad: {
                rfqProcessing: 0.15,
                quoteGeneration: 0.22,
            },
        };
    }
}
