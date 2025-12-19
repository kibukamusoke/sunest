"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigurationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const SYSTEM_CONFIG_KEYS = {
    whatsappNumber: 'whatsapp_number',
    applicationName: 'application_name',
    phoneNumber: 'phone_number',
    emailAddress: 'email_address',
    siteUrl: 'site_url',
    address: 'address',
    businessHours: 'business_hours',
    homeBannerImages: 'home_banner_images',
};
let SystemConfigurationsService = class SystemConfigurationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseStringArray(value) {
        if (!value)
            return null;
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed))
                return null;
            const cleaned = parsed
                .filter((v) => typeof v === 'string')
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
            return cleaned.length ? cleaned : [];
        }
        catch {
            return null;
        }
    }
    toResponse(rows) {
        const map = new Map(rows.map((r) => [r.key, r.value]));
        const bannerImagesRaw = map.get(SYSTEM_CONFIG_KEYS.homeBannerImages) ?? undefined;
        const bannerImages = this.parseStringArray(bannerImagesRaw);
        return {
            whatsappNumber: map.get(SYSTEM_CONFIG_KEYS.whatsappNumber) ?? null,
            applicationName: map.get(SYSTEM_CONFIG_KEYS.applicationName) ?? null,
            phoneNumber: map.get(SYSTEM_CONFIG_KEYS.phoneNumber) ?? null,
            emailAddress: map.get(SYSTEM_CONFIG_KEYS.emailAddress) ?? null,
            siteUrl: map.get(SYSTEM_CONFIG_KEYS.siteUrl) ?? null,
            address: map.get(SYSTEM_CONFIG_KEYS.address) ?? null,
            businessHours: map.get(SYSTEM_CONFIG_KEYS.businessHours) ?? null,
            homeBannerImages: bannerImages ?? null,
        };
    }
    async getPublic() {
        const keys = Object.values(SYSTEM_CONFIG_KEYS);
        const rows = await this.prisma.systemConfiguration.findMany({
            where: { key: { in: keys } },
            select: { key: true, value: true },
        });
        return this.toResponse(rows);
    }
    async upsertField(field, value) {
        if (value === undefined)
            return;
        const key = SYSTEM_CONFIG_KEYS[field];
        await this.prisma.systemConfiguration.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    async upsertStringArrayField(field, value) {
        if (value === undefined)
            return;
        const key = SYSTEM_CONFIG_KEYS[field];
        const serialized = JSON.stringify(value);
        await this.prisma.systemConfiguration.upsert({
            where: { key },
            update: { value: serialized },
            create: { key, value: serialized },
        });
    }
    async update(dto) {
        await Promise.all([
            this.upsertField('whatsappNumber', dto.whatsappNumber),
            this.upsertField('applicationName', dto.applicationName),
            this.upsertField('phoneNumber', dto.phoneNumber),
            this.upsertField('emailAddress', dto.emailAddress),
            this.upsertField('siteUrl', dto.siteUrl),
            this.upsertField('address', dto.address),
            this.upsertField('businessHours', dto.businessHours),
            this.upsertStringArrayField('homeBannerImages', dto.homeBannerImages),
        ]);
        return this.getPublic();
    }
};
exports.SystemConfigurationsService = SystemConfigurationsService;
exports.SystemConfigurationsService = SystemConfigurationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemConfigurationsService);
//# sourceMappingURL=system-configurations.service.js.map