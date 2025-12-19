import { Body, Controller, Get, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { SystemAdmin } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
    SystemConfigurationsResponseDto,
    UpdateSystemConfigurationsDto,
} from './dto/system-configurations.dto';
import { SystemConfigurationsService } from './system-configurations.service';

@ApiTags('SystemConfigurations')
@Controller('system-configurations')
export class SystemConfigurationsController {
    constructor(
        private readonly systemConfigurationsService: SystemConfigurationsService,
    ) { }

    @Get()
    @Public()
    @ApiOperation({
        summary: 'Get public system configurations',
        description:
            'Retrieve system-level storefront configuration values (app name, contact info, WhatsApp).',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'System configurations retrieved successfully',
        type: SystemConfigurationsResponseDto,
    })
    async getPublic(): Promise<SystemConfigurationsResponseDto> {
        return this.systemConfigurationsService.getPublic();
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SystemAdmin()
    @ApiOperation({
        summary: 'Update system configurations',
        description:
            'Update system-level storefront configuration values. Only system admins may update.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'System configurations updated successfully',
        type: SystemConfigurationsResponseDto,
    })
    async update(
        @Body() body: UpdateSystemConfigurationsDto,
    ): Promise<SystemConfigurationsResponseDto> {
        return this.systemConfigurationsService.update(body);
    }
}


