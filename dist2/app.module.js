"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_module_1 = require("./config/config.module");
const database_module_1 = require("./config/database.module");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const health_module_1 = require("./modules/health/health.module");
const storage_module_1 = require("./modules/storage/storage.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const merchant_management_module_1 = require("./modules/merchant-management/merchant-management.module");
const company_module_1 = require("./modules/company-management/company.module");
const product_catalog_module_1 = require("./modules/product-catalog/product-catalog.module");
const inventory_management_module_1 = require("./modules/inventory-management/inventory-management.module");
const search_discovery_module_1 = require("./modules/search-discovery/search-discovery.module");
const rfq_management_module_1 = require("./modules/rfq-management/rfq-management.module");
const cart_checkout_module_1 = require("./modules/cart-checkout/cart-checkout.module");
const order_fulfillment_module_1 = require("./modules/order-fulfillment/order-fulfillment.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const configurations_module_1 = require("./modules/configurations/configurations.module");
const places_module_1 = require("./modules/places/places.module");
const system_configurations_module_1 = require("./modules/system-configurations/system-configurations.module");
const tickets_module_1 = require("./modules/tickets/tickets.module");
const product_reviews_module_1 = require("./modules/product-reviews/product-reviews.module");
const nestjs_pino_1 = require("nestjs-pino");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            singleLine: false,
                        },
                    },
                    serializers: {
                        req: (req) => {
                            return {
                                id: req.id,
                                method: req.method,
                                url: req.url,
                                query: req.query,
                                params: req.params,
                                body: req.raw.body,
                                remoteAddress: req.remoteAddress,
                                remotePort: req.remotePort,
                            };
                        },
                        res: (res) => {
                            return {
                                statusCode: res.statusCode,
                                body: res.raw.locals?.body,
                            };
                        },
                    },
                },
            }),
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            storage_module_1.StorageModule,
            notifications_module_1.NotificationsModule,
            jobs_module_1.JobsModule,
            merchant_management_module_1.MerchantManagementModule,
            company_module_1.CompanyModule,
            product_catalog_module_1.ProductCatalogModule,
            inventory_management_module_1.InventoryManagementModule,
            search_discovery_module_1.SearchDiscoveryModule,
            rfq_management_module_1.RFQManagementModule,
            cart_checkout_module_1.CartCheckoutModule,
            order_fulfillment_module_1.OrderFulfillmentModule,
            analytics_module_1.AnalyticsModule,
            configurations_module_1.ConfigurationsModule,
            places_module_1.PlacesModule,
            system_configurations_module_1.SystemConfigurationsModule,
            tickets_module_1.TicketsModule,
            product_reviews_module_1.ProductReviewsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map