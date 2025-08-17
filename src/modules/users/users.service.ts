import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        displayName: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        verifyToken: true,
        resetToken: true,
        resetTokenExpiry: true,
        provider: true,
        providerId: true,
        refreshToken: true,
        jobTitle: true,
        department: true,
        approvalLimit: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        merchants: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }



  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        displayName: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        verifyToken: true,
        resetToken: true,
        resetTokenExpiry: true,
        provider: true,
        providerId: true,
        refreshToken: true,
        jobTitle: true,
        department: true,
        approvalLimit: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                displayName: true,
                industry: true,
              },
            },
          },
        },
        merchants: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                displayName: true,
                businessType: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async create(userData: {
    email: string;
    password: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    roles?: string[];
    jobTitle?: string;
    department?: string;
    approvalLimit?: number;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        displayName: userData.displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        emailVerified: userData.emailVerified || false,
        jobTitle: userData.jobTitle,
        department: userData.department,
        approvalLimit: userData.approvalLimit,
        roles: userData.roles ? {
          connect: userData.roles.map(roleId => ({ id: roleId }))
        } : undefined,
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        merchants: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async update(id: string, userData: {
    email?: string;
    password?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    jobTitle?: string;
    department?: string;
    approvalLimit?: number;
  }): Promise<User> {
    const updateData: any = { ...userData };

    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        merchants: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async updateRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: roleIds.map(id => ({ id }))
        }
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        merchants: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async findByVerifyToken(verifyToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { verifyToken },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }) {
    const { page = 1, limit = 20, search, status, role } = params;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // Search filter - search in email, displayName, firstName, lastName
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        where.isActive = true;
      } else if (status === 'inactive') {
        where.isActive = false;
      }
    }

    // Role filter
    if (role && role !== 'all') {
      where.roles = {
        some: {
          name: role,
        },
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          displayName: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          avatar: true,
          isActive: true,
          emailVerified: true,
          jobTitle: true,
          department: true,
          approvalLimit: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            select: {
              name: true,
              id: true,
            },
          },
          companies: {
            include: {
              company: {
                select: {
                  name: true,
                  displayName: true,
                },
              },
            },
          },
          merchants: {
            include: {
              merchant: {
                select: {
                  name: true,
                  displayName: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users: users.map(user => this.mapToUserEntity(user)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllRoles() {
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      roles,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async verifyEmail(verifyToken: string): Promise<User> {
    const foundUser = await this.prisma.user.findFirst({
      where: { verifyToken },
    });

    if (!foundUser) {
      throw new NotFoundException('Invalid verification token');
    }

    const user = await this.prisma.user.update({
      where: { id: foundUser.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async createPasswordResetToken(email: string): Promise<{ resetToken: string; user: User }> {
    const resetToken = Math.random().toString(36).substr(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    const foundUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: foundUser.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return { resetToken, user: this.mapToUserEntity(user) };
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const foundUser = await this.prisma.user.findFirst({
      where: { resetToken },
    });

    if (!foundUser) {
      throw new NotFoundException('Invalid reset token');
    }

    const user = await this.prisma.user.update({
      where: { id: foundUser.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      include: {
        roles: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async updateUserRoles(userId: string, roleIds: string[]): Promise<User> {
    return this.updateRoles(userId, roleIds);
  }

  async updateProfile(userId: string, profileData: {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
    jobTitle?: string;
    department?: string;
    idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';
    idValue?: string;
  }): Promise<User> {
    return this.update(userId, profileData);
  }

  private mapToUserEntity(user: any): User {
    return new User({
      id: user.id,
      email: user.email,
      password: user.password, // Include password for authentication
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      verifyToken: user.verifyToken,
      resetToken: user.resetToken,
      resetTokenExpiry: user.resetTokenExpiry,
      provider: user.provider,
      providerId: user.providerId,
      refreshToken: user.refreshToken,
      jobTitle: user.jobTitle,
      department: user.department,
      approvalLimit: user.approvalLimit,
      idType: user.idType,
      idValue: user.idValue,
      roles: user.roles || [],
      companies: user.companies?.map((uc: any) => ({
        id: uc.company.id,
        name: uc.company.name,
        displayName: uc.company.displayName,
        role: uc.role,
      })) || [],
      merchants: user.merchants?.map((um: any) => ({
        id: um.merchant.id,
        name: um.merchant.name,
        displayName: um.merchant.displayName,
        role: um.role,
      })) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}