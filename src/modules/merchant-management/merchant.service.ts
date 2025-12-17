import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { UsersService } from '../users/users.service';
import { MerchantDocumentService } from './merchant-document.service';
import {
  MerchantApplicationDto,
  MerchantApplicationResponseDto,
  CheckApplicationStatusDto,
} from './dto/merchant-application.dto';
import {
  MerchantProfileDto,
  UpdateMerchantProfileDto,
  MerchantListDto,
} from './dto/merchant-profile.dto';
import {
  InviteTeamMemberDto,
  UpdateTeamMemberDto,
  TeamListResponseDto,
  TeamMemberFilterDto,
  TeamStatsDto,
  RemoveTeamMemberDto,
  TeamMemberDto,
  MerchantUserRole,
  Permission,
} from './dto/team-management.dto';
import {
  MerchantApprovalDto,
  MerchantRejectionDto,
} from './dto/merchant-approval.dto';
import { NotificationType } from '../notifications/dto/notification.dto';

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private merchantDocumentService: MerchantDocumentService,
  ) {}

  /**
   * Submit a new merchant application
   */
  async submitApplication(
    applicationData: MerchantApplicationDto,
  ): Promise<MerchantApplicationResponseDto> {
    // Check if merchant with same name already exists
    const existingMerchant = await this.prisma.merchant.findFirst({
      where: {
        name: applicationData.name,
      },
    });

    if (existingMerchant) {
      throw new BadRequestException('A merchant with this name already exists');
    }

    // Check if user with same email already exists
    const existingUser = await this.usersService.findByEmail(
      applicationData.contactEmail,
    );
    if (existingUser) {
      throw new BadRequestException(
        'A user account with this email already exists',
      );
    }

    // Find the merchant_admin role ID
    const merchantAdminRole = await this.prisma.role.findUnique({
      where: { name: 'merchant_admin' },
    });

    if (!merchantAdminRole) {
      throw new BadRequestException('Merchant admin role not found in system');
    }

    // Create user account for the merchant with merchant admin role
    const user = await this.usersService.create({
      email: applicationData.contactEmail,
      password: applicationData.password,
      displayName: `${applicationData.firstName} ${applicationData.lastName}`,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      phoneNumber: applicationData.contactPhone,
      emailVerified: true, // Auto-verify since they're applying for merchant status
      roles: [merchantAdminRole.id], // Assign merchant admin role by ID
    });

    // Create merchant application
    const merchant = await this.prisma.merchant.create({
      data: {
        name: applicationData.name,
        displayName: applicationData.displayName,
        description: applicationData.description,
        businessType: applicationData.businessType,
        contactEmail: applicationData.contactEmail,
        contactPhone: applicationData.contactPhone,
        website: applicationData.website,
        addressLine1: applicationData.addressLine1,
        addressLine2: applicationData.addressLine2,
        city: applicationData.city,
        state: applicationData.state,
        postalCode: applicationData.postalCode,
        country: applicationData.country,
        minimumOrderValue: applicationData.minimumOrderValue,
        shippingPolicy: applicationData.shippingPolicy,
        returnPolicy: applicationData.returnPolicy,
        tin: applicationData.tin,
        idType: applicationData.idType,
        idValue: applicationData.idValue,
        eInvoiceOptIn: applicationData.eInvoiceOptIn || false,
        status: 'PENDING',
        isActive: true,
      },
    });

    // Create user-merchant association with admin role
    await this.prisma.userMerchant.create({
      data: {
        userId: user.id,
        merchantId: merchant.id,
        role: 'admin',
        canManageProducts: true,
        canManageOrders: true,
        canManagePricing: true,
        canViewAnalytics: true,
        isActive: true,
      },
    });

    // Log the application submission
    await this.createAuditLog(
      merchant.id,
      'application_submitted',
      'Merchant application submitted',
      user.id,
      {
        merchantName: merchant.name,
        contactEmail: merchant.contactEmail,
        userId: user.id,
      },
    );

    // Send notification to system admins about new application
    try {
      await this.notificationService.sendSystemAlert(
        'New Merchant Application',
        new Error(
          `New merchant application received from ${merchant.name} (${merchant.contactEmail}). Application ID: ${merchant.id}`,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to send system alert for new merchant application:',
        error,
      );
    }

    // Send welcome email to the new user
    try {
      await this.notificationService.sendWelcomeEmail(
        user.email,
        user.displayName || user.email,
      );
    } catch (error) {
      console.error(
        'Failed to send welcome email to new merchant user:',
        error,
      );
    }

    return {
      id: merchant.id,
      status: merchant.status,
      submittedAt: merchant.createdAt,
      message:
        'Application submitted successfully. You can now log in to track your application status.',
      requiredDocuments: [
        'business_license',
        'tax_certificate',
        'insurance_certificate',
        'bank_verification',
        'signatory_authorization',
      ],
    };
  }

  /**
   * Get the authenticated user's application status
   */
  async getMyApplicationStatus(
    userId: string,
  ): Promise<CheckApplicationStatusDto> {
    // Find the user's merchant application
    const userMerchant = await this.prisma.userMerchant.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        merchant: true,
      },
    });

    if (!userMerchant) {
      throw new NotFoundException('No application found for this user');
    }

    return this.checkApplicationStatus(userMerchant.merchant.id);
  }

  /**
   * Check application status
   */
  async checkApplicationStatus(
    merchantId: string,
  ): Promise<CheckApplicationStatusDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Application not found');
    }

    // Get actual document upload status from the document service
    let uploadedDocuments: any[] = [];
    try {
      const documentResponse =
        await this.merchantDocumentService.getMerchantDocuments(merchantId);
      uploadedDocuments = documentResponse.documents || [];
    } catch (error) {
      console.error('Failed to fetch merchant documents:', error);
      // Continue with empty documents array
    }

    // Define required document types
    const requiredDocumentTypes = [
      { type: 'business_license', required: true },
      { type: 'tax_certificate', required: true },
      { type: 'insurance_certificate', required: false },
      { type: 'bank_verification', required: true },
      { type: 'signatory_authorization', required: true },
    ];

    // Map document types to their upload status
    const documents = requiredDocumentTypes.map((docType) => {
      const uploadedDoc = uploadedDocuments.find(
        (doc) => doc.documentType === docType.type,
      );
      return {
        type: docType.type,
        required: docType.required,
        uploaded: !!uploadedDoc,
        uploadedAt: uploadedDoc?.createdAt,
      };
    });

    const statusMessages = {
      PENDING: 'Application is under review by our team',
      APPROVED:
        'Application approved - you can now set up your merchant account',
      REJECTED: merchant.rejectionReason || 'Application was rejected',
      SUSPENDED: 'Merchant account is temporarily suspended',
      INACTIVE: 'Merchant account is inactive',
    };

    // Generate next steps based on status
    const nextSteps: string[] = [];
    switch (merchant.status) {
      case 'PENDING':
        nextSteps.push('Wait for our team to review your application');
        nextSteps.push('Ensure all required documents are submitted');
        nextSteps.push('Check your email for any additional requests');
        break;
      case 'APPROVED':
        nextSteps.push('Sign in to your merchant portal');
        nextSteps.push('Complete your merchant profile setup');
        nextSteps.push('Add your first products');
        break;
      case 'REJECTED':
        nextSteps.push('Review the rejection reason below');
        nextSteps.push('Address the issues mentioned');
        nextSteps.push('Submit a new application when ready');
        break;
      default:
        nextSteps.push('Contact support for assistance');
    }

    // Calculate estimated completion (7 business days from submission for pending applications)
    let estimatedCompletion: string | undefined;
    if (merchant.status === 'PENDING') {
      const submissionDate = new Date(merchant.createdAt);
      const estimatedDate = new Date(submissionDate);
      estimatedDate.setDate(estimatedDate.getDate() + 7); // 7 business days
      estimatedCompletion = estimatedDate.toISOString();
    }

    return {
      id: merchant.id,
      businessName: merchant.displayName || merchant.name,
      status: merchant.status,
      statusMessage:
        statusMessages[merchant.status as keyof typeof statusMessages],
      submittedAt: merchant.createdAt,
      lastUpdated: merchant.updatedAt,
      processedAt: merchant.approvedAt || undefined,
      estimatedCompletion,
      notes: merchant.rejectionReason || undefined,
      rejectionReason: merchant.rejectionReason || undefined,
      nextSteps,
      documents,
      applicationData: {
        name: merchant.name,
        displayName: merchant.displayName || undefined,
        description: merchant.description || undefined,
        businessType: merchant.businessType || undefined,
        contactEmail: merchant.contactEmail || undefined,
        contactPhone: merchant.contactPhone || undefined,
        website: merchant.website || undefined,
        addressLine1: merchant.addressLine1 || undefined,
        addressLine2: merchant.addressLine2 || undefined,
        city: merchant.city || undefined,
        state: merchant.state || undefined,
        postalCode: merchant.postalCode || undefined,
        country: merchant.country || undefined,
        tin: merchant.tin || undefined,
        idType: merchant.idType || undefined,
        idValue: merchant.idValue || undefined,
        eInvoiceOptIn: merchant.eInvoiceOptIn || undefined,
      },
      canEdit: merchant.status === 'PENDING' || merchant.status === 'REJECTED',
    };
  }

  /**
   * Update merchant application (only for PENDING or REJECTED applications)
   */
  async updateApplication(
    merchantId: string,
    updateData: MerchantApplicationDto,
  ): Promise<MerchantApplicationResponseDto> {
    // Check if merchant exists and can be edited
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!existingMerchant) {
      throw new NotFoundException('Application not found');
    }

    if (
      existingMerchant.status !== 'PENDING' &&
      existingMerchant.status !== 'REJECTED'
    ) {
      throw new BadRequestException(
        'Application cannot be edited in current status',
      );
    }

    // Update the merchant application
    const updatedMerchant = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        name: updateData.name,
        displayName: updateData.displayName,
        description: updateData.description,
        businessType: updateData.businessType,
        contactEmail: updateData.contactEmail,
        contactPhone: updateData.contactPhone,
        website: updateData.website,
        addressLine1: updateData.addressLine1,
        addressLine2: updateData.addressLine2,
        city: updateData.city,
        state: updateData.state,
        postalCode: updateData.postalCode,
        country: updateData.country,
        minimumOrderValue: updateData.minimumOrderValue,
        shippingPolicy: updateData.shippingPolicy,
        returnPolicy: updateData.returnPolicy,
        tin: updateData.tin,
        idType: updateData.idType,
        idValue: updateData.idValue,
        eInvoiceOptIn: updateData.eInvoiceOptIn || false,
        // Reset status to PENDING if it was REJECTED
        status:
          existingMerchant.status === 'REJECTED'
            ? 'PENDING'
            : existingMerchant.status,
        rejectionReason:
          existingMerchant.status === 'REJECTED'
            ? null
            : existingMerchant.rejectionReason,
      },
    });

    // Log the application update
    await this.createAuditLog(
      updatedMerchant.id,
      'application_updated',
      'Merchant application updated',
      undefined,
      {
        merchantName: updatedMerchant.name,
        contactEmail: updatedMerchant.contactEmail,
        previousStatus: existingMerchant.status,
        newStatus: updatedMerchant.status,
      },
    );

    // Send notification to system admins if status changed from REJECTED to PENDING
    if (
      existingMerchant.status === 'REJECTED' &&
      updatedMerchant.status === 'PENDING'
    ) {
      await this.notificationService.sendSystemAlert(
        'Merchant Application Resubmitted',
        new Error(
          `Merchant application for ${updatedMerchant.name} has been updated and resubmitted for review.`,
        ),
      );
    }

    return {
      id: updatedMerchant.id,
      status: updatedMerchant.status,
      submittedAt: updatedMerchant.createdAt,
      message: 'Application updated successfully',
      requiredDocuments: [
        'Business License',
        'Tax Certificate',
        'Insurance Certificate',
        'Bank Account Verification',
        'Authorized Signatory Documents',
      ],
    };
  }

  /**
   * Get merchants list with filtering and pagination (System Admin)
   */
  async getMerchants(params: {
    page?: number;
    limit?: number;
    status?: string;
    businessType?: string;
    search?: string;
  }): Promise<MerchantListDto> {
    const { page = 1, limit = 20, status, businessType, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (businessType) {
      where.businessType = businessType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.merchant.count({ where }),
    ]);

    const merchantProfiles = merchants.map((merchant) =>
      this.mapToMerchantProfile(merchant),
    );

    return {
      merchants: merchantProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Approve merchant application (System Admin)
   */
  async approveMerchant(
    merchantId: string,
    approvalData: MerchantApprovalDto,
    adminUserId: string,
  ): Promise<MerchantProfileDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.status !== 'PENDING') {
      throw new BadRequestException('Only pending merchants can be approved');
    }

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'APPROVED',
        approvedAt: approvalData.approvalDate || new Date(),
        approvedBy: adminUserId,
        rejectionReason: null, // Clear any previous rejection reason
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    // Log the approval
    await this.createAuditLog(
      merchantId,
      'status_change',
      `Merchant approved by admin`,
      adminUserId,
      {
        previousStatus: 'PENDING',
        newStatus: 'APPROVED',
        approvalNotes: approvalData.approvalNotes,
        conditionalApproval: approvalData.conditionalApproval,
        restrictions: approvalData.restrictions,
      },
    );

    // Send approval notification to merchant
    if (merchant.contactEmail) {
      await this.notificationService.sendAll(
        {
          title: 'Merchant Application Approved - Hardware World',
          body: `Congratulations! Your merchant application for ${merchant.name} has been approved. ${approvalData.approvalNotes}`,
          type: NotificationType.INFO,
        },
        [merchant.contactEmail],
      );
    }

    return this.mapToMerchantProfile(updatedMerchant);
  }

  /**
   * Reject merchant application (System Admin)
   */
  async rejectMerchant(
    merchantId: string,
    rejectionData: MerchantRejectionDto,
    adminUserId: string,
  ): Promise<MerchantProfileDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.status !== 'PENDING') {
      throw new BadRequestException('Only pending merchants can be rejected');
    }

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'REJECTED',
        rejectionReason: `${rejectionData.reason}: ${rejectionData.rejectionNotes}`,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    // Log the rejection
    await this.createAuditLog(
      merchantId,
      'status_change',
      `Merchant rejected by admin`,
      adminUserId,
      {
        previousStatus: 'PENDING',
        newStatus: 'REJECTED',
        reason: rejectionData.reason,
        rejectionNotes: rejectionData.rejectionNotes,
        canReapply: rejectionData.canReapply,
        requiredForReapplication: rejectionData.requiredForReapplication,
      },
    );

    // Send rejection notification to merchant
    if (merchant.contactEmail) {
      await this.notificationService.sendAll(
        {
          title: 'Merchant Application Status - Hardware World',
          body: `Your merchant application for ${merchant.name} has been reviewed. Reason: ${rejectionData.reason}. ${rejectionData.rejectionNotes}`,
          type: NotificationType.WARNING,
        },
        [merchant.contactEmail],
      );
    }

    return this.mapToMerchantProfile(updatedMerchant);
  }

  /**
   * Get merchant profile
   */
  async getMerchantProfile(merchantId: string): Promise<MerchantProfileDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.mapToMerchantProfile(merchant);
  }

  /**
   * Update merchant profile (Merchant Admin)
   */
  async updateMerchantProfile(
    merchantId: string,
    updateData: UpdateMerchantProfileDto,
    userId: string,
  ): Promise<MerchantProfileDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Check if user has permission to update this merchant
    // First check if user is a system admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });

    const isSystemAdmin = user?.roles.some(
      (role) => role.name === 'system_admin',
    );

    if (!isSystemAdmin) {
      // If not system admin, check if user is merchant admin for this specific merchant
      const userMerchant = await this.prisma.userMerchant.findUnique({
        where: {
          userId_merchantId: {
            userId,
            merchantId,
          },
        },
      });

      if (!userMerchant || userMerchant.role !== 'admin') {
        throw new ForbiddenException(
          'Only merchant admins or system admins can update the profile',
        );
      }
    }

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: updateData,
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    // Log the profile update
    await this.createAuditLog(
      merchantId,
      'profile_updated',
      'Merchant profile updated',
      userId,
      { updatedFields: Object.keys(updateData) },
    );

    return this.mapToMerchantProfile(updatedMerchant);
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(
    merchantId: string,
    action: string,
    details: string,
    performedBy?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      // TODO: Implement proper audit log table when available
      // For now, we'll use system events or console logging
      console.log('Merchant Audit Log:', {
        merchantId,
        action,
        details,
        performedBy,
        metadata,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Map merchant data to profile DTO
   */
  private mapToMerchantProfile(merchant: any): MerchantProfileDto {
    return {
      id: merchant.id,
      name: merchant.name,
      displayName: merchant.displayName,
      description: merchant.description,
      logoUrl: merchant.logoUrl,
      businessType: merchant.businessType,
      contactEmail: merchant.contactEmail,
      contactPhone: merchant.contactPhone,
      website: merchant.website,
      address: {
        addressLine1: merchant.addressLine1,
        addressLine2: merchant.addressLine2,
        city: merchant.city,
        state: merchant.state,
        postalCode: merchant.postalCode,
        country: merchant.country,
      },
      settings: {
        minimumOrderValue: merchant.minimumOrderValue,
        shippingPolicy: merchant.shippingPolicy,
        returnPolicy: merchant.returnPolicy,
      },
      tin: merchant.tin,
      idType: merchant.idType,
      idValue: merchant.idValue,
      eInvoiceOptIn: merchant.eInvoiceOptIn,
      status: merchant.status,
      isActive: merchant.isActive,
      approvedAt: merchant.approvedAt,
      approvedBy: merchant.approvedBy,
      rejectionReason: merchant.rejectionReason,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
      userCount: merchant.users?.length || 0,
      // TODO: Add metrics calculation
      metrics: {
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        completionRate: 0,
      },
    };
  }

  /**
   * Update merchant status (System Admin)
   */
  async updateMerchantStatus(
    merchantId: string,
    status: string,
    adminUserId: string,
    reason?: string,
  ): Promise<MerchantProfileDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const previousStatus = merchant.status;

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: status as any,
        ...(status === 'APPROVED' && {
          approvedAt: new Date(),
          approvedBy: adminUserId,
        }),
        ...(status === 'REJECTED' && { rejectionReason: reason }),
        ...(status === 'APPROVED' && { rejectionReason: null }), // Clear rejection reason on approval
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    // Log the status change
    await this.createAuditLog(
      merchantId,
      'status_change',
      `Merchant status changed from ${previousStatus} to ${status}`,
      adminUserId,
      {
        previousStatus,
        newStatus: status,
        reason,
      },
    );

    // Send notification to merchant if status changed to approved or rejected
    if (
      merchant.contactEmail &&
      (status === 'APPROVED' || status === 'REJECTED')
    ) {
      try {
        const notificationType =
          status === 'APPROVED'
            ? NotificationType.INFO
            : NotificationType.WARNING;
        const message =
          status === 'APPROVED'
            ? `Congratulations! Your merchant application for ${merchant.name} has been approved.`
            : `Your merchant application for ${merchant.name} has been reviewed. ${reason || 'Please check your application status for more details.'}`;

        await this.notificationService.sendAll(
          {
            title: `Merchant Application ${status === 'APPROVED' ? 'Approved' : 'Status Update'} - Hardware World`,
            body: message,
            type: notificationType,
          },
          [merchant.contactEmail],
        );
      } catch (error) {
        console.error('Failed to send status update notification:', error);
      }
    }

    return this.mapToMerchantProfile(updatedMerchant);
  }

  // ==================== TEAM MANAGEMENT METHODS ====================

  /**
   * Get team members for a merchant
   */
  async getTeamMembers(
    merchantId: string,
    filters: TeamMemberFilterDto,
  ): Promise<TeamListResponseDto> {
    const {
      search,
      role,
      department,
      isActive,
      page = 1,
      limit = 20,
    } = filters;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      merchantId: merchantId,
    };

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (department) {
      where.department = department;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get team members with pagination
    const [members, total] = await Promise.all([
      this.prisma.userMerchant.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              lastLoginAt: true,
            },
          },
        },
        orderBy: { joinedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.userMerchant.count({ where }),
    ]);

    // Map to DTO
    const teamMembers: TeamMemberDto[] = members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      fullName:
        `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim(),
      jobTitle: member.jobTitle,
      department: member.department,
      role: member.role as MerchantUserRole,
      permissions: (member.permissions as Permission[]) || [],
      isActive: member.isActive,
      joinedAt: member.joinedAt,
      lastLoginAt: member.user.lastLoginAt,
      profilePictureUrl: member.user.profilePictureUrl,
    }));

    return {
      members: teamMembers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get team statistics for a merchant
   */
  async getTeamStats(merchantId: string): Promise<TeamStatsDto> {
    const [
      totalMembers,
      activeMembers,
      pendingInvitations,
      membersByRole,
      membersByDepartment,
      recentlyJoined,
    ] = await Promise.all([
      // Total members
      this.prisma.userMerchant.count({
        where: { merchantId },
      }),
      // Active members
      this.prisma.userMerchant.count({
        where: { merchantId, isActive: true },
      }),
      // Pending invitations (users with PENDING status)
      this.prisma.userMerchant.count({
        where: { merchantId, status: 'PENDING' },
      }),
      // Members by role
      this.prisma.userMerchant.groupBy({
        by: ['role'],
        where: { merchantId },
        _count: { role: true },
      }),
      // Members by department
      this.prisma.userMerchant.groupBy({
        by: ['department'],
        where: { merchantId, department: { not: null } },
        _count: { department: true },
      }),
      // Recently joined (last 30 days)
      this.prisma.userMerchant.count({
        where: {
          merchantId,
          joinedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Format role statistics
    const roleStats: Record<MerchantUserRole, number> = {
      [MerchantUserRole.ADMIN]: 0,
      [MerchantUserRole.MANAGER]: 0,
      [MerchantUserRole.USER]: 0,
    };

    membersByRole.forEach((item) => {
      roleStats[item.role as MerchantUserRole] = item._count.role;
    });

    // Format department statistics
    const departmentStats: Record<string, number> = {};
    membersByDepartment.forEach((item) => {
      if (item.department) {
        departmentStats[item.department] = item._count.department;
      }
    });

    return {
      totalMembers,
      activeMembers,
      pendingInvitations,
      membersByRole: roleStats,
      membersByDepartment: departmentStats,
      recentlyJoined,
    };
  }

  /**
   * Invite a new team member
   */
  async inviteTeamMember(
    merchantId: string,
    inviteDto: InviteTeamMemberDto,
    invitedBy: string,
  ): Promise<{ message: string }> {
    // Check if user already exists
    let user = await this.usersService.findByEmail(inviteDto.email);

    if (!user) {
      try {
        // Create new user account directly using Prisma
        const newUser = await this.prisma.user.create({
          data: {
            email: inviteDto.email,
            firstName: inviteDto.firstName || '',
            lastName: inviteDto.lastName || '',
            password: 'temp_password', // Will be reset on first login
            emailVerified: false,
            isActive: true,
          },
        });
        user = newUser as any;
      } catch (error) {
        console.error('Failed to create user for invitation:', error);
        throw new BadRequestException(
          'Failed to create user account for invitation',
        );
      }
    }

    // Check if user is already a member of this merchant
    const existingMember = await this.prisma.userMerchant.findUnique({
      where: {
        userId_merchantId: {
          userId: user!.id,
          merchantId: merchantId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        'User is already a member of this merchant team',
      );
    }

    // Add user to merchant team
    await this.prisma.userMerchant.create({
      data: {
        userId: user!.id,
        merchantId: merchantId,
        role: inviteDto.role,
        jobTitle: inviteDto.jobTitle,
        department: inviteDto.department,
        permissions: inviteDto.permissions || [],
        isActive: false, // Will be activated when they accept invitation
        status: 'PENDING',
        invitedBy: invitedBy,
        invitedAt: new Date(),
      },
    });

    // Send invitation email
    await this.notificationService.sendEmail({
      to: [
        {
          email: inviteDto.email,
          name: `${inviteDto.firstName} ${inviteDto.lastName}`.trim(),
        },
      ],
      subject: 'Invitation to join merchant team',
      text: `Hello ${inviteDto.firstName} ${inviteDto.lastName},\n\nYou have been invited to join our merchant team as ${inviteDto.role}.\n\n${inviteDto.message || ''}\n\nPlease click the link below to accept the invitation:\n${process.env.FRONTEND_URL}/invite/accept?token=invitation_token\n\nBest regards,\nThe Team`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Team Invitation</h2>
              <p>Hello ${inviteDto.firstName} ${inviteDto.lastName},</p>
              <p>You have been invited to join our merchant team as <strong>${inviteDto.role}</strong>.</p>
              ${inviteDto.message ? `<p><em>${inviteDto.message}</em></p>` : ''}
              <p>Please click the button below to accept the invitation:</p>
              <a href="${process.env.FRONTEND_URL}/invite/accept?token=invitation_token" 
                 style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Accept Invitation
              </a>
              <p>Best regards,<br>The Team</p>
            </div>
          `,
    });

    return { message: 'Invitation sent successfully' };
  }

  /**
   * Update team member details
   */
  async updateTeamMember(
    merchantId: string,
    userId: string,
    updateDto: UpdateTeamMemberDto,
    updatedBy: string,
  ): Promise<{ message: string }> {
    // Check if team member exists
    const teamMember = await this.prisma.userMerchant.findUnique({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    // If changing role to admin, ensure user has necessary permissions
    if (updateDto.role === MerchantUserRole.ADMIN) {
      // Auto-grant admin permissions
      updateDto.permissions = [
        Permission.MANAGE_PRODUCTS,
        Permission.MANAGE_ORDERS,
        Permission.MANAGE_PRICING,
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_INVENTORY,
        Permission.MANAGE_RFQ,
        Permission.MANAGE_FULFILLMENT,
      ];
    }

    // Update team member
    await this.prisma.userMerchant.update({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
    });

    // Log the update
    await this.logMerchantAudit(
      merchantId,
      'TEAM_MEMBER_UPDATED',
      {
        userId,
        updatedBy,
        changes: updateDto,
      },
      updatedBy,
    );

    return { message: 'Team member updated successfully' };
  }

  /**
   * Remove team member from merchant
   */
  async removeTeamMember(
    merchantId: string,
    userId: string,
    removeDto: RemoveTeamMemberDto,
    removedBy: string,
  ): Promise<{ message: string }> {
    // Check if team member exists
    const teamMember = await this.prisma.userMerchant.findUnique({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    // Prevent removing the last admin
    if (teamMember.role === MerchantUserRole.ADMIN) {
      const adminCount = await this.prisma.userMerchant.count({
        where: {
          merchantId: merchantId,
          role: MerchantUserRole.ADMIN,
          isActive: true,
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the last admin from the merchant team',
        );
      }
    }

    // Handle data transfer if specified
    if (removeDto.transferToUserId) {
      // TODO: Implement data transfer logic
      // This would involve transferring ownership of products, orders, etc.
    }

    // Remove team member
    await this.prisma.userMerchant.delete({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
    });

    // Log the removal
    await this.logMerchantAudit(
      merchantId,
      'TEAM_MEMBER_REMOVED',
      {
        userId,
        removedBy,
        reason: removeDto.reason,
        transferTo: removeDto.transferToUserId,
      },
      removedBy,
    );

    return { message: 'Team member removed successfully' };
  }

  /**
   * Resend invitation to team member
   */
  async resendInvitation(
    merchantId: string,
    userId: string,
    resentBy: string,
  ): Promise<{ message: string }> {
    // Check if team member exists and is pending
    const teamMember = await this.prisma.userMerchant.findUnique({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    if (teamMember.status !== 'PENDING') {
      throw new BadRequestException(
        'Can only resend invitations to pending team members',
      );
    }

    // Update invitation timestamp
    await this.prisma.userMerchant.update({
      where: {
        userId_merchantId: {
          userId: userId,
          merchantId: merchantId,
        },
      },
      data: {
        invitedAt: new Date(),
        invitedBy: resentBy,
      },
    });

    // Resend invitation email
    await this.notificationService.sendEmail({
      to: [
        {
          email: teamMember.user.email,
          name: `${teamMember.user.firstName} ${teamMember.user.lastName}`.trim(),
        },
      ],
      subject: 'Reminder: Invitation to join merchant team',
      text: `Hello ${teamMember.user.firstName} ${teamMember.user.lastName},\n\nThis is a reminder about your invitation to join our merchant team as ${teamMember.role}.\n\nPlease click the link below to accept the invitation:\n${process.env.FRONTEND_URL}/invite/accept?token=invitation_token\n\nBest regards,\nThe Team`,
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Team Invitation Reminder</h2>
                <p>Hello ${teamMember.user.firstName} ${teamMember.user.lastName},</p>
                <p>This is a reminder about your invitation to join our merchant team as <strong>${teamMember.role}</strong>.</p>
                <p>Please click the button below to accept the invitation:</p>
                <a href="${process.env.FRONTEND_URL}/invite/accept?token=invitation_token" 
                   style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                  Accept Invitation
                </a>
                <p>Best regards,<br>The Team</p>
              </div>
            `,
    });

    return { message: 'Invitation resent successfully' };
  }

  /**
   * Log merchant audit events
   */
  private async logMerchantAudit(
    merchantId: string,
    action: string,
    details: any,
    performedBy: string,
    metadata?: any,
  ): Promise<void> {
    try {
      // Use the existing createAuditLog method for consistency
      await this.createAuditLog(
        merchantId,
        action,
        JSON.stringify(details),
        performedBy,
        metadata,
      );
    } catch (error) {
      console.error('Failed to log merchant audit event:', error);
    }
  }
}
