import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudflareR2Service {
  private s3: S3Client;

  constructor() {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const region = process.env.R2_REGION;
    const accountId = process.env.R2_ACCOUNT_ID;
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    if (!accessKeyId || !secretAccessKey || !region || !accountId) {
      throw new Error('Missing required Cloudflare R2 environment variables');
    }

    this.s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async generateUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 1 hour
  }

  async uploadFile(key: string, fileBuffer: Buffer, contentType: string) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`;
  }
}
