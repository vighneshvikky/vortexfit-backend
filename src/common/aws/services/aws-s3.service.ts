import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IAwsS3Service } from '../interface/aws-s3-service.interface';

@Injectable()
export class AwsS3Service implements IAwsS3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  async generateUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
  ) {
    const key = `${folder}/${uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    return { url, key };
  }
}
