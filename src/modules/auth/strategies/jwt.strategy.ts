import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = configService.get<string>('JWT_SECRET');

    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in the environment');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any) {
    // Fetch user with roles, companies, and merchants for context
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
        companies: {
          include: {
            company: true,
          },
          where: {
            isActive: true,
          },
        },
        merchants: {
          include: {
            merchant: true,
          },
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Return enhanced user context
    return {
      userId: user.id,
      email: user.email,
      roles: user.roles?.map(role => role.name) || [],
      permissions: user.roles?.flatMap(role => role.permissions.map(p => p.name)) || [],
      companies: user.companies?.map(uc => ({
        id: uc.company.id,
        name: uc.company.name,
        role: uc.role,
      })) || [],
      merchants: user.merchants?.map(um => ({
        id: um.merchant.id,
        name: um.merchant.name,
        role: um.role,
        permissions: {
          canManageProducts: um.canManageProducts,
          canManageOrders: um.canManageOrders,
          canManagePricing: um.canManagePricing,
          canViewAnalytics: um.canViewAnalytics,
        },
      })) || [],
    };
  }
}