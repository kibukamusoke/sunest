import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

// Hardware World specific permission decorators
export const RequireSystemManage = () => Permissions('system:manage');
export const RequireMerchantManage = () => Permissions('merchant:manage');
export const RequireMerchantApprove = () => Permissions('merchant:approve');
export const RequireProductManage = () => Permissions('product:manage');
export const RequireOrderManage = () => Permissions('order:manage');
export const RequireRfqManage = () => Permissions('rfq:manage');
export const RequireBuyerActions = () => Permissions('buyer:actions');
