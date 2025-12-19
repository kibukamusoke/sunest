"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const crypto_1 = require("crypto");
const mailgun_service_1 = require("../notifications/mailgun.service");
let TicketsService = class TicketsService {
    constructor(prisma, mailgunService) {
        this.prisma = prisma;
        this.mailgunService = mailgunService;
    }
    toResponse(row) {
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
    toMessageResponse(row) {
        return {
            id: row.id,
            authorType: row.authorType,
            message: row.message,
            createdAt: row.createdAt,
        };
    }
    generateTicketNumber() {
        const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const suffix = (0, crypto_1.randomUUID)().replace(/-/g, '').slice(0, 6).toUpperCase();
        return `TCK-${ymd}-${suffix}`;
    }
    async getSiteUrl() {
        const row = await this.prisma.systemConfiguration.findUnique({
            where: { key: 'site_url' },
            select: { value: true },
        });
        return (row?.value ??
            process.env.SITE_URL ??
            process.env.STOREFRONT_URL ??
            process.env.NEXT_PUBLIC_SITE_URL ??
            null);
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    async createPublic(dto, siteUrlOverride) {
        for (let attempt = 0; attempt < 5; attempt++) {
            const ticketNumber = this.generateTicketNumber();
            const publicToken = (0, crypto_1.randomUUID)().replace(/-/g, '');
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
                if (created.customerEmail) {
                    const siteUrl = siteUrlOverride ?? (await this.getSiteUrl());
                    if (siteUrl) {
                        const ticketLink = `${siteUrl.replace(/\/+$/, '')}/support/ticket/${created.publicToken}`;
                        await this.mailgunService.sendEmail({
                            to: [{ email: created.customerEmail, name: created.customerName || undefined }],
                            subject: `Support ticket created: ${created.ticketNumber}`,
                            text: `Your support ticket ${created.ticketNumber} has been created.\n\n` +
                                `View and reply here:\n${ticketLink}\n\n` +
                                `Subject: ${created.subject}\n`,
                            html: `<h2>Support ticket created</h2>` +
                                `<p><strong>${created.ticketNumber}</strong></p>` +
                                `<p>Use this link to view and reply to your ticket:</p>` +
                                `<p><a href="${ticketLink}">${ticketLink}</a></p>` +
                                `<p><strong>Subject:</strong> ${created.subject}</p>`,
                        });
                    }
                }
                return this.toResponse(created);
            }
            catch (e) {
                if (e?.code === 'P2002' && attempt < 4)
                    continue;
                throw e;
            }
        }
        throw new Error('Unable to generate unique ticket number');
    }
    async listAdmin(skip = 0, take = 50) {
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
    async getAdmin(id) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return this.toResponse(ticket);
    }
    async updateAdmin(id, dto) {
        const existing = await this.prisma.ticket.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Ticket not found');
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
    async getPublicByToken(token) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { publicToken: token },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return {
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
            subject: ticket.subject,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            messages: ticket.messages.map((m) => this.toMessageResponse(m)),
        };
    }
    async addPublicMessage(token, dto) {
        const email = this.normalizeEmail(dto.customerEmail);
        const ticket = await this.prisma.ticket.findUnique({
            where: { publicToken: token },
            select: { id: true, customerEmail: true },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        if (ticket.customerEmail && this.normalizeEmail(ticket.customerEmail) !== email) {
            throw new common_1.NotFoundException('Ticket not found');
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
    async addAdminMessage(ticketId, dto) {
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
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        await this.prisma.ticketMessage.create({
            data: {
                ticketId: ticket.id,
                authorType: 'SUPPORT',
                message: dto.message,
            },
        });
        if (ticket.status === 'OPEN') {
            await this.prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: 'IN_PROGRESS' },
            });
        }
        if (ticket.customerEmail) {
            const siteUrl = await this.getSiteUrl();
            if (siteUrl) {
                const ticketLink = `${siteUrl.replace(/\/+$/, '')}/support/ticket/${ticket.publicToken}`;
                await this.mailgunService.sendEmail({
                    to: [{ email: ticket.customerEmail, name: ticket.customerName || undefined }],
                    subject: `New reply on your ticket: ${ticket.ticketNumber}`,
                    text: `There is a new reply on your support ticket ${ticket.ticketNumber}.\n\n` +
                        `View and reply here:\n${ticketLink}\n\n` +
                        `Message:\n${dto.message}\n`,
                    html: `<h2>New reply on your support ticket</h2>` +
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailgun_service_1.MailgunService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map