import { Module } from '@nestjs/common';
import { SystemConfigurationsController } from './system-configurations.controller';
import { SystemConfigurationsService } from './system-configurations.service';

@Module({
    controllers: [SystemConfigurationsController],
    providers: [SystemConfigurationsService],
})
export class SystemConfigurationsModule { }


