import { PrismaService } from '../../config/prisma.service';
import { NotificationService } from '../notifications/notification.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, InventoryItemResponseDto, InventoryItemListDto, InventorySearchDto, BulkInventoryUpdateDto, CreateStockMovementDto, StockMovementResponseDto, StockMovementListDto, StockMovementSearchDto, StockAdjustmentDto, CreateInventoryPricingRuleDto, UpdateInventoryPricingRuleDto, InventoryPricingRuleResponseDto, InventoryPricingRuleListDto, PricingRuleSearchDto, PriceCalculationDto, PriceCalculationResponseDto } from './dto';
export declare class InventoryManagementService {
    private readonly prisma;
    private readonly notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    createInventoryItem(createInventoryItemDto: CreateInventoryItemDto, userId: string): Promise<InventoryItemResponseDto>;
    getInventoryItems(searchDto: InventorySearchDto, merchantId?: string, isPublicAccess?: boolean): Promise<InventoryItemListDto>;
    getInventoryItemById(itemId: string, merchantId?: string): Promise<InventoryItemResponseDto>;
    updateInventoryItem(itemId: string, updateInventoryItemDto: UpdateInventoryItemDto, merchantId?: string): Promise<InventoryItemResponseDto>;
    deleteInventoryItem(itemId: string, merchantId?: string): Promise<void>;
    bulkUpdateInventoryItems(bulkUpdateDto: BulkInventoryUpdateDto): Promise<{
        updated: number;
        errors: string[];
    }>;
    createStockMovement(createStockMovementDto: CreateStockMovementDto, userId: string): Promise<StockMovementResponseDto>;
    getStockMovements(searchDto: StockMovementSearchDto): Promise<StockMovementListDto>;
    adjustStock(adjustmentDto: StockAdjustmentDto, userId: string): Promise<StockMovementResponseDto>;
    createPricingRule(createPricingRuleDto: CreateInventoryPricingRuleDto): Promise<InventoryPricingRuleResponseDto>;
    updatePricingRule(ruleId: string, updatePricingRuleDto: UpdateInventoryPricingRuleDto): Promise<InventoryPricingRuleResponseDto>;
    deletePricingRule(ruleId: string): Promise<void>;
    getPricingRules(searchDto: PricingRuleSearchDto): Promise<InventoryPricingRuleListDto>;
    calculatePrice(priceCalculationDto: PriceCalculationDto): Promise<PriceCalculationResponseDto>;
    private mapToInventoryItemResponse;
    private mapToStockMovementResponse;
    private mapToPricingRuleResponse;
}
