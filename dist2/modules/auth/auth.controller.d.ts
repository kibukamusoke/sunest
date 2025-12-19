import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { LoginResponseDto, RefreshTokenResponseDto, RegisterResponseDto, SuccessResponseDto, ProfileResponseDto, VerifyEmailResponseDto, ForgotPasswordResponseDto, ResetPasswordResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, req: any): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto>;
    logout(req: any): Promise<SuccessResponseDto>;
    getProfile(req: any): Promise<ProfileResponseDto>;
    verifyEmail(token: string): Promise<VerifyEmailResponseDto>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponseDto>;
}
export declare class ResetPasswordViewController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    getResetPasswordPage(token: string): Promise<{
        error: boolean;
        message: string;
        token: null;
    } | {
        error: boolean;
        message: string;
        token: string;
    }>;
    submitResetPassword(body: {
        token: string;
        password: string;
        confirmPassword: string;
    }, res: Response): Promise<void>;
}
