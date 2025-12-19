import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { ConfigService } from '@nestjs/config';
import { CreateCompanyDto, UpdateCompanyDto, InviteTeamMemberDto, UpdateTeamMemberDto, CompanyResponseDto, TeamMemberDto, CompanyRole } from './dto/company.dto';
export declare class CompanyService {
    private prisma;
    private notificationService;
    private configService;
    constructor(prisma: PrismaService, notificationService: NotificationService, configService: ConfigService);
    createCompany(createCompanyDto: CreateCompanyDto, ownerId: string): Promise<CompanyResponseDto>;
    getCompanyById(companyId: string, userId?: string): Promise<CompanyResponseDto>;
    updateCompany(companyId: string, updateCompanyDto: UpdateCompanyDto, userId: string): Promise<CompanyResponseDto>;
    deleteCompany(companyId: string, userId: string): Promise<void>;
    getUserCompanies(userId: string): Promise<CompanyResponseDto[]>;
    getCompanyTeam(companyId: string, userId: string): Promise<TeamMemberDto[]>;
    inviteTeamMember(companyId: string, inviteDto: InviteTeamMemberDto, inviterId: string): Promise<{
        success: boolean;
        message: string;
        invitationId?: string;
    }>;
    updateTeamMember(companyId: string, membershipId: string, updateDto: UpdateTeamMemberDto, updaterId: string): Promise<TeamMemberDto>;
    removeTeamMember(companyId: string, membershipId: string, removerId: string): Promise<void>;
    checkCompanyAccess(companyId: string, userId: string, allowedRoles: CompanyRole[]): Promise<void>;
    getInvitationByToken(token: string): Promise<any>;
    acceptInvitation(token: string, userId: string): Promise<{
        success: boolean;
        message: string;
        companyId: string;
    }>;
    leaveCompany(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    isCompanyNameAvailable(name: string): Promise<boolean>;
    private mapToCompanyResponse;
    private mapToTeamMember;
}
