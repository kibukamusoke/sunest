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
exports.MerchantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const users_service_1 = require("../users/users.service");
const merchant_document_service_1 = require("./merchant-document.service");
const team_management_dto_1 = require("./dto/team-management.dto");
const notification_dto_1 = require("../notifications/dto/notification.dto");
let MerchantService = class MerchantService {
    constructor(prisma, notificationService, usersService, merchantDocumentService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.usersService = usersService;
        this.merchantDocumentService = merchantDocumentService;
    }
    async submitApplication(applicationData) {
        const existingMerchant = await this.prisma.merchant.findFirst({
            where: {
                name: applicationData.name,
            },
        });
        if (existingMerchant) {
            throw new common_1.BadRequestException('A merchant with this name already exists');
        }
        const existingUser = await this.usersService.findByEmail(applicationData.contactEmail);
        if (existingUser) {
            throw new common_1.BadRequestException('A user account with this email already exists');
        }
        const merchantAdminRole = await this.prisma.role.findUnique({
            where: { name: 'merchant_admin' },
        });
        if (!merchantAdminRole) {
            throw new common_1.BadRequestException('Merchant admin role not found in system');
        }
        const user = await this.usersService.create({
            email: applicationData.contactEmail,
            password: applicationData.password,
            displayName: `${applicationData.firstName} ${applicationData.lastName}`,
            firstName: applicationData.firstName,
            lastName: applicationData.lastName,
            phoneNumber: applicationData.contactPhone,
            emailVerified: true,
            roles: [merchantAdminRole.id],
        });
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
        await this.createAuditLog(merchant.id, 'application_submitted', 'Merchant application submitted', user.id, {
            merchantName: merchant.name,
            contactEmail: merchant.contactEmail,
            userId: user.id,
        });
        try {
            await this.notificationService.sendSystemAlert('New Merchant Application', new Error(`New merchant application received from ${merchant.name} (${merchant.contactEmail}). Application ID: ${merchant.id}`));
        }
        catch (error) {
            console.error('Failed to send system alert for new merchant application:', error);
        }
        try {
            await this.notificationService.sendWelcomeEmail(user.email, user.displayName || user.email);
        }
        catch (error) {
            console.error('Failed to send welcome email to new merchant user:', error);
        }
        return {
            id: merchant.id,
            status: merchant.status,
            submittedAt: merchant.createdAt,
            message: 'Application submitted successfully. You can now log in to track your application status.',
            requiredDocuments: [
                'business_license',
                'tax_certificate',
                'insurance_certificate',
                'bank_verification',
                'signatory_authorization',
            ],
        };
    }
    async getMyApplicationStatus(userId) {
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
            throw new common_1.NotFoundException('No application found for this user');
        }
        return this.checkApplicationStatus(userMerchant.merchant.id);
    }
    async checkApplicationStatus(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Application not found');
        }
        let uploadedDocuments = [];
        try {
            const documentResponse = await this.merchantDocumentService.getMerchantDocuments(merchantId);
            uploadedDocuments = documentResponse.documents || [];
        }
        catch (error) {
            console.error('Failed to fetch merchant documents:', error);
        }
        const requiredDocumentTypes = [
            { type: 'business_license', required: true },
            { type: 'tax_certificate', required: true },
            { type: 'insurance_certificate', required: false },
            { type: 'bank_verification', required: true },
            { type: 'signatory_authorization', required: true },
        ];
        const documents = requiredDocumentTypes.map((docType) => {
            const uploadedDoc = uploadedDocuments.find((doc) => doc.documentType === docType.type);
            return {
                type: docType.type,
                required: docType.required,
                uploaded: !!uploadedDoc,
                uploadedAt: uploadedDoc?.createdAt,
            };
        });
        const statusMessages = {
            PENDING: 'Application is under review by our team',
            APPROVED: 'Application approved - you can now set up your merchant account',
            REJECTED: merchant.rejectionReason || 'Application was rejected',
            SUSPENDED: 'Merchant account is temporarily suspended',
            INACTIVE: 'Merchant account is inactive',
        };
        const nextSteps = [];
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
        let estimatedCompletion;
        if (merchant.status === 'PENDING') {
            const submissionDate = new Date(merchant.createdAt);
            const estimatedDate = new Date(submissionDate);
            estimatedDate.setDate(estimatedDate.getDate() + 7);
            estimatedCompletion = estimatedDate.toISOString();
        }
        return {
            id: merchant.id,
            businessName: merchant.displayName || merchant.name,
            status: merchant.status,
            statusMessage: statusMessages[merchant.status],
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
    async updateApplication(merchantId, updateData) {
        const existingMerchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!existingMerchant) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (existingMerchant.status !== 'PENDING' &&
            existingMerchant.status !== 'REJECTED') {
            throw new common_1.BadRequestException('Application cannot be edited in current status');
        }
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
                status: existingMerchant.status === 'REJECTED'
                    ? 'PENDING'
                    : existingMerchant.status,
                rejectionReason: existingMerchant.status === 'REJECTED'
                    ? null
                    : existingMerchant.rejectionReason,
            },
        });
        await this.createAuditLog(updatedMerchant.id, 'application_updated', 'Merchant application updated', undefined, {
            merchantName: updatedMerchant.name,
            contactEmail: updatedMerchant.contactEmail,
            previousStatus: existingMerchant.status,
            newStatus: updatedMerchant.status,
        });
        if (existingMerchant.status === 'REJECTED' &&
            updatedMerchant.status === 'PENDING') {
            await this.notificationService.sendSystemAlert('Merchant Application Resubmitted', new Error(`Merchant application for ${updatedMerchant.name} has been updated and resubmitted for review.`));
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
    async getMerchants(params) {
        const { page = 1, limit = 20, status, businessType, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
        const merchantProfiles = merchants.map((merchant) => this.mapToMerchantProfile(merchant));
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
    async approveMerchant(merchantId, approvalData, adminUserId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (merchant.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending merchants can be approved');
        }
        const updatedMerchant = await this.prisma.merchant.update({
            where: { id: merchantId },
            data: {
                status: 'APPROVED',
                approvedAt: approvalData.approvalDate || new Date(),
                approvedBy: adminUserId,
                rejectionReason: null,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        await this.createAuditLog(merchantId, 'status_change', `Merchant approved by admin`, adminUserId, {
            previousStatus: 'PENDING',
            newStatus: 'APPROVED',
            approvalNotes: approvalData.approvalNotes,
            conditionalApproval: approvalData.conditionalApproval,
            restrictions: approvalData.restrictions,
        });
        if (merchant.contactEmail) {
            await this.notificationService.sendAll({
                title: 'Merchant Application Approved - Hardware World',
                body: `Congratulations! Your merchant application for ${merchant.name} has been approved. ${approvalData.approvalNotes}`,
                type: notification_dto_1.NotificationType.INFO,
            }, [merchant.contactEmail]);
        }
        return this.mapToMerchantProfile(updatedMerchant);
    }
    async rejectMerchant(merchantId, rejectionData, adminUserId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (merchant.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending merchants can be rejected');
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
        await this.createAuditLog(merchantId, 'status_change', `Merchant rejected by admin`, adminUserId, {
            previousStatus: 'PENDING',
            newStatus: 'REJECTED',
            reason: rejectionData.reason,
            rejectionNotes: rejectionData.rejectionNotes,
            canReapply: rejectionData.canReapply,
            requiredForReapplication: rejectionData.requiredForReapplication,
        });
        if (merchant.contactEmail) {
            await this.notificationService.sendAll({
                title: 'Merchant Application Status - Hardware World',
                body: `Your merchant application for ${merchant.name} has been reviewed. Reason: ${rejectionData.reason}. ${rejectionData.rejectionNotes}`,
                type: notification_dto_1.NotificationType.WARNING,
            }, [merchant.contactEmail]);
        }
        return this.mapToMerchantProfile(updatedMerchant);
    }
    async getMerchantProfile(merchantId) {
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
            throw new common_1.NotFoundException('Merchant not found');
        }
        return this.mapToMerchantProfile(merchant);
    }
    async updateMerchantProfile(merchantId, updateData, userId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: true,
            },
        });
        const isSystemAdmin = user?.roles.some((role) => role.name === 'system_admin');
        if (!isSystemAdmin) {
            const userMerchant = await this.prisma.userMerchant.findUnique({
                where: {
                    userId_merchantId: {
                        userId,
                        merchantId,
                    },
                },
            });
            if (!userMerchant || userMerchant.role !== 'admin') {
                throw new common_1.ForbiddenException('Only merchant admins or system admins can update the profile');
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
        await this.createAuditLog(merchantId, 'profile_updated', 'Merchant profile updated', userId, { updatedFields: Object.keys(updateData) });
        return this.mapToMerchantProfile(updatedMerchant);
    }
    async createAuditLog(merchantId, action, details, performedBy, metadata) {
        try {
            console.log('Merchant Audit Log:', {
                merchantId,
                action,
                details,
                performedBy,
                metadata,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
    mapToMerchantProfile(merchant) {
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
            metrics: {
                totalOrders: 0,
                totalRevenue: 0,
                averageRating: 0,
                completionRate: 0,
            },
        };
    }
    async updateMerchantStatus(merchantId, status, adminUserId, reason) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const previousStatus = merchant.status;
        const updatedMerchant = await this.prisma.merchant.update({
            where: { id: merchantId },
            data: {
                status: status,
                ...(status === 'APPROVED' && {
                    approvedAt: new Date(),
                    approvedBy: adminUserId,
                }),
                ...(status === 'REJECTED' && { rejectionReason: reason }),
                ...(status === 'APPROVED' && { rejectionReason: null }),
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        await this.createAuditLog(merchantId, 'status_change', `Merchant status changed from ${previousStatus} to ${status}`, adminUserId, {
            previousStatus,
            newStatus: status,
            reason,
        });
        if (merchant.contactEmail &&
            (status === 'APPROVED' || status === 'REJECTED')) {
            try {
                const notificationType = status === 'APPROVED'
                    ? notification_dto_1.NotificationType.INFO
                    : notification_dto_1.NotificationType.WARNING;
                const message = status === 'APPROVED'
                    ? `Congratulations! Your merchant application for ${merchant.name} has been approved.`
                    : `Your merchant application for ${merchant.name} has been reviewed. ${reason || 'Please check your application status for more details.'}`;
                await this.notificationService.sendAll({
                    title: `Merchant Application ${status === 'APPROVED' ? 'Approved' : 'Status Update'} - Hardware World`,
                    body: message,
                    type: notificationType,
                }, [merchant.contactEmail]);
            }
            catch (error) {
                console.error('Failed to send status update notification:', error);
            }
        }
        return this.mapToMerchantProfile(updatedMerchant);
    }
    async getTeamMembers(merchantId, filters) {
        const { search, role, department, isActive, page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const where = {
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
        const teamMembers = members.map((member) => ({
            id: member.user.id,
            email: member.user.email,
            firstName: member.user.firstName,
            lastName: member.user.lastName,
            fullName: `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim(),
            jobTitle: member.jobTitle,
            department: member.department,
            role: member.role,
            permissions: member.permissions || [],
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
    async getTeamStats(merchantId) {
        const [totalMembers, activeMembers, pendingInvitations, membersByRole, membersByDepartment, recentlyJoined,] = await Promise.all([
            this.prisma.userMerchant.count({
                where: { merchantId },
            }),
            this.prisma.userMerchant.count({
                where: { merchantId, isActive: true },
            }),
            this.prisma.userMerchant.count({
                where: { merchantId, status: 'PENDING' },
            }),
            this.prisma.userMerchant.groupBy({
                by: ['role'],
                where: { merchantId },
                _count: { role: true },
            }),
            this.prisma.userMerchant.groupBy({
                by: ['department'],
                where: { merchantId, department: { not: null } },
                _count: { department: true },
            }),
            this.prisma.userMerchant.count({
                where: {
                    merchantId,
                    joinedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);
        const roleStats = {
            [team_management_dto_1.MerchantUserRole.ADMIN]: 0,
            [team_management_dto_1.MerchantUserRole.MANAGER]: 0,
            [team_management_dto_1.MerchantUserRole.USER]: 0,
        };
        membersByRole.forEach((item) => {
            roleStats[item.role] = item._count.role;
        });
        const departmentStats = {};
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
    async inviteTeamMember(merchantId, inviteDto, invitedBy) {
        let user = await this.usersService.findByEmail(inviteDto.email);
        if (!user) {
            try {
                const newUser = await this.prisma.user.create({
                    data: {
                        email: inviteDto.email,
                        firstName: inviteDto.firstName || '',
                        lastName: inviteDto.lastName || '',
                        password: 'temp_password',
                        emailVerified: false,
                        isActive: true,
                    },
                });
                user = newUser;
            }
            catch (error) {
                console.error('Failed to create user for invitation:', error);
                throw new common_1.BadRequestException('Failed to create user account for invitation');
            }
        }
        const existingMember = await this.prisma.userMerchant.findUnique({
            where: {
                userId_merchantId: {
                    userId: user.id,
                    merchantId: merchantId,
                },
            },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this merchant team');
        }
        await this.prisma.userMerchant.create({
            data: {
                userId: user.id,
                merchantId: merchantId,
                role: inviteDto.role,
                jobTitle: inviteDto.jobTitle,
                department: inviteDto.department,
                permissions: inviteDto.permissions || [],
                isActive: false,
                status: 'PENDING',
                invitedBy: invitedBy,
                invitedAt: new Date(),
            },
        });
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
    async updateTeamMember(merchantId, userId, updateDto, updatedBy) {
        const teamMember = await this.prisma.userMerchant.findUnique({
            where: {
                userId_merchantId: {
                    userId: userId,
                    merchantId: merchantId,
                },
            },
        });
        if (!teamMember) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (updateDto.role === team_management_dto_1.MerchantUserRole.ADMIN) {
            updateDto.permissions = [
                team_management_dto_1.Permission.MANAGE_PRODUCTS,
                team_management_dto_1.Permission.MANAGE_ORDERS,
                team_management_dto_1.Permission.MANAGE_PRICING,
                team_management_dto_1.Permission.VIEW_ANALYTICS,
                team_management_dto_1.Permission.MANAGE_INVENTORY,
                team_management_dto_1.Permission.MANAGE_RFQ,
                team_management_dto_1.Permission.MANAGE_FULFILLMENT,
            ];
        }
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
        await this.logMerchantAudit(merchantId, 'TEAM_MEMBER_UPDATED', {
            userId,
            updatedBy,
            changes: updateDto,
        }, updatedBy);
        return { message: 'Team member updated successfully' };
    }
    async removeTeamMember(merchantId, userId, removeDto, removedBy) {
        const teamMember = await this.prisma.userMerchant.findUnique({
            where: {
                userId_merchantId: {
                    userId: userId,
                    merchantId: merchantId,
                },
            },
        });
        if (!teamMember) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (teamMember.role === team_management_dto_1.MerchantUserRole.ADMIN) {
            const adminCount = await this.prisma.userMerchant.count({
                where: {
                    merchantId: merchantId,
                    role: team_management_dto_1.MerchantUserRole.ADMIN,
                    isActive: true,
                },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('Cannot remove the last admin from the merchant team');
            }
        }
        if (removeDto.transferToUserId) {
        }
        await this.prisma.userMerchant.delete({
            where: {
                userId_merchantId: {
                    userId: userId,
                    merchantId: merchantId,
                },
            },
        });
        await this.logMerchantAudit(merchantId, 'TEAM_MEMBER_REMOVED', {
            userId,
            removedBy,
            reason: removeDto.reason,
            transferTo: removeDto.transferToUserId,
        }, removedBy);
        return { message: 'Team member removed successfully' };
    }
    async resendInvitation(merchantId, userId, resentBy) {
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
            throw new common_1.NotFoundException('Team member not found');
        }
        if (teamMember.status !== 'PENDING') {
            throw new common_1.BadRequestException('Can only resend invitations to pending team members');
        }
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
    async logMerchantAudit(merchantId, action, details, performedBy, metadata) {
        try {
            await this.createAuditLog(merchantId, action, JSON.stringify(details), performedBy, metadata);
        }
        catch (error) {
            console.error('Failed to log merchant audit event:', error);
        }
    }
};
exports.MerchantService = MerchantService;
exports.MerchantService = MerchantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        users_service_1.UsersService,
        merchant_document_service_1.MerchantDocumentService])
], MerchantService);
//# sourceMappingURL=merchant.service.js.map