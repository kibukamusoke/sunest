import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Use roles from JWT payload if available, otherwise fetch from database
    let userRoles: string[] = [];

    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // Use roles from JWT payload
      userRoles = user.roles;
    } else {
      // Fallback to database query
      const userWithRoles = await this.prisma.user.findUnique({
        where: { id: user.userId },
        include: {
          roles: true,
        },
      });

      if (!userWithRoles) {
        return false;
      }

      userRoles = userWithRoles.roles.map((role) => role.name);
    }

    // Check if user has required role
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (hasRequiredRole) {
      return true;
    }

    // Special case: If 'buyer' role is required, also check if user is associated with a company
    // Users with company associations can act as buyers
    if (requiredRoles.includes('buyer')) {
      // Check if user has companies in JWT payload
      if (
        user.companies &&
        Array.isArray(user.companies) &&
        user.companies.length > 0
      ) {
        return true;
      }

      // Fallback: Check database for company association
      const userWithCompanies = await this.prisma.user.findUnique({
        where: { id: user.userId },
        include: {
          companies: {
            where: {
              isActive: true,
            },
          },
        },
      });

      if (userWithCompanies && userWithCompanies.companies.length > 0) {
        return true;
      }
    }

    return false;
  }
}
