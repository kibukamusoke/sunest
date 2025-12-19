import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { SystemAdmin } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateTicketDto,
  CreateTicketMessageDto,
  PublicTicketResponseDto,
  CreateSupportTicketMessageDto,
  TicketResponseDto,
  TicketsListResponseDto,
  UpdateTicketDto,
} from './dto/tickets.dto';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('public/:token')
  @Public()
  @ApiOperation({ summary: 'Get ticket details (public link)' })
  @ApiResponse({ status: HttpStatus.OK, type: PublicTicketResponseDto })
  async getPublicByToken(
    @Param('token') token: string,
  ): Promise<PublicTicketResponseDto> {
    return this.ticketsService.getPublicByToken(token);
  }

  @Post('public/:token/messages')
  @Public()
  @ApiOperation({ summary: 'Add a message to a ticket (public link)' })
  @ApiResponse({ status: HttpStatus.OK, type: PublicTicketResponseDto })
  async addPublicMessage(
    @Param('token') token: string,
    @Body() body: CreateTicketMessageDto,
  ): Promise<PublicTicketResponseDto> {
    return this.ticketsService.addPublicMessage(token, body);
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SystemAdmin()
  @ApiOperation({ summary: 'Add a support message to a ticket (admin)' })
  @ApiResponse({ status: HttpStatus.OK, type: PublicTicketResponseDto })
  async addAdminMessage(
    @Param('id') id: string,
    @Body() body: CreateSupportTicketMessageDto,
  ): Promise<PublicTicketResponseDto> {
    return this.ticketsService.addAdminMessage(id, body);
  }

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Create a support ticket (public)',
    description: 'Create a support ticket from the storefront Contact Us / Support page.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ticket created successfully',
    type: TicketResponseDto,
  })
  async createPublic(
    @Body() body: CreateTicketDto,
    @Req() req: Request,
  ): Promise<TicketResponseDto> {
    const forwardedProto = (req.headers['x-forwarded-proto'] as string | undefined) ?? undefined;
    const host = (req.headers['x-forwarded-host'] as string | undefined) ?? req.headers.host;
    const proto = forwardedProto ?? req.protocol;
    const origin =
      (req.headers.origin as string | undefined) ??
      (host ? `${proto}://${host}` : undefined);

    return this.ticketsService.createPublic(body, origin ?? null);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SystemAdmin()
  @ApiOperation({ summary: 'List tickets (admin)', description: 'List all support tickets (system admin only).' })
  @ApiResponse({ status: HttpStatus.OK, type: TicketsListResponseDto })
  async listAdmin(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<TicketsListResponseDto> {
    const parsedSkip = skip ? Math.max(parseInt(skip, 10) || 0, 0) : 0;
    const parsedTake = take ? Math.min(Math.max(parseInt(take, 10) || 50, 1), 200) : 50;
    return this.ticketsService.listAdmin(parsedSkip, parsedTake);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SystemAdmin()
  @ApiOperation({ summary: 'Get ticket by id (admin)' })
  @ApiResponse({ status: HttpStatus.OK, type: TicketResponseDto })
  async getAdmin(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketsService.getAdmin(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SystemAdmin()
  @ApiOperation({ summary: 'Update ticket (admin)' })
  @ApiResponse({ status: HttpStatus.OK, type: TicketResponseDto })
  async updateAdmin(
    @Param('id') id: string,
    @Body() body: UpdateTicketDto,
  ): Promise<TicketResponseDto> {
    return this.ticketsService.updateAdmin(id, body);
  }
}


