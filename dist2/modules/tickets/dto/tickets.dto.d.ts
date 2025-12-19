export declare enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare enum TicketPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateTicketDto {
    subject: string;
    message: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    orderNumber?: string;
}
export declare class TicketResponseDto {
    id: string;
    ticketNumber: string;
    publicToken: string;
    status: TicketStatus;
    priority: TicketPriority;
    subject: string;
    message: string;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    orderNumber?: string | null;
    createdById?: string | null;
    assignedToId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TicketMessageResponseDto {
    id: string;
    authorType: 'CUSTOMER' | 'SUPPORT';
    message: string;
    createdAt: Date;
}
export declare class PublicTicketResponseDto {
    ticketNumber: string;
    status: TicketStatus;
    subject: string;
    createdAt: Date;
    updatedAt: Date;
    messages: TicketMessageResponseDto[];
}
export declare class CreateTicketMessageDto {
    customerEmail: string;
    message: string;
}
export declare class CreateSupportTicketMessageDto {
    message: string;
}
export declare class TicketsListResponseDto {
    items: TicketResponseDto[];
    total: number;
}
export declare class UpdateTicketDto {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: string | null;
}
