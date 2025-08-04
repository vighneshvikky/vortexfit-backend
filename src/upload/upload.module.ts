import { Module } from '@nestjs/common';
import { AwsS3Service } from 'src/common/aws/services/aws-s3.service';

@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class UploadModule {}
