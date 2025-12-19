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
exports.ResetPasswordResponseDto = exports.ForgotPasswordResponseDto = exports.VerifyEmailResponseDto = exports.ProfileResponseDto = exports.SuccessResponseDto = exports.RegisterResponseDto = exports.RefreshTokenResponseDto = exports.LoginResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/user.entity");
class LoginResponseDto {
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT access token' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT refresh token' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "userId", void 0);
class RefreshTokenResponseDto {
}
exports.RefreshTokenResponseDto = RefreshTokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT access token' }),
    __metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "access_token", void 0);
class RegisterResponseDto extends user_entity_1.User {
}
exports.RegisterResponseDto = RegisterResponseDto;
class SuccessResponseDto {
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SuccessResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional message',
        example: 'Operation completed successfully',
        required: false,
    }),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "message", void 0);
class ProfileResponseDto extends user_entity_1.User {
    constructor(partial) {
        super(partial);
    }
}
exports.ProfileResponseDto = ProfileResponseDto;
class VerifyEmailResponseDto extends SuccessResponseDto {
}
exports.VerifyEmailResponseDto = VerifyEmailResponseDto;
class ForgotPasswordResponseDto extends SuccessResponseDto {
}
exports.ForgotPasswordResponseDto = ForgotPasswordResponseDto;
class ResetPasswordResponseDto extends SuccessResponseDto {
}
exports.ResetPasswordResponseDto = ResetPasswordResponseDto;
//# sourceMappingURL=auth-response.dto.js.map