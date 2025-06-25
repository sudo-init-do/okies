import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: S3;
  private bucket: string;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: process.env.R2_REGION || 'auto',
      signatureVersion: 'v4',
    });

    this.bucket = process.env.R2_BUCKET!;
  }

  async generateUploadUrl(
    fileKey: string,
    contentType: string,
  ): Promise<string> {
    try {
      const params = {
        Bucket: this.bucket,
        Key: fileKey,
        ContentType: contentType,
        Expires: 60 * 5, // 5 minutes
      };

      return await this.s3.getSignedUrlPromise('putObject', params);
    } catch (error) {
      console.error('❌ Failed to generate upload URL:', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }

  generatePublicUrl(fileKey: string): string {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${this.bucket}/${fileKey}`;
  }
}
