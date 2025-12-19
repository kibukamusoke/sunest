import { InventoryManagementService } from './inventory-management.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, InventoryItemResponseDto, InventoryItemListDto, InventorySearchDto, BulkInventoryUpdateDto, CreateStockMovementDto, StockMovementResponseDto, StockMovementListDto, StockMovementSearchDto, StockAdjustmentDto, CreateInventoryPricingRuleDto, UpdateInventoryPricingRuleDto, InventoryPricingRuleResponseDto, InventoryPricingRuleListDto, PricingRuleSearchDto, PriceCalculationDto, PriceCalculationResponseDto } from './dto';
export declare class InventoryManagementController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryManagementService);
    createInventoryItem(createInventoryItemDto: CreateInventoryItemDto, req: any): Promise<InventoryItemResponseDto>;
    getInventoryItems(searchDto: InventorySearchDto, req: any): Promise<InventoryItemListDto>;
    getMerchantInventoryItems(searchDto: InventorySearchDto, req: any): Promise<InventoryItemListDto>;
    getInventoryItemById(id: string, req: any): Promise<InventoryItemResponseDto>;
    updateInventoryItem(id: string, updateInventoryItemDto: UpdateInventoryItemDto, req: any): Promise<InventoryItemResponseDto>;
    deleteInventoryItem(id: string, req: any): Promise<void>;
    bulkUpdateInventory(bulkUpdateDto: BulkInventoryUpdateDto, req: any): Promise<{
        success: number;
        errors: any[];
    }>;
    createStockMovement(createMovementDto: CreateStockMovementDto, req: any): Promise<StockMovementResponseDto>;
    getStockMovements(searchDto: StockMovementSearchDto): Promise<StockMovementListDto>;
    adjustStock(adjustmentDto: StockAdjustmentDto, req: any): Promise<StockMovementResponseDto>;
    createPricingRule(createRuleDto: CreateInventoryPricingRuleDto, req: any): Promise<InventoryPricingRuleResponseDto>;
    getPricingRules(searchDto: PricingRuleSearchDto): Promise<InventoryPricingRuleListDto>;
    updatePricingRule(id: string, updateRuleDto: UpdateInventoryPricingRuleDto, req: any): Promise<InventoryPricingRuleResponseDto>;
    deletePricingRule(id: string): Promise<void>;
    calculatePrice(calculationDto: PriceCalculationDto): Promise<PriceCalculationResponseDto>;
    getLowStockReport(req?: any): Promise<InventoryItemListDto>;
    getOutOfStockReport(req?: any): Promise<InventoryItemListDto>;
    getInventoryValueReport(req: any): Promise<any>;
}
