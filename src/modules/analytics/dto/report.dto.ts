import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID, IsBoolean, IsInt, IsArray, Min, Max } from 'class-validator';
import { ReportType, ReportFormat, ReportStatus } from '@prisma/client';

export class CreateReportDto {
    @ApiProperty({ description: 'Report name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Report description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: ReportType, description: 'Report type' })
    @IsEnum(ReportType)
    type: ReportType;

    @ApiPropertyOptional({ enum: ReportFormat, description: 'Report format' })
    @IsEnum(ReportFormat)
    @IsOptional()
    format?: ReportFormat;

    @ApiPropertyOptional({ description: 'Report parameters/filters' })
    @IsObject()
    @IsOptional()
    parameters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Report template ID' })
    @IsString()
    @IsOptional()
    template?: string;

    @ApiPropertyOptional({ description: 'Email recipients', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    recipients?: string[];

    @ApiPropertyOptional({ description: 'Metric IDs to include', type: [String] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    metricIds?: string[];
}

export class UpdateReportDto {
    @ApiPropertyOptional({ description: 'Report name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Report description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ enum: ReportFormat, description: 'Report format' })
    @IsEnum(ReportFormat)
    @IsOptional()
    format?: ReportFormat;

    @ApiPropertyOptional({ description: 'Report parameters/filters' })
    @IsObject()
    @IsOptional()
    parameters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Report template ID' })
    @IsString()
    @IsOptional()
    template?: string;

    @ApiPropertyOptional({ description: 'Email recipients' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    recipients?: string[];
}

export class ReportResponseDto {
    @ApiProperty({ description: 'Report ID' })
    id: string;

    @ApiProperty({ description: 'Report name' })
    name: string;

    @ApiPropertyOptional({ description: 'Report description' })
    description?: string;

    @ApiProperty({ enum: ReportType, description: 'Report type' })
    type: ReportType;

    @ApiProperty({ enum: ReportFormat, description: 'Report format' })
    format: ReportFormat;

    @ApiProperty({ enum: ReportStatus, description: 'Report status' })
    status: ReportStatus;

    @ApiPropertyOptional({ description: 'Report parameters/filters' })
    parameters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Report template ID' })
    template?: string;

    @ApiProperty({ description: 'Is scheduled report' })
    isScheduled: boolean;

    @ApiPropertyOptional({ description: 'Cron expression for scheduling' })
    cronExpression?: string;

    @ApiPropertyOptional({ description: 'Timezone' })
    timezone?: string;

    @ApiProperty({ description: 'Created by user ID' })
    createdBy: string;

    @ApiProperty({ description: 'Email recipients' })
    recipients: string[];

    @ApiPropertyOptional({ description: 'Generated file name' })
    fileName?: string;

    @ApiPropertyOptional({ description: 'File size in bytes' })
    fileSize?: number;

    @ApiPropertyOptional({ description: 'File storage path' })
    filePath?: string;

    @ApiPropertyOptional({ description: 'Download URL' })
    downloadUrl?: string;

    @ApiPropertyOptional({ description: 'Generation started at' })
    startedAt?: Date;

    @ApiPropertyOptional({ description: 'Generation completed at' })
    completedAt?: Date;

    @ApiPropertyOptional({ description: 'Error message if failed' })
    errorMessage?: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class ReportListQueryDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ description: 'Page size' })
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number;

    @ApiPropertyOptional({ enum: ReportType, description: 'Filter by report type' })
    @IsEnum(ReportType)
    @IsOptional()
    type?: ReportType;

    @ApiPropertyOptional({ enum: ReportStatus, description: 'Filter by status' })
    @IsEnum(ReportStatus)
    @IsOptional()
    status?: ReportStatus;

    @ApiPropertyOptional({ description: 'Filter by scheduled status' })
    @IsBoolean()
    @IsOptional()
    isScheduled?: boolean;

    @ApiPropertyOptional({ description: 'Search by name' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by creator ID' })
    @IsUUID()
    @IsOptional()
    createdBy?: string;
}

export class ReportListResponseDto {
    @ApiProperty({ type: [ReportResponseDto], description: 'List of reports' })
    reports: ReportResponseDto[];

    @ApiProperty({ description: 'Total count' })
    total: number;

    @ApiProperty({ description: 'Current page' })
    page: number;

    @ApiProperty({ description: 'Page size' })
    limit: number;

    @ApiProperty({ description: 'Total pages' })
    totalPages: number;
}

export class CreateScheduleDto {
    @ApiProperty({ description: 'Report ID' })
    @IsUUID()
    reportId: string;

    @ApiProperty({ description: 'Schedule name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Cron expression' })
    @IsString()
    cronExpression: string;

    @ApiPropertyOptional({ description: 'Timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiProperty({ description: 'Email recipients', type: [String] })
    @IsArray()
    @IsString({ each: true })
    recipients: string[];

    @ApiPropertyOptional({ description: 'Email subject' })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiPropertyOptional({ description: 'Email message' })
    @IsString()
    @IsOptional()
    message?: string;
}

export class UpdateScheduleDto {
    @ApiPropertyOptional({ description: 'Schedule name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Cron expression' })
    @IsString()
    @IsOptional()
    cronExpression?: string;

    @ApiPropertyOptional({ description: 'Timezone' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ description: 'Is active' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Email recipients' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    recipients?: string[];

    @ApiPropertyOptional({ description: 'Email subject' })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiPropertyOptional({ description: 'Email message' })
    @IsString()
    @IsOptional()
    message?: string;
}

export class ScheduleResponseDto {
    @ApiProperty({ description: 'Schedule ID' })
    id: string;

    @ApiProperty({ description: 'Report ID' })
    reportId: string;

    @ApiProperty({ description: 'Schedule name' })
    name: string;

    @ApiProperty({ description: 'Cron expression' })
    cronExpression: string;

    @ApiProperty({ description: 'Timezone' })
    timezone: string;

    @ApiProperty({ description: 'Is active' })
    isActive: boolean;

    @ApiProperty({ description: 'Email recipients' })
    recipients: string[];

    @ApiPropertyOptional({ description: 'Email subject' })
    subject?: string;

    @ApiPropertyOptional({ description: 'Email message' })
    message?: string;

    @ApiPropertyOptional({ description: 'Last run timestamp' })
    lastRun?: Date;

    @ApiPropertyOptional({ description: 'Next run timestamp' })
    nextRun?: Date;

    @ApiProperty({ description: 'Run count' })
    runCount: number;

    @ApiProperty({ description: 'Failure count' })
    failureCount: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Update timestamp' })
    updatedAt: Date;
}

export class GenerateReportDto {
    @ApiProperty({ description: 'Report ID' })
    @IsUUID()
    reportId: string;

    @ApiPropertyOptional({ description: 'Override parameters' })
    @IsObject()
    @IsOptional()
    parameters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Send to additional recipients' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    additionalRecipients?: string[];
}

export class ReportGenerationResponseDto {
    @ApiProperty({ description: 'Generation job ID' })
    jobId: string;

    @ApiProperty({ description: 'Report ID' })
    reportId: string;

    @ApiProperty({ description: 'Estimated completion time' })
    estimatedCompletion: Date;

    @ApiProperty({ description: 'Status check URL' })
    statusUrl: string;
}
