import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { UsersService } from '../users/users.service';
import { MerchantDocumentService } from './merchant-document.service';
import { MerchantApplicationDto, MerchantApplicationResponseDto, CheckApplicationStatusDto } from './dto/merchant-application.dto';
import { MerchantProfileDto, UpdateMerchantProfileDto, MerchantListDto } from './dto/merchant-profile.dto';
import { InviteTeamMemberDto, UpdateTeamMemberDto, TeamListResponseDto, TeamMemberFilterDto, TeamStatsDto, RemoveTeamMemberDto } from './dto/team-management.dto';
import { MerchantApprovalDto, MerchantRejectionDto } from './dto/merchant-approval.dto';
export declare class MerchantService {
    private prisma;
    private notificationService;
    private usersService;
    private merchantDocumentService;
    constructor(prisma: PrismaService, notificationService: NotificationService, usersService: UsersService, merchantDocumentService: MerchantDocumentService);
    submitApplication(applicationData: MerchantApplicationDto): Promise<MerchantApplicationResponseDto>;
    getMyApplicationStatus(userId: string): Promise<CheckApplicationStatusDto>;
    checkApplicationStatus(merchantId: string): Promise<CheckApplicationStatusDto>;
    updateApplication(merchantId: string, updateData: MerchantApplicationDto): Promise<MerchantApplicationResponseDto>;
    getMerchants(params: {
        page?: number;
        limit?: number;
        status?: string;
        businessType?: string;
        search?: string;
    }): Promise<MerchantListDto>;
    approveMerchant(merchantId: string, approvalData: MerchantApprovalDto, adminUserId: string): Promise<MerchantProfileDto>;
    rejectMerchant(merchantId: string, rejectionData: MerchantRejectionDto, adminUserId: string): Promise<MerchantProfileDto>;
    getMerchantProfile(merchantId: string): Promise<MerchantProfileDto>;
    updateMerchantProfile(merchantId: string, updateData: UpdateMerchantProfileDto, userId: string): Promise<MerchantProfileDto>;
    private createAuditLog;
    private mapToMerchantProfile;
    updateMerchantStatus(merchantId: string, status: string, adminUserId: string, reason?: string): Promise<MerchantProfileDto>;
    getTeamMembers(merchantId: string, filters: TeamMemberFilterDto): Promise<TeamListResponseDto>;
    getTeamStats(merchantId: string): Promise<TeamStatsDto>;
    inviteTeamMember(merchantId: string, inviteDto: InviteTeamMemberDto, invitedBy: string): Promise<{
        message: string;
    }>;
    updateTeamMember(merchantId: string, userId: string, updateDto: UpdateTeamMemberDto, updatedBy: string): Promise<{
        message: string;
    }>;
    removeTeamMember(merchantId: string, userId: string, removeDto: RemoveTeamMemberDto, removedBy: string): Promise<{
        message: string;
    }>;
    resendInvitation(merchantId: string, userId: string, resentBy: string): Promise<{
        message: string;
    }>;
    private logMerchantAudit;
}
