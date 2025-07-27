import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePortalSessionDto {
    @ApiProperty({ description: 'Device ID' })
    @IsString()
    deviceId: string;

    @ApiProperty({ description: 'Return URL', required: false })
    @IsOptional()
    @IsString()
    returnUrl?: string;
}

export class PortalSessionResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Portal session information' })
    data: {
        url: string;
    };

    @ApiProperty({ description: 'Response message', required: false })
    message?: string;
}

export class FeatureAccessDto {
    @ApiProperty({ description: 'Feature name' })
    @IsString()
    feature: string;

    @ApiProperty({ description: 'Whether device has access to feature' })
    hasAccess: boolean;

    @ApiProperty({ description: 'Whether device has active subscription' })
    hasActiveSubscription: boolean;
}

export class FeatureAccessResponseDto {
    @ApiProperty({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Feature access information' })
    data: FeatureAccessDto;

    @ApiProperty({ description: 'Response message', required: false })
    message?: string;
} 