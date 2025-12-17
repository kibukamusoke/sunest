import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums for merchant user roles and permissions
export enum MerchantUserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum Permission {
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_PRICING = 'manage_pricing',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_INVENTORY = 'manage_inventory',
  MANAGE_RFQ = 'manage_rfq',
  MANAGE_FULFILLMENT = 'manage_fulfillment',
}

// DTO for inviting a new team member
export class InviteTeamMemberDto {
  @ApiProperty({
    description: 'Email address of the user to invite',
    example: 'john.doe@company.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role within the merchant organization',
    enum: MerchantUserRole,
    example: 'manager',
  })
  @IsEnum(MerchantUserRole)
  role: MerchantUserRole;

  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of the user', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Job title', example: 'Sales Manager' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Sales' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Specific permissions for this user',
    enum: Permission,
    isArray: true,
    example: ['manage_products', 'manage_orders'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];

  @ApiPropertyOptional({
    description: 'Personal message for the invitation',
    example: 'Welcome to our team!',
  })
  @IsOptional()
  @IsString()
  message?: string;
}

// DTO for updating team member details
export class UpdateTeamMemberDto {
  @ApiPropertyOptional({
    description: 'Role within the merchant organization',
    enum: MerchantUserRole,
  })
  @IsOptional()
  @IsEnum(MerchantUserRole)
  role?: MerchantUserRole;

  @ApiPropertyOptional({
    description: 'Job title',
    example: 'Senior Sales Manager',
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Sales' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Specific permissions for this user',
    enum: Permission,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];

  @ApiPropertyOptional({ description: 'Is the user active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// DTO for team member response
export class TeamMemberDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'First name' })
  firstName: string | null;

  @ApiProperty({ description: 'Last name' })
  lastName: string | null;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Job title', required: false })
  jobTitle?: string | null;

  @ApiProperty({ description: 'Department', required: false })
  department?: string | null;

  @ApiProperty({ description: 'Role within merchant', enum: MerchantUserRole })
  role: MerchantUserRole;

  @ApiProperty({
    description: 'User permissions',
    enum: Permission,
    isArray: true,
  })
  permissions: Permission[];

  @ApiProperty({ description: 'Is user active' })
  isActive: boolean;

  @ApiProperty({ description: 'Date joined merchant' })
  joinedAt: Date;

  @ApiPropertyOptional({ description: 'Last login date' })
  lastLoginAt?: Date | null;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  profilePictureUrl?: string | null;
}

// DTO for team list response
export class TeamListResponseDto {
  @ApiProperty({ description: 'List of team members', type: [TeamMemberDto] })
  members: TeamMemberDto[];

  @ApiProperty({ description: 'Total count of team members' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}

// DTO for team member filters
export class TeamMemberFilterDto {
  @ApiPropertyOptional({ description: 'Search term for name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: MerchantUserRole,
  })
  @IsOptional()
  @IsEnum(MerchantUserRole)
  role?: MerchantUserRole;

  @ApiPropertyOptional({ description: 'Filter by department' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

// DTO for team statistics
export class TeamStatsDto {
  @ApiProperty({ description: 'Total team members' })
  totalMembers: number;

  @ApiProperty({ description: 'Active team members' })
  activeMembers: number;

  @ApiProperty({ description: 'Pending invitations' })
  pendingInvitations: number;

  @ApiProperty({
    description: 'Members by role',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  membersByRole: Record<MerchantUserRole, number>;

  @ApiProperty({
    description: 'Members by department',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  membersByDepartment: Record<string, number>;

  @ApiProperty({ description: 'Recently joined members (last 30 days)' })
  recentlyJoined: number;
}

// DTO for removing team member
export class RemoveTeamMemberDto {
  @ApiPropertyOptional({ description: 'Reason for removal' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Transfer data to another user' })
  @IsOptional()
  @IsString()
  transferToUserId?: string;
}
