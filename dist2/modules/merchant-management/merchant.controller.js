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
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const merchant_service_1 = require("./merchant.service");
const merchant_document_service_1 = require("./merchant-document.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const merchant_application_dto_1 = require("./dto/merchant-application.dto");
const merchant_profile_dto_1 = require("./dto/merchant-profile.dto");
const merchant_approval_dto_1 = require("./dto/merchant-approval.dto");
const merchant_document_dto_1 = require("./dto/merchant-document.dto");
const team_management_dto_1 = require("./dto/team-management.dto");
let MerchantController = class MerchantController {
    constructor(merchantService, merchantDocumentService) {
        this.merchantService = merchantService;
        this.merchantDocumentService = merchantDocumentService;
    }
    async submitApplication(applicationDto, req) {
        return this.merchantService.submitApplication(applicationDto);
    }
    async checkApplicationStatus(id) {
        return this.merchantService.checkApplicationStatus(id);
    }
    async getMyApplicationStatus(req) {
        return this.merchantService.getMyApplicationStatus(req.user.userId);
    }
    async updateApplication(id, updateData) {
        return this.merchantService.updateApplication(id, updateData);
    }
    async getApplicationDocuments(merchantId) {
        return this.merchantDocumentService.getMerchantDocuments(merchantId);
    }
    async uploadApplicationDocument(merchantId, createDocumentDto, req) {
        return this.merchantDocumentService.uploadDocument(merchantId, createDocumentDto, 'system');
    }
    async deleteApplicationDocument(merchantId, documentId) {
        await this.merchantDocumentService.deleteDocument(documentId, merchantId);
        return { message: 'Document deleted successfully' };
    }
    async getPendingApplications(page, limit, search, req) {
        return this.merchantService.getMerchants({
            page: page || 1,
            limit: limit || 20,
            status: 'PENDING',
            search,
        });
    }
    async getAllMerchants(page, limit, status, businessType, search, req) {
        return this.merchantService.getMerchants({
            page: page || 1,
            limit: limit || 20,
            status,
            businessType,
            search,
        });
    }
    async approveMerchant(id, approvalDto, req) {
        return this.merchantService.approveMerchant(id, approvalDto, req.user.userId);
    }
    async rejectMerchant(id, rejectionDto, req) {
        return this.merchantService.rejectMerchant(id, rejectionDto, req.user.userId);
    }
    async getMerchantProfile(req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.getMerchantProfile(merchantId);
    }
    async updateMerchantProfile(updateDto, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.updateMerchantProfile(merchantId, updateDto, req.user.userId);
    }
    async updateMerchantById(id, updateDto, req) {
        return this.merchantService.updateMerchantProfile(id, updateDto, req.user.userId);
    }
    async getTeamMembers(filters, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.getTeamMembers(merchantId, filters);
    }
    async getTeamStats(req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.getTeamStats(merchantId);
    }
    async inviteTeamMember(inviteDto, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.inviteTeamMember(merchantId, inviteDto, req.user.userId);
    }
    async updateTeamMember(userId, updateDto, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.updateTeamMember(merchantId, userId, updateDto, req.user.userId);
    }
    async removeTeamMember(userId, removeDto, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.removeTeamMember(merchantId, userId, removeDto, req.user.userId);
    }
    async resendInvitation(userId, req) {
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new common_1.HttpException('User not associated with any merchant', common_1.HttpStatus.FORBIDDEN);
        }
        const merchantId = userMerchants[0].id;
        return this.merchantService.resendInvitation(merchantId, userId, req.user.userId);
    }
    async getMerchantById(id) {
        return this.merchantService.getMerchantProfile(id);
    }
    async uploadMerchantDocument(merchantId, createDocumentDto, req) {
        return this.merchantDocumentService.uploadDocument(merchantId, createDocumentDto, req.user.userId);
    }
    async getMerchantDocuments(merchantId) {
        return this.merchantDocumentService.getMerchantDocuments(merchantId);
    }
    async updateDocumentStatus(documentId, updateStatusDto, req) {
        return this.merchantDocumentService.updateDocumentStatus(documentId, updateStatusDto, req.user.userId);
    }
    async deleteMerchantDocument(documentId, req) {
        return this.merchantDocumentService.deleteDocument(documentId, req.user.userId);
    }
    async getDocumentDownloadUrl(documentId) {
        return this.merchantDocumentService.getDocumentDownloadUrl(documentId);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit merchant application',
        description: 'Submit a new merchant application for review. No authentication required.',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_application_dto_1.MerchantApplicationDto,
        description: 'Merchant application details',
        examples: {
            'tech-supplier': {
                summary: 'Technology Supplier Application',
                value: {
                    name: 'TechParts Supplier Inc.',
                    displayName: 'TechParts Supplier',
                    description: 'Premium electronic components supplier',
                    businessType: 'distributor',
                    contactEmail: 'admin@techparts.com',
                    contactPhone: '+1-555-0200',
                    website: 'https://techparts.com',
                    addressLine1: '456 Supplier Blvd',
                    city: 'San Francisco',
                    state: 'CA',
                    postalCode: '94105',
                    country: 'USA',
                    minimumOrderValue: 100.0,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Application submitted successfully',
        type: merchant_application_dto_1.MerchantApplicationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation errors or duplicate merchant',
        schema: {
            example: {
                statusCode: 400,
                message: 'Merchant with this name or tax ID already exists',
                error: 'Bad Request',
            },
        },
    }),
    (0, swagger_1.ApiConsumes)('application/json'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_application_dto_1.MerchantApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "submitApplication", null);
__decorate([
    (0, common_1.Get)('application/:id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check application status',
        description: 'Check the status of a merchant application using the application ID.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application status retrieved successfully',
        type: merchant_application_dto_1.CheckApplicationStatusDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Application not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Application not found',
                error: 'Not Found',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "checkApplicationStatus", null);
__decorate([
    (0, common_1.Get)('my-application/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my application status',
        description: "Get the status of the authenticated user's merchant application.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application status retrieved successfully',
        type: merchant_application_dto_1.CheckApplicationStatusDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No application found for this user',
        schema: {
            example: {
                statusCode: 404,
                message: 'No application found for this user',
                error: 'Not Found',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMyApplicationStatus", null);
__decorate([
    (0, common_1.Put)('application/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update merchant application',
        description: 'Update a pending or rejected merchant application. Only allowed for PENDING or REJECTED applications.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_application_dto_1.MerchantApplicationDto,
        description: 'Updated merchant application data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application updated successfully',
        type: merchant_application_dto_1.MerchantApplicationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Application not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Application not found',
                error: 'Not Found',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Application cannot be edited',
        schema: {
            example: {
                statusCode: 400,
                message: 'Application cannot be edited in current status',
                error: 'Bad Request',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_application_dto_1.MerchantApplicationDto]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateApplication", null);
__decorate([
    (0, common_1.Get)('application/:id/documents'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant application documents',
        description: 'Retrieve all documents for a merchant application (public endpoint)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Documents retrieved successfully',
        type: merchant_document_dto_1.MerchantDocumentsListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Application not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getApplicationDocuments", null);
__decorate([
    (0, common_1.Post)('application/:id/documents'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload document to merchant application',
        description: 'Upload a supporting document for merchant application (public endpoint)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_document_dto_1.CreateMerchantDocumentDto,
        description: 'Document upload information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Document uploaded successfully',
        type: merchant_document_dto_1.MerchantDocumentDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid file or document type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Application not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_document_dto_1.CreateMerchantDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "uploadApplicationDocument", null);
__decorate([
    (0, common_1.Delete)('application/:id/documents/:documentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete merchant application document',
        description: 'Delete a document from merchant application (public endpoint)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Document ID to delete',
        example: '550e8400-e29b-41d4-a716-446655440001',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document or application not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "deleteApplicationDocument", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending merchant applications',
        description: 'Retrieve all merchant applications with PENDING status. Requires System Admin role.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 20,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for merchant name, email, or tax ID',
        example: 'TechParts',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pending applications retrieved successfully',
        type: merchant_profile_dto_1.MerchantListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getPendingApplications", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all merchants',
        description: 'Retrieve all merchants with filtering options. Requires System Admin role.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 20,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by merchant status',
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE'],
        example: 'APPROVED',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'businessType',
        required: false,
        description: 'Filter by business type',
        enum: ['manufacturer', 'distributor', 'retailer', 'wholesaler'],
        example: 'distributor',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for merchant name, email, or tax ID',
        example: 'TechParts',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchants retrieved successfully',
        type: merchant_profile_dto_1.MerchantListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('businessType')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getAllMerchants", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve merchant application',
        description: 'Approve a pending merchant application. Requires system:manage permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID to approve',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_approval_dto_1.MerchantApprovalDto,
        description: 'Approval details and notes',
        examples: {
            'standard-approval': {
                summary: 'Standard Approval',
                value: {
                    approvalNotes: 'All documents verified and business credentials confirmed.',
                    conditionalApproval: false,
                    restrictions: [],
                },
            },
            'conditional-approval': {
                summary: 'Conditional Approval',
                value: {
                    approvalNotes: 'Approved with initial restrictions.',
                    conditionalApproval: true,
                    restrictions: [
                        'Limited to electronics category',
                        'Maximum 100 products initially',
                    ],
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant approved successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - merchant not in pending status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_approval_dto_1.MerchantApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "approveMerchant", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject merchant application',
        description: 'Reject a pending merchant application. Requires system:manage permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID to reject',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_approval_dto_1.MerchantRejectionDto,
        description: 'Rejection reason and details',
        examples: {
            'incomplete-docs': {
                summary: 'Incomplete Documentation',
                value: {
                    reason: 'incomplete_documentation',
                    rejectionNotes: 'Business license document is missing or expired. Please submit a current license.',
                    canReapply: true,
                    requiredForReapplication: [
                        'Current business license',
                        'Updated tax registration',
                    ],
                },
            },
            'failed-verification': {
                summary: 'Failed Verification',
                value: {
                    reason: 'failed_verification',
                    rejectionNotes: 'Unable to verify business credentials with provided information.',
                    canReapply: false,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant rejected successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - merchant not in pending status',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_approval_dto_1.MerchantRejectionDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "rejectMerchant", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant profile',
        description: 'Get the profile of the merchant associated with the authenticated user. Requires Merchant Admin role.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant profile retrieved successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - user not associated with any merchant',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMerchantProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update merchant profile',
        description: 'Update the merchant profile. Requires merchant:manage permission.',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_profile_dto_1.UpdateMerchantProfileDto,
        description: 'Updated merchant profile data',
        examples: {
            'profile-update': {
                summary: 'Profile Update',
                value: {
                    displayName: 'TechParts Supplier Pro',
                    description: 'Premium electronic components supplier with 24/7 support',
                    contactPhone: '+1-555-0201',
                    website: 'https://techparts-pro.com',
                    minimumOrderValue: 150.0,
                    shippingPolicy: 'Free shipping on orders over $500',
                    returnPolicy: '30-day return policy with original packaging',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant profile updated successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_profile_dto_1.UpdateMerchantProfileDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateMerchantProfile", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update merchant by ID (Admin)',
        description: 'Update any merchant information by ID. Requires system:manage permission.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID to update',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_profile_dto_1.UpdateMerchantProfileDto,
        description: 'Updated merchant profile data',
        examples: {
            'admin-update': {
                summary: 'Admin Update',
                value: {
                    displayName: 'TechParts Supplier Pro',
                    description: 'Premium electronic components supplier with 24/7 support',
                    contactPhone: '+1-555-0201',
                    website: 'https://techparts-pro.com',
                    minimumOrderValue: 150.0,
                    shippingPolicy: 'Free shipping on orders over $500',
                    returnPolicy: '30-day return policy with original packaging',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant updated successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_profile_dto_1.UpdateMerchantProfileDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateMerchantById", null);
__decorate([
    (0, common_1.Get)('team'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant team members',
        description: 'Retrieve all team members for the authenticated merchant',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team members retrieved successfully',
        type: team_management_dto_1.TeamListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_management_dto_1.TeamMemberFilterDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getTeamMembers", null);
__decorate([
    (0, common_1.Get)('team/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get team statistics',
        description: 'Get statistics about the merchant team',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team statistics retrieved successfully',
        type: team_management_dto_1.TeamStatsDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getTeamStats", null);
__decorate([
    (0, common_1.Post)('team/invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Invite team member',
        description: 'Send invitation to join the merchant team',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Invitation sent successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid invitation data',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_management_dto_1.InviteTeamMemberDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "inviteTeamMember", null);
__decorate([
    (0, common_1.Put)('team/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update team member',
        description: 'Update team member details and permissions',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'User ID to update',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team member updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Team member not found',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, team_management_dto_1.UpdateTeamMemberDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateTeamMember", null);
__decorate([
    (0, common_1.Delete)('team/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove team member',
        description: 'Remove user from merchant team',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'User ID to remove',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Team member removed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Team member not found',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, team_management_dto_1.RemoveTeamMemberDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "removeTeamMember", null);
__decorate([
    (0, common_1.Post)('team/:userId/resend-invitation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Resend invitation',
        description: 'Resend invitation to pending team member',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'User ID to resend invitation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation resent successfully',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "resendInvitation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant by ID',
        description: 'Get detailed merchant information by ID. Requires System Admin role.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant details retrieved successfully',
        type: merchant_profile_dto_1.MerchantProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMerchantById", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('system:manage', 'merchant:manage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload merchant document',
        description: 'Upload a supporting document for merchant verification (SSM, business license, etc.)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_document_dto_1.CreateMerchantDocumentDto,
        description: 'Document upload information',
        examples: {
            'ssm-document': {
                summary: 'SSM Certificate',
                value: {
                    fileId: '550e8400-e29b-41d4-a716-446655440000',
                    documentType: 'SSM',
                    description: 'Company registration certificate from SSM',
                },
            },
            'business-license': {
                summary: 'Business License',
                value: {
                    fileId: '550e8400-e29b-41d4-a716-446655440001',
                    documentType: 'BUSINESS_LICENSE',
                    description: 'Valid business operating license',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Document uploaded successfully',
        type: merchant_document_dto_1.MerchantDocumentDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid file type or document already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant or file not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_document_dto_1.CreateMerchantDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "uploadMerchantDocument", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('system:manage', 'merchant:manage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant documents',
        description: 'Retrieve all documents for a specific merchant',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Documents retrieved successfully',
        type: merchant_document_dto_1.MerchantDocumentsListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Merchant not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMerchantDocuments", null);
__decorate([
    (0, common_1.Patch)('documents/:documentId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireSystemManage)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update document verification status',
        description: 'Update the verification status of a merchant document (Admin only)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        type: merchant_document_dto_1.UpdateDocumentStatusDto,
        description: 'Status update information',
        examples: {
            'verify-document': {
                summary: 'Verify Document',
                value: {
                    status: 'VERIFIED',
                    notes: 'Document verified and approved',
                },
            },
            'reject-document': {
                summary: 'Reject Document',
                value: {
                    status: 'REJECTED',
                    notes: 'Document quality is poor, please resubmit',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document status updated successfully',
        type: merchant_document_dto_1.MerchantDocumentDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document not found',
    }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_document_dto_1.UpdateDocumentStatusDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateDocumentStatus", null);
__decorate([
    (0, common_1.Delete)('documents/:documentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('system:manage', 'merchant:manage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete merchant document',
        description: 'Delete a merchant document',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Document deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document not found',
    }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "deleteMerchantDocument", null);
__decorate([
    (0, common_1.Get)('documents/:documentId/download'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('system:manage', 'merchant:manage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get document download URL',
        description: 'Get a presigned URL to download/preview a merchant document',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Download URL retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'Presigned download URL',
                    example: 'https://storage.example.com/files/document.pdf?signature=...',
                },
                filename: {
                    type: 'string',
                    description: 'Original filename',
                    example: 'ssm-certificate.pdf',
                },
                expiresIn: {
                    type: 'number',
                    description: 'URL expiration time in seconds',
                    example: 3600,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document not found',
    }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDocumentDownloadUrl", null);
exports.MerchantController = MerchantController = __decorate([
    (0, swagger_1.ApiTags)('Merchant Management'),
    (0, common_1.Controller)('merchants'),
    (0, swagger_1.ApiProduces)('application/json'),
    __metadata("design:paramtypes", [merchant_service_1.MerchantService,
        merchant_document_service_1.MerchantDocumentService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map