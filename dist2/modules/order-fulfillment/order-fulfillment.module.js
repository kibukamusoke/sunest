"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderFulfillmentModule = void 0;
const common_1 = require("@nestjs/common");
const order_fulfillment_controller_1 = require("./order-fulfillment.controller");
const order_fulfillment_service_1 = require("./order-fulfillment.service");
const prisma_service_1 = require("../../config/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let OrderFulfillmentModule = class OrderFulfillmentModule {
};
exports.OrderFulfillmentModule = OrderFulfillmentModule;
exports.OrderFulfillmentModule = OrderFulfillmentModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, users_module_1.UsersModule],
        controllers: [order_fulfillment_controller_1.OrderFulfillmentController],
        providers: [order_fulfillment_service_1.OrderFulfillmentService, prisma_service_1.PrismaService],
        exports: [order_fulfillment_service_1.OrderFulfillmentService],
    })
], OrderFulfillmentModule);
//# sourceMappingURL=order-fulfillment.module.js.map