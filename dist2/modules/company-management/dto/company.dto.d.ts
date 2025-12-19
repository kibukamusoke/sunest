export declare enum CompanySize {
    STARTUP = "1-10",
    SMALL = "11-50",
    MEDIUM = "51-200",
    LARGE = "201-500",
    ENTERPRISE = "501-1000",
    CORPORATION = "1000+"
}
export declare enum Industry {
    TECHNOLOGY = "technology",
    MANUFACTURING = "manufacturing",
    HEALTHCARE = "healthcare",
    FINANCE = "finance",
    EDUCATION = "education",
    RETAIL = "retail",
    CONSTRUCTION = "construction",
    TELECOMMUNICATIONS = "telecommunications",
    GOVERNMENT = "government",
    OTHER = "other"
}
export declare enum CompanyRole {
    ADMIN = "admin",
    MANAGER = "manager",
    EMPLOYEE = "employee",
    VIEWER = "viewer"
}
export declare class CreateCompanyDto {
    name: string;
    displayName?: string;
    description?: string;
    industry?: Industry;
    website?: string;
    logoUrl?: string;
    companyEmail?: string;
    companyPhone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    registrationNumber?: string;
    sstNumber?: string;
    idType?: string;
    idValue?: string;
    creditLimit?: string;
    paymentTerms?: string;
}
export declare class UpdateCompanyDto {
    displayName?: string;
    description?: string;
    industry?: Industry;
    website?: string;
    logoUrl?: string;
    companyEmail?: string;
    companyPhone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    registrationNumber?: string;
    sstNumber?: string;
    idType?: string;
    idValue?: string;
    creditLimit?: string;
    paymentTerms?: string;
    isActive?: boolean;
    isVerified?: boolean;
    verificationNotes?: string;
}
export declare class InviteTeamMemberDto {
    email: string;
    role: CompanyRole;
    message?: string;
}
export declare class UpdateTeamMemberDto {
    role: CompanyRole;
    isActive?: boolean;
}
export declare class CompanyResponseDto {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    industry?: string;
    website?: string;
    logoUrl?: string;
    companyEmail?: string;
    companyPhone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    registrationNumber?: string;
    sstNumber?: string;
    idType?: string;
    idValue?: string;
    creditLimit?: string;
    paymentTerms?: string;
    isActive: boolean;
    isVerified: boolean;
    verificationNotes?: string;
    teamMemberCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TeamMemberDto {
    id: string;
    userId: string;
    name: string;
    email: string;
    jobTitle?: string;
    department?: string;
    role: string;
    isActive: boolean;
    joinedAt: Date;
    lastLoginAt?: Date;
}
export declare class CompanyListDto {
    companies: CompanyResponseDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class TeamListDto {
    members: TeamMemberDto[];
    total: number;
}
