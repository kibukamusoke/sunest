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
} as const;

type SystemConfigField = keyof typeof SYSTEM_CONFIG_KEYS;

@Injectable()
export class SystemConfigurationsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(
    rows: { key: string; value: string }[],
  ): SystemConfigurationsResponseDto {
    const map = new Map(rows.map((r) => [r.key, r.value]));

    return {
      whatsappNumber: map.get(SYSTEM_CONFIG_KEYS.whatsappNumber) ?? null,
      applicationName: map.get(SYSTEM_CONFIG_KEYS.applicationName) ?? null,
      phoneNumber: map.get(SYSTEM_CONFIG_KEYS.phoneNumber) ?? null,
      emailAddress: map.get(SYSTEM_CONFIG_KEYS.emailAddress) ?? null,
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

  async update(
    dto: UpdateSystemConfigurationsDto,
  ): Promise<SystemConfigurationsResponseDto> {
    await Promise.all([
      this.upsertField('whatsappNumber', dto.whatsappNumber),
      this.upsertField('applicationName', dto.applicationName),
      this.upsertField('phoneNumber', dto.phoneNumber),
      this.upsertField('emailAddress', dto.emailAddress),
    ]);

    return this.getPublic();
  }
}


