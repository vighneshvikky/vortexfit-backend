import { Controller, Post, Body } from '@nestjs/common';
import { AwsS3Service } from '../services/aws-s3.service';

@Controller('s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}
  @Post('generate-upload-url')
  generateSignedUrl(
    @Body() body: { folder: string; fileName: string; contentType: string },
  ) {
    return this.awsS3Service.generateUploadUrl(
      body.folder,
      body.fileName,
      body.contentType,
    );
  }
}
