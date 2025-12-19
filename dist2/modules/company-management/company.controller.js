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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const company_service_1 = require("./company.service");
const company_dto_1 = require("./dto/company.dto");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async createCompany(createCompanyDto, req) {
        return this.companyService.createCompany(createCompanyDto, req.user.userId);
    }
    async getUserCompanies(req) {
        return this.companyService.getUserCompanies(req.user.userId);
    }
    async getCompanyById(companyId, req) {
        return this.companyService.getCompanyById(companyId, req.user.userId);
    }
    async updateCompany(companyId, updateCompanyDto, req) {
        return this.companyService.updateCompany(companyId, updateCompanyDto, req.user.userId);
    }
    async deleteCompany(companyId, req) {
        return this.companyService.deleteCompany(companyId, req.user.userId);
    }
    async getCompanyTeam(companyId, req) {
        const members = await this.companyService.getCompanyTeam(companyId, req.user.userId);
        return {
            members,
            total: members.length,
        };
    }
    async inviteTeamMember(companyId, inviteDto, req) {
        return this.companyService.inviteTeamMember(companyId, inviteDto, req.user.userId);
    }
    async updateTeamMember(companyId, membershipId, updateDto, req) {
        return this.companyService.updateTeamMember(companyId, membershipId, updateDto, req.user.userId);
    }
    async removeTeamMember(companyId, membershipId, req) {
        return this.companyService.removeTeamMember(companyId, membershipId, req.user.userId);
    }
    async checkCompanyNameAvailability(companyName) {
        const available = await this.companyService.isCompanyNameAvailable(companyName);
        return {
            available,
            message: available
                ? 'Company name is available'
                : 'Company name is already taken',
        };
    }
    async acceptInvitation(token, req) {
        return this.companyService.acceptInvitation(token, req.user.userId);
    }
    async leaveCompany(req) {
        return this.companyService.leaveCompany(req.user.userId);
    }
    async deleteAccount(req) {
        return this.companyService.deleteAccount(req.user.userId);
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Company created successfully',
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Company name already exists',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.CreateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Get)('my-companies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get companies the current user belongs to' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User companies retrieved successfully',
        type: [company_dto_1.CompanyResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getUserCompanies", null);
__decorate([
    (0, common_1.Get)(':companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company by ID' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Company retrieved successfully',
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied to this company',
    }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getCompanyById", null);
__decorate([
    (0, common_1.Put)(':companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update company information' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Company updated successfully',
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied or insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "updateCompany", null);
__decorate([
    (0, common_1.Delete)(':companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete company (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Company deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied or insufficient permissions',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "deleteCompany", null);
__decorate([
    (0, common_1.Get)(':companyId/team'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company team members' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Team members retrieved successfully',
        type: company_dto_1.TeamListDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied to this company',
    }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getCompanyTeam", null);
__decorate([
    (0, common_1.Post)(':companyId/team/invite'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a team member to the company' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Team member invited successfully',
        type: company_dto_1.TeamMemberDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company or user not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'User is already a member of this company',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_dto_1.InviteTeamMemberDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "inviteTeamMember", null);
__decorate([
    (0, common_1.Put)(':companyId/team/:membershipId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update team member role or status' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiParam)({
        name: 'membershipId',
        description: 'Team membership ID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Team member updated successfully',
        type: company_dto_1.TeamMemberDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company or team member not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions',
    }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('membershipId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, company_dto_1.UpdateTeamMemberDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "updateTeamMember", null);
__decorate([
    (0, common_1.Delete)(':companyId/team/:membershipId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove team member from company' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID', type: 'string' }),
    (0, swagger_1.ApiParam)({
        name: 'membershipId',
        description: 'Team membership ID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Team member removed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Company or team member not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('membershipId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "removeTeamMember", null);
__decorate([
    (0, common_1.Get)('check-name/:companyName'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if company name is available' }),
    (0, swagger_1.ApiParam)({
        name: 'companyName',
        description: 'Company name to check',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Company name availability checked',
        schema: {
            type: 'object',
            properties: {
                available: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('companyName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "checkCompanyNameAvailability", null);
__decorate([
    (0, common_1.Post)('invitations/:token/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept team invitation' }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Invitation accepted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                companyId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Invitation not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid invitation or user',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'User already belongs to another company',
    }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)('leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave current company' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully left company',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not a member of any company',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Cannot leave as only admin',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "leaveCompany", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account and leave all companies' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Account deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Cannot delete account while being only admin',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "deleteAccount", null);
exports.CompanyController = CompanyController = __decorate([
    (0, swagger_1.ApiTags)('Company Management'),
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map