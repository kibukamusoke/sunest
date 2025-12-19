import { SystemConfigurationsResponseDto, UpdateSystemConfigurationsDto } from './dto/system-configurations.dto';
import { SystemConfigurationsService } from './system-configurations.service';
export declare class SystemConfigurationsController {
    private readonly systemConfigurationsService;
    constructor(systemConfigurationsService: SystemConfigurationsService);
    getPublic(): Promise<SystemConfigurationsResponseDto>;
    update(body: UpdateSystemConfigurationsDto): Promise<SystemConfigurationsResponseDto>;
}
