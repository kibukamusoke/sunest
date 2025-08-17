import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { MerchantApplicationDto, MerchantApplicationResponseDto, CheckApplicationStatusDto } from './dto/merchant-application.dto';
import { MerchantProfileDto, UpdateMerchantProfileDto, MerchantListDto, AddMerchantUserDto, UpdateMerchantUserDto, MerchantUserDto } from './dto/merchant-profile.dto';
import { MerchantApprovalDto, MerchantRejectionDto, MerchantStatusUpdateDto, MerchantDocumentDto, MerchantAuditLogResponseDto } from './dto/merchant-approval.dto';
import { NotificationType } from '../notifications/dto/notification.dto';

@Injectable()
export class MerchantService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    /**
     * Submit a new merchant application
     */
    async submitApplication(applicationData: MerchantApplicationDto): Promise<MerchantApplicationResponseDto> {
        // Check if merchant with same name or tax ID already exists
        const existingMerchant = await this.prisma.merchant.findFirst({
            where: {
                OR: [
                    { name: applicationData.name },
                    { taxId: applicationData.taxId }
                ],
            },
        });

        if (existingMerchant) {
            throw new BadRequestException('Merchant with this name or tax ID already exists');
        }

        // Create merchant application
        const merchant = await this.prisma.merchant.create({
            data: {
                name: applicationData.name,
                displayName: applicationData.displayName,
                description: applicationData.description,
                businessType: applicationData.businessType,
                taxId: applicationData.taxId,
                registrationNumber: applicationData.registrationNumber,
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

        // Log the application submission
        await this.createAuditLog(merchant.id, 'application_submitted', 'Merchant application submitted', undefined, {
            merchantName: merchant.name,
            contactEmail: merchant.contactEmail,
        });

        // Send notification to system admins about new application
        await this.notificationService.sendSystemAlert(
            'New Merchant Application',
            new Error(`New merchant application received from ${merchant.name} (${merchant.contactEmail}). Application ID: ${merchant.id}`)
        );

        return {
            id: merchant.id,
            status: merchant.status,
            submittedAt: merchant.createdAt,
            message: 'Application submitted successfully. You will be contacted once the review is complete.',
            requiredDocuments: [
                'business_license',
                'tax_certificate',
                'insurance_certificate',
                'bank_verification',
                'signatory_authorization'
            ],
        };
    }

    /**
     * Check application status
     */
    async checkApplicationStatus(merchantId: string): Promise<CheckApplicationStatusDto> {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });

        if (!merchant) {
            throw new NotFoundException('Application not found');
        }

        // Get document upload status (placeholder - will be implemented with storage module integration)
        const documents = [
            { type: 'business_license', required: true, uploaded: false, uploadedAt: undefined },
            { type: 'tax_certificate', required: true, uploaded: false, uploadedAt: undefined },
            { type: 'insurance_certificate', required: false, uploaded: false, uploadedAt: undefined },
            { type: 'bank_verification', required: true, uploaded: false, uploadedAt: undefined },
            { type: 'signatory_authorization', required: true, uploaded: false, uploadedAt: undefined },
        ];

        const statusMessages = {
            PENDING: 'Application is under review by our team',
            APPROVED: 'Application approved - you can now set up your merchant account',
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
            statusMessage: statusMessages[merchant.status as keyof typeof statusMessages],
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
                taxId: merchant.taxId || undefined,
                registrationNumber: merchant.registrationNumber || undefined,
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
    async updateApplication(merchantId: string, updateData: MerchantApplicationDto): Promise<MerchantApplicationResponseDto> {
        // Check if merchant exists and can be edited
        const existingMerchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });

        if (!existingMerchant) {
            throw new NotFoundException('Application not found');
        }

        if (existingMerchant.status !== 'PENDING' && existingMerchant.status !== 'REJECTED') {
            throw new BadRequestException('Application cannot be edited in current status');
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
                taxId: updateData.taxId,
                registrationNumber: updateData.registrationNumber,
                minimumOrderValue: updateData.minimumOrderValue,
                shippingPolicy: updateData.shippingPolicy,
                returnPolicy: updateData.returnPolicy,
                tin: updateData.tin,
                idType: updateData.idType,
                idValue: updateData.idValue,
                eInvoiceOptIn: updateData.eInvoiceOptIn || false,
                // Reset status to PENDING if it was REJECTED
                status: existingMerchant.status === 'REJECTED' ? 'PENDING' : existingMerchant.status,
                rejectionReason: existingMerchant.status === 'REJECTED' ? null : existingMerchant.rejectionReason,
            },
        });

        // Log the application update
        await this.createAuditLog(updatedMerchant.id, 'application_updated', 'Merchant application updated', undefined, {
            merchantName: updatedMerchant.name,
            contactEmail: updatedMerchant.contactEmail,
            previousStatus: existingMerchant.status,
            newStatus: updatedMerchant.status,
        });

        // Send notification to system admins if status changed from REJECTED to PENDING
        if (existingMerchant.status === 'REJECTED' && updatedMerchant.status === 'PENDING') {
            await this.notificationService.sendSystemAlert(
                'Merchant Application Resubmitted',
                new Error(`Merchant application for ${updatedMerchant.name} has been updated and resubmitted for review.`)
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

        const merchantProfiles = merchants.map(merchant => this.mapToMerchantProfile(merchant));

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
    async approveMerchant(merchantId: string, approvalData: MerchantApprovalDto, adminUserId: string): Promise<MerchantProfileDto> {
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
            }
        );

        // Send approval notification to merchant
        if (merchant.contactEmail) {
            await this.notificationService.sendAll(
                {
                    title: 'Merchant Application Approved - Hardware World',
                    body: `Congratulations! Your merchant application for ${merchant.name} has been approved. ${approvalData.approvalNotes}`,
                    type: NotificationType.INFO,
                },
                [merchant.contactEmail]
            );
        }

        return this.mapToMerchantProfile(updatedMerchant);
    }

    /**
     * Reject merchant application (System Admin)
     */
    async rejectMerchant(merchantId: string, rejectionData: MerchantRejectionDto, adminUserId: string): Promise<MerchantProfileDto> {
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
            }
        );

        // Send rejection notification to merchant
        if (merchant.contactEmail) {
            await this.notificationService.sendAll(
                {
                    title: 'Merchant Application Status - Hardware World',
                    body: `Your merchant application for ${merchant.name} has been reviewed. Reason: ${rejectionData.reason}. ${rejectionData.rejectionNotes}`,
                    type: NotificationType.WARNING,
                },
                [merchant.contactEmail]
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
    async updateMerchantProfile(merchantId: string, updateData: UpdateMerchantProfileDto, userId: string): Promise<MerchantProfileDto> {
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

        const isSystemAdmin = user?.roles.some(role => role.name === 'system_admin');

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
                throw new ForbiddenException('Only merchant admins or system admins can update the profile');
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
            { updatedFields: Object.keys(updateData) }
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
        metadata?: Record<string, any>
    ): Promise<void> {
        // This would be implemented with a separate audit log table
        // For now, we'll just log to console
        console.log('Merchant Audit Log:', {
            merchantId,
            action,
            details,
            performedBy,
            metadata,
            timestamp: new Date(),
        });
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
            taxId: merchant.taxId,
            registrationNumber: merchant.registrationNumber,
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
}
