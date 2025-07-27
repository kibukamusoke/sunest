import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    Query,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AppManagementService } from './app-management.service';
import { CreateAppDto, UpdateAppDto, AppResponseDto } from './dto/app-management.dto';

@ApiTags('app-management')
@Controller('app-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppManagementController {
    constructor(private readonly appManagementService: AppManagementService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new app' })
    @ApiBody({ type: CreateAppDto })
    @ApiResponse({
        status: 201,
        description: 'App created successfully',
        type: AppResponseDto
    })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async createApp(@Body() createAppDto: CreateAppDto, @Request() req) {
        try {
            const result = await this.appManagementService.createApp(createAppDto, req.user.userId);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to create app',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all apps' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiResponse({
        status: 200,
        description: 'Apps retrieved successfully',
        type: [AppResponseDto]
    })
    async getApps(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        try {
            const result = await this.appManagementService.getApps(
                { page, limit, search },
                req.user.userId
            );
            return {
                success: true,
                data: result.apps,
                pagination: result.pagination,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to retrieve apps',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an app by ID' })
    @ApiParam({ name: 'id', description: 'App ID' })
    @ApiResponse({
        status: 200,
        description: 'App retrieved successfully',
        type: AppResponseDto
    })
    @ApiResponse({ status: 404, description: 'App not found' })
    async getApp(@Param('id') id: string, @Request() req) {
        try {
            const result = await this.appManagementService.getApp(id, req.user.userId);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to retrieve app',
                    error: error.message,
                },
                error.message.includes('not found') ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an app' })
    @ApiParam({ name: 'id', description: 'App ID' })
    @ApiBody({ type: UpdateAppDto })
    @ApiResponse({
        status: 200,
        description: 'App updated successfully',
        type: AppResponseDto
    })
    @ApiResponse({ status: 404, description: 'App not found' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async updateApp(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto, @Request() req) {
        try {
            const result = await this.appManagementService.updateApp(id, updateAppDto, req.user.userId);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to update app',
                    error: error.message,
                },
                error.message.includes('not found') ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an app' })
    @ApiParam({ name: 'id', description: 'App ID' })
    @ApiResponse({ status: 200, description: 'App deleted successfully' })
    @ApiResponse({ status: 404, description: 'App not found' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async deleteApp(@Param('id') id: string, @Request() req) {
        try {
            await this.appManagementService.deleteApp(id, req.user.userId);
            return {
                success: true,
                message: 'App deleted successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to delete app',
                    error: error.message,
                },
                error.message.includes('not found') ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id/statistics')
    @ApiOperation({ summary: 'Get app statistics' })
    @ApiParam({ name: 'id', description: 'App ID' })
    @ApiResponse({ status: 200, description: 'App statistics retrieved successfully' })
    async getAppStatistics(@Param('id') id: string, @Request() req) {
        try {
            const result = await this.appManagementService.getAppStatistics(id, req.user.userId);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Failed to retrieve app statistics',
                    error: error.message,
                },
                error.message.includes('not found') ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 