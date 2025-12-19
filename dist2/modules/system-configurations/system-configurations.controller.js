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
exports.SystemConfigurationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const system_configurations_dto_1 = require("./dto/system-configurations.dto");
const system_configurations_service_1 = require("./system-configurations.service");
let SystemConfigurationsController = class SystemConfigurationsController {
    constructor(systemConfigurationsService) {
        this.systemConfigurationsService = systemConfigurationsService;
    }
    async getPublic() {
        return this.systemConfigurationsService.getPublic();
    }
    async update(body) {
        return this.systemConfigurationsService.update(body);
    }
};
exports.SystemConfigurationsController = SystemConfigurationsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get public system configurations',
        description: 'Retrieve system-level storefront configuration values (app name, contact info, WhatsApp).',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'System configurations retrieved successfully',
        type: system_configurations_dto_1.SystemConfigurationsResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemConfigurationsController.prototype, "getPublic", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.SystemAdmin)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update system configurations',
        description: 'Update system-level storefront configuration values. Only system admins may update.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'System configurations updated successfully',
        type: system_configurations_dto_1.SystemConfigurationsResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_configurations_dto_1.UpdateSystemConfigurationsDto]),
    __metadata("design:returntype", Promise)
], SystemConfigurationsController.prototype, "update", null);
exports.SystemConfigurationsController = SystemConfigurationsController = __decorate([
    (0, swagger_1.ApiTags)('SystemConfigurations'),
    (0, common_1.Controller)('system-configurations'),
    __metadata("design:paramtypes", [system_configurations_service_1.SystemConfigurationsService])
], SystemConfigurationsController);
//# sourceMappingURL=system-configurations.controller.js.map