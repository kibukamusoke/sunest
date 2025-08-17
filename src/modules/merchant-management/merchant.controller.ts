import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
    ApiHeader,
    ApiConsumes,
    ApiProduces,
} from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { MerchantDocumentService } from './merchant-document.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SystemAdmin, MerchantAdmin } from '../../common/decorators/roles.decorator';
import { RequireSystemManage, RequireMerchantManage, Permissions } from '../../common/decorators/permissions.decorator';
import {
    MerchantApplicationDto,
    MerchantApplicationResponseDto,
    CheckApplicationStatusDto,
} from './dto/merchant-application.dto';
import {
    MerchantProfileDto,
    UpdateMerchantProfileDto,
    MerchantListDto,
    AddMerchantUserDto,
    UpdateMerchantUserDto,
    MerchantUserDto,
} from './dto/merchant-profile.dto';
import {
    MerchantApprovalDto,
    MerchantRejectionDto,
    MerchantStatusUpdateDto,
    MerchantDocumentDto,
    MerchantAuditLogResponseDto,
} from './dto/merchant-approval.dto';
import {
    CreateMerchantDocumentDto,
    MerchantDocumentDto as MerchantDocumentUploadDto,
    UpdateDocumentStatusDto,
    MerchantDocumentsListDto,
} from './dto/merchant-document.dto';

@ApiTags('Merchant Management')
@Controller('merchants')
@ApiProduces('application/json')
export class MerchantController {
    constructor(
        private readonly merchantService: MerchantService,
        private readonly merchantDocumentService: MerchantDocumentService
    ) { }

    // ================== PUBLIC ENDPOINTS ==================

    @Post('apply')
    @ApiOperation({
        summary: 'Submit merchant application',
        description: 'Submit a new merchant application for review. No authentication required.',
    })
    @ApiBody({
        type: MerchantApplicationDto,
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
                    taxId: 'TECH789123456',
                    registrationNumber: 'REG123456789',
                    minimumOrderValue: 100.00,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Application submitted successfully',
        type: MerchantApplicationResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - validation errors or duplicate merchant',
        schema: {
            example: {
                statusCode: 400,
                message: 'Merchant with this name or tax ID already exists',
                error: 'Bad Request',
            },
        },
    })
    @ApiConsumes('application/json')
    async submitApplication(
        @Body() applicationDto: MerchantApplicationDto,
        @Request() req,
    ): Promise<MerchantApplicationResponseDto> {
        // Let the service determine the appId from the database
        return this.merchantService.submitApplication(applicationDto);
    }

    @Get('application/:id/status')
    @ApiOperation({
        summary: 'Check application status',
        description: 'Check the status of a merchant application using the application ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Application status retrieved successfully',
        type: CheckApplicationStatusDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Application not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Application not found',
                error: 'Not Found',
            },
        },
    })
    async checkApplicationStatus(@Param('id') id: string): Promise<CheckApplicationStatusDto> {
        return this.merchantService.checkApplicationStatus(id);
    }

    @Put('application/:id')
    @ApiOperation({
        summary: 'Update merchant application',
        description: 'Update a pending or rejected merchant application. Only allowed for PENDING or REJECTED applications.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: MerchantApplicationDto,
        description: 'Updated merchant application data',
    })
    @ApiResponse({
        status: 200,
        description: 'Application updated successfully',
        type: MerchantApplicationResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Application not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Application not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Application cannot be edited',
        schema: {
            example: {
                statusCode: 400,
                message: 'Application cannot be edited in current status',
                error: 'Bad Request',
            },
        },
    })
    async updateApplication(
        @Param('id') id: string,
        @Body() updateData: MerchantApplicationDto,
    ): Promise<MerchantApplicationResponseDto> {
        return this.merchantService.updateApplication(id, updateData);
    }

    @Get('application/:id/documents')
    @ApiOperation({
        summary: 'Get merchant application documents',
        description: 'Retrieve all documents for a merchant application (public endpoint)',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Documents retrieved successfully',
        type: MerchantDocumentsListDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Application not found',
    })
    async getApplicationDocuments(
        @Param('id') merchantId: string,
    ): Promise<MerchantDocumentsListDto> {
        return this.merchantDocumentService.getMerchantDocuments(merchantId);
    }

    @Post('application/:id/documents')
    @ApiOperation({
        summary: 'Upload document to merchant application',
        description: 'Upload a supporting document for merchant application (public endpoint)',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: CreateMerchantDocumentDto,
        description: 'Document upload information',
    })
    @ApiResponse({
        status: 201,
        description: 'Document uploaded successfully',
        type: MerchantDocumentUploadDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid file or document type',
    })
    @ApiResponse({
        status: 404,
        description: 'Application not found',
    })
    async uploadApplicationDocument(
        @Param('id') merchantId: string,
        @Body() createDocumentDto: CreateMerchantDocumentDto,
    ): Promise<MerchantDocumentUploadDto> {
        // For public endpoint, we'll use a system user ID
        return this.merchantDocumentService.uploadDocument(
            merchantId,
            createDocumentDto,
            'system' // System user for public uploads
        );
    }

    @Delete('application/:id/documents/:documentId')
    @ApiOperation({
        summary: 'Delete merchant application document',
        description: 'Delete a document from merchant application (public endpoint)',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant application ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiParam({
        name: 'documentId',
        description: 'Document ID to delete',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @ApiResponse({
        status: 200,
        description: 'Document deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Document or application not found',
    })
    async deleteApplicationDocument(
        @Param('id') merchantId: string,
        @Param('documentId') documentId: string,
    ): Promise<{ message: string }> {
        await this.merchantDocumentService.deleteDocument(documentId, merchantId);
        return { message: 'Document deleted successfully' };
    }

    // ================== SYSTEM ADMIN ENDPOINTS ==================

    @Get('pending')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SystemAdmin()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get pending merchant applications',
        description: 'Retrieve all merchant applications with PENDING status. Requires System Admin role.',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 20,
        type: Number,
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term for merchant name, email, or tax ID',
        example: 'TechParts',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Pending applications retrieved successfully',
        type: MerchantListDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    async getPendingApplications(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('search') search?: string,
        @Request() req?,
    ): Promise<MerchantListDto> {
        return this.merchantService.getMerchants({
            page: page || 1,
            limit: limit || 20,
            status: 'PENDING',
            search,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SystemAdmin()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all merchants',
        description: 'Retrieve all merchants with filtering options. Requires System Admin role.',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 20,
        type: Number,
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by merchant status',
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE'],
        example: 'APPROVED',
    })
    @ApiQuery({
        name: 'businessType',
        required: false,
        description: 'Filter by business type',
        enum: ['manufacturer', 'distributor', 'retailer', 'wholesaler'],
        example: 'distributor',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term for merchant name, email, or tax ID',
        example: 'TechParts',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Merchants retrieved successfully',
        type: MerchantListDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    async getAllMerchants(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('status') status?: string,
        @Query('businessType') businessType?: string,
        @Query('search') search?: string,
        @Request() req?,
    ): Promise<MerchantListDto> {
        return this.merchantService.getMerchants({
            page: page || 1,
            limit: limit || 20,
            status,
            businessType,
            search,
        });
    }

    @Post(':id/approve')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireSystemManage()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Approve merchant application',
        description: 'Approve a pending merchant application. Requires system:manage permission.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID to approve',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: MerchantApprovalDto,
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
                    restrictions: ['Limited to electronics category', 'Maximum 100 products initially'],
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant approved successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - merchant not in pending status',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    async approveMerchant(
        @Param('id') id: string,
        @Body() approvalDto: MerchantApprovalDto,
        @Request() req,
    ): Promise<MerchantProfileDto> {
        return this.merchantService.approveMerchant(id, approvalDto, req.user.userId);
    }

    @Post(':id/reject')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireSystemManage()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Reject merchant application',
        description: 'Reject a pending merchant application. Requires system:manage permission.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID to reject',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: MerchantRejectionDto,
        description: 'Rejection reason and details',
        examples: {
            'incomplete-docs': {
                summary: 'Incomplete Documentation',
                value: {
                    reason: 'incomplete_documentation',
                    rejectionNotes: 'Business license document is missing or expired. Please submit a current license.',
                    canReapply: true,
                    requiredForReapplication: ['Current business license', 'Updated tax registration'],
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
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant rejected successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - merchant not in pending status',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    async rejectMerchant(
        @Param('id') id: string,
        @Body() rejectionDto: MerchantRejectionDto,
        @Request() req,
    ): Promise<MerchantProfileDto> {
        return this.merchantService.rejectMerchant(id, rejectionDto, req.user.userId);
    }

    // ================== MERCHANT ADMIN ENDPOINTS ==================

    @Get('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @MerchantAdmin()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get merchant profile',
        description: 'Get the profile of the merchant associated with the authenticated user. Requires Merchant Admin role.',
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant profile retrieved successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - user not associated with any merchant',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    async getMerchantProfile(@Request() req): Promise<MerchantProfileDto> {
        // Get merchant ID from user's merchant associations
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new HttpException('User not associated with any merchant', HttpStatus.FORBIDDEN);
        }

        // For now, get the first merchant - in a real app, there might be logic to select the primary merchant
        const merchantId = userMerchants[0].id;
        return this.merchantService.getMerchantProfile(merchantId);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireMerchantManage()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update merchant profile',
        description: 'Update the merchant profile. Requires merchant:manage permission.',
    })
    @ApiBody({
        type: UpdateMerchantProfileDto,
        description: 'Updated merchant profile data',
        examples: {
            'profile-update': {
                summary: 'Profile Update',
                value: {
                    displayName: 'TechParts Supplier Pro',
                    description: 'Premium electronic components supplier with 24/7 support',
                    contactPhone: '+1-555-0201',
                    website: 'https://techparts-pro.com',
                    minimumOrderValue: 150.00,
                    shippingPolicy: 'Free shipping on orders over $500',
                    returnPolicy: '30-day return policy with original packaging',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant profile updated successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    async updateMerchantProfile(
        @Body() updateDto: UpdateMerchantProfileDto,
        @Request() req,
    ): Promise<MerchantProfileDto> {
        // Get merchant ID from user's merchant associations
        const userMerchants = req.user.merchants;
        if (!userMerchants || userMerchants.length === 0) {
            throw new HttpException('User not associated with any merchant', HttpStatus.FORBIDDEN);
        }

        const merchantId = userMerchants[0].id;
        return this.merchantService.updateMerchantProfile(merchantId, updateDto, req.user.userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireSystemManage()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update merchant by ID (Admin)',
        description: 'Update any merchant information by ID. Requires system:manage permission.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID to update',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: UpdateMerchantProfileDto,
        description: 'Updated merchant profile data',
        examples: {
            'admin-update': {
                summary: 'Admin Update',
                value: {
                    displayName: 'TechParts Supplier Pro',
                    description: 'Premium electronic components supplier with 24/7 support',
                    contactPhone: '+1-555-0201',
                    website: 'https://techparts-pro.com',
                    minimumOrderValue: 150.00,
                    shippingPolicy: 'Free shipping on orders over $500',
                    returnPolicy: '30-day return policy with original packaging',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant updated successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    async updateMerchantById(
        @Param('id') id: string,
        @Body() updateDto: UpdateMerchantProfileDto,
        @Request() req,
    ): Promise<MerchantProfileDto> {
        return this.merchantService.updateMerchantProfile(id, updateDto, req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SystemAdmin()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get merchant by ID',
        description: 'Get detailed merchant information by ID. Requires System Admin role.',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Merchant details retrieved successfully',
        type: MerchantProfileDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    async getMerchantById(@Param('id') id: string): Promise<MerchantProfileDto> {
        return this.merchantService.getMerchantProfile(id);
    }

    // ================== DOCUMENT MANAGEMENT ENDPOINTS ==================

    @Post(':id/documents')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('system:manage', 'merchant:manage')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Upload merchant document',
        description: 'Upload a supporting document for merchant verification (SSM, business license, etc.)',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: CreateMerchantDocumentDto,
        description: 'Document upload information',
        examples: {
            'ssm-document': {
                summary: 'SSM Certificate',
                value: {
                    fileId: '550e8400-e29b-41d4-a716-446655440000',
                    documentType: 'SSM',
                    description: 'Company registration certificate from SSM'
                },
            },
            'business-license': {
                summary: 'Business License',
                value: {
                    fileId: '550e8400-e29b-41d4-a716-446655440001',
                    documentType: 'BUSINESS_LICENSE',
                    description: 'Valid business operating license'
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Document uploaded successfully',
        type: MerchantDocumentUploadDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid file type or document already exists',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant or file not found',
    })
    async uploadMerchantDocument(
        @Param('id') merchantId: string,
        @Body() createDocumentDto: CreateMerchantDocumentDto,
        @Request() req,
    ): Promise<MerchantDocumentUploadDto> {
        return this.merchantDocumentService.uploadDocument(
            merchantId,
            createDocumentDto,
            req.user.userId
        );
    }

    @Get(':id/documents')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('system:manage', 'merchant:manage')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get merchant documents',
        description: 'Retrieve all documents for a specific merchant',
    })
    @ApiParam({
        name: 'id',
        description: 'Merchant ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Documents retrieved successfully',
        type: MerchantDocumentsListDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Merchant not found',
    })
    async getMerchantDocuments(
        @Param('id') merchantId: string,
    ): Promise<MerchantDocumentsListDto> {
        return this.merchantDocumentService.getMerchantDocuments(merchantId);
    }

    @Patch('documents/:documentId/status')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireSystemManage()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update document verification status',
        description: 'Update the verification status of a merchant document (Admin only)',
    })
    @ApiParam({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({
        type: UpdateDocumentStatusDto,
        description: 'Status update information',
        examples: {
            'verify-document': {
                summary: 'Verify Document',
                value: {
                    status: 'VERIFIED',
                    notes: 'Document verified and approved'
                },
            },
            'reject-document': {
                summary: 'Reject Document',
                value: {
                    status: 'REJECTED',
                    notes: 'Document quality is poor, please resubmit'
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Document status updated successfully',
        type: MerchantDocumentUploadDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Document not found',
    })
    async updateDocumentStatus(
        @Param('documentId') documentId: string,
        @Body() updateStatusDto: UpdateDocumentStatusDto,
        @Request() req,
    ): Promise<MerchantDocumentUploadDto> {
        return this.merchantDocumentService.updateDocumentStatus(
            documentId,
            updateStatusDto,
            req.user.userId
        );
    }

    @Delete('documents/:documentId')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('system:manage', 'merchant:manage')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete merchant document',
        description: 'Delete a merchant document',
    })
    @ApiParam({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 204,
        description: 'Document deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Document not found',
    })
    async deleteMerchantDocument(
        @Param('documentId') documentId: string,
        @Request() req,
    ): Promise<void> {
        return this.merchantDocumentService.deleteDocument(documentId, req.user.userId);
    }

    @Get('documents/:documentId/download')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('system:manage', 'merchant:manage')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get document download URL',
        description: 'Get a presigned URL to download/preview a merchant document',
    })
    @ApiParam({
        name: 'documentId',
        description: 'Document ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Download URL retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'Presigned download URL',
                    example: 'https://storage.example.com/files/document.pdf?signature=...'
                },
                filename: {
                    type: 'string',
                    description: 'Original filename',
                    example: 'ssm-certificate.pdf'
                },
                expiresIn: {
                    type: 'number',
                    description: 'URL expiration time in seconds',
                    example: 3600
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    })
    @ApiResponse({
        status: 404,
        description: 'Document not found',
    })
    async getDocumentDownloadUrl(
        @Param('documentId') documentId: string,
    ): Promise<{ url: string; filename: string; expiresIn: number }> {
        return this.merchantDocumentService.getDocumentDownloadUrl(documentId);
    }
}
