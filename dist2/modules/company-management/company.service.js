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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const notification_service_1 = require("../notifications/notification.service");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const company_dto_1 = require("./dto/company.dto");
let CompanyService = class CompanyService {
    constructor(prisma, notificationService, configService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.configService = configService;
    }
    async createCompany(createCompanyDto, ownerId) {
        const existingCompany = await this.prisma.company.findUnique({
            where: { name: createCompanyDto.name },
        });
        if (existingCompany) {
            throw new common_1.ConflictException('Company name already exists');
        }
        const company = await this.prisma.company.create({
            data: {
                ...createCompanyDto,
                creditLimit: createCompanyDto.creditLimit
                    ? parseFloat(createCompanyDto.creditLimit)
                    : null,
                users: {
                    create: {
                        userId: ownerId,
                        role: company_dto_1.CompanyRole.ADMIN,
                        isActive: true,
                    },
                },
            },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true,
                                jobTitle: true,
                                department: true,
                                lastLoginAt: true,
                            },
                        },
                    },
                },
            },
        });
        return this.mapToCompanyResponse(company);
    }
    async getCompanyById(companyId, userId) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true,
                                jobTitle: true,
                                department: true,
                                lastLoginAt: true,
                            },
                        },
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        if (userId) {
            const userBelongsToCompany = company.users.some((uc) => uc.userId === userId && uc.isActive);
            if (!userBelongsToCompany) {
                throw new common_1.ForbiddenException('Access denied to this company');
            }
        }
        return this.mapToCompanyResponse(company);
    }
    async updateCompany(companyId, updateCompanyDto, userId) {
        await this.checkCompanyAccess(companyId, userId, [company_dto_1.CompanyRole.ADMIN]);
        const company = await this.prisma.company.update({
            where: { id: companyId },
            data: {
                ...updateCompanyDto,
                creditLimit: updateCompanyDto.creditLimit
                    ? parseFloat(updateCompanyDto.creditLimit)
                    : undefined,
            },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                displayName: true,
                                jobTitle: true,
                                department: true,
                                lastLoginAt: true,
                            },
                        },
                    },
                },
            },
        });
        return this.mapToCompanyResponse(company);
    }
    async deleteCompany(companyId, userId) {
        await this.checkCompanyAccess(companyId, userId, [company_dto_1.CompanyRole.ADMIN]);
        await this.prisma.company.update({
            where: { id: companyId },
            data: { isActive: false },
        });
    }
    async getUserCompanies(userId) {
        const userCompanies = await this.prisma.userCompany.findMany({
            where: {
                userId: userId,
                isActive: true,
                company: { isActive: true },
            },
            include: {
                company: {
                    include: {
                        users: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        displayName: true,
                                        jobTitle: true,
                                        department: true,
                                        lastLoginAt: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return userCompanies.map((uc) => this.mapToCompanyResponse(uc.company));
    }
    async getCompanyTeam(companyId, userId) {
        await this.checkCompanyAccess(companyId, userId, [
            company_dto_1.CompanyRole.ADMIN,
            company_dto_1.CompanyRole.MANAGER,
            company_dto_1.CompanyRole.EMPLOYEE,
            company_dto_1.CompanyRole.VIEWER,
        ]);
        const teamMembers = await this.prisma.userCompany.findMany({
            where: {
                companyId: companyId,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        jobTitle: true,
                        department: true,
                        lastLoginAt: true,
                    },
                },
            },
            orderBy: { joinedAt: 'asc' },
        });
        return teamMembers.map((tm) => ({
            id: tm.id,
            userId: tm.userId,
            name: tm.user.displayName || tm.user.email,
            email: tm.user.email,
            jobTitle: tm.user.jobTitle || undefined,
            department: tm.user.department || undefined,
            role: tm.role,
            isActive: tm.isActive,
            joinedAt: tm.joinedAt,
            lastLoginAt: tm.user.lastLoginAt || undefined,
        }));
    }
    async inviteTeamMember(companyId, inviteDto, inviterId) {
        await this.checkCompanyAccess(companyId, inviterId, [
            company_dto_1.CompanyRole.ADMIN,
            company_dto_1.CompanyRole.MANAGER,
        ]);
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                users: {
                    where: { userId: inviterId },
                    include: {
                        user: {
                            select: { displayName: true, email: true },
                        },
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const inviter = company.users[0]?.user;
        if (!inviter) {
            throw new common_1.NotFoundException('Inviter not found');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: inviteDto.email },
            include: {
                companies: {
                    where: { companyId, isActive: true },
                },
            },
        });
        if (existingUser?.companies && existingUser.companies.length > 0) {
            throw new common_1.ConflictException('User is already a member of this company');
        }
        const existingInvitation = await this.prisma.teamInvitation.findUnique({
            where: {
                email_companyId: {
                    email: inviteDto.email,
                    companyId: companyId,
                },
            },
        });
        if (existingInvitation &&
            existingInvitation.status === 'pending' &&
            existingInvitation.expiresAt > new Date()) {
            throw new common_1.ConflictException('A pending invitation already exists for this email');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        let invitation;
        if (existingInvitation) {
            invitation = await this.prisma.teamInvitation.update({
                where: { id: existingInvitation.id },
                data: {
                    token,
                    role: inviteDto.role,
                    message: inviteDto.message,
                    status: 'pending',
                    expiresAt,
                    invitedById: inviterId,
                },
            });
        }
        else {
            invitation = await this.prisma.teamInvitation.create({
                data: {
                    token,
                    email: inviteDto.email,
                    companyId,
                    invitedById: inviterId,
                    role: inviteDto.role,
                    message: inviteDto.message,
                    expiresAt,
                },
            });
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const joinLink = `${frontendUrl}/join-company?token=${token}`;
        try {
            const emailSent = await this.notificationService.sendEmail({
                to: [{ email: inviteDto.email }],
                subject: `${inviter.displayName || inviter.email} invited you to join ${company.name}`,
                text: `You have been invited to join ${company.name} as a ${inviteDto.role}. Click the link to accept: ${joinLink}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Team Invitation</h2>
            <p>Hi there,</p>
            <p><strong>${inviter.displayName || inviter.email}</strong> has invited you to join <strong>${company.name}</strong> as a <strong>${inviteDto.role}</strong>.</p>
            ${inviteDto.message ? `<blockquote style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;"><p><em>"${inviteDto.message}"</em></p></blockquote>` : ''}
            <div style="margin: 30px 0;">
              <a href="${joinLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This invitation will expire in 7 days. If you already have an account with another company, you'll need to leave that company first before joining this one.
            </p>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser: <br>
              <a href="${joinLink}" style="color: #007bff;">${joinLink}</a>
            </p>
          </div>
        `,
            });
            if (!emailSent) {
                throw new Error('Failed to send invitation email');
            }
        }
        catch (error) {
            console.error('Error sending invitation email:', error);
            await this.prisma.teamInvitation.delete({ where: { id: invitation.id } });
            throw new common_1.BadRequestException('Failed to send invitation email. Please try again.');
        }
        return {
            success: true,
            message: `Invitation sent successfully to ${inviteDto.email}`,
            invitationId: invitation.id,
        };
    }
    async updateTeamMember(companyId, membershipId, updateDto, updaterId) {
        await this.checkCompanyAccess(companyId, updaterId, [
            company_dto_1.CompanyRole.ADMIN,
            company_dto_1.CompanyRole.MANAGER,
        ]);
        const membership = await this.prisma.userCompany.findFirst({
            where: {
                id: membershipId,
                companyId: companyId,
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (membership.userId === updaterId &&
            membership.role === company_dto_1.CompanyRole.ADMIN &&
            updateDto.role !== company_dto_1.CompanyRole.ADMIN) {
            throw new common_1.ForbiddenException('You cannot change your own admin role');
        }
        const updatedMembership = await this.prisma.userCompany.update({
            where: { id: membershipId },
            data: updateDto,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        jobTitle: true,
                        department: true,
                        lastLoginAt: true,
                    },
                },
            },
        });
        return this.mapToTeamMember(updatedMembership);
    }
    async removeTeamMember(companyId, membershipId, removerId) {
        await this.checkCompanyAccess(companyId, removerId, [company_dto_1.CompanyRole.ADMIN]);
        const membership = await this.prisma.userCompany.findFirst({
            where: {
                id: membershipId,
                companyId: companyId,
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (membership.userId === removerId) {
            const adminCount = await this.prisma.userCompany.count({
                where: {
                    companyId: companyId,
                    role: company_dto_1.CompanyRole.ADMIN,
                    isActive: true,
                },
            });
            if (adminCount === 1) {
                throw new common_1.ForbiddenException('Cannot remove the only admin from the company');
            }
        }
        await this.prisma.userCompany.update({
            where: { id: membershipId },
            data: { isActive: false },
        });
    }
    async checkCompanyAccess(companyId, userId, allowedRoles) {
        if (!userId || !companyId) {
            throw new common_1.BadRequestException('Missing userId or companyId');
        }
        const membership = await this.prisma.userCompany.findUnique({
            where: {
                userId_companyId: {
                    userId: userId,
                    companyId: companyId,
                },
            },
        });
        if (!membership || !membership.isActive) {
            throw new common_1.ForbiddenException('Access denied to this company');
        }
        if (!allowedRoles.includes(membership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions for this action');
        }
    }
    async getInvitationByToken(token) {
        const invitation = await this.prisma.teamInvitation.findUnique({
            where: { token },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        logoUrl: true,
                    },
                },
                invitedBy: {
                    select: {
                        displayName: true,
                        email: true,
                    },
                },
            },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException('This invitation has already been processed');
        }
        if (invitation.expiresAt < new Date()) {
            throw new common_1.BadRequestException('This invitation has expired');
        }
        return {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            message: invitation.message,
            company: invitation.company,
            invitedBy: invitation.invitedBy,
            expiresAt: invitation.expiresAt,
        };
    }
    async acceptInvitation(token, userId) {
        const invitation = await this.prisma.teamInvitation.findUnique({
            where: { token },
            include: {
                company: true,
            },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException('This invitation has already been processed');
        }
        if (invitation.expiresAt < new Date()) {
            throw new common_1.BadRequestException('This invitation has expired');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                companies: {
                    where: { isActive: true },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.email !== invitation.email) {
            throw new common_1.BadRequestException('This invitation is not for your email address');
        }
        if (user.companies.length > 0) {
            throw new common_1.ConflictException('You are already a member of another company. Please leave your current company first before joining a new one.');
        }
        try {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.userCompany.create({
                    data: {
                        userId: userId,
                        companyId: invitation.companyId,
                        role: invitation.role,
                        isActive: true,
                    },
                });
                await prisma.teamInvitation.update({
                    where: { id: invitation.id },
                    data: {
                        status: 'accepted',
                        acceptedAt: new Date(),
                    },
                });
            });
            return {
                success: true,
                message: `Successfully joined ${invitation.company.name}`,
                companyId: invitation.companyId,
            };
        }
        catch (error) {
            console.error('Error accepting invitation:', error);
            throw new common_1.BadRequestException('Failed to accept invitation. Please try again.');
        }
    }
    async leaveCompany(userId) {
        const userCompany = await this.prisma.userCompany.findFirst({
            where: {
                userId: userId,
                isActive: true,
            },
            include: {
                company: {
                    select: {
                        name: true,
                        users: {
                            where: {
                                role: company_dto_1.CompanyRole.ADMIN,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
        if (!userCompany) {
            throw new common_1.NotFoundException('You are not a member of any company');
        }
        if (userCompany.role === company_dto_1.CompanyRole.ADMIN &&
            userCompany.company.users.length === 1) {
            throw new common_1.ForbiddenException('You are the only admin of this company. Please promote another member to admin before leaving.');
        }
        try {
            await this.prisma.userCompany.update({
                where: { id: userCompany.id },
                data: { isActive: false },
            });
            return {
                success: true,
                message: `Successfully left ${userCompany.company.name}`,
            };
        }
        catch (error) {
            console.error('Error leaving company:', error);
            throw new common_1.BadRequestException('Failed to leave company. Please try again.');
        }
    }
    async deleteAccount(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                companies: {
                    where: { isActive: true },
                    include: {
                        company: {
                            select: {
                                users: {
                                    where: {
                                        role: company_dto_1.CompanyRole.ADMIN,
                                        isActive: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        for (const userCompany of user.companies) {
            if (userCompany.role === company_dto_1.CompanyRole.ADMIN &&
                userCompany.company.users.length === 1) {
                throw new common_1.ForbiddenException('You cannot delete your account while being the only admin of a company. Please promote another member to admin first.');
            }
        }
        try {
            await this.prisma.$transaction(async (prisma) => {
                if (user.companies.length > 0) {
                    await prisma.userCompany.updateMany({
                        where: {
                            userId: userId,
                            isActive: true,
                        },
                        data: { isActive: false },
                    });
                }
                await prisma.user.update({
                    where: { id: userId },
                    data: { isActive: false },
                });
            });
            return {
                success: true,
                message: 'Account deleted successfully',
            };
        }
        catch (error) {
            console.error('Error deleting account:', error);
            throw new common_1.BadRequestException('Failed to delete account. Please try again.');
        }
    }
    async isCompanyNameAvailable(name) {
        const company = await this.prisma.company.findUnique({
            where: { name },
        });
        return !company;
    }
    mapToCompanyResponse(company) {
        return {
            id: company.id,
            name: company.name,
            displayName: company.displayName,
            description: company.description,
            industry: company.industry,
            website: company.website,
            logoUrl: company.logoUrl,
            companyEmail: company.companyEmail,
            companyPhone: company.companyPhone,
            addressLine1: company.addressLine1,
            addressLine2: company.addressLine2,
            city: company.city,
            state: company.state,
            postalCode: company.postalCode,
            country: company.country,
            taxId: company.taxId,
            registrationNumber: company.registrationNumber,
            sstNumber: company.sstNumber,
            idType: company.idType,
            idValue: company.idValue,
            creditLimit: company.creditLimit?.toString(),
            paymentTerms: company.paymentTerms,
            isActive: company.isActive,
            isVerified: company.isVerified,
            verificationNotes: company.verificationNotes,
            teamMemberCount: company.users?.filter((u) => u.isActive)?.length || 0,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        };
    }
    mapToTeamMember(membership) {
        return {
            id: membership.id,
            userId: membership.userId,
            name: membership.user.displayName || membership.user.email,
            email: membership.user.email,
            jobTitle: membership.user.jobTitle || undefined,
            department: membership.user.department || undefined,
            role: membership.role,
            isActive: membership.isActive,
            joinedAt: membership.joinedAt,
            lastLoginAt: membership.user.lastLoginAt || undefined,
        };
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], CompanyService);
//# sourceMappingURL=company.service.js.map