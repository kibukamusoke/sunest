import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsInt,
  IsUUID,
  MinLength,
  MaxLength,
  Min
} from 'class-validator';
import { AttributeType } from '@prisma/client';

export class CreateProductAttributeTemplateDto {
  @ApiProperty({
    description: 'Attribute name (internal identifier)',
    example: 'processor_cores',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the attribute',
    example: 'Number of Cores',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Attribute description',
    example: 'Total number of processor cores',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Attribute type',
    example: 'NUMBER',
    enum: AttributeType,
  })
  @IsEnum(AttributeType)
  type: AttributeType;

  @ApiPropertyOptional({
    description: 'Whether this attribute is required',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this attribute can be used for filtering',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFilterable?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this attribute can be used for product variants',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isVariant?: boolean;

  @ApiPropertyOptional({
    description: 'Possible options for SELECT/MULTI_SELECT types',
    example: ['2', '4', '6', '8', '12', '16'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({
    description: 'Validation rules as JSON string',
    example: '{"min": 1, "max": 128}',
  })
  @IsOptional()
  @IsString()
  validation?: string;

  @ApiProperty({
    description: 'Category ID this attribute template belongs to',
    example: 'processors-category-id',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Measurement unit for the attribute',
    example: 'cores',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;
}

export class UpdateProductAttributeTemplateDto {
  @ApiPropertyOptional({
    description: 'Display name for the attribute',
    example: 'Number of Cores',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Attribute description',
    example: 'Total number of processor cores',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Attribute type',
    example: 'NUMBER',
    enum: AttributeType,
  })
  @IsOptional()
  @IsEnum(AttributeType)
  type?: AttributeType;

  @ApiPropertyOptional({
    description: 'Whether this attribute is required',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this attribute can be used for filtering',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFilterable?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this attribute can be used for product variants',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isVariant?: boolean;

  @ApiPropertyOptional({
    description: 'Possible options for SELECT/MULTI_SELECT types',
    example: ['2', '4', '6', '8', '12', '16'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({
    description: 'Validation rules as JSON string',
    example: '{"min": 1, "max": 128}',
  })
  @IsOptional()
  @IsString()
  validation?: string;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Measurement unit for the attribute',
    example: 'cores',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiPropertyOptional({
    description: 'Whether the attribute template is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProductAttributeTemplateResponseDto {
  @ApiProperty({
    description: 'Attribute template ID',
    example: 'attribute-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Attribute name',
    example: 'processor_cores',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the attribute',
    example: 'Number of Cores',
  })
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Attribute description',
    example: 'Total number of processor cores',
  })
  description?: string;

  @ApiProperty({
    description: 'Attribute type',
    example: 'NUMBER',
    enum: AttributeType,
  })
  type: AttributeType;

  @ApiProperty({
    description: 'Whether this attribute is required',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'Whether this attribute can be used for filtering',
    example: true,
  })
  isFilterable: boolean;

  @ApiProperty({
    description: 'Whether this attribute can be used for product variants',
    example: false,
  })
  isVariant: boolean;

  @ApiProperty({
    description: 'Possible options for SELECT/MULTI_SELECT types',
    example: ['2', '4', '6', '8', '12', '16'],
    type: [String],
  })
  options: string[];

  @ApiPropertyOptional({
    description: 'Validation rules as JSON object',
    example: { min: 1, max: 128 },
  })
  validation?: object;

  @ApiPropertyOptional({
    description: 'Category ID this attribute template belongs to',
    example: 'processors-category-id',
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder: number;

  @ApiPropertyOptional({
    description: 'Measurement unit for the attribute',
    example: 'cores',
  })
  unit?: string;

  @ApiProperty({
    description: 'Whether the attribute template is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Category information (if requested)',
  })
  category?: {
    id: string;
    name: string;
    displayName?: string;
  };

  @ApiPropertyOptional({
    description: 'Name of parent category this attribute was inherited from (if applicable)',
    example: 'Electronics',
  })
  inheritedFrom?: string;

  @ApiProperty({
    description: 'Created by user ID',
    example: 'admin-user-id',
  })
  createdBy?: string;

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

export class ProductAttributeTemplateListDto {
  @ApiProperty({
    description: 'List of attribute templates',
    type: [ProductAttributeTemplateResponseDto],
  })
  attributes: ProductAttributeTemplateResponseDto[];

  @ApiProperty({
    description: 'Total number of attribute templates',
    example: 15,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Number of active attribute templates',
    example: 12,
  })
  activeCount: number;
}

export class BulkCreateAttributeTemplatesDto {
  @ApiProperty({
    description: 'Array of attribute templates to create',
    type: [CreateProductAttributeTemplateDto],
  })
  attributes: CreateProductAttributeTemplateDto[];
}

export class AttributeValueDto {
  @ApiProperty({
    description: 'Attribute template ID',
    example: 'attribute-uuid',
  })
  @IsUUID()
  attributeId: string;

  @ApiProperty({
    description: 'Attribute value',
    example: '8',
  })
  @IsString()
  value: string;
}

export class ProductAttributeValueDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product-uuid',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Array of attribute values for the product',
    type: [AttributeValueDto],
  })
  @IsArray()
  attributes: AttributeValueDto[];
}

export class AttributeFilterDto {
  @ApiPropertyOptional({
    description: 'Category ID to filter attributes',
    example: 'category-uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Attribute type filter',
    enum: AttributeType,
  })
  @IsOptional()
  @IsEnum(AttributeType)
  type?: AttributeType;

  @ApiPropertyOptional({
    description: 'Filter by required attributes only',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requiredOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by filterable attributes only',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  filterableOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by variant attributes only',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  variantOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active attributes only',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean;
}
