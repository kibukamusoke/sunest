import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUrl, IsUUID, MinLength, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name (internal identifier)',
    example: 'processors',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the category',
    example: 'Computer Processors',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Central Processing Units for computers and servers',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID for hierarchical structure',
    example: 'electronics-category-id',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    description: 'URL slug for SEO-friendly URLs',
    example: 'processors',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/categories/processors.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Sort order for category display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Computer Processors | Hardware World',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'High-performance computer processors from top brands like Intel and AMD',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Display name for the category',
    example: 'Computer Processors',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Central Processing Units for computers and servers',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID for hierarchical structure',
    example: 'electronics-category-id',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'URL slug for SEO-friendly URLs',
    example: 'processors',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/categories/processors.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Sort order for category display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Computer Processors | Hardware World',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'High-performance computer processors from top brands like Intel and AMD',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'category-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'processors',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Display name for the category',
    example: 'Computer Processors',
  })
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Central Processing Units for computers and servers',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/categories/processors.jpg',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: 'electronics-category-id',
  })
  parentId?: string;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Sort order for category display',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'URL slug for SEO-friendly URLs',
    example: 'processors',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Computer Processors | Hardware World',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'High-performance computer processors from top brands',
  })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Child categories (if requested)',
    type: [CategoryResponseDto],
  })
  children?: CategoryResponseDto[];

  @ApiPropertyOptional({
    description: 'Product count in this category (if requested)',
    example: 25,
  })
  productCount?: number;

  @ApiProperty({
    description: 'Created by user ID',
    example: 'admin-user-id',
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Updated by user ID',
    example: 'admin-user-id',
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

export class CategoryHierarchyDto {
  @ApiProperty({
    description: 'Root categories with nested children',
    type: [CategoryResponseDto],
  })
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: 'Total number of categories',
    example: 150,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Number of active categories',
    example: 142,
  })
  activeCount: number;
}
