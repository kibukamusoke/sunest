"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFQManagementModule = void 0;
const common_1 = require("@nestjs/common");
const rfq_management_controller_1 = require("./rfq-management.controller");
const rfq_management_service_1 = require("./rfq-management.service");
const prisma_service_1 = require("../../config/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let RFQManagementModule = class RFQManagementModule {
};
exports.RFQManagementModule = RFQManagementModule;
exports.RFQManagementModule = RFQManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, users_module_1.UsersModule],
        controllers: [rfq_management_controller_1.RFQManagementController],
        providers: [rfq_management_service_1.RFQManagementService, prisma_service_1.PrismaService],
        exports: [rfq_management_service_1.RFQManagementService],
    })
], RFQManagementModule);
//# sourceMappingURL=rfq-management.module.js.map