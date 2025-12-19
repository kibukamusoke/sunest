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
export declare class RegisterDto {
    email: string;
    password: string;
    displayName: string;
    jobTitle: string;
    phoneNumber: string;
    companyName: string;
    companyDescription?: string;
    companyWebsite?: string;
    companySize: CompanySize;
    industry: Industry;
    avatar?: string;
}
