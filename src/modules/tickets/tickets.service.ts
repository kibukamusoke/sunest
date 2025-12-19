import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import {
  CreateTicketDto,
  CreateTicketMessageDto,
  CreateSupportTicketMessageDto,
  PublicTicketResponseDto,
  TicketResponseDto,
  TicketMessageResponseDto,
  TicketsListResponseDto,
  UpdateTicketDto,
} from './dto/tickets.dto';
import { randomUUID } from 'crypto';
import { MailgunService } from '../notifications/mailgun.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailgunService: MailgunService,
  ) {}

  private toResponse(row: any): TicketResponseDto {
    return {
      id: row.id,
      ticketNumber: row.ticketNumber,
      publicToken: row.publicToken,
      status: row.status,
      priority: row.priority,
      subject: row.subject,
      message: row.message,
      customerName: row.customerName ?? null,
      customerEmail: row.customerEmail ?? null,
      customerPhone: row.customerPhone ?? null,
      orderNumber: row.orderNumber ?? null,
      createdById: row.createdById ?? null,
      assignedToId: row.assignedToId ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private toMessageResponse(row: any): TicketMessageResponseDto {
    return {
      id: row.id,
      authorType: row.authorType,
      message: row.message,
      createdAt: row.createdAt,
    };
  }

  private generateTicketNumber(): string {
    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
    return `TCK-${ymd}-${suffix}`;
  }

  private async getSiteUrl(): Promise<string | null> {
    const row = await this.prisma.systemConfiguration.findUnique({
      where: { key: 'site_url' },
      select: { value: true },
    });
    return (
      row?.value ??
      process.env.SITE_URL ??
      process.env.STOREFRONT_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      null
    );
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async createPublic(
    dto: CreateTicketDto,
    siteUrlOverride?: string | null,
  ): Promise<TicketResponseDto> {
    // retry in the extremely unlikely case of ticketNumber collision
    for (let attempt = 0; attempt < 5; attempt++) {
      const ticketNumber = this.generateTicketNumber();
      const publicToken = randomUUID().replace(/-/g, '');
      try {
        const created = await this.prisma.$transaction(async (tx) => {
          const ticket = await tx.ticket.create({
            data: {
              ticketNumber,
              publicToken,
              subject: dto.subject,
              message: dto.message,
              customerName: dto.customerName,
              customerEmail: dto.customerEmail
                ? this.normalizeEmail(dto.customerEmail)
                : undefined,
              customerPhone: dto.customerPhone,
              orderNumber: dto.orderNumber,
            },
          });

          await tx.ticketMessage.create({
            data: {
              ticketId: ticket.id,
              authorType: 'CUSTOMER',
              message: dto.message,
            },
          });

          return ticket;
        });

        // Send ticket-created email (best-effort)
        if (created.customerEmail) {
          const siteUrl = siteUrlOverride ?? (await this.getSiteUrl());
          if (siteUrl) {
            const ticketLink = `${siteUrl.replace(/\/+$/, '')}/support/ticket/${created.publicToken}`;
            await this.mailgunService.sendEmail({
              to: [{ email: created.customerEmail, name: created.customerName || undefined }],
              subject: `Support ticket created: ${created.ticketNumber}`,
              text:
                `Your support ticket ${created.ticketNumber} has been created.\n\n` +
                `View and reply here:\n${ticketLink}\n\n` +
                `Subject: ${created.subject}\n`,
              html:
                `<h2>Support ticket created</h2>` +
                `<p><strong>${created.ticketNumber}</strong></p>` +
                `<p>Use this link to view and reply to your ticket:</p>` +
                `<p><a href="${ticketLink}">${ticketLink}</a></p>` +
                `<p><strong>Subject:</strong> ${created.subject}</p>`,
            });
          }
        }

        return this.toResponse(created);
      } catch (e: any) {
        // Prisma unique constraint error code
        if (e?.code === 'P2002' && attempt < 4) continue;
        throw e;
      }
    }

    // Should never happen
    throw new Error('Unable to generate unique ticket number');
  }

  async listAdmin(skip = 0, take = 50): Promise<TicketsListResponseDto> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ticket.count(),
    ]);

    return { items: items.map((t) => this.toResponse(t)), total };
  }

  async getAdmin(id: string): Promise<TicketResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.toResponse(ticket);
  }

  async updateAdmin(id: string, dto: UpdateTicketDto): Promise<TicketResponseDto> {
    const existing = await this.prisma.ticket.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Ticket not found');

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: {
        status: dto.status,
        priority: dto.priority,
        assignedToId: dto.assignedToId === undefined ? undefined : dto.assignedToId,
      },
    });
    return this.toResponse(updated);
  }

  async getPublicByToken(token: string): Promise<PublicTicketResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { publicToken: token },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return {
      ticketNumber: ticket.ticketNumber,
      status: ticket.status as any,
      subject: ticket.subject,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      messages: ticket.messages.map((m) => this.toMessageResponse(m)),
    };
  }

  async addPublicMessage(
    token: string,
    dto: CreateTicketMessageDto,
  ): Promise<PublicTicketResponseDto> {
    const email = this.normalizeEmail(dto.customerEmail);

    const ticket = await this.prisma.ticket.findUnique({
      where: { publicToken: token },
      select: { id: true, customerEmail: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.customerEmail && this.normalizeEmail(ticket.customerEmail) !== email) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        authorType: 'CUSTOMER',
        message: dto.message,
      },
    });

    return this.getPublicByToken(token);
  }

  async addAdminMessage(
    ticketId: string,
    dto: CreateSupportTicketMessageDto,
  ): Promise<PublicTicketResponseDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        publicToken: true,
        ticketNumber: true,
        subject: true,
        customerEmail: true,
        customerName: true,
        status: true,
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    await this.prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        authorType: 'SUPPORT',
        message: dto.message,
      },
    });

    // Optionally move OPEN -> IN_PROGRESS when support replies
    if (ticket.status === 'OPEN') {
      await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: 'IN_PROGRESS' as any },
      });
    }

    // Notify customer via email (best-effort)
    if (ticket.customerEmail) {
      const siteUrl = await this.getSiteUrl();
      if (siteUrl) {
        const ticketLink = `${siteUrl.replace(/\/+$/, '')}/support/ticket/${ticket.publicToken}`;
        await this.mailgunService.sendEmail({
          to: [{ email: ticket.customerEmail, name: ticket.customerName || undefined }],
          subject: `New reply on your ticket: ${ticket.ticketNumber}`,
          text:
            `There is a new reply on your support ticket ${ticket.ticketNumber}.\n\n` +
            `View and reply here:\n${ticketLink}\n\n` +
            `Message:\n${dto.message}\n`,
          html:
            `<h2>New reply on your support ticket</h2>` +
            `<p><strong>${ticket.ticketNumber}</strong></p>` +
            `<p><strong>Subject:</strong> ${ticket.subject}</p>` +
            `<p>View and reply:</p>` +
            `<p><a href="${ticketLink}">${ticketLink}</a></p>` +
            `<hr />` +
            `<pre style="white-space:pre-wrap;font-family:inherit">${dto.message}</pre>`,
        });
      }
    }

    return this.getPublicByToken(ticket.publicToken);
  }
}


