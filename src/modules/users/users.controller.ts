import { Controller, Get, Param, UseGuards, NotFoundException, Patch, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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