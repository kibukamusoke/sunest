"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDiscoveryModule = void 0;
const common_1 = require("@nestjs/common");
const search_discovery_controller_1 = require("./search-discovery.controller");
const search_discovery_service_1 = require("./search-discovery.service");
const prisma_service_1 = require("../../config/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let SearchDiscoveryModule = class SearchDiscoveryModule {
};
exports.SearchDiscoveryModule = SearchDiscoveryModule;
exports.SearchDiscoveryModule = SearchDiscoveryModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, users_module_1.UsersModule],
        controllers: [search_discovery_controller_1.SearchDiscoveryController],
        providers: [search_discovery_service_1.SearchDiscoveryService, prisma_service_1.PrismaService],
        exports: [search_discovery_service_1.SearchDiscoveryService],
    })
], SearchDiscoveryModule);
//# sourceMappingURL=search-discovery.module.js.map