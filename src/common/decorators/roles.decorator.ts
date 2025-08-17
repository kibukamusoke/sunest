import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Hardware World specific role decorators
export const SystemAdmin = () => Roles('system_admin');
export const MerchantAdmin = () => Roles('merchant_admin');
export const MerchantUser = () => Roles('merchant_user', 'merchant_admin');
export const Buyer = () => Roles('buyer');
export const AnyMerchantRole = () => Roles('merchant_admin', 'merchant_user');
export const AnyRole = () => Roles('system_admin', 'merchant_admin', 'merchant_user', 'buyer');
