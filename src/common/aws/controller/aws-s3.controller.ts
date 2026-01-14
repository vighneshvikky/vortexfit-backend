import { Controller, Post, Body, Inject } from '@nestjs/common';

import { IAwsS3Service, AWS_S3_SERVICE } from '../interface/aws-s3-service.interface';

@Controller('s3')
export class AwsS3Controller {
  constructor(@Inject(AWS_S3_SERVICE) private readonly awsS3Service: IAwsS3Service) {}
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

  @Post('generate-download-url')
  generateDownloadUrl(@Body() body: { key: string; fileName: string }) {
    return this.awsS3Service.generateDownloadUrl(body.key, body.fileName);
  }
}
