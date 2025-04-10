import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePresignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mimetype: string;
}

export class PresignedUrlResponseDto {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  presignedUrl: string;

  @ApiProperty()
  expiresIn: number;
}

export class ConfirmUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileId: string;
}

export class FileIdParamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileId: string;
}