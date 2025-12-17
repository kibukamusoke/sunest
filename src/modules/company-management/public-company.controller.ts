import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@ApiTags('Public Company Management')
@Controller('public/companies')
export class PublicCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('invitations/:token')
  @ApiOperation({
    summary:
      'Get invitation details by token (for join page) - Public endpoint',
  })
  @ApiParam({ name: 'token', description: 'Invitation token', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        message: { type: 'string' },
        company: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            displayName: { type: 'string' },
            logoUrl: { type: 'string' },
          },
        },
        invitedBy: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            email: { type: 'string' },
          },
        },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invitation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invitation expired or already processed',
  })
  async getInvitationByToken(@Param('token') token: string) {
    return this.companyService.getInvitationByToken(token);
  }
}
