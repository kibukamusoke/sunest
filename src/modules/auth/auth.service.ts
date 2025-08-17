import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly EMAIL_VERIFICATION_ENABLED: boolean;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {
    this.EMAIL_VERIFICATION_ENABLED = this.configService.get<string>('EMAIL_VERIFICATION_ENABLED') === 'true';
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Check if email verification is enabled and user's email is not verified
    if (this.EMAIL_VERIFICATION_ENABLED && !user.emailVerified) {
      throw new ForbiddenException('Email not verified. Please check your email for verification link.');
    }

    // Password verification
    if (user.password && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get<number>('JWT_EXPIRATION')}s`,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get<number>('JWT_REFRESH_EXPIRATION')}s`,
      }),
    ]);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      userId: user.id,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: user.email, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: `${this.configService.get<number>('JWT_EXPIRATION')}s`,
    });

    return {
      access_token: accessToken,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { success: true };
  }

  async register(email: string, password: string, displayName?: string) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Create user with required appId
    const user = await this.usersService.create({
      email,
      password,
      displayName,
      // No appId needed in single-tenant system
    });

    // Send verification email if verification is enabled
    if (this.EMAIL_VERIFICATION_ENABLED && user.verifyToken) {
      await this.sendVerificationEmail(user);
    }

    // Return user info (the User entity will handle password exclusion)
    return user;
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.usersService.verifyEmail(token);

      // Send welcome email after verification
      await this.notificationService.sendWelcomeEmail(
        user.email,
        user.displayName || user.email
      );

      return { success: true };
    } catch (error) {
      throw new BadRequestException('Invalid verification token');
    }
  }

  async forgotPassword(email: string) {
    try {
      // Generate password reset token and get user
      const { resetToken, user } = await this.usersService.createPasswordResetToken(email);

      // Send password reset email
      await this.notificationService.sendPasswordResetEmail(
        user.email,
        user.displayName || user.email,
        resetToken
      );

      return { success: true, message: 'If your email is registered, you will receive a password reset link' };
    } catch (error) {
      // Return success even if user not found to prevent email enumeration attacks
      if (error instanceof NotFoundException) {
        return { success: true, message: 'If your email is registered, you will receive a password reset link' };
      }
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      await this.usersService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  private async sendVerificationEmail(user: any) {
    await this.notificationService.sendVerificationEmail(
      user.email,
      user.displayName || user.email,
      user.verifyToken
    );
  }
}