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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordViewController = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("../../common/guards/local-auth.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const users_service_1 = require("../users/users.service");
const auth_response_dto_1 = require("./dto/auth-response.dto");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(loginDto, req) {
        return this.authService.login(req.user);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.userId, refreshTokenDto.refreshToken);
    }
    async logout(req) {
        return this.authService.logout(req.user.userId);
    }
    async getProfile(req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const profileResponseDto = new auth_response_dto_1.ProfileResponseDto({
            ...user,
        });
        return profileResponseDto;
    }
    async verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT tokens',
        type: auth_response_dto_1.LoginResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user with company' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User and company created successfully',
        type: auth_response_dto_1.RegisterResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh an access token using a refresh token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a new access token',
        type: auth_response_dto_1.RefreshTokenResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout the current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful',
        type: auth_response_dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user profile',
        type: auth_response_dto_1.ProfileResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user email address' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email verified successfully',
        type: auth_response_dto_1.VerifyEmailResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid verification token' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request a password reset' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent',
        type: auth_response_dto_1.ForgotPasswordResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successful',
        type: auth_response_dto_1.ResetPasswordResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
let ResetPasswordViewController = class ResetPasswordViewController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async getResetPasswordPage(token) {
        if (!token) {
            throw new common_1.BadRequestException('Reset token is required');
        }
        const user = await this.usersService.findByResetToken(token);
        if (!user) {
            return {
                error: true,
                message: 'Invalid or expired password reset token. Please request a new one.',
                token: null,
            };
        }
        return {
            error: false,
            message: '',
            token,
        };
    }
    async submitResetPassword(body, res) {
        const { token, password, confirmPassword } = body;
        if (!token) {
            return res.render('reset-password', {
                error: true,
                message: 'Reset token is missing',
                token: null,
            });
        }
        if (password !== confirmPassword) {
            return res.render('reset-password', {
                error: true,
                message: 'Passwords do not match',
                token,
            });
        }
        if (password.length < 6) {
            return res.render('reset-password', {
                error: true,
                message: 'Password must be at least 6 characters long',
                token,
            });
        }
        try {
            await this.authService.resetPassword(token, password);
            return res.render('reset-password-success');
        }
        catch (error) {
            return res.render('reset-password', {
                error: true,
                message: error.message || 'Failed to reset password. Please try again.',
                token,
            });
        }
    }
};
exports.ResetPasswordViewController = ResetPasswordViewController;
__decorate([
    (0, common_1.Get)('reset-password'),
    (0, common_1.Render)('reset-password'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResetPasswordViewController.prototype, "getResetPasswordPage", null);
__decorate([
    (0, common_1.Post)('reset-password-submit'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResetPasswordViewController.prototype, "submitResetPassword", null);
exports.ResetPasswordViewController = ResetPasswordViewController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], ResetPasswordViewController);
//# sourceMappingURL=auth.controller.js.map