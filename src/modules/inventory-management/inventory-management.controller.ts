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
import {
  SystemAdmin,
  MerchantAdmin,
  MerchantUser,
} from '../../common/decorators/roles.decorator';
import {
  RequireSystemManage,
  RequireMerchantManage,
} from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { InventoryManagementService } from './inventory-management.service';
import {
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
@ApiBearerAuth()
export class InventoryManagementController {
  constructor(private readonly inventoryService: InventoryManagementService) {}

  // ==================== INVENTORY ITEM MANAGEMENT ====================

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Create inventory item',
    description: 'Create a new inventory item for a product',
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
    description:
      'Inventory item already exists for this product/variant/batch combination',
  })
  async createInventoryItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto,
    @Request() req: any,
  ): Promise<InventoryItemResponseDto> {
    return this.inventoryService.createInventoryItem(
      createInventoryItemDto,
      req.user.userId,
    );
  }

  @Get('items')
  @Public()
  @ApiOperation({
    summary: 'Get inventory items',
    description:
      'Retrieve inventory items with filtering, search, and pagination. Authenticated merchants see only their inventory. Public access shows only published products.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory items retrieved successfully',
    type: InventoryItemListDto,
  })
  async getInventoryItems(
    @Query() searchDto: InventorySearchDto,
    @Request() req: any,
  ): Promise<InventoryItemListDto> {
    // Check if user is authenticated (for merchant access)
    if (req.user) {
      // For system admin, don't filter by merchant (can see all)
      // For merchant users, filter by their merchant
      const merchantId = req.user.roles?.includes('system_admin')
        ? undefined
        : req.user.merchants?.[0]?.id;
      return this.inventoryService.getInventoryItems(
        searchDto,
        merchantId,
        false,
      );
    } else {
      // Public access - only show published products
      return this.inventoryService.getInventoryItems(
        searchDto,
        undefined,
        true,
      );
    }
  }

  @Get('merchant/items')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantUser()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Get merchant inventory items',
    description:
      'Retrieve inventory items for the authenticated merchant only.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Merchant inventory items retrieved successfully',
    type: InventoryItemListDto,
  })
  async getMerchantInventoryItems(
    @Query() searchDto: InventorySearchDto,
    @Request() req: any,
  ): Promise<InventoryItemListDto> {
    // Extract merchant ID from authenticated user
    const merchantId = req.user?.merchants?.[0]?.id;
    if (!merchantId) {
      throw new Error('User is not associated with any merchant');
    }
    return this.inventoryService.getInventoryItems(
      searchDto,
      merchantId,
      false,
    );
  }

  @Get('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantUser()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Get inventory item by ID',
    description:
      'Retrieve detailed information about a specific inventory item',
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
  async getInventoryItemById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<InventoryItemResponseDto> {
    // For system admin, don't filter by merchant (can see all)
    // For merchant users, filter by their merchant
    const merchantId = req.user.roles?.includes('system_admin')
      ? undefined
      : req.user.merchants?.[0]?.id;
    return this.inventoryService.getInventoryItemById(id, merchantId);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Update inventory item',
    description:
      'Update inventory item information including stock levels and settings',
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
    // For system admin, don't filter by merchant (can see all)
    // For merchant users, filter by their merchant
    const merchantId = req.user.roles?.includes('system_admin')
      ? undefined
      : req.user.merchants?.[0]?.id;
    return this.inventoryService.updateInventoryItem(
      id,
      updateInventoryItemDto,
      merchantId,
    );
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
  async deleteInventoryItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<void> {
    // For system admin, don't filter by merchant (can see all)
    // For merchant users, filter by their merchant
    const merchantId = req.user.roles?.includes('system_admin')
      ? undefined
      : req.user.merchants?.[0]?.id;
    return this.inventoryService.deleteInventoryItem(id, merchantId);
  }

  @Post('items/bulk-update')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
    const result =
      await this.inventoryService.bulkUpdateInventoryItems(bulkUpdateDto);
    return { success: result.updated, errors: result.errors };
  }

  // ==================== STOCK MOVEMENT MANAGEMENT ====================

  @Post('movements')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Create stock movement',
    description:
      'Record a stock movement (receipt, shipment, adjustment, etc.)',
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
    return this.inventoryService.createStockMovement(
      createMovementDto,
      req.user.userId,
    );
  }

  @Get('movements')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
  async getStockMovements(
    @Query() searchDto: StockMovementSearchDto,
  ): Promise<StockMovementListDto> {
    return this.inventoryService.getStockMovements(searchDto);
  }

  @Post('adjustments')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Adjust stock levels',
    description:
      'Manually adjust inventory quantities (cycle counts, corrections, etc.)',
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
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
    return this.inventoryService.createPricingRule(createRuleDto);
  }

  @Get('pricing-rules')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
  async getPricingRules(
    @Query() searchDto: PricingRuleSearchDto,
  ): Promise<InventoryPricingRuleListDto> {
    return this.inventoryService.getPricingRules(searchDto);
  }

  @Put('pricing-rules/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
    return this.inventoryService.updatePricingRule(id, updateRuleDto);
  }

  @Delete('pricing-rules/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
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
  async deletePricingRule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.inventoryService.deletePricingRule(id);
  }

  @Post('pricing/calculate')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantUser()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Calculate price',
    description:
      'Calculate the final price for a given quantity based on pricing rules',
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
  async calculatePrice(
    @Body() calculationDto: PriceCalculationDto,
  ): Promise<PriceCalculationResponseDto> {
    return this.inventoryService.calculatePrice(calculationDto);
  }

  // ==================== INVENTORY REPORTS ====================

  @Get('reports/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantUser()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Get low stock report',
    description: 'Get items that are at or below their minimum stock levels',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock report generated successfully',
    type: InventoryItemListDto,
  })
  async getLowStockReport(@Request() req?: any): Promise<InventoryItemListDto> {
    const merchantId = req?.user?.roles?.includes('system_admin')
      ? undefined
      : req?.user?.merchants?.[0]?.id;
    const searchDto: InventorySearchDto = {
      lowStockOnly: true,
      includeProduct: true,
    };
    return this.inventoryService.getInventoryItems(searchDto, merchantId);
  }

  @Get('reports/out-of-stock')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantUser()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Get out of stock report',
    description: 'Get items that are completely out of stock',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Out of stock report generated successfully',
    type: InventoryItemListDto,
  })
  async getOutOfStockReport(
    @Request() req?: any,
  ): Promise<InventoryItemListDto> {
    const merchantId = req?.user?.roles?.includes('system_admin')
      ? undefined
      : req?.user?.merchants?.[0]?.id;
    const searchDto: InventorySearchDto = {
      outOfStockOnly: true,
      includeProduct: true,
    };
    return this.inventoryService.getInventoryItems(searchDto, merchantId);
  }

  @Get('reports/inventory-value')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @MerchantAdmin()
  @RequireMerchantManage()
  @ApiOperation({
    summary: 'Get inventory valuation report',
    description: 'Get total inventory value for all products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory valuation report generated successfully',
    schema: {
      type: 'object',
      properties: {
        totalValue: { type: 'number' },
        valueByCategory: { type: 'object' },
        summary: { type: 'object' },
      },
    },
  })
  async getInventoryValueReport(@Request() req: any): Promise<any> {
    const merchantId = req.user.roles?.includes('system_admin')
      ? undefined
      : req.user.merchants?.[0]?.id;
    const searchDto: InventorySearchDto = {
      includeProduct: true,
      limit: 1000, // Get all items for valuation
    };
    const result = await this.inventoryService.getInventoryItems(
      searchDto,
      merchantId,
    );

    // Calculate valuation metrics
    const totalValue = result.items.reduce(
      (sum, item) => sum + item.quantityOnHand * item.averageCost,
      0,
    );

    return {
      totalValue,
      totalItems: result.items.length,
      summary: result.summary,
    };
  }
}
