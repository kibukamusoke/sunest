import type { Request } from 'express';
import { CreateTicketDto, CreateTicketMessageDto, PublicTicketResponseDto, CreateSupportTicketMessageDto, TicketResponseDto, TicketsListResponseDto, UpdateTicketDto } from './dto/tickets.dto';
import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    getPublicByToken(token: string): Promise<PublicTicketResponseDto>;
    addPublicMessage(token: string, body: CreateTicketMessageDto): Promise<PublicTicketResponseDto>;
    addAdminMessage(id: string, body: CreateSupportTicketMessageDto): Promise<PublicTicketResponseDto>;
    createPublic(body: CreateTicketDto, req: Request): Promise<TicketResponseDto>;
    listAdmin(skip?: string, take?: string): Promise<TicketsListResponseDto>;
    getAdmin(id: string): Promise<TicketResponseDto>;
    updateAdmin(id: string, body: UpdateTicketDto): Promise<TicketResponseDto>;
}
