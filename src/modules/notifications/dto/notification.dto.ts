import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, IsBoolean, IsEnum } from 'class-validator';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export class NotificationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty({ enum: NotificationType, default: NotificationType.INFO })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class FirebaseNotificationDto extends NotificationDto {
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  tokens?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  topic?: string;
}

export class TelegramNotificationDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  useMarkdown?: boolean;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  extra?: Record<string, any>;
}

export class PhotoNotificationDto {
  @ApiProperty()
  @IsString()
  photoUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatId?: string;
}

export class DocumentNotificationDto {
  @ApiProperty()
  @IsString()
  documentUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatId?: string;
}