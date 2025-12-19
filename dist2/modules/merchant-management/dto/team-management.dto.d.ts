export declare enum MerchantUserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user"
}
export declare enum Permission {
    MANAGE_PRODUCTS = "manage_products",
    MANAGE_ORDERS = "manage_orders",
    MANAGE_PRICING = "manage_pricing",
    VIEW_ANALYTICS = "view_analytics",
    MANAGE_INVENTORY = "manage_inventory",
    MANAGE_RFQ = "manage_rfq",
    MANAGE_FULFILLMENT = "manage_fulfillment"
}
export declare class InviteTeamMemberDto {
    email: string;
    role: MerchantUserRole;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    department?: string;
    permissions?: Permission[];
    message?: string;
}
export declare class UpdateTeamMemberDto {
    role?: MerchantUserRole;
    jobTitle?: string;
    department?: string;
    permissions?: Permission[];
    isActive?: boolean;
}
export declare class TeamMemberDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string;
    jobTitle?: string | null;
    department?: string | null;
    role: MerchantUserRole;
    permissions: Permission[];
    isActive: boolean;
    joinedAt: Date;
    lastLoginAt?: Date | null;
    profilePictureUrl?: string | null;
}
export declare class TeamListResponseDto {
    members: TeamMemberDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class TeamMemberFilterDto {
    search?: string;
    role?: MerchantUserRole;
    department?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
export declare class TeamStatsDto {
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;
    membersByRole: Record<MerchantUserRole, number>;
    membersByDepartment: Record<string, number>;
    recentlyJoined: number;
}
export declare class RemoveTeamMemberDto {
    reason?: string;
    transferToUserId?: string;
}
