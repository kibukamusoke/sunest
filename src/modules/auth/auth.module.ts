import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController, ResetPasswordViewController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PrismaService } from '../../config/prisma.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    NotificationsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s` },
      }),
    }),
  ],
  controllers: [AuthController, ResetPasswordViewController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RolesGuard,
    PermissionsGuard,
    PrismaService,
  ],
  exports: [AuthService, RolesGuard, PermissionsGuard],
})
export class AuthModule { }