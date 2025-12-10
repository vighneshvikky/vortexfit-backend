export interface IUploadUrlResponse {
  url: string;
  key: string;
}

export interface IDownloadUrlResponse {
  url: string;
  fileName: string;
}

export interface IAwsS3Service {
  generateUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
  ): Promise<IUploadUrlResponse>;

  
  generateDownloadUrl(
    key: string,
    fileName: string,
  ): Promise<{url: string}>;
}

export const AWS_S3_SERVICE = Symbol('AwsS3Service');
