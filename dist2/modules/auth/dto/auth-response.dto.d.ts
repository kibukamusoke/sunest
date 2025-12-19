import { User } from '../../users/user.entity';
export declare class LoginResponseDto {
    access_token: string;
    refresh_token: string;
    userId: string;
}
export declare class RefreshTokenResponseDto {
    access_token: string;
}
export declare class RegisterResponseDto extends User {
}
export declare class SuccessResponseDto {
    success: boolean;
    message?: string;
}
export declare class ProfileResponseDto extends User {
    constructor(partial: Partial<ProfileResponseDto>);
}
export declare class VerifyEmailResponseDto extends SuccessResponseDto {
}
export declare class ForgotPasswordResponseDto extends SuccessResponseDto {
}
export declare class ResetPasswordResponseDto extends SuccessResponseDto {
}
