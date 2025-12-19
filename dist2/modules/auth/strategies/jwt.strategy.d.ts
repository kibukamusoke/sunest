import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        userId: string;
        email: string;
        roles: string[];
        permissions: string[];
        companies: {
            id: string;
            name: string;
            role: string;
        }[];
        merchants: {
            id: string;
            name: string;
            role: string;
            permissions: {
                canManageProducts: boolean;
                canManageOrders: boolean;
                canManagePricing: boolean;
                canViewAnalytics: boolean;
            };
        }[];
    } | null>;
}
export {};
