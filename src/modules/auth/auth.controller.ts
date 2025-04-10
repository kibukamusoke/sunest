import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Req, 
  Query, 
  HttpCode, 
  HttpStatus,
  Res,
  Render,
  BadRequestException,
  Redirect
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns JWT tokens' })
  async login(@Body() loginDto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.displayName,
      registerDto.avatar
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh an access token using a refresh token' })
  @ApiResponse({ status: 200, description: 'Returns a new access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(
      refreshTokenDto.userId,
      refreshTokenDto.refreshToken,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.userId);
    return user;
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password
    );
  }
}

@Controller()
export class ResetPasswordViewController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('reset-password')
  @Render('reset-password')
  @ApiExcludeEndpoint()
  async getResetPasswordPage(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Reset token is required');
    }
    
    // Verify token is valid, but don't consume it yet
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      return { 
        error: true, 
        message: 'Invalid or expired password reset token. Please request a new one.',
        token: null
      };
    }
    
    return { 
      error: false, 
      message: '',
      token 
    };
  }

  @Post('reset-password-submit')
  @ApiExcludeEndpoint()
  async submitResetPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
    @Res() res: Response
  ) {
    const { token, password, confirmPassword } = body;
    
    if (!token) {
      return res.render('reset-password', { 
        error: true, 
        message: 'Reset token is missing',
        token: null
      });
    }
    
    if (password !== confirmPassword) {
      return res.render('reset-password', { 
        error: true, 
        message: 'Passwords do not match',
        token
      });
    }
    
    if (password.length < 6) {
      return res.render('reset-password', { 
        error: true, 
        message: 'Password must be at least 6 characters long',
        token
      });
    }
    
    try {
      await this.authService.resetPassword(token, password);
      return res.render('reset-password-success');
    } catch (error) {
      return res.render('reset-password', { 
        error: true, 
        message: error.message || 'Failed to reset password. Please try again.',
        token
      });
    }
  }
}