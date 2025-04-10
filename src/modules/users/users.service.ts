import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
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

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            name: true,
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
  }): Promise<User> {
    const { password, ...rest } = data;
    
    // Generate verification token if email verification is enabled
    const verifyToken = this.EMAIL_VERIFICATION_ENABLED 
      ? this.generateToken()
      : null;
    
    const user = await this.prisma.user.create({
      data: {
        ...rest,
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
      },
    });
    
    return this.mapToUserEntity(updatedUser);
  }

  async createPasswordResetToken(email: string): Promise<{ resetToken: string; user: User }> {
    const user = await this.findByEmail(email);
    
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
}