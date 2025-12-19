import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto, InviteTeamMemberDto, UpdateTeamMemberDto, CompanyResponseDto, TeamMemberDto, TeamListDto } from './dto/company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    createCompany(createCompanyDto: CreateCompanyDto, req: any): Promise<CompanyResponseDto>;
    getUserCompanies(req: any): Promise<CompanyResponseDto[]>;
    getCompanyById(companyId: string, req: any): Promise<CompanyResponseDto>;
    updateCompany(companyId: string, updateCompanyDto: UpdateCompanyDto, req: any): Promise<CompanyResponseDto>;
    deleteCompany(companyId: string, req: any): Promise<void>;
    getCompanyTeam(companyId: string, req: any): Promise<TeamListDto>;
    inviteTeamMember(companyId: string, inviteDto: InviteTeamMemberDto, req: any): Promise<{
        success: boolean;
        message: string;
        invitationId?: string;
    }>;
    updateTeamMember(companyId: string, membershipId: string, updateDto: UpdateTeamMemberDto, req: any): Promise<TeamMemberDto>;
    removeTeamMember(companyId: string, membershipId: string, req: any): Promise<void>;
    checkCompanyNameAvailability(companyName: string): Promise<{
        available: boolean;
        message: string;
    }>;
    acceptInvitation(token: string, req: any): Promise<{
        success: boolean;
        message: string;
        companyId: string;
    }>;
    leaveCompany(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAccount(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
