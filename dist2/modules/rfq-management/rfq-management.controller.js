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
exports.RFQManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const rfq_management_service_1 = require("./rfq-management.service");
const dto_1 = require("./dto");
let RFQManagementController = class RFQManagementController {
    constructor(rfqService) {
        this.rfqService = rfqService;
    }
    async createRFQ(createRFQDto, req) {
        const userId = req.user.userId;
        return this.rfqService.createRFQ(createRFQDto, userId);
    }
    async listRFQs(filterDto, req) {
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];
        return this.rfqService.listRFQs(filterDto, userId, userRoles);
    }
    async getRFQById(rfqId, req) {
        const userId = req.user.userId;
        return this.rfqService.getRFQById(rfqId, userId);
    }
    async updateRFQ(rfqId, updateRFQDto, req) {
        const userId = req.user.userId;
        return this.rfqService.updateRFQ(rfqId, updateRFQDto, userId);
    }
    async deleteRFQ(rfqId, req) {
        const userId = req.user.userId;
        return this.rfqService.deleteRFQ(rfqId, userId);
    }
    async submitRFQ(rfqId, submitDto, req) {
        const userId = req.user.userId;
        return this.rfqService.submitRFQ(rfqId, submitDto, userId);
    }
    async getQuotesForRFQ(rfqId, filterDto, req) {
        filterDto.rfqId = rfqId;
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];
        return this.rfqService.listQuotes(filterDto, userId, userRoles);
    }
    async createQuote(rfqId, createQuoteDto, req) {
        createQuoteDto.rfqId = rfqId;
        const userId = req.user.userId;
        const merchantId = req.user.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User must be associated with a merchant to create quotes');
        }
        return this.rfqService.createQuote(createQuoteDto, merchantId, userId);
    }
    async getQuoteById(quoteId, req) {
        throw new Error('Method not implemented');
    }
    async updateQuote(quoteId, updateQuoteDto, req) {
        throw new Error('Method not implemented');
    }
    async submitQuote(quoteId, req) {
        const userId = req.user.userId;
        const merchantId = req.user.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User must be associated with a merchant to submit quotes');
        }
        return this.rfqService.submitQuote(quoteId, merchantId, userId);
    }
    async acceptQuote(quoteId, acceptDto, req) {
        const userId = req.user.userId;
        return this.rfqService.acceptQuote(quoteId, acceptDto, userId);
    }
    async rejectQuote(quoteId, rejectDto, req) {
        const userId = req.user.userId;
        return this.rfqService.rejectQuote(quoteId, rejectDto, userId);
    }
    async submitCounterOffer(quoteId, counterOfferDto, req) {
        throw new Error('Method not implemented');
    }
    async createQuoteRevision(quoteId, revisionDto, req) {
        throw new Error('Method not implemented');
    }
    async getRFQComments(rfqId, includeInternal = false, req) {
        const userId = req.user.userId;
        const userRoles = req.user.roles || [];
        const canSeeInternal = userRoles.includes('system_admin') ||
            userRoles.includes('merchant_admin') ||
            userRoles.includes('merchant_user');
        return this.rfqService.getRFQComments(rfqId, userId, includeInternal && canSeeInternal);
    }
    async addRFQComment(rfqId, commentDto, req) {
        const userId = req.user.userId;
        return this.rfqService.addRFQComment(rfqId, commentDto, userId);
    }
    async getQuoteComments(quoteId, includeInternal = false, req) {
        throw new Error('Method not implemented');
    }
    async addQuoteComment(quoteId, commentDto, req) {
        throw new Error('Method not implemented');
    }
    async getAnalyticsOverview(req) {
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
    async getRFQServiceHealth() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            activeRFQs: 0,
            pendingQuotes: 0,
            systemLoad: {
                rfqProcessing: 0.15,
                quoteGeneration: 0.22,
            },
        };
    }
};
exports.RFQManagementController = RFQManagementController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new RFQ',
        description: 'Create a new Request for Quote with multiple items and specifications',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'RFQ created successfully',
        type: dto_1.RFQResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid RFQ data',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateRFQDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRFQDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "createRFQ", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List RFQs',
        description: 'Get a list of RFQs with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RFQ list retrieved successfully',
        type: dto_1.RFQListDto,
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RFQFilterDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "listRFQs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get RFQ by ID',
        description: 'Retrieve detailed information about a specific RFQ',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RFQ details retrieved successfully',
        type: dto_1.RFQResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getRFQById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update RFQ',
        description: 'Update an existing RFQ (only available for draft RFQs)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RFQ updated successfully',
        type: dto_1.RFQResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied or RFQ cannot be updated',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateRFQDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRFQDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "updateRFQ", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete RFQ',
        description: 'Delete an RFQ (only available for draft RFQs)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'RFQ deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied or RFQ cannot be deleted',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "deleteRFQ", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit RFQ',
        description: 'Submit an RFQ for merchant quotes',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RFQ submitted successfully',
        type: dto_1.RFQResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'RFQ cannot be submitted',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.SubmitRFQDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SubmitRFQDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "submitRFQ", null);
__decorate([
    (0, common_1.Get)(':rfqId/quotes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quotes for RFQ',
        description: 'Retrieve all quotes submitted for a specific RFQ',
    }),
    (0, swagger_1.ApiParam)({
        name: 'rfqId',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        description: 'Filter by quote status',
        required: false,
        enum: [
            'DRAFT',
            'SUBMITTED',
            'UNDER_REVIEW',
            'APPROVED',
            'REJECTED',
            'EXPIRED',
            'ACCEPTED',
            'COUNTER_OFFERED',
            'WITHDRAWN',
        ],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quotes retrieved successfully',
        type: dto_1.QuoteListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('rfqId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.QuoteFilterDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getQuotesForRFQ", null);
__decorate([
    (0, common_1.Post)(':rfqId/quotes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create quote for RFQ',
        description: 'Submit a quote in response to an RFQ',
    }),
    (0, swagger_1.ApiParam)({
        name: 'rfqId',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Quote created successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid quote data or RFQ not available for quoting',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateQuoteDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('rfqId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Get)('quotes/:quoteId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quote by ID',
        description: 'Retrieve detailed information about a specific quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote details retrieved successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getQuoteById", null);
__decorate([
    (0, common_1.Put)('quotes/:quoteId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update quote',
        description: 'Update an existing quote (only available for draft quotes)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote updated successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied or quote cannot be updated',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateQuoteDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "updateQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/submit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit quote',
        description: 'Submit a quote to the RFQ requester',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote submitted successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be submitted',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "submitQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/accept'),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept quote',
        description: 'Accept a submitted quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote accepted successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be accepted',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.AcceptQuoteDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AcceptQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "acceptQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/reject'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject quote',
        description: 'Reject a submitted quote with reason',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote rejected successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Quote cannot be rejected',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.RejectQuoteDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RejectQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "rejectQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/counter-offer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit counter offer',
        description: 'Submit a counter offer for a quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Counter offer submitted successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Counter offer cannot be submitted',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CounterOfferDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CounterOfferDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "submitCounterOffer", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/revise'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create quote revision',
        description: 'Create a revised version of an existing quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Quote revision created successfully',
        type: dto_1.QuoteResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.QuoteRevisionDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.QuoteRevisionDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "createQuoteRevision", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get RFQ comments',
        description: 'Retrieve all comments for a specific RFQ',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInternal',
        description: 'Include internal comments (admin/merchant only)',
        required: false,
        type: Boolean,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RFQ comments retrieved successfully',
        type: dto_1.RFQCommentListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeInternal')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getRFQComments", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add RFQ comment',
        description: 'Add a comment to an RFQ',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'RFQ ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Comment added successfully',
        type: dto_1.RFQCommentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'RFQ not found',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateRFQCommentDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateRFQCommentDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "addRFQComment", null);
__decorate([
    (0, common_1.Get)('quotes/:quoteId/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quote comments',
        description: 'Retrieve all comments for a specific quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInternal',
        description: 'Include internal comments (admin/merchant only)',
        required: false,
        type: Boolean,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quote comments retrieved successfully',
        type: dto_1.QuoteCommentListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Query)('includeInternal')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getQuoteComments", null);
__decorate([
    (0, common_1.Post)('quotes/:quoteId/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add quote comment',
        description: 'Add a comment to a quote',
    }),
    (0, swagger_1.ApiParam)({
        name: 'quoteId',
        description: 'Quote ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Comment added successfully',
        type: dto_1.QuoteCommentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateQuoteCommentDto }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin', 'merchant_user', 'buyer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateQuoteCommentDto, Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "addQuoteComment", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get RFQ analytics overview',
        description: 'Get overview analytics for RFQs and quotes',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    (0, roles_decorator_1.Roles)('system_admin', 'merchant_admin'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getAnalyticsOverview", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'RFQ service health check',
        description: 'Check the health and status of the RFQ management service',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RFQManagementController.prototype, "getRFQServiceHealth", null);
exports.RFQManagementController = RFQManagementController = __decorate([
    (0, swagger_1.ApiTags)('RFQ & Quote Management'),
    (0, common_1.Controller)('rfq'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [rfq_management_service_1.RFQManagementService])
], RFQManagementController);
//# sourceMappingURL=rfq-management.controller.js.map