import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            return false;
        }

        // Fetch user with roles to ensure we have the latest role information
        const userWithRoles = await this.prisma.user.findUnique({
            where: { id: user.userId },
            include: {
                roles: true,
            },
        });

        if (!userWithRoles) {
            return false;
        }

        const userRoles = userWithRoles.roles.map(role => role.name);

        return requiredRoles.some((role) => userRoles.includes(role));
    }
}
