import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUUID, IsObject, IsEnum, ValidateNested, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SearchFiltersDto } from './search.dto';

export enum AlertFrequency {
    IMMEDIATE = 'IMMEDIATE',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export class CreateSavedSearchDto {
    @ApiProperty({
        description: 'Name for the saved search',
        example: 'High-end Graphics Cards',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiPropertyOptional({
        description: 'Search term',
        example: 'graphics card',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    searchTerm?: string;

    @ApiProperty({
        description: 'Search filters configuration',
        type: Object,
    })
    @IsObject()
    filters: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Alert when new products match this search',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    alertOnNewResults?: boolean = false;

    @ApiPropertyOptional({
        description: 'Alert when prices change for matching products',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    alertOnPriceChange?: boolean = false;

    @ApiPropertyOptional({
        description: 'Alert frequency',
        example: 'DAILY',
        enum: AlertFrequency,
    })
    @IsOptional()
    @IsEnum(AlertFrequency)
    alertFrequency?: AlertFrequency = AlertFrequency.DAILY;

    @ApiPropertyOptional({
        description: 'Price change threshold percentage for alerts',
        example: 5,
        minimum: 1,
        maximum: 50,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    priceChangeThreshold?: number = 5;

    @ApiPropertyOptional({
        description: 'Description or notes for this saved search',
        example: 'Monitor high-end graphics cards for upcoming project',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateSavedSearchDto {
    @ApiPropertyOptional({
        description: 'Name for the saved search',
        example: 'Updated High-end Graphics Cards',
        minLength: 1,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    name?: string;

    @ApiPropertyOptional({
        description: 'Search term',
        example: 'high-end graphics card',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    searchTerm?: string;

    @ApiPropertyOptional({
        description: 'Search filters configuration',
        type: Object,
    })
    @IsOptional()
    @IsObject()
    filters?: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Alert when new products match this search',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    alertOnNewResults?: boolean;

    @ApiPropertyOptional({
        description: 'Alert when prices change for matching products',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    alertOnPriceChange?: boolean;

    @ApiPropertyOptional({
        description: 'Alert frequency',
        example: 'WEEKLY',
        enum: AlertFrequency,
    })
    @IsOptional()
    @IsEnum(AlertFrequency)
    alertFrequency?: AlertFrequency;

    @ApiPropertyOptional({
        description: 'Price change threshold percentage for alerts',
        example: 10,
        minimum: 1,
        maximum: 50,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    priceChangeThreshold?: number;

    @ApiPropertyOptional({
        description: 'Description or notes for this saved search',
        example: 'Updated description',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Whether the saved search is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class SavedSearchResponseDto {
    @ApiProperty({
        description: 'Saved search ID',
        example: 'saved-search-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'User ID who owns this search',
        example: 'user-uuid',
    })
    userId: string;

    @ApiProperty({
        description: 'Search name',
        example: 'High-end Graphics Cards',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Search term',
        example: 'graphics card',
    })
    searchTerm?: string;

    @ApiProperty({
        description: 'Search filters',
        type: Object,
    })
    filters: Record<string, any>;

    @ApiProperty({
        description: 'Alert settings',
    })
    alerts: {
        onNewResults: boolean;
        onPriceChange: boolean;
        frequency: AlertFrequency;
        priceChangeThreshold: number;
    };

    @ApiProperty({
        description: 'Search statistics',
    })
    statistics: {
        lastExecuted?: Date;
        resultCount: number;
        executionCount: number;
        avgExecutionTime?: number;
    };

    @ApiPropertyOptional({
        description: 'Description or notes',
        example: 'Monitor high-end graphics cards',
    })
    description?: string;

    @ApiProperty({
        description: 'Whether the search is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    updatedAt: Date;
}

export class SavedSearchListDto {
    @ApiProperty({
        description: 'List of saved searches',
        type: [SavedSearchResponseDto],
    })
    searches: SavedSearchResponseDto[];

    @ApiProperty({
        description: 'Total count of saved searches',
        example: 15,
    })
    total: number;

    @ApiProperty({
        description: 'Active searches count',
        example: 12,
    })
    activeCount: number;

    @ApiProperty({
        description: 'Searches with alerts enabled',
        example: 8,
    })
    alertEnabledCount: number;
}

export class ExecuteSavedSearchDto {
    @ApiProperty({
        description: 'Saved search ID to execute',
        example: 'saved-search-uuid',
    })
    @IsUUID()
    searchId: string;

    @ApiPropertyOptional({
        description: 'Override pagination - page number',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Override pagination - items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'Include availability information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includeAvailability?: boolean = true;

    @ApiPropertyOptional({
        description: 'Include pricing information',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    includePricing?: boolean = true;

    @ApiPropertyOptional({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    warehouseId?: string;
}

export class SearchAlertDto {
    @ApiProperty({
        description: 'Alert ID',
        example: 'alert-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Saved search that triggered this alert',
        type: SavedSearchResponseDto,
    })
    savedSearch: SavedSearchResponseDto;

    @ApiProperty({
        description: 'Alert type',
        example: 'NEW_RESULTS',
        enum: ['NEW_RESULTS', 'PRICE_CHANGE', 'BACK_IN_STOCK'],
    })
    alertType: string;

    @ApiProperty({
        description: 'Alert message',
        example: '5 new products found matching your saved search',
    })
    message: string;

    @ApiProperty({
        description: 'Number of new results (for NEW_RESULTS alerts)',
        example: 5,
    })
    newResultCount?: number;

    @ApiProperty({
        description: 'Price changes (for PRICE_CHANGE alerts)',
        type: [Object],
    })
    priceChanges?: Array<{
        productId: string;
        productName: string;
        oldPrice: number;
        newPrice: number;
        changePercentage: number;
    }>;

    @ApiProperty({
        description: 'Alert created timestamp',
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Whether alert has been read',
        example: false,
    })
    isRead: boolean;
}

export class SearchAlertListDto {
    @ApiProperty({
        description: 'List of search alerts',
        type: [SearchAlertDto],
    })
    alerts: SearchAlertDto[];

    @ApiProperty({
        description: 'Total count of alerts',
        example: 25,
    })
    total: number;

    @ApiProperty({
        description: 'Unread alerts count',
        example: 8,
    })
    unreadCount: number;

    @ApiProperty({
        description: 'Pagination information',
    })
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class MarkAlertReadDto {
    @ApiProperty({
        description: 'Alert ID to mark as read',
        example: 'alert-uuid',
    })
    @IsUUID()
    alertId: string;
}

export class BulkMarkAlertsReadDto {
    @ApiProperty({
        description: 'Alert IDs to mark as read',
        example: ['alert-1-uuid', 'alert-2-uuid'],
        type: [String],
    })
    @IsUUID(4, { each: true })
    alertIds: string[];
}

export class SearchPreferencesDto {
    @ApiPropertyOptional({
        description: 'Default items per page for searches',
        example: 20,
        minimum: 10,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(10)
    @Max(100)
    defaultPageSize?: number = 20;

    @ApiPropertyOptional({
        description: 'Default sort field',
        example: 'relevance',
    })
    @IsOptional()
    @IsString()
    defaultSortField?: string = 'relevance';

    @ApiPropertyOptional({
        description: 'Default sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    @IsString()
    defaultSortOrder?: string = 'desc';

    @ApiPropertyOptional({
        description: 'Auto-save search history',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    saveSearchHistory?: boolean = true;

    @ApiPropertyOptional({
        description: 'Enable search suggestions',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    enableSuggestions?: boolean = true;

    @ApiPropertyOptional({
        description: 'Enable typo correction',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    enableTypoCorrection?: boolean = true;

    @ApiPropertyOptional({
        description: 'Preferred categories for search',
        example: ['processors', 'graphics-cards'],
        type: [String],
    })
    @IsOptional()
    @IsString({ each: true })
    preferredCategories?: string[];

    @ApiPropertyOptional({
        description: 'Preferred brands for search',
        example: ['Intel', 'AMD', 'NVIDIA'],
        type: [String],
    })
    @IsOptional()
    @IsString({ each: true })
    preferredBrands?: string[];

    @ApiPropertyOptional({
        description: 'Default warehouse for availability filtering',
        example: 'warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    defaultWarehouseId?: string;

    @ApiPropertyOptional({
        description: 'Email notification preferences',
    })
    @IsOptional()
    emailNotifications?: {
        enabled: boolean;
        frequency: AlertFrequency;
        digest: boolean;
    };
}
