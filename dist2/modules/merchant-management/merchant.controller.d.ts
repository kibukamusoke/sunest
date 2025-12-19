import { MerchantService } from './merchant.service';
import { MerchantDocumentService } from './merchant-document.service';
import { MerchantApplicationDto, MerchantApplicationResponseDto, CheckApplicationStatusDto } from './dto/merchant-application.dto';
import { MerchantProfileDto, UpdateMerchantProfileDto, MerchantListDto } from './dto/merchant-profile.dto';
import { MerchantApprovalDto, MerchantRejectionDto } from './dto/merchant-approval.dto';
import { CreateMerchantDocumentDto, MerchantDocumentDto as MerchantDocumentUploadDto, UpdateDocumentStatusDto, MerchantDocumentsListDto } from './dto/merchant-document.dto';
import { InviteTeamMemberDto, UpdateTeamMemberDto, TeamListResponseDto, TeamMemberFilterDto, TeamStatsDto, RemoveTeamMemberDto } from './dto/team-management.dto';
export declare class MerchantController {
    private readonly merchantService;
    private readonly merchantDocumentService;
    constructor(merchantService: MerchantService, merchantDocumentService: MerchantDocumentService);
    submitApplication(applicationDto: MerchantApplicationDto, req: any): Promise<MerchantApplicationResponseDto>;
    checkApplicationStatus(id: string): Promise<CheckApplicationStatusDto>;
    getMyApplicationStatus(req: any): Promise<CheckApplicationStatusDto>;
    updateApplication(id: string, updateData: MerchantApplicationDto): Promise<MerchantApplicationResponseDto>;
    getApplicationDocuments(merchantId: string): Promise<MerchantDocumentsListDto>;
    uploadApplicationDocument(merchantId: string, createDocumentDto: CreateMerchantDocumentDto, req: any): Promise<MerchantDocumentUploadDto>;
    deleteApplicationDocument(merchantId: string, documentId: string): Promise<{
        message: string;
    }>;
    getPendingApplications(page?: number, limit?: number, search?: string, req?: any): Promise<MerchantListDto>;
    getAllMerchants(page?: number, limit?: number, status?: string, businessType?: string, search?: string, req?: any): Promise<MerchantListDto>;
    approveMerchant(id: string, approvalDto: MerchantApprovalDto, req: any): Promise<MerchantProfileDto>;
    rejectMerchant(id: string, rejectionDto: MerchantRejectionDto, req: any): Promise<MerchantProfileDto>;
    getMerchantProfile(req: any): Promise<MerchantProfileDto>;
    updateMerchantProfile(updateDto: UpdateMerchantProfileDto, req: any): Promise<MerchantProfileDto>;
    updateMerchantById(id: string, updateDto: UpdateMerchantProfileDto, req: any): Promise<MerchantProfileDto>;
    getTeamMembers(filters: TeamMemberFilterDto, req: any): Promise<TeamListResponseDto>;
    getTeamStats(req: any): Promise<TeamStatsDto>;
    inviteTeamMember(inviteDto: InviteTeamMemberDto, req: any): Promise<{
        message: string;
    }>;
    updateTeamMember(userId: string, updateDto: UpdateTeamMemberDto, req: any): Promise<{
        message: string;
    }>;
    removeTeamMember(userId: string, removeDto: RemoveTeamMemberDto, req: any): Promise<{
        message: string;
    }>;
    resendInvitation(userId: string, req: any): Promise<{
        message: string;
    }>;
    getMerchantById(id: string): Promise<MerchantProfileDto>;
    uploadMerchantDocument(merchantId: string, createDocumentDto: CreateMerchantDocumentDto, req: any): Promise<MerchantDocumentUploadDto>;
    getMerchantDocuments(merchantId: string): Promise<MerchantDocumentsListDto>;
    updateDocumentStatus(documentId: string, updateStatusDto: UpdateDocumentStatusDto, req: any): Promise<MerchantDocumentUploadDto>;
    deleteMerchantDocument(documentId: string, req: any): Promise<void>;
    getDocumentDownloadUrl(documentId: string): Promise<{
        url: string;
        filename: string;
        expiresIn: number;
    }>;
}
