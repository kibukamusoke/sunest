import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsDecimal, 
  IsUUID, 
  IsArray, 
  IsEnum, 
  IsInt, 
  IsUrl,
  MinLength, 
  MaxLength, 
  Min,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Intel Core i7-12700K',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the product',
    example: 'Intel Core i7-12700K Desktop Processor',
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: '12th Gen Intel Core i7-12700K desktop processor with 12 cores and 20 threads...',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Short product description for listings',
    example: 'High-performance 12-core desktop processor',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'INTEL-i7-12700K',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({
    description: 'Product barcode',
    example: '5032037234051',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer Part Number',
    example: 'BX8071512700K',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mpn?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'processors-category-id',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Intel',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'Core i7-12700K',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: 0.2,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions as JSON string',
    example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({
    description: 'Base product price',
    example: 299.99,
    minimum: 0,
  })
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Manufacturer Suggested Retail Price',
    example: 349.99,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  msrp?: number;

  @ApiPropertyOptional({
    description: 'Merchant cost price',
    example: 250.00,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Product images URLs',
    example: ['https://example.com/intel-i7-front.jpg', 'https://example.com/intel-i7-back.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product videos URLs',
    example: ['https://example.com/intel-i7-demo.mp4'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  videos?: string[];

  @ApiPropertyOptional({
    description: 'Product documents URLs',
    example: ['https://example.com/intel-i7-specs.pdf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  documents?: string[];

  @ApiPropertyOptional({
    description: 'Whether the product is digital',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to track inventory for this product',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum order quantity',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Order multiple (must order in multiples of this number)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderMultiple?: number;

  @ApiProperty({
    description: 'Product URL slug',
    example: 'intel-core-i7-12700k',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({
    description: 'Product tags for search',
    example: ['intel', 'processor', 'desktop', '12th-gen'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Buy Intel Core i7-12700K 12-core desktop processor online at Hardware World',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Intel Core i7-12700K',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Display name for the product',
    example: 'Intel Core i7-12700K Desktop Processor',
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: '12th Gen Intel Core i7-12700K desktop processor with 12 cores and 20 threads...',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Short product description for listings',
    example: 'High-performance 12-core desktop processor',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Product barcode',
    example: '5032037234051',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer Part Number',
    example: 'BX8071512700K',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mpn?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: 'processors-category-id',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Intel',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'Core i7-12700K',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: 0.2,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions as JSON string',
    example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Base product price',
    example: 299.99,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    description: 'Manufacturer Suggested Retail Price',
    example: 349.99,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  msrp?: number;

  @ApiPropertyOptional({
    description: 'Merchant cost price',
    example: 250.00,
    minimum: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Product images URLs',
    example: ['https://example.com/intel-i7-front.jpg', 'https://example.com/intel-i7-back.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Product videos URLs',
    example: ['https://example.com/intel-i7-demo.mp4'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  videos?: string[];

  @ApiPropertyOptional({
    description: 'Product documents URLs',
    example: ['https://example.com/intel-i7-specs.pdf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  documents?: string[];

  @ApiPropertyOptional({
    description: 'Product status',
    example: 'PUBLISHED',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Whether the product is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the product is digital',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to track inventory for this product',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum order quantity',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({
    description: 'Order multiple (must order in multiples of this number)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderMultiple?: number;

  @ApiPropertyOptional({
    description: 'Product URL slug',
    example: 'intel-core-i7-12700k',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product tags for search',
    example: ['intel', 'processor', 'desktop', '12th-gen'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Buy Intel Core i7-12700K 12-core desktop processor online at Hardware World',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Intel Core i7-12700K',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the product',
    example: 'Intel Core i7-12700K Desktop Processor',
  })
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: '12th Gen Intel Core i7-12700K desktop processor...',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Short product description for listings',
    example: 'High-performance 12-core desktop processor',
  })
  shortDescription?: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'INTEL-i7-12700K',
  })
  sku: string;

  @ApiPropertyOptional({
    description: 'Product barcode',
    example: '5032037234051',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer Part Number',
    example: 'BX8071512700K',
  })
  mpn?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'processors-category-id',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Merchant ID',
    example: 'merchant-uuid',
  })
  merchantId: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Intel',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product model',
    example: 'Core i7-12700K',
  })
  model?: string;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: 0.2,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions as JSON string',
    example: '{"length": 3.75, "width": 3.75, "height": 0.3, "unit": "cm"}',
  })
  dimensions?: string;

  @ApiProperty({
    description: 'Base product price',
    example: 299.99,
  })
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Manufacturer Suggested Retail Price',
    example: 349.99,
  })
  msrp?: number;

  @ApiPropertyOptional({
    description: 'Merchant cost price',
    example: 250.00,
  })
  costPrice?: number;

  @ApiProperty({
    description: 'Product images URLs',
    example: ['https://example.com/intel-i7-front.jpg'],
    type: [String],
  })
  images: string[];

  @ApiProperty({
    description: 'Product videos URLs',
    example: ['https://example.com/intel-i7-demo.mp4'],
    type: [String],
  })
  videos: string[];

  @ApiProperty({
    description: 'Product documents URLs',
    example: ['https://example.com/intel-i7-specs.pdf'],
    type: [String],
  })
  documents: string[];

  @ApiProperty({
    description: 'Product status',
    example: 'PUBLISHED',
    enum: ProductStatus,
  })
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the product is digital',
    example: false,
  })
  isDigital: boolean;

  @ApiProperty({
    description: 'Whether to track inventory for this product',
    example: true,
  })
  trackInventory: boolean;

  @ApiProperty({
    description: 'Minimum order quantity',
    example: 1,
  })
  minimumOrderQuantity: number;

  @ApiProperty({
    description: 'Order multiple',
    example: 1,
  })
  orderMultiple: number;

  @ApiProperty({
    description: 'Product URL slug',
    example: 'intel-core-i7-12700k',
  })
  slug: string;

  @ApiProperty({
    description: 'Product tags for search',
    example: ['intel', 'processor', 'desktop', '12th-gen'],
    type: [String],
  })
  tags: string[];

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Intel Core i7-12700K Desktop Processor | Hardware World',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Buy Intel Core i7-12700K 12-core desktop processor online',
  })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Category information (if requested)',
  })
  category?: {
    id: string;
    name: string;
    displayName?: string;
  };

  @ApiPropertyOptional({
    description: 'Merchant information (if requested)',
  })
  merchant?: {
    id: string;
    name: string;
    businessName?: string;
  };

  @ApiPropertyOptional({
    description: 'Product variants (if requested)',
    type: [Object],
  })
  variants?: any[];

  @ApiProperty({
    description: 'Created by user ID',
    example: 'merchant-user-id',
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Updated by user ID',
    example: 'merchant-user-id',
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

export class ProductListDto {
  @ApiProperty({
    description: 'List of products',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];

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

export class ProductSearchDto {
  @ApiPropertyOptional({
    description: 'Search query',
    example: 'Intel processor',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Category ID filter',
    example: 'processors-category-id',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Merchant ID filter',
    example: 'merchant-uuid',
  })
  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @ApiPropertyOptional({
    description: 'Product status filter',
    example: 'PUBLISHED',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Brand filter',
    example: 'Intel',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 100,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 500,
  })
  @IsOptional()
  @IsDecimal()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Tags filter (comma-separated)',
    example: 'intel,desktop',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
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
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['name', 'basePrice', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
