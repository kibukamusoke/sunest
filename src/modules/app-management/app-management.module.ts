import { Module } from '@nestjs/common';
import { AppManagementController } from './app-management.controller';
import { AppManagementService } from './app-management.service';
import { DatabaseModule } from '../../config/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AppManagementController],
    providers: [AppManagementService],
    exports: [AppManagementService]
})
export class AppManagementModule { } 