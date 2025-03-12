import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import * as stream from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client;
  private readonly bucketName = process.env.MINIO_BUCKET_BLOG || 'blog';

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9091,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async onModuleInit() {
    await this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      }

      // Set bucket policy to public
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicRead',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );

      // Set CORS policy
      const corsPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'CORSPolicy',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(corsPolicy),
      );
    } catch (error) {
      console.error('Error initializing bucket:', error);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileStream = new stream.PassThrough();
    fileStream.end(file.buffer);

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      fileStream,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    // Return direct URL to the object
    return `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9090'}/${this.bucketName}/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
