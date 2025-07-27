import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly EMAIL_VERIFICATION_ENABLED: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.EMAIL_VERIFICATION_ENABLED = this.configService.get<string>('EMAIL_VERIFICATION_ENABLED') === 'true';
  }

  // Helper method to get default app ID for backward compatibility
  private async getDefaultAppId(): Promise<string> {
    const defaultApp = await this.prisma.app.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    if (!defaultApp) {
      throw new Error('No active app found. Please create an app first.');
    }
    return defaultApp.id;
  }

  async findByEmail(email: string, appId?: string): Promise<User | null> {
    // Get appId or use default
    const targetAppId = appId || await this.getDefaultAppId();

    const user = await this.prisma.user.findUnique({
      where: {
        email_appId: {
          email: email,
          appId: targetAppId
        }
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
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
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async findByVerifyToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { verifyToken: token },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date()
        }
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) return null;

    return this.mapToUserEntity(user);
  }

  async create(data: {
    email: string;
    password?: string;
    displayName?: string;
    avatar?: string;
    provider?: string;
    providerId?: string;
    appId?: string; // Optional for backward compatibility
  }): Promise<User> {
    const { password, appId, ...rest } = data;

    // Get appId or use default
    const targetAppId = appId || await this.getDefaultAppId();

    // Generate verification token if email verification is enabled
    const verifyToken = this.EMAIL_VERIFICATION_ENABLED
      ? this.generateToken()
      : null;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        appId: targetAppId,
        password: password ? await this.hashPassword(password) : null,
        verifyToken,
        emailVerified: !this.EMAIL_VERIFICATION_ENABLED, // auto-verify if disabled
        roles: {
          connect: [{ name: 'user' }], // default role
        },
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    return this.mapToUserEntity(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: refreshToken ? await this.hashPassword(refreshToken) : null,
      },
    });
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.findByVerifyToken(token);

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    return this.mapToUserEntity(updatedUser);
  }

  async createPasswordResetToken(email: string, appId?: string): Promise<{ resetToken: string; user: User }> {
    const user = await this.findByEmail(email, appId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate password reset token
    const resetToken = this.generateToken();

    // Set expiration time (1 hour from now)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Update user with reset token
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
    });

    return {
      resetToken,
      user: this.mapToUserEntity(updatedUser)
    };
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<User> {
    const user = await this.findByResetToken(resetToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user with new password and clear the reset token
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToUserEntity(updatedUser);
  }

  async updateProfile(userId: string, data: { displayName?: string; avatar?: string }): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToUserEntity(updatedUser);
  }

  async updateUserRoles(userId: string, roles: string[]): Promise<User> {
    // Validate that the user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate roles exist in the database
    const validRoles = await this.prisma.role.findMany({
      where: {
        name: {
          in: roles,
        },
      },
    });

    if (validRoles.length !== roles.length) {
      const validRoleNames = validRoles.map(r => r.name);
      const invalidRoles = roles.filter(role => !validRoleNames.includes(role));
      throw new BadRequestException(`Invalid roles: ${invalidRoles.join(', ')}`);
    }

    // Update user roles
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: [], // Clear existing roles
          connect: roles.map(roleName => ({ name: roleName })),
        },
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToUserEntity(updatedUser);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private mapToUserEntity(user: any): User {
    return new User({
      ...user,
      roles: user.roles.map(role => role.name),
    });
  }

  async getAllUsers(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    role?: string;
    appId?: string;
  }) {
    const { page, limit, search, status, role, appId } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Filter by app ID if provided, otherwise use default app
    // Admin users are not filtered by appId (they can access all apps)
    if (appId) {
      where.OR = [
        { appId: appId },
        {
          roles: {
            some: {
              name: 'admin'
            }
          }
        }
      ];
    } else {
      const defaultAppId = await this.getDefaultAppId();
      where.OR = [
        { appId: defaultAppId },
        {
          roles: {
            some: {
              name: 'admin'
            }
          }
        }
      ];
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      where.isActive = status === 'active';
    }

    // Search by email or display name
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by role if provided
    if (role && role !== 'all') {
      where.roles = {
        some: {
          name: role
        }
      };
    }

    // Get total count
    const total = await this.prisma.user.count({ where });

    // Get users with pagination
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ['ACTIVE', 'TRIALING'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            stripePriceId: true,
            currentPeriodEnd: true,
          },
        },
        devices: {
          select: {
            id: true,
            platform: true,
            serverCount: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedUsers = users.map(user => ({
      ...this.mapToUserEntity(user),
      subscription: user.subscriptions[0] || null,
      devices: user.devices || [],
    }));

    const pages = Math.ceil(total / limit);

    return {
      users: mappedUsers,
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }
}