import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  InviteTeamMemberDto,
  UpdateTeamMemberDto,
  CompanyResponseDto,
  TeamMemberDto,
  CompanyRole,
} from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    ownerId: string,
  ): Promise<CompanyResponseDto> {
    // Check if company name already exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { name: createCompanyDto.name },
    });

    if (existingCompany) {
      throw new ConflictException('Company name already exists');
    }

    // Create company and assign owner
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        creditLimit: createCompanyDto.creditLimit
          ? parseFloat(createCompanyDto.creditLimit)
          : null,
        users: {
          create: {
            userId: ownerId,
            role: CompanyRole.ADMIN,
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

  async getCompanyById(
    companyId: string,
    userId?: string,
  ): Promise<CompanyResponseDto> {
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
      throw new NotFoundException('Company not found');
    }

    // If userId provided, check if user belongs to company
    if (userId) {
      const userBelongsToCompany = company.users.some(
        (uc) => uc.userId === userId && uc.isActive,
      );
      if (!userBelongsToCompany) {
        throw new ForbiddenException('Access denied to this company');
      }
    }

    return this.mapToCompanyResponse(company);
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ): Promise<CompanyResponseDto> {
    // Check if user has admin access to company
    await this.checkCompanyAccess(companyId, userId, [CompanyRole.ADMIN]);

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

  async deleteCompany(companyId: string, userId: string): Promise<void> {
    // Check if user has admin access to company
    await this.checkCompanyAccess(companyId, userId, [CompanyRole.ADMIN]);

    // Soft delete by setting isActive to false
    await this.prisma.company.update({
      where: { id: companyId },
      data: { isActive: false },
    });
  }

  async getUserCompanies(userId: string): Promise<CompanyResponseDto[]> {
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

  async getCompanyTeam(
    companyId: string,
    userId: string,
  ): Promise<TeamMemberDto[]> {
    // Check if user has access to company
    await this.checkCompanyAccess(companyId, userId, [
      CompanyRole.ADMIN,
      CompanyRole.MANAGER,
      CompanyRole.EMPLOYEE,
      CompanyRole.VIEWER,
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

  async inviteTeamMember(
    companyId: string,
    inviteDto: InviteTeamMemberDto,
    inviterId: string,
  ): Promise<{ success: boolean; message: string; invitationId?: string }> {
    // Check if user has admin/manager access to company
    await this.checkCompanyAccess(companyId, inviterId, [
      CompanyRole.ADMIN,
      CompanyRole.MANAGER,
    ]);

    // Get company information
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
      throw new NotFoundException('Company not found');
    }

    const inviter = company.users[0]?.user;
    if (!inviter) {
      throw new NotFoundException('Inviter not found');
    }

    // Check if user is already part of the company or has pending invitation
    const existingUser = await this.prisma.user.findUnique({
      where: { email: inviteDto.email },
      include: {
        companies: {
          where: { companyId, isActive: true },
        },
      },
    });

    if (existingUser?.companies && existingUser.companies.length > 0) {
      throw new ConflictException('User is already a member of this company');
    }

    // Check for existing pending invitation
    const existingInvitation = await this.prisma.teamInvitation.findUnique({
      where: {
        email_companyId: {
          email: inviteDto.email,
          companyId: companyId,
        },
      },
    });

    if (
      existingInvitation &&
      existingInvitation.status === 'pending' &&
      existingInvitation.expiresAt > new Date()
    ) {
      throw new ConflictException(
        'A pending invitation already exists for this email',
      );
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

    // Create or update invitation
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
    } else {
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

    // Generate join link
    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
    const joinLink = `${frontendUrl}/join-company?token=${token}`;

    // Send invitation email
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
    } catch (error) {
      console.error('Error sending invitation email:', error);
      // Delete the invitation if email failed
      await this.prisma.teamInvitation.delete({ where: { id: invitation.id } });
      throw new BadRequestException(
        'Failed to send invitation email. Please try again.',
      );
    }

    return {
      success: true,
      message: `Invitation sent successfully to ${inviteDto.email}`,
      invitationId: invitation.id,
    };
  }

  async updateTeamMember(
    companyId: string,
    membershipId: string,
    updateDto: UpdateTeamMemberDto,
    updaterId: string,
  ): Promise<TeamMemberDto> {
    // Check if user has admin/manager access to company
    await this.checkCompanyAccess(companyId, updaterId, [
      CompanyRole.ADMIN,
      CompanyRole.MANAGER,
    ]);

    // Find the membership
    const membership = await this.prisma.userCompany.findFirst({
      where: {
        id: membershipId,
        companyId: companyId,
      },
    });

    if (!membership) {
      throw new NotFoundException('Team member not found');
    }

    // Prevent self-demotion from admin role
    if (
      membership.userId === updaterId &&
      membership.role === CompanyRole.ADMIN &&
      updateDto.role !== CompanyRole.ADMIN
    ) {
      throw new ForbiddenException('You cannot change your own admin role');
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

  async removeTeamMember(
    companyId: string,
    membershipId: string,
    removerId: string,
  ): Promise<void> {
    // Check if user has admin access to company
    await this.checkCompanyAccess(companyId, removerId, [CompanyRole.ADMIN]);

    // Find the membership
    const membership = await this.prisma.userCompany.findFirst({
      where: {
        id: membershipId,
        companyId: companyId,
      },
    });

    if (!membership) {
      throw new NotFoundException('Team member not found');
    }

    // Prevent self-removal if they're the only admin
    if (membership.userId === removerId) {
      const adminCount = await this.prisma.userCompany.count({
        where: {
          companyId: companyId,
          role: CompanyRole.ADMIN,
          isActive: true,
        },
      });

      if (adminCount === 1) {
        throw new ForbiddenException(
          'Cannot remove the only admin from the company',
        );
      }
    }

    // Soft delete by setting isActive to false
    await this.prisma.userCompany.update({
      where: { id: membershipId },
      data: { isActive: false },
    });
  }

  async checkCompanyAccess(
    companyId: string,
    userId: string,
    allowedRoles: CompanyRole[],
  ): Promise<void> {
    if (!userId || !companyId) {
      throw new BadRequestException('Missing userId or companyId');
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
      throw new ForbiddenException('Access denied to this company');
    }

    if (!allowedRoles.includes(membership.role as CompanyRole)) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }
  }

  async getInvitationByToken(token: string): Promise<any> {
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
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        'This invitation has already been processed',
      );
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('This invitation has expired');
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

  async acceptInvitation(
    token: string,
    userId: string,
  ): Promise<{ success: boolean; message: string; companyId: string }> {
    const invitation = await this.prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        company: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        'This invitation has already been processed',
      );
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('This invitation has expired');
    }

    // Get user information
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        companies: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user email matches invitation
    if (user.email !== invitation.email) {
      throw new BadRequestException(
        'This invitation is not for your email address',
      );
    }

    // Check if user already belongs to another company
    if (user.companies.length > 0) {
      throw new ConflictException(
        'You are already a member of another company. Please leave your current company first before joining a new one.',
      );
    }

    try {
      // Use transaction to ensure data consistency
      await this.prisma.$transaction(async (prisma) => {
        // Create team membership
        await prisma.userCompany.create({
          data: {
            userId: userId,
            companyId: invitation.companyId,
            role: invitation.role,
            isActive: true,
          },
        });

        // Update invitation status
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
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw new BadRequestException(
        'Failed to accept invitation. Please try again.',
      );
    }
  }

  async leaveCompany(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
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
                role: CompanyRole.ADMIN,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!userCompany) {
      throw new NotFoundException('You are not a member of any company');
    }

    // Prevent the only admin from leaving
    if (
      userCompany.role === CompanyRole.ADMIN &&
      userCompany.company.users.length === 1
    ) {
      throw new ForbiddenException(
        'You are the only admin of this company. Please promote another member to admin before leaving.',
      );
    }

    try {
      // Remove user from company (soft delete)
      await this.prisma.userCompany.update({
        where: { id: userCompany.id },
        data: { isActive: false },
      });

      return {
        success: true,
        message: `Successfully left ${userCompany.company.name}`,
      };
    } catch (error) {
      console.error('Error leaving company:', error);
      throw new BadRequestException(
        'Failed to leave company. Please try again.',
      );
    }
  }

  async deleteAccount(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
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
                    role: CompanyRole.ADMIN,
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
      throw new NotFoundException('User not found');
    }

    // Check if user is the only admin of any company
    for (const userCompany of user.companies) {
      if (
        userCompany.role === CompanyRole.ADMIN &&
        userCompany.company.users.length === 1
      ) {
        throw new ForbiddenException(
          'You cannot delete your account while being the only admin of a company. Please promote another member to admin first.',
        );
      }
    }

    try {
      // Use transaction to ensure data consistency
      await this.prisma.$transaction(async (prisma) => {
        // Remove user from all companies (soft delete)
        if (user.companies.length > 0) {
          await prisma.userCompany.updateMany({
            where: {
              userId: userId,
              isActive: true,
            },
            data: { isActive: false },
          });
        }

        // Soft delete user account
        await prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
        });
      });

      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new BadRequestException(
        'Failed to delete account. Please try again.',
      );
    }
  }

  async isCompanyNameAvailable(name: string): Promise<boolean> {
    const company = await this.prisma.company.findUnique({
      where: { name },
    });
    return !company;
  }

  private mapToCompanyResponse(company: any): CompanyResponseDto {
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
      teamMemberCount:
        company.users?.filter((u: any) => u.isActive)?.length || 0,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  private mapToTeamMember(membership: any): TeamMemberDto {
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
}
