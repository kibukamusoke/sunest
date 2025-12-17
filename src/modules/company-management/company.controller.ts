import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  InviteTeamMemberDto,
  UpdateTeamMemberDto,
  CompanyResponseDto,
  TeamMemberDto,
  TeamListDto,
} from './dto/company.dto';

@ApiTags('Company Management')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Company name already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() req: any,
  ): Promise<CompanyResponseDto> {
    return this.companyService.createCompany(createCompanyDto, req.user.userId);
  }

  @Get('my-companies')
  @ApiOperation({ summary: 'Get companies the current user belongs to' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User companies retrieved successfully',
    type: [CompanyResponseDto],
  })
  async getUserCompanies(@Request() req: any): Promise<CompanyResponseDto[]> {
    return this.companyService.getUserCompanies(req.user.userId);
  }

  @Get(':companyId')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company retrieved successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied to this company',
  })
  async getCompanyById(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ): Promise<CompanyResponseDto> {
    return this.companyService.getCompanyById(companyId, req.user.userId);
  }

  @Put(':companyId')
  @ApiOperation({ summary: 'Update company information' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied or insufficient permissions',
  })
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: any,
  ): Promise<CompanyResponseDto> {
    return this.companyService.updateCompany(
      companyId,
      updateCompanyDto,
      req.user.userId,
    );
  }

  @Delete(':companyId')
  @ApiOperation({ summary: 'Delete company (soft delete)' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Company deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied or insufficient permissions',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.companyService.deleteCompany(companyId, req.user.userId);
  }

  @Get(':companyId/team')
  @ApiOperation({ summary: 'Get company team members' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team members retrieved successfully',
    type: TeamListDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied to this company',
  })
  async getCompanyTeam(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ): Promise<TeamListDto> {
    const members = await this.companyService.getCompanyTeam(
      companyId,
      req.user.userId,
    );
    return {
      members,
      total: members.length,
    };
  }

  @Post(':companyId/team/invite')
  @ApiOperation({ summary: 'Invite a team member to the company' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team member invited successfully',
    type: TeamMemberDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company or user not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User is already a member of this company',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @HttpCode(HttpStatus.CREATED)
  async inviteTeamMember(
    @Param('companyId') companyId: string,
    @Body() inviteDto: InviteTeamMemberDto,
    @Request() req: any,
  ): Promise<{ success: boolean; message: string; invitationId?: string }> {
    return this.companyService.inviteTeamMember(
      companyId,
      inviteDto,
      req.user.userId,
    );
  }

  @Put(':companyId/team/:membershipId')
  @ApiOperation({ summary: 'Update team member role or status' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiParam({
    name: 'membershipId',
    description: 'Team membership ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team member updated successfully',
    type: TeamMemberDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company or team member not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateTeamMember(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Body() updateDto: UpdateTeamMemberDto,
    @Request() req: any,
  ): Promise<TeamMemberDto> {
    return this.companyService.updateTeamMember(
      companyId,
      membershipId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete(':companyId/team/:membershipId')
  @ApiOperation({ summary: 'Remove team member from company' })
  @ApiParam({ name: 'companyId', description: 'Company ID', type: 'string' })
  @ApiParam({
    name: 'membershipId',
    description: 'Team membership ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team member removed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company or team member not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTeamMember(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.companyService.removeTeamMember(
      companyId,
      membershipId,
      req.user.userId,
    );
  }

  @Get('check-name/:companyName')
  @ApiOperation({ summary: 'Check if company name is available' })
  @ApiParam({
    name: 'companyName',
    description: 'Company name to check',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company name availability checked',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async checkCompanyNameAvailability(
    @Param('companyName') companyName: string,
  ): Promise<{ available: boolean; message: string }> {
    const available =
      await this.companyService.isCompanyNameAvailable(companyName);
    return {
      available,
      message: available
        ? 'Company name is available'
        : 'Company name is already taken',
    };
  }

  // Team invitation endpoints

  @Post('invitations/:token/accept')
  @ApiOperation({ summary: 'Accept team invitation' })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation accepted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        companyId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invitation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid invitation or user',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already belongs to another company',
  })
  async acceptInvitation(@Param('token') token: string, @Request() req: any) {
    return this.companyService.acceptInvitation(token, req.user.userId);
  }

  @Post('leave')
  @ApiOperation({ summary: 'Leave current company' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully left company',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not a member of any company',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Cannot leave as only admin',
  })
  async leaveCompany(@Request() req: any) {
    return this.companyService.leaveCompany(req.user.userId);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account and leave all companies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Cannot delete account while being only admin',
  })
  async deleteAccount(@Request() req: any) {
    return this.companyService.deleteAccount(req.user.userId);
  }
}
