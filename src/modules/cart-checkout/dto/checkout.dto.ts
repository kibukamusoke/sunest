import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, IsPositive, IsEnum, IsDateString, IsDecimal, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, CheckoutStatus, ApprovalStatus } from '@prisma/client';
import { AddressResponseDto } from './address.dto';

// ==================== CHECKOUT DTOs ====================

export class InitiateCheckoutDto {
    @ApiProperty({
        description: 'Cart ID to checkout',
        example: 'clh1234567890',
    })
    @IsUUID()
    cartId: string;

    @ApiPropertyOptional({
        description: 'Company ID for B2B context',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;
}

export class UpdateCheckoutShippingDto {
    @ApiProperty({
        description: 'Shipping address ID',
        example: 'clh1234567890',
    })
    @IsUUID()
    shippingAddressId: string;

    @ApiPropertyOptional({
        description: 'Preferred delivery date',
        example: '2024-09-15T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    preferredDeliveryDate?: string;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Leave at loading dock if no one available',
    })
    @IsOptional()
    @IsString()
    deliveryInstructions?: string;

    @ApiPropertyOptional({
        description: 'Shipping method',
        example: 'Standard Ground',
    })
    @IsOptional()
    @IsString()
    shippingMethod?: string;
}

export class UpdateCheckoutBillingDto {
    @ApiProperty({
        description: 'Billing address ID',
        example: 'clh1234567890',
    })
    @IsUUID()
    billingAddressId: string;
}

export class UpdateCheckoutPaymentDto {
    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.CORPORATE_ACCOUNT,
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Encrypted payment details (for credit cards)',
        example: 'encrypted_payment_token_12345',
    })
    @IsOptional()
    @IsString()
    paymentDetails?: string;

    @ApiPropertyOptional({
        description: 'Purchase order number (for corporate purchases)',
        example: 'PO-2024-08-001',
    })
    @IsOptional()
    @IsString()
    purchaseOrderNumber?: string;
}

export class UpdateCheckoutNotesDto {
    @ApiPropertyOptional({
        description: 'Customer notes for the order',
        example: 'Please coordinate delivery with our receiving department',
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Internal notes (admin/merchant only)',
        example: 'Large order - may require freight shipping',
    })
    @IsOptional()
    @IsString()
    internalNotes?: string;
}

export class SubmitCheckoutDto {
    @ApiPropertyOptional({
        description: 'Final customer notes',
        example: 'Rush order - needed by end of week',
    })
    @IsOptional()
    @IsString()
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Whether to bypass approval for authorized users',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    bypassApproval?: boolean;
}

export class ApproveCheckoutDto {
    @ApiProperty({
        description: 'Approval decision',
        example: true,
    })
    @IsBoolean()
    approved: boolean;

    @ApiPropertyOptional({
        description: 'Approval notes',
        example: 'Approved with budget allocation from Q3 capital expenses',
    })
    @IsOptional()
    @IsString()
    approvalNotes?: string;

    @ApiPropertyOptional({
        description: 'Rejection reason (if not approved)',
        example: 'Exceeds monthly budget limit',
    })
    @IsOptional()
    @IsString()
    rejectionReason?: string;
}

// ==================== CHECKOUT CALCULATION DTOs ====================

export class CheckoutCalculationDto {
    @ApiProperty({
        description: 'Items subtotal',
        example: 2499.95,
    })
    subtotal: number;

    @ApiProperty({
        description: 'Tax amount',
        example: 199.99,
    })
    taxAmount: number;

    @ApiProperty({
        description: 'Shipping amount',
        example: 49.99,
    })
    shippingAmount: number;

    @ApiProperty({
        description: 'Discount amount',
        example: 100.00,
    })
    discountAmount: number;

    @ApiProperty({
        description: 'Total amount',
        example: 2649.93,
    })
    totalAmount: number;

    @ApiProperty({
        description: 'Currency',
        example: 'USD',
    })
    currency: string;

    @ApiProperty({
        description: 'Tax breakdown by jurisdiction',
        example: {
            'state': { rate: 0.06, amount: 149.99 },
            'local': { rate: 0.02, amount: 50.00 }
        },
    })
    taxBreakdown: Record<string, {
        rate: number;
        amount: number;
        description?: string;
    }>;

    @ApiProperty({
        description: 'Applied discounts',
        type: [Object],
        example: [
            {
                type: 'volume_discount',
                description: 'Volume discount (>$2000)',
                amount: 100.00,
                percentage: 4.0
            }
        ],
    })
    appliedDiscounts: Array<{
        type: string;
        description: string;
        amount: number;
        percentage?: number;
    }>;

    @ApiProperty({
        description: 'Shipping options',
        type: [Object],
        example: [
            {
                method: 'Standard Ground',
                cost: 49.99,
                estimatedDays: 5
            },
            {
                method: 'Express',
                cost: 129.99,
                estimatedDays: 2
            }
        ],
    })
    shippingOptions: Array<{
        method: string;
        cost: number;
        estimatedDays: number;
        description?: string;
    }>;
}

// ==================== CHECKOUT RESPONSE DTOs ====================

export class CheckoutItemDto {
    @ApiProperty({
        description: 'Checkout item ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiProperty({
        description: 'Product information',
    })
    product: {
        id: string;
        name: string;
        sku: string;
        brand?: string;
        images: string[];
    };

    @ApiPropertyOptional({
        description: 'Product variant information',
    })
    productVariant?: {
        id: string;
        sku: string;
        name: string;
        attributes: Record<string, any>;
    };

    @ApiProperty({
        description: 'Quantity',
        example: 5,
    })
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 299.99,
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Total price',
        example: 1499.95,
    })
    totalPrice: number;

    @ApiProperty({
        description: 'Whether item is approved',
        example: true,
    })
    isApproved: boolean;

    @ApiPropertyOptional({
        description: 'Required delivery date',
        example: '2024-09-15T00:00:00Z',
    })
    requiredByDate?: string;

    @ApiPropertyOptional({
        description: 'Item notes',
        example: 'Please ensure 240V configuration',
    })
    notes?: string;
}

export class CheckoutResponseDto {
    @ApiProperty({
        description: 'Checkout ID',
        example: 'clh1234567890',
    })
    id: string;

    @ApiProperty({
        description: 'Cart ID',
        example: 'clh1234567890',
    })
    cartId: string;

    @ApiProperty({
        description: 'User ID',
        example: 'clh1234567890',
    })
    userId: string;

    @ApiPropertyOptional({
        description: 'Company information',
    })
    company?: {
        id: string;
        name: string;
        domain: string;
    };

    @ApiPropertyOptional({
        description: 'Shipping address',
        type: AddressResponseDto,
    })
    shippingAddress?: AddressResponseDto;

    @ApiPropertyOptional({
        description: 'Billing address',
        type: AddressResponseDto,
    })
    billingAddress?: AddressResponseDto;

    @ApiPropertyOptional({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.CORPORATE_ACCOUNT,
    })
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Purchase order number',
        example: 'PO-2024-08-001',
    })
    purchaseOrderNumber?: string;

    @ApiProperty({
        description: 'Pricing calculation',
        type: CheckoutCalculationDto,
    })
    calculation: CheckoutCalculationDto;

    @ApiProperty({
        description: 'Checkout status',
        enum: CheckoutStatus,
        example: CheckoutStatus.PENDING,
    })
    status: CheckoutStatus;

    @ApiProperty({
        description: 'Whether checkout requires approval',
        example: false,
    })
    requiresApproval: boolean;

    @ApiProperty({
        description: 'Approval status',
        enum: ApprovalStatus,
        example: ApprovalStatus.NONE,
    })
    approvalStatus: ApprovalStatus;

    @ApiPropertyOptional({
        description: 'Approval requested timestamp',
        example: '2024-08-07T15:30:00Z',
    })
    approvalRequestedAt?: Date;

    @ApiPropertyOptional({
        description: 'ID of user who requested approval',
        example: 'clh1234567890',
    })
    approvalRequestedBy?: string;

    @ApiPropertyOptional({
        description: 'Approval timestamp',
        example: '2024-08-07T15:45:00Z',
    })
    approvedAt?: Date;

    @ApiPropertyOptional({
        description: 'ID of user who approved',
        example: 'clh1234567890',
    })
    approvedBy?: string;

    @ApiPropertyOptional({
        description: 'Rejection timestamp',
        example: '2024-08-07T15:45:00Z',
    })
    rejectedAt?: Date;

    @ApiPropertyOptional({
        description: 'ID of user who rejected',
        example: 'clh1234567890',
    })
    rejectedBy?: string;

    @ApiPropertyOptional({
        description: 'Rejection reason',
        example: 'Exceeds monthly budget limit',
    })
    rejectionReason?: string;

    @ApiPropertyOptional({
        description: 'Preferred delivery date',
        example: '2024-09-15T00:00:00Z',
    })
    preferredDeliveryDate?: Date;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Leave at loading dock if no one available',
    })
    deliveryInstructions?: string;

    @ApiPropertyOptional({
        description: 'Shipping method',
        example: 'Standard Ground',
    })
    shippingMethod?: string;

    @ApiPropertyOptional({
        description: 'Customer notes',
        example: 'Rush order - needed by end of week',
    })
    customerNotes?: string;

    @ApiPropertyOptional({
        description: 'Internal notes',
        example: 'Large order - may require freight shipping',
    })
    internalNotes?: string;

    @ApiPropertyOptional({
        description: 'Created order ID (when checkout completes)',
        example: 'clh1234567890',
    })
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Payment intent ID (Stripe, etc.)',
        example: 'pi_1234567890',
    })
    paymentIntentId?: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-08-07T15:30:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-08-07T15:35:00Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Completion timestamp',
        example: '2024-08-07T16:00:00Z',
    })
    completedAt?: Date;
}

// ==================== CHECKOUT LIST DTOs ====================

export class CheckoutFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by status',
        enum: CheckoutStatus,
        example: CheckoutStatus.PENDING_APPROVAL,
    })
    @IsOptional()
    @IsEnum(CheckoutStatus)
    status?: CheckoutStatus;

    @ApiPropertyOptional({
        description: 'Filter by approval status',
        enum: ApprovalStatus,
        example: ApprovalStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(ApprovalStatus)
    approvalStatus?: ApprovalStatus;

    @ApiPropertyOptional({
        description: 'Filter by company ID',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiPropertyOptional({
        description: 'Filter by user ID',
        example: 'clh1234567890',
    })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({
        description: 'Filter by minimum total amount',
        example: 1000.00,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    minAmount?: number;

    @ApiPropertyOptional({
        description: 'Filter by maximum total amount',
        example: 5000.00,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    maxAmount?: number;

    @ApiPropertyOptional({
        description: 'Filter by creation date from',
        example: '2024-08-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    createdFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter by creation date to',
        example: '2024-08-31T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    createdTo?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'desc',
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}

export class CheckoutListDto {
    @ApiProperty({
        description: 'List of checkouts',
        type: [CheckoutResponseDto],
    })
    checkouts: CheckoutResponseDto[];

    @ApiProperty({
        description: 'Total number of checkouts',
        example: 45,
    })
    total: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 20,
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 3,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Whether there are more pages',
        example: true,
    })
    hasNext: boolean;

    @ApiProperty({
        description: 'Whether there are previous pages',
        example: false,
    })
    hasPrev: boolean;
}

// ==================== APPROVAL WORKFLOW DTOs ====================

export class ApprovalRequirementDto {
    @ApiProperty({
        description: 'Whether approval is required',
        example: true,
    })
    required: boolean;

    @ApiProperty({
        description: 'Reason for approval requirement',
        example: 'Order total exceeds user approval limit of $1,000',
    })
    reason: string;

    @ApiProperty({
        description: 'User approval limit',
        example: 1000.00,
    })
    userApprovalLimit: number;

    @ApiProperty({
        description: 'Order total amount',
        example: 2649.93,
    })
    orderTotal: number;

    @ApiProperty({
        description: 'Required approval level',
        example: 'manager',
    })
    requiredLevel: string;

    @ApiProperty({
        description: 'Eligible approvers',
        type: [Object],
        example: [
            {
                userId: 'clh1234567890',
                name: 'John Manager',
                email: 'john.manager@company.com',
                approvalLimit: 10000.00
            }
        ],
    })
    eligibleApprovers: Array<{
        userId: string;
        name: string;
        email: string;
        approvalLimit: number;
    }>;
}
