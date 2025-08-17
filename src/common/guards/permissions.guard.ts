import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            return false;
        }

        // Fetch user with roles and permissions
        const userWithPermissions = await this.prisma.user.findUnique({
            where: { id: user.userId },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!userWithPermissions) {
            return false;
        }

        // Flatten all permissions from all roles
        const userPermissions: string[] = [];
        userWithPermissions.roles.forEach(role => {
            role.permissions.forEach(permission => {
                if (!userPermissions.includes(permission.name)) {
                    userPermissions.push(permission.name);
                }
            });
        });

        return requiredPermissions.some((permission) => userPermissions.includes(permission));
    }
}
