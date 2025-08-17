import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsDecimal, 
  IsUUID, 
  IsArray, 
  IsInt, 
  IsUrl,
  MinLength, 
  MaxLength, 
  Min,
  IsObject
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Variant SKU (must be unique)',
    example: 'INTEL-i7-12700K-TRAY',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sku: string;

  @ApiProperty({
    description: 'Variant name',
    example: 'Tray Version',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Variant attributes as JSON string',
    example: '{"packaging": "tray", "warranty": "1-year"}',
  })
  @IsString()
  attributes: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price (overrides product base price)',
    example: 279.99,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Variant-specific cost price',
    example: 230.00,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Variant weight in kg',
    example: 0.15,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '5032037234068',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant Manufacturer Part Number',
    example: 'CM8071504553828',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mpn?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific images URLs',
    example: ['https://example.com/intel-i7-tray.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Minimum order quantity for this variant',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Order multiple for this variant',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderMultiple?: number;

  @ApiPropertyOptional({
    description: 'Whether this is the default variant',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateProductVariantDto {
  @ApiPropertyOptional({
    description: 'Variant name',
    example: 'Tray Version',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Variant attributes as JSON string',
    example: '{"packaging": "tray", "warranty": "2-year"}',
  })
  @IsOptional()
  @IsString()
  attributes?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price (overrides product base price)',
    example: 279.99,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Variant-specific cost price',
    example: 230.00,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Variant weight in kg',
    example: 0.15,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '5032037234068',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant Manufacturer Part Number',
    example: 'CM8071504553828',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mpn?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific images URLs',
    example: ['https://example.com/intel-i7-tray.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Minimum order quantity for this variant',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Order multiple for this variant',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderMultiple?: number;

  @ApiPropertyOptional({
    description: 'Whether the variant is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is the default variant',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class ProductVariantResponseDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 'variant-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID this variant belongs to',
    example: 'product-uuid',
  })
  productId: string;

  @ApiProperty({
    description: 'Variant SKU',
    example: 'INTEL-i7-12700K-TRAY',
  })
  sku: string;

  @ApiProperty({
    description: 'Variant name',
    example: 'Tray Version',
  })
  name: string;

  @ApiProperty({
    description: 'Variant attributes as JSON object',
    example: { packaging: 'tray', warranty: '1-year' },
  })
  attributes: object;

  @ApiPropertyOptional({
    description: 'Variant-specific price',
    example: 279.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Variant-specific cost price',
    example: 230.00,
  })
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Variant weight in kg',
    example: 0.15,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '5032037234068',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant Manufacturer Part Number',
    example: 'CM8071504553828',
  })
  mpn?: string;

  @ApiProperty({
    description: 'Variant-specific images URLs',
    example: ['https://example.com/intel-i7-tray.jpg'],
    type: [String],
  })
  images: string[];

  @ApiProperty({
    description: 'Minimum order quantity for this variant',
    example: 1,
  })
  minimumOrderQuantity: number;

  @ApiProperty({
    description: 'Order multiple for this variant',
    example: 1,
  })
  orderMultiple: number;

  @ApiProperty({
    description: 'Whether the variant is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether this is the default variant',
    example: false,
  })
  isDefault: boolean;

  @ApiPropertyOptional({
    description: 'Product information (if requested)',
  })
  product?: {
    id: string;
    name: string;
    basePrice: number;
  };

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

export class ProductVariantListDto {
  @ApiProperty({
    description: 'List of product variants',
    type: [ProductVariantResponseDto],
  })
  variants: ProductVariantResponseDto[];

  @ApiProperty({
    description: 'Total number of variants for the product',
    example: 3,
  })
  totalCount: number;
}

export class BulkCreateVariantsDto {
  @ApiProperty({
    description: 'Array of variant data to create',
    type: [CreateProductVariantDto],
  })
  variants: CreateProductVariantDto[];
}

export class BulkUpdateVariantsDto {
  @ApiProperty({
    description: 'Array of variant updates with IDs',
    type: [Object],
  })
  variants: Array<{
    id: string;
    data: UpdateProductVariantDto;
  }>;
}

export class VariantAttributeDto {
  @ApiProperty({
    description: 'Attribute name',
    example: 'color',
  })
  name: string;

  @ApiProperty({
    description: 'Attribute display name',
    example: 'Color',
  })
  displayName: string;

  @ApiProperty({
    description: 'Possible attribute values',
    example: ['Red', 'Blue', 'Green'],
    type: [String],
  })
  values: string[];

  @ApiProperty({
    description: 'Whether this attribute is required for variants',
    example: true,
  })
  required: boolean;
}

export class GenerateVariantsDto {
  @ApiProperty({
    description: 'Attributes to generate variants from',
    type: [VariantAttributeDto],
  })
  attributes: VariantAttributeDto[];

  @ApiPropertyOptional({
    description: 'Base SKU pattern (will append variant suffix)',
    example: 'INTEL-i7-12700K',
  })
  @IsOptional()
  @IsString()
  baseSkuPattern?: string;

  @ApiPropertyOptional({
    description: 'Whether to set first variant as default',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  setFirstAsDefault?: boolean;
}
