import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsInt, Min, IsArray, ValidateNested, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentStatus } from '@prisma/client';

// ==================== CREATE SHIPMENT DTOs ====================

export class CreateShipmentItemDto {
  @ApiProperty({ 
    description: 'Order item ID',
    example: 'uuid-order-item-id'
  })
  @IsUUID()
  orderItemId: string;

  @ApiProperty({ 
    description: 'Quantity being shipped',
    example: 5,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  quantityShipped: number;
}

export class PackageDto {
  @ApiProperty({ 
    description: 'Package weight in kg',
    example: 2.5
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  weight: number;

  @ApiPropertyOptional({ 
    description: 'Package dimensions',
    example: { length: 30, width: 20, height: 15, unit: 'cm' }
  })
  @IsOptional()
  @IsObject()
  dimensions?: any;

  @ApiPropertyOptional({ 
    description: 'Package value for insurance',
    example: 500.00
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  value?: number;
}

export class CreateShipmentDto {
  @ApiProperty({ 
    description: 'Order ID for this shipment',
    example: 'uuid-order-id'
  })
  @IsUUID()
  orderId: string;

  @ApiPropertyOptional({ 
    description: 'Fulfillment ID if shipment is from fulfillment',
    example: 'uuid-fulfillment-id'
  })
  @IsOptional()
  @IsUUID()
  fulfillmentId?: string;

  @ApiProperty({ 
    description: 'Warehouse ID where shipment originates',
    example: 'uuid-warehouse-id'
  })
  @IsUUID()
  fromWarehouseId: string;

  @ApiPropertyOptional({ 
    description: 'Shipping carrier ID',
    example: 'uuid-carrier-id'
  })
  @IsOptional()
  @IsUUID()
  carrierId?: string;

  @ApiProperty({ 
    description: 'Shipping method/service',
    example: 'Ground'
  })
  @IsString()
  @IsNotEmpty()
  shippingMethod: string;

  @ApiProperty({ 
    description: 'Shipping cost',
    example: 15.99
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  shippingCost: number;

  @ApiProperty({ 
    description: 'Shipping address as JSON object',
    example: {
      name: 'Acme Corp Receiving',
      contactName: 'John Doe',
      addressLine1: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US'
    }
  })
  @IsObject()
  toAddress: any;

  @ApiPropertyOptional({ 
    description: 'Tracking number',
    example: '1Z12345E1234567890'
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Estimated delivery date',
    example: '2024-08-18T17:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiPropertyOptional({ 
    description: 'Package weight in kg',
    example: 2.5
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @ApiPropertyOptional({ 
    description: 'Package dimensions',
    example: { length: 30, width: 20, height: 15, unit: 'cm' }
  })
  @IsOptional()
  @IsObject()
  dimensions?: any;

  @ApiPropertyOptional({ 
    description: 'Number of packages',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  packageCount?: number;

  @ApiProperty({ 
    description: 'Items to include in this shipment',
    type: [CreateShipmentItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentItemDto)
  items: CreateShipmentItemDto[];
}

