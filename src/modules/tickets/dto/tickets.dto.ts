import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTicketDto {
  @ApiProperty({ description: 'Ticket subject', example: 'Need help with an order' })
  @IsString()
  @MaxLength(200)
  subject!: string;

  @ApiProperty({
    description: 'Detailed message describing the issue/request',
    example: 'My order HW-2024-000123 arrived with missing items...',
  })
  @IsString()
  @MaxLength(5000)
  message!: string;

  @ApiPropertyOptional({ description: 'Customer name', example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer email', example: 'jane@example.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Customer phone number', example: '+60-12-3456789' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Related order number', example: 'HW-2024-000123' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  orderNumber?: string;
}

export class TicketResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'TCK-20251217-1A2B3C' })
  ticketNumber!: string;

  @ApiProperty({
    description:
      'Public token used to view/respond to the ticket without authentication (shared via email link).',
  })
  publicToken!: string;

  @ApiProperty({ enum: TicketStatus })
  status!: TicketStatus;

  @ApiProperty({ enum: TicketPriority })
  priority!: TicketPriority;

  @ApiProperty()
  subject!: string;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  customerName?: string | null;

  @ApiPropertyOptional()
  customerEmail?: string | null;

  @ApiPropertyOptional()
  customerPhone?: string | null;

  @ApiPropertyOptional()
  orderNumber?: string | null;

  @ApiPropertyOptional()
  createdById?: string | null;

  @ApiPropertyOptional()
  assignedToId?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class TicketMessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['CUSTOMER', 'SUPPORT'] })
  authorType!: 'CUSTOMER' | 'SUPPORT';

  @ApiProperty()
  message!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class PublicTicketResponseDto {
  @ApiProperty()
  ticketNumber!: string;

  @ApiProperty({ enum: TicketStatus })
  status!: TicketStatus;

  @ApiProperty()
  subject!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: [TicketMessageResponseDto] })
  messages!: TicketMessageResponseDto[];
}

export class CreateTicketMessageDto {
  @ApiProperty({ description: 'Customer email used to verify ownership', example: 'jane@example.com' })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({ description: 'Additional information / reply', example: 'Here are more details...' })
  @IsString()
  @MaxLength(5000)
  message!: string;
}

export class CreateSupportTicketMessageDto {
  @ApiProperty({ description: 'Support reply message', example: 'Thanks! Can you share a photo of the label?' })
  @IsString()
  @MaxLength(5000)
  message!: string;
}

export class TicketsListResponseDto {
  @ApiProperty({ type: [TicketResponseDto] })
  items!: TicketResponseDto[];

  @ApiProperty({ example: 123 })
  total!: number;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Assign ticket to a user (admin)', example: 'uuid' })
  @IsOptional()
  @IsString()
  assignedToId?: string | null;
}


