import { PrismaService } from '../../config/prisma.service';
export declare class TemplateSeederService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    seedDefaultTemplates(): Promise<void>;
}
