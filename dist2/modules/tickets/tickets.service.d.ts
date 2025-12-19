import { PrismaService } from '../../config/prisma.service';
import { CreateTicketDto, CreateTicketMessageDto, CreateSupportTicketMessageDto, PublicTicketResponseDto, TicketResponseDto, TicketsListResponseDto, UpdateTicketDto } from './dto/tickets.dto';
import { MailgunService } from '../notifications/mailgun.service';
export declare class TicketsService {
    private readonly prisma;
    private readonly mailgunService;
    constructor(prisma: PrismaService, mailgunService: MailgunService);
    private toResponse;
    private toMessageResponse;
    private generateTicketNumber;
    private getSiteUrl;
    private normalizeEmail;
    createPublic(dto: CreateTicketDto, siteUrlOverride?: string | null): Promise<TicketResponseDto>;
    listAdmin(skip?: number, take?: number): Promise<TicketsListResponseDto>;
    getAdmin(id: string): Promise<TicketResponseDto>;
    updateAdmin(id: string, dto: UpdateTicketDto): Promise<TicketResponseDto>;
    getPublicByToken(token: string): Promise<PublicTicketResponseDto>;
    addPublicMessage(token: string, dto: CreateTicketMessageDto): Promise<PublicTicketResponseDto>;
    addAdminMessage(ticketId: string, dto: CreateSupportTicketMessageDto): Promise<PublicTicketResponseDto>;
}
