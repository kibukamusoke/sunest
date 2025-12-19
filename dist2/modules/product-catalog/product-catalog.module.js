"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCatalogModule = void 0;
const common_1 = require("@nestjs/common");
const product_catalog_controller_1 = require("./product-catalog.controller");
const product_catalog_service_1 = require("./product-catalog.service");
const prisma_service_1 = require("../../config/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
let ProductCatalogModule = class ProductCatalogModule {
};
exports.ProductCatalogModule = ProductCatalogModule;
exports.ProductCatalogModule = ProductCatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [product_catalog_controller_1.ProductCatalogController],
        providers: [
            product_catalog_service_1.ProductCatalogService,
            prisma_service_1.PrismaService,
            roles_guard_1.RolesGuard,
            permissions_guard_1.PermissionsGuard,
        ],
        exports: [product_catalog_service_1.ProductCatalogService],
    })
], ProductCatalogModule);
//# sourceMappingURL=product-catalog.module.js.map