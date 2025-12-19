"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartCheckoutModule = void 0;
const common_1 = require("@nestjs/common");
const cart_checkout_controller_1 = require("./cart-checkout.controller");
const cart_checkout_service_1 = require("./cart-checkout.service");
const checkout_service_1 = require("./checkout.service");
const saved_items_service_1 = require("./saved-items.service");
const prisma_service_1 = require("../../config/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
const order_fulfillment_module_1 = require("../order-fulfillment/order-fulfillment.module");
let CartCheckoutModule = class CartCheckoutModule {
};
exports.CartCheckoutModule = CartCheckoutModule;
exports.CartCheckoutModule = CartCheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, users_module_1.UsersModule, order_fulfillment_module_1.OrderFulfillmentModule],
        controllers: [cart_checkout_controller_1.CartCheckoutController],
        providers: [
            cart_checkout_service_1.CartCheckoutService,
            checkout_service_1.CheckoutService,
            saved_items_service_1.SavedItemsService,
            prisma_service_1.PrismaService,
        ],
        exports: [cart_checkout_service_1.CartCheckoutService, checkout_service_1.CheckoutService, saved_items_service_1.SavedItemsService],
    })
], CartCheckoutModule);
//# sourceMappingURL=cart-checkout.module.js.map