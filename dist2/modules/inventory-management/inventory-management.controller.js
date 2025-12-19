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
exports.InventoryManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const inventory_management_service_1 = require("./inventory-management.service");
const dto_1 = require("./dto");
let InventoryManagementController = class InventoryManagementController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async createInventoryItem(createInventoryItemDto, req) {
        return this.inventoryService.createInventoryItem(createInventoryItemDto, req.user.userId);
    }
    async getInventoryItems(searchDto, req) {
        if (req.user) {
            const merchantId = req.user.roles?.includes('system_admin')
                ? undefined
                : req.user.merchants?.[0]?.id;
            return this.inventoryService.getInventoryItems(searchDto, merchantId, false);
        }
        else {
            return this.inventoryService.getInventoryItems(searchDto, undefined, true);
        }
    }
    async getMerchantInventoryItems(searchDto, req) {
        const merchantId = req.user?.merchants?.[0]?.id;
        if (!merchantId) {
            throw new Error('User is not associated with any merchant');
        }
        return this.inventoryService.getInventoryItems(searchDto, merchantId, false);
    }
    async getInventoryItemById(id, req) {
        const merchantId = req.user.roles?.includes('system_admin')
            ? undefined
            : req.user.merchants?.[0]?.id;
        return this.inventoryService.getInventoryItemById(id, merchantId);
    }
    async updateInventoryItem(id, updateInventoryItemDto, req) {
        const merchantId = req.user.roles?.includes('system_admin')
            ? undefined
            : req.user.merchants?.[0]?.id;
        return this.inventoryService.updateInventoryItem(id, updateInventoryItemDto, merchantId);
    }
    async deleteInventoryItem(id, req) {
        const merchantId = req.user.roles?.includes('system_admin')
            ? undefined
            : req.user.merchants?.[0]?.id;
        return this.inventoryService.deleteInventoryItem(id, merchantId);
    }
    async bulkUpdateInventory(bulkUpdateDto, req) {
        const result = await this.inventoryService.bulkUpdateInventoryItems(bulkUpdateDto);
        return { success: result.updated, errors: result.errors };
    }
    async createStockMovement(createMovementDto, req) {
        return this.inventoryService.createStockMovement(createMovementDto, req.user.userId);
    }
    async getStockMovements(searchDto) {
        return this.inventoryService.getStockMovements(searchDto);
    }
    async adjustStock(adjustmentDto, req) {
        return this.inventoryService.adjustStock(adjustmentDto, req.user.userId);
    }
    async createPricingRule(createRuleDto, req) {
        return this.inventoryService.createPricingRule(createRuleDto);
    }
    async getPricingRules(searchDto) {
        return this.inventoryService.getPricingRules(searchDto);
    }
    async updatePricingRule(id, updateRuleDto, req) {
        return this.inventoryService.updatePricingRule(id, updateRuleDto);
    }
    async deletePricingRule(id) {
        return this.inventoryService.deletePricingRule(id);
    }
    async calculatePrice(calculationDto) {
        return this.inventoryService.calculatePrice(calculationDto);
    }
    async getLowStockReport(req) {
        const merchantId = req?.user?.roles?.includes('system_admin')
            ? undefined
            : req?.user?.merchants?.[0]?.id;
        const searchDto = {
            lowStockOnly: true,
            includeProduct: true,
        };
        return this.inventoryService.getInventoryItems(searchDto, merchantId);
    }
    async getOutOfStockReport(req) {
        const merchantId = req?.user?.roles?.includes('system_admin')
            ? undefined
            : req?.user?.merchants?.[0]?.id;
        const searchDto = {
            outOfStockOnly: true,
            includeProduct: true,
        };
        return this.inventoryService.getInventoryItems(searchDto, merchantId);
    }
    async getInventoryValueReport(req) {
        const merchantId = req.user.roles?.includes('system_admin')
            ? undefined
            : req.user.merchants?.[0]?.id;
        const searchDto = {
            includeProduct: true,
            limit: 1000,
        };
        const result = await this.inventoryService.getInventoryItems(searchDto, merchantId);
        const totalValue = result.items.reduce((sum, item) => sum + item.quantityOnHand * item.averageCost, 0);
        return {
            totalValue,
            totalItems: result.items.length,
            summary: result.summary,
        };
    }
};
exports.InventoryManagementController = InventoryManagementController;
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create inventory item',
        description: 'Create a new inventory item for a product',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateInventoryItemDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Inventory item created successfully',
        type: dto_1.InventoryItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid inventory item data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Inventory item already exists for this product/variant/batch combination',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryItemDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "createInventoryItem", null);
__decorate([
    (0, common_1.Get)('items'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get inventory items',
        description: 'Retrieve inventory items with filtering, search, and pagination. Authenticated merchants see only their inventory. Public access shows only published products.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Inventory items retrieved successfully',
        type: dto_1.InventoryItemListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.InventorySearchDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getInventoryItems", null);
__decorate([
    (0, common_1.Get)('merchant/items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant inventory items',
        description: 'Retrieve inventory items for the authenticated merchant only.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Merchant inventory items retrieved successfully',
        type: dto_1.InventoryItemListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.InventorySearchDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getMerchantInventoryItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get inventory item by ID',
        description: 'Retrieve detailed information about a specific inventory item',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Inventory item retrieved successfully',
        type: dto_1.InventoryItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getInventoryItemById", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update inventory item',
        description: 'Update inventory item information including stock levels and settings',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item ID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateInventoryItemDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Inventory item updated successfully',
        type: dto_1.InventoryItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateInventoryItemDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "updateInventoryItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete inventory item',
        description: 'Delete an inventory item. Only possible if no stock remains.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Inventory item deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Cannot delete inventory item with remaining stock',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "deleteInventoryItem", null);
__decorate([
    (0, common_1.Post)('items/bulk-update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk update inventory',
        description: 'Update multiple inventory items in a single operation',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.BulkInventoryUpdateDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bulk update completed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'number' },
                errors: { type: 'array', items: { type: 'object' } },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkInventoryUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "bulkUpdateInventory", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create stock movement',
        description: 'Record a stock movement (receipt, shipment, adjustment, etc.)',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateStockMovementDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Stock movement created successfully',
        type: dto_1.StockMovementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid movement data or insufficient stock',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStockMovementDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "createStockMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get stock movements',
        description: 'Retrieve stock movements with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock movements retrieved successfully',
        type: dto_1.StockMovementListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StockMovementSearchDto]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getStockMovements", null);
__decorate([
    (0, common_1.Post)('adjustments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Adjust stock levels',
        description: 'Manually adjust inventory quantities (cycle counts, corrections, etc.)',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.StockAdjustmentDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Stock adjustment completed successfully',
        type: dto_1.StockMovementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StockAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('pricing-rules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create pricing rule',
        description: 'Create a dynamic pricing rule for an inventory item',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateInventoryPricingRuleDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Pricing rule created successfully',
        type: dto_1.InventoryPricingRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryPricingRuleDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "createPricingRule", null);
__decorate([
    (0, common_1.Get)('pricing-rules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pricing rules',
        description: 'Retrieve pricing rules with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Pricing rules retrieved successfully',
        type: dto_1.InventoryPricingRuleListDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PricingRuleSearchDto]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getPricingRules", null);
__decorate([
    (0, common_1.Put)('pricing-rules/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update pricing rule',
        description: 'Update an existing pricing rule',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pricing rule ID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateInventoryPricingRuleDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Pricing rule updated successfully',
        type: dto_1.InventoryPricingRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Pricing rule not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateInventoryPricingRuleDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "updatePricingRule", null);
__decorate([
    (0, common_1.Delete)('pricing-rules/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete pricing rule',
        description: 'Delete a pricing rule',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pricing rule ID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Pricing rule deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Pricing rule not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "deletePricingRule", null);
__decorate([
    (0, common_1.Post)('pricing/calculate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate price',
        description: 'Calculate the final price for a given quantity based on pricing rules',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.PriceCalculationDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Price calculated successfully',
        type: dto_1.PriceCalculationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PriceCalculationDto]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "calculatePrice", null);
__decorate([
    (0, common_1.Get)('reports/low-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get low stock report',
        description: 'Get items that are at or below their minimum stock levels',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Low stock report generated successfully',
        type: dto_1.InventoryItemListDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getLowStockReport", null);
__decorate([
    (0, common_1.Get)('reports/out-of-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantUser)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get out of stock report',
        description: 'Get items that are completely out of stock',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Out of stock report generated successfully',
        type: dto_1.InventoryItemListDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getOutOfStockReport", null);
__decorate([
    (0, common_1.Get)('reports/inventory-value'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.MerchantAdmin)(),
    (0, permissions_decorator_1.RequireMerchantManage)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get inventory valuation report',
        description: 'Get total inventory value for all products',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Inventory valuation report generated successfully',
        schema: {
            type: 'object',
            properties: {
                totalValue: { type: 'number' },
                valueByCategory: { type: 'object' },
                summary: { type: 'object' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryManagementController.prototype, "getInventoryValueReport", null);
exports.InventoryManagementController = InventoryManagementController = __decorate([
    (0, swagger_1.ApiTags)('Inventory Management'),
    (0, common_1.Controller)('inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_management_service_1.InventoryManagementService])
], InventoryManagementController);
//# sourceMappingURL=inventory-management.controller.js.map