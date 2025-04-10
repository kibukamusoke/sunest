import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { S3StorageService } from './s3-storage.service';
import { 
  CreatePresignedUrlDto, 
  PresignedUrlResponseDto, 
  ConfirmUploadDto,
  FileIdParamDto
} from './dto/presigned-url.dto';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly s3StorageService: S3StorageService) {}

  @Post('presigned-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a presigned URL for uploading a file to S3' })
  @ApiResponse({ 
    status: 201, 
    description: 'Returns a presigned URL for direct upload to S3',
    type: PresignedUrlResponseDto
  })
  async createPresignedUrl(
    @Body() createPresignedUrlDto: CreatePresignedUrlDto,
    @Req() req
  ) {
    return this.s3StorageService.createPresignedUploadUrl(
      createPresignedUrlDto.filename,
      createPresignedUrlDto.mimetype,
      req.user.userId
    );
  }

  @Post('confirm-upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm that a file was successfully uploaded to S3' })
  @ApiResponse({ status: 200, description: 'File upload confirmed' })
  async confirmUpload(@Body() confirmUploadDto: ConfirmUploadDto) {
    return { 
      success: await this.s3StorageService.confirmFileUpload(confirmUploadDto.fileId)
    };
  }

  @Get('download/:fileId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a presigned URL for downloading a file from S3' })
  @ApiResponse({ status: 200, description: 'Returns a presigned URL for downloading the file' })
  async getDownloadUrl(@Param() params: FileIdParamDto) {
    return this.s3StorageService.createPresignedDownloadUrl(params.fileId);
  }

  @Get('files')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all files for the current user' })
  @ApiResponse({ status: 200, description: 'Returns a list of files for the user' })
  async getUserFiles(@Req() req) {
    return this.s3StorageService.getUserFiles(req.user.userId);
  }

  @Delete(':fileId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param() params: FileIdParamDto) {
    return { 
      success: await this.s3StorageService.deleteFile(params.fileId) 
    };
  }
}