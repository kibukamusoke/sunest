import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private notificationService;
    private prisma;
    private readonly EMAIL_VERIFICATION_ENABLED;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, notificationService: NotificationService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
        userId: any;
    }>;
    refreshToken(userId: string, refreshToken: string): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    register(registerDto: RegisterDto): Promise<import("../users/user.entity").User>;
    verifyEmail(token: string): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    private sendVerificationEmail;
}
