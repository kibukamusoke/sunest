export declare class User {
    id: string;
    email: string;
    password?: string | null;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    avatar?: string | null;
    isActive: boolean;
    emailVerified: boolean;
    verifyToken?: string | null;
    resetToken?: string | null;
    resetTokenExpiry?: Date | null;
    provider?: string | null;
    providerId?: string | null;
    refreshToken?: string | null;
    jobTitle?: string | null;
    department?: string | null;
    approvalLimit?: number | null;
    idType?: string | null;
    idValue?: string | null;
    roles: Role[];
    companies?: UserCompany[];
    merchants?: UserMerchant[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<User>);
    get isSystemAdmin(): boolean;
    get isMerchantAdmin(): boolean;
    get isMerchantUser(): boolean;
    get isBuyer(): boolean;
    get primaryRole(): string;
    get fullName(): string;
    hasRole(roleName: string): boolean;
    getRoleNames(): string[];
    belongsToCompany(companyId: string): boolean;
    belongsToMerchant(merchantId: string): boolean;
    toPublicUser(): Omit<this, "password" | "verifyToken" | "resetToken" | "refreshToken" | "isSystemAdmin" | "isMerchantAdmin" | "isMerchantUser" | "isBuyer" | "primaryRole" | "fullName" | "hasRole" | "getRoleNames" | "belongsToCompany" | "belongsToMerchant" | "toPublicUser">;
}
export interface Role {
    id: string;
    name: string;
}
export interface UserCompany {
    id: string;
    name: string;
    displayName?: string;
    role: string;
}
export interface UserMerchant {
    id: string;
    name: string;
    displayName?: string;
    role: string;
}
