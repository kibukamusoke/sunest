import { InvoiceStatus, PaymentMethod } from '@prisma/client';
export declare class CreateInvoiceDto {
    orderId: string;
    companyId?: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    currency?: string;
    issuedAt?: string;
    dueAt?: string;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
}
export declare class UpdateInvoiceDto {
    status?: InvoiceStatus;
    subtotal?: number;
    taxAmount?: number;
    totalAmount?: number;
    issuedAt?: string;
    dueAt?: string;
    paidAt?: string;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    pdfUrl?: string;
}
export declare class SendInvoiceDto {
    emailTo?: string[];
    subject?: string;
    message?: string;
    sendCopy?: boolean;
}
export declare class RecordPaymentDto {
    amount: number;
    paymentMethod: PaymentMethod;
    paymentReference?: string;
    paidAt?: string;
    notes?: string;
}
export declare class InvoiceFilterDto {
    status?: InvoiceStatus;
    companyId?: string;
    userId?: string;
    orderId?: string;
    invoiceNumber?: string;
    issuedAfter?: string;
    issuedBefore?: string;
    dueAfter?: string;
    dueBefore?: string;
    overdue?: boolean;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class InvoiceResponseDto {
    id: string;
    invoiceNumber: string;
    order: {
        id: string;
        orderNumber: string;
        purchaseOrderNumber?: string;
        totalAmount: number;
        createdAt: Date;
    };
    user: {
        id: string;
        email: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
    };
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
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    status: InvoiceStatus;
    issuedAt?: Date;
    dueAt?: Date;
    paidAt?: Date;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    pdfUrl?: string;
    isOverdue: boolean;
    daysOverdue?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InvoiceListResponseDto {
    invoices: InvoiceResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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
export declare class InvoicePdfResponseDto {
    url: string;
    filename: string;
    size: number;
    generatedAt: Date;
}
export declare class InvoiceAnalyticsResponseDto {
    totalInvoices: number;
    totalValue: number;
    paidAmount: number;
    outstandingAmount: number;
    overdueAmount: number;
    averageInvoiceValue: number;
    averageDaysToPayment: number;
    collectionRate: number;
    invoicesByStatus: Record<InvoiceStatus, number>;
    paymentMethodsDistribution: Record<PaymentMethod, number>;
    topCustomers: Array<{
        userId: string;
        userName: string;
        companyName?: string;
        totalValue: number;
        invoiceCount: number;
    }>;
    agingAnalysis: {
        current: number;
        days1to30: number;
        days31to60: number;
        days61to90: number;
        over90Days: number;
    };
    monthlyTrends: Array<{
        month: string;
        invoicesIssued: number;
        totalValue: number;
        paidAmount: number;
        averageDaysToPayment: number;
    }>;
    periodStart: Date;
    periodEnd: Date;
}
export declare class BulkInvoiceActionDto {
    invoiceIds: string[];
    action: string;
    actionData?: any;
}
export declare class BulkInvoiceResultDto {
    successful: string[];
    failed: Array<{
        invoiceId: string;
        error: string;
    }>;
    totalProcessed: number;
    successCount: number;
    failureCount: number;
}
