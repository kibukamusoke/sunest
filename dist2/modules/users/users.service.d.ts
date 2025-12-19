import { PrismaService } from '../../config/prisma.service';
import { User } from './user.entity';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(userData: {
        email: string;
        password: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        emailVerified?: boolean;
        roles?: string[];
        jobTitle?: string;
        department?: string;
        approvalLimit?: number;
    }): Promise<User>;
    update(id: string, userData: {
        email?: string;
        password?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        avatar?: string;
        isActive?: boolean;
        emailVerified?: boolean;
        jobTitle?: string;
        department?: string;
        approvalLimit?: number;
    }): Promise<User>;
    updateRoles(userId: string, roleIds: string[]): Promise<User>;
    findByResetToken(resetToken: string): Promise<User | null>;
    findByVerifyToken(verifyToken: string): Promise<User | null>;
    getAllUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        role?: string;
    }): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    deleteUser(id: string): Promise<void>;
    getAllRoles(): Promise<{
        roles: {
            description: string | null;
            id: string;
            name: string;
        }[];
    }>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    verifyEmail(verifyToken: string): Promise<User>;
    createPasswordResetToken(email: string): Promise<{
        resetToken: string;
        user: User;
    }>;
    resetPassword(resetToken: string, newPassword: string): Promise<User>;
    updateUserRoles(userId: string, roleIds: string[]): Promise<User>;
    updateProfile(userId: string, profileData: {
        displayName?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        avatar?: string;
        jobTitle?: string;
        department?: string;
        idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';
        idValue?: string;
    }): Promise<User>;
    private mapToUserEntity;
}
