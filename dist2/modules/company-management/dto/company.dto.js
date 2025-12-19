"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamListDto = exports.CompanyListDto = exports.TeamMemberDto = exports.CompanyResponseDto = exports.UpdateTeamMemberDto = exports.InviteTeamMemberDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = exports.CompanyRole = exports.Industry = exports.CompanySize = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var CompanySize;
(function (CompanySize) {
    CompanySize["STARTUP"] = "1-10";
    CompanySize["SMALL"] = "11-50";
    CompanySize["MEDIUM"] = "51-200";
    CompanySize["LARGE"] = "201-500";
    CompanySize["ENTERPRISE"] = "501-1000";
    CompanySize["CORPORATION"] = "1000+";
})(CompanySize || (exports.CompanySize = CompanySize = {}));
var Industry;
(function (Industry) {
    Industry["TECHNOLOGY"] = "technology";
    Industry["MANUFACTURING"] = "manufacturing";
    Industry["HEALTHCARE"] = "healthcare";
    Industry["FINANCE"] = "finance";
    Industry["EDUCATION"] = "education";
    Industry["RETAIL"] = "retail";
    Industry["CONSTRUCTION"] = "construction";
    Industry["TELECOMMUNICATIONS"] = "telecommunications";
    Industry["GOVERNMENT"] = "government";
    Industry["OTHER"] = "other";
})(Industry || (exports.Industry = Industry = {}));
var CompanyRole;
(function (CompanyRole) {
    CompanyRole["ADMIN"] = "admin";
    CompanyRole["MANAGER"] = "manager";
    CompanyRole["EMPLOYEE"] = "employee";
    CompanyRole["VIEWER"] = "viewer";
})(CompanyRole || (exports.CompanyRole = CompanyRole = {}));
class CreateCompanyDto {
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company name',
        example: 'Acme Technologies Inc.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company display name',
        example: 'Acme Tech',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Industry sector',
        enum: Industry,
        example: Industry.TECHNOLOGY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Industry),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company website URL',
        example: 'https://acmetech.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company logo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company contact email address',
        example: 'contact@company.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "companyEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company contact phone number',
        example: '+60123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "companyPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 1',
        example: '123 Business District',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2', example: 'Suite 100' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'Tech City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/Province code (e.g., "01" for Johor). Use /configurations/states endpoint to get valid state codes.',
        example: '01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code', example: '12345' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country', example: 'United States' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax identification number',
        example: '12-3456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business registration number',
        example: 'REG123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales and Service Tax number',
        example: 'SST-123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "sstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of ID document',
        example: 'passport',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID document number/value',
        example: 'A12345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credit limit for purchases',
        example: '50000.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment terms', example: 'NET30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "paymentTerms", void 0);
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company display name',
        example: 'Acme Tech',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Industry sector',
        enum: Industry,
        example: Industry.TECHNOLOGY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Industry),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company website URL',
        example: 'https://acmetech.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company logo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company contact email address',
        example: 'contact@company.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "companyEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company contact phone number',
        example: '+60123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "companyPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address line 1',
        example: '123 Business District',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2', example: 'Suite 100' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City', example: 'Tech City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/Province code (e.g., "01" for Johor). Use /configurations/states endpoint to get valid state codes.',
        example: '01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code', example: '12345' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country', example: 'United States' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax identification number',
        example: '12-3456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business registration number',
        example: 'REG123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales and Service Tax number',
        example: 'SST-123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "sstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of ID document',
        example: 'passport',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID document number/value',
        example: 'A12345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credit limit for purchases',
        example: '50000.00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment terms', example: 'NET30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether company is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether company is verified',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 1000),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "verificationNotes", void 0);
class InviteTeamMemberDto {
}
exports.InviteTeamMemberDto = InviteTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address of user to invite',
        example: 'john@company.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in company',
        enum: CompanyRole,
        example: CompanyRole.EMPLOYEE,
    }),
    (0, class_validator_1.IsEnum)(CompanyRole),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom invitation message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "message", void 0);
class UpdateTeamMemberDto {
}
exports.UpdateTeamMemberDto = UpdateTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in company',
        enum: CompanyRole,
        example: CompanyRole.MANAGER,
    }),
    (0, class_validator_1.IsEnum)(CompanyRole),
    __metadata("design:type", String)
], UpdateTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether team member is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTeamMemberDto.prototype, "isActive", void 0);
class CompanyResponseDto {
}
exports.CompanyResponseDto = CompanyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company ID' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company name' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company display name' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company description' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Industry sector' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company website URL' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company logo URL' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company contact email address' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "companyEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company contact phone number' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "companyPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 1' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State/Province code (e.g., "01" for Johor)',
    }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal/ZIP code' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tax identification number' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business registration number' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sales and Service Tax number' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "sstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type of ID document' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "idType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID document number/value' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "idValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Credit limit for purchases' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "creditLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment terms' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether company is active' }),
    __metadata("design:type", Boolean)
], CompanyResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether company is verified' }),
    __metadata("design:type", Boolean)
], CompanyResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification notes' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "verificationNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of team members' }),
    __metadata("design:type", Number)
], CompanyResponseDto.prototype, "teamMemberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company creation date' }),
    __metadata("design:type", Date)
], CompanyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company last updated date' }),
    __metadata("design:type", Date)
], CompanyResponseDto.prototype, "updatedAt", void 0);
class TeamMemberDto {
}
exports.TeamMemberDto = TeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Team member ID' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Job title' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role in company' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether team member is active' }),
    __metadata("design:type", Boolean)
], TeamMemberDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When user joined company' }),
    __metadata("design:type", Date)
], TeamMemberDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last login date' }),
    __metadata("design:type", Date)
], TeamMemberDto.prototype, "lastLoginAt", void 0);
class CompanyListDto {
}
exports.CompanyListDto = CompanyListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of companies', type: [CompanyResponseDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CompanyResponseDto),
    __metadata("design:type", Array)
], CompanyListDto.prototype, "companies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of companies' }),
    __metadata("design:type", Number)
], CompanyListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], CompanyListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of companies per page' }),
    __metadata("design:type", Number)
], CompanyListDto.prototype, "limit", void 0);
class TeamListDto {
}
exports.TeamListDto = TeamListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of team members', type: [TeamMemberDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TeamMemberDto),
    __metadata("design:type", Array)
], TeamListDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of team members' }),
    __metadata("design:type", Number)
], TeamListDto.prototype, "total", void 0);
//# sourceMappingURL=company.dto.js.map