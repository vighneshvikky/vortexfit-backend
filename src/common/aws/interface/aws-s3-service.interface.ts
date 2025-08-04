export interface IUploadUrlResponse {
  url: string;
  key: string;
}

export interface IAwsS3Service {
  generateUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
  ): Promise<IUploadUrlResponse>;
}

export const AWS_S3_SERVICE = Symbol('AwsS3Service');
