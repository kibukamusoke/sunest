import { Module } from '@nestjs/common';
import { S3StorageService } from './s3-storage.service';
import { StorageController } from './storage.controller';

@Module({
  providers: [S3StorageService],
  controllers: [StorageController],
  exports: [S3StorageService],
})
export class StorageModule {}