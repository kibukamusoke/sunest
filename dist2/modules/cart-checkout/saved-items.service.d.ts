import { PrismaService } from '../../config/prisma.service';
import { CreateSavedItemDto, UpdateSavedItemDto, SavedItemResponseDto, SavedItemsFilterDto, SavedItemsListDto, AddSavedItemToCartDto, BulkAddSavedItemsToCartDto } from './dto';
export declare class SavedItemsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createSavedItem(createDto: CreateSavedItemDto, userId: string): Promise<SavedItemResponseDto>;
    updateSavedItem(itemId: string, updateDto: UpdateSavedItemDto, userId: string): Promise<SavedItemResponseDto>;
    deleteSavedItem(itemId: string, userId: string): Promise<void>;
    getSavedItem(itemId: string, userId: string): Promise<SavedItemResponseDto>;
    listSavedItems(filterDto: SavedItemsFilterDto, userId: string): Promise<SavedItemsListDto>;
    addSavedItemToCart(itemId: string, cartId: string, addToCartDto: AddSavedItemToCartDto, userId: string): Promise<any>;
    bulkAddSavedItemsToCart(cartId: string, bulkAddDto: BulkAddSavedItemsToCartDto, userId: string): Promise<any[]>;
    private getAvailableLists;
    private getAvailableTags;
    private getSavedItemIncludeOptions;
    private mapSavedItemToResponseDto;
    private calculateItemAvailability;
}
