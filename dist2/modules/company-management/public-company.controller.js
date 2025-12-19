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
exports.PublicCompanyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const company_service_1 = require("./company.service");
let PublicCompanyController = class PublicCompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async getInvitationByToken(token) {
        return this.companyService.getInvitationByToken(token);
    }
};
exports.PublicCompanyController = PublicCompanyController;
__decorate([
    (0, common_1.Get)('invitations/:token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get invitation details by token (for join page) - Public endpoint',
    }),
    (0, swagger_1.ApiParam)({ name: 'token', description: 'Invitation token', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Invitation details retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                message: { type: 'string' },
                company: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        displayName: { type: 'string' },
                        logoUrl: { type: 'string' },
                    },
                },
                invitedBy: {
                    type: 'object',
                    properties: {
                        displayName: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
                expiresAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Invitation not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invitation expired or already processed',
    }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCompanyController.prototype, "getInvitationByToken", null);
exports.PublicCompanyController = PublicCompanyController = __decorate([
    (0, swagger_1.ApiTags)('Public Company Management'),
    (0, common_1.Controller)('public/companies'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], PublicCompanyController);
//# sourceMappingURL=public-company.controller.js.map