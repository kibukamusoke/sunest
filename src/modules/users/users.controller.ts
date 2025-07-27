import { Controller, Get, Param, UseGuards, NotFoundException, Patch, Body, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for email or name' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by user status (active/inactive)' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by user role (admin/user)' })
  @ApiQuery({ name: 'appId', required: false, description: 'Filter by app ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated users list',
    schema: {
      type: 'object',
      properties: {
        users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        pages: { type: 'number' }
      }
    }
  })
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
    @Query('appId') appId?: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    return this.usersService.getAllUsers({
      page: pageNum,
      limit: limitNum,
      search,
      status,
      role,
      appId,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns user information',
    type: User
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id/roles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user roles (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of role names'
        }
      },
      required: ['roles']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User roles updated successfully',
    type: User
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserRoles(
    @Param('id') userId: string,
    @Body() body: { roles: string[] },
    @Req() req
  ): Promise<User> {
    // Check if current user is admin
    const currentUser = await this.usersService.findById(req.user.userId);
    if (!currentUser || !currentUser.roles.includes('admin')) {
      throw new HttpException('Admin access required', HttpStatus.FORBIDDEN);
    }

    return this.usersService.updateUserRoles(userId, body.roles);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'User profile data to update'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: User
  })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }
}