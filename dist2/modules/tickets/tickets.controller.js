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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tickets_dto_1 = require("./dto/tickets.dto");
const tickets_service_1 = require("./tickets.service");
let TicketsController = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async getPublicByToken(token) {
        return this.ticketsService.getPublicByToken(token);
    }
    async addPublicMessage(token, body) {
        return this.ticketsService.addPublicMessage(token, body);
    }
    async addAdminMessage(id, body) {
        return this.ticketsService.addAdminMessage(id, body);
    }
    async createPublic(body, req) {
        const forwardedProto = req.headers['x-forwarded-proto'] ?? undefined;
        const host = req.headers['x-forwarded-host'] ?? req.headers.host;
        const proto = forwardedProto ?? req.protocol;
        const origin = req.headers.origin ??
            (host ? `${proto}://${host}` : undefined);
        return this.ticketsService.createPublic(body, origin ?? null);
    }
    async listAdmin(skip, take) {
        const parsedSkip = skip ? Math.max(parseInt(skip, 10) || 0, 0) : 0;
        const parsedTake = take ? Math.min(Math.max(parseInt(take, 10) || 50, 1), 200) : 50;
        return this.ticketsService.listAdmin(parsedSkip, parsedTake);
    }
    async getAdmin(id) {
        return this.ticketsService.getAdmin(id);
    }
    async updateAdmin(id, body) {
        return this.ticketsService.updateAdmin(id, body);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Get)('public/:token'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket details (public link)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.PublicTicketResponseDto }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getPublicByToken", null);
__decorate([
    (0, common_1.Post)('public/:token/messages'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a message to a ticket (public link)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.PublicTicketResponseDto }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tickets_dto_1.CreateTicketMessageDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addPublicMessage", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a support message to a ticket (admin)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.PublicTicketResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tickets_dto_1.CreateSupportTicketMessageDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addAdminMessage", null);
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a support ticket (public)',
        description: 'Create a support ticket from the storefront Contact Us / Support page.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Ticket created successfully',
        type: tickets_dto_1.TicketResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tickets_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "createPublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tickets (admin)', description: 'List all support tickets (system admin only).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.TicketsListResponseDto }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "listAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket by id (admin)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.TicketResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket (admin)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: tickets_dto_1.TicketResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tickets_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "updateAdmin", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('Tickets'),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map