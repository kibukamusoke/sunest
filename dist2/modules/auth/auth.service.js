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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const notification_service_1 = require("../notifications/notification.service");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../config/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, notificationService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.notificationService = notificationService;
        this.prisma = prisma;
        this.EMAIL_VERIFICATION_ENABLED =
            this.configService.get('EMAIL_VERIFICATION_ENABLED') === 'true';
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        if (this.EMAIL_VERIFICATION_ENABLED && !user.emailVerified) {
            throw new common_1.ForbiddenException('Email not verified. Please check your email for verification link.');
        }
        if (user.password && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION')}s`,
            }),
        ]);
        await this.usersService.updateRefreshToken(user.id, refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            userId: user.id,
        };
    }
    async refreshToken(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const payload = { email: user.email, sub: user.id };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
        });
        return {
            access_token: accessToken,
        };
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
        return { success: true };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const existingCompany = await this.prisma.company.findUnique({
            where: { name: registerDto.companyName },
        });
        if (existingCompany) {
            throw new common_1.BadRequestException('Company name already exists');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await this.usersService.create({
                email: registerDto.email,
                password: registerDto.password,
                displayName: registerDto.displayName,
                jobTitle: registerDto.jobTitle,
                phoneNumber: registerDto.phoneNumber,
            });
            const company = await tx.company.create({
                data: {
                    name: registerDto.companyName,
                    description: registerDto.companyDescription,
                    industry: registerDto.industry,
                    website: registerDto.companyWebsite,
                    isActive: true,
                    isVerified: false,
                },
            });
            await tx.userCompany.create({
                data: {
                    userId: user.id,
                    companyId: company.id,
                    role: 'admin',
                    isActive: true,
                },
            });
            const buyerRole = await tx.role.findUnique({
                where: { name: 'buyer' },
            });
            if (buyerRole) {
                await tx.user.update({
                    where: { id: user.id },
                    data: {
                        roles: {
                            connect: { id: buyerRole.id },
                        },
                    },
                });
            }
            return { user, company };
        });
        if (this.EMAIL_VERIFICATION_ENABLED && result.user.verifyToken) {
            await this.sendVerificationEmail(result.user);
        }
        const userWithRoles = await this.usersService.findById(result.user.id);
        if (!userWithRoles) {
            throw new common_1.BadRequestException('Failed to retrieve user after registration');
        }
        return userWithRoles;
    }
    async verifyEmail(token) {
        try {
            const user = await this.usersService.verifyEmail(token);
            await this.notificationService.sendWelcomeEmail(user.email, user.displayName || user.email);
            return { success: true };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
    }
    async forgotPassword(email) {
        try {
            const { resetToken, user } = await this.usersService.createPasswordResetToken(email);
            await this.notificationService.sendPasswordResetEmail(user.email, user.displayName || user.email, resetToken);
            return {
                success: true,
                message: 'If your email is registered, you will receive a password reset link',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return {
                    success: true,
                    message: 'If your email is registered, you will receive a password reset link',
                };
            }
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        try {
            await this.usersService.resetPassword(token, newPassword);
            return { success: true };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async sendVerificationEmail(user) {
        await this.notificationService.sendVerificationEmail(user.email, user.displayName || user.email, user.verifyToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        notification_service_1.NotificationService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map