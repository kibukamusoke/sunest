import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../users/user.entity';
import { ShippingAddressResponseDto } from '../../users/dto/shipping-address.dto';
import { ShippingAddress } from '@prisma/client';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refresh_token: string;
  
  @ApiProperty({ description: 'User ID' })
  userId: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;
}

export class RegisterResponseDto extends User {}

export class SuccessResponseDto {
  @ApiProperty({ description: 'Whether the operation was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Optional message', example: 'Operation completed successfully', required: false })
  message?: string;
}


export class ProfileResponseDto extends User {
  @ApiPropertyOptional({ description: 'Primary shipping address' })
  shippingAddresses?: ShippingAddress[];
  constructor(partial: Partial<ProfileResponseDto>) {
    super(partial);
  }
  
  setShippingAddresses(shippingAddresses: ShippingAddress[]) {
    this.shippingAddresses = shippingAddresses;
  }
  getShippingAddresses() {
    return this.shippingAddresses;
  }
}

export class VerifyEmailResponseDto extends SuccessResponseDto {}

export class ForgotPasswordResponseDto extends SuccessResponseDto {}

export class ResetPasswordResponseDto extends SuccessResponseDto {}