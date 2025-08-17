import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchProductDto } from './search.dto';

export class SearchMetadataDto {
    @ApiProperty({
        description: 'Search execution time in milliseconds',
        example: 45,
    })
    executionTime: number;

    @ApiProperty({
        description: 'Applied filters summary',
        example: ['category:processors', 'brand:Intel'],
        type: [String],
    })
    appliedFilters: string[];

    @ApiPropertyOptional({
        description: 'Suggested search terms',
        example: ['intel core', 'intel processors'],
        type: [String],
    })
    suggestedTerms?: string[];

    @ApiPropertyOptional({
        description: 'Did you mean suggestions',
        example: ['intel core i7'],
        type: [String],
    })
    didYouMean?: string[];

    @ApiProperty({
        description: 'Total products found before pagination',
        example: 156,
    })
    totalFound: number;

    @ApiPropertyOptional({
        description: 'Search query that was executed',
        example: 'intel processor',
    })
    searchQuery?: string;

    @ApiPropertyOptional({
        description: 'Search type used',
        example: 'FULL_TEXT',
    })
    searchType?: string;
}

export class SearchPaginationDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Items per page',
        example: 20,
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of items',
        example: 156,
    })
    total: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 8,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Whether there is a next page',
        example: true,
    })
    hasNext: boolean;

    @ApiProperty({
        description: 'Whether there is a previous page',
        example: false,
    })
    hasPrev: boolean;
}

export class FilterOptionDto {
    @ApiProperty({
        description: 'Filter option value',
        example: 'Intel',
    })
    value: string;

    @ApiProperty({
        description: 'Display label for the option',
        example: 'Intel Corporation',
    })
    label: string;

    @ApiProperty({
        description: 'Number of products matching this filter',
        example: 45,
    })
    count: number;

    @ApiPropertyOptional({
        description: 'Whether this filter is currently selected',
        example: false,
    })
    selected?: boolean;
}

export class PriceRangeFilterDto {
    @ApiProperty({
        description: 'Minimum price in the range',
        example: 89.99,
    })
    min: number;

    @ApiProperty({
        description: 'Maximum price in the range',
        example: 899.99,
    })
    max: number;

    @ApiProperty({
        description: 'Suggested price step for sliders',
        example: 10,
    })
    step: number;

    @ApiPropertyOptional({
        description: 'Currently selected minimum',
        example: 200,
    })
    selectedMin?: number;

    @ApiPropertyOptional({
        description: 'Currently selected maximum',
        example: 500,
    })
    selectedMax?: number;
}

export class AvailableSpecificationFilterDto {
    @ApiProperty({
        description: 'Specification name',
        example: 'cores',
    })
    name: string;

    @ApiProperty({
        description: 'Display label',
        example: 'Number of Cores',
    })
    label: string;

    @ApiProperty({
        description: 'Available specification values',
        type: [FilterOptionDto],
    })
    options: FilterOptionDto[];

    @ApiProperty({
        description: 'Filter type',
        example: 'multiselect',
        enum: ['select', 'multiselect', 'range', 'boolean'],
    })
    type: string;

    @ApiPropertyOptional({
        description: 'Unit of measurement',
        example: 'cores',
    })
    unit?: string;
}

export class AvailableFiltersDto {
    @ApiPropertyOptional({
        description: 'Price range filter',
        type: PriceRangeFilterDto,
    })
    priceRange?: PriceRangeFilterDto;

    @ApiPropertyOptional({
        description: 'Brand filters',
        type: [FilterOptionDto],
    })
    brands?: FilterOptionDto[];

    @ApiPropertyOptional({
        description: 'Category filters',
        type: [FilterOptionDto],
    })
    categories?: FilterOptionDto[];

    @ApiPropertyOptional({
        description: 'Merchant filters',
        type: [FilterOptionDto],
    })
    merchants?: FilterOptionDto[];

    @ApiPropertyOptional({
        description: 'Specification filters',
        type: [AvailableSpecificationFilterDto],
    })
    specifications?: AvailableSpecificationFilterDto[];

    @ApiPropertyOptional({
        description: 'Availability filters',
        type: [FilterOptionDto],
    })
    availability?: FilterOptionDto[];

    @ApiPropertyOptional({
        description: 'Other dynamic filters',
        type: Object,
    })
    other?: Record<string, FilterOptionDto[]>;
}

export class ProductSearchResponseDto {
    @ApiProperty({
        description: 'Search results',
        type: [SearchProductDto],
    })
    products: SearchProductDto[];

    @ApiProperty({
        description: 'Pagination information',
        type: SearchPaginationDto,
    })
    pagination: SearchPaginationDto;

    @ApiProperty({
        description: 'Search metadata',
        type: SearchMetadataDto,
    })
    metadata: SearchMetadataDto;

    @ApiPropertyOptional({
        description: 'Available filters for current search',
        type: AvailableFiltersDto,
    })
    availableFilters?: AvailableFiltersDto;

    @ApiPropertyOptional({
        description: 'Search facets and aggregations',
        type: Object,
    })
    facets?: Record<string, any>;
}

export class BulkSkuSearchResponseDto {
    @ApiProperty({
        description: 'Found products mapped by SKU',
        type: Object,
    })
    found: Record<string, SearchProductDto>;

    @ApiProperty({
        description: 'SKUs that were not found',
        example: ['INVALID-SKU-1', 'OUT-OF-STOCK-SKU'],
        type: [String],
    })
    notFound: string[];

    @ApiProperty({
        description: 'Total number of SKUs searched',
        example: 15,
    })
    totalSearched: number;

    @ApiProperty({
        description: 'Number of SKUs found',
        example: 13,
    })
    totalFound: number;

    @ApiProperty({
        description: 'Search execution time in milliseconds',
        example: 125,
    })
    executionTime: number;
}

export class SearchSuggestionResponseDto {
    @ApiProperty({
        description: 'Product name suggestions',
        example: ['Intel Core i7', 'Intel Core i9', 'Intel Xeon'],
        type: [String],
    })
    products: string[];

    @ApiProperty({
        description: 'Category suggestions',
        example: ['Processors', 'Graphics Cards'],
        type: [String],
    })
    categories: string[];

    @ApiProperty({
        description: 'Brand suggestions',
        example: ['Intel', 'AMD'],
        type: [String],
    })
    brands: string[];

    @ApiProperty({
        description: 'Popular search suggestions',
        example: ['intel processor', 'graphics card'],
        type: [String],
    })
    popular: string[];

    @ApiProperty({
        description: 'Total number of suggestions',
        example: 8,
    })
    total: number;

    @ApiProperty({
        description: 'Search term used for suggestions',
        example: 'intel',
    })
    searchTerm: string;
}

export class QuickSearchResponseDto {
    @ApiProperty({
        description: 'Quick search results (limited)',
        type: [SearchProductDto],
    })
    products: SearchProductDto[];

    @ApiProperty({
        description: 'Total matches found',
        example: 156,
    })
    totalMatches: number;

    @ApiProperty({
        description: 'Whether more results are available',
        example: true,
    })
    hasMore: boolean;

    @ApiProperty({
        description: 'Search suggestions',
        type: [String],
    })
    suggestions: string[];

    @ApiProperty({
        description: 'Search execution time',
        example: 23,
    })
    executionTime: number;
}

export class SearchHistoryDto {
    @ApiProperty({
        description: 'Search term',
        example: 'intel processor',
    })
    searchTerm: string;

    @ApiProperty({
        description: 'Number of results found',
        example: 45,
    })
    resultCount: number;

    @ApiProperty({
        description: 'When the search was performed',
        example: '2024-01-15T10:30:00Z',
    })
    searchedAt: Date;

    @ApiProperty({
        description: 'Search type used',
        example: 'FULL_TEXT',
    })
    searchType: string;

    @ApiPropertyOptional({
        description: 'Filters that were applied',
        type: Object,
    })
    filters?: Record<string, any>;
}

export class PopularSearchDto {
    @ApiProperty({
        description: 'Search term',
        example: 'graphics card',
    })
    term: string;

    @ApiProperty({
        description: 'Number of times searched',
        example: 1250,
    })
    count: number;

    @ApiProperty({
        description: 'Trend direction',
        example: 'up',
        enum: ['up', 'down', 'stable'],
    })
    trend: string;

    @ApiPropertyOptional({
        description: 'Average result count',
        example: 45,
    })
    avgResultCount?: number;
}
