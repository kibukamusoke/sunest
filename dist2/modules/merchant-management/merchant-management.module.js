"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantManagementModule = void 0;
const common_1 = require("@nestjs/common");
const merchant_controller_1 = require("./merchant.controller");
const merchant_service_1 = require("./merchant.service");
const merchant_document_service_1 = require("./merchant-document.service");
const prisma_service_1 = require("../../config/prisma.service");
const s3_storage_service_1 = require("../storage/s3-storage.service");
const notifications_module_1 = require("../notifications/notifications.module");
const storage_module_1 = require("../storage/storage.module");
const users_module_1 = require("../users/users.module");
let MerchantManagementModule = class MerchantManagementModule {
};
exports.MerchantManagementModule = MerchantManagementModule;
exports.MerchantManagementModule = MerchantManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule,
            storage_module_1.StorageModule,
            users_module_1.UsersModule,
        ],
        controllers: [merchant_controller_1.MerchantController],
        providers: [
            merchant_service_1.MerchantService,
            merchant_document_service_1.MerchantDocumentService,
            prisma_service_1.PrismaService,
            s3_storage_service_1.S3StorageService,
        ],
        exports: [merchant_service_1.MerchantService],
    })
], MerchantManagementModule);
//# sourceMappingURL=merchant-management.module.js.map