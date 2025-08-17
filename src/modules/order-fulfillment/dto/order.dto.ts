import { IsString, IsUUID, IsEmail, IsOptional, IsBoolean, IsEnum, IsDecimal, IsDateString, IsInt, Min, IsArray, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, FulfillmentStatus, PaymentStatus, PaymentMethod, OrderEventType } from '@prisma/client';

// ==================== CREATE ORDER DTOs ====================

export class CreateOrderItemDto {
    @ApiPropertyOptional({
        description: 'Product ID',
        example: 'uuid-product-id'
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiPropertyOptional({
        description: 'Product variant ID',
        example: 'uuid-variant-id'
    })
    @IsOptional()
    @IsUUID()
    productVariantId?: string;

    @ApiPropertyOptional({
        description: 'Custom product name (for quote-derived items)',
        example: 'Custom Steel Component'
    })
    @IsOptional()
    @IsString()
    customProductName?: string;

    @ApiPropertyOptional({
        description: 'Custom SKU',
        example: 'CUSTOM-001'
    })
    @IsOptional()
    @IsString()
    customSku?: string;

    @ApiPropertyOptional({
        description: 'Custom product description',
        example: 'Custom manufactured steel component per specifications'
    })
    @IsOptional()
    @IsString()
    customDescription?: string;

    @ApiProperty({
        description: 'Quantity ordered',
        example: 10,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 99.99
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    unitPrice: number;

    @ApiPropertyOptional({
        description: 'Item-specific delivery date',
        example: '2024-08-15T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    requestedDeliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Item notes',
        example: 'Customer prefers blue color if available'
    })
    @IsOptional()
    @IsString()
    itemNotes?: string;
}

export class CreateOrderDto {
    @ApiPropertyOptional({
        description: 'Checkout ID to create order from',
        example: 'uuid-checkout-id'
    })
    @IsOptional()
    @IsUUID()
    checkoutId?: string;

    @ApiPropertyOptional({
        description: 'Quote ID to create order from',
        example: 'uuid-quote-id'
    })
    @IsOptional()
    @IsUUID()
    quoteId?: string;

    @ApiProperty({
        description: 'Customer purchase order number',
        example: 'PO-2024-001'
    })
    @IsOptional()
    @IsString()
    purchaseOrderNumber?: string;

    @ApiProperty({
        description: 'Company ID for B2B orders',
        example: 'uuid-company-id'
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiProperty({
        description: 'Shipping address ID',
        example: 'uuid-address-id'
    })
    @IsUUID()
    shippingAddressId: string;

    @ApiProperty({
        description: 'Billing address ID',
        example: 'uuid-address-id'
    })
    @IsUUID()
    billingAddressId: string;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.CORPORATE_ACCOUNT
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Requested delivery date',
        example: '2024-08-15T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    requestedDeliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Customer notes',
        example: 'Please deliver after 2 PM'
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Special delivery instructions',
        example: 'Fragile items - handle with care'
    })
    @IsOptional()
    @IsString()
    specialInstructions?: string;

    @ApiPropertyOptional({
        description: 'Mark as rush order',
        example: false
    })
    @IsOptional()
    @IsBoolean()
    rushOrder?: boolean;

    @ApiPropertyOptional({
        description: 'Credit terms',
        example: 'NET30'
    })
    @IsOptional()
    @IsString()
    creditTerms?: string;

    @ApiProperty({
        description: 'Order items to create',
        type: [CreateOrderItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}

// ==================== UPDATE ORDER DTOs ====================

export class UpdateOrderDto {
    @ApiPropertyOptional({
        description: 'Customer purchase order number',
        example: 'PO-2024-001-UPDATED'
    })
    @IsOptional()
    @IsString()
    purchaseOrderNumber?: string;

    @ApiPropertyOptional({
        description: 'Order status',
        enum: OrderStatus,
        example: OrderStatus.CONFIRMED
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({
        description: 'Payment status',
        enum: PaymentStatus,
        example: PaymentStatus.CAPTURED
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;

    @ApiPropertyOptional({
        description: 'Requested delivery date',
        example: '2024-08-20T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    requestedDeliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Customer notes',
        example: 'Updated delivery instructions'
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Internal notes',
        example: 'Customer contacted about delay'
    })
    @IsOptional()
    @IsString()
    internalNotes?: string;

    @ApiPropertyOptional({
        description: 'Special delivery instructions',
        example: 'Updated: Use loading dock entrance'
    })
    @IsOptional()
    @IsString()
    specialInstructions?: string;

    @ApiPropertyOptional({
        description: 'Payment reference',
        example: 'PAY-REF-12345'
    })
    @IsOptional()
    @IsString()
    paymentReference?: string;
}

export class UpdateOrderItemDto {
    @ApiPropertyOptional({
        description: 'Quantity ordered',
        example: 15,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number;

    @ApiPropertyOptional({
        description: 'Unit price',
        example: 89.99
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    unitPrice?: number;

    @ApiPropertyOptional({
        description: 'Item-specific delivery date',
        example: '2024-08-20T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    requestedDeliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Item notes',
        example: 'Updated customer preferences'
    })
    @IsOptional()
    @IsString()
    itemNotes?: string;
}

// ==================== FILTER DTOs ====================

export class OrderFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by order status',
        enum: OrderStatus,
        example: OrderStatus.PROCESSING
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({
        description: 'Filter by fulfillment status',
        enum: FulfillmentStatus,
        example: FulfillmentStatus.PICKING
    })
    @IsOptional()
    @IsEnum(FulfillmentStatus)
    fulfillmentStatus?: FulfillmentStatus;

    @ApiPropertyOptional({
        description: 'Filter by payment status',
        enum: PaymentStatus,
        example: PaymentStatus.CAPTURED
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;

    @ApiPropertyOptional({
        description: 'Filter by company ID',
        example: 'uuid-company-id'
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiPropertyOptional({
        description: 'Filter by user ID',
        example: 'uuid-user-id'
    })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({
        description: 'Filter by order number',
        example: 'HW-2024-000001'
    })
    @IsOptional()
    @IsString()
    orderNumber?: string;

    @ApiPropertyOptional({
        description: 'Filter by purchase order number',
        example: 'PO-2024-001'
    })
    @IsOptional()
    @IsString()
    purchaseOrderNumber?: string;

    @ApiPropertyOptional({
        description: 'Filter orders created after date',
        example: '2024-08-01T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    createdAfter?: string;

    @ApiPropertyOptional({
        description: 'Filter orders created before date',
        example: '2024-08-31T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    createdBefore?: string;

    @ApiPropertyOptional({
        description: 'Filter rush orders',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    rushOrder?: boolean;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number;

    @ApiPropertyOptional({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ['createdAt', 'orderNumber', 'totalAmount', 'status']
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE DTOs ====================

export class OrderItemResponseDto {
    @ApiProperty({ description: 'Order item ID' })
    id: string;

    @ApiPropertyOptional({ description: 'Product information' })
    product?: {
        id: string;
        name: string;
        sku: string;
        images: string[];
    };

    @ApiPropertyOptional({ description: 'Product variant information' })
    productVariant?: {
        id: string;
        name: string;
        sku: string;
        attributes: any;
    };

    @ApiPropertyOptional({ description: 'Custom product name' })
    customProductName?: string;

    @ApiPropertyOptional({ description: 'Custom SKU' })
    customSku?: string;

    @ApiPropertyOptional({ description: 'Custom description' })
    customDescription?: string;

    @ApiProperty({ description: 'Quantity ordered' })
    quantity: number;

    @ApiProperty({ description: 'Unit price' })
    unitPrice: number;

    @ApiProperty({ description: 'Total price' })
    totalPrice: number;

    @ApiProperty({ description: 'Quantity fulfilled' })
    quantityFulfilled: number;

    @ApiProperty({ description: 'Quantity shipped' })
    quantityShipped: number;

    @ApiProperty({ description: 'Quantity delivered' })
    quantityDelivered: number;

    @ApiProperty({ description: 'Quantity cancelled' })
    quantityCancelled: number;

    @ApiPropertyOptional({ description: 'Requested delivery date' })
    requestedDeliveryDate?: Date;

    @ApiPropertyOptional({ description: 'Estimated delivery date' })
    estimatedDeliveryDate?: Date;

    @ApiPropertyOptional({ description: 'Item notes' })
    itemNotes?: string;

    // Product snapshot data (preserves product state at time of order)
    @ApiPropertyOptional({ description: 'Complete product data snapshot at time of order' })
    productSnapshot?: any;

    @ApiPropertyOptional({ description: 'Complete variant data snapshot at time of order' })
    variantSnapshot?: any;

    @ApiPropertyOptional({ description: 'When the product snapshot was created' })
    snapshotCreatedAt?: Date;

    @ApiProperty({ description: 'Product name at time of order (snapshot)' })
    productName: string;

    @ApiProperty({ description: 'Product SKU at time of order (snapshot)' })
    productSku: string;

    @ApiPropertyOptional({ description: 'Product brand at time of order (snapshot)' })
    productBrand?: string;

    @ApiPropertyOptional({ description: 'Product category at time of order (snapshot)' })
    productCategory?: string;

    @ApiPropertyOptional({ description: 'Product images at time of order (snapshot)' })
    productImages?: string[];

    @ApiPropertyOptional({ description: 'Variant name at time of order (snapshot)' })
    variantName?: string;

    @ApiPropertyOptional({ description: 'Variant SKU at time of order (snapshot)' })
    variantSku?: string;

    @ApiPropertyOptional({ description: 'Variant attributes at time of order (snapshot)' })
    variantAttributes?: any;

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class OrderResponseDto {
    @ApiProperty({ description: 'Order ID' })
    id: string;

    @ApiProperty({ description: 'Order number' })
    orderNumber: string;

    @ApiPropertyOptional({ description: 'Purchase order number' })
    purchaseOrderNumber?: string;

    @ApiProperty({ description: 'User information' })
    user: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiPropertyOptional({ description: 'Company information' })
    company?: {
        id: string;
        name: string;
        displayName?: string;
    };

    @ApiProperty({ description: 'Shipping address' })
    shippingAddress: {
        id: string;
        name: string;
        contactName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    @ApiProperty({ description: 'Billing address' })
    billingAddress: {
        id: string;
        name: string;
        contactName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    @ApiProperty({ description: 'Order totals' })
    subtotal: number;

    @ApiProperty({ description: 'Tax amount' })
    taxAmount: number;

    @ApiProperty({ description: 'Shipping amount' })
    shippingAmount: number;

    @ApiProperty({ description: 'Discount amount' })
    discountAmount: number;

    @ApiProperty({ description: 'Total amount' })
    totalAmount: number;

    @ApiProperty({ description: 'Currency' })
    currency: string;

    @ApiProperty({ description: 'Order status', enum: OrderStatus })
    status: OrderStatus;

    @ApiProperty({ description: 'Fulfillment status', enum: FulfillmentStatus })
    fulfillmentStatus: FulfillmentStatus;

    @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
    paymentStatus: PaymentStatus;

    @ApiPropertyOptional({ description: 'Requested delivery date' })
    requestedDeliveryDate?: Date;

    @ApiPropertyOptional({ description: 'Estimated delivery date' })
    estimatedDeliveryDate?: Date;

    @ApiPropertyOptional({ description: 'Actual delivery date' })
    actualDeliveryDate?: Date;

    @ApiPropertyOptional({ description: 'Customer notes' })
    customerNotes?: string;

    @ApiPropertyOptional({ description: 'Internal notes' })
    internalNotes?: string;

    @ApiPropertyOptional({ description: 'Special instructions' })
    specialInstructions?: string;

    @ApiProperty({ description: 'Rush order flag' })
    rushOrder: boolean;

    @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({ description: 'Payment reference' })
    paymentReference?: string;

    @ApiPropertyOptional({ description: 'Credit terms' })
    creditTerms?: string;

    @ApiProperty({ description: 'Order items', type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Confirmed date' })
    confirmedAt?: Date;

    @ApiPropertyOptional({ description: 'Shipped date' })
    shippedAt?: Date;

    @ApiPropertyOptional({ description: 'Delivered date' })
    deliveredAt?: Date;
}

export class OrderListResponseDto {
    @ApiProperty({ description: 'Orders', type: [OrderResponseDto] })
    orders: OrderResponseDto[];

    @ApiProperty({ description: 'Total count of orders matching filter' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Items per page' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

// ==================== ORDER EVENT DTOs ====================

export class CreateOrderEventDto {
    @ApiProperty({
        description: 'Event type',
        enum: OrderEventType,
        example: OrderEventType.ORDER_CONFIRMED
    })
    @IsEnum(OrderEventType)
    eventType: OrderEventType;

    @ApiProperty({
        description: 'Event description',
        example: 'Order confirmed and ready for fulfillment'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({
        description: 'Additional event metadata',
        example: { previousStatus: 'PENDING', newStatus: 'CONFIRMED' }
    })
    @IsOptional()
    metadata?: any;
}

export class OrderEventResponseDto {
    @ApiProperty({ description: 'Event ID' })
    id: string;

    @ApiProperty({ description: 'Event type', enum: OrderEventType })
    eventType: OrderEventType;

    @ApiProperty({ description: 'Event description' })
    description: string;

    @ApiPropertyOptional({ description: 'User who triggered the event' })
    user?: {
        id: string;
        email: string;
        displayName?: string;
    };

    @ApiPropertyOptional({ description: 'Additional event metadata' })
    metadata?: any;

    @ApiProperty({ description: 'Event timestamp' })
    createdAt: Date;
}

export class OrderTimelineResponseDto {
    @ApiProperty({ description: 'Order events', type: [OrderEventResponseDto] })
    events: OrderEventResponseDto[];

    @ApiProperty({ description: 'Order summary' })
    orderSummary: {
        id: string;
        orderNumber: string;
        status: OrderStatus;
        fulfillmentStatus: FulfillmentStatus;
        paymentStatus: PaymentStatus;
        totalAmount: number;
        createdAt: Date;
    };
}

// ==================== ORDER ANALYTICS DTOs ====================

export class OrderAnalyticsResponseDto {
    @ApiProperty({ description: 'Total orders count' })
    totalOrders: number;

    @ApiProperty({ description: 'Total order value' })
    totalValue: number;

    @ApiProperty({ description: 'Average order value' })
    averageOrderValue: number;

    @ApiProperty({ description: 'Orders by status' })
    ordersByStatus: Record<OrderStatus, number>;

    @ApiProperty({ description: 'Orders by fulfillment status' })
    ordersByFulfillmentStatus: Record<FulfillmentStatus, number>;

    @ApiProperty({ description: 'Orders by payment status' })
    ordersByPaymentStatus: Record<PaymentStatus, number>;

    @ApiProperty({ description: 'Rush orders count' })
    rushOrders: number;

    @ApiProperty({ description: 'On-time delivery rate (percentage)' })
    onTimeDeliveryRate: number;

    @ApiProperty({ description: 'Average fulfillment time (hours)' })
    averageFulfillmentTime: number;

    @ApiProperty({ description: 'Period start date' })
    periodStart: Date;

    @ApiProperty({ description: 'Period end date' })
    periodEnd: Date;
}
