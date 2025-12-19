import { CompanyService } from './company.service';
export declare class PublicCompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getInvitationByToken(token: string): Promise<any>;
}
