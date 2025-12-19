import { ReportType, ReportFormat, ReportStatus } from '@prisma/client';
export declare class CreateReportDto {
    name: string;
    description?: string;
    type: ReportType;
    format?: ReportFormat;
    parameters?: Record<string, any>;
    template?: string;
    recipients?: string[];
    metricIds?: string[];
}
export declare class UpdateReportDto {
    name?: string;
    description?: string;
    format?: ReportFormat;
    parameters?: Record<string, any>;
    template?: string;
    recipients?: string[];
}
export declare class ReportResponseDto {
    id: string;
    name: string;
    description?: string;
    type: ReportType;
    format: ReportFormat;
    status: ReportStatus;
    parameters?: Record<string, any>;
    template?: string;
    isScheduled: boolean;
    cronExpression?: string;
    timezone?: string;
    createdBy: string;
    recipients: string[];
    fileName?: string;
    fileSize?: number;
    filePath?: string;
    downloadUrl?: string;
    startedAt?: Date;
    completedAt?: Date;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ReportListQueryDto {
    page?: number;
    limit?: number;
    type?: ReportType;
    status?: ReportStatus;
    isScheduled?: boolean;
    search?: string;
    createdBy?: string;
}
export declare class ReportListResponseDto {
    reports: ReportResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class CreateScheduleDto {
    reportId: string;
    name: string;
    cronExpression: string;
    timezone?: string;
    recipients: string[];
    subject?: string;
    message?: string;
}
export declare class UpdateScheduleDto {
    name?: string;
    cronExpression?: string;
    timezone?: string;
    isActive?: boolean;
    recipients?: string[];
    subject?: string;
    message?: string;
}
export declare class ScheduleResponseDto {
    id: string;
    reportId: string;
    name: string;
    cronExpression: string;
    timezone: string;
    isActive: boolean;
    recipients: string[];
    subject?: string;
    message?: string;
    lastRun?: Date;
    nextRun?: Date;
    runCount: number;
    failureCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GenerateReportDto {
    reportId: string;
    parameters?: Record<string, any>;
    additionalRecipients?: string[];
}
export declare class ReportGenerationResponseDto {
    jobId: string;
    reportId: string;
    estimatedCompletion: Date;
    statusUrl: string;
}
