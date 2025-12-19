"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const metrics_service_1 = require("./metrics.service");
const dashboard_service_1 = require("./dashboard.service");
const reports_service_1 = require("./reports.service");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [
            prisma_service_1.PrismaService,
            analytics_service_1.AnalyticsService,
            metrics_service_1.MetricsService,
            dashboard_service_1.DashboardService,
            reports_service_1.ReportsService,
        ],
        exports: [analytics_service_1.AnalyticsService, metrics_service_1.MetricsService, dashboard_service_1.DashboardService, reports_service_1.ReportsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map