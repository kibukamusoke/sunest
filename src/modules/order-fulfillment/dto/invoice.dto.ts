import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsInt, Min, IsArray, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

// ==================== CREATE INVOICE DTOs ====================

export class CreateInvoiceDto {
    @ApiProperty({
        description: 'Order ID to create invoice for',
        example: 'uuid-order-id'
    })
    @IsUUID()
    orderId: string;

    @ApiPropertyOptional({
        description: 'Company ID for B2B invoicing',
        example: 'uuid-company-id'
    })
    @IsOptional()
    @IsUUID()
    companyId?: string;

    @ApiProperty({
        description: 'Subtotal amount',
        example: 999.99
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    subtotal: number;

    @ApiProperty({
        description: 'Tax amount',
        example: 79.99
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    taxAmount: number;

    @ApiProperty({
        description: 'Total amount',
        example: 1079.98
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    totalAmount: number;

    @ApiPropertyOptional({
        description: 'Currency code',
        example: 'USD'
    })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({
        description: 'Issue date (defaults to now)',
        example: '2024-08-15T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    issuedAt?: string;

    @ApiPropertyOptional({
        description: 'Due date',
        example: '2024-09-15T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    dueAt?: string;

    @ApiPropertyOptional({
        description: 'Payment method used',
        enum: PaymentMethod,
        example: PaymentMethod.CORPORATE_ACCOUNT
    })
    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Payment reference/transaction ID',
        example: 'TXN-12345678'
    })
    @IsOptional()
    @IsString()
    paymentReference?: string;
}

// ==================== UPDATE INVOICE DTOs ====================

export class UpdateInvoiceDto {
    @ApiPropertyOptional({
        description: 'Invoice status',
        enum: InvoiceStatus,
        example: InvoiceStatus.SENT
    })
    @IsOptional()
    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;

    @ApiPropertyOptional({
        description: 'Subtotal amount',
        example: 899.99
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    subtotal?: number;

    @ApiPropertyOptional({
        description: 'Tax amount',
        example: 72.00
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    taxAmount?: number;

    @ApiPropertyOptional({
        description: 'Total amount',
        example: 971.99
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    totalAmount?: number;

    @ApiPropertyOptional({
        description: 'Issue date',
        example: '2024-08-15T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    issuedAt?: string;

    @ApiPropertyOptional({
        description: 'Due date',
        example: '2024-09-15T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    dueAt?: string;

    @ApiPropertyOptional({
        description: 'Paid date',
        example: '2024-08-20T14:30:00Z'
    })
    @IsOptional()
    @IsDateString()
    paidAt?: string;

    @ApiPropertyOptional({
        description: 'Payment method used',
        enum: PaymentMethod,
        example: PaymentMethod.CREDIT_CARD
    })
    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Payment reference/transaction ID',
        example: 'TXN-87654321'
    })
    @IsOptional()
    @IsString()
    paymentReference?: string;

    @ApiPropertyOptional({
        description: 'PDF URL',
        example: 'https://storage.example.com/invoices/INV-2024-001.pdf'
    })
    @IsOptional()
    @IsString()
    pdfUrl?: string;
}

export class SendInvoiceDto {
    @ApiPropertyOptional({
        description: 'Email addresses to send invoice to (defaults to order customer)',
        example: ['customer@company.com', 'accounting@company.com']
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    emailTo?: string[];

    @ApiPropertyOptional({
        description: 'Custom email subject',
        example: 'Invoice INV-2024-001 from Hardware World'
    })
    @IsOptional()
    @IsString()
    subject?: string;

    @ApiPropertyOptional({
        description: 'Custom email message',
        example: 'Please find attached your invoice. Payment is due within 30 days.'
    })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiPropertyOptional({
        description: 'Send copy to internal team',
        example: true
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    sendCopy?: boolean;
}

export class RecordPaymentDto {
    @ApiProperty({
        description: 'Payment amount',
        example: 1079.98
    })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    amount: number;

    @ApiProperty({
        description: 'Payment method used',
        enum: PaymentMethod,
        example: PaymentMethod.CREDIT_CARD
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Payment reference/transaction ID',
        example: 'TXN-12345678'
    })
    @IsOptional()
    @IsString()
    paymentReference?: string;

    @ApiPropertyOptional({
        description: 'Payment date (defaults to now)',
        example: '2024-08-20T14:30:00Z'
    })
    @IsOptional()
    @IsDateString()
    paidAt?: string;

    @ApiPropertyOptional({
        description: 'Payment notes',
        example: 'Payment received via Stripe'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}

// ==================== FILTER DTOs ====================

export class InvoiceFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by invoice status',
        enum: InvoiceStatus,
        example: InvoiceStatus.SENT
    })
    @IsOptional()
    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;

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
        description: 'Filter by order ID',
        example: 'uuid-order-id'
    })
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional({
        description: 'Filter by invoice number',
        example: 'INV-2024-001'
    })
    @IsOptional()
    @IsString()
    invoiceNumber?: string;

    @ApiPropertyOptional({
        description: 'Filter invoices issued after date',
        example: '2024-08-01T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    issuedAfter?: string;

    @ApiPropertyOptional({
        description: 'Filter invoices issued before date',
        example: '2024-08-31T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    issuedBefore?: string;

    @ApiPropertyOptional({
        description: 'Filter invoices due after date',
        example: '2024-09-01T00:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    dueAfter?: string;

    @ApiPropertyOptional({
        description: 'Filter invoices due before date',
        example: '2024-09-30T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    dueBefore?: string;

    @ApiPropertyOptional({
        description: 'Filter overdue invoices',
        example: true
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    overdue?: boolean;

    @ApiPropertyOptional({
        description: 'Minimum invoice amount',
        example: 100.00
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    minAmount?: number;

    @ApiPropertyOptional({
        description: 'Maximum invoice amount',
        example: 5000.00
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    maxAmount?: number;

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
        example: 'issuedAt',
        enum: ['issuedAt', 'dueAt', 'totalAmount', 'status', 'invoiceNumber']
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

export class InvoiceResponseDto {
    @ApiProperty({ description: 'Invoice ID' })
    id: string;

    @ApiProperty({ description: 'Invoice number' })
    invoiceNumber: string;

    @ApiProperty({ description: 'Order information' })
    order: {
        id: string;
        orderNumber: string;
        purchaseOrderNumber?: string;
        totalAmount: number;
        createdAt: Date;
    };

    @ApiProperty({ description: 'Customer information' })
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
        taxId?: string;
        addressLine1?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };

    @ApiProperty({ description: 'Subtotal amount' })
    subtotal: number;

    @ApiProperty({ description: 'Tax amount' })
    taxAmount: number;

    @ApiProperty({ description: 'Total amount' })
    totalAmount: number;

    @ApiProperty({ description: 'Currency' })
    currency: string;

    @ApiProperty({ description: 'Invoice status', enum: InvoiceStatus })
    status: InvoiceStatus;

    @ApiPropertyOptional({ description: 'Issue date' })
    issuedAt?: Date;

    @ApiPropertyOptional({ description: 'Due date' })
    dueAt?: Date;

    @ApiPropertyOptional({ description: 'Paid date' })
    paidAt?: Date;

    @ApiPropertyOptional({ description: 'Payment method', enum: PaymentMethod })
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional({ description: 'Payment reference' })
    paymentReference?: string;

    @ApiPropertyOptional({ description: 'PDF URL' })
    pdfUrl?: string;

    @ApiProperty({ description: 'Is overdue' })
    isOverdue: boolean;

    @ApiPropertyOptional({ description: 'Days overdue (if applicable)' })
    daysOverdue?: number;

    @ApiProperty({ description: 'Created date' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    updatedAt: Date;
}

export class InvoiceListResponseDto {
    @ApiProperty({ description: 'Invoices', type: [InvoiceResponseDto] })
    invoices: InvoiceResponseDto[];

    @ApiProperty({ description: 'Total count of invoices matching filter' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Items per page' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;

    @ApiProperty({ description: 'Summary statistics' })
    summary: {
        totalAmount: number;
        paidAmount: number;
        overdueAmount: number;
        pendingAmount: number;
        count: {
            total: number;
            paid: number;
            overdue: number;
            pending: number;
        };
    };
}

export class InvoicePdfResponseDto {
    @ApiProperty({ description: 'PDF file URL' })
    url: string;

    @ApiProperty({ description: 'PDF file name' })
    filename: string;

    @ApiProperty({ description: 'File size in bytes' })
    size: number;

    @ApiProperty({ description: 'Generated at' })
    generatedAt: Date;
}

// ==================== INVOICE ANALYTICS DTOs ====================

export class InvoiceAnalyticsResponseDto {
    @ApiProperty({ description: 'Total invoices count' })
    totalInvoices: number;

    @ApiProperty({ description: 'Total invoice value' })
    totalValue: number;

    @ApiProperty({ description: 'Total paid amount' })
    paidAmount: number;

    @ApiProperty({ description: 'Total outstanding amount' })
    outstandingAmount: number;

    @ApiProperty({ description: 'Total overdue amount' })
    overdueAmount: number;

    @ApiProperty({ description: 'Average invoice value' })
    averageInvoiceValue: number;

    @ApiProperty({ description: 'Average days to payment' })
    averageDaysToPayment: number;

    @ApiProperty({ description: 'Collection rate (percentage)' })
    collectionRate: number;

    @ApiProperty({ description: 'Invoices by status' })
    invoicesByStatus: Record<InvoiceStatus, number>;

    @ApiProperty({ description: 'Payment methods distribution' })
    paymentMethodsDistribution: Record<PaymentMethod, number>;

    @ApiProperty({ description: 'Top customers by invoice value' })
    topCustomers: Array<{
        userId: string;
        userName: string;
        companyName?: string;
        totalValue: number;
        invoiceCount: number;
    }>;

    @ApiProperty({ description: 'Aging analysis' })
    agingAnalysis: {
        current: number;      // Not yet due
        days1to30: number;    // 1-30 days overdue
        days31to60: number;   // 31-60 days overdue
        days61to90: number;   // 61-90 days overdue
        over90Days: number;   // Over 90 days overdue
    };

    @ApiProperty({ description: 'Monthly trends' })
    monthlyTrends: Array<{
        month: string;
        invoicesIssued: number;
        totalValue: number;
        paidAmount: number;
        averageDaysToPayment: number;
    }>;

    @ApiProperty({ description: 'Period start date' })
    periodStart: Date;

    @ApiProperty({ description: 'Period end date' })
    periodEnd: Date;
}

// ==================== BULK OPERATIONS DTOs ====================

export class BulkInvoiceActionDto {
    @ApiProperty({
        description: 'Invoice IDs to perform action on',
        example: ['uuid-invoice-1', 'uuid-invoice-2', 'uuid-invoice-3']
    })
    @IsArray()
    @IsUUID(undefined, { each: true })
    invoiceIds: string[];

    @ApiProperty({
        description: 'Action to perform',
        example: 'send',
        enum: ['send', 'mark_paid', 'cancel', 'regenerate_pdf']
    })
    @IsEnum(['send', 'mark_paid', 'cancel', 'regenerate_pdf'])
    action: string;

    @ApiPropertyOptional({
        description: 'Additional data for the action',
        example: { emailTo: ['customer@company.com'], sendCopy: true }
    })
    @IsOptional()
    actionData?: any;
}

export class BulkInvoiceResultDto {
    @ApiProperty({ description: 'Successfully processed invoice IDs' })
    successful: string[];

    @ApiProperty({ description: 'Failed invoice IDs with error messages' })
    failed: Array<{
        invoiceId: string;
        error: string;
    }>;

    @ApiProperty({ description: 'Total processed' })
    totalProcessed: number;

    @ApiProperty({ description: 'Success count' })
    successCount: number;

    @ApiProperty({ description: 'Failure count' })
    failureCount: number;
}
