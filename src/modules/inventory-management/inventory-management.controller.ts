import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SystemAdmin, MerchantAdmin, MerchantUser } from '../../common/decorators/roles.decorator';
import { RequireSystemManage, RequireMerchantManage } from '../../common/decorators/permissions.decorator';
import { InventoryManagementService } from './inventory-management.service';
import {
    CreateWarehouseDto,
    UpdateWarehouseDto,
    WarehouseResponseDto,
    WarehouseListDto,
    WarehouseSearchDto,
    CreateInventoryItemDto,
    UpdateInventoryItemDto,
    InventoryItemResponseDto,
    InventoryItemListDto,
    InventorySearchDto,
    BulkInventoryUpdateDto,
    CreateStockMovementDto,
    StockMovementResponseDto,
    StockMovementListDto,
    StockMovementSearchDto,
    CreateStockTransferDto,
    StockAdjustmentDto,
    CreateInventoryPricingRuleDto,
    UpdateInventoryPricingRuleDto,
    InventoryPricingRuleResponseDto,
    InventoryPricingRuleListDto,
    PricingRuleSearchDto,
    PriceCalculationDto,
    PriceCalculationResponseDto,
} from './dto';

@ApiTags('Inventory Management')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class InventoryManagementController {
    constructor(private readonly inventoryService: InventoryManagementService) { }

    // ==================== WAREHOUSE MANAGEMENT ====================

    @Post('warehouses')
    @SystemAdmin()
    @RequireSystemManage()
    @ApiOperation({
        summary: 'Create a new warehouse',
        description: 'Create a new warehouse for inventory management. Only system administrators can create warehouses.',
    })
    @ApiBody({ type: CreateWarehouseDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Warehouse created successfully',
        type: WarehouseResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid warehouse data or warehouse code already exists',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Parent warehouse or merchant not found',
    })
    async createWarehouse(
        @Body() createWarehouseDto: CreateWarehouseDto,
        @Request() req: any,
    ): Promise<WarehouseResponseDto> {
        return this.inventoryService.createWarehouse(createWarehouseDto, req.user.userId);
    }

    @Get('warehouses')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get warehouses',
        description: 'Retrieve warehouses with optional filtering and pagination. Merchants see only their warehouses.',
    })
    //@ApiQuery({ type: WarehouseSearchDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Warehouses retrieved successfully',
        type: WarehouseListDto,
    })
    async getWarehouses(
        @Query() searchDto: WarehouseSearchDto,
        @Request() req: any,
    ): Promise<WarehouseListDto> {
        const merchantId = req.user.roles?.includes('system_admin') ? undefined : req.user.merchants?.[0]?.id;
        return this.inventoryService.getWarehouses(searchDto, merchantId);
    }

    @Get('warehouses/:id')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get warehouse by ID',
        description: 'Retrieve detailed information about a specific warehouse',
    })
    @ApiParam({ name: 'id', description: 'Warehouse ID', type: 'string' })
    /*@ApiQuery({
        name: 'includeStats',
        required: false,
        type: 'boolean',
        description: 'Include inventory statistics',
    }) */
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Warehouse retrieved successfully',
        type: WarehouseResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Warehouse not found',
    })
    async getWarehouseById(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('includeStats') includeStats?: boolean,
    ): Promise<WarehouseResponseDto> {
        return this.inventoryService.getWarehouseById(id, includeStats);
    }

    @Put('warehouses/:id')
    @SystemAdmin()
    @RequireSystemManage()
    @ApiOperation({
        summary: 'Update warehouse',
        description: 'Update warehouse information. Only system administrators can update warehouses.',
    })
    @ApiParam({ name: 'id', description: 'Warehouse ID', type: 'string' })
    @ApiBody({ type: UpdateWarehouseDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Warehouse updated successfully',
        type: WarehouseResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Warehouse not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid update data or circular parent reference',
    })
    async updateWarehouse(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateWarehouseDto: UpdateWarehouseDto,
        @Request() req: any,
    ): Promise<WarehouseResponseDto> {
        return this.inventoryService.updateWarehouse(id, updateWarehouseDto, req.user.userId);
    }

    @Delete('warehouses/:id')
    @SystemAdmin()
    @RequireSystemManage()
    @ApiOperation({
        summary: 'Delete warehouse',
        description: 'Delete a warehouse. Only possible if warehouse has no inventory items or child warehouses.',
    })
    @ApiParam({ name: 'id', description: 'Warehouse ID', type: 'string' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Warehouse deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Warehouse not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Cannot delete warehouse with existing inventory or child warehouses',
    })
    async deleteWarehouse(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.inventoryService.deleteWarehouse(id);
    }

    // ==================== INVENTORY ITEM MANAGEMENT ====================

    @Post('items')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Create inventory item',
        description: 'Create a new inventory item for a product in a warehouse',
    })
    @ApiBody({ type: CreateInventoryItemDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Inventory item created successfully',
        type: InventoryItemResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid inventory item data',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Inventory item already exists for this product/variant/warehouse/batch combination',
    })
    async createInventoryItem(
        @Body() createInventoryItemDto: CreateInventoryItemDto,
        @Request() req: any,
    ): Promise<InventoryItemResponseDto> {
        return this.inventoryService.createInventoryItem(createInventoryItemDto, req.user.userId);
    }

    @Get('items')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get inventory items',
        description: 'Retrieve inventory items with filtering, search, and pagination',
    })
    //@ApiQuery({ type: InventorySearchDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Inventory items retrieved successfully',
        type: InventoryItemListDto,
    })
    async getInventoryItems(
        @Query() searchDto: InventorySearchDto,
        @Request() req: any,
    ): Promise<InventoryItemListDto> {
        const merchantId = req.user.roles?.includes('system_admin') ? undefined : req.user.merchants?.[0]?.id;
        return this.inventoryService.getInventoryItems(searchDto, merchantId);
    }

    @Get('items/:id')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get inventory item by ID',
        description: 'Retrieve detailed information about a specific inventory item',
    })
    @ApiParam({ name: 'id', description: 'Inventory item ID', type: 'string' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Inventory item retrieved successfully',
        type: InventoryItemResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    async getInventoryItemById(@Param('id', ParseUUIDPipe) id: string): Promise<InventoryItemResponseDto> {
        return this.inventoryService.getInventoryItemById(id);
    }

    @Put('items/:id')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Update inventory item',
        description: 'Update inventory item information including stock levels and settings',
    })
    @ApiParam({ name: 'id', description: 'Inventory item ID', type: 'string' })
    @ApiBody({ type: UpdateInventoryItemDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Inventory item updated successfully',
        type: InventoryItemResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    async updateInventoryItem(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateInventoryItemDto: UpdateInventoryItemDto,
        @Request() req: any,
    ): Promise<InventoryItemResponseDto> {
        return this.inventoryService.updateInventoryItem(id, updateInventoryItemDto, req.user.userId);
    }

    @Delete('items/:id')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Delete inventory item',
        description: 'Delete an inventory item. Only possible if no stock remains.',
    })
    @ApiParam({ name: 'id', description: 'Inventory item ID', type: 'string' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Inventory item deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Cannot delete inventory item with remaining stock',
    })
    async deleteInventoryItem(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.inventoryService.deleteInventoryItem(id);
    }

    @Post('items/bulk-update')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Bulk update inventory',
        description: 'Update multiple inventory items in a single operation',
    })
    @ApiBody({ type: BulkInventoryUpdateDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Bulk update completed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'number' },
                errors: { type: 'array', items: { type: 'object' } },
            },
        },
    })
    async bulkUpdateInventory(
        @Body() bulkUpdateDto: BulkInventoryUpdateDto,
        @Request() req: any,
    ): Promise<{ success: number; errors: any[] }> {
        return this.inventoryService.bulkUpdateInventory(bulkUpdateDto, req.user.userId);
    }

    // ==================== STOCK MOVEMENT MANAGEMENT ====================

    @Post('movements')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Create stock movement',
        description: 'Record a stock movement (receipt, shipment, adjustment, etc.)',
    })
    @ApiBody({ type: CreateStockMovementDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Stock movement created successfully',
        type: StockMovementResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid movement data or insufficient stock',
    })
    async createStockMovement(
        @Body() createMovementDto: CreateStockMovementDto,
        @Request() req: any,
    ): Promise<StockMovementResponseDto> {
        return this.inventoryService.createStockMovement(createMovementDto, req.user.userId);
    }

    @Get('movements')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get stock movements',
        description: 'Retrieve stock movements with filtering and pagination',
    })
    //@ApiQuery({ type: StockMovementSearchDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Stock movements retrieved successfully',
        type: StockMovementListDto,
    })
    async getStockMovements(@Query() searchDto: StockMovementSearchDto): Promise<StockMovementListDto> {
        return this.inventoryService.getStockMovements(searchDto);
    }

    @Post('transfers')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Create stock transfer',
        description: 'Transfer inventory between warehouses',
    })
    @ApiBody({ type: CreateStockTransferDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Stock transfer completed successfully',
        schema: {
            type: 'object',
            properties: {
                transferId: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid transfer data or insufficient stock',
    })
    async createStockTransfer(
        @Body() transferDto: CreateStockTransferDto,
        @Request() req: any,
    ): Promise<{ transferId: string }> {
        const transferId = await this.inventoryService.createStockTransfer(transferDto, req.user.userId);
        return { transferId };
    }

    @Post('adjustments')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Adjust stock levels',
        description: 'Manually adjust inventory quantities (cycle counts, corrections, etc.)',
    })
    @ApiBody({ type: StockAdjustmentDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Stock adjustment completed successfully',
        type: StockMovementResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    async adjustStock(
        @Body() adjustmentDto: StockAdjustmentDto,
        @Request() req: any,
    ): Promise<StockMovementResponseDto> {
        return this.inventoryService.adjustStock(adjustmentDto, req.user.userId);
    }

    // ==================== PRICING RULE MANAGEMENT ====================

    @Post('pricing-rules')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Create pricing rule',
        description: 'Create a dynamic pricing rule for an inventory item',
    })
    @ApiBody({ type: CreateInventoryPricingRuleDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Pricing rule created successfully',
        type: InventoryPricingRuleResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    async createPricingRule(
        @Body() createRuleDto: CreateInventoryPricingRuleDto,
        @Request() req: any,
    ): Promise<InventoryPricingRuleResponseDto> {
        return this.inventoryService.createPricingRule(createRuleDto, req.user.userId);
    }

    @Get('pricing-rules')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get pricing rules',
        description: 'Retrieve pricing rules with filtering and pagination',
    })
    // @ApiQuery({ type: PricingRuleSearchDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pricing rules retrieved successfully',
        type: InventoryPricingRuleListDto,
    })
    async getPricingRules(@Query() searchDto: PricingRuleSearchDto): Promise<InventoryPricingRuleListDto> {
        return this.inventoryService.getPricingRules(searchDto);
    }

    @Put('pricing-rules/:id')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Update pricing rule',
        description: 'Update an existing pricing rule',
    })
    @ApiParam({ name: 'id', description: 'Pricing rule ID', type: 'string' })
    @ApiBody({ type: UpdateInventoryPricingRuleDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pricing rule updated successfully',
        type: InventoryPricingRuleResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Pricing rule not found',
    })
    async updatePricingRule(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateRuleDto: UpdateInventoryPricingRuleDto,
        @Request() req: any,
    ): Promise<InventoryPricingRuleResponseDto> {
        return this.inventoryService.updatePricingRule(id, updateRuleDto, req.user.userId);
    }

    @Delete('pricing-rules/:id')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Delete pricing rule',
        description: 'Delete a pricing rule',
    })
    @ApiParam({ name: 'id', description: 'Pricing rule ID', type: 'string' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Pricing rule deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Pricing rule not found',
    })
    async deletePricingRule(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.inventoryService.deletePricingRule(id);
    }

    @Post('pricing/calculate')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Calculate price',
        description: 'Calculate the final price for a given quantity based on pricing rules',
    })
    @ApiBody({ type: PriceCalculationDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Price calculated successfully',
        type: PriceCalculationResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Inventory item not found',
    })
    async calculatePrice(@Body() calculationDto: PriceCalculationDto): Promise<PriceCalculationResponseDto> {
        return this.inventoryService.calculatePrice(calculationDto);
    }

    // ==================== INVENTORY REPORTS ====================

    @Get('reports/low-stock')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get low stock report',
        description: 'Get items that are at or below their minimum stock levels',
    })
    /*@ApiQuery({
        name: 'warehouseId',
        required: false,
        type: 'string',
        description: 'Filter by warehouse ID',
    }) */
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Low stock report generated successfully',
        type: InventoryItemListDto,
    })
    async getLowStockReport(
        @Query('warehouseId') warehouseId?: string,
        @Request() req?: any,
    ): Promise<InventoryItemListDto> {
        const merchantId = req?.user?.roles?.includes('system_admin') ? undefined : req?.user?.merchants?.[0]?.id;
        const searchDto: InventorySearchDto = {
            warehouseId,
            lowStockOnly: true,
            includeProduct: true,
            includeWarehouse: true,
        };
        return this.inventoryService.getInventoryItems(searchDto, merchantId);
    }

    @Get('reports/out-of-stock')
    @MerchantUser()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get out of stock report',
        description: 'Get items that are completely out of stock',
    })
    /*@ApiQuery({
        name: 'warehouseId',
        required: false,
        type: 'string',
        description: 'Filter by warehouse ID',
    }) */
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Out of stock report generated successfully',
        type: InventoryItemListDto,
    })
    async getOutOfStockReport(
        @Query('warehouseId') warehouseId?: string,
        @Request() req?: any,
    ): Promise<InventoryItemListDto> {
        const merchantId = req?.user?.roles?.includes('system_admin') ? undefined : req?.user?.merchants?.[0]?.id;
        const searchDto: InventorySearchDto = {
            warehouseId,
            outOfStockOnly: true,
            includeProduct: true,
            includeWarehouse: true,
        };
        return this.inventoryService.getInventoryItems(searchDto, merchantId);
    }

    @Get('reports/inventory-value')
    @MerchantAdmin()
    @RequireMerchantManage()
    @ApiOperation({
        summary: 'Get inventory valuation report',
        description: 'Get inventory value across all warehouses',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Inventory valuation report generated successfully',
        schema: {
            type: 'object',
            properties: {
                totalValue: { type: 'number' },
                valueByWarehouse: { type: 'object' },
                valueByCategory: { type: 'object' },
                summary: { type: 'object' },
            },
        },
    })
    async getInventoryValueReport(@Request() req: any): Promise<any> {
        const merchantId = req.user.roles?.includes('system_admin') ? undefined : req.user.merchants?.[0]?.id;
        const searchDto: InventorySearchDto = {
            includeProduct: true,
            includeWarehouse: true,
            limit: 1000, // Get all items for valuation
        };
        const result = await this.inventoryService.getInventoryItems(searchDto, merchantId);

        // Calculate valuation metrics
        const totalValue = result.items.reduce((sum, item) => sum + (item.quantityOnHand * item.averageCost), 0);
        const valueByWarehouse = result.items.reduce((acc, item) => {
            const warehouseName = item.warehouse?.name || 'Unknown';
            acc[warehouseName] = (acc[warehouseName] || 0) + (item.quantityOnHand * item.averageCost);
            return acc;
        }, {} as Record<string, number>);

        return {
            totalValue,
            valueByWarehouse,
            totalItems: result.items.length,
            summary: result.summary,
        };
    }
}
