import { PrismaService } from '../../config/prisma.service';
import { SystemConfigurationsResponseDto, UpdateSystemConfigurationsDto } from './dto/system-configurations.dto';
export declare class SystemConfigurationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private parseStringArray;
    private toResponse;
    getPublic(): Promise<SystemConfigurationsResponseDto>;
    private upsertField;
    private upsertStringArrayField;
    update(dto: UpdateSystemConfigurationsDto): Promise<SystemConfigurationsResponseDto>;
}
