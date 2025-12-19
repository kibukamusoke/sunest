import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import {
    SystemConfigurationsResponseDto,
    UpdateSystemConfigurationsDto,
} from './dto/system-configurations.dto';

const SYSTEM_CONFIG_KEYS = {
    whatsappNumber: 'whatsapp_number',
    applicationName: 'application_name',
    phoneNumber: 'phone_number',
    emailAddress: 'email_address',
    siteUrl: 'site_url',
    address: 'address',
    businessHours: 'business_hours',
    homeBannerImages: 'home_banner_images',
    facebookUrl: 'facebook_url',
    twitterUrl: 'twitter_url',
    instagramUrl: 'instagram_url',
    linkedinUrl: 'linkedin_url',
    privacyPolicyHtml: 'privacy_policy_html',
    returnsPolicyHtml: 'returns_policy_html',
    termsAndConditionsHtml: 'terms_and_conditions_html',
} as const;

type SystemConfigField = keyof typeof SYSTEM_CONFIG_KEYS;

@Injectable()
export class SystemConfigurationsService {
    constructor(private readonly prisma: PrismaService) { }

    private parseStringArray(value: string | undefined): string[] | null {
        if (!value) return null;
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) return null;
            const cleaned = parsed
                .filter((v) => typeof v === 'string')
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
            return cleaned.length ? cleaned : [];
        } catch {
            return null;
        }
    }

    private toResponse(
        rows: { key: string; value: string }[],
    ): SystemConfigurationsResponseDto {
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
            facebookUrl: map.get(SYSTEM_CONFIG_KEYS.facebookUrl) ?? null,
            twitterUrl: map.get(SYSTEM_CONFIG_KEYS.twitterUrl) ?? null,
            instagramUrl: map.get(SYSTEM_CONFIG_KEYS.instagramUrl) ?? null,
            linkedinUrl: map.get(SYSTEM_CONFIG_KEYS.linkedinUrl) ?? null,
            privacyPolicyHtml: map.get(SYSTEM_CONFIG_KEYS.privacyPolicyHtml) ?? null,
            returnsPolicyHtml: map.get(SYSTEM_CONFIG_KEYS.returnsPolicyHtml) ?? null,
            termsAndConditionsHtml:
                map.get(SYSTEM_CONFIG_KEYS.termsAndConditionsHtml) ?? null,
        };
    }

    async getPublic(): Promise<SystemConfigurationsResponseDto> {
        const keys = Object.values(SYSTEM_CONFIG_KEYS);
        const rows = await this.prisma.systemConfiguration.findMany({
            where: { key: { in: keys } },
            select: { key: true, value: true },
        });
        return this.toResponse(rows);
    }

    private async upsertField(
        field: SystemConfigField,
        value: string | undefined,
    ): Promise<void> {
        if (value === undefined) return;

        const key = SYSTEM_CONFIG_KEYS[field];
        await this.prisma.systemConfiguration.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    private async upsertStringArrayField(
        field: SystemConfigField,
        value: string[] | undefined,
    ): Promise<void> {
        if (value === undefined) return;
        const key = SYSTEM_CONFIG_KEYS[field];
        const serialized = JSON.stringify(value);
        await this.prisma.systemConfiguration.upsert({
            where: { key },
            update: { value: serialized },
            create: { key, value: serialized },
        });
    }

    async update(
        dto: UpdateSystemConfigurationsDto,
    ): Promise<SystemConfigurationsResponseDto> {
        await Promise.all([
            this.upsertField('whatsappNumber', dto.whatsappNumber),
            this.upsertField('applicationName', dto.applicationName),
            this.upsertField('phoneNumber', dto.phoneNumber),
            this.upsertField('emailAddress', dto.emailAddress),
            this.upsertField('siteUrl', dto.siteUrl),
            this.upsertField('address', dto.address),
            this.upsertField('businessHours', dto.businessHours),
            this.upsertStringArrayField('homeBannerImages', dto.homeBannerImages),
            this.upsertField('facebookUrl', dto.facebookUrl),
            this.upsertField('twitterUrl', dto.twitterUrl),
            this.upsertField('instagramUrl', dto.instagramUrl),
            this.upsertField('linkedinUrl', dto.linkedinUrl),
            this.upsertField('privacyPolicyHtml', dto.privacyPolicyHtml),
            this.upsertField('returnsPolicyHtml', dto.returnsPolicyHtml),
            this.upsertField(
                'termsAndConditionsHtml',
                dto.termsAndConditionsHtml,
            ),
        ]);

        return this.getPublic();
    }
}


