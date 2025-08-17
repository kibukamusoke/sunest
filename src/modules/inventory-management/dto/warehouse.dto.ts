import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUUID, IsEnum, MinLength, MaxLength, Min } from 'class-validator';
import { WarehouseType } from '@prisma/client';

export class CreateWarehouseDto {
    @ApiProperty({
        description: 'Warehouse name',
        example: 'New York Distribution Center',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Warehouse code (unique identifier)',
        example: 'WH-NYC-01',
        minLength: 2,
        maxLength: 20,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    code: string;

    @ApiPropertyOptional({
        description: 'Warehouse description',
        example: 'Primary East Coast distribution center',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        description: 'Warehouse type',
        example: 'PHYSICAL',
        enum: WarehouseType,
    })
    @IsEnum(WarehouseType)
    type: WarehouseType;

    @ApiProperty({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
        maxLength: 200,
    })
    @IsString()
    @MaxLength(200)
    addressLine1: string;

    @ApiPropertyOptional({
        description: 'Address line 2',
        example: 'Suite 100',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine2?: string;

    @ApiProperty({
        description: 'City',
        example: 'Brooklyn',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    city: string;

    @ApiProperty({
        description: 'State/Province',
        example: 'NY',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    state: string;

    @ApiProperty({
        description: 'Postal code',
        example: '11201',
        maxLength: 20,
    })
    @IsString()
    @MaxLength(20)
    postalCode: string;

    @ApiProperty({
        description: 'Country',
        example: 'USA',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    country: string;

    @ApiPropertyOptional({
        description: 'Warehouse capacity in units',
        example: 100000,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiPropertyOptional({
        description: 'Parent warehouse ID for hierarchy',
        example: 'parent-warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({
        description: 'Merchant ID (null for system warehouses)',
        example: 'merchant-uuid',
    })
    @IsOptional()
    @IsUUID()
    merchantId?: string;
}

export class UpdateWarehouseDto {
    @ApiPropertyOptional({
        description: 'Warehouse name',
        example: 'New York Distribution Center',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({
        description: 'Warehouse description',
        example: 'Primary East Coast distribution center',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({
        description: 'Warehouse type',
        example: 'PHYSICAL',
        enum: WarehouseType,
    })
    @IsOptional()
    @IsEnum(WarehouseType)
    type?: WarehouseType;

    @ApiPropertyOptional({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine1?: string;

    @ApiPropertyOptional({
        description: 'Address line 2',
        example: 'Suite 100',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    addressLine2?: string;

    @ApiPropertyOptional({
        description: 'City',
        example: 'Brooklyn',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @ApiPropertyOptional({
        description: 'State/Province',
        example: 'NY',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @ApiPropertyOptional({
        description: 'Postal code',
        example: '11201',
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    postalCode?: string;

    @ApiPropertyOptional({
        description: 'Country',
        example: 'USA',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @ApiPropertyOptional({
        description: 'Warehouse capacity in units',
        example: 100000,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiPropertyOptional({
        description: 'Parent warehouse ID for hierarchy',
        example: 'parent-warehouse-uuid',
    })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({
        description: 'Whether the warehouse is active',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class WarehouseResponseDto {
    @ApiProperty({
        description: 'Warehouse ID',
        example: 'warehouse-uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Warehouse name',
        example: 'New York Distribution Center',
    })
    name: string;

    @ApiProperty({
        description: 'Warehouse code',
        example: 'WH-NYC-01',
    })
    code: string;

    @ApiPropertyOptional({
        description: 'Warehouse description',
        example: 'Primary East Coast distribution center',
    })
    description?: string;

    @ApiProperty({
        description: 'Warehouse type',
        example: 'PHYSICAL',
        enum: WarehouseType,
    })
    type: WarehouseType;

    @ApiProperty({
        description: 'Full address',
        example: '123 Industrial Blvd, Brooklyn, NY 11201, USA',
    })
    fullAddress: string;

    @ApiProperty({
        description: 'Address line 1',
        example: '123 Industrial Blvd',
    })
    addressLine1: string;

    @ApiPropertyOptional({
        description: 'Address line 2',
        example: 'Suite 100',
    })
    addressLine2?: string;

    @ApiProperty({
        description: 'City',
        example: 'Brooklyn',
    })
    city: string;

    @ApiProperty({
        description: 'State/Province',
        example: 'NY',
    })
    state: string;

    @ApiProperty({
        description: 'Postal code',
        example: '11201',
    })
    postalCode: string;

    @ApiProperty({
        description: 'Country',
        example: 'USA',
    })
    country: string;

    @ApiPropertyOptional({
        description: 'Warehouse capacity in units',
        example: 100000,
    })
    capacity?: number;

    @ApiProperty({
        description: 'Whether the warehouse is active',
        example: true,
    })
    isActive: boolean;

    @ApiPropertyOptional({
        description: 'Parent warehouse ID',
        example: 'parent-warehouse-uuid',
    })
    parentId?: string;

    @ApiPropertyOptional({
        description: 'Merchant ID',
        example: 'merchant-uuid',
    })
    merchantId?: string;

    @ApiPropertyOptional({
        description: 'Child warehouses (if requested)',
        type: [Object],
    })
    children?: WarehouseResponseDto[];

    @ApiPropertyOptional({
        description: 'Inventory statistics (if requested)',
    })
    inventoryStats?: {
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
        outOfStockItems: number;
    };

    @ApiPropertyOptional({
        description: 'Merchant information (if requested)',
    })
    merchant?: {
        id: string;
        name: string;
        displayName?: string;
    };

    @ApiProperty({
        description: 'Created by user ID',
        example: 'user-uuid',
    })
    createdBy?: string;

    @ApiProperty({
        description: 'Updated by user ID',
        example: 'user-uuid',
    })
    updatedBy?: string;

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

export class WarehouseListDto {
    @ApiProperty({
        description: 'List of warehouses',
        type: [WarehouseResponseDto],
    })
    warehouses: WarehouseResponseDto[];

    @ApiProperty({
        description: 'Pagination information',
    })
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class WarehouseSearchDto {
    @ApiPropertyOptional({
        description: 'Search query',
        example: 'New York',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Warehouse type filter',
        example: 'PHYSICAL',
        enum: WarehouseType,
    })
    @IsOptional()
    @IsEnum(WarehouseType)
    type?: WarehouseType;

    @ApiPropertyOptional({
        description: 'Merchant ID filter',
        example: 'merchant-uuid',
    })
    @IsOptional()
    @IsUUID()
    merchantId?: string;

    @ApiPropertyOptional({
        description: 'Active status filter',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Include inventory statistics',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    includeStats?: boolean;

    @ApiPropertyOptional({
        description: 'Include child warehouses',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    includeChildren?: boolean;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 20;
}
