import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import * as stream from 'stream';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private readonly bucketName = process.env.MINIO_BUCKET || 'sound';

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9001,
      useSSL: process.env.MINIO_USE_SSL === 'true', // Convert string to boolean
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    this.createBucketIfNotExists();
  }

  private async createBucketIfNotExists() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
    }
  }

  /**
   * Uploads a file to MinIO and returns its public URL.
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    // Convert file buffer to stream
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

    return `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9001'}/${this.bucketName}/${fileName}`;
  }

  /**
   * Deletes a file from MinIO.
   */
  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
