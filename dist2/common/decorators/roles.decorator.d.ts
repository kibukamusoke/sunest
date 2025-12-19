export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const SystemAdmin: () => import("@nestjs/common").CustomDecorator<string>;
export declare const MerchantAdmin: () => import("@nestjs/common").CustomDecorator<string>;
export declare const MerchantUser: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Buyer: () => import("@nestjs/common").CustomDecorator<string>;
export declare const AnyMerchantRole: () => import("@nestjs/common").CustomDecorator<string>;
export declare const AnyRole: () => import("@nestjs/common").CustomDecorator<string>;
